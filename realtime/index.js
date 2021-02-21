let io = require("socket.io");

module.exports = (app) => {
  let ioapp = io(app);

  let allconnections = [];

  ioapp.on("connection", (socket) => {
    console.log("[NEW] New connection to the server was detected.");
    allconnections.push(socket);

    socket.on("disconnect", () => {
      allconnections = allconnections.filter((ele) => {
        return ele.id !== socket.id;
      });
    });
  });

  return ioapp;
};
