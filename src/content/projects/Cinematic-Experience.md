---
Projecttitle: Cinematic Experience
ProjectDescription: "Blogging Website Developed with React, Astro and Tailwind"
ProjectImage: https://7huqjqx8yo.ufs.sh/f/TViMykBJnLIJbCz5Qe4nRBrPQNqFmsSdU0jLhDYMVTkJ4Z76
draft: true
ProjectTech:
  - CSS
  - Typescript
  - Tailwind
  - Astro
  - React
  - Svelte

ProjectCategory: ["Web Apps"]
ProjectRanking: "12"
ProjectDeployedLink: ""
---

In my latest project, **Cinematic Experience**, I've crafted a platform dedicated to exploring the world of movies, TV shows, and entertainment. This project blends my love for film with my technical skills, resulting in a space where thoughtful reviews and engaging content take center stage. Let me walk you through the details of how I built it, the challenges I faced, and the technology that powers it.

## 🎥 What is Cinematic Experience?

**Cinematic Experience** is a content-driven website that hosts blog posts, reviews, and opinion pieces about movies and TV shows. Whether you're looking for an in-depth analysis of a recent blockbuster or insights into storytelling trends, this platform has something for every cinephile.

## 💻 Tech Stack

Building a content-focused platform required choosing the right tools to manage both the technical and editorial sides. Here's what I used:

- **Astro**: A modern static site generator that makes the site fast and flexible.
- **React & Svelte**: For building dynamic, interactive components.
- **Tailwind CSS**: To create a clean, responsive, and minimalist design.
- **Markdown**: For easy content writing and formatting.
- **TinaCMS**: To manage blog posts effortlessly.

## 🗂️ Project Structure

The project's folder structure is organized for scalability and maintainability:

```
├───.astro
│   ├───astro
│   └───collections
├───.vscode
├───content
│   └───posts
├───public
│   ├───admin
│   └───assets
│       ├───blog
│       └───fonts
├───src
│   ├───components
│   │   ├───ReactCompoent
│   │   │   ├───blogPosts
│   │   │   ├───search
│   │   │   └───tag
│   │   └───svg
│   ├───content
│   │   ├───blog
│   │   └───config
│   ├───interfaces
│   ├───layouts
│   ├───pages
│   │   └───blog
│   ├───styles
│   └───utils
└───tina
    └───__generated__
```

### Key Highlights:

- **`src/components`**: Contains reusable components for blog posts, search functionality, and tags.
- **`content/posts`**: Stores all the Markdown files for blog posts.
- **`tina/__generated__`**: Automatically generated files by TinaCMS to manage content dynamically.

## 🏃‍♂️ Running the Project

If you're interested in running this project locally, follow these steps:

1. **Fork and clone the repository**:
   ```bash
   git clone https://github.com/rafay99-epic/Cinematic-Experience.git
   ```
2. **Navigate to the project directory**:
   ```bash
   cd Cinematic-Experience
   ```
3. **Install dependencies**:
   ```bash
   npm install
   ```
4. **Run the development server**:
   ```bash
   npm run dev
   ```
5. Open your browser and visit `http://localhost:4321` to see the site in action.

## ✍️ Writing Content

Writing blog posts is simple with Markdown, making it easy to focus on the content rather than formatting. TinaCMS provides a user-friendly interface to manage and update posts without diving into the codebase.

## 🚀 Lessons Learned

Throughout this project, I learned:

- How to integrate **TinaCMS** for seamless content management.
- The power of **Astro** in building fast and flexible websites.
- The importance of organizing a codebase for long-term maintainability.

## 🌟 Conclusion

**Cinematic Experience** is more than just a blog; it's a passion project that merges my love for storytelling with technology. Whether you're here to read reviews or contribute to the content, I hope this platform offers value to all movie lovers.

If you're interested in the code or want to contribute, check out the GitHub repository [here](https://github.com/rafay99-epic/Cinematic-Experience).

Lights, camera, action! 🎥
