import dbConnect from '../../../lib/mongodb';
import Post from '../../../models/Post';
import { getSession } from '../../../utils/session';
import { processBlogForSaving } from '../../../utils/blogProcessor';
import cookie from 'cookie';

export default async function handler(req, res)
{
    // Only allow POST requests
    if (req.method !== 'POST')
    {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try
    {
        // Parse cookies if not already parsed
        if (req.cookies === undefined)
        {
            req.cookies = cookie.parse(req.headers.cookie || '');
        }

        // Check authentication
        const session = await getSession(req);
        if (!session || !session.user || !session.user.isAdmin)
        {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        // Get blog data from request
        const blogData = req.body;

        // Validate required fields
        if (!blogData.title || !blogData.content)
        {
            return res.status(400).json({ error: 'Title and content are required' });
        }

        // Process the blog content (process any remaining images if needed)
        // This is a safeguard in case client-side processing missed any images
        const processedBlog = await processBlogForSaving(blogData);

        // Connect to the database
        await dbConnect();

        // Prepare blog data for saving
        const blogToSave = {
            title: processedBlog.title,
            content: processedBlog.content,
            description: processedBlog.description || '',
            tags: processedBlog.tags || [],
            author: session.user.username,
            createdAt: new Date(),
            updatedAt: new Date(),
            // Generate a URL-friendly slug from the title
            slug: processedBlog.title
                .toLowerCase()
                .replace(/[^\w\s]/gi, '')
                .replace(/\s+/g, '-'),
        };

        // Create a new Post document
        const newPost = new Post(blogToSave);

        // Save the post to the database
        const savedPost = await newPost.save();

        // Return success response with the saved blog
        res.status(201).json({
            success: true,
            blog: savedPost
        });

    } catch (error)
    {
        console.error('Error creating blog:', error);
        res.status(500).json({ error: 'Failed to create blog' });
    }
}
