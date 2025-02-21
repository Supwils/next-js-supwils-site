import React from 'react';
import styles from './ExperienceCard.module.css';
import Image from 'next/image';

const Experience = ({ company, role, duration, description, imageUrl }) => {
  return (
    <div className={styles.experience}>
      <Image src={imageUrl} alt={`${company} logo`} width={50} height={50} className={styles.companyImage} />
      <div className={styles.details}>
        <h3 className={styles.role}>{role}</h3>
        <p className={styles.company}>{company}</p>
        <p className={styles.duration}>{duration}</p>
        <p className={styles.description}>{description}</p>
      </div>
    </div>
  );
};

export default Experience;