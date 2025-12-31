
class Project {
    constructor(name) {
        this.name = name;
        this.taskList = [];
        this.id = crypto.randomUUID();
    }
}

const projectList = [];

function createProject(projectName) {
    projectList.push(new Project(projectName));
}

