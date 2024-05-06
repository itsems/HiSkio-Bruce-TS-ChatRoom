import "./index.css";
import { io } from 'socket.io-client'
import { UserData } from '@/service/UserService'

type UserMsg = { userData: UserData, msg: string, time: string }

// get page path param
const url = new URL(location.href)
const userName = url.searchParams.get('user_name')
const roomName = url.searchParams.get('room_name')

console.log(userName, roomName)

// if user or room empty: redirect
if (!userName || !roomName) {
  // location.href = '/main/main.html'
  location.href = '/'
}

// MARK: create socket connection
const clientIo = io()

// MARK: join
clientIo.emit('join', { userName, roomName })

const textInput = document.getElementById('textInput') as HTMLInputElement
const submitBtn = document.getElementById('submitBtn') as HTMLButtonElement
const chatBoard = document.getElementById('chatBoard') as HTMLDivElement
const headerRoomName = document.getElementById('headerRoomName') as HTMLParagraphElement
const backBtn = document.getElementById('backBtn') as HTMLButtonElement


let userId = ''

headerRoomName.innerText = roomName || ' - '

// MARK: get input
submitBtn.addEventListener('click', () => {
  // emit value to backend
  clientIo.emit('chat', textInput.value)
})
textInput.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    clientIo.emit('chat', textInput.value)
  }
})

backBtn.addEventListener('click', () => {
  // location.href = '/main/main.html'
  location.href = '/'
})

// append msg to board
const msgHandler = (data: UserMsg) => {

  const date = new Date(data.time)
  const time = `${date.getHours()}:${date.getMinutes()}`
  console.log(time)

  const divBox = document.createElement('div')
  
  divBox.classList.add('flex','items-end', 'mb-4')
  if (data.userData.id === userId) {
    // 自己的訊息
    divBox.classList.add('justify-end')
    divBox.innerHTML = `
    <p class="mr-4 text-xs text-gray-700">${time}</p>
    
    <div>
      <p class="mb-1 text-xs text-right text-white">${data.userData.userName}</p>
      <p class="mx-w-[50%] break-all bg-white px-4 py-2 rounded-bl-full rounded-br-full rounded-tl-full">
      ${data.msg}
      </p>
    </div>
    `
  } else {
    // 別人的訊息
    divBox.classList.add('justify-start')
    divBox.innerHTML = `
    <div>
      <p class="mb-1 text-xs text-gray-700">${data.userData.userName}</p>
      <p
        class="mx-w-[50%] break-all bg-gray-800 px-4 py-2 rounded-tr-full rounded-br-full rounded-tl-full text-white"
      >
        ${data.msg}
      </p>
    </div>
    <p class="ml-4 text-xs text-gray-700">${time}</p>
    `
  }
  chatBoard.appendChild(divBox)

  // clear input
  textInput.value = ''
  // scroll to bottom
  chatBoard.scrollTop = chatBoard.scrollHeight
}

const roomMsgHandler = (msg: string) => {
  
  const divBox = document.createElement('div')
  divBox.classList.add('flex','items-center', 'justify-center', 'mb-4')
  divBox.innerHTML = `
  <p class="text-sm text-gray-700">${msg}</p>
  `
  chatBoard.appendChild(divBox)
  // scroll to bottom
  chatBoard.scrollTop = chatBoard.scrollHeight
}

clientIo.on('join', (msg) => { })
clientIo.on('chat', (data: UserMsg) => {
  msgHandler(data)
})
clientIo.on('join', (msg) => {
  roomMsgHandler(msg)
})
clientIo.on('leave', (msg) => {
  roomMsgHandler(msg)
})
clientIo.on('userId', (id) => {
  userId = id
})