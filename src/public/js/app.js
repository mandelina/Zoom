const messageList = document.querySelector('ul');
const nickForm = document.querySelector('#nick');
const messageForm = document.querySelector('#message');
const socket = new WebSocket(`ws://${window.location.host}`);

function makeMessage(type, payload) {
  // 객체를 스트링으로 변환
  const msg = { type, payload };
  return JSON.stringify(msg);
}

//소켓이 오픈되었을때 실행
socket.addEventListener('open', () => {
  console.log('Connected to Browser ❤️');
});

// 메시지를 받았을때 응답
socket.addEventListener('message', (message) => {
  const li = document.createElement('li');
  li.innerText = message.data;
  messageList.append(li);
});

// 서버가 꺼졌을때 응답
socket.addEventListener('close', () => {
  console.log('Disconnected😞');
});

// setTimeout(() => {
//   socket.send('HI from browser');
// }, 5000);

function handleMesSubmit(e) {
  e.preventDefault();
  const input = messageForm.querySelector('input');
  socket.send(makeMessage('message', input.value)); // 백엔드로 보냄

  const li = document.createElement('li');
  li.innerText = `YOU : ${input.value}`;
  messageList.append(li);
  input.value = '';
}

function handleNickSubmit(e) {
  e.preventDefault();
  const input = nickForm.querySelector('input');
  socket.send(makeMessage('nick', input.value));
  input.value = '';
}

messageForm.addEventListener('submit', handleMesSubmit);
nickForm.addEventListener('submit', handleNickSubmit);
