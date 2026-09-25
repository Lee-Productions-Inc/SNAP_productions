// ============================================
// SNAP TASK SYSTEM
// ============================================


// ============================================
// GET HTML ELEMENTS
// ============================================

const newTaskButton =
    document.getElementById("newTaskButton");

const taskModal =
    document.getElementById("taskModal");

const closeTaskModal =
    document.getElementById("closeTaskModal");

const taskForm =
    document.getElementById("taskForm");

const taskTitle =
    document.getElementById("taskTitle");

const taskCategory =
    document.getElementById("taskCategory");

const customCategory =
    document.getElementById("customCategory");

const taskDueDate =
    document.getElementById("taskDueDate");

const taskDueTime =
    document.getElementById("taskDueTime");

const taskReminder =
    document.getElementById("taskReminder");

const taskDescription =
    document.getElementById("taskDescription");

const myTasksGrid =
    document.getElementById("myTasksGrid");

const overdueTasksGrid =
    document.getElementById("overdueTasksGrid");

const completedTasksGrid =
    document.getElementById("completedTasksGrid");

const taskSearch =
    document.getElementById("taskSearch");

const taskFilters =
    document.querySelectorAll(".task-filter");

let activeCategory = "All";


// ============================================
// EDIT TASK ELEMENTS
// ============================================

const editTaskModal =
    document.getElementById("editTaskModal");

const closeEditTaskModal =
    document.getElementById(
        "closeEditTaskModal"
    );

const editTaskForm =
    document.getElementById("editTaskForm");

const editTaskTitle =
    document.getElementById("editTaskTitle");

const editTaskCategory =
    document.getElementById(
        "editTaskCategory"
    );

const editCustomCategory =
    document.getElementById(
        "editCustomCategory"
    );

const editTaskDueDate =
    document.getElementById(
        "editTaskDueDate"
    );

const editTaskDueTime =
    document.getElementById(
        "editTaskDueTime"
    );

const editTaskReminder =
    document.getElementById(
        "editTaskReminder"
    );

const editTaskDescription =
    document.getElementById(
        "editTaskDescription"
    );

let editingTaskId = null;


// ============================================
// CUSTOM CATEGORY
// ============================================


// NEW TASK CUSTOM CATEGORY

taskCategory.addEventListener(
    "change",
    function () {

        if (
            taskCategory.value ===
            "Customize"
        ) {

            customCategory.style.display =
                "block";

            customCategory.required =
                true;

            customCategory.focus();

        }
        else {

            customCategory.style.display =
                "none";

            customCategory.required =
                false;

            customCategory.value = "";

        }

    }
);


// EDIT TASK CUSTOM CATEGORY

editTaskCategory.addEventListener(
    "change",
    function () {

        if (
            editTaskCategory.value ===
            "Customize"
        ) {

            editCustomCategory.style.display =
                "block";

            editCustomCategory.required =
                true;

            editCustomCategory.focus();

        }
        else {

            editCustomCategory.style.display =
                "none";

            editCustomCategory.required =
                false;

            editCustomCategory.value = "";

        }

    }
);


// ============================================
// TASK STORAGE
// ============================================

let tasks = JSON.parse(
    localStorage.getItem("snapTasks")
) || [];


// ============================================
// SAVE TASKS
// ============================================

function saveTasks() {

    localStorage.setItem(
        "snapTasks",
        JSON.stringify(tasks)
    );

}


// ============================================
// OPEN NEW TASK MODAL
// ============================================

newTaskButton.addEventListener(
    "click",
    function () {

        taskModal.classList.add("show");

        taskModal.setAttribute(
            "aria-hidden",
            "false"
        );

        taskTitle.focus();

    }
);


// ============================================
// CLOSE NEW TASK MODAL
// ============================================

function closeModal() {

    taskModal.classList.remove(
        "show"
    );

    taskModal.setAttribute(
        "aria-hidden",
        "true"
    );

}

closeTaskModal.addEventListener(
    "click",
    closeModal
);


// ============================================
// CREATE NEW TASK
// ============================================

