// ============================================
// SNAP DASHBOARD
// Reads tasks from localStorage
// ============================================


// ============================================
// GET TASKS
// ============================================

const tasks =
    JSON.parse(
        localStorage.getItem("snapTasks")
    ) || [];


// ============================================
// GET STATUS CARDS
// ============================================

const statusCards =
    document.querySelectorAll(
        ".status-card"
    );


// ============================================
// GET TODAY'S DATE
// ============================================

function getTodayDate() {

    const today =
        new Date();

    const year =
        today.getFullYear();

    const month =
        String(
            today.getMonth() + 1
        ).padStart(2, "0");

    const day =
        String(
            today.getDate()
        ).padStart(2, "0");


    return (
        year +
        "-" +
        month +
        "-" +
        day
    );

}


// ============================================
// CHECK IF TASK IS OVERDUE
// ============================================

function isOverdue(task) {

    if (
        task.completed ||
        !task.dueDate
    ) {

        return false;

    }


    if (task.dueTime) {

        const dueDateTime =
            new Date(
                task.dueDate +
                "T" +
                task.dueTime +
                ":00"
            );


        return (
            dueDateTime <
            new Date()
        );

    }


    const dueDate =
        new Date(
            task.dueDate +
            "T23:59:59"
        );


    return (
        dueDate <
        new Date()
    );

}


// ============================================
// GET TASK COUNTS
// ============================================

function getTaskCounts() {

    const today =
        getTodayDate();


    let todayCount =
        0;

    let inProgressCount =
        0;

    let completedCount =
        0;


    tasks.forEach(
        function (task) {


            // ========================================
            // COMPLETED
            // ========================================

            if (
                task.completed
            ) {

                completedCount++;

                return;

            }


            // ========================================
            // TODAY
            // ========================================

            if (
                task.dueDate ===
                today
            ) {

                todayCount++;

            }


            // ========================================
            // IN PROGRESS
            // ========================================

            if (
                !isOverdue(task)
            ) {

                inProgressCount++;

            }

        }
    );


    return {
        today:
            todayCount,

        inProgress:
            inProgressCount,

        completed:
            completedCount
    };

}


// ============================================
// UPDATE DASHBOARD
// ============================================

function updateDashboard() {

    const counts =
        getTaskCounts();


    // ========================================
    // TODAY
    // ========================================

    const todayCard =
        document.querySelector(
            ".today-card"
        );


    if (todayCard) {

        const count =
            todayCard.querySelector(
                ".status-count"
            );


        if (count) {

            count.textContent =
                counts.today;

        }

    }


    // ========================================
    // IN PROGRESS
    // ========================================

    const progressCard =
        document.querySelector(
            ".progress-card"
        );


    if (progressCard) {

        const count =
            progressCard.querySelector(
                ".status-count"
            );


        if (count) {

            count.textContent =
                counts.inProgress;

        }

    }


    // ========================================
    // COMPLETED
    // ========================================

    const completedCard =
        document.querySelector(
            ".completed-card"
        );


    if (completedCard) {

        const count =
            completedCard.querySelector(
                ".status-count"
            );


        if (count) {

            count.textContent =
                counts.completed;

        }

    }

}


// ============================================
// INITIALIZE
// ============================================

updateDashboard();