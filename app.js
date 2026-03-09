import express from "express";
import { exec } from "child_process";

const app = express();
app.use(express.json());

const API_KEY = "mysecretkey";

/* allowed commands */
const allowedCommands = [
  "docker ps",
  "docker ps -a",
  "docker logs",
  "ls",
  "pwd",
  "uptime"
];

app.post("/run", (req, res) => {

  const key = req.headers["x-api-key"];
  if (key !== API_KEY) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized"
    });
  }

  const { command } = req.body;

  if (!command) {
    return res.status(400).json({
      success: false,
      message: "Command required"
    });
  }

  const allowed = allowedCommands.some(c => command.startsWith(c));

  if (!allowed) {
    return res.status(403).json({
      success: false,
      message: "Command not allowed"
    });
  }

  exec(command, { timeout: 10000 }, (error, stdout, stderr) => {

    if (error) {
      return res.json({
        success: false,
        error: error.message,
        stderr
      });
    }

    res.json({
      success: true,
      stdout: stdout.slice(0, 5000),
      stderr
    });

  });

});

app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});
