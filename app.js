const express = require("express");
const app = express();

app.use(express.json());

app.use("/", (req, res, next) => {
    res.setHeader("Content-Type", "application/json");
    next();
});

app.get("/", (req, res) => {
    res.status(200).json({
        message: "Employee Task Management API is running"
    });
});

app.use("/employees", require("./routes/employeeRoutes"));
app.use("/tasks", require("./routes/taskRoutes"));


app.use((err, req, res, next) => {
    console.error(err);

    res.status(err.status || err.statusCode || 500).json({
        message: err.status === 400
            ? "Invalid request JSON"
            : "Internal server error"
    });
});

app.listen(4000, () => {
    console.log("Server running on port 4000");
})