import { useRouter } from 'next/router';
import styles from './post.module.css';
import parse from 'html-react-parser';
import { useState, useEffect } from 'react';
import { getApiUrl } from '../../lib/apiUtils';
import 'react-quill/dist/quill.snow.css';
import 'react-quill/dist/quill.bubble.css';


const BlogPost = () =>
{
    const router = useRouter();
    const { _id } = router.query;
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

    const [blog, setBlog] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Handle back button click
    const handleBackClick = () =>
    {
        router.back(); // Use browser history instead of direct navigation
    };

    // ✅ Use useEffect to fetch blog post when `_id` changes
    useEffect(() =>
    {
        if (!_id) return; // Prevent fetching if `_id` is undefined

        const getBlog = async () =>
        {
            try
            {
                // Use the utility function
                const res = await fetch(getApiUrl(`/api/blog/get-byId?id=${_id}`));

                if (!res.ok) throw new Error('Failed to fetch blog post');

                const data = await res.json();
                setBlog(data);
            } catch (err)
            {
                setError(err.message);
            } finally
            {
                setLoading(false);
            }
        };

        getBlog();
    }, [_id]); // ✅ Dependencies: Only fetch when `_id` changes

    // ✅ Loading state
    if (loading) return <p>Loading blog post...</p>;

    // ✅ Error handling
    if (error) return <p>Error: {error}</p>;

    // ✅ Blog not found
    if (!blog) return <p>Blog not found</p>;

    // ✅ Format the date safely
    const formattedDate = blog.createdAt
        ? new Date(blog.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
        : 'Unknown Date';

    return (
        <div className={styles.post_container}>
            <button
                className={styles.back_button}
                onClick={handleBackClick}
                aria-label="Back to all blogs"
            >
                ← Back to Blogs
            </button>
            <div className={styles.post_content}>
                <h1>{blog.title}</h1>
                <h2 className='pt-6 pb-3'>{blog.description}</h2>
                <h3 className='pt-6 pb-6'> Posted on: {formattedDate}</h3>
                <div className={styles.post_main}>{parse(blog.content)}</div>
            </div>
        </div>
    );
};

export default BlogPost;