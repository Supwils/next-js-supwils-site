import styles from '../lifestyle.module.css';

export default function Foodie() {
    return (
        <div className={styles.section} id="foodie">
            <h2>Foodie & Nutrition</h2>
            <div className={styles.section_content}>
                <div className={styles.section_text}>
                    <p>
                        Food is not just fuel for me—it's an experience to be savored and enjoyed. 
                        My approach to nutrition combines health consciousness with culinary exploration.
                    </p>
                    <div className={styles.habits_container}>
                        <div className={styles.habit_card}>
                            <h3>Favorite Cuisines</h3>
                            <ul>
                                <li>Japanese (especially sushi and ramen)</li>
                                <li>Mediterranean dishes</li>
                                <li>Authentic Mexican food</li>
                                <li>Indian curries</li>
                                <li>Thai street food</li>
                            </ul>
                        </div>
                        <div className={styles.habit_card}>
                            <h3>Cooking Philosophy</h3>
                            <ul>
                                <li>Emphasize whole, unprocessed ingredients</li>
                                <li>Balance macronutrients in every meal</li>
                                <li>Experiment with international recipes</li>
                                <li>Focus on flavor through herbs and spices</li>
                            </ul>
                        </div>
                        <div className={styles.habit_card}>
                            <h3>Nutrition Principles</h3>
                            <ul>
                                <li>80/20 rule: healthy choices most of the time</li>
                                <li>Intuitive eating approach</li>
                                <li>Hydration as a foundation</li>
                                <li>Mindful of portion sizes</li>
                                <li>Seasonal and local when possible</li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div className={styles.section_image}>
                    <div className={styles.image_placeholder}>
                        <p>Food Image</p>
                    </div>
                </div>
            </div>
            <div className={styles.quote_box}>
                <p>"One cannot think well, love well, sleep well, if one has not dined well."</p>
            </div>
        </div>
    );
} 