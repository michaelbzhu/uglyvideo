// fabric canvas setup
var canvas = new fabric.Canvas("my-canvas");
canvas.setHeight(document.body.scrollHeight);
canvas.setWidth(document.body.scrollWidth);
fabric.Object.prototype.originX = true;
fabric.Object.prototype.originY = true;

const meems = [
  "https://pyxis.nymag.com/v1/imgs/258/ab8/b37c0379b29ab114b7c18e2bc11e89a5ec-the-weeknd-meme.jpg",
  "https://images.dailyhive.com/20210208113102/The-Weeknd-Super-Bowl-meme-500x258.jpg",
  "https://images.vice.com/motherboard/content-images/contentimage/10791/1399664177814.jpeg?crop=0.9965277777777778xw:1xh;center,center&resize=1200:*",
  "https://images.news18.com/ibnlive/uploads/2021/02/1613011996_untitled-design.jpg",
  "https://mk0coinnouncemdktlrl.kinstacdn.com/wp-content/uploads/2019/10/dogecoin-price-prediction-2020.jpg",
  "https://s.yimg.com/ny/api/res/1.2/VbcLEYqGOCYf9c6Xqu5y5Q--/YXBwaWQ9aGlnaGxhbmRlcjt3PTk2MDtoPTk2Ni45NTY1MjE3MzkxMzA0/https://s.yimg.com/uu/api/res/1.2/v.dZ42vjxY8wwDJAVurvig--~B/aD04MzQ7dz04Mjg7YXBwaWQ9eXRhY2h5b24-/https://media.zenfs.com/en/coindesk_75/0af2f44c8622a758f80a7aa185b4a9e0",
  "https://i.redd.it/kjvdc916y6051.jpg",
  "https://compote.slate.com/images/926e5009-c10a-48fe-b90e-fa0760f82fcd.png?width=1200&rect=680x453&offset=0x30",
  "https://starecat.com/content/wp-content/uploads/stonks-only-go-up-wheel-of-fortune-meme.jpg",
  "https://i.pinimg.com/originals/e1/8e/79/e18e79774e2f5ec7bc61100c2c6ed0f3.png",
  "https://art.ngfiles.com/images/1085000/1085516_superwiibros08_untitled-goose-game-meme.png?f1574025751",
  "https://wompampsupport.azureedge.net/fetchimage?siteId=7575&v=2&jpgQuality=100&width=700&url=https%3A%2F%2Fi.kym-cdn.com%2Fentries%2Ficons%2Ffacebook%2F000%2F018%2F489%2Fnick-young-confused-face-300x256-nqlyaa.jpg",
  "https://i.imgflip.com/2m16fo.jpg",
  "https://i.imgflip.com/1ur9b0.jpg",
  "https://i.imgflip.com/1otk96.jpg",
  "https://i.imgflip.com/28j0te.jpg",
  "https://i.imgflip.com/1c1uej.jpg",
  "https://i.imgflip.com/4acd7j.png",
  "https://i.imgflip.com/1ihzfe.jpg",
  "https://i.imgflip.com/26am.jpg",
  "https://i.imgflip.com/1bij.jpg",
  "https://i.imgflip.com/1h7in3.jpg",
  "https://i.imgflip.com/2896ro.jpg",
  "https://i.imgflip.com/2wifvo.jpg",
  "https://i.imgflip.com/wxica.jpg",
  "https://i.imgflip.com/39t1o.jpg",
  "https://i.imgflip.com/gtj5t.jpg",
  "https://i.imgflip.com/4t0m5.jpg",
  "https://i.imgflip.com/1e7ql7.jpg",
  "https://i.imgflip.com/1bgw.jpg",
  "https://i.imgflip.com/2hgfw.jpg",
  "https://i.imgflip.com/8p0a.jpg",
  "https://i.imgflip.com/9sw43.jpg",
  "https://i.imgflip.com/3si4.jpg",
  "https://i.imgflip.com/51s5.jpg",
  "https://i.imgflip.com/1bim.jpg",
  "https://i.redd.it/2ilq6b6qwbh61.jpg",
  "https://preview.redd.it/xnjv1isufbh61.jpg?width=640&crop=smart&auto=webp&s=f3b3d36de914d42dc16810c93123f9c4e12b8d75",
  "https://preview.redd.it/1su9be8duch61.jpg?width=640&crop=smart&auto=webp&s=496096d83b0b89d3b20627b6d785df6d8ec9dfb3",
  "https://i.redd.it/mr27ocesqbh61.png",
  "https://preview.redd.it/6q329lw63eh61.jpg?width=640&crop=smart&auto=webp&s=999d4da2c38f403f55536469f40bd173f70ae20d",
];

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
    scaleX = 400;
    scaleY = 300;
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

const calls = {}; // calls for streaming media
const connections = {}; // connections for sending data

navigator.mediaDevices
  .getUserMedia({
    video: true,
    audio: true,
  })
  .then((stream) => {
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
      console.log("Other user connected: " + userId);
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
    console.log("initiated connection with " + userId);
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
    tooltip.innerHTML = "Copied!";
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
