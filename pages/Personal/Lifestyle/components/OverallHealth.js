import styles from '../lifestyle.module.css';

export default function OverallHealth() {
    return (
        <div className={styles.section} id="health">
            <h2>Overall Health & Wellness</h2>
            <div className={styles.section_content}>
                <div className={styles.section_text}>
                    <p>
                        My approach to health is holistic, focusing on the interconnection between 
                        physical, mental, and emotional wellbeing. I believe in:
                    </p>
                    <ul>
                        <li>
                            <strong>Balanced Nutrition:</strong> Eating whole foods with a focus on plants, 
                            lean proteins, and healthy fats while maintaining flexibility.
                        </li>
                        <li>
                            <strong>Mindful Eating:</strong> Paying attention to hunger cues and enjoying 
                            food without distractions.
                        </li>
                        <li>
                            <strong>Stress Management:</strong> Regular meditation, adequate sleep, and mindfulness 
                            practices to keep stress levels in check.
                        </li>
                        <li>
                            <strong>Preventive Healthcare:</strong> Regular check-ups and staying informed about 
                            health research.
                        </li>
                    </ul>
                </div>
                <div className={styles.section_image}>
                    <div className={styles.image_placeholder}>
                        <p>Health Image</p>
                    </div>
                </div>
            </div>

            <div className={styles.quote_box}>
                <p>"Health is a state of complete harmony of the body, mind, and spirit."</p>
            </div>
        </div>
    );
} 