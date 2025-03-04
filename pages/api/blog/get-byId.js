import dbConnect from '../../../lib/mongodb';
import Post from '../../../models/Post';

export default async function handler(req, res)
{
    // Only allow GET requests
    if (req.method !== 'GET')
    {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    // Get the ID from query parameters
    const { id } = req.query;

    // Check if ID was provided
    if (!id)
    {
        return res.status(400).json({ message: 'Blog ID is required' });
    }

    try
    {
        // Connect to the database
        await dbConnect();

        // Find the blog post by ID
        const blog = await Post.findById(id);

        // If no blog post is found, return 404
        if (!blog)
        {
            return res.status(404).json({ message: 'Blog not found' });
        }

        // Return the blog post
        res.status(200).json(blog);
    } catch (error)
    {
        console.error('Error fetching blog by ID:', error);
        res.status(500).json({ message: error.message });
    }
} 