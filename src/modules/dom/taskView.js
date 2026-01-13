// ============================================================================
// Imports
// ============================================================================

import { projectList } from "../data/projects.js";

import { format, parseISO } from "date-fns";

// ============================================================================
// Task Modals
// ============================================================================

const taskBoxDialog = document.getElementById("view-task-modal");

export function openTaskView(projectID, taskID) {
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
    due.textContent = `Due: ${dateFormatter(task.dueDate)}`;
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

function dateFormatter(date) {
    return format(parseISO(date), "MMM d, yyyy");
}