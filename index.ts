import * as http from 'http';

import application from './application';

const server: http.Server = http.createServer(application);
const port = process.env.SERVER_PORT || 8080;

server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

process.on('SIGINT', () => {
  process.exit();
});