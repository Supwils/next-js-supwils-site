import styles from "./AboutMeCard.module.css";
import { Icon } from "@iconify/react";
import { useTranslation } from "react-i18next";
const AboutMe = () => {
  const { t } = useTranslation();
  return (
    <div className={styles.about_me_container} id="about">
      <div className={styles.about_me_content}>
        {/* <div className={styles.about_me_image}>
          <img src="/images/helloworld.jpg" alt="About Me" />
        </div> */}
        <div className={styles.about_me_text}>
          <h2 className="mt-10 mb-5 ">About Me</h2>
          <p>
            I am Huahao Shang. A full-stack developer. I graduated from Rice
            University with Master of Computer Science degree.
            <br />I love Coding, Sports, Gaming, Basketball, Cooking...{" "}
          </p>
        </div>
        <div className={styles.about_me_skill}>
          <h3 className="mt-10">My Skills</h3>
          <h4 className="mt-10 mb-5">Frontend</h4>
          <ul className="list-disc pl-5  sm:text-lg lg:text-2xl">
            <li>
              <div className="flex pl-3 font-medium">
              <Icon
                  icon="skill-icons:javascript"
                  className="translate-y-0.5"
                />{" "}
                &nbsp; Javascript(ES6+), Proficient for develop +&nbsp;
                <Icon icon="skill-icons:html" className="translate-y-0.5" />{" "}
                &nbsp; HTML5 +&nbsp;
                <Icon icon="skill-icons:css" className="translate-y-0.5" />{" "}
                &nbsp; CSS3 
                
              </div>
            </li>
            <li>
              <div className="flex pl-3">
                <Icon
                  icon="skill-icons:react-dark"
                  className="translate-y-0.5"
                />{" "}
                &nbsp; React +&nbsp;
                <Icon
                  icon="logos:nextjs-icon"
                  className="translate-y-0.5"
                />{" "}
                &nbsp; Next.js + &nbsp;
                <Icon
                  icon="skill-icons:typescript"
                  className="translate-y-0.5"
                />{" "}
                &nbsp; TypeScript &nbsp;
              </div>
            </li>
          </ul>
          <h4 className="mt-10 mb-5">Backend</h4>
          <ul className="list-disc pl-5  sm:text-lg lg:text-2xl">
            <li>
              <div className="flex pl-3 font-medium">
                <Icon
                  icon="skill-icons:nodejs-dark"
                  className="translate-y-0.5"
                />{" "}
                &nbsp; Node.js (CRUD proficient)&nbsp;
                <Icon icon="devicon:python" className="translate-y-0.5" />{" "}
                &nbsp; Python (general, Flask, ml/ds, leetcode)&nbsp;
                <Icon icon="skill-icons:java-light" className="translate-y-0.5" />{" "}
                &nbsp; Java &nbsp;
                <Icon icon="devicon:cplusplus" className="translate-y-1" />{" "}
                &nbsp; C++ (college oop, algo & graph)&nbsp;
              </div>
            </li>
            <li>
              <div className="flex pl-3 font-medium">
                <Icon
                  icon="skill-icons:mysql-light"
                  className="translate-y-0.5"
                />{" "}
                &nbsp; MySQL &nbsp;
                <Icon
                  icon="skill-icons:postgresql-dark"
                  className="translate-y-0.5"
                />{" "}
                &nbsp; PostgreSQl &nbsp;
                <Icon
                  icon="skill-icons:mongodb"
                  className="translate-y-0.5"
                />{" "}
                &nbsp; MongoDB &nbsp;(Familar with SQL & NoSQL concepts &
                develop)
              </div>
            </li>
          </ul>
          <h4 className="mt-10 mb-5">Other</h4>
          <ul className="list-disc pl-5 sm:text-lg lg:text-2xl">
            <li>
              <div className="flex pl-3 font-medium">Zsh + iTerm2</div>
            </li>
            <li>
              <div className="flex pl-3 font-medium">
                <Icon
                  icon="skill-icons:aws-light"
                  className="translate-y-0.5"
                />{" "}
                &nbsp; AWS(EC2,S3,Lambda, RDS, 53) +&nbsp;
                <Icon
                  icon="skill-icons:azure-dark"
                  className="translate-y-0.5"
                />{" "}
                &nbsp; AzureSQL +&nbsp;
                <Icon
                  icon="devicon:googlecloud"
                  className="translate-y-0.5"
                />{" "}
                &nbsp; GCP &nbsp;
              </div>
            </li>
            <li>
              <div className="flex pl-3 font-medium">
                <Icon icon="icomoon-free:git" className="translate-y-0.5" />{" "} 
                &nbsp; Git +&nbsp;
                <Icon icon="skill-icons:docker" className="translate-y-0.5" />{" "}
                &nbsp; Docker +&nbsp; CI/CD Linux
              </div>
            </li>
            <li>
              <div className="flex pl-3 font-medium">
                Confortable pair with ChatGPT + Cursor + Google for problem solving
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AboutMe;
