import { processImagesInContent } from './imageProcessor';

/**
 * Processes a blog's content before saving to database
 * - Uploads any embedded images to S3
 * - Replaces data URIs with S3 URLs
 * 
 * @param {Object} blog - The blog object with content
 * @returns {Promise<Object>} - The processed blog object
 */
export async function processBlogForSaving(blog)
{
    try
    {
        // Make a copy of the blog object
        const processedBlog = { ...blog };

        // If the blog has content with embedded images
        if (processedBlog.content)
        {
            // Process any images in the content - upload to S3 and replace URLs
            processedBlog.content = await processImagesInContent(processedBlog.content);
        }

        return processedBlog;
    } catch (error)
    {
        console.error('Error processing blog for saving:', error);
        throw error;
    }
}

/**
 * Example usage in an API route that saves a blog post:
 * 
 * // In pages/api/blog/create.js
 * import { processBlogForSaving } from '../../../utils/blogProcessor';
 * 
 * export default async function handler(req, res) {
 *   if (req.method !== 'POST') {
 *     return res.status(405).json({ error: 'Method not allowed' });
 *   }
 *   
 *   try {
 *     // Get blog data from request
 *     const blogData = req.body;
 *     
 *     // Process the blog (upload images, etc.)
 *     const processedBlog = await processBlogForSaving(blogData);
 *     
 *     // Save the processed blog to your database
 *     // const savedBlog = await saveBlogToDatabase(processedBlog);
 *     
 *     res.status(200).json({ success: true, blog: processedBlog });
 *   } catch (error) {
 *     console.error('Error creating blog post:', error);
 *     res.status(500).json({ error: 'Failed to create blog post' });
 *   }
 * }
 */ 