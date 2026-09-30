import os

ROOT = r"c:\Users\Anchan\Pictures\data\Lovelycrafts\public"

ASSETS = {
    os.path.join(ROOT, "elements", "sticker-heart.svg"): (
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 90">'
        '<path d="M50 85 C20 60 5 45 5 28 A24 24 0 0 1 50 15 A24 24 0 0 1 95 28 C95 45 80 60 50 85Z"'
        ' fill="#f43f5e" stroke="#be123c" stroke-width="2"/>'
        '<path d="M50 78 C25 57 12 44 12 30 A17 17 0 0 1 50 18 A17 17 0 0 1 88 30 C88 44 75 57 50 78Z"'
        ' fill="#fb7185" opacity="0.5"/>'
        '</svg>'
    ),
    os.path.join(ROOT, "elements", "sticker-sparkle.svg"): (
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">'
        '<polygon points="50,5 61,35 95,35 68,57 79,91 50,70 21,91 32,57 5,35 39,35"'
        ' fill="#fbbf24" stroke="#f59e0b" stroke-width="2"/>'
        '<circle cx="50" cy="50" r="12" fill="#fef3c7" opacity="0.8"/>'
        '</svg>'
    ),
    os.path.join(ROOT, "elements", "sticker-ribbon.svg"): (
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 80">'
        '<ellipse cx="38" cy="35" rx="32" ry="18" fill="#f43f5e"/>'
        '<ellipse cx="38" cy="35" rx="22" ry="10" fill="#fb7185"/>'
        '<ellipse cx="82" cy="35" rx="32" ry="18" fill="#f43f5e"/>'
        '<ellipse cx="82" cy="35" rx="22" ry="10" fill="#fb7185"/>'
        '<ellipse cx="60" cy="35" rx="14" ry="10" fill="#e11d48"/>'
        '<path d="M46 42 Q30 68 20 72" stroke="#f43f5e" stroke-width="8" fill="none" stroke-linecap="round"/>'
        '<path d="M74 42 Q90 68 100 72" stroke="#f43f5e" stroke-width="8" fill="none" stroke-linecap="round"/>'
        '</svg>'
    ),
    os.path.join(ROOT, "elements", "sticker-envelope.svg"): (
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 80">'
        '<rect x="5" y="15" width="110" height="70" rx="8" fill="#fef3c7" stroke="#d97706" stroke-width="2.5"/>'
        '<polyline points="5,15 60,55 115,15" fill="none" stroke="#f59e0b" stroke-width="2.5"/>'
        '<line x1="5" y1="85" x2="50" y2="50" stroke="#f59e0b" stroke-width="2"/>'
        '<line x1="115" y1="85" x2="70" y2="50" stroke="#f59e0b" stroke-width="2"/>'
        '</svg>'
    ),
    os.path.join(ROOT, "elements", "sticker-shooting-star.svg"): (
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 140 60">'
        '<line x1="5" y1="55" x2="110" y2="10" stroke="#818cf8" stroke-width="3" stroke-linecap="round" opacity="0.6"/>'
        '<line x1="5" y1="55" x2="90" y2="18" stroke="#c7d2fe" stroke-width="1.5" stroke-linecap="round" opacity="0.4"/>'
        '<circle cx="115" cy="8" r="7" fill="#f1f5f9"/>'
        '<circle cx="115" cy="8" r="4" fill="#818cf8"/>'
        '<circle cx="115" cy="8" r="2" fill="white"/>'
        '<circle cx="125" cy="18" r="2" fill="#a5b4fc"/>'
        '<circle cx="105" cy="20" r="1.5" fill="#a5b4fc"/>'
        '<circle cx="130" cy="8" r="1.5" fill="#c7d2fe"/>'
        '</svg>'
    ),
    os.path.join(ROOT, "frames", "polaroid.svg"): (
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 220 260">'
        '<rect x="14" y="14" width="200" height="240" rx="5" fill="rgba(0,0,0,0.12)"/>'
        '<rect x="8" y="8" width="204" height="244" rx="5" fill="white" stroke="#e2e8f0" stroke-width="1.5"/>'
        '<rect x="20" y="20" width="180" height="178" rx="3" fill="#f8fafc"/>'
        '<rect x="80" y="0" width="60" height="14" rx="3" fill="rgba(251,191,36,0.55)"/>'
        '</svg>'
    ),
    os.path.join(ROOT, "frames", "vintage.svg"): (
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 220">'
        '<rect x="4" y="4" width="292" height="212" rx="8" fill="none" stroke="#b45309" stroke-width="4"/>'
        '<rect x="14" y="14" width="272" height="192" rx="5" fill="none" stroke="#d97706" stroke-width="1.5"/>'
        '<circle cx="20" cy="20" r="5" fill="#b45309" opacity="0.7"/>'
        '<path d="M20 8 Q8 8 8 20" fill="none" stroke="#b45309" stroke-width="2"/>'
        '<circle cx="280" cy="20" r="5" fill="#b45309" opacity="0.7"/>'
        '<path d="M280 8 Q292 8 292 20" fill="none" stroke="#b45309" stroke-width="2"/>'
        '<circle cx="20" cy="200" r="5" fill="#b45309" opacity="0.7"/>'
        '<path d="M20 212 Q8 212 8 200" fill="none" stroke="#b45309" stroke-width="2"/>'
        '<circle cx="280" cy="200" r="5" fill="#b45309" opacity="0.7"/>'
        '<path d="M280 212 Q292 212 292 200" fill="none" stroke="#b45309" stroke-width="2"/>'
        '<path d="M130 8 Q150 0 170 8" fill="none" stroke="#b45309" stroke-width="2"/>'
        '<circle cx="150" cy="4" r="4" fill="#d97706"/>'
        '<circle cx="4" cy="110" r="4" fill="#d97706"/>'
        '<circle cx="296" cy="110" r="4" fill="#d97706"/>'
        '</svg>'
    ),
    os.path.join(ROOT, "frames", "cassette.svg"): (
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 260 140">'
        '<rect x="2" y="2" width="256" height="136" rx="10" fill="#1e1b4b" stroke="#4338ca" stroke-width="2.5"/>'
        '<rect x="20" y="15" width="220" height="82" rx="6" fill="#312e81"/>'
        '<circle cx="72" cy="104" r="16" fill="#0f172a" stroke="#6366f1" stroke-width="2"/>'
        '<circle cx="72" cy="104" r="6" fill="#4338ca"/>'
        '<circle cx="188" cy="104" r="16" fill="#0f172a" stroke="#6366f1" stroke-width="2"/>'
        '<circle cx="188" cy="104" r="6" fill="#4338ca"/>'
        '<rect x="104" y="92" width="52" height="24" rx="4" fill="#0f172a" stroke="#6366f1" stroke-width="1.5"/>'
        '<circle cx="22" cy="24" r="4" fill="#4338ca"/>'
        '<circle cx="238" cy="24" r="4" fill="#4338ca"/>'
        '<circle cx="22" cy="120" r="4" fill="#4338ca"/>'
        '<circle cx="238" cy="120" r="4" fill="#4338ca"/>'
        '</svg>'
    ),
    os.path.join(ROOT, "frames", "parchment.svg"): (
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 280 380">'
        '<defs>'
        '<filter id="paper">'
        '<feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="4" result="noise"/>'
        '<feColorMatrix type="saturate" values="0" in="noise" result="grayNoise"/>'
        '<feBlend in="SourceGraphic" in2="grayNoise" mode="multiply"/>'
        '</filter>'
        '</defs>'
        '<rect x="5" y="5" width="270" height="370" rx="4" fill="#fffbeb" filter="url(#paper)" stroke="#d97706" stroke-width="1.5"/>'
        '<path d="M5 5 L50 5 L5 50 Z" fill="#fef3c7" stroke="#d97706" stroke-width="1"/>'
        '<g stroke="#fde68a" stroke-width="0.8" opacity="0.7">'
        '<line x1="30" y1="70" x2="250" y2="70"/>'
        '<line x1="30" y1="90" x2="250" y2="90"/>'
        '<line x1="30" y1="110" x2="250" y2="110"/>'
        '<line x1="30" y1="130" x2="250" y2="130"/>'
        '<line x1="30" y1="150" x2="250" y2="150"/>'
        '<line x1="30" y1="170" x2="250" y2="170"/>'
        '<line x1="30" y1="190" x2="250" y2="190"/>'
        '<line x1="30" y1="210" x2="250" y2="210"/>'
        '<line x1="30" y1="230" x2="250" y2="230"/>'
        '</g>'
        '<line x1="45" y1="20" x2="45" y2="360" stroke="#fca5a5" stroke-width="1" opacity="0.5"/>'
        '</svg>'
    ),
}

for path, content in ASSETS.items():
    os.makedirs(os.path.dirname(path), exist_ok=True)
    if os.path.exists(path):
        print(f"SKIP: {os.path.basename(path)}")
        continue
    with open(path, "w", encoding="utf-8") as f:
        f.write(content)
    print(f"WRITE: {os.path.basename(path)}")

print("\nelements/:", os.listdir(os.path.join(ROOT, "elements")))
print("frames/:", os.listdir(os.path.join(ROOT, "frames")))
