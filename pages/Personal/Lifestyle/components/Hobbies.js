import styles from '../lifestyle.module.css';

export default function Hobbies() {
    return (
        <div className={styles.section} id="hobbies">
            <h2>Hobbies & Activities</h2>
            <div className={styles.section_content}>
                <div className={styles.section_text}>
                    <p>
                        Balance is essential for a fulfilling life. Beyond work and fitness, 
                        I enjoy these activities to nourish my mind and soul:
                    </p>
                    <div className={styles.activities_grid}>
                        <div className={styles.activity_item}>
                            <h3>Reading</h3>
                            <p>I'm an avid reader of non-fiction, philosophy, and science fiction. 
                               I aim to read 25 books per year.</p>
                        </div>
                        <div className={styles.activity_item}>
                            <h3>Hiking & Nature</h3>
                            <p>Exploring trails and spending time in nature helps me reset and gain perspective.</p>
                        </div>
                        <div className={styles.activity_item}>
                            <h3>Photography</h3>
                            <p>Capturing moments through urban and landscape photography.</p>
                        </div>
                        <div className={styles.activity_item}>
                            <h3>Cooking</h3>
                            <p>Experimenting with new recipes and techniques, particularly with international cuisines.</p>
                        </div>
                        <div className={styles.activity_item}>
                            <h3>Meditation</h3>
                            <p>Daily practice that grounds me and improves mental clarity.</p>
                        </div>
                        <div className={styles.activity_item}>
                            <h3>Learning</h3>
                            <p>Always pursuing new skills through online courses and workshops.</p>
                        </div>
                    </div>
                </div>
                <div className={styles.section_image}>
                    <div className={styles.image_placeholder}>
                        <p>Hobbies Image</p>
                    </div>
                </div>
            </div>
            <div className={styles.quote_box}>
                <p>"The time you enjoy wasting is not wasted time."</p>
            </div>
        </div>
    );
} 