taskForm.addEventListener(
    "submit",
    function (event) {

        event.preventDefault();


        const categoryValue =
            taskCategory.value ===
            "Customize"

                ? customCategory.value.trim()

                : taskCategory.value.trim();


        const newTask = {

            id: Date.now(),

            title:
                taskTitle.value.trim(),

            category:
                categoryValue,

            dueDate:
                taskDueDate.value,

            dueTime:
                taskDueTime.value,

            reminder:
                taskReminder.value,

            description:
                taskDescription.value.trim(),

            completed:
                false,

            createdAt:
                new Date().toISOString()

        };


        if (
            !newTask.title ||
            !newTask.category ||
            !newTask.dueDate
        ) {

            alert(
                "Please fill in the required fields."
            );

            return;

        }


        tasks.push(newTask);

        saveTasks();

        renderTasks();


        taskForm.reset();


        customCategory.style.display =
            "none";

        customCategory.required =
            false;

        customCategory.value =
            "";


        closeModal();

    }
);


// ============================================
// CHECK IF OVERDUE
// ============================================

function isOverdue(task) {

    if (task.completed) {

        return false;

    }

    if (!task.dueDate) {

        return false;

    }


    // If the task has a time,
    // compare the exact date and time.

    if (task.dueTime) {

        const dueDateTime =
            new Date(
                task.dueDate +
                "T" +
                task.dueTime +
                ":00"
            );

        return dueDateTime < new Date();

    }


    // If there is no time,
    // the task remains active until
    // the end of its due date.

    const dueDate =
        new Date(
            task.dueDate +
            "T23:59:59"
        );

    return dueDate < new Date();

}


// ============================================
// FORMAT DATE
// ============================================

function formatDate(dateString) {

    if (!dateString) {

        return "";

    }


    const date =
        new Date(
            dateString +
            "T00:00:00"
        );


    return date.toLocaleDateString(
        "en-US",
        {
            month: "short",
            day: "numeric",
            year: "numeric"
        }
    );

}


// ============================================
// FORMAT TIME
// ============================================

function formatTime(timeString) {

    if (!timeString) {

        return "";

    }


    const parts =
        timeString.split(":");


    let hours =
        parseInt(
            parts[0],
            10
        );

    const minutes =
        parts[1];


    const period =
        hours >= 12
            ? "PM"
            : "AM";


    hours =
        hours % 12 || 12;


    return (
        hours +
        ":" +
        minutes +
        " " +
        period
    );

}


// ============================================
// GET TASK STATUS
// ============================================

function getTaskStatus(task) {

    if (task.completed) {

        return "completed";

    }


    if (isOverdue(task)) {

        return "overdue";

    }


    return "in-progress";

}


// ============================================
// CREATE TASK CARD
// ============================================

