import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Helper function to remove background using Photoroom API
async function removeBackgroundWithPhotoroom(imageBuffer: Buffer): Promise<Buffer | null> {
  const apiKey = process.env.PHOTOROOM_API_KEY;
  if (!apiKey) return null;

  try {
    const formData = new FormData();
    const imageBytes = new Uint8Array(imageBuffer.byteLength);
    imageBytes.set(imageBuffer);
    const blob = new Blob([imageBytes], { type: 'image/png' });
    formData.append('image_file', blob);

    const res = await fetch('https://sdk.photoroom.com/v1/segment', {
      method: 'POST',
      headers: {
        'x-api-key': apiKey
      },
      body: formData
    });

    if (!res.ok) {
      console.error('Photoroom API error:', await res.text());
      return null;
    }

    const arrayBuffer = await res.arrayBuffer();
    return Buffer.from(arrayBuffer);
  } catch (error) {
    console.error('Error calling Photoroom API:', error);
    return null;
  }
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json({ error: 'No file received.' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const originalBuffer = Buffer.from(bytes);

    // 1. Upload original image to Cloudinary first
    const uploadResult = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { 
          folder: 'pulsetech',
          format: 'png'
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      uploadStream.end(originalBuffer);
    });

    const originalUrl = (uploadResult as any).secure_url;
    
    // 2. Try Cloudinary's AI Background Removal
    const cloudinaryBgRemovalUrl = originalUrl.replace('/upload/', '/upload/e_background_removal/');
    let finalUrl = originalUrl;

    try {
      // Ping the transformed URL to see if Cloudinary successfully generated it
      // (If the free tier quota is exceeded, this will return 400 Bad Request)
      const pingRes = await fetch(cloudinaryBgRemovalUrl, { method: 'HEAD' });
      
      if (pingRes.ok) {
        finalUrl = cloudinaryBgRemovalUrl;
      } else {
        console.warn('Cloudinary background removal failed or hit quota. Trying Photoroom fallback...');
        
        // 3. Fallback to Photoroom API if Cloudinary fails
        const photoroomBuffer = await removeBackgroundWithPhotoroom(originalBuffer);
        if (photoroomBuffer) {
          // Re-upload the processed image to Cloudinary
          const fallbackUploadResult = await new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
              { folder: 'pulsetech', format: 'png' },
              (error, result) => {
                if (error) reject(error);
                else resolve(result);
              }
            );
            uploadStream.end(photoroomBuffer);
          });
          
          finalUrl = (fallbackUploadResult as any).secure_url;
          console.log('Successfully used Photoroom as fallback!');
        } else {
           console.warn('Photoroom fallback failed or API key not configured. Using original image.');
        }
      }
    } catch (err) {
      console.error('Error during fallback check:', err);
    }
    
    return NextResponse.json({ url: finalUrl });
  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json({ error: 'Failed to upload file.' }, { status: 500 });
  }
}
