const capture_btn = document.querySelector("#capture-btn");

let hidden_canvas = document.createElement("canvas");
console.log("got canvas");

let scene = document.getElementById("scene");

let extracted = document.querySelector("#extracted");

capture_btn.addEventListener("click", async function () {
  let video = document.querySelector("#arjs-video"); // AR video
  context = hidden_canvas.getContext("2d");

  var width = video.videoWidth,
    height = video.videoHeight;

  // Setup a canvas with the same dimensions as the video.
  hidden_canvas.width = width;
  hidden_canvas.height = height;

  // Make a copy of the current frame in the video on the canvas.
  context.drawImage(video, 0, 0, width, height);

  // Turn the canvas image into a dataURL that can be used as a src for our photo.
  let capture_b64 = hidden_canvas.toDataURL("image/png");
  console.log(capture_b64);
  extracted.setAttribute("src", capture_b64);

  // Remove the background
  console.log("fetch new");
  fetch("https://10.13.92.89:5000/removebg", {
    method: "POST",
    body: JSON.stringify({ base64img: capture_b64 }),
    headers: { "Content-Type": "application/json" },
  })
    .then((response) => response.json())
    .then((d) => {
      console.log(d.data);
      let bg_rmv = "data:image/png;base64," + d.data;
      extracted.setAttribute("src", bg_rmv);
    });
});
