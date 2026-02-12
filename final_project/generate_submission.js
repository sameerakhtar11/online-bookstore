const { exec } = require("child_process");
const fs = require('fs');

const commands = [
    { task: "Task 1: GitHub Repo Info", cmd: "curl -s https://api.github.com/repos/ibm-developer-skills-network/expressBookReviews" },
    { task: "Task 2: Get All Books", cmd: "curl -s http://localhost:5000/" },
    { task: "Task 3: Get Book by ISBN", cmd: "curl -s http://localhost:5000/isbn/1" },
    { task: "Task 4: Get Book by Author", cmd: "curl -s http://localhost:5000/author/Chinua%20Achebe" },
    { task: "Task 5: Get Book by Title", cmd: "curl -s http://localhost:5000/title/Things%20Fall%20Apart" },
    { task: "Task 6: Get Book Review", cmd: "curl -s http://localhost:5000/review/1" },
    { task: "Task 7: Register", cmd: 'curl -s -X POST -H "Content-Type: application/json" -d "{\\"username\\":\\"user1\\",\\"password\\":\\"pass1\\"}" http://localhost:5000/register' },
    { task: "Task 8: Login", cmd: 'curl -s -X POST -H "Content-Type: application/json" -d "{\\"username\\":\\"user1\\",\\"password\\":\\"pass1\\"}" -c cookie.txt http://localhost:5000/customer/login' },
    { task: "Task 9: Add Review", cmd: 'curl -s -X PUT -H "Content-Type: application/json" -d "{\\"review\\":\\"Great book!\\"}" -b cookie.txt http://localhost:5000/customer/auth/review/1' },
    { task: "Task 10: Delete Review", cmd: 'curl -s -X DELETE -b cookie.txt http://localhost:5000/customer/auth/review/1' }
];

async function run() {
    let output = "";
    console.log("Generating submission.txt...");
    for (let c of commands) {
        console.log(`Running ${c.task}...`);
        output += `\n${c.task}\nCommand: ${c.cmd}\nOutput:\n`;
        await new Promise(resolve => {
            exec(c.cmd, (error, stdout, stderr) => {
                if (error) output += `Error: ${error.message}\n`;
                else output += stdout + "\n";
                resolve();
            });
        });
        output += "\n------------------------------------------------\n";
    }
    fs.writeFileSync("submission.txt", output);
    console.log("Submission file generated.");
}

run();
