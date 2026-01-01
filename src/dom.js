// dom.js

// This file will handle all DOM manipulations for the To-Do List application

import { projectList, createProject, removeProject, createTask, removeTask } from "./projects.js";

// Function to render the list of projects in the DOM
function renderProjects() {
    // Get the project list container
    const projectListDisplay = document.querySelector("#projects > ul");
    
    // Clear and render all in one swoop
    projectListDisplay.innerHTML = projectList
    .map(project => `<li data-id="${project.id}">${project.name}</li>`)
    .join(""); // join to make a single string
}

function addProject(projectName) {
    createProject(projectName);
    renderProjects();
}

const addProjectBtn = document.getElementById("add-project-btn");

addProjectBtn.addEventListener("click", () => {
    addProject(prompt("Enter project name:"));
    console.log(projectList);
});
