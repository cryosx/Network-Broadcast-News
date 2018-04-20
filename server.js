const net = require('net');

let connections = {};
let usernames = ['[ADMIN]'];

const server = net.createServer(function(c) {
  c.setEncoding('utf8');

  // 'connection' listener
  // connection keys will be using ports
  connections[c.remotePort] = {
    client: c,
    username: null
  };

  // c.pipe(process.stdout);

  c.write(`MESSAGE:Enter a USERNAME:`);
  console.log(`CONNECTED: ${c.remoteAddress}:${c.remotePort}`);

  // c.on('username', function() {});
  c.on('data', function(data) {
    data = data.toString().trim();
    let index = data.indexOf(':');
    let header = data.substring(0, index);
    let msg = data.substring(index + 1);
    if (header === 'USERNAME') {
      if (usernames.includes(msg)) {
        if (msg === '[ADMIN]') {
          c.write(`USERNAME_TAKEN:Nice try buddy, but you're not an admin.`);
        } else {
          c.write(`USERNAME_TAKEN:Username taken, enter a differnt one.`);
        }
      } else {
        connections[c.remotePort].username = msg;
        usernames.push(msg);
        console.log(usernames);
      }
    } else if (header === 'MESSAGE') {
      if (connections[c.remotePort].username === null) {
        c.write(`MESSAGE:Bad client!`);
        c.end();
      } else {
        for (const port in connections) {
          if (connections.hasOwnProperty(port)) {
            if (c.remotePort != port) {
              let client = connections[port].client;
              let username = connections[c.remotePort].username;
              client.write(`MESSAGE:${username}: ${msg}`);
            }
          }
        }
      }
    } else {
      c.write(`MESSAGE:Bad client!`);
      c.end();
    }
  });
  c.on('close', function() {
    console.log(`CLOSED: ${c.remoteAddress}:${c.remotePort}`);
    removeClient(c.remotePort);
  });
  c.on('end', function() {
    console.log('client disconnected');
  });
});

server.on('error', function(error) {
  throw error;
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
    let arguments = chunk.trim().split(' ');

    if (arguments[0] === `\\kick`) {
      let index = usernames.indexOf(arguments[1]);
      if (index !== -1) {
        console.log(`Kicking ${[arguments[1]]}`);
        // usernames.splice(index, 1);
        for (const port in connections) {
          if (connections.hasOwnProperty(port)) {
            if (connections[port].username === arguments[1]) {
              connections[port].client.write(
                `KICK:You have been kicked from server by [ADMIN]`
              );
              connections[port].client.end();
              // delete connections[port];
              break;
            }
          }
        }
      }
    } else {
      for (const port in connections) {
        let client = connections[port].client;
        if (connections.hasOwnProperty(port)) {
          client.write(`MESSAGE:[ADMIN] ${chunk.trim()}`);
        }
      }
    }
  }
});

process.stdin.on('end', () => {
  process.stdout.write('end');
});

function removeClient(port) {
  let username = connections[port].username;
  let index = usernames.indexOf(username);
  usernames.splice(index, 1);
  delete connections[port];
}
