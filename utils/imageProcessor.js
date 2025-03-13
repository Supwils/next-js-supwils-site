/**
 * Utility functions for processing images in blog content
 */

/**
 * Extracts image data URIs from HTML content
 * @param {string} htmlContent - The HTML content containing image data URIs
 * @returns {Array} - Array of objects with imgTag and dataUri
 */
export function extractImageDataUris(htmlContent)
{
    const imgRegex = /<img[^>]+src="(data:image\/[^;]+;base64,[^"]+)"[^>]*>/g;
    const images = [];
    let match;

    while ((match = imgRegex.exec(htmlContent)) !== null)
    {
        const imgTag = match[0];
        const dataUri = match[1];
        images.push({ imgTag, dataUri });
    }

    return images;
}

/**
 * Uploads an image to S3 via the upload-image API
 * @param {string} dataUri - The data URI of the image
 * @returns {Promise<string>} - The URL of the uploaded image
 */
export async function uploadImageToS3(dataUri)
{
    try
    {
        // Get the upload URL from our API
        const response = await fetch('/api/blog/upload-image');
        const { uploadURL, imageUrl } = await response.json();

        // Extract the base64 data from the data URI
        const base64Data = dataUri.split(',')[1];
        const binaryData = atob(base64Data);

        // Convert to binary data
        const byteArray = new Uint8Array(binaryData.length);
        for (let i = 0; i < binaryData.length; i++)
        {
            byteArray[i] = binaryData.charCodeAt(i);
        }

        const blob = new Blob([byteArray], {
            type: dataUri.split(';')[0].split(':')[1]
        });

        // Upload to S3 using the pre-signed URL
        await fetch(uploadURL, {
            method: 'PUT',
            body: blob,
            headers: {
                'Content-Type': blob.type,
            },
        });

        return imageUrl;
    } catch (error)
    {
        console.error('Error uploading image:', error);
        throw error;
    }
}

/**
 * Processes all images in HTML content, uploads them to S3, and replaces data URIs with S3 URLs
 * @param {string} htmlContent - The HTML content with data URIs
 * @returns {Promise<string>} - The HTML content with S3 URLs
 */
export async function processImagesInContent(htmlContent)
{
    try
    {
        const images = extractImageDataUris(htmlContent);
        let processedContent = htmlContent;

        // Process each image sequentially
        for (const { imgTag, dataUri } of images)
        {
            const s3Url = await uploadImageToS3(dataUri);

            // Replace the data URI with the S3 URL in the img tag
            const updatedImgTag = imgTag.replace(dataUri, s3Url);
            processedContent = processedContent.replace(imgTag, updatedImgTag);
        }

        return processedContent;
    } catch (error)
    {
        console.error('Error processing images in content:', error);
        throw error;
    }
} 