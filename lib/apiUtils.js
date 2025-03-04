/**
 * Utility functions for API URLs that work across all environments
 */

/**
 * Returns the base URL for the application
 * Works in development and production across different hosting platforms
 */
export function getBaseUrl() {
    // Check for environment variables in production environments
    if (process.env.NEXT_PUBLIC_API_BASE_URL) {
        return process.env.NEXT_PUBLIC_API_BASE_URL;
    }

    // For server-side rendering
    if (typeof window === 'undefined') {
        // Check different platform-specific environment variables
        const vercelUrl = process.env.VERCEL_URL;
        const herokuUrl = process.env.HEROKU_APP_NAME;
        const awsUrl = process.env.AWS_AMPLIFY_URL || process.env.AWS_DOMAIN;

        // If any platform-specific URL is available, use it
        if (vercelUrl) return `https://${vercelUrl}`;
        if (herokuUrl) return `https://${herokuUrl}.herokuapp.com`;
        if (awsUrl) return `https://${awsUrl}`;

        // Fallback for development - may not be accessible externally
        return process.env.NODE_ENV === 'production' 
            ? 'https://your-domain.com' // Replace with your default production domain
            : 'http://localhost:3000';
    }

    // For client-side rendering, use the current window location
    return window.location.origin;
}

/**
 * Returns a complete API URL for the given endpoint
 * @param {string} endpoint - API endpoint (e.g., '/api/blog/get-recent10')
 * @returns {string} - Complete API URL
 */
export function getApiUrl(endpoint) {
    const baseUrl = getBaseUrl();
    // Ensure endpoint starts with a slash and baseUrl doesn't end with one
    const normalizedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    return `${baseUrl}${normalizedEndpoint}`;
} 