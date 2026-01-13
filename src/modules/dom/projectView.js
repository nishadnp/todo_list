// ============================================================================
// Imports
// ============================================================================

import { projectList, createTask, removeTask } from "../data/projects.js";
import { getTaskPriorityClass } from "./utils.js";
import { activeProjectID, setActiveProjectID } from "./state.js";

// ============================================================================
// Task Actions
// ============================================================================

export function addTaskToProject(projectID, title, description, dueDate, priority) {
    createTask(projectID, title, description, dueDate, priority);
    renderSelectedProject(projectID);
}

export function deleteTaskFromProject(projectID, taskID) {
    removeTask(projectID, taskID);
    renderSelectedProject(projectID);
}

// ============================================================================
// Project Selection & UI State
// ============================================================================

/**
 * Render selected project and its tasks in main area.
 */
export function renderSelectedProject(projectID) {
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

    setActiveProjectID(projectID);
    highlightActiveProject(activeProjectID);
}

export function highlightActiveProject(activeProjectID) {
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