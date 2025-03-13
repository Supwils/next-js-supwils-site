import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import styles from './BlogAdmin.module.css';
import dynamic from 'next/dynamic';

import TestImageUpload from '../test-image-upload';
// Dynamically import BlogCreateEditor with SSR disabled
const BlogCreateEditor = dynamic(
    () => import('@/components/BlogComponents/BlogCreateEditor'),
    { ssr: false }
);

const BlogAdmin = () =>
{
    const router = useRouter();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [blogs, setBlogs] = useState([]);
    const [notification, setNotification] = useState({ show: false, message: '', type: '' });
    const [debugInfo, setDebugInfo] = useState('');
    const [newBlog, setNewBlog] = useState({
        title: '',
        description: '',
        content: '',
        tags: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Detect client-side rendering
    const [isClient, setIsClient] = useState(false);

    // State to toggle between simple editor and rich editor
    const [useRichEditor, setUseRichEditor] = useState(false);

    // Set isClient to true when component mounts (client-side only)
    useEffect(() =>
    {
        setIsClient(true);
    }, []);

    // Function to show notification
    const showNotification = (message, type = 'success') =>
    {
        setNotification({ show: true, message, type });
        // Auto-hide after 3 seconds
        setTimeout(() =>
        {
            setNotification({ show: false, message: '', type: '' });
        }, 3000);
    };

    useEffect(() =>
    {
        // Only run this effect on the client side
        if (!isClient) return;

        console.log("BlogAdmin component mounted");

        // Check if user is authenticated using the API instead of localStorage
        const checkAuth = async () =>
        {
            try
            {
                console.log("Checking authentication status...");
                setDebugInfo("Checking authentication...");

                const response = await fetch('/api/auth/check-auth', {
                    credentials: 'include', // Include cookies
                });

                const data = await response.json();
                console.log("Auth response:", data);
                setDebugInfo(prev => prev + "\nAuth response: " + JSON.stringify(data));

                if (!data.isAuthenticated)
                {
                    console.log("Not authenticated");
                    setDebugInfo(prev => prev + "\nNot authenticated");
                    setIsAuthenticated(false);
                } else
                {
                    console.log("Authentication successful");
                    setDebugInfo(prev => prev + "\nAuthenticated as: " + data.user?.username);
                    setIsAuthenticated(true);
                    fetchBlogs();
                }
            } catch (error)
            {
                console.error('Auth check error:', error);
                setDebugInfo(prev => prev + "\nAuth error: " + error.message);
                setIsAuthenticated(false);
            } finally
            {
                setIsLoading(false);
            }
        };

        checkAuth();
    }, [isClient]); // Add isClient as a dependency

    const fetchBlogs = async () =>
    {
        try
        {
            const res = await fetch('/api/blog/get-recent10');
            if (res.ok)
            {
                const data = await res.json();
                setBlogs(data);
            }
        } catch (error)
        {
            console.error('Error fetching blogs:', error);
            setDebugInfo(prev => prev + "\nFetch blogs error: " + error.message);
        }
    };

    // Process images in content before submission
    const processImagesInContent = async (rawContent) =>
    {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = rawContent;

        const imageTags = tempDiv.getElementsByTagName('img');
        const promises = [];

        for (let img of imageTags)
        {
            if (img.src.startsWith('data:'))
            {
                const base64Data = img.src;
                const file = dataURItoBlob(base64Data); // Convert base64 to Blob/File

                promises.push(
                    uploadImageToS3(file).then((url) =>
                    {
                        img.src = url; // Replace the src with the S3 URL
                    })
                );
            }
        }

        await Promise.all(promises);
        return tempDiv.innerHTML;
    };

    const uploadImageToS3 = async (blob) =>
    {
        try
        {
            // First, get a pre-signed URL
            const urlResponse = await fetch('/api/blog/upload-image');
            const { uploadURL, imageUrl } = await urlResponse.json();

            // Then upload the image directly to S3
            await fetch(uploadURL, {
                method: 'PUT',
                body: blob,
                headers: { 'Content-Type': blob.type }
            });

            return imageUrl;
        } catch (error)
        {
            console.error('Error uploading to S3:', error);
            throw error;
        }
    };

    const dataURItoBlob = (dataURI) =>
    {
        const byteString = atob(dataURI.split(',')[1]);
        const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
        const arrayBuffer = new ArrayBuffer(byteString.length);
        const uintArray = new Uint8Array(arrayBuffer);

        for (let i = 0; i < byteString.length; i++)
        {
            uintArray[i] = byteString.charCodeAt(i);
        }

        return new Blob([uintArray], { type: mimeString });
    };

    const handleInputChange = (e) =>
    {
        const { name, value } = e.target;
        setNewBlog(prev => ({ ...prev, [name]: value }));
    };

    // Handle rich editor content change
    const handleEditorContentChange = (content) =>
    {
        setNewBlog(prev => ({ ...prev, content }));
    };

    const handleBlogSubmit = async (e) =>
    {
        e.preventDefault();

        if (isSubmitting) return;

        try
        {
            setIsSubmitting(true);
            showNotification('Processing blog content...', 'info');

            // Process the blog content (upload images, etc.)
            const processedContent = await processImagesInContent(newBlog.content);

            // Format tags as an array
            const formattedBlog = {
                ...newBlog,
                content: processedContent,
                tags: newBlog.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
            };

            showNotification('Uploading blog...', 'info');

            // Submit the blog with processed content
            const res = await fetch('/api/blog/create-blog', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formattedBlog),
                credentials: 'include', // Include cookies for auth
            });

            const data = await res.json();

            if (res.ok)
            {
                // Reset form and refresh blogs
                setNewBlog({
                    title: '',
                    description: '',
                    content: '',
                    tags: ''
                });
                fetchBlogs();
                showNotification('Blog created successfully!');
                console.log('Created blog:', data.blog);
            } else
            {
                showNotification(`Failed to create blog: ${data.error || 'Unknown error'}`, 'error');
                console.error('Server response:', data);
            }
        } catch (error)
        {
            console.error('Error creating blog:', error);
            showNotification(`Error creating blog: ${error.message || 'Unknown error'}`, 'error');
        } finally
        {
            setIsSubmitting(false);
        }
    };

    const handleLogout = async () =>
    {
        try
        {
            await fetch('/api/auth/logout', {
                method: 'POST',
                credentials: 'include',
            });

            router.push('/');
        } catch (error)
        {
            console.error('Logout error:', error);
            showNotification('Logout failed', 'error');
        }
    };

    // If not client-side yet, show minimal loading state
    if (!isClient)
    {
        return <div className={styles.loading}>Loading...</div>;
    }

    if (isLoading)
    {
        return (
            <div className={styles.loading}>
                Loading...
                <div className={styles.debugInfo}>
                    {debugInfo && <pre>{debugInfo}</pre>}
                </div>
            </div>
        );
    }

    // Show unauthorized message if not authenticated
    if (!isAuthenticated)
    {
        return (
            <div className={styles.unauthorizedContainer}>
                <div className={styles.unauthorizedMessage}>
                    <h1>⚠️ Unauthorized Access</h1>
                    <p>You need to be logged in as an admin to view this page.</p>
                    <button
                        className={styles.returnButton}
                        onClick={() => router.push('/')}
                    >
                        Return to Home
                    </button>

                    {/* Debug information */}
                    <div className={styles.debugInfo}>
                        <h3>Debug Information</h3>
                        <pre>{debugInfo}</pre>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.adminContainer}>
            {/* Notification Toast */}
            {notification.show && (
                <div className={`${styles.notification} ${styles[notification.type]}`}>
                    {notification.message}
                </div>
            )}

            <div className={styles.adminHeader}>
                <h1>Blog Administration</h1>
                <button className={styles.logoutButton} onClick={handleLogout}>
                    Logout
                </button>
            </div>

            <div className={styles.adminContent}>
                <div className={styles.createBlogSection}>
                    <TestImageUpload />
                    <h2>Create New Blog</h2>

                    {/* Editor Type Toggle */}
                    <div className={styles.editorToggle}>
                        <button
                            className={`${styles.toggleButton} ${!useRichEditor ? styles.active : ''}`}
                            onClick={() => setUseRichEditor(false)}
                        >
                            Simple Editor
                        </button>
                        <button
                            className={`${styles.toggleButton} ${useRichEditor ? styles.active : ''}`}
                            onClick={() => setUseRichEditor(true)}
                        >
                            Rich Editor
                        </button>
                    </div>

                    {/* Simple HTML Editor */}
                    {!useRichEditor && (
                        <form onSubmit={handleBlogSubmit} className={styles.blogForm}>
                            <div className={styles.formGroup}>
                                <label htmlFor="title">Title</label>
                                <input
                                    type="text"
                                    id="title"
                                    name="title"
                                    value={newBlog.title}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label htmlFor="description">Description</label>
                                <input
                                    type="text"
                                    id="description"
                                    name="description"
                                    value={newBlog.description}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label htmlFor="content">Content (HTML)</label>
                                <textarea
                                    id="content"
                                    name="content"
                                    value={newBlog.content}
                                    onChange={handleInputChange}
                                    rows={10}
                                    required
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label htmlFor="tags">Tags (comma-separated)</label>
                                <input
                                    type="text"
                                    id="tags"
                                    name="tags"
                                    value={newBlog.tags}
                                    onChange={handleInputChange}
                                    placeholder="tech, programming, web"
                                />
                            </div>

                            <button
                                type="submit"
                                className={styles.submitButton}
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? 'Creating...' : 'Create Blog'}
                            </button>
                        </form>
                    )}

                    {/* Rich Text Editor */}
                    {isClient && useRichEditor && (
                        <div className={styles.richEditorSection}>
                            <form onSubmit={handleBlogSubmit} className={styles.blogForm}>
                                <div className={styles.formGroup}>
                                    <label htmlFor="title">Title</label>
                                    <input
                                        type="text"
                                        id="title"
                                        name="title"
                                        value={newBlog.title}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>

                                <div className={styles.formGroup}>
                                    <label htmlFor="description">Description</label>
                                    <input
                                        type="text"
                                        id="description"
                                        name="description"
                                        value={newBlog.description}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>

                                <div className={styles.formGroup}>
                                    <label>Content</label>
                                    <BlogCreateEditor
                                        value={newBlog.content}
                                        onChange={handleEditorContentChange}
                                    />
                                </div>

                                <div className={styles.formGroup}>
                                    <label htmlFor="tags">Tags (comma-separated)</label>
                                    <input
                                        type="text"
                                        id="tags"
                                        name="tags"
                                        value={newBlog.tags}
                                        onChange={handleInputChange}
                                        placeholder="tech, programming, web"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className={styles.submitButton}
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? 'Creating...' : 'Create Blog'}
                                </button>
                            </form>
                        </div>
                    )}

                </div>

                <div className={styles.blogListSection}>
                    <h2>Existing Blogs</h2>
                    {blogs.length > 0 ? (
                        <ul className={styles.blogList}>
                            {blogs.map((blog) => (
                                <li key={blog._id} className={styles.blogItem}>
                                    <h3>{blog.title}</h3>
                                    <p>{blog.description}</p>
                                    <div className={styles.blogActions}>
                                        <button
                                            className={styles.editButton}
                                            onClick={() => router.push(`/BlogAdmin/edit/${blog._id}`)}
                                        >
                                            Edit
                                        </button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>No blogs found</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default BlogAdmin; 