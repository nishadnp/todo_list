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

function addTaskToProject(projectID, title, description, dueDate, priority) {
    createTask(projectID, title, description, dueDate, priority);
    renderSelectedProject(projectID);
}

function deleteTaskFromProject(projectID, taskID) {
    removeTask(projectID, taskID);
    renderSelectedProject(projectID);
}

// Function to render the selected project's tasks

function renderSelectedProject(projectID) {
    
    const project = projectList.find(proj => proj.id === projectID);    

    if (project) {

        const mainContent = document.getElementById("main-content");
        
        mainContent.innerHTML = ""; // Clear previous content
        const projectHeader = document.createElement("h2");
        projectHeader.textContent = project.name;
        mainContent.appendChild(projectHeader);

        const addTaskBtn = document.createElement("button");
        addTaskBtn.textContent = "Add Task";
        addTaskBtn.id = "add-task-btn";
        mainContent.appendChild(addTaskBtn);
        // Further task rendering logic would go here

    }
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
  
// Event delegation for deleting a project and selecting a project
document.getElementById("projects").addEventListener("click", e => {
    
    if (e.target.classList.contains("delete-project-btn")) {
        deleteProject(e.target.getAttribute("data-id"));
        return; // Exit to avoid rendering selected project
    }

    if (e.target.dataset.id) {
        renderSelectedProject(e.target.dataset.id);
    }
});

// Event delegation for adding and deleting tasks within the selected project
document.getElementById("main-content").addEventListener("click", e => {
    if (e.target.id === "add-task-btn") {
        // Logic to add a new task would go here
        console.log("Add Task button clicked");
        return;
    }

    if (e.target.classList.contains("delete-task-btn")) {
        const projectID = e.target.getAttribute("data-project-id");
        const taskID = e.target.getAttribute("data-task-id");
        deleteTaskFromProject(projectID, taskID);
    }
});