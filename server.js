const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.post('/status', (req, res) => {
    const projects = {};

    req.body.forEach(entry => {
        const projectName = entry.name;
        const statusType = entry.status.status;
        const listId = entry.id;

        if (!projects[projectName]) {
            projects[projectName] = {
                project: projectName,
                listId: listId,
                approved: 0,
                check: 0,
                editing: 0,
                written: 0,
                idea: 0,
                decision: ""
            };
        }
        
        projects[projectName][statusType] = (projects[projectName][statusType] || 0) + 1;
    });

    Object.values(projects).forEach(project => {
        const { approved, check, editing, written, idea } = project;

        if (approved >= 18) {
            project.decision = "All good -> equals to or more than 18 approved";
        } else if (approved >= 6 && approved < 18 && check >= 12) {
            project.decision = "Needs approval -> 6 or more in approved but less than 18, equals to or more than 12 check";
        } else if (approved >= 6 && approved < 18 && check < 12 && editing >= 12) {
            project.decision = "Needs editing -> 6 or more in approved but less than 18, less than 12 check, equals to or more than 12 editing";
        } else if (approved >= 6 && approved < 18 && check < 12 && editing < 12 && written >= 12) {
            project.decision = "Needs writing approval -> 6 or more in approved but less than 18, less than 12 check, less than 12 editing, equals to or more than 12 written";
        } else if (approved >= 6 && approved < 18 && check < 12 && editing < 12 && written < 12 && idea >= 12) {
            project.decision = "Needs more writing -> 6 or more in approved but less than 18, less than 12 check, less than 12 editing, less than 12 written, equals to or more than 12 idea";
        } else if (approved >= 6 && approved < 18 && check < 12 && editing < 12 && written < 12 && idea < 12) {
            project.decision = "Needs more ideas -> 6 or more in approved but less than 18, less than 12 check, less than 12 editing, less than 12 written, less than 12 idea";
        } else if (approved < 6 && check >= 6) {
            project.decision = "Small problem -> less than 6 in approved, but 6 or more in check";
        } else {
            project.decision = "Big problem -> less than 6 in approved and less than 6 in check";
        }
    });

    res.json(Object.values(projects));
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
