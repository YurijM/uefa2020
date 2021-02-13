const express = require('express');
const cors = require('cors');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

const authkeyRoutes = require('./routes/authkey.routes');
const gamblerRoutes = require('./routes/gambler.routes');
const emailRoutes = require('./routes/email.routes');
const chatRoutes = require('./routes/chat.routes');
const groupRoutes = require('./routes/group.routes');
const teamRoutes = require('./routes/team.routes');
const stadiumRoutes = require('./routes/stadium.routes');
const gameRoutes = require('./routes/game.routes');
const totalizatorRoutes = require('./routes/totalizator.routes');
const stakeRoutes = require('./routes/stake.routes');
const pointRoutes = require('./routes/point.routes');
const imageRoutes = require('./routes/image.routes');

app.use(cors());

app.use('/api/authkey', authkeyRoutes);
app.use('/api/gambler', gamblerRoutes);
app.use('/api/email', emailRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/group', groupRoutes);
app.use('/api/team', teamRoutes);
app.use('/api/stadium', stadiumRoutes);
app.use('/api/game', gameRoutes);
app.use('/api/totalizator', totalizatorRoutes);
app.use('/api/stake', stakeRoutes);
app.use('/api/point', pointRoutes);
app.use('/api/image', imageRoutes);

io.on('connection', (socket) => {
  //console.log('a user connected');

  const room = 'uefa2020';
  let gamblerId = 0;
  let socketId = socket.id;

  socket.join(room); //Если будет несколько "комнат", то, наверное, правильнее подключаться к ней
                     //внутри прослушивания конкретного события

  /****************************************************************************/
  socket.on('login', data => {
    gamblerId = data.id;
    data.socket_id = socketId;

    socket.emit('setSocketId', data);

    socket.broadcast.emit('addToChat', data);

    const message = {
      fromId: 0,
      fromNick: 'администратор',
      photo: '',
      to: room,
      date: Date.now(),
      message: `${data.nickname} ${data.sex === 'м' ? 'вошёл' : 'вошла'} в приложение`
    };

    socket.emit('messageToDB', message);

    io.to(room).emit('sendMessage', message);

    socket.broadcast.emit('setMessage', {status: 'primary', text: message.message})
  });

  /****************************************************************************/
  socket.on('newMessage', data => {
    data.date = Date.now();

    socket.emit('messageToDB', data);
    io.to(room).emit('sendMessage', data);

    socket.broadcast.emit('setMessage', {status: 'primary', text: data.screenMessage});
  });

  /****************************************************************************/
  socket.on('editMessage', data => {
    socket.emit('messageUpdateDB', data);

    io.to(room).emit('updateMessage', data);

    socket.broadcast.emit('setMessage', {status: 'primary', text: data.screenMessage});
  });

  /****************************************************************************/
  socket.on('deleteMessage', data => {
    socket.emit('messageDeleteDB', data);

    io.to(room).emit('deleteMessage', data);

    socket.broadcast.emit('setMessage', {status: 'primary', text: data.screenMessage});
  });

  /****************************************************************************/
  socket.on('changeGambler', data => {
    /*socket.broadcast.emit('loadGamblers');
    socket.broadcast.emit('changeResult');*/
    io.to(room).emit('loadGamblers');
    io.to(room).emit('changeResult');

    socket.broadcast.emit('setMessage', {
      status: 'primary',
      text: `Изменились свойства игрока ${data.nickname}`
    });
  });

  /****************************************************************************/
  socket.on('changeResult', data => {
    socket.broadcast.emit('changeResult');
    //socket.emit('updatePlaces', data.groupId);

    socket.broadcast.emit('setMessage', {
      status: 'primary', text: `Игра ${data.team1}-${data.team2} - счёт ${data.goal1}:${data.goal2}`
    });
  });

  /****************************************************************************/
  socket.on('changeProfile', data => {
    gamblerId = data.gambler.id;
    data.gambler.socket_id = socketId;

    socket.emit('setSocketId', data.gambler);

    socket.broadcast.emit('loadGamblers');
    socket.broadcast.emit('changeResult');
    socket.broadcast.emit('addToChat', data.gambler);
    socket.broadcast.emit('loadMessages', {range: 1});

    const message = {
      fromId: 0,
      fromNick: 'администратор',
      photo: '',
      to: room,
      date: Date.now(),
      message: data.isSign
        ? `${data.gambler.nickname} ${data.gambler.sex === 'м' ? 'зарегистрировался' : 'зарегистрировалась'} в системе`
        : `${data.gambler.nickname} ${data.gambler.sex === 'м' ? ' обновил' : 'обновила'} свой профиль`
    };

    socket.emit('messageToDB', message);

    io.to(room).emit('sendMessage', message);

    socket.broadcast.emit('setMessage', {status: 'primary', text: message.message})
  });

  /****************************************************************************/
  socket.on('logout', data => {
    io.to(room).emit('logout', data);

    const message = {
      fromId: 0,
      fromNick: 'администратор',
      to: room,
      date: Date.now(),
      message: `${data.nickname} ${data.sex === 'м' ? 'вышёл' : 'вышла'} из приложения`
    };

    socket.emit('messageToDB', message);
    socket.broadcast.emit('sendMessage', message);
    socket.broadcast.emit('setMessage', {status: 'primary', text: message.message});
  });

  /*socket.on('disconnect', () => {
    console.log('clients before:', clients)

    let gamblerId = 0
    const idx = clients.findIndex(e => e.socketId === socket.id)

    if (idx >= 0) {
      gamblerId = clients[idx].gamblerId
      clients.splice(idx, 1)
    }

    clients = clients.filter(e => e.gamblerId > 0)

    console.log('clients after:', clients)

    socket.broadcast.emit('exit', {id: gamblerId, sockets: clients});
  })*/

  /*socket.on('disconnect', () => {
    let id = gamblerId
    console.log('socket.id:', socket.id)
    let idClient = clients.indexOf(socket.id)
    clients.splice(idClient, 1)
    //console.log('socket:', io.sockets.connected[clients[0]])
    console.log('socket:', clients.length > 0 ? io.sockets.connected[clients[0]] : 'Нет клиентов')

    //io.sockets.connected[clients[0]].emit('exit', {id: gamblerId});
    //io.sockets.connected[clients[0]].emit('exit', {id});
    socket.broadcast.emit('logout', {id});

    const message = {
      fromId: 0,
      fromNick: 'администратор',
      to: room,
      date: Date.now(),
      message: `disconnect: gambler - ${id}, clients length - ${clients.length}`
    };

    socket.broadcast.emit('messageToDB', message);
    socket.broadcast.emit('sendMessage', message);
    socket.broadcast.emit('setMessage', {status: 'primary', text: message.message});
  });*/

  /****************************************************************************/
  /*socket.on('reload', data => {
    console.log('socket-reload');
    data.socket_id = socketId;

    socket.emit('setSocketId', data);

    socket.broadcast.emit('addToChat', data);
  });*/

  /****************************************************************************/
  /*socket.on('chat', data => {
    gamblerId = data.id;
    data.socket_id = socketId;

    socket.emit('setSocketId', data);

    io.to(room).emit('addToChat', data);
  });*/

  /****************************************************************************/
  /*socket.on('disconnect', (reason) => {
    io.of('/').clients((error, clients) => {
      if (error) throw error;

      if (clients.length > 0) { //иначе ничего сделать нельзя, так как некому "прослушать" данное событие (никого нет в комнате)
        socket.broadcast.emit('update', {sockets: clients, id: gamblerId})
      }
    });
  })*/
});

module.exports = {app, server};
