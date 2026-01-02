// dom.js

// This file will handle all DOM manipulations for the To-Do List application

import { projectList, createProject, removeProject, createTask, removeTask } from "./projects.js";

// Function to render the list of projects in the DOM
function renderProjects() {
    // Get the project list container
    const projectListDisplay = document.querySelector("#projects > ul");
    
    // Clear and render all in one swoop
    projectListDisplay.innerHTML = projectList
    .map(project => `<li data-id="${project.id}">${project.name} 
        <button class="delete-project-btn" data-id="${project.id}">X</button></li>`)
    .join(""); // join to make a single string
}

function addProject(projectName) {
    createProject(projectName);
    renderProjects();
}

function deleteProject(projectID) {
    removeProject(projectID);
    renderProjects();
}


const addProjectBtn = document.getElementById("add-project-btn");

// Event listener for adding a project
addProjectBtn.addEventListener("click", () => {
    const projectNameInput = document.querySelector("#new-project input")
    const projectName = projectNameInput.value.trim();
    addProject(projectName);
    projectNameInput.value = ""; // Clear input field after adding
    console.log(projectList);
});
  
// Event delegation for deleting a project
document.getElementById("projects").addEventListener("click", e => {
    
    if (e.target.classList.contains("delete-project-btn")) {
        deleteProject(e.target.getAttribute("data-id"));
    }
});