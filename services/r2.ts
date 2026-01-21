
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const r2Client = new S3Client({
    region: "auto",
    endpoint: import.meta.env.VITE_R2_ENDPOINT,
    credentials: {
        accessKeyId: import.meta.env.VITE_R2_ACCESS_KEY_ID || "",
        secretAccessKey: import.meta.env.VITE_R2_SECRET_ACCESS_KEY || "",
    },
});

export async function uploadToR2(file: File): Promise<string | null> {
    const bucketName = import.meta.env.VITE_R2_BUCKET_NAME;
    const publicUrl = import.meta.env.VITE_R2_PUBLIC_URL;

    if (!bucketName || !import.meta.env.VITE_R2_ACCESS_KEY_ID) {
        console.error("R2 credentials not configured");
        return null;
    }

    const fileName = `${Date.now()}-${file.name}`;

    try {
        const command = new PutObjectCommand({
            Bucket: bucketName,
            Key: fileName,
            Body: file,
            ContentType: file.type,
        });

        await r2Client.send(command);

        // Return the public URL
        return publicUrl ? `${publicUrl}/${fileName}` : null;
    } catch (error) {
        console.error("Error uploading to R2:", error);
        return null;
    }
}

export async function uploadMultipleToR2(files: File[]): Promise<string[]> {
    const uploadPromises = files.map(file => uploadToR2(file));
    const results = await Promise.all(uploadPromises);
    return results.filter((url): url is string => url !== null);
}
