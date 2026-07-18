# sorry, sincerely

A small Next.js + Firebase + Razorpay micro-SaaS for creating private apology pages that expire after 15 days.

## Run locally

1. Copy `.env.example` to `.env.local` and fill in Firebase, Cloudinary, Razorpay, and Firebase Admin values.
2. Create a Cloudinary unsigned upload preset matching `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET`.
3. Install dependencies and run `npm run dev`.
4. Deploy `firestore.rules` with the Firebase CLI before production use.

The public recipient route reads through Firebase Admin so creator/payment fields are never exposed to the browser. Razorpay verification is performed server-side with the webhook signature formula.
