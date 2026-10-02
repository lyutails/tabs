import { createServer } from 'node:http';

const server = createServer((request, response) => {
    response.end('Hello from server');
});

server.listen(3000);