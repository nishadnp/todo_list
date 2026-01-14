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

// Array to hold all the projects
const projectList = [
    new Project("Inbox")
];

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
        project.taskList.push(new Task(projectID, title, description, dueDate, priority));
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

function toggleTaskCompleteStatus(projectID, taskID) {
    const project = projectList.find(proj => proj.id === projectID);
    if (project) {
        const task = project.taskList.find(task => task.id === taskID);
        if (task) task.toggleCompleted();
    }
}

seedDefaultProjects();

export { projectList, createProject, removeProject, createTask, removeTask, toggleTaskCompleteStatus };