function createTaskCard(task) {

    const card =
        document.createElement("div");

    card.className =
        "task-card";


    // ========================================
    // GET STATUS
    // ========================================

    const taskStatus =
        getTaskStatus(task);


    // Add status class

    card.classList.add(
        "status-" + taskStatus
    );


    // ----------------------------------------
    // TOP ROW
    // ----------------------------------------

    const topRow =
        document.createElement("div");

    topRow.className =
        "task-card-top";


    // ========================================
    // CATEGORY
    // ========================================

    const category =
        document.createElement("div");

    category.className =
        "task-card-category";


    // ========================================
    // FILE-TEXT ICON
    // ========================================

    const categoryIcon =
        document.createElement("span");

    categoryIcon.className =
        "task-category-icon";


    // Add status class to the icon

    categoryIcon.classList.add(
        "task-category-icon-" +
        taskStatus
    );


    // Create the SVG image

    const categoryIconImage =
        document.createElement("img");

    categoryIconImage.src =
        "../../assets/file-text.svg";

    categoryIconImage.alt =
        "";

    categoryIconImage.setAttribute(
        "aria-hidden",
        "true"
    );


    // Put the SVG inside the icon circle

    categoryIcon.appendChild(
        categoryIconImage
    );


    const categoryText =
        document.createElement("span");

    categoryText.textContent =
        task.category;


    category.appendChild(
        categoryIcon
    );

    category.appendChild(
        categoryText
    );


    // ========================================
    // THREE-DOT MENU
    // ========================================

    const menuWrapper =
        document.createElement("div");

    menuWrapper.className =
        "task-menu-wrapper";


    const menuButton =
        document.createElement("button");

    menuButton.type =
        "button";

    menuButton.className =
        "task-menu-button";

    menuButton.textContent =
        "•••";


    const menu =
        document.createElement("div");

    menu.className =
        "task-menu";


    // ========================================
    // EDIT
    // ========================================

    const editButton =
        document.createElement("button");

    editButton.type =
        "button";

    editButton.textContent =
        "Edit task";


    editButton.addEventListener(
        "click",
        function () {

            menu.classList.remove(
                "show"
            );

            openEditTask(
                task.id
            );

        }
    );


    // ========================================
    // COMPLETE / MARK ACTIVE
    // ========================================

    const completeMenuButton =
        document.createElement("button");

    completeMenuButton.type =
        "button";

    completeMenuButton.textContent =
        task.completed
            ? "Mark active"
            : "Complete task";


    completeMenuButton.addEventListener(
        "click",
        function () {

            menu.classList.remove(
                "show"
            );


            if (task.completed) {

                task.completed =
                    false;

                delete task.completedAt;

                saveTasks();

                renderTasks(
                    taskSearch.value
                );

            }
            else {

                completeTask(
                    task.id
                );

            }

        }
    );


    // ========================================
    // DELETE
    // ========================================

    const deleteMenuButton =
        document.createElement("button");

    deleteMenuButton.type =
        "button";

    deleteMenuButton.className =
        "delete-menu-button";

    deleteMenuButton.textContent =
        "Delete task";


    deleteMenuButton.addEventListener(
        "click",
        function () {

            menu.classList.remove(
                "show"
            );

            deleteTask(
                task.id
            );

        }
    );


    menu.appendChild(
        editButton
    );

    menu.appendChild(
        completeMenuButton
    );

    menu.appendChild(
        deleteMenuButton
    );


    menuButton.addEventListener(
        "click",
        function (event) {

            event.stopPropagation();


            document
                .querySelectorAll(
                    ".task-menu.show"
                )
                .forEach(
                    function (openMenu) {

                        if (
                            openMenu !==
                            menu
                        ) {

                            openMenu.classList.remove(
                                "show"
                            );

                        }

                    }
                );


            menu.classList.toggle(
                "show"
            );

        }
    );


    menuWrapper.appendChild(
        menuButton
    );

    menuWrapper.appendChild(
        menu
    );


    topRow.appendChild(
        category
    );

    topRow.appendChild(
        menuWrapper
    );


    // ========================================
    // TITLE
    // ========================================

    const title =
        document.createElement("h3");

    title.className =
        "task-card-title";

    title.textContent =
        task.title;


    // ========================================
    // DESCRIPTION
    // ========================================

    const description =
        document.createElement("p");

    description.className =
        "task-card-description";

    description.textContent =
        task.description ||
        "No description provided.";


    // ========================================
    // DUE DATE
    // ========================================

    const due =
        document.createElement("div");

    due.className =
        "task-card-due";


    const dueIcon =
        document.createElement("span");

    dueIcon.className =
        "task-due-icon";


    const dueIconImage =
        document.createElement("img");

    dueIconImage.alt =
        "";

    dueIconImage.setAttribute(
        "aria-hidden",
        "true"
    );


    const dueText =
        document.createElement("span");


    // ========================================
    // COMPLETED
    // ========================================

    if (
        taskStatus ===
        "completed"
    ) {

        dueIcon.textContent =
            "✓";

        let text =
            "Completed";

        if (task.dueDate) {

            text +=
                " • Due " +
                formatDate(
                    task.dueDate
                );

        }

        if (task.dueTime) {

            text +=
                " at " +
                formatTime(
                    task.dueTime
                );

        }

        dueText.textContent =
            text;

        due.classList.add(
            "completed-due"
        );

    }

    // ========================================
    // OVERDUE
    // ========================================

    else if (
        taskStatus ===
        "overdue"
    ) {

        dueIcon.textContent =
            "⚠";

        let text =
            "Overdue";

        if (task.dueDate) {

            text +=
                " • Due " +
                formatDate(
                    task.dueDate
                );

        }

        if (task.dueTime) {

            text +=
                " at " +
                formatTime(
                    task.dueTime
                );

        }

        dueText.textContent =
            text;

        due.classList.add(
            "overdue-due"
        );

    }

    // ========================================
    // IN PROGRESS
    // ========================================

    else {

        dueIcon.textContent =
            "◷";

        let text =
            "Due " +
            formatDate(
                task.dueDate
            );

        if (task.dueTime) {

            text +=
                " at " +
                formatTime(
                    task.dueTime
                );

        }

        dueText.textContent =
            text;

        due.classList.add(
            "in-progress-due"
        );

    }


    due.appendChild(
        dueIcon
    );

    due.appendChild(
        dueText
    );


    // ========================================
    // BOTTOM ACTIONS
    // ========================================

    const actions =
        document.createElement("div");

    actions.className =
        "task-card-actions";


    // ========================================
    // REMINDER BUTTON
    // ========================================

    if (!task.completed) {

        const reminderButton =
            document.createElement("button");

        reminderButton.type =
            "button";

        reminderButton.className =
            task.reminder

                ? "reminder-task-button reminder-task-button-on"

                : "reminder-task-button reminder-task-button-off";

        // Reminder icon

        const reminderIcon =
            document.createElement("span");

        reminderIcon.className =
            "reminder-icon";

        reminderIcon.textContent =
            "!";

        // Reminder text

        const reminderText =
            document.createElement("span");

        reminderText.textContent =
            task.reminder

                ? "Reminder on"

                : "Reminder off";

        reminderButton.appendChild(
            reminderIcon
        );

        reminderButton.appendChild(
            reminderText
        );

        reminderButton.addEventListener(
            "click",
            function () {

                toggleReminder(
                    task.id
                );

            }
        );

        actions.appendChild(
            reminderButton
        );

    }

    // ========================================
    // COMPLETED BUTTON
    // ========================================

    else {

        const completedButton =
            document.createElement("button");

        completedButton.type =
            "button";

        completedButton.className =
            "completed-task-button";

        // Check icon

        const completedIcon =
            document.createElement("span");

        completedIcon.className =
            "completed-icon";

        completedIcon.textContent =
            "✓";

        // Text

        const completedText =
            document.createElement("span");

        completedText.textContent =
            "Complete";

        completedButton.appendChild(
            completedIcon
        );

        completedButton.appendChild(
            completedText
        );

        actions.appendChild(
            completedButton
        );

    }


    // ========================================
    // ADD EVERYTHING TO CARD
    // ========================================

    card.appendChild(
        topRow
    );

    card.appendChild(
        title
    );

    card.appendChild(
        description
    );

    card.appendChild(
        due
    );

    card.appendChild(
        actions
    );


    return card;

}


