// dom.js

// This file will handle all DOM manipulations for the To-Do List application

import { projectList, createProject, removeProject, createTask, removeTask } from "./projects.js";

// Function to render the list of projects in the DOM
function renderProjects() {
    // Get the project list container
    const projectListDisplay = document.querySelector("#projects > ul");
    
    projectListDisplay.innerHTML = ""; // Clear existing list

    // List each project in the project list
    projectList.forEach(project => {
        const projectItem = document.createElement("li");
        projectItem.textContent = project.name;
        projectItem.setAttribute("data-id", project.id);
        projectItem.classList.add("project-item");

        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Delete";
        deleteBtn.type = "button";
        deleteBtn.classList.add("delete-project-btn");
        deleteBtn.setAttribute("data-id", project.id);

        projectItem.appendChild(deleteBtn);
        projectListDisplay.appendChild(projectItem);
    });
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

        const taskListSection = document.createElement("section");
        taskListSection.id = "task-list";

        // Render each task in the project
        project.taskList.forEach(task => renderTask(task, taskListSection));

        mainContent.appendChild(taskListSection);
    }
    activeProjectID = projectID;
}

// Function to render an individual task
function renderTask(task, container) {
    const taskArticle = document.createElement("article");
    taskArticle.classList.add("task");

    const taskTitle = document.createElement("h3");
    taskTitle.textContent = task.title;
    taskArticle.appendChild(taskTitle);

    const taskDescription = document.createElement("p");
    taskDescription.textContent = task.description;
    taskArticle.appendChild(taskDescription);

    const dueDateParagraph = document.createElement("p");
    dueDateParagraph.textContent = `Due: ${task.dueDate}`;
    taskArticle.appendChild(dueDateParagraph);

    const priorityParagraph = document.createElement("p");
    priorityParagraph.textContent = `Priority: ${task.priority}`;
    taskArticle.appendChild(priorityParagraph);

    const deleteTaskBtn = document.createElement("button");
    deleteTaskBtn.textContent = "Delete Task";
    deleteTaskBtn.type = "button";
    deleteTaskBtn.classList.add("delete-task-btn");
    deleteTaskBtn.setAttribute("data-project-id", task.projectID);
    deleteTaskBtn.setAttribute("data-task-id", task.id); 
    taskArticle.appendChild(deleteTaskBtn);

    container.appendChild(taskArticle);
}

const addProjectBtn = document.getElementById("add-project-btn");

// Event listener for adding a project
addProjectBtn.addEventListener("click", () => {
    const projectNameInput = document.querySelector("#new-project input");

    // Avoid adding empty project names
    if (!projectNameInput.checkValidity()) {
        projectNameInput.reportValidity();
        return;
    }

    // Remove leading/trailing whitespace from project name
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

const taskDialog = document.getElementById("task-modal");

// Event delegation for adding and deleting tasks within the selected project
document.getElementById("main-content").addEventListener("click", e => {

    if (e.target.id === "add-task-btn") {
        taskDialog.showModal();
        return;
    }

    if (e.target.classList.contains("delete-task-btn")) {
        const projectID = e.target.getAttribute("data-project-id");
        const taskID = e.target.getAttribute("data-task-id");
        deleteTaskFromProject(projectID, taskID);
        return;
    }

});

// Event listener for task form submission
taskDialog.addEventListener("click", e => {

    const taskForm = document.querySelector("#task-modal form");

    if (e.target.id === "close-modal-btn") {
        taskForm.reset();
        taskDialog.close();
        return;
    }

    if (e.target.id === "save-task-btn") {
        e.preventDefault();

        if (!taskForm.checkValidity()) {
            taskForm.reportValidity();
            return;
        }

        const title = taskForm.elements["task-title"].value;
        const description = taskForm.elements["task-desc"].value;
        const dueDate = taskForm.elements["task-due-date"].value;
        const priority = taskForm.elements["task-priority"].value;

        addTaskToProject(activeProjectID, title, description, dueDate, priority);

        taskForm.reset();
        taskDialog.close();
    }


    
});

// Variable to keep track of the currently active project
let activeProjectID = null;

// Initial render of projects
renderProjects();