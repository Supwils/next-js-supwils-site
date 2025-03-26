import { useEffect } from 'react';
import Typed from 'typed.js';
import { useTranslation } from 'react-i18next';
import styles from './IntroCard.module.css';
import Image from 'next/image';
import { Icon } from '@iconify/react';

const IntroCard = () =>
{
    const { t } = useTranslation();
    useEffect(() =>
    {
        const typed = new Typed('.multiple-text', {
            strings: ['Software Developer', 'Web Developer', 'Student', 'Athletic Trainer'],
            typeSpeed: 100,
            backSpeed: 100,
            backDelay: 1000,
            loop: true
        });

        // Cleanup function to destroy the Typed instance when the component unmounts
        return () =>
        {
            typed.destroy();
        };
    }, []);

    return (
        <div className={styles.home_container}>
            <section className={styles.home} id="home">
                <div className={styles.home_content}>
                    <h3>{t('helloMe')}</h3>
                    <h1>{t('name')}</h1>
                    <h3>And I&apos;m a <span className="multiple-text"></span></h3>
                    <p style={{ whiteSpace: 'pre-line' }}>{t('Intro')}</p>
                    <div className={styles.social_media}>
                        <a href="https://www.linkedin.com/in/huahao-shang-7b59b2224/" target="_blank"><i className='bx bxl-linkedin'></i></a>
                        <a href="https://github.com/Supwils/" target="_blank"><i className='bx bxl-github' ></i></a>
                        <a href='https://space.bilibili.com/479803243' target="_blank"><i className="fa-brands fa-bilibili"></i></a>
                    </div>
                    <a href="https://supwilsmedia.s3.us-east-2.amazonaws.com/hs_resume_fs_1.pdf" target="_blank" rel="noopener noreferrer" className="btn">Download CV</a>
                </div>

                <div className={styles.image_flip_container}>
                    <div className={styles.image_float}>
                        <div className={styles.image_flip}>
                            <Image src="/images/HuahaoSea.png" width={1000} height={1000} className={styles.front_img} alt="Huahao Shang Front" />
                            <Image src="/images/Huahao.png" width={1000} height={1000} className={styles.back_img} alt="Huahao Shang Back" />
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default IntroCard;