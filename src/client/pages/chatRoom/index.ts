import "./index.css";
import { io } from 'socket.io-client'

// get page path param
const url = new URL(location.href)
const userName = url.searchParams.get('user_name')
const roomName = url.searchParams.get('room_name')

console.log(userName, roomName)

// if user or room empty: redirect
if (!userName || !roomName) {
  location.href = '/main/main.html'
}

// MARK: create socket connection
const clientIo = io()

const textInput = document.getElementById('textInput') as HTMLInputElement
const submitBtn = document.getElementById('submitBtn') as HTMLButtonElement
const chatBoard = document.getElementById('chatBoard') as HTMLDivElement
const headerRoomName = document.getElementById('headerRoomName') as HTMLParagraphElement
const backBtn = document.getElementById('backBtn') as HTMLButtonElement


headerRoomName.innerText = roomName || ' - '

// MARK: get input
submitBtn.addEventListener('click', () => {
  // emit value to backend
  clientIo.emit('chat', textInput.value)
})

backBtn.addEventListener('click', () => {
  location.href = '/main/main.html'
})

// append msg to board
const msgHandler = (msg: string) => {
  const divBox = document.createElement('div')
  
  divBox.classList.add('flex','items-end', 'justify-end', 'mb-4')
  divBox.innerHTML = `
    <p class="mr-4 text-xs text-gray-700">00:00</p>

    <div>
      <p class="mb-1 text-xs text-right text-white">${userName}</p>
      <p
      class="mx-w-[50%] break-all bg-white px-4 py-2 rounded-bl-full rounded-br-full rounded-tl-full"
      >
      ${msg}
      </p>
    </div>
  `
  chatBoard.appendChild(divBox)

  // clear input
  textInput.value = ''
  // scroll to bottom
  chatBoard.scrollTop = chatBoard.scrollHeight
}

clientIo.on('join', (msg) => {})
clientIo.on('chat', (msg) => {
  msgHandler(msg)
})