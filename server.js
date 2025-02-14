const express = require("express");
const app = express();

app.use(express.json());

app.post("/analyze", (req, res) => {
    const data = req.body;

    // Group tasks by project name
    const projectCounts = {};

    data.forEach(task => {
        const project = task.name;
        const status = task.status.status;
        const count = task.__IMTLENGTH__ || 0;

        if (!projectCounts[project]) {
            projectCounts[project] = { approved: 0, check: 0, editing: 0, written: 0, idea: 0 };
        }

        if (status in projectCounts[project]) {
            projectCounts[project][status] += count;
        }
    });

    // Apply decision logic for each project
    const results = {};
    
    for (const project in projectCounts) {
        const { approved, check, editing, written, idea } = projectCounts[project];

        let result = "";

        if (approved >= 24) {
            result = "All good -> equals to or more than 24 approved, 6 moved to ready";
        } else if (approved < 24 && check >= 12) {
            result = "Needs approval -> less than 24 approved, equals to or more than 12 check, 6 moved to ready";
        } else if (approved < 24 && check < 12 && editing >= 12) {
            result = "Needs editing -> less than 24 approved, less than 12 check, equals to or more than 12 editing, 6 moved to ready";
        } else if (approved < 24 && check < 12 && editing < 12 && written >= 12) {
            result = "Needs writing approval -> less than 24 approved, less than 12 check, less than 12 editing, equals to or more than 12 written, 6 moved to ready";
        } else if (approved < 24 && check < 12 && editing < 12 && written < 12 && idea >= 24) {
            result = "Needs more writing -> less than 24 approved, less than 12 check, less than 12 editing, less than 12 written, equals to or more than 24 idea, 6 moved to ready";
        } else if (approved < 24 && check < 12 && editing < 12 && written < 12 && idea < 24) {
            result = "Needs more ideas -> less than 24 approved, less than 12 check, less than 12 editing, less than 12 written, less than 24 idea, 6 moved to ready";
        } 
        
        if (approved < 6) {
            result = "Big problem -> less than 6 in approved, didn't move any tasks to ready";
        }

        results[project] = result;
    }

    res.json(results);
});

// Server setup
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
