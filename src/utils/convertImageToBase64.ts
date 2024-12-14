import fs from 'fs';
import path from 'path';

export function convertImageToBase64(imagePath: string): string | null {
    try {
        // Ensure the image path exists
        if (!fs.existsSync(imagePath)) {
            throw new Error(`Image not found: ${imagePath}`);
        }

        // Read the image file
        const imageBuffer = fs.readFileSync(imagePath);

        // Determine the image MIME type based on file extension
        const ext = path.extname(imagePath).toLowerCase().slice(1);
        const mimeType: Record<string, string> = {
            'png': 'image/png',
            'jpg': 'image/jpeg',
            'jpeg': 'image/jpeg',
            'gif': 'image/gif',
            'bmp': 'image/bmp',
            'webp': 'image/webp'
        };

        const mime = mimeType[ext] || 'image/png'; // default to png if unknown

        // Convert to base64
        const base64Image = `data:${mime};base64,${imageBuffer.toString('base64')}`;

        return base64Image;
    } catch (error) {
        console.error('Error converting image to base64:', error);
        return null;
    }
}
