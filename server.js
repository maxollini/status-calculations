const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.post('/status', (req, res) => {
    const projects = {};

    req.body.forEach(entry => {
        const projectName = entry.list.name;
        const statusType = entry.status.status;
        const listId = entry.list.id;

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
        const { approved, check } = project;

        if (approved >= 18) {
            project.decision = "All good -> equals to or more than 18 approved";
        } else if (approved < 6 && check < 6) {
            project.decision = "Big problem -> Less than 6 in approved and less than 6 in check";
        } else {
            project.decision = "Needs action -> Approved less than 18 but not a big problem";
        }
    });

    res.json(Object.values(projects));
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
