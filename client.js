const net = require('net');

const client = net.createConnection(
  {
    host: '0.0.0.0',
    port: 6969
  },
  () => {
    //'connect' listener
    console.log('connected to server!');
  }
);
client.on('data', data => {
  console.log(`${data.toString()}`);
});
client.on('end', () => {
  console.log('disconnected from server');
});

process.stdin.setEncoding('utf8');

process.stdin.on('readable', () => {
  const chunk = process.stdin.read();
  if (chunk !== null) {
    client.write(`${chunk}`);
  }
});

process.stdin.on('end', () => {
  process.stdout.write('end');
});
