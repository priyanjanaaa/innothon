const WebSocket = require('ws');

const server = new WebSocket.Server({ port: 9094 });
console.log('WebSocket server running on ws://localhost:9094');

// Expanded list of employees with diverse skills
let employees = [
    { name: 'John Doe', status: 'Present', skills: ['management', 'communication'] },
    { name: 'Jane Smith', status: 'Present', skills: ['engineering', 'coding'] },
    { name: 'Sam Wilson', status: 'Present', skills: ['marketing', 'sales'] },
    { name: 'Emily Davis', status: 'Present', skills: ['finance', 'analysis'] },
    { name: 'Michael Brown', status: 'Present', skills: ['HR', 'recruitment'] },
    { name: 'Sarah Johnson', status: 'Present', skills: ['legal', 'compliance'] },
    { name: 'Chris Lee', status: 'Present', skills: ['IT', 'support'] },
    { name: 'Anna Miller', status: 'Present', skills: ['design', 'content writing'] },
    { name: 'David Garcia', status: 'Present', skills: ['operations', 'logistics'] },
    { name: 'Laura Martinez', status: 'Present', skills: ['customer service', 'sales'] },
    { name: 'Robert Wilson', status: 'Present', skills: ['R&D', 'innovation'] },
    { name: 'Lisa Hernandez', status: 'Present', skills: ['advertising', 'marketing'] },
    { name: 'James Anderson', status: 'Present', skills: ['finance', 'reporting'] },
    { name: 'Mary White', status: 'Present', skills: ['programming', 'testing'] },
    { name: 'Paul Thompson', status: 'Present', skills: ['engineering', 'maintenance'] },
    { name: 'Nancy Lewis', status: 'Present', skills: ['management', 'team building'] },
    { name: 'Gary Young', status: 'Present', skills: ['analytics', 'data analysis'] },
    { name: 'Sandra Hall', status: 'Present', skills: ['project management', 'strategic planning'] },
    { name: 'Kenneth Scott', status: 'Present', skills: ['IT', 'networking'] },
    { name: 'Betty King', status: 'Present', skills: ['writing', 'editing'] },
    { name: 'Daniel Wright', status: 'Present', skills: ['research', 'development'] }
];

// Function to handle absence and employee replacement based on skills
function handleAbsence(socket) {
    const presentEmployees = employees.filter(emp => emp.status === 'Present');
    if (presentEmployees.length === 0) return;

    // Randomly pick multiple employees to mark as absent
    const numAbsentees = Math.floor(Math.random() * 3) + 1; // 1 to 3 absentees
    const absentEmployees = [];

    for (let i = 0; i < numAbsentees; i++) {
        const absentEmployee = presentEmployees[Math.floor(Math.random() * presentEmployees.length)];
        if (!absentEmployees.includes(absentEmployee)) {
            absentEmployees.push(absentEmployee);
            absentEmployee.status = 'Absent';
        }
    }

    absentEmployees.forEach(absentEmployee => {
        // Find a replacement employee with at least one matching skill
        const replacement = employees.find(emp =>
            emp.status === 'Present' && emp.skills.some(skill => absentEmployee.skills.includes(skill))
        );

        if (replacement) {
            replacement.status = 'Working'; // Mark replacement as working
            socket.send(JSON.stringify({
                type: 'worker_swap',
                absentEmployee: absentEmployee.name,
                replacementEmployee: replacement.name,
                message: `Swapped ${replacement.name} to replace ${absentEmployee.name} (skills matched: ${replacement.skills.filter(skill => absentEmployee.skills.includes(skill)).join(', ')})`
            }));
        } else {
            socket.send(JSON.stringify({
                type: 'worker_swap_fail',
                absentEmployee: absentEmployee.name,
                message: `No replacement found for ${absentEmployee.name}.`
            }));
        }
    });
}

// Broadcast the change to all connected clients
function broadcastChange() {
    server.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            handleAbsence(client);
        }
    });
}

// Increased frequency for absentee simulation
setInterval(broadcastChange, 3000); // Every 3 seconds

server.on('connection', socket => {
    console.log('Client connected');
});
