// ============================================================================
// Imports
// ============================================================================

import deleteIcon from "../../assets/icons/delete-forever.svg";
import editIcon from "../../assets/icons/edit-icon.svg";
import checkOkayIcon from "../../assets/icons/check-okay-icon.svg";
import { projectList, createProject, removeProject } from "../data/projects.js";
import { createIconButton } from "./utils.js";
import { activeProjectID } from "./state.js";
import { highlightActiveProject } from "./projectView.js";

// ============================================================================
// Sidebar Functions
// ============================================================================

/**
 * Render all projects in the sidebar.
 */
export function renderProjects() {
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
export function editProjectNameUI(projectItemNode) {
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
        highlightActiveProject(activeProjectID);
    }
}

/**
 * Add new project.
 */
export function addProject(projectName) {
    createProject(projectName);
    renderProjects();
}

/**
 * Delete project.
 */
export function deleteProject(projectID) {
    removeProject(projectID);
    renderProjects();
}