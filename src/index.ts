import devServer from "@/server/dev";
import prodServer from "@/server/prod";
import express from "express";
import { Server } from 'socket.io'
import http from 'http'
import UserService from '@/service/UserService'

const port = 3000;
const app = express();
const server = http.createServer(app)
const io = new Server(server)
const userService = new UserService()

// 監測連接
io.on('connection', (socket) => {
  
  socket.on('join', ({ userName, roomName }: { userName: string, roomName: string}) => {
    const userData = userService.userDataInfoHandler(
      socket.id,
      userName, 
      roomName
    )
    socket.join(userData.roomName)
    userService.addUser(userData)
    socket.broadcast.to(userData.roomName).emit('join', `${userName} join the room`)
    
  })

  socket.on('chat', (msg) => {
    io.emit('chat', msg)
  })

  socket.on('disconnect', () => {
    const userData = userService.getUser(socket.id)
    const userName = userData?.userName
    if (userName) {
      socket.broadcast.to(userData.roomName).emit('leave', `${userName} leave the room`)
    }
    userService.removeUser(socket.id)
  })
})

// 執行npm run dev本地開發 or 執行npm run start部署後啟動線上伺服器
if (process.env.NODE_ENV === "development") {
  devServer(app);
} else {
  prodServer(app);
}

server.listen(port, () => {
  console.log(`The application is running on port ${port}.`);
});
