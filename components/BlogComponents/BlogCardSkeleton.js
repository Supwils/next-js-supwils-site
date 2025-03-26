import React from 'react';
import styles from './BlogCardSkeleton.module.css';

const BlogCardSkeleton = () =>
{
    return (
        <div className={styles.skeletonCard}>
            <div className={styles.skeletonTitle}></div>
            <div className={styles.skeletonTags}></div>
            <div className={styles.skeletonDescription}></div>
            <div className={styles.skeletonDate}></div>
        </div>
    );
};

export default BlogCardSkeleton; 