import { useState, useRef } from 'react';
import Head from 'next/head';

export default function TestImageUpload()
{
    const [imageUrl, setImageUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const fileInputRef = useRef(null);

    const handleFileSelect = async (event) =>
    {
        const file = event.target.files[0];
        if (!file) return;

        try
        {
            setLoading(true);
            setError(null);

            // Read the file as a data URL
            const reader = new FileReader();
            reader.onloadend = async () =>
            {
                const base64data = reader.result;
                await uploadImage(base64data);
            };
            reader.readAsDataURL(file);
        } catch (err)
        {
            console.error('Error selecting file:', err);
            setError('Error selecting file');
            setLoading(false);
        }
    };

    const uploadImage = async (imageData) =>
    {
        try
        {
            // Method 1: Using the pre-signed URL approach
            const urlResponse = await fetch('/api/blog/upload-image');
            const { uploadURL, imageUrl } = await urlResponse.json();

            // Extract MIME type from the data URL
            const contentType = imageData.split(';')[0].split(':')[1];

            // Extract and convert base64 to binary
            const base64 = imageData.split(',')[1];
            const binaryData = atob(base64);
            const array = new Uint8Array(binaryData.length);
            for (let i = 0; i < binaryData.length; i++)
            {
                array[i] = binaryData.charCodeAt(i);
            }

            // Create a blob and upload directly to S3
            const blob = new Blob([array], { type: contentType });
            await fetch(uploadURL, {
                method: 'PUT',
                body: blob,
                headers: { 'Content-Type': contentType }
            });

            setImageUrl(imageUrl);
            setLoading(false);
        } catch (err)
        {
            console.error('Error uploading image:', err);
            setError('Error uploading image');
            setLoading(false);
        }
    };

    const uploadImageDirect = async () =>
    {
        try
        {
            if (!fileInputRef.current.files[0])
            {
                alert('Please select a file first');
                return;
            }

            setLoading(true);
            setError(null);

            // Read the file as a data URL
            const reader = new FileReader();
            reader.onloadend = async () =>
            {
                const imageData = reader.result;

                // Method 2: Direct upload via POST request
                const response = await fetch('/api/blog/upload-image', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ imageData }),
                });

                const data = await response.json();

                if (data.success)
                {
                    setImageUrl(data.imageUrl);
                } else
                {
                    setError(data.error || 'Error uploading image');
                }

                setLoading(false);
            };
            reader.readAsDataURL(fileInputRef.current.files[0]);
        } catch (err)
        {
            console.error('Error uploading image directly:', err);
            setError('Error uploading image');
            setLoading(false);
        }
    };

    return (
        <div>
            <Head>
                <title>Test Image Upload to S31</title>
            </Head>

            <main style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
                <h1>Test Image Upload to S3</h1>

                <div style={{ marginBottom: '20px' }}>
                    <h2>Method 1: Pre-signed URL Upload</h2>
                    <p>This method gets a pre-signed URL first, then uploads directly to S3.</p>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileSelect}
                        disabled={loading}
                    />
                </div>

                <div style={{ marginBottom: '20px' }}>
                    <h2>Method 2: Direct Upload via API</h2>
                    <p>This method sends the image data to our API, which uploads it to S3.</p>
                    <input
                        type="file"
                        accept="image/*"
                        ref={fileInputRef}
                        disabled={loading}
                    />
                    <button
                        onClick={uploadImageDirect}
                        disabled={loading}
                        style={{ marginLeft: '10px' }}
                    >
                        Upload
                    </button>
                </div>

                {loading && <p>Uploading...</p>}
                {error && <p style={{ color: 'red' }}>{error}</p>}

                {imageUrl && (
                    <div style={{ marginTop: '20px' }}>
                        <h2>Uploaded Image</h2>
                        <img
                            src={imageUrl}
                            alt="Uploaded"
                            style={{ maxWidth: '100%', maxHeight: '400px' }}
                        />
                        <p>Image URL: <a href={imageUrl} target="_blank" rel="noopener noreferrer">{imageUrl}</a></p>
                    </div>
                )}
            </main>
        </div>
    );
} 