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
    cors: { origin: 'https://chatapp-seven-khaki.vercel.app', credentials: true }
})

console.log(io,'io');


io.use(verifySocket);
socketHandler(io);


app.use(express.json());            
app.use(cookieParser());


app.use(cors({
    origin: 'https://chatapp-seven-khaki.vercel.app',
    credentials: true
}))

mongoose
    .connect(config.mongoURL)
    .then(() => console.log('mongodb connected'))
    .catch((err) => console.log('mongodb erro', err))

    console.log("Mongo URL 👉", config.mongoURL);


app.use('/admin/auth', adminAuth_route)
app.use('/admin', admin_route)


app.use('/member/auth', memberAuth_route)
app.use('/member', member_route)


app.use('/groups',chat_route)


const PORT = process.env.PORT || config.port || 4000;

server.listen(PORT, '0.0.0.0', () => {
    console.log('Server is running');
    console.log(`Listening on port ${PORT}`);
});