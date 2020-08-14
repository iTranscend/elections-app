const viewer = document.getElementById("viewer");
let enableSnap;

async function start() {
  await faceapi.nets.tinyFaceDetector.loadFromUri("/models");
  await faceapi.nets.faceLandmark68Net.loadFromUri("/models");
  await faceapi.nets.faceRecognitionNet.loadFromUri("/models");

  Webcam.set({
    width: viewer.width,
    height: viewer.height,
    image_format: "jpeg",
    jpeg_quality: 90,
  });
  Webcam.attach("viewer");

  const modal = document.getElementById("myModal");
  const span = document.getElementsByClassName("close")[0];
  var firstName = document.getElementById("firstName").value.trim();
  var lastName = document.getElementById("lastName").value.trim();
  var email = document.getElementById("email").value.trim();

  try {
    if (firstName == "" || lastName == "" || email == "") throw new error(e);
  } catch {
    var errorMessage = document.getElementById("error");
    errorMessage.style.display = "inline";
    errorMessage.textContent =
      "field(s) cannot be left blank... refreshing page";
    setTimeout(() => {
      window.location.href = "/index";
    }, 3000);
  }

  modal.style.display = "block";

  span.onclick = function () {
    modal.style.display = "none";
  };
  window.onclick = function (event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  };

  return LaunchViewer();
}

function LaunchViewer() {
  navigator.getUserMedia(
    { video: {} },
    (stream) => (viewer.srcObject = stream),
    (err) => console.error(err)
  );
}

function takeSnapshot() {
  if (enableSnap == 1) {
    // take snapshot and get image data
    Webcam.snap((data_uri) => {
      // display results in page
      document.getElementById("results").innerHTML =
        '<img id="faceImage" src="' + data_uri + '"/>';
    });

    document.getElementById("saveSnap-btn").style.display = "inline";
  } else {
    var errorMessage = document.getElementById("error");
    errorMessage.style.display = "inline";
    errorMessage.textContent =
      "no face detected... adjust your face position till a box is drawn over your face";
  }
}

async function saveSnap() {
  const base64image = document.getElementById("faceImage").src;
  var firstName = document.getElementById("firstName").value.trim();
  var lastName = document.getElementById("lastName").value.trim();
  var email = document.getElementById("email").value.trim();

  const voterId = makeId(firstName, lastName);

  const data = { base64image, voterId, firstName, lastName, email };

  // debugger;

  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  };
  await fetch("/url", options);
}

viewer.addEventListener("play", () => {
  const canvas = faceapi.createCanvasFromMedia(viewer);

  document.body.append(canvas);

  const displaysize = { width: viewer.width, height: viewer.height };
  faceapi.matchDimensions(canvas, displaysize);
  setInterval(async () => {
    const detections = await faceapi
      .detectAllFaces(viewer, new faceapi.TinyFaceDetectorOptions())
      .withFaceLandmarks();
    if (detections.length == 1) {
      enableSnap = 1;
    } else {
      enableSnap = 0;
    }
    const resizedDetections = faceapi.resizeResults(detections, displaysize);

    canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);

    faceapi.draw.drawDetections(canvas, resizedDetections);
  }, 100);
});
function makeId(firstName, lastName) {
  var result = "";
  let voter;
  const length = 3;
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  voter = "#VT" + firstName.charAt(0) + lastName.charAt(0) + result;
  return voter;
  console.log(result);
}
