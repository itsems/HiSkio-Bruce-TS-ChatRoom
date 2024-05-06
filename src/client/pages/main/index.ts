import "./index.css";

const nameInput = document.getElementById('nameInput') as HTMLInputElement
const roomSelect = document.getElementById('roomSelect') as HTMLSelectElement
const startBtn = document.getElementById('startBtn') as HTMLButtonElement

startBtn.addEventListener('click', () => {
  // get user input values
  const userName = nameInput.value
  const roomName = roomSelect.value
  console.log(userName, roomName)

  // navigate: 把參數帶去 chatRoom.ts 之後去處理
  // location.href = `/chatRoom/chatRoom.html?user_name=${userName}&room_name=${roomName}`
  location.href = `/chatRoom.html?user_name=${userName}&room_name=${roomName}`
  // relocate to: http://localhost:3000/chatRoom/chatRoom.html?user_name=emma&room_name=ROOM4
})