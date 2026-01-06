/**
 * dom.js
 *
 * Handles all DOM rendering and user interactions.
 * Owns UI state (active project) and delegates data
 * mutations to projects.js.
 */



// ============================================================================
// Imports & Constants
// ============================================================================

import { projectList, createProject, removeProject, createTask, removeTask } from "./projects.js";

// CSS classes for task priorities
const priorityClasses = {
    High: "high-priority-task",
    Medium: "medium-priority-task",
    Low: "low-priority-task"
};


// ============================================================================
// Sidebar – Project List Rendering
// ============================================================================

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
        deleteBtn.textContent = "- Delete";
        deleteBtn.type = "button";
        deleteBtn.classList.add("delete-project-btn", "delete-btn");
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


// ==================================================
// Task Actions (UI Coordination)
// ==================================================

function addTaskToProject(projectID, title, description, dueDate, priority) {
    createTask(projectID, title, description, dueDate, priority);
    renderSelectedProject(projectID);
}

function deleteTaskFromProject(projectID, taskID) {
    removeTask(projectID, taskID);
    renderSelectedProject(projectID);
}


// ============================================================================
// Project Selection & UI State
// ============================================================================

// Function to render the selected project's tasks
function renderSelectedProject(projectID) {
    
    const project = projectList.find(proj => proj.id === projectID);    

    if (project) {

        const mainContent = document.getElementById("main-content");
        
        mainContent.replaceChildren(); // Clear previous content

        // Project Header
        const projectHeader = document.createElement("h2");
        projectHeader.textContent = project.name;
        mainContent.appendChild(projectHeader);

        // Add Task Button
        const addTaskBtn = document.createElement("button");
        addTaskBtn.textContent = "+ New Task";
        addTaskBtn.type = "button";
        addTaskBtn.classList.add("add-btn");
        addTaskBtn.id = "add-task-btn";
        mainContent.appendChild(addTaskBtn);

        // Task Priority Legend
        const taskPriorityLegendDiv = document.createElement("div");
        taskPriorityLegendDiv.id = "task-priority-legend";
        taskPriorityLegendDiv.innerHTML = `<span>Priority Level:</span>
        <div class="priority-color-level"> 
            <div class="priority-color-box high"></div> High
        </div>
        <div class="priority-color-level"> 
            <div class="priority-color-box medium"></div> Medium
        </div>
        <div class="priority-color-level"> 
            <div class="priority-color-box low"></div> Low
        </div>`;

        mainContent.appendChild(taskPriorityLegendDiv);

        // Section to hold the task list
        const taskListSection = document.createElement("section");
        taskListSection.id = "tasklist-container";

        // Render each task in the project
        project.taskList.forEach(task => renderTask(task, taskListSection));

        mainContent.appendChild(taskListSection);
    }

    // Update application state to reflect the selected project
    activeProjectID = projectID;

    // Visually highlight the selected project in the sidebar
    highlightActiveProject(activeProjectID);
}

// Function to highlight current selected project by adding/removing .active class
function highlightActiveProject(activeProjectID) {
    
    // Remove highlight from any previously active project (if one exists)
    document
        .querySelector("#projects li.active")
        ?.classList.remove("active");

    // Highlight the newly selected project
    document
        .querySelector(`#projects li[data-id="${activeProjectID}"]`)
        ?.classList.add("active");
}


// ============================================================================
// Task Rendering
// ============================================================================

// Function to render an individual task
function renderTask(task, container) {
    const taskArticle = document.createElement("article");
    taskArticle.classList.add("task-box", getTaskPriorityClass(task.priority));

    const taskTitle = document.createElement("h3");
    taskTitle.textContent = task.title;
    taskArticle.appendChild(taskTitle);

    // Accessibility: announce priority
    taskArticle.setAttribute("aria-label", `${task.priority} Priority`);

    const taskDescription = document.createElement("p");
    taskDescription.textContent = task.description;
    taskArticle.appendChild(taskDescription);

    const taskDueDate = document.createElement("p");
    taskDueDate.textContent = `Due: ${task.dueDate}`;
    taskArticle.appendChild(taskDueDate);

    const deleteTaskBtn = document.createElement("button");
    deleteTaskBtn.textContent = "- Task";
    deleteTaskBtn.type = "button";
    deleteTaskBtn.classList.add("delete-task-btn", "delete-btn");
    deleteTaskBtn.setAttribute("data-project-id", task.projectID);
    deleteTaskBtn.setAttribute("data-task-id", task.id); 
    taskArticle.appendChild(deleteTaskBtn);

    container.appendChild(taskArticle);
}

// Function to get CSS class based on task priority
function getTaskPriorityClass(priority) {
    return priorityClasses[priority];
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
});


// ============================================================================
// Event Handlers – Sidebar
// ============================================================================

// Event delegation for deleting a project and selecting a project
document.getElementById("projects").addEventListener("click", e => {
    
    // Handle project deletion
    if (e.target.classList.contains("delete-project-btn")) {
        deleteProject(e.target.getAttribute("data-id"));

        // Clear main content if the deleted project was the active one
        if (activeProjectID === e.target.getAttribute("data-id")) {
            const mainContent = document.getElementById("main-content");
            mainContent.replaceChildren(); // Clear content
            activeProjectID = null;
        }

        return; // Exit to avoid accidentally triggering project selection 
    }

    // Handle project selection
    if (e.target.dataset.id) {
        renderSelectedProject(e.target.dataset.id);
    }
});


// ============================================================================
// Event Handlers – Tasks & Dialog
// ============================================================================

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


// ============================================================================
// Application State & Initialization
// ============================================================================

// Variable to keep track of the currently active project
let activeProjectID = null;

// Initial render of projects
renderProjects();