// ============================================
// RENDER TASKS
// ============================================

function renderTasks(
    searchTerm = ""
) {

    myTasksGrid.innerHTML =
        "";

    overdueTasksGrid.innerHTML =
        "";

    completedTasksGrid.innerHTML =
        "";


    const search =
        searchTerm.toLowerCase();


    const filteredTasks =
        tasks.filter(
            function (task) {

                const matchesSearch =
                    task.title
                        .toLowerCase()
                        .includes(search)

                    ||

                    task.category
                        .toLowerCase()
                        .includes(search)

                    ||

                    (
                        task.description ||
                        ""
                    )
                        .toLowerCase()
                        .includes(search);


                const matchesCategory =
                    activeCategory ===
                        "All"

                    ||

                    task.category
                        .toLowerCase() ===
                    activeCategory
                        .toLowerCase();


                return (
                    matchesSearch &&
                    matchesCategory
                );

            }
        );


    let myTasksCount =
        0;

    let overdueCount =
        0;

    let completedCount =
        0;


    filteredTasks.forEach(
        function (task) {


            // ========================================
            // COMPLETED
            // ========================================

            if (task.completed) {

                completedTasksGrid.appendChild(
                    createTaskCard(
                        task
                    )
                );

                completedCount++;

                return;

            }


            // ========================================
            // OVERDUE
            // ========================================

            if (
                isOverdue(task)
            ) {

                overdueTasksGrid.appendChild(
                    createTaskCard(
                        task
                    )
                );

                overdueCount++;

                return;

            }


            // ========================================
            // MY TASKS / IN PROGRESS
            // ========================================

            myTasksGrid.appendChild(
                createTaskCard(
                    task
                )
            );

            myTasksCount++;

        }
    );


    // ========================================
    // EMPTY MY TASKS
    // ========================================

    if (
        myTasksCount === 0
    ) {

        showEmptyMessage(
            myTasksGrid,
            "No active tasks yet."
        );

    }


    // ========================================
    // EMPTY OVERDUE
    // ========================================

    if (
        overdueCount === 0
    ) {

        showEmptyMessage(
            overdueTasksGrid,
            "No overdue tasks."
        );

    }


    // ========================================
    // EMPTY COMPLETED
    // ========================================

    if (
        completedCount === 0
    ) {

        showEmptyMessage(
            completedTasksGrid,
            "No completed tasks yet."
        );

    }

}


