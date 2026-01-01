// ./src/projects.js

// Project class to represent individual projects
class Project {
    constructor(name) {
        this.name = name;
        this.taskList = [];
        this.id = crypto.randomUUID();
    }
}

// Task class to represent individual tasks within a project
class Task {
    constructor(title, description, dueDate, priority) {
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

const projectList = []; // Array to hold all projects

// Functions to manage projects and tasks

function createProject(projectName) {
    projectList.push(new Project(projectName));
}

function removeProject(projectID) {
    const projectIndex = projectList.findIndex(proj => proj.id === projectID);
    if (projectIndex !== -1) {
        projectList.splice(projectIndex, 1);
    }
}

function createTask(projectID, title, description, dueDate, priority) {
    const project = projectList.find(proj => proj.id === projectID);
    if (project) {
        project.taskList.push(new Task(title, description, dueDate, priority));
    }
}

function removeTask(projectID, taskID) {
    const project = projectList.find(proj => proj.id === projectID);
    if (project) {
        const taskIndex = project.taskList.findIndex(task => task.id === taskID);
        if (taskIndex !== -1) {
            project.taskList.splice(taskIndex, 1);
        }
    }
}

export { projectList, createProject, removeProject, createTask, removeTask };