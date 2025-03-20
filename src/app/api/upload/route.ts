// import { v2 as cloudinary } from 'cloudinary';
// import { NextResponse } from 'next/server';
// import * as dotenv from "dotenv";

// dotenv.config();

// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
// });

// export async function POST(request: Request) {
//   const { file } = await request.json();
  
//   try {
//     const result = await cloudinary.uploader.upload(file, {
//       upload_preset: process.env.CLOUDINARY_UPLOAD_PRESET,
//     });
//     return NextResponse.json({ url: result.secure_url });
//   } catch (error) {
//     return NextResponse.json(
//       { error: 'Upload failed' },
//       { status: 500 }
//     );
//   }
// }


import { v2 as cloudinary } from "cloudinary";
import { NextResponse } from "next/server";
import * as dotenv from "dotenv";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request: Request) {
  try {
    // Parse FormData
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // Convert ReadableStream<Uint8Array> to Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload directly to Cloudinary
    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        { upload_preset: process.env.CLOUDINARY_UPLOAD_PRESET },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      ).end(buffer);
    });

    return NextResponse.json({ url: (result as any).secure_url });
  } catch (error) {
    console.error("Upload failed:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}


