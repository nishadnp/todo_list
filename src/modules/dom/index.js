// ============================================================================
// Imports
// ============================================================================

import { projectList, toggleTaskCompleteStatus } from "../data/projects.js";
import { renderProjects, addProject, deleteProject, editProjectNameUI } from "./sidebar.js";
import { renderSelectedProject, addTaskToProject, deleteTaskFromProject } from "./projectView.js";
import { openTaskView } from "./taskView.js";
import { getProjectItemNode } from "./utils.js";
import { activeProjectID, setActiveProjectID } from "./state.js";

// ============================================================================
// Event Listeners Setup
// ============================================================================

const addProjectBtn = document.getElementById("add-project-btn");
const taskFormDialog = document.getElementById("task-modal");
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
            setActiveProjectID(null);
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
const taskBoxDialog = document.getElementById("view-task-modal");
taskBoxDialog.addEventListener("click", e => {
    if (e.target.classList.contains("close-modal-btn")) {
        taskBoxDialog.close();
        return;
    }

    if (e.target.classList.contains("task-complete-status")) {
        const { projectId, taskId } = e.target.closest("#view-task-modal").querySelector(".edit-btn").dataset;
        toggleTaskCompleteStatus(projectId, taskId);
        // Re-render the project to update the main view
        renderSelectedProject(projectId);
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

        taskBoxDialog.close();
        taskFormDialog.showModal();
    }
});

// ============================================================================
// Initialization
// ============================================================================

renderProjects();
