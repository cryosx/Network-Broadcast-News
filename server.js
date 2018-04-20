const net = require('net');
let connections = {};
// let connection2 = {};

const server = net.createServer(c => {
  // 'connection' listener
  connections[c.remotePort] = {
    socket: c,
    address: c.remoteAddress,
    port: c.remotePort
  };

  c.pipe(process.stdout);

  console.log(`CONNECTED: ${c.remoteAddress}:${c.remotePort}`);

  c.on('data', data => {
    for (const connection in connections) {
      if (connections.hasOwnProperty(connection)) {
        if (c.remotePort != connection) {
          connections[connection].socket.write(
            `MESSAGE FROM ${c.remoteAddress}:${
              c.remotePort
            }: ${data.toString()}`
          );
        }
      }
    }
    // console.log(connections[c.remotePort]);
    // connections.forEach(function(connection) {
    //   connection.write(`: ${data.toString()}`);
    // });
  });
  c.on('close', () => {
    // connections.splice(connections.indexOf(c), 1);
    delete connections[c.remotePort];
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
    console.log(`Server listening on ${server._connectionKey.substring(2)}`);
  }
);

process.stdin.setEncoding('utf8');

process.stdin.on('readable', () => {
  const chunk = process.stdin.read();
  if (chunk !== null) {
    for (const connection in connections) {
      if (connections.hasOwnProperty(connection)) {
        connections[connection].socket.write(`SERVER BROADCAST: ${chunk}`);
      }
    }
  }
});

process.stdin.on('end', () => {
  process.stdout.write('end');
});
