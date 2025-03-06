import jwt from 'jsonwebtoken';
import { serialize } from 'cookie';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'; // Use environment variable in production!

export default function handler(req, res)
{
    // Only allow POST requests for authentication
    if (req.method !== 'POST')
    {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try
    {
        const { username, password } = req.body;

        // Authentication logic
        if (username === 'supwils' && password === '1234')
        {
            // Generate JWT token
            const token = jwt.sign(
                { username, role: 'admin' },
                JWT_SECRET,
                { expiresIn: '2h' } // Token expires in 2 hours
            );

            // Set HTTP-only cookie
            res.setHeader('Set-Cookie', serialize('authToken', token, {
                httpOnly: true,          // JavaScript cannot access
                secure: process.env.NODE_ENV === 'production', // HTTPS only in production
                sameSite: 'strict',      // Prevents CSRF
                maxAge: 7200,            // 2 hours in seconds
                path: '/',               // Available across the site
            }));

            return res.status(200).json({
                success: true,
                message: 'Authentication successful'
            });
        } else
        {
            // Authentication failed
            return res.status(401).json({
                success: false,
                message: 'Invalid username or password'
            });
        }
    } catch (error)
    {
        console.error('Authentication error:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
}
