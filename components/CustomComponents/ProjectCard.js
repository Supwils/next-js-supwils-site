import React from 'react';
import styles from './ProjectCard.module.css';
import Image from 'next/image';

const ProjectCard = ({ name, tags, description, image, link }) =>
{
    return (
        <div className={styles.projectCard}>
            <img src={image} alt={`${name} image`} width={1200} height={1200} className={styles.projectImage} />
            <div className={styles.details}>
                <h3 className={styles.name}>{name}</h3>
                <p className={styles.tags}>{tags.join(', ')}</p>
                <p className={styles.description}>{description}</p>
                <a href={link} className={styles.link} target="_blank" rel="noopener noreferrer">View Project</a>
            </div>
        </div>
    );
};

export default ProjectCard;