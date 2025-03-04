import dbConnect from '../../../lib/mongodb';
import Post from '../../../models/Post';

export default async function handler(req, res)
{
    if (req.method !== 'GET')
    {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try
    {
        await dbConnect();

        const posts = await Post.find()
            .sort({ createdAt: -1 })
            .limit(10)
            .select('-content');

        res.status(200).json(posts);
    } catch (error)
    {
        console.error('Error fetching recent posts:', error);
        res.status(500).json({ message: error.message });
    }
}