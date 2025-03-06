import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export default function handler(req, res)
{
    console.log("Check-auth: Request received");
    console.log("Check-auth: Cookies received:", req.cookies);

    try
    {
        const token = req.cookies.authToken;

        if (!token)
        {
            console.log("Check-auth: No token found in cookies");
            return res.status(200).json({ isAuthenticated: false });
        }

        // Verify token
        console.log("Check-auth: Verifying token");
        const decoded = jwt.verify(token, JWT_SECRET);
        console.log("Check-auth: Token verified for user:", decoded.username);

        return res.status(200).json({
            isAuthenticated: true,
            user: { username: decoded.username, role: decoded.role }
        });
    } catch (error)
    {
        console.error('Auth check error:', error);
        return res.status(200).json({ isAuthenticated: false });
    }
} 