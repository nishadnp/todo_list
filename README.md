# Todo List App

[![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![Webpack](https://img.shields.io/badge/Webpack-8DD6F9?logo=webpack&logoColor=black)](https://webpack.js.org/)
[![GitHub Pages](https://img.shields.io/badge/GitHub_Pages-222?logo=githubpages&logoColor=white)](https://pages.github.com/)


## Live Demo

[![Live Demo](https://img.shields.io/badge/Live_Demo-Visit_Site-b8926a?style=for-the-badge)](https://nishadnp.github.io/todo_list/)


## About 

A simple project-based **Todo List application** built with **vanilla JavaScript**, bundled using **Webpack** and basic state persistence using `localStorage`.


## Features

- Create and delete projects

- Add, edit, delete tasks within projects

- Assign due dates and priorities to tasks

- Mark tasks as completed

- View detailed task information in a modal

- Persistent data using **localStorage**

- Clean date formatting using **date-fns**


## Built With

- JavaScript (ES6 modules)

- Webpack (split into common / dev / prod configs)

- date-fns (for date formatting)

- HTML5 & CSS3

- localStorage API


## Project Structure

```
src/
└── 
   ├── assets/
       └── icons/
   ├── css/
   ├── index.html
   ├── index.js     # App entry point
   └── modules
       ├── data/    # Project, task and storage logic
       └── dom/     # DOM rendering and event handling
```


## Getting Started

### Install dependencies

```bash
npm install
```

### Run development server

```bash
npm run dev
```

### Clean build folder

```bash
npm run clean
```

### Build for production

```bash
npm run build
```

### Deployment

The app can be deployed using GitHub Pages:

```bash
npm run deploy
```
Open http://localhost:8080 in your browser.


## Notes

- This project intentionally avoids frameworks to focus on core JavaScript concepts.

- The architecture prioritizes clarity over abstraction.

- Getters/setters and advanced patterns were intentionally skipped to keep the codebase approachable.


## Author 
**Nishad Np** | [@nishadnp](https://github.com/nishadnp)
