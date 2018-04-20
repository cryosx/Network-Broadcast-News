const net = require('net');

let connections = [];

const server = net.createServer(c => {
  // 'connection' listener

  connections.push(c);
  c.pipe(process.stdout);

  console.log('client connected');

  c.on('data', data => {
    connections.forEach(function(connection) {
      connection.write(`Echo: ${data.toString()}`);
    });
  });
  c.on('close', () => {
    connections.splice(connections.indexOf(c), 1);
  });
  c.on('end', () => {
    console.log('client disconnected');
  });
});

server.on('error', err => {
  throw err;
});
server.listen(
  {
    host: '0.0.0.0',
    port: 6969
  },
  () => {
    console.log('Server listening on 0.0.0.0:6969');
    // console.log(server);
  }
);

process.stdin.setEncoding('utf8');

process.stdin.on('readable', () => {
  const chunk = process.stdin.read();
  if (chunk !== null) {
    connections.forEach(function(connection) {
      connection.write(`BROADCAST: ${chunk}`);
    });
  }
});

process.stdin.on('end', () => {
  process.stdout.write('end');
});
