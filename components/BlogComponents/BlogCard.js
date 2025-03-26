import styles from './BlogCard.module.css';
import Link from 'next/link';
import { useRouter } from 'next/router';

const BlogCard = ({ title, description, tags, date, slug, id }) =>
{
    const router = useRouter();

    // Handle keyboard navigation
    const handleKeyDown = (e) =>
    {
        if (e.key === 'Enter' || e.key === ' ')
        {
            e.preventDefault();
            router.push(`/Blog/${id}`);
        }
    };

    return (
        <Link href={`/Blog/${id}`}>
            <div
                className={styles.blogCard}
                tabIndex={0}
                role="article"
                aria-label={`Blog post: ${title}`}
                onKeyDown={handleKeyDown}
            >
                <div className={styles.details}>
                    <h3 className={styles.title}>{title}</h3>
                    <p className={styles.tags}>{tags.join(', ')}</p>
                    <p className={styles.description}>{description}</p>
                    <p className={styles.date}>{date}</p>
                </div>
            </div>
        </Link>
    );
};

export default BlogCard;