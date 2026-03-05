import express from "express";
import { exec } from "child_process";

const app = express();
app.use(express.json());

app.post("/run", (req, res) => {
  const { command } = req.body;

  if (!command) {
    return res.status(400).json({
      success: false,
      message: "Command required",
    });
  }

  exec(command, (error, stdout, stderr) => {
    if (error) {
      return res.json({
        success: false,
        error: error.message,
        stderr,
      });
    }

    res.json({
      success: true,
      stdout,
      stderr,
    });
  });
});

app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});
