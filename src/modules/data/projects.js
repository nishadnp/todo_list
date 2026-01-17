// ./src/modules/data/projects.js
//
// Central data module for projects and tasks.
// - Owns application data (Project / Task)
// - Handles persistence via localStorage
// - Exposes a simple API to the DOM layer
//


// ============================================================================
// Imports
// ============================================================================

import { saveProjects, loadProjects } from "./storage.js";


// ============================================================================
// Data Models
// ============================================================================

/**
 * Represents a single project.
 */
class Project {
    constructor(name) {
        this.name = name;
        this.taskList = [];
        this.id = crypto.randomUUID();
    }
}

/**
 * Represents a single task belonging to a project.
 */
class Task {
    constructor(projectID, title, description, dueDate, priority) {
        this.projectID = projectID;
        this.title = title;
        this.description = description;
        this.dueDate = dueDate;
        this.priority = priority;
        this.completed = false;
        this.id = crypto.randomUUID();
    }
    toggleCompleted() {
        this.completed = !this.completed;
    }
}


// ============================================================================
// Application State
// ============================================================================

/**
 * In-memory source of truth for all projects.
 * Reassigned during initialization (rehydration or seeding).
 */
let projectList = [];


// ============================================================================
// Seed Data (First-time users only)
// ============================================================================

/**
 * Populate the Inbox project with starter tasks.
 * Runs only when no localStorage data exists.
 */
function seedDefaultProjects() {
    const inboxProject = projectList[0];

    // Sample tasks for the Inbox project
    inboxProject.taskList.push(
        new Task(inboxProject.id, "Buy", "This is your inbox where all your tasks will appear. Feel free to add, edit, or delete tasks as you like.", "2026-01-07", "High")
    );
    inboxProject.taskList.push(
        new Task(inboxProject.id, "Getting Started", "To create a new project, click on the 'Add Project' button. You can then add tasks to your projects.", "2026-02-22", "Medium")
    );
    inboxProject.taskList.push(
        new Task(inboxProject.id, "Organize Your Tasks", "You can set due dates and priorities for your tasks to help you stay organized and focused.", "2026-05-30", "Low")
    );
}


// ============================================================================
// CRUD Operations (Public API)
// ============================================================================

/**
 * Create a new project.
 */
function createProject(projectName) {
    projectList.push(new Project(projectName));
    saveProjects(projectList);
}

/**
 * Remove a project by ID.
 */
function removeProject(projectID) {
    const projectIndex = projectList.findIndex(proj => proj.id === projectID);
    if (projectIndex !== -1) {
        projectList.splice(projectIndex, 1);
    }
    saveProjects(projectList);

}

/**
 * Create a new task inside a project.
 */
function createTask(projectID, title, description, dueDate, priority) {
    const project = projectList.find(proj => proj.id === projectID);
    if (project) {
        project.taskList.push(new Task(projectID, title, description, dueDate, priority));
    }
    saveProjects(projectList);

}

/**
 * Remove a task from a project.
 */
function removeTask(projectID, taskID) {
    const project = projectList.find(proj => proj.id === projectID);
    if (project) {
        const taskIndex = project.taskList.findIndex(task => task.id === taskID);
        if (taskIndex !== -1) {
            project.taskList.splice(taskIndex, 1);
        }
    }
    saveProjects(projectList);

}

/**
 * Toggle a task's completed state.
 */
function toggleTaskCompleteStatus(projectID, taskID) {
    const project = projectList.find(proj => proj.id === projectID);
    if (project) {
        const task = project.taskList.find(task => task.id === taskID);
        if (task) task.toggleCompleted();
    }
}


// ============================================================================
// Persistence & Rehydration
// ============================================================================

/**
 * Convert plain objects from localStorage back into
 * Project and Task class instances.
 */
function rehydrateProjects(rawProjects) {
    return rawProjects.map(rawProject => {
        const project = new Project(rawProject.name);
        project.id = rawProject.id;

        project.taskList = rawProject.taskList.map(rawTask => {
            const task = new Task(
                rawTask.projectID,
                rawTask.title,
                rawTask.description,
                rawTask.dueDate,
                rawTask.priority
            );
            task.id = rawTask.id;
            task.completed = rawTask.completed;
            return task;
        });

        return project;
    });
}


// ============================================================================
// Initialization
// ============================================================================

const storedProjects = loadProjects();

if (storedProjects) {
    // Restore previous session
    projectList = rehydrateProjects(storedProjects);
}
else {
    // First-time user setup
    projectList = [new Project("Inbox")];
    seedDefaultProjects();
    saveProjects(projectList);
}


// ============================================================================
// Exports
// ============================================================================

export { 
    projectList, 
    createProject, 
    removeProject, 
    createTask, 
    removeTask, 
    toggleTaskCompleteStatus 
};