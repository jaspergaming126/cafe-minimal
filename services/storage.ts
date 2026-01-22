import { supabase } from '../lib/supabase';

export async function uploadImage(file: File): Promise<string | null> {
    const bucketName = 'images';

    // Sanitize filename: remove special chars, replace spaces with dashes, lower case
    const cleanName = file.name
        .toLowerCase()
        .replace(/[^a-z0-9.]/g, '-') // Replace non-alphanumeric (except dot) with dash
        .replace(/-+/g, '-');        // Replace multiple dashes with single dash

    const fileName = `${Date.now()}-${cleanName}`;
    const filePath = `${fileName}`;

    try {
        const { data, error } = await supabase.storage
            .from(bucketName)
            .upload(filePath, file, {
                cacheControl: '3600',
                upsert: false
            });

        if (error) {
            console.error('Error uploading to Supabase Storage:', error);
            // Better error logging for debugging
            if (error.message.includes('Bucket not found')) {
                console.error('PROMPT: Please create a public bucket named "images" in your Supabase dashboard.');
            }
            return null;
        }

        // Get public URL
        const { data: publicUrlData } = supabase.storage
            .from(bucketName)
            .getPublicUrl(filePath);

        return publicUrlData.publicUrl;
    } catch (err) {
        console.error('Unexpected error uploading file:', err);
        return null;
    }
}

export async function uploadImages(files: File[]): Promise<string[]> {
    const uploadPromises = files.map(file => uploadImage(file));
    const results = await Promise.all(uploadPromises);
    return results.filter((url): url is string => url !== null);
}
