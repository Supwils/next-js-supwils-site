import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import styles from './blogDetail.module.css';
import ZoomableImage from '../../components/ZoomableImage';

export default function BlogDetail()
{
    const router = useRouter();
    const { id } = router.query;

    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() =>
    {
        // Only fetch when we have an ID
        if (!id) return;

        const fetchPost = async () =>
        {
            try
            {
                setLoading(true);
                const res = await fetch(`/api/blog/get-blog?id=${id}`);

                if (!res.ok)
                {
                    throw new Error(`Failed to fetch: ${res.status} ${res.statusText}`);
                }

                const data = await res.json();
                setPost(data);
            } catch (err)
            {
                console.error("Error fetching blog post:", err);
                setError(err.message);
            } finally
            {
                setLoading(false);
            }
        };

        fetchPost();
    }, [id]);

    // Handle back navigation
    const handleBackClick = () =>
    {
        router.push('/Blog');
    };

    if (loading)
    {
        return (
            <div className={styles.container}>
                <div className={styles.loadingContainer}>
                    <div className={styles.loader}></div>
                    <p>Loading post...</p>
                </div>
            </div>
        );
    }

    if (error)
    {
        return (
            <div className={styles.container}>
                <div className={styles.errorContainer}>
                    <h1>Error Loading Blog Post</h1>
                    <p>{error}</p>
                    <button onClick={handleBackClick} className={styles.backButton}>
                        Back to Blog List
                    </button>
                </div>
            </div>
        );
    }

    if (!post)
    {
        return (
            <div className={styles.container}>
                <div className={styles.errorContainer}>
                    <h1>Blog Post Not Found</h1>
                    <p>The blog post you're looking for doesn't exist or has been removed.</p>
                    <button onClick={handleBackClick} className={styles.backButton}>
                        Back to Blog List
                    </button>
                </div>
            </div>
        );
    }

    return (
        <>
            <Head>
                <title>{post.title} | Supwils Blog</title>
                <meta name="description" content={post.description} />
            </Head>
            <div className={styles.container}>
                <div className={styles.blogPost}>
                    <button
                        onClick={handleBackClick}
                        className={styles.backButton}
                        aria-label="Back to blog list"
                    >
                        ← Back
                    </button>

                    <h1 className={styles.title}>{post.title}</h1>

                    <div className={styles.meta}>
                        <p className={styles.date}>
                            {new Date(post.date || post.createdAt).toLocaleDateString(
                                'en-US',
                                {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                }
                            )}
                        </p>
                        <div className={styles.tags}>
                            {post.tags && post.tags.map((tag, index) => (
                                <span key={index} className={styles.tag}>{tag}</span>
                            ))}
                        </div>
                    </div>

                    {post.thumbnail && (
                        <div className={styles.thumbnailContainer}>
                            <ZoomableImage
                                src={post.thumbnail}
                                alt={`Thumbnail for ${post.title}`}
                                width={800}
                                height={400}
                                objectFit="cover"
                                priority
                            />
                        </div>
                    )}

                    <div className={styles.content}>
                        {post.content ? (
                            <div dangerouslySetInnerHTML={{ __html: post.content }} />
                        ) : (
                            <p>{post.description}</p>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
} 