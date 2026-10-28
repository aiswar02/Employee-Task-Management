const express = require("express");
const router = express.Router();

const taskController = require("../controllers/taskController");

router.post("/", taskController.addTask);
router.get("/", taskController.allTasks);
router.patch("/:id/status", taskController.status);
router.delete("/:id", taskController.remove);
router.post("/:id/assign", taskController.assign);

module.exports = router