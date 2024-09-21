const WebSocket = require('ws');
const server = new WebSocket.Server({ port: 7000 });

const employees = [
  { name: 'John Doe', department: 'HR', status: 'Working' },
  { name: 'Jane Smith', department: 'Engineering', status: 'Working' },
  { name: 'Sam Wilson', department: 'Marketing', status: 'Working' },
  { name: 'Emily Davis', department: 'Finance', status: 'Working' },
  { name: 'Michael Brown', department: 'Sales', status: 'Working' },
  { name: 'Sarah Johnson', department: 'Legal', status: 'Working' },
  { name: 'Chris Lee', department: 'IT', status: 'Working' },
  { name: 'Anna Miller', department: 'Product', status: 'Working' },
  { name: 'David Garcia', department: 'Support', status: 'Working' },
  { name: 'Laura Martinez', department: 'Operations', status: 'Working' },
  { name: 'Robert Wilson', department: 'R&D', status: 'Working' },
  { name: 'Lisa Hernandez', department: 'Marketing', status: 'Working' },
  { name: 'James Anderson', department: 'HR', status: 'Working' },
  { name: 'Mary White', department: 'Finance', status: 'Working' },
  { name: 'Paul Thompson', department: 'Engineering', status: 'Working' },
  { name: 'Nancy Lewis', department: 'Product', status: 'Working' },
  { name: 'Gary Young', department: 'Sales', status: 'Working' },
  { name: 'Sandra Hall', department: 'Support', status: 'Working' },
  { name: 'Kenneth Scott', department: 'IT', status: 'Working' },
  { name: 'Betty King', department: 'Legal', status: 'Working' },
  { name: 'Daniel Wright', department: 'R&D', status: 'Working' },
  { name: 'Karen Green', department: 'Operations', status: 'Working' },
  { name: 'Joseph Adams', department: 'Marketing', status: 'Working' },
  { name: 'Dorothy Baker', department: 'HR', status: 'Working' },
  { name: 'Mark Nelson', department: 'Finance', status: 'Working' },
  { name: 'Margaret Carter', department: 'Engineering', status: 'Working' },
  { name: 'Steven Mitchell', department: 'Product', status: 'Working' },
  { name: 'Elizabeth Perez', department: 'Sales', status: 'Working' },
  { name: 'Charles Turner', department: 'Support', status: 'Working' },
  { name: 'Jessica Phillips', department: 'IT', status: 'Working' },
  { name: 'Pauline Evans', department: 'Legal', status: 'Working' },
  { name: 'Matthew Collins', department: 'R&D', status: 'Working' },
  { name: 'Emily Morris', department: 'Operations', status: 'Working' },
  { name: 'Andrew Rogers', department: 'Marketing', status: 'Working' },
  { name: 'Ashley Murphy', department: 'HR', status: 'Working' },
  { name: 'Brian Bailey', department: 'Finance', status: 'Working' },
  { name: 'Karen Cooper', department: 'Engineering', status: 'Working' },
  { name: 'John Reed', department: 'Product', status: 'Working' },
  { name: 'Jessica Stewart', department: 'Sales', status: 'Working' },
  { name: 'David Morgan', department: 'Support', status: 'Working' },
  { name: 'Linda Cook', department: 'IT', status: 'Working' },
  { name: 'Richard Murphy', department: 'Legal', status: 'Working' },
  { name: 'Nancy Rogers', department: 'R&D', status: 'Working' },
  { name: 'George Price', department: 'Operations', status: 'Working' },
  { name: 'Deborah Diaz', department: 'Marketing', status: 'Working' },
  { name: 'James Foster', department: 'HR', status: 'Working' },
  { name: 'Nancy Perry', department: 'Finance', status: 'Working' },
  { name: 'Robert Hughes', department: 'Engineering', status: 'Working' },
  { name: 'Sandra Ramirez', department: 'Product', status: 'Working' }
];

// Function to send a random employee event
function sendRandomEvent(socket) {
    const events = [
        { message: 'Unauthorized Leave taken – You’ll be caught!', status: 'Absent' },
        { message: 'Extended break time!', status: 'On Break' },
        { message: 'Absent from today’s shift!', status: 'Absent' }
    ];

    const criticalEvents = [
        { message: 'Fire detected...Evacuate immediately!', type: 'critical_event' },
        { message: 'Security breach detected!', type: 'critical_event' }
    ];

    // Randomly select an employee and an event
    const randomEmployee = employees[Math.floor(Math.random() * employees.length)];
    const randomEvent = events[Math.floor(Math.random() * events.length)];
    const randomCriticalEvent = criticalEvents[Math.floor(Math.random() * criticalEvents.length)];

    // Send employee-specific event
    const employeeEvent = {
        type: 'employee_event',
        employee: {
            name: randomEmployee.name,
            status: randomEvent.status
        },
        message: randomEvent.message
    };

    // Randomly decide to send a critical event or an employee event
    if (Math.random() > 0.8) {
        // Send critical event
        socket.send(JSON.stringify({
            type: 'critical_event',
            message: randomCriticalEvent.message
        }));
    } else {
        // Send employee event
        socket.send(JSON.stringify(employeeEvent));
    }
}

// When a new client connects
server.on('connection', socket => {
    console.log('New client connected.');

    // Send an event every 10 seconds
    const intervalId = setInterval(() => {
        sendRandomEvent(socket);
    }, 10000);

    // Clean up when the client disconnects
    socket.on('close', () => {
        console.log('Client disconnected.');
        clearInterval(intervalId);
    });
});
