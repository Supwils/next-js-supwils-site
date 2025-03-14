import styles from './blog.module.css';
import BlogCard from '../../components/BlogComponents/BlogCard';
import SearchBar from './SearchBar';
import { useState, useEffect } from 'react';

const Blog = () =>
{
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() =>
    {
        // Fetch blogs when component mounts
        fetchBlogs();
    }, []);

    const fetchBlogs = async () =>
    {
        try
        {
            setLoading(true);
            const res = await fetch('/api/blog/get-recent10');

            if (!res.ok)
            {
                throw new Error(`Failed to fetch: ${res.status} ${res.statusText}`);
            }

            const data = await res.json();
            setPosts(data || []);
        } catch (error)
        {
            console.error("Error fetching blog posts:", error);
            setError(error.message);
        } finally
        {
            setLoading(false);
        }
    };

    const handleSearch = (text, tags) =>
    {
        console.log(text, tags);
    };

    return (
        <div className={styles.blog_container}>
            <div className={styles.blog_content}>
                <SearchBar onSearch={handleSearch} />
                <div className={styles.blog_list}>
                    {loading ? (
                        <p>Loading blog posts...</p>
                    ) : error ? (
                        <p className="text-2xl font-bold">Error loading posts: {error}</p>
                    ) : posts.length > 0 ? (
                        posts.map((blog, index) => (
                            <BlogCard
                                key={index}
                                id={blog._id}
                                title={blog.title}
                                description={blog.description}
                                tags={blog.tags}
                                date={blog.date}
                                slug={blog.slug}
                            />
                        ))
                    ) : (
                        <p className="text-2xl font-bold">No blog posts available.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Blog;