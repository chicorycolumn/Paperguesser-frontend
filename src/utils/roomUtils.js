exports.requestEntry = (socket, playerData, roomName, roomPassword) => {
  console.log(`€ Request entry with socket: ${socket.id}`);
  socket.emit("Request entry", {
    roomName,
    roomPassword,
  });
};

exports.createRoomName = () => {
  const roomAdjs = [
    "red",
    "green",
    "blue",
    "yellow",
    "purple",
    "orange",
    "white",
    "black",
  ];
  const roomNouns = [
    "ant",
    "bison",
    "cat",
    "duck",
    "elk",
    "fox",
    "goose",
    "hawk",
  ];
  let adj = roomAdjs[Math.floor(Math.random() * roomAdjs.length)];
  let noun = roomNouns[Math.floor(Math.random() * roomNouns.length)];
  return `${adj}${noun}`;
};
