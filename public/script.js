// fabric canvas setup
var canvas = new fabric.Canvas("my-canvas");
canvas.setHeight(document.body.scrollHeight);
canvas.setWidth(document.body.scrollWidth);
fabric.Object.prototype.originX = true;
fabric.Object.prototype.originY = true;

document.getElementById("decorateButton").addEventListener("click", () => {
  const imageURL = document.getElementById("imageURL");
  addImage(imageURL.value);
});

document.getElementById("surpriseButton").addEventListener("click", () => {
  const url = meems[Math.floor(Math.random() * meems.length)];
  addImage(url);
});

function addImage(url) {
  console.log(url);
  fabric.Image.fromURL(url, (img) => {
    scaleX = 250;
    scaleY = 250;
    x = Math.floor(Math.random() * canvas.getWidth()) + scaleX / 2;
    y = Math.floor(Math.random() * canvas.getHeight()) + scaleY / 2;
    console.log(x, y);
    img.set({ left: x, top: y });
    img.scaleToHeight(scaleY);
    img.scaleToWidth(scaleX);
    canvas.add(img);
  });
}

canvas.isDrawingMode = true; //For free hand drawing

// video and webrtc setup
const socket = io("/"); // connect to root path of our app
const videoGrid = document.getElementById("video-grid");

// add our own video stream to our own screen
const myVideo = document.createElement("video");
myVideo.muted = true; // mutes video for ourselves so we don't echo
myVideo.msHorizontalMirror = true; // flip horizontally

// create a peer that connects to our local server on port 3001
// const myPeer = new Peer(undefined, {
//   host: "/",
//   port: "3001",
// });

// user open source PeerServer Cloud
const myPeer = new Peer();
let myPeerId;

const calls = {}; // calls for streaming media
const connections = {}; // connections for sending data

navigator.mediaDevices
  .getUserMedia({
    video: true,
    audio: true,
  })
  .then((stream) => {
    if (myPeerId) {
      console.log("post-stream: sent join room request to room" + ROOM_ID);
      socket.emit("join-room", ROOM_ID, myPeerId);
    }

    console.log("stream loaded");
    // stream is our audio + video
    addVideoStream(myVideo, stream);

    // responding to a call
    // if another user/peer "calls" us
    // we answer by sending them back our video stream
    // add their video to our screen
    myPeer.on("call", (call) => {
      console.log("recieved call from" + call.peer);
      call.answer(stream);
      const video = document.createElement("video");
      video.setAttribute("id", call.peer);
      call.on("stream", (recievedVideoStream) => {
        addVideoStream(video, recievedVideoStream);
      });
      calls[call.peer] = call;
      call.on("close", () => {
        console.log("peer connection closed: " + call.peer);
        video.remove();
      });
    });

    myPeer.on("connection", (conn) => {
      console.log("made peer connection with " + conn.peer);

      // Receive messages
      conn.on("data", function (data) {
        console.log("Received", data);
        var syncObj = JSON.parse(data);
        if (syncObj.type === "path") {
          addPath(syncObj);
        } else {
          addImage(syncObj.url);
        }
      });

      canvas.on("path:created", function (options) {
        console.log("path created", options);
        if (options.path) {
          var obj = options.path;
          console.log(obj);
          conn.send(JSON.stringify(obj));
        }
      });
      // decorate event listener
      document
        .getElementById("decorateButton")
        .addEventListener("click", () => {
          const imageURL = document.getElementById("imageURL");
          var obj = {
            type: "image",
            url: imageURL.value,
          };
          console.log(obj);
          conn.send(JSON.stringify(obj));
        });
      document
        .getElementById("surpriseButton")
        .addEventListener("click", () => {
          const url = meems[Math.floor(Math.random() * meems.length)];
          var obj = {
            type: "image",
            url: url,
          };
          console.log(obj);
          conn.send(JSON.stringify(obj));
        });
    });

    // once our own video stream is set up
    // we need connect with other users
    // accept user-connected events
    socket.on("user-connected", (userId) => {
      console.log("Recieved socketio connection request from: " + userId);
      // send our own video stream to the other users
      connectToNewUser(userId, stream);
    });
  });

// when another user disconnects
socket.on("user-disconnected", (userId) => {
  console.log("User disconnected: " + userId);
  if (calls[userId]) {
    calls[userId].close();
    delete calls[userId];
  }
  if (connections[userId]) {
    connections[userId].close();
    delete connections[userId];
  }
});

// this is run once we connect with the peer server and recieve an id
myPeer.on("open", (id) => {
  console.log("sent join room request to room" + ROOM_ID);
  myPeerId = id;
  myVideo.setAttribute("id", id);
  socket.emit("join-room", ROOM_ID, id);
});

function connectToNewUser(userId, stream) {
  // initiating a call
  // connect to other user and send them our video stream
  const call = myPeer.call(userId, stream);
  console.log("made call to " + userId);
  // create a video element to hold the video stream they send back
  const video = document.createElement("video");
  video.setAttribute("id", userId);
  // when other users send their video streams, add it to our grid
  call.on("stream", (otherUserVideoStream) => {
    console.log("recieved answer to my call from " + userId);
    addVideoStream(video, otherUserVideoStream);
  });
  calls[userId] = call;
  // listen to close event so we can remove videos once someone leaves a call
  call.on("close", () => {
    console.log("peer connection closed: " + userId);
    video.remove();
  });

  // initiating a connection
  var conn = myPeer.connect(userId);
  connections[userId] = conn;
  conn.on("open", () => {
    // Send messages
    console.log("initiated peer connection with " + userId);
  });
  // Receive messages
  conn.on("data", function (data) {
    console.log("Received", data);
    var syncObj = JSON.parse(data);
    if (syncObj.type === "path") {
      addPath(syncObj);
    } else {
      addImage(syncObj.url);
    }
  });
  // send canvas updates
  canvas.on("path:created", function (options) {
    console.log("path created/sent to connection", userId);
    if (options.path) {
      var obj = options.path;
      console.log(obj);
      conn.send(JSON.stringify(obj));
    }
  });
  // decorate event listener
  document.getElementById("decorateButton").addEventListener("click", () => {
    const imageURL = document.getElementById("imageURL");
    var obj = {
      type: "image",
      url: imageURL.value,
    };
    console.log(obj);
    conn.send(JSON.stringify(obj));
  });
  document.getElementById("surpriseButton").addEventListener("click", () => {
    const url = meems[Math.floor(Math.random() * meems.length)];
    var obj = {
      type: "image",
      url: url,
    };
    console.log(obj);
    conn.send(JSON.stringify(obj));
  });
}

function addVideoStream(video, stream) {
  video.srcObject = stream;
  video.addEventListener("loadedmetadata", () => {
    // play the video once the stream is loaded
    video.play();
  });
  // add video element to our videogrid
  videoGrid.append(video);
}

pathReducer = (accumulator, curr) => {
  for (var i in curr) {
    accumulator += curr[i] + " ";
  }
  return accumulator;
};

function addPath(path) {
  pathstr = path["path"].reduce(pathReducer, "");
  var path2 = new fabric.Path(pathstr);
  delete path.path;
  path2.set(path);
  canvas.add(path2);
}

// // create a rectangle object
// var rect = new fabric.Rect({
//   left: 100,
//   top: 100,
//   fill: "red",
//   width: 20,
//   height: 20,
// });
// canvas.add(rect);

// canvas.on("object:added", function (options) {
//   if (options.target) {
//     var obj = options.target;
//     if (obj.type == "rect") {
//       console.log("You added a rectangle!");
//     }

//     socket.emit("update-canvas", obj);
//   }
// });

function copyTextToClipboard(text) {
  // found on stack overflow
  // https://stackoverflow.com/questions/37308210/copy-current-url-button-javascript
  var textArea = document.createElement("textarea");

  // styling to reduce flash render
  textArea.style.position = "fixed";
  textArea.style.top = 0;
  textArea.style.left = 0;
  textArea.style.width = "2em";
  textArea.style.height = "2em";
  textArea.style.padding = 0;
  textArea.style.border = "none";
  textArea.style.outline = "none";
  textArea.style.boxShadow = "none";
  textArea.style.background = "transparent";

  textArea.value = text;

  document.body.appendChild(textArea);

  textArea.select();

  try {
    var successful = document.execCommand("copy");
    var msg = successful ? "successful" : "unsuccessful";
    console.log("Copying text command was " + msg);
    var tooltip = document.getElementById("tooltip");
    tooltip.innerHTML = "Link Copied!";
  } catch (err) {
    console.log("Oops, unable to copy");
  }

  document.body.removeChild(textArea);
}

function CopyLink() {
  copyTextToClipboard(location.href);
}

function outFunc() {
  var tooltip = document.getElementById("tooltip");
  tooltip.innerHTML = "";
}
