// ./src/projects.js

    
class Project {
    constructor(name) {
        this.name = name;
        this.taskList = [];
        this.id = crypto.randomUUID();
    }
}


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

const projectList = [];

function createProject(projectName) {
    projectList.push(new Project(projectName));
}

function createTask(projectID, title, description, dueDate, priority) {
    const project = projectList.find(proj => proj.id === projectID);
    if (project) {
        project.taskList.push(new Task(title, description, dueDate, priority));
    }
}