// ============================================
// TASK CATEGORY FILTERS
// ============================================

taskFilters.forEach(
    function (filter) {

        filter.addEventListener(
            "click",
            function () {


                taskFilters.forEach(
                    function (button) {

                        button.classList.remove(
                            "active"
                        );

                    }
                );


                filter.classList.add(
                    "active"
                );


                activeCategory =
                    filter.dataset.category;


                renderTasks(
                    taskSearch.value
                );

            }
        );

    }
);


// ============================================
// EMPTY MESSAGE
// ============================================

function showEmptyMessage(
    container,
    message
) {

    const empty =
        document.createElement("div");


    empty.className =
        "no-tasks-message";


    empty.textContent =
        message;


    container.appendChild(
        empty
    );

}


// ============================================
// COMPLETE TASK
// ============================================

function completeTask(
    taskId
) {

    const task =
        tasks.find(
            function (task) {

                return (
                    task.id ===
                    taskId
                );

            }
        );


    if (!task) {

        return;

    }


    if (task.completed) {

        return;

    }


    task.completed =
        true;


    task.completedAt =
        new Date().toISOString();


    task.reminder =
        "";


    saveTasks();


    renderTasks(
        taskSearch.value
    );

}


// ============================================
// TOGGLE REMINDER
// ============================================

function toggleReminder(
    taskId
) {

    const task =
        tasks.find(
            function (task) {

                return (
                    task.id ===
                    taskId
                );

            }
        );


    if (
        !task ||
        task.completed
    ) {

        return;

    }


    if (task.reminder) {

        task.reminder =
            "";

    }
    else {

        task.reminder =
            "15 minutes";

    }


    saveTasks();


    renderTasks(
        taskSearch.value
    );

}


// ============================================
// TOGGLE COMPLETE
// ============================================

function toggleCompleteTask(
    taskId
) {

    const task =
        tasks.find(
            function (task) {

                return (
                    task.id ===
                    taskId
                );

            }
        );


    if (!task) {

        return;

    }


    task.completed =
        !task.completed;


    if (
        task.completed
    ) {

        task.completedAt =
            new Date().toISOString();

    }
    else {

        delete task.completedAt;

    }


    saveTasks();


    renderTasks(
        taskSearch.value
    );

}


// ============================================
// DELETE TASK
// ============================================

