// Define the Resource interface
export interface Resource {
    name: string;
    description: string;
    link: string;
}

// Define the ResourcesData interface
export interface ResourcesData {
    [category: string]: Resource[];
}

const resources: ResourcesData = {
    "Projects": [
        {
            "name": "yt-dlp (Youtube Video Downloader)",
            "description": "It's the most powerful youtube video downloader integrated in terminal or python",
            "link": "https://github.com/yt-dlp/yt-dlp"
        },
        {
            "name": "json-server",
            "description": "json-server is a tool to create a fake REST API",
            "link": "https://www.npmjs.com/package/json-server"
        },
        {
            "name": "Machine Lsdfdsfsearning",
            "description": "Machine Learning by Andrew Ng",
            "link": "https://www.coursera.org/learn/machine-learning"
        }
    ],
    "General": [
        {
            "name": "MDN Web Docs",
            "description": "The official documentation for the web development principles and technologies.",
            "link": "https://developer.mozilla.org/en-US/"
        },
        {
            "name": "How to Msdgsgake a Video",
            "description": "How to Make a Video by Peter McKinnon",
            "link": "https://www.youtube.com/watch?v=OcU6Q2zW8Y4"
        },
        {
            "name": "How to Masdgdgske a Video",
            "description": "How to Make a Video by Peter McKinnon",
            "link": "https://www.youtube.com/watch?v=OcU6Q2zW8Y4"
        }
    ],
    "Tools": [
        {
            "name": "iconify.design",
            "description": "Ton's of icons you can use",
            "link": "https://iconify.design/"
        },
        {
            "name": "https://heropatterns.com/",
            "description": "Figma is a vector graphics editor and prototyping tool",
            "link": "https://heropatterns.com/"
        },
        {
            "name": "Figsdfsfgma",
            "description": "Figma is a vector graphics editor and prototyping tool",
            "link": "https://www.figma.com/"
        }
    ]
};

export default resources; 