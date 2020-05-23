const socket = io();
const chatForm = document.getElementById('chat-form');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');
const feedback = document.getElementById('feedback');
const msg = document.getElementById('msg');
const chatMessages = document.querySelector('.chat-messages');
const {username,room} = Qs.parse(location.search,{
	ignoreQueryPrefix: true
})
socket.emit('joinroom', {username, room});

socket.on('message', (msg)=>{
	console.log(msg);
	outputmsg(msg);
	chatMessages.scrollTop = chatMessages.scrollHeight;
});
msg.addEventListener('keypress', ()=>{
	socket.emit('typing', username);
})
socket.on('roomUsers', ({room, users})=>{
	outputroomname(room);
	outputUsers(users);
})
chatForm.addEventListener('submit',(e)=>{
	e.preventDefault();
	const msg = e.target.elements.msg.value;
	socket.emit('chatmsg', msg);
	e.target.elements.msg.value = "";
	e.target.elements.msg.focus();
})

function outputmsg(msg){
  const div= document.createElement('div');
  div.classList.add('message');
  div.innerHTML = `<p class="meta">${msg.username}<span> ${msg.time}</span></p>
<p class="text">${msg.text}</p>`
document.querySelector('.chat-messages').appendChild(div);
feedback.innerHTML =""
}

function outputroomname(room){
	roomName.innerText= room;
}

function outputUsers(users) {
   userList.innerHTML = `
    ${users.map(user => `<li>${user.username}</li>`).join('')}
  `;
}

socket.on('typing', (handle)=>{
	feedback.innerHTML = '<p><em>' + handle + " is typing..."+ '<em></p>'
})