const express = require('express')
const cors = require('cors')
const http = require('http');
const { Server } = require('socket.io');
const { default: mongoose } = require('mongoose');
const config = require('./config/config');


const adminAuth_route = require('./routes/admin/adminAuth');
const admin_route = require('./routes/admin/adminRoute');
const memberAuth_route = require('./routes/member/memberAuth');
const member_route = require('./routes/member/memberRoute');
const chat_route = require('./routes/chat/chatRout');

const socketHandler = require("./socket/socketHandler");
const verifySocket = require("./middleware/verifySocket");


const cookieParser = require("cookie-parser");

require('dotenv').config();

const app = express()
const server = http.createServer(app)

const io = new Server(server, {
    cors: { origin: 'http://localhost:5173', credentials: true }
})

console.log(io,'io');


io.use(verifySocket);
socketHandler(io);


app.use(express.json());            
app.use(cookieParser());


app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}))

mongoose
    .connect(config.mongoURL)
    .then(() => console.log('mongodb connected'))
    .catch((err) => console.log('mongodb erro', err))



app.use('/admin/auth', adminAuth_route)
app.use('/admin', admin_route)


app.use('/member/auth', memberAuth_route)
app.use('/member', member_route)


app.use('/groups',chat_route)

server.listen(config.port, '0.0.0.0', () => {
    console.log('server is running')
    console.log(`http://localhost:${config.port}`);

})