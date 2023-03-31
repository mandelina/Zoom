import http from 'http';
import WebSocket from 'ws';
import express from 'express';

const app = express();

app.set('view engine', 'pug');
app.set('views', __dirname + '/views');
app.use('/public', express.static(__dirname + '/public'));

app.get('/', (req, res) => res.render('home'));
app.get('/*', (req, res) => res.redirect('/'));

//3000포트에 wss , http 둘다 만듬
const handleListen = () => console.log('Listening on http://localhost:3000');

const server = http.createServer(app);
const wss = new WebSocket.Server({ server }); //http서버 위에 wss서버 만듬

function onSocketClose() {
  console.log('Discconected from the Browser 👍');
}

function handleConnection(socket) {
  console.log(socket); // 이 소켓으로 front와 back에서 실시간으로 소통할 수 있움
}

const sockets = [];

wss.on('connection', (socket) => {
  // firefox가 연결되었을때, 이를 array에 넣어준다.
  sockets.push(socket);
  socket['nickname'] = 'Anon';

  // 브라우저가 연결되었을때 콘솔 찍기
  console.log('Connected to Browser👌');

  //브라우저가 꺼졌을때 listener
  socket.on('close', () => console.log('disconnected from the client ❌'));

  // 브라우저가 서버에 메시지를 보냈을때 그 메시지 출력
  socket.on('message', (msg) => {
    // console.log(message.toString('utf8'));
    // 연결된 사용자에게 모든 소켓을 거쳐 메시지를 전부 보낸다
    const message = JSON.parse(msg);

    console.log(message);
    switch (message.type) {
      case 'message':
        sockets.forEach((aSocket) =>
          aSocket.send(`${socket.nickname} : ${message.payload} `)
        );

      case 'nick':
        console.log(message.payload, '닉네임');
        socket['nickname'] = message.payload;
    }

    // console.log(parsed, message.toString('utf-8'));
  });

  // 서버가 브라우저에게 data를 보냄
  //   socket.send('hello!!');
});
server.listen(3000, handleListen);