function deleteTask(
    taskId
) {

    const confirmDelete =
        confirm(
            "Are you sure you want to delete this task?"
        );


    if (!confirmDelete) {

        return;

    }


    tasks =
        tasks.filter(
            function (task) {

                return (
                    task.id !==
                    taskId
                );

            }
        );


    saveTasks();


    renderTasks(
        taskSearch.value
    );

}


// ============================================
// OPEN EDIT TASK
// ============================================

function openEditTask(
    taskId
) {

    const task =
        tasks.find(
            function (task) {

                return (
                    task.id ===
                    taskId
                );

            }
        );


    if (!task) {

        return;

    }


    editingTaskId =
        taskId;


    editTaskTitle.value =
        task.title;


    // ========================================
    // EDIT CATEGORY
    // ========================================

    if (
        task.category === "Study" ||
        task.category === "Assignment" ||
        task.category === "Quiz"
    ) {

        editTaskCategory.value =
            task.category;


        editCustomCategory.style.display =
            "none";


        editCustomCategory.required =
            false;


        editCustomCategory.value =
            "";

    }
    else {

        editTaskCategory.value =
            "Customize";


        editCustomCategory.style.display =
            "block";


        editCustomCategory.required =
            true;


        editCustomCategory.value =
            task.category;

    }


    editTaskDueDate.value =
        task.dueDate || "";


    editTaskDueTime.value =
        task.dueTime || "";


    editTaskReminder.value =
        task.reminder || "";


    editTaskDescription.value =
        task.description || "";


    editTaskModal.classList.add(
        "show"
    );


    editTaskModal.setAttribute(
        "aria-hidden",
        "false"
    );


    editTaskTitle.focus();

}


// ============================================
// CLOSE EDIT MODAL
// ============================================

function closeEditModal() {

    editTaskModal.classList.remove(
        "show"
    );


    editTaskModal.setAttribute(
        "aria-hidden",
        "true"
    );


    editCustomCategory.style.display =
        "none";


    editCustomCategory.required =
        false;


    editCustomCategory.value =
        "";


    editingTaskId =
        null;

}


closeEditTaskModal.addEventListener(
    "click",
    closeEditModal
);


// ============================================
// SAVE EDITED TASK
// ============================================

editTaskForm.addEventListener(
    "submit",
    function (event) {

        event.preventDefault();


        if (
            editingTaskId ===
            null
        ) {

            return;

        }


        const task =
            tasks.find(
                function (task) {

                    return (
                        task.id ===
                        editingTaskId
                    );

                }
            );


        if (!task) {

            return;

        }


        const categoryValue =
            editTaskCategory.value ===
            "Customize"

                ? editCustomCategory.value.trim()

                : editTaskCategory.value;


        if (!categoryValue) {

            alert(
                "Please enter a category."
            );

            return;

        }


        task.title =
            editTaskTitle.value.trim();


        task.category =
            categoryValue;


        task.dueDate =
            editTaskDueDate.value;


        task.dueTime =
            editTaskDueTime.value;


        task.reminder =
            editTaskReminder.value;


        task.description =
            editTaskDescription.value.trim();


        saveTasks();


        renderTasks(
            taskSearch.value
        );


        closeEditModal();

    }
);


// ============================================
// SEARCH
// ============================================

taskSearch.addEventListener(
    "input",
    function () {

        renderTasks(
            taskSearch.value
        );

    }
);


// ============================================
// CLOSE MENUS WHEN CLICKING OUTSIDE
// ============================================

document.addEventListener(
    "click",
    function () {

        document
            .querySelectorAll(
                ".task-menu.show"
            )
            .forEach(
                function (menu) {

                    menu.classList.remove(
                        "show"
                    );

                }
            );

    }
);


// ============================================
// ESCAPE KEY
// ============================================

document.addEventListener(
    "keydown",
    function (event) {

        if (
            event.key !==
            "Escape"
        ) {

            return;

        }


        if (
            taskModal.classList.contains(
                "show"
            )
        ) {

            closeModal();

        }


        if (
            editTaskModal.classList.contains(
                "show"
            )
        ) {

            closeEditModal();

        }

    }
);


// ============================================
// INITIAL LOAD
// ============================================

renderTasks();