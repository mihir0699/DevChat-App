const express =  require("express");
const app = express();
const path = require("path");
const http = require('http');
const socket = require('socket.io');
const formatmessage = require('./public/utils/messages');
const {userjoin, getcurrentuser, userleaves, getusers} = require("./public/utils/users");

app.use(express.static(path.join(__dirname, 'public')));
const server = http.createServer(app);
const io = socket(server);
const botName = 'DevChat Bot';

io.on('connection', socket =>{
	socket.on('joinroom', ({ username, room }) => {
    const user = userjoin(socket.id, username, room);

    socket.join(user.room);

    // Welcome current user
    socket.emit('message', formatmessage(botName, 'Welcome to DevChat App!'));

    // Broadcast when a user connects
    socket.broadcast
      .to(user.room)
      .emit(
        'message',
        formatmessage(botName, `${user.username} has joined the chat`)
      );

      io.to(user.room).emit('roomUsers',{
      	room: user.room,
      	users: getusers(user.room)
      } )

     socket.on('chatmsg', (msg)=>{
		const user = getcurrentuser(socket.id);
		if(user)
		{
			io.to(user.room).emit('roomUsers',{
      	room:user.room,
      	users:getusers(user.room)
        })
			io.to(user.room).emit('message',formatmessage(user.username, msg));
		}
		
	})
      socket.on('typing', function(uername){
    	socket.broadcast.to(user.room).emit('typing', username)
    })

	
	socket.on('disconnect', ()=>{
		const user = userleaves(socket.id)
		io.emit('message',formatmessage(botName, `${user.username} has left the chat!`));
	})
      });
	

	
})

const port = 3000|| process.env.PORT
server.listen(port, ()=> console.log(`Server running on PORT ${port}`));