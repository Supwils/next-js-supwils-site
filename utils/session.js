import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

/**
 * Validates the user's session from a request object
 * @param {Object} req - The request object
 * @returns {Object|null} - The session object or null if invalid
 */
export async function getSession(req)
{
    try
    {
        const token = req.cookies?.authToken;

        if (!token)
        {
            return null;
        }

        // Verify token
        const decoded = jwt.verify(token, JWT_SECRET);

        // Return the session
        return {
            user: {
                username: decoded.username,
                role: decoded.role,
                isAdmin: decoded.role === 'admin',
            }
        };
    } catch (error)
    {
        console.error('Session verification error:', error);
        return null;
    }
} 