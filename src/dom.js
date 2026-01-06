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
import deleteIcon from "./assets/icons/delete-forever.svg";

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
    const projectListDisplay = document.querySelector("#projects > ul");
    projectListDisplay.replaceChildren(); // Clear existing list

    projectList.forEach(project => {
        const projectItem = document.createElement("li");
        projectItem.textContent = project.name;
        projectItem.setAttribute("data-id", project.id);
        projectItem.classList.add("project-item");

        const deleteBtn = document.createElement("button");
        const deleteIconImg = document.createElement("img");
        deleteIconImg.alt = "Delete Icon";
        deleteIconImg.classList.add("project-btn-icon");
        deleteIconImg.src = deleteIcon;

        
        deleteBtn.type = "button";
        deleteBtn.classList.add("delete-project-btn", "delete-btn");
        deleteBtn.setAttribute("data-id", project.id);
        deleteBtn.appendChild(deleteIconImg);

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

function renderSelectedProject(projectID) {
    const project = projectList.find(proj => proj.id === projectID);
    if (!project) return;

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
    taskPriorityLegendDiv.innerHTML = `
        <span>Priority Level:</span>
        <div class="priority-color-level"> 
            <div class="priority-color-box high"></div> High
        </div>
        <div class="priority-color-level"> 
            <div class="priority-color-box medium"></div> Medium
        </div>
        <div class="priority-color-level"> 
            <div class="priority-color-box low"></div> Low
        </div>
    `;
    mainContent.appendChild(taskPriorityLegendDiv);

    // Task list container
    const taskListSection = document.createElement("section");
    taskListSection.id = "tasklist-container";
    project.taskList.forEach(task => projectTaskPreview(task, taskListSection));
    mainContent.appendChild(taskListSection);

    // Update state & sidebar highlight
    activeProjectID = projectID;
    highlightActiveProject(activeProjectID);
}

function highlightActiveProject(activeProjectID) {
    document.querySelector("#projects li.active")?.classList.remove("active");
    document.querySelector(`#projects li[data-id="${activeProjectID}"]`)?.classList.add("active");
}

function projectTaskPreview(task, container) {
    const taskArticle = document.createElement("article");
    taskArticle.classList.add("task-box-preview", getTaskPriorityClass(task.priority));

    taskArticle.dataset.projectId = task.projectID;
    taskArticle.dataset.taskId = task.id;

    const taskTitle = document.createElement("h3");
    taskTitle.textContent = task.title;

    const taskDueDate = document.createElement("p");
    taskDueDate.textContent = `Due: ${task.dueDate}`;

    taskArticle.append(taskTitle, taskDueDate);
    container.appendChild(taskArticle);
}


// ============================================================================
// Task Rendering & Modals
// ============================================================================

function openTaskView(projectID, taskID) {
    const project = projectList.find(p => p.id === projectID);
    if (!project) return;
    const task = project.taskList.find(t => t.id === taskID);
    if (!task) return;

    const modalContent = document.querySelector("#view-task-modal > div:first-child");
    modalContent.replaceChildren();

    const title = document.createElement("h3");
    title.textContent = task.title;

    const desc = document.createElement("p");
    desc.textContent = task.description || "No description";

    const due = document.createElement("p");
    due.textContent = `Due: ${task.dueDate}`;

    const priority = document.createElement("p");
    priority.textContent = `Priority: ${task.priority}`;

    // Attach projectID & taskID to buttons
    const deleteBtn = document.querySelector("#view-task-modal .delete-task-btn");
    const editBtn = document.querySelector("#view-task-modal .edit-btn");
    [deleteBtn, editBtn].forEach(btn => {
        btn.dataset.projectId = task.projectID;
        btn.dataset.taskId = task.id;
    });

    modalContent.append(title, desc, due, priority);
    taskBoxDialog.showModal();
}

function getTaskPriorityClass(priority) {
    return priorityClasses[priority];
}


// ============================================================================
// Event Listeners
// ============================================================================

const addProjectBtn = document.getElementById("add-project-btn");
addProjectBtn.addEventListener("click", () => {
    const projectNameInput = document.querySelector("#new-project input");
    if (!projectNameInput.checkValidity()) {
        projectNameInput.reportValidity();
        return;
    }
    const projectName = projectNameInput.value.trim();
    addProject(projectName);
    projectNameInput.value = "";
});

// Sidebar click (select & delete project)
document.getElementById("projects").addEventListener("click", e => {
    const deleteBtn = e.target.closest(".delete-project-btn");
    if (deleteBtn) {
        const id = deleteBtn.dataset.id;
        deleteProject(id);
        if (activeProjectID === id) {
            document.getElementById("main-content").replaceChildren();
            activeProjectID = null;
        }
        return;
    }
    if (e.target.dataset.id) {
        renderSelectedProject(e.target.dataset.id);
    }
});

const taskFormDialog = document.getElementById("task-modal");
const taskBoxDialog = document.getElementById("view-task-modal");

let editingTask = null;

// Main content click (open task or show task modal)
document.getElementById("main-content").addEventListener("click", e => {
    if (e.target.id === "add-task-btn") {
        editingTask = null; // Reset edit mode
        taskFormDialog.showModal();
        return;
    }

    const taskPreview = e.target.closest(".task-box-preview");
    if (taskPreview) {
        openTaskView(taskPreview.dataset.projectId, taskPreview.dataset.taskId);
    }
});

// Task form modal (Add or Edit)
taskFormDialog.addEventListener("click", e => {
    const form = document.querySelector("#task-modal form");

    if (e.target.classList.contains("close-modal-btn")) {
        form.reset();
        editingTask = null;
        taskFormDialog.close();
        return;
    }

    if (e.target.id === "save-task-btn") {
        e.preventDefault();
        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }

        const title = form.elements["task-title"].value;
        const desc = form.elements["task-desc"].value;
        const dueDate = form.elements["task-due-date"].value;
        const priority = form.elements["task-priority"].value;

        if (editingTask) {
            const project = projectList.find(p => p.id === editingTask.projectID);
            const task = project.taskList.find(t => t.id === editingTask.taskID);
            task.title = title;
            task.description = desc;
            task.dueDate = dueDate;
            task.priority = priority;
            renderSelectedProject(editingTask.projectID);
            editingTask = null;
        } else {
            addTaskToProject(activeProjectID, title, desc, dueDate, priority);
        }

        form.reset();
        taskFormDialog.close();
    }
});

// Task view modal (Edit / Delete / Close)
taskBoxDialog.addEventListener("click", e => {

    if (e.target.classList.contains("close-modal-btn")) {
        taskBoxDialog.close();
        return;
    }

    if (e.target.classList.contains("delete-task-btn")) {
        const { projectId, taskId } = e.target.dataset;
        deleteTaskFromProject(projectId, taskId);
        taskBoxDialog.close();
        return;
    }

    if (e.target.classList.contains("edit-btn")) {
        const { projectId, taskId } = e.target.dataset;
        const project = projectList.find(p => p.id === projectId);
        const task = project.taskList.find(t => t.id === taskId);
        if (!task) return;

        // Prefill form
        const form = document.querySelector("#task-modal form");
        form.elements["task-title"].value = task.title;
        form.elements["task-desc"].value = task.description;
        form.elements["task-due-date"].value = task.dueDate;
        form.elements["task-priority"].value = task.priority;

        editingTask = { projectID: projectId, taskID: taskId };
        taskFormDialog.showModal();
    }
});


// ============================================================================
// Application State & Initialization
// ============================================================================

let activeProjectID = null;
renderProjects();
