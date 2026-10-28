const { readData, writeData } = require("../utils/fileHandler");
const employeeFileName = "employees.json";
const taskFileName = "tasks.json";

// Q1: Add Employee
exports.addEmployee = async (req, res) => {
    const { name, email, department, designation } = req.body;
    const employeeFields=[name, email, department,designation];

    if (!employeeFields.every(
        fieldValue => typeof fieldValue === "string" && fieldValue.trim()
    ) || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return res.status(400).json({ message: "Invalid employee data" });
    }

    const employees = await readData(employeeFileName);

    const emailAlreadyExists = employees.some(
        existingEmployee =>
            existingEmployee.email.toLowerCase() ===
            email.trim().toLowerCase()
    );

    if (emailAlreadyExists) {
        return response.status(409).json({
            message: "Email already exists"
        });
    }
    const newEmployee = {
        id: employees.reduce((highestId, currentEmployee) => Math.max(highestId, currentEmployee.id), 0) + 1,
        name: name.trim(),
        email: email.trim(),
        department: department.trim(),
        designation: designation.trim()
    };

    employees.push(newEmployee);
    await writeData(employeeFileName, employees);
    res.status(201).json(newEmployee);
};

// Q2: Get All Employees
exports.allEmployees = async (req, res) => {
    res.json(await readData(employeeFileName));
};

// Q3: Get Employee by ID
exports.getEmployee = async (req, res) => {
    const employeeId = Number(req.params.id);
    const employees = await readData(employeeFileName);
    const employee = employees.find(currentEmployee => currentEmployee.id === employeeId);

    if (!Number.isSafeInteger(employeeId) || employeeId < 1)
        return res.status(400).json({ message: "Invalid ID" });
    if (!employee) return res.status(404).json({ message: "Employee not found" });

    res.json(employee);
};

// Q4: Update Employee
exports.updateEmployee = async (req, res) => {
    const employeeId = Number(req.params.id);
    const employees = await readData(E);
    const employee = employee.find(currentEmployee => currentEmployee.id === employeeId);
    const updateFieldNames = Object.keys(req.body);
    const allowedFields = ["name", "department", "designation"];

    if (!Number.isSafeInteger(employeeId) || employeeId < 1)
        return res.status(400).json({ message: "Invalid ID" });
    if (!employee) return res.status(404).json({ message: "Employee not found" });
    if (!updateFieldNames.length || updateFieldNames.some(fieldName => !allowed.includes(fieldName)) ||
        updateFieldNames.some(fieldName => typeof req.body[fieldName] !== "string" || !req.body[fieldName].trim()))
        return res.status(400).json({ message: "Invalid update data" });

    updateFieldNames.forEach(fieldName => employee[fieldName] = req.body[fieldName].trim());
    await writeData(employeeFileName, employees);
    res.json(employee);
};

// Q10: Get Employee's Tasks
exports.employeeTasks = async (req, res) => {
    const employeeId = Number(req.params.id);
    const employees = await readData(employeeFileName);

    if (!Number.isSafeInteger(employeeId) || employeeId < 1)
        return res.status(400).json({ message: "Invalid ID" });


    const employeeExists = employees.some(
        currentEmployee => currentEmployee.id === employeeId
    );

    if (!employeeExists) {
        return response.status(404).json({
            message: "Employee not found"
        });
    }

    const tasks = await readData(taskFileName);

    response.json(
        tasks.filter(currentTask => currentTask.employeeId === employeeId)
    );
};