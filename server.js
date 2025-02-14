const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.post('/status', (req, res) => {
    const projects = req.body;
    let results = [];

    projects.forEach(project => {
        const { name, status } = project;
        const statusCounts = {
            approved: 0,
            check: 0,
            editing: 0,
            written: 0,
            idea: 0
        };

        projects.forEach(p => {
            if (p.name === name) {
                statusCounts[p.status.status] = (statusCounts[p.status.status] || 0) + 1;
            }
        });

        let decision = "";

        if (statusCounts.approved >= 24) {
            decision = "All good -> equals to or more than 24 approved";
        } else if (statusCounts.approved >= 6 && statusCounts.check >= 12) {
            decision = "Needs approval -> 6 or more in approved but less than 24, equals to or more than 12 check";
        } else if (statusCounts.approved >= 6 && statusCounts.check < 12 && statusCounts.editing >= 12) {
            decision = "Needs editing -> 6 or more in approved but less than 24, less than 12 check, equals to or more than 12 editing";
        } else if (statusCounts.approved >= 6 && statusCounts.check < 12 && statusCounts.editing < 12 && statusCounts.written >= 12) {
            decision = "Needs writing approval -> 6 or more in approved but less than 24, less than 12 check, less than 12 editing, equals to or more than 12 written";
        } else if (statusCounts.approved >= 6 && statusCounts.check < 12 && statusCounts.editing < 12 && statusCounts.written < 12 && statusCounts.idea >= 24) {
            decision = "Needs more writing -> 6 or more in approved but less than 24, less than 12 check, less than 12 editing, less than 12 written, equals to or more than 24 idea";
        } else if (statusCounts.approved >= 6 && statusCounts.check < 12 && statusCounts.editing < 12 && statusCounts.written < 12 && statusCounts.idea < 24) {
            decision = "Needs more ideas -> 6 or more in approved but less than 24, less than 12 check, less than 12 editing, less than 12 written, less than 24 idea";
        } else {
            decision = "Big problem -> less than 6 in approved";
        }

        results.push({
            project: name,
            decision: decision,
            approved: statusCounts.approved,
            check: statusCounts.check,
            editing: statusCounts.editing,
            written: statusCounts.written,
            idea: statusCounts.idea
        });
    });

    res.json(results);
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
