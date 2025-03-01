import styles from './blog.module.css';
import BlogCard from '../../components/BlogComponents/BlogCard';
import SearchBar from './SearchBar';

import { useEffect, useState } from 'react';

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

export async function getServerSideProps()
{
    try
    {
        const res = await fetch(`${backendUrl}/blogs/get-recent`);

        if (!res.ok)
        {
            throw new Error(`Failed to fetch: ${res.status} ${res.statusText}`);
        }

        const data = await res.json();

        return {
            props: {
                initialPosts: data || [],
            },
        };
    } catch (error)
    {
        console.error("Error fetching blog posts:", error);
        return {
            props: {
                initialPosts: [],
            },
        };
    }
}

const Blog = ({ initialPosts }) =>
{
    const [posts, setPosts] = useState(initialPosts);
    const [filteredPosts, setFilteredPosts] = useState([]);

    const handleSearch = (text, tags) =>
    {
        console.log(text, tags);
    };

    return (
        <div className={styles.blog_container}>
            <div className={styles.blog_content}>
                <SearchBar onSearch={handleSearch} />
                <div className={styles.blog_list}>
                    {posts.length > 0 ? (
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
                        <p>No blog posts available.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Blog;