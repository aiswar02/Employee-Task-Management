const fs = require("fs/promises");
const path = require("path");

async function readData(fileName) {
    const filePath = path.join(__dirname, "..", "data", fileName);

    try {
        const data = await fs.readFile(filePath, "utf8");
        const parsedData = JSON.parse(data);

        if (!Array.isArray(parsedData)) {
            throw new Error("JSON data must be an array");
        }

        return parsedData;
    } catch (error) {
        if (error.code === "ENOENT") {
            await fs.writeFile(filePath, "[]", "utf8");
            return [];
        }

        if (error instanceof SyntaxError) {
            error.statusCode = 500;
            error.message = "Invalid JSON in " + fileName;
        }

        throw error;
    }
}

async function writeData(fileName, data) {
    const filePath = path.join(__dirname, "..", "data", fileName);

    await fs.writeFile(
        filePath,
        JSON.stringify(data, null, 2),
        "utf8"
    );
}

module.exports = { readData, writeData };