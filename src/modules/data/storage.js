// ./src/modules/data/storage.js

const STORAGE_KEY = "todo_projects";

/**
 * Save project list to localStorage
 */
export function saveProjects(projectList) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(projectList));
}


/**
 * Load project list from localStorage
 * @returns {Array|null}
 */
export function loadProjects() {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : null;
}
