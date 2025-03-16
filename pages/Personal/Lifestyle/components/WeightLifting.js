import styles from '../lifestyle.module.css';

export default function WeightLifting() {
    return (
        <div className={styles.section} id="weightlifting">
            <h2>Weight Lifting & Workout Routines</h2>
            <div className={styles.section_content}>
                <div className={styles.section_text}>
                    <p>
                        I believe in consistent, varied exercise that challenges both body and mind. 
                        My weekly strength training routine typically includes:
                    </p>
                    <div className={styles.workout_plan}>
                        <div className={styles.workout_day}>
                            <h3>Monday & Thursday</h3>
                            <p>Strength Training</p>
                            <ul>
                                <li>Compound lifts (squats, deadlifts, bench press)</li>
                                <li>Progressive overload principles</li>
                                <li>30-45 minute sessions</li>
                            </ul>
                        </div>
                        <div className={styles.workout_day}>
                            <h3>Tuesday & Friday</h3>
                            <p>Cardio & Mobility</p>
                            <ul>
                                <li>HIIT workouts or distance running</li>
                                <li>Yoga for flexibility</li>
                                <li>20-30 minute sessions</li>
                            </ul>
                        </div>
                        <div className={styles.workout_day}>
                            <h3>Wednesday</h3>
                            <p>Active Recovery</p>
                            <ul>
                                <li>Light walking or cycling</li>
                                <li>Foam rolling</li>
                                <li>Stretching routine</li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div className={styles.section_image}>
                    <div className={styles.image_placeholder}>
                        <p>Workout Image</p>
                    </div>
                </div>
            </div>
            <div className={styles.quote_box}>
                <p>"The last three or four reps is what makes the muscle grow. This area of pain divides a champion from someone who is not a champion."</p>
            </div>
        </div>
    );
} 