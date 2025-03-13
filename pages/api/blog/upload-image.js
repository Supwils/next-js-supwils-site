import aws from 'aws-sdk';
import crypto from 'crypto';
import { promisify } from 'util';

const randomBytes = promisify(crypto.randomBytes);

// AWS S3 configuration
const REGION = process.env.AWS_REGION;
const BUCKET_NAME = process.env.AWS_BUCKET_NAME;
const ACCESS_KEY = process.env.AWS_ACCESS_KEY_ID;
const SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY;

const s3 = new aws.S3({
    accessKeyId: ACCESS_KEY,
    secretAccessKey: SECRET_ACCESS_KEY,
    region: REGION,
    signatureVersion: 'v4'
});

async function generateUploadURL()
{
    const rawBytes = await randomBytes(16);
    const imageName = rawBytes.toString('hex');
    const params = {
        Bucket: BUCKET_NAME,
        Key: imageName,
        Expires: 60
    };

    const uploadURL = await s3.getSignedUrlPromise('putObject', params);
    return {
        uploadURL,
        imageUrl: `https://${BUCKET_NAME}.s3.${REGION}.amazonaws.com/${imageName}`
    };
}

// Function to directly upload a base64 image to S3
async function uploadBase64Image(dataUri)
{
    // Generate a random filename
    const rawBytes = await randomBytes(16);
    const imageName = rawBytes.toString('hex');

    // Get the MIME type and base64 data
    const matches = dataUri.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);

    if (!matches || matches.length !== 3)
    {
        throw new Error('Invalid data URI format');
    }

    const type = matches[1];
    const buffer = Buffer.from(matches[2], 'base64');

    // Upload to S3
    const params = {
        Bucket: BUCKET_NAME,
        Key: imageName,
        Body: buffer,
        ContentType: type,
        ACL: 'public-read'
    };

    await s3.upload(params).promise();

    return `https://${BUCKET_NAME}.s3.${REGION}.amazonaws.com/${imageName}`;
}

export default async function handler(req, res)
{
    // For generating pre-signed URL (GET request)
    if (req.method === 'GET')
    {
        try
        {
            const { uploadURL, imageUrl } = await generateUploadURL();

            res.status(200).json({
                uploadURL,
                imageUrl
            });
        } catch (error)
        {
            console.error('Error generating upload URL:', error);
            res.status(500).json({ error: 'Failed to generate upload URL' });
        }
        return;
    }

    // For direct image upload (POST request with image data)
    if (req.method === 'POST')
    {
        try
        {
            const { imageData } = req.body;

            if (!imageData)
            {
                return res.status(400).json({ error: 'Image data is required' });
            }

            const imageUrl = await uploadBase64Image(imageData);

            res.status(200).json({
                success: true,
                imageUrl
            });
        } catch (error)
        {
            console.error('Error uploading image:', error);
            res.status(500).json({ error: 'Failed to upload image' });
        }
        return;
    }

    // Method not allowed
    return res.status(405).json({ error: 'Method not allowed' });
}
