import { serialize } from 'cookie';

export default function handler(req, res)
{
    if (req.method !== 'POST')
    {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    // Clear the auth cookie
    res.setHeader('Set-Cookie', serialize('authToken', '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        expires: new Date(0), // Expire immediately
        sameSite: 'strict',
        path: '/',
    }));

    return res.status(200).json({ success: true });
} 