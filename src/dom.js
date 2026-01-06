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
import editIcon from "./assets/icons/edit-icon.svg";
import checkOkayIcon from "./assets/icons/check-okay-icon.svg";

// CSS classes for task priorities
const priorityClasses = {
    High: "high-priority-task",
    Medium: "medium-priority-task",
    Low: "low-priority-task"
};

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Creates a button with an icon image.
 * @param {Object} params
 * @param {string} params.id - optional button id
 * @param {Array} params.classes - array of class names
 * @param {string} params.iconSrc - icon image source
 * @param {string} params.alt - alt text for image
 * @param {Object} params.dataset - key-value pairs for data attributes
 * @returns {HTMLElement} button element with icon
 */
function createIconButton({ id, classes = [], iconSrc, alt, dataset = {} }) {
    const btn = document.createElement("button");
    btn.type = "button";
    if (id) btn.id = id;
    btn.classList.add(...classes);

    const img = document.createElement("img");
    img.src = iconSrc;
    img.alt = alt;
    img.classList.add("project-btn-icon");
    btn.appendChild(img);

    for (const key in dataset) {
        btn.dataset[key] = dataset[key];
    }

    return btn;
}

/**
 * Returns the closest li.project-item element from a child node.
 * @param {HTMLElement} el
 */
function getProjectItemNode(el) {
    return el.closest("li.project-item");
}

/**
 * Commits a project name edit.
 * @param {HTMLElement} projectItemNode
 * @param {HTMLInputElement} input
 * @param {string} projectID
 */
function commitProjectEdit(projectItemNode, input, projectID) {
    const newName = input.value.trim();
    if (!newName) return;

    const project = projectList.find(p => p.id === projectID);
    project.name = newName;

    renderProjects();

    if (activeProjectID === projectID) {
        highlightActiveProject(projectID);
    }
}

/**
 * Get the CSS class for a task based on priority.
 * @param {string} priority
 */
function getTaskPriorityClass(priority) {
    return priorityClasses[priority];
}

// ============================================================================
// Sidebar – Project List Rendering
// ============================================================================

/**
 * Render all projects in the sidebar.
 */
function renderProjects() {
    const projectListDisplay = document.querySelector("#projects > ul");
    projectListDisplay.replaceChildren(); // Clear existing list

    projectList.forEach(project => {
        const projectItem = document.createElement("li");
        projectItem.classList.add("project-item");
        projectItem.dataset.id = project.id;

        // Project name text node
        const nameTextNode = document.createTextNode(project.name);
        projectItem.appendChild(nameTextNode);

        // Buttons container
        const buttonDiv = document.createElement("div");

        // Edit button
        const editBtn = createIconButton({
            classes: ["edit-project-btn"],
            iconSrc: editIcon,
            alt: "Edit Icon",
            dataset: { id: project.id }
        });

        // Delete button
        const deleteBtn = createIconButton({
            classes: ["delete-project-btn", "delete-btn"],
            iconSrc: deleteIcon,
            alt: "Delete Icon",
            dataset: { id: project.id }
        });

        buttonDiv.append(editBtn, deleteBtn);
        projectItem.appendChild(buttonDiv);

        projectListDisplay.appendChild(projectItem);
    });
}

/**
 * Replace project name with input and swap edit icon for check icon.
 * @param {HTMLElement} projectItemNode
 */
function editProjectNameUI(projectItemNode) {
    const projectID = projectItemNode.dataset.id;
    const project = projectList.find(p => p.id === projectID);
    if (!project) return;

    // Prevent double-editing
    if (projectItemNode.querySelector("input")) return;

    // Extract existing elements
    const nameText = projectItemNode.firstChild;
    const buttonDiv = projectItemNode.querySelector("div");
    const editBtn = buttonDiv.querySelector(".edit-project-btn");

    // Create input
    const input = document.createElement("input");
    input.type = "text";
    input.value = project.name;
    input.classList.add("edit-project-input");

    projectItemNode.replaceChild(input, nameText);
    input.focus();
    input.select();

    // Swap edit icon → check icon
    editBtn.replaceChildren();
    const checkIconImg = document.createElement("img");
    checkIconImg.src = checkOkayIcon;
    checkIconImg.alt = "Confirm edit";
    checkIconImg.classList.add("project-btn-icon");
    editBtn.appendChild(checkIconImg);

    // Click ✔
    editBtn.addEventListener("click", () => commitProjectEdit(projectItemNode, input, projectID), { once: true });

    // Enter/Escape support
    input.addEventListener("keydown", e => {
        if (e.key === "Enter") commitProjectEdit(projectItemNode, input, projectID);
        if (e.key === "Escape") renderProjects();
    });
}

/**
 * Add new project.
 */
function addProject(projectName) {
    createProject(projectName);
    renderProjects();
}

/**
 * Delete project.
 */
function deleteProject(projectID) {
    removeProject(projectID);
    renderProjects();
}

// ============================================================================
// Task Actions
// ============================================================================

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

/**
 * Render selected project and its tasks in main area.
 */
function renderSelectedProject(projectID) {
    const project = projectList.find(p => p.id === projectID);
    if (!project) return;

    const mainContent = document.getElementById("main-content");
    mainContent.replaceChildren();

    // Project header
    const projectHeader = document.createElement("h2");
    projectHeader.textContent = project.name;
    mainContent.appendChild(projectHeader);

    // Add task button
    const addTaskBtn = document.createElement("button");
    addTaskBtn.textContent = "+ New Task";
    addTaskBtn.type = "button";
    addTaskBtn.classList.add("add-btn");
    addTaskBtn.id = "add-task-btn";
    mainContent.appendChild(addTaskBtn);

    // Priority legend
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

    activeProjectID = projectID;
    highlightActiveProject(activeProjectID);
}

function highlightActiveProject(activeProjectID) {
    document.querySelector("#projects li.active")?.classList.remove("active");
    document.querySelector(`#projects li[data-id="${activeProjectID}"]`)?.classList.add("active");
}

/**
 * Render a task preview box in the main area.
 */
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
// Task Modals
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

    const deleteBtn = document.querySelector("#view-task-modal .delete-task-btn");
    const editBtn = document.querySelector("#view-task-modal .edit-btn");
    [deleteBtn, editBtn].forEach(btn => {
        btn.dataset.projectId = task.projectID;
        btn.dataset.taskId = task.id;
    });

    modalContent.append(title, desc, due, priority);
    taskBoxDialog.showModal();
}

// ============================================================================
// Event Listeners
// ============================================================================

const addProjectBtn = document.getElementById("add-project-btn");
const taskFormDialog = document.getElementById("task-modal");
const taskBoxDialog = document.getElementById("view-task-modal");
let editingTask = null;

// Add project
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

// Sidebar delegation (select, edit, delete project)
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

    const editBtn = e.target.closest(".edit-project-btn");
    if (editBtn) {
        const projectItemNode = getProjectItemNode(editBtn);
        editProjectNameUI(projectItemNode);

        const id = editBtn.dataset.id;
        if (id === activeProjectID) renderSelectedProject(id);
        return;
    }

    if (e.target.dataset.id) {
        renderSelectedProject(e.target.dataset.id);
    }
});

// Main content delegation (open task or new task)
document.getElementById("main-content").addEventListener("click", e => {
    if (e.target.id === "add-task-btn") {
        editingTask = null;
        taskFormDialog.showModal();
        return;
    }
    const taskPreview = e.target.closest(".task-box-preview");
    if (taskPreview) openTaskView(taskPreview.dataset.projectId, taskPreview.dataset.taskId);
});

// Task form modal (Add/Edit)
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

// Task view modal (Edit/Delete/Close)
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
