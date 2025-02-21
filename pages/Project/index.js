import styles from './project.module.css';
import projectData from './projectData';
import ProjectCard from '../../components/CustomComponents/ProjectCard';
import SearchBar from './searchBar';
import { useState, useCallback } from 'react';

const Project = () => {
    const [filteredProjects, setFilteredProjects] = useState(projectData);

    // 🔥 Use useCallback to prevent function recreation on every render
    const handleSearch = useCallback((text, tags) => {
        let filtered = projectData.filter(project =>
            project.name.toLowerCase().includes(text.toLowerCase())
        );

        if (!tags.includes("All")) {
            filtered = filtered.filter(project => 
                tags.some(tag => project.tags.includes(tag))
            );
        }
        
        filtered = filtered.sort((a, b) => b.value - a.value);

        setFilteredProjects(filtered);
    }, []);
    const url = "https://blog.supwils26.com"
    return (
        <div>
            <div className={styles.project_container}>
                <div className={styles.project_content}>
                    <h1 className={styles.project_title}>Project List</h1>
                    <SearchBar onSearch={handleSearch} />
                    <div className={styles.projectList}>
                        {filteredProjects.map((project) => (
                            <ProjectCard key={project.name} {...project} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Project;