import styles from './BlogCard.module.css';
import Link from 'next/link';

const BlogCard = ({ title, description, tags, date, slug, id }) =>
{


    return (
        <Link href={`/Blog/${id}`}>
            <div className={styles.blogCard}>
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