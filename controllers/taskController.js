const { readData, writeData } = require("../utils/fileHandler");

const taskFileName = "tasks.json";
const employeeFileName = "employees.json";

const allowedStatuses = [
    "PENDING",
    "IN_PROGRESS",
    "COMPLETED"
];

// Q5: Create Task
exports.addTask = async (request, response) => {
    const { title, description, priority, dueDate } = request.body;

    const allowedPriorities = ["LOW", "MEDIUM", "HIGH"];

    if (
        typeof title !== "string" ||
        !title.trim() ||
        typeof description !== "string" ||
        !description.trim() ||
        !allowedPriorities.includes(priority) ||
        typeof dueDate !== "string" ||
        !/^\d{4}-\d{2}-\d{2}$/.test(dueDate) ||
        !Number.isFinite(Date.parse(dueDate)) ||
        new Date(dueDate).toISOString().slice(0, 10) !== dueDate
    ) {
        return response.status(400).json({
            message: "Invalid task data"
        });
    }

    const tasks = await readData(taskFileName);

    const highestTaskId = tasks.reduce(
        (highestId, currentTask) =>
            Math.max(highestId, currentTask.id),
        0
    );

    const newTask = {
        id: highestTaskId + 1,
        title: title.trim(),
        description: description.trim(),
        priority,
        dueDate,
        status: "PENDING",
        employeeId: null
    };

    tasks.push(newTask);

    await writeData(taskFileName, tasks);

    response.status(201).json(newTask);
};

// Q6: Get Tasks / Filter by Status
exports.allTasks = async (request, response) => {
    const tasks = await readData(taskFileName);
    const { status } = request.query;

    if (status && !allowedStatuses.includes(status)) {
        return response.status(400).json({
            message: "Invalid status"
        });
    }

    const filteredTasks = status
        ? tasks.filter(currentTask => currentTask.status === status)
        : tasks;

    response.json(filteredTasks);
};

// Q7: Update Task Status
exports.status = async (request, response) => {
    const taskId = Number(request.params.id);
    const { status } = request.body;

    if (!Number.isSafeInteger(taskId) || taskId < 1) {
        return response.status(400).json({
            message: "Invalid ID"
        });
    }

    if (!allowedStatuses.includes(status)) {
        return response.status(400).json({
            message: "Invalid status"
        });
    }

    const tasks = await readData(taskFileName);

    const task = tasks.find(
        currentTask => currentTask.id === taskId
    );

    if (!task) {
        return response.status(404).json({
            message: "Task not found"
        });
    }

    task.status = status;

    await writeData(taskFileName, tasks);

    response.json(task);
};

// Q8: Delete Task
exports.remove = async (request, response) => {
    const taskId = Number(request.params.id);

    if (!Number.isSafeInteger(taskId) || taskId < 1) {
        return response.status(400).json({
            message: "Invalid ID"
        });
    }

    const tasks = await readData(taskFileName);

    const taskIndex = tasks.findIndex(
        currentTask => currentTask.id === taskId
    );

    if (taskIndex === -1) {
        return response.status(404).json({
            message: "Task not found"
        });
    }

    const deletedTask = tasks.splice(taskIndex, 1)[0];

    await writeData(taskFileName, tasks);

    response.json({
        message: "Task deleted",
        task: deletedTask
    });
};

// Q9: Assign Task to Employee
exports.assign = async (request, response) => {
    const taskId = Number(request.params.id);
    const { employeeId } = request.body;

    if (
        !Number.isSafeInteger(taskId) ||
        taskId < 1 ||
        !Number.isSafeInteger(employeeId) ||
        employeeId < 1
    ) {
        return response.status(400).json({
            message: "Invalid ID"
        });
    }

    const employees = await readData(employeeFileName);

    const employeeExists = employees.some(
        currentEmployee => currentEmployee.id === employeeId
    );

    if (!employeeExists) {
        return response.status(404).json({
            message: "Employee not found"
        });
    }

    const tasks = await readData(taskFileName);

    const task = tasks.find(
        currentTask => currentTask.id === taskId
    );

    if (!task) {
        return response.status(404).json({
            message: "Task not found"
        });
    }

    task.employeeId = employeeId;

    await writeData(taskFileName, tasks);

    response.json(task);
};