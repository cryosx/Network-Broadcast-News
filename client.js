const net = require('net');
const client = net.createConnection(
  {
    host: '0.0.0.0',
    port: 6969
  },
  () => {
    //'connect' listener
    console.log('connected to server!');
    client.write('world!\r\n');
  }
);
client.on('data', data => {
  console.log(data.toString());
  client.end();
});
client.on('end', () => {
  console.log('disconnected from server');
});
