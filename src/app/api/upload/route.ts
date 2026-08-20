import { NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json({ error: 'No file received.' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Get the file extension
    const originalName = file.name;
    const extension = path.extname(originalName);
    
    // Generate unique filename
    const filename = `${uuidv4()}${extension}`;
    
    // Save to public/uploads directory
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    const filepath = path.join(uploadDir, filename);
    
    await writeFile(filepath, buffer);
    
    // Return absolute URL pointing to this admin server (assuming port 5000 for admin)
    const url = `http://localhost:5000/uploads/${filename}`;
    
    return NextResponse.json({ url });
  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json({ error: 'Failed to upload file.' }, { status: 500 });
  }
}
