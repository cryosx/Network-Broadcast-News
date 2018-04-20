const net = require('net');
const server = net.createServer(c => {
  // 'connection' listener
  console.log('client connected');
  c.on('end', () => {
    console.log('client disconnected');
  });
  c.write('hello\r\n');
  c.pipe(c);
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
    console.log('server bound');
    // console.log(server);
  }
);
