let io = require("socket.io");

module.exports = (app) => {
  return io(app);
};
