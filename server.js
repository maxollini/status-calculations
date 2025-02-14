const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.post('/status', (req, res) => {
    const projects = req.body;
    let results = {};

    projects.forEach(project => {
        const { name, statuses } = project;
        const approved = statuses.approved || 0;
        const check = statuses.check || 0;
        const editing = statuses.editing || 0;
        const written = statuses.written || 0;
        const idea = statuses.idea || 0;

        let statusMessage = "";

        if (approved >= 24) {
            statusMessage = "All good -> equals to or more than 24 approved";
        } else if (approved >= 6 && check >= 12) {
            statusMessage = "Needs approval -> 6 or more in approved but less than 24, equals to or more than 12 check";
        } else if (approved >= 6 && check < 12 && editing >= 12) {
            statusMessage = "Needs editing -> 6 or more in approved but less than 24, less than 12 check, equals to or more than 12 editing";
        } else if (approved >= 6 && check < 12 && editing < 12 && written >= 12) {
            statusMessage = "Needs writing approval -> 6 or more in approved but less than 24, less than 12 check, less than 12 editing, equals to or more than 12 written";
        } else if (approved >= 6 && check < 12 && editing < 12 && written < 12 && idea >= 24) {
            statusMessage = "Needs more writing -> 6 or more in approved but less than 24, less than 12 check, less than 12 editing, less than 12 written, equals to or more than 24 idea";
        } else if (approved >= 6 && check < 12 && editing < 12 && written < 12 && idea < 24) {
            statusMessage = "Needs more ideas -> 6 or more in approved but less than 24, less than 12 check, less than 12 editing, less than 12 written, less than 24 idea";
        } else {
            statusMessage = "Big problem -> less than 6 in approved";
        }

        results[name] = statusMessage;
    });

    res.json(results);
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
