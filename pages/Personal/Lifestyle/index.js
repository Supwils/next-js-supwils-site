import styles from './lifestyle.module.css';
import Image from 'next/image';
import OverallHealth from './components/OverallHealth';
import WeightLifting from './components/WeightLifting';
import Foodie from './components/Foodie';
import Hobbies from './components/Hobbies';

export default function Lifestyle() {
    return (
        <div className={styles.lifestyle_container}>
            <div className={styles.lifestyle_content}>
                <h1 className={styles.lifestyle_title}>My Lifestyle Philosophy</h1>
                <p className={styles.lifestyle_intro}>
                    Welcome to my lifestyle page where I share my approach to living a balanced, 
                    healthy, and fulfilling life. My philosophy centers around mindful habits, 
                    consistent physical activity, and continuous personal growth.
                </p>

                <div className={styles.nav_anchors}>
                    <a href="#health" className={styles.anchor_link}>Overall Health</a>
                    <a href="#weightlifting" className={styles.anchor_link}>Weight Lifting</a>
                    <a href="#foodie" className={styles.anchor_link}>Foodie</a>
                    <a href="#hobbies" className={styles.anchor_link}>Hobbies</a>
                </div>

                <OverallHealth />
                <WeightLifting />
                <Foodie />
                <Hobbies />
            </div>
        </div>
    );
}