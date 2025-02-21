import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
        translation: {
          "translate": "Translate",
          "helloMe": "Hello, It's",
          "name": "Huahao Shang",
          "Intro":"Glad to see you here. Welcome to my personal website. Wish you had fun from here. Check out the site to know me more or Ask me for anything!.",
          "about": "About",
          "me": "Me",
          "aboutMeIntro":"My name is Huahao Shang, also go by Wilson. I am from Dongying, China. Currently a Master student at\
            Rice University major in Computer Science. I graduated from Syracuse University with a Bachelor's degree in Computer Science. Exprienced in web techs, software implementation, and AI/Machine Learning. Interned at Sidearm Sports, a company that\
            focusing on college sports information technology. I am a quick learner and a team player. ",
        "welcome": "Welcome to my website",
        "webDevelopment": "Web Development",
        "readMore": "Read More"
      // Add more translations here
    }
  },
  zh: {
      translation: {
          "translate": "翻译",
          "helloMe": "你好，我是",
          "name": "尚华豪",
          "Intro":"很高兴见到你。我目前是莱斯大学计算机科学硕士, 将于2024年12月毕业。专注于网页/软件开发和一些AI/ML。查看网站了解更多信息。",
          "about": "关于",
          "me": "我",
          "aboutMeIntro":"我叫胡浩，也叫威尔。我来自中国东营。目前是莱斯大学计算机科学硕士。我毕业于雪城大学，获得计算机科学学士学位。有丰富的网页开发、软件实现和人工智能/机器学习的经验。在Sidearm Sports公司实习，这是一家专注于大学体育信息技术的公司。我是一个快速学习者，也是一个团队合作者。",
          "welcome": "欢迎来到我的网站",
          "webDevelopment": "网页开发",
          "readMore": "阅读更多"
      // Add more translations here
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en', // Default language
    keySeparator: false,
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;