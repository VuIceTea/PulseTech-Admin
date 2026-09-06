import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'dfass7bhc',
  api_key: '555521466399446',
  api_secret: 'z18XFjfADtYmfj1Qc6VZToRQ7vI',
});

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json({ error: 'No file received.' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Upload to Cloudinary using a Promise
    const uploadResult = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { 
          folder: 'pulsetech',
          format: 'png' // Đảm bảo lưu thành PNG
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      uploadStream.end(buffer);
    });

    // Return the secure URL with on-the-fly background removal transformation
    const originalUrl = (uploadResult as any).secure_url;
    // Removed background removal transformation to avoid hitting Cloudinary free tier limits
    const url = originalUrl;
    
    return NextResponse.json({ url });
  } catch (error) {
    console.error('Error uploading file to Cloudinary:', error);
    return NextResponse.json({ error: 'Failed to upload file.' }, { status: 500 });
  }
}
