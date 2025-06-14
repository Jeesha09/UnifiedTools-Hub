import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Path to your temp_files.json
const TEMP_FILES_PATH = path.join(process.cwd(), 'public', 'results', 'temp_files.json');

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    const fileId = params.id;

    try {
        // Read the temp_files.json to get file information
        const tempFilesData = JSON.parse(fs.readFileSync(TEMP_FILES_PATH, 'utf-8'));

        if (!tempFilesData.files || !tempFilesData.files[fileId]) {
            return NextResponse.json(
                { error: 'File not found or expired' },
                { status: 404 }
            );
        }

        const fileInfo = tempFilesData.files[fileId];
        const filePath = fileInfo.path;

        // Check if the file exists
        if (!fs.existsSync(filePath)) {
            return NextResponse.json(
                { error: 'File not found on server' },
                { status: 404 }
            );
        }

        // Check if file has expired
        const now = Date.now() / 1000; // Current time in seconds
        if (fileInfo.expires < now) {
            return NextResponse.json(
                { error: 'File has expired' },
                { status: 410 } // Gone
            );
        }

        // Check access limit
        if (fileInfo.access_limit > 0 && fileInfo.access_count >= fileInfo.access_limit) {
            return NextResponse.json(
                { error: 'Access limit exceeded' },
                { status: 403 } // Forbidden
            );
        }

        // Read the file
        const fileBuffer = fs.readFileSync(filePath);

        // Update access count
        fileInfo.access_count += 1;
        fs.writeFileSync(TEMP_FILES_PATH, JSON.stringify(tempFilesData));

        // Determine content type based on file extension
        const ext = path.extname(filePath).toLowerCase();
        let contentType = 'application/octet-stream'; // Default

        // Map common extensions to MIME types
        const mimeTypes: Record<string, string> = {
            '.txt': 'text/plain',
            '.pdf': 'application/pdf',
            '.png': 'image/png',
            '.jpg': 'image/jpeg',
            '.jpeg': 'image/jpeg',
            '.gif': 'image/gif',
            '.mp4': 'video/mp4',
        };

        if (mimeTypes[ext]) {
            contentType = mimeTypes[ext];
        }

        // Return the file
        return new NextResponse(fileBuffer, {
            headers: {
                'Content-Type': contentType,
                'Content-Disposition': `inline; filename="${fileInfo.original_name}"`,
            },
        });

    } catch (error) {
        console.error('Error retrieving file:', error);
        return NextResponse.json(
            { error: 'An error occurred while retrieving the file' },
            { status: 500 }
        );
    }
}