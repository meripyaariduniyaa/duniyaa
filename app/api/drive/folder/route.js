import { NextResponse } from 'next/server';

const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const API_KEY = process.env.CLOUDINARY_API_KEY;
const API_SECRET = process.env.CLOUDINARY_API_SECRET;

function basicAuth() {
  return 'Basic ' + Buffer.from(`${API_KEY}:${API_SECRET}`).toString('base64');
}

// CREATE FOLDER
export async function POST(request) {
  if (!API_KEY || !API_SECRET) {
    return NextResponse.json({ error: 'Cloudinary API credentials not configured' }, { status: 500 });
  }

  try {
    const { folder_path } = await request.json();
    if (!folder_path || !folder_path.trim()) {
      return NextResponse.json({ error: 'Folder path is required' }, { status: 400 });
    }

    const cleanPath = folder_path.trim().replace(/^\/+|\/+$/g, '');
    const endpoint = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/folders/${cleanPath.split('/').map(encodeURIComponent).join('/')}`;

    const res = await fetch(endpoint, {
      method: 'POST',
      headers: {
        Authorization: basicAuth(),
        'Content-Type': 'application/json',
      },
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      return NextResponse.json({ error: err.error?.message || 'Failed to create folder' }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ error: 'Server error: ' + err.message }, { status: 500 });
  }
}

// HELPER: Search and gather all assets in a folder using Cloudinary Search API + Admin API
async function findAndDeleteAllAssetsInFolder(folderPath) {
  const cleanPath = folderPath.trim().replace(/^\/+|\/+$/g, '');
  const folderPrefix = cleanPath.endsWith('/') ? cleanPath : `${cleanPath}/`;
  const resourceTypes = ['image', 'video', 'raw'];

  // 1. Direct Cloudinary bulk prefix deletion across all 3 resource types
  for (const rType of resourceTypes) {
    try {
      await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/resources/${rType}/upload?prefix=${encodeURIComponent(folderPrefix)}&all=true&keep_original=false`,
        {
          method: 'DELETE',
          headers: { Authorization: basicAuth() },
        }
      ).catch(() => {});
    } catch (e) {
      console.error(`Error in direct prefix delete (${rType}):`, e);
    }
  }

  // 2. Cloudinary Search API to catch all assets (including asset_folder and nested assets)
  try {
    const searchUrl = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/resources/search`;
    const searchRes = await fetch(searchUrl, {
      method: 'POST',
      headers: {
        Authorization: basicAuth(),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        expression: `folder:"${cleanPath}" OR folder:"${cleanPath}/*" OR asset_folder:"${cleanPath}" OR asset_folder:"${cleanPath}/*" OR public_id:${cleanPath}/*`,
        max_results: 500,
      }),
    });

    if (searchRes.ok) {
      const searchData = await searchRes.json();
      const resources = searchData.resources || [];

      // Group by resource_type
      const grouped = {};
      resources.forEach((r) => {
        const type = r.resource_type || 'image';
        if (!grouped[type]) grouped[type] = [];
        grouped[type].push(r.public_id);
      });

      for (const [rType, ids] of Object.entries(grouped)) {
        const BATCH_SIZE = 100;
        for (let i = 0; i < ids.length; i += BATCH_SIZE) {
          const chunk = ids.slice(i, i + BATCH_SIZE);
          await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/resources/${rType}/upload`, {
            method: 'DELETE',
            headers: {
              Authorization: basicAuth(),
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ public_ids: chunk }),
          }).catch(() => {});
        }
      }
    }
  } catch (e) {
    console.error('Error using Cloudinary search API:', e);
  }

  // 3. Fallback: Admin API resource list by prefix for each resource type
  for (const rType of resourceTypes) {
    try {
      let nextCursor = null;
      let loopCount = 0;
      do {
        let listUrl = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/resources/${rType}/upload?prefix=${encodeURIComponent(folderPrefix)}&max_results=500`;
        if (nextCursor) listUrl += `&next_cursor=${encodeURIComponent(nextCursor)}`;

        const listRes = await fetch(listUrl, {
          headers: { Authorization: basicAuth() },
        });

        if (!listRes.ok) break;

        const listData = await listRes.json();
        const items = listData.resources || [];
        nextCursor = listData.next_cursor || null;

        const publicIds = items.map((r) => r.public_id);
        if (publicIds.length > 0) {
          const BATCH_SIZE = 100;
          for (let i = 0; i < publicIds.length; i += BATCH_SIZE) {
            const chunk = publicIds.slice(i, i + BATCH_SIZE);
            await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/resources/${rType}/upload`, {
              method: 'DELETE',
              headers: {
                Authorization: basicAuth(),
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ public_ids: chunk }),
            }).catch(() => {});
          }
        }
        loopCount++;
      } while (nextCursor && loopCount < 5);
    } catch (e) {
      console.error(`Error in admin list fallback (${rType}):`, e);
    }
  }
}

// HELPER: Recursively get all subfolder paths
async function getAllSubfolderPaths(folderPath) {
  const allSubfolders = [];
  try {
    const endpoint = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/folders/${folderPath.split('/').map(encodeURIComponent).join('/')}`;
    const res = await fetch(endpoint, {
      headers: { Authorization: basicAuth() },
    });
    if (res.ok) {
      const data = await res.json();
      const subfolders = data.folders || [];
      for (const sf of subfolders) {
        allSubfolders.push(sf.path);
        const nested = await getAllSubfolderPaths(sf.path);
        allSubfolders.push(...nested);
      }
    }
  } catch (err) {
    console.error('Error fetching subfolders:', err);
  }
  return allSubfolders;
}

// DELETE FOLDER AND ITS CONTENTS
export async function DELETE(request) {
  if (!API_KEY || !API_SECRET) {
    return NextResponse.json({ error: 'Cloudinary API credentials not configured' }, { status: 500 });
  }

  try {
    const { folder_path } = await request.json();
    if (!folder_path || !folder_path.trim()) {
      return NextResponse.json({ error: 'Folder path is required' }, { status: 400 });
    }

    const cleanPath = folder_path.trim().replace(/^\/+|\/+$/g, '');

    // 1. Discover all subfolders
    const subfolders = await getAllSubfolderPaths(cleanPath);

    // 2. Delete all assets from all subfolders + the parent folder
    const allFolderPaths = [...subfolders, cleanPath];
    for (const fPath of allFolderPaths) {
      await findAndDeleteAllAssetsInFolder(fPath);
    }

    // 3. Delete subfolders starting from deepest child first
    const sortedSubfolders = [...subfolders].sort((a, b) => b.split('/').length - a.split('/').length);
    for (const sfPath of sortedSubfolders) {
      const sfEndpoint = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/folders/${sfPath.split('/').map(encodeURIComponent).join('/')}`;
      await fetch(sfEndpoint, {
        method: 'DELETE',
        headers: { Authorization: basicAuth() },
      }).catch(() => {});
    }

    // 4. Delete the target folder itself
    const endpoint = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/folders/${cleanPath.split('/').map(encodeURIComponent).join('/')}`;
    const res = await fetch(endpoint, {
      method: 'DELETE',
      headers: {
        Authorization: basicAuth(),
        'Content-Type': 'application/json',
      },
    });

    if (!res.ok && res.status !== 404) {
      // If still returns error, perform one more search & delete pass
      const err = await res.json().catch(() => ({}));
      return NextResponse.json({ 
        error: err.error?.message || 'Failed to delete folder. Cloudinary reported folder not empty. Please ensure all assets are removed.' 
      }, { status: res.status });
    }

    const data = res.status === 404 ? { deleted: true } : await res.json().catch(() => ({ deleted: true }));
    return NextResponse.json({ success: true, folder: cleanPath, ...data });
  } catch (err) {
    console.error('Delete folder error:', err);
    return NextResponse.json({ error: 'Server error: ' + err.message }, { status: 500 });
  }
}
