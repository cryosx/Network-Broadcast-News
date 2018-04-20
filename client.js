const net = require('net');

let username = null;

const serverConnection = net.createConnection(
  {
    host: '0.0.0.0',
    port: 6969
  },
  () => {
    //'connect' to listener
    // process.stdin.pipe(serverConnection);
    console.log('Connected to server!');
    // serverConnection.emit('prompt_username');
  }
);

// serverConnection.once('connection', function() {});
serverConnection.on('prompt_username', function() {
  console.log('Enter a USERNAME:');
});

serverConnection.on('username', function(data) {
  if (data !== null) {
    username = data;
    serverConnection.write(`USERNAME:${data}`);
  }
});
serverConnection.setEncoding('utf8');
serverConnection.on('data', function(data) {
  let index = data.indexOf(':');
  let header = data.substring(0, index);
  let msg = data.substring(index + 1);
  if (header === 'USERNAME_TAKEN') {
    console.log(msg);
    username = null;
    serverConnection.emit('prompt_username');
  }
  if (header === 'KICK') {
    console.log(`${msg}`);
  }

  if (header === 'MESSAGE') {
    console.log(`${msg}`);
  }
  // serverConnection.pipe(process.stdout);
});
serverConnection.on('end', () => {
  console.log('disconnected from server');
});

process.stdin.setEncoding('utf8');

process.stdin.on('readable', data => {
  const chunk = process.stdin.read();
  if (chunk !== null) {
    if (!username) {
      serverConnection.emit('username', chunk.trim());
    } else {
      serverConnection.write(`MESSAGE:${chunk.trim()}`);
    }
  }
});

process.stdin.on('end', function() {
  process.stdout.write('end');
});
