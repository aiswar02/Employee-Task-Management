const express = require("express");
const router = express.Router();

const employeeController = require("../controllers/employeeController");

router.post("/", employeeController.addEmployee);
router.get("/", employeeController.allEmployees);
router.get("/:id/tasks", employeeController.employeeTasks);
router.get("/:id", employeeController.getEmployee);
router.put("/:id", employeeController.updateEmployee);

module.exports = router