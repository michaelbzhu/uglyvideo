const express = require("express");
const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server);
const { v4 } = require("uuid");

// using ejs as our view engine
app.set("view engine", "ejs");
// public will be our root directory for serving static assets
app.use(express.static("public"));

app.get("/", (req, res) => {
  // redirect user to a randomly generated roomid
  res.redirect(`/${v4()}`);
});

app.get("/:room", (req, res) => {
  // render room.ejs
  // roomId can be passed to ejs file
  res.render("room", { roomId: req.params.room });
});

// runs whenever someone connects to our webpage
io.on("connection", (socket) => {
  // listen to join-room event which occurs when someone joins a room
  socket.on("join-room", (roomId, userId) => {
    console.log(roomId, userId); // for debugging
    socket.join(roomId); // connects the user (socket) to the room
    // broadcast the user-connected event to everyone in the room
    socket.to(roomId).broadcast.emit("user-connected", userId);

    // when a user disconnects
    // broadcast to all the remaining users
    // the disconnect event with the userId of the disconnected user
    socket.on("disconnect", () => {
      socket.to(roomId).broadcast.emit("user-disconnected", userId);
    });
  });
});

if (module === require.main) {
  const PORT = process.env.PORT || 8080;
  server.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
    console.log("Press Ctrl+C to quit.");
  });
}
// [END appengine_websockets_app]

module.exports = server;
