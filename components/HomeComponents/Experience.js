import styles from "./Exprience.module.css";

import ExperienceCard from "../CustomComponents/ExperienceCard";
const Exprience = () =>
{
    const experience = [
        {
            company: "Learfield",
            role: "Software Engineer Intern",
            duration: "Summer 2024",
            description: "Developed steaming data analytics tool integrated with the company main service to provide real-time data analysis and insights for their clients.",
            imageUrl: "/images/learfield.jpg"
        },
        {
            company: "Sidearm Sports",
            role: "Web Developer & Data Imports",
            duration: " Summer 2022 and Summer 2023",
            description: "Providing web solutions for collegiate clients such as OSU, FSU, for their athletic websites, including build up web components, data imports, validation for smooth project delivery.",
            imageUrl: "/images/sidearm.png"
        },
        {
            company:"Rice University",
            role:"Master of Computer Science",
            duration:"2023-2024",
            description:"Coursework focused on Machine Learning, Web Development, Programming Principles with hands on projects and group works",
            imageUrl:"/images/riceu.jpg"
        },
        {
            company:"Syracuse University",
            role:"Bachelor of Science in Computer Science",
            duration:"2019-2022",
            description:"General Computer Science study including Data Structures, Programming Languages, Database, Software Engineering",
            imageUrl:"/images/su.jpg"
        }
    ]
    return (
        <div className={styles.exprience_container} id="experience">
            <div className={styles.exprience_content}>

                <h2>Experience</h2>
                {experience.map((exp, index) => (
                    <ExperienceCard key={index} {...exp} />
                ))}
            </div>
        </div>
    )
}

export default Exprience;