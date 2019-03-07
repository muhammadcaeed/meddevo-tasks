const _           = require('lodash');
const http        = require('http');
const express     = require('express');
const WebSocket   = require('ws');
const bodyParser  = require('body-parser');

const app = express();
app.use(bodyParser.json());
const server = http.createServer(app);

const wss = new WebSocket.Server({ server });

wss.on('connection', (ws) => {
  console.log('user connected');
  ws.send(JSON.stringify({status: 'newConnection', message: 'WebSocket Connection Established'}));
});

const credentials = {
  usernames: ['user1', 'user2', 'user3'],
  passwords: ['pass1', 'pass2', 'pass3']
}

app.post('/updates', (req, res) => {
  const condition1 = _.has(req.body, 'username') && _.has(req.body, 'password');

  if (!condition1) {
    broadcast({status: false, message: 'Credentials not provided'});
    return res.status(400).send({status: false, message: 'Please provide credentials'});
  }
  const username = req.body.username;
  const password = req.body.password;
  const condition2 = credentials.usernames.indexOf(username) > -1 && credentials.passwords.indexOf(password) > -1;
  if (!condition2) {
    broadcast({status: false, message: 'Invalid credentials'});
    return res.status(400).send({status: false, error: 'Invalid credentials'});
  }
  broadcast({status: true, message: 'Correct credentials'});
  return res.status(200).send({status: true, message: 'Correct credentials'});
});

broadcast = (data) => {
  wss.clients.forEach(function each(client) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(data));
    }
  });
}

server.listen(8999, () => {
    console.log(`Server started on port ${server.address().port}`);
});