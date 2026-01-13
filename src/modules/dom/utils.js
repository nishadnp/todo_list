// ============================================================================
// Imports & Constants
// ============================================================================

// CSS classes for task priorities
export const priorityClasses = {
    High: "high-priority-task",
    Medium: "medium-priority-task",
    Low: "low-priority-task"
};

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Creates a button with an icon image.
 * @param {Object} params
 * @param {string} params.id - optional button id
 * @param {Array} params.classes - array of class names
 * @param {string} params.iconSrc - icon image source
 * @param {string} params.alt - alt text for image
 * @param {Object} params.dataset - key-value pairs for data attributes
 * @returns {HTMLElement} button element with icon
 */
export function createIconButton({ id, classes = [], iconSrc, alt, dataset = {} }) {
    const btn = document.createElement("button");
    btn.type = "button";
    if (id) btn.id = id;
    btn.classList.add(...classes);

    const img = document.createElement("img");
    img.src = iconSrc;
    img.alt = alt;
    img.classList.add("project-btn-icon");
    btn.appendChild(img);

    for (const key in dataset) {
        btn.dataset[key] = dataset[key];
    }

    return btn;
}

/**
 * Returns the closest li.project-item element from a child node.
 * @param {HTMLElement} el
 */
export function getProjectItemNode(el) {
    return el.closest("li.project-item");
}

/**
 * Get the CSS class for a task based on priority.
 * @param {string} priority
 */
export function getTaskPriorityClass(priority) {
    return priorityClasses[priority];
}