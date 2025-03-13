import styles from './Lifestyle.module.css';

export default function Lifestyle()
{
    return (
        <div className={styles.lifestyle_container}>
            <div className={styles.lifestyle_content}>
                <h1>Lifestyle</h1>
                <div>
                    <h2>Health</h2>
                    <ul>
                        <li>Exercise</li>
                        <li>Diet</li>
                        <li>Hygiene</li>
                    </ul>
                </div>
            </div>
          
        </div>
    )
}