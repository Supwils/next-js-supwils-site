import styles from './ResourceShare.module.css';
import resources, { Resource, ResourcesData } from '../../data/resources_data';

const ResourceShare = (): JSX.Element => {
    return (
        <div className={styles.resource_container}>
            <div className={styles.resource_content}>
                <h1 className="pt-10 text-3xl font-bold">Resource Share1</h1>
                {Object.keys(resources).map((category) => (
                    <div key={category} className={styles.category_section}>
                        <h2 className={styles.category_title}>{category}</h2>
                        <ul className={styles.resource_list}>
                            {resources[category].map((resource, index) => (
                                <li key={index} className={styles.resource_item}>
                                    <h3 className={styles.resource_name}>
                                        <a
                                            href={resource.link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className={styles.resource_link}
                                        >
                                            {resource.name}
                                        </a>
                                    </h3>
                                    <p className={styles.resource_description}>
                                        {resource.description}
                                    </p>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ResourceShare; 