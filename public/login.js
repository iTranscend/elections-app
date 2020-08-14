const image = new Image();
const Viewer = document.getElementById("viewer");
var email;

async function login() {
  await faceapi.loadSsdMobilenetv1Model("/models");
  await faceapi.loadFaceLandmarkModel("/models");
  await faceapi.loadFaceRecognitionModel("/models");
  // try to access webcam and stream the images
  // to the video element

  document.getElementById("viewer").style.display = "block";
  // document.getElementById("voterId").style.display = "none"
  // document.getElementById("submit-btn").style.display = "none"
  // document.getElementById("signup-anchor").style.display = "none"

  navigator.getUserMedia(
    { video: {} },
    (stream) => (viewer.srcObject = stream),
    (err) => console.error(err)
  );

  // const response = await fetch('/url');
  // const data = await response.json();

  var imageString = "";

  imageString = document.getElementById("base64image").value;

  email = document.getElementById("email").value;

  image.src = imageString;
}

async function match() {
  // debugger;
  const mtcnnResults = await faceapi.ssdMobilenetv1(
    document.getElementById("viewer")
  );
  const canvas = faceapi.createCanvasFromMedia(viewer);
  canvas.width = 500;
  canvas.height = 400;
  const detectionsForSize = mtcnnResults.map((det) => det.forSize(500, 400));
  faceapi.draw.drawDetections(canvas, detectionsForSize);

  const input = document.getElementById("viewer");
  const fullFaceDescriptions = await faceapi
    .detectAllFaces(input)
    .withFaceLandmarks()
    .withFaceDescriptors();

  const labels = [email];

  const labeledFaceDescriptors = await Promise.all(
    labels.map(async (label) => {
      // detect the face with the highest score in the image and compute it's landmarks and face descriptor
      const fullFaceDescription = await faceapi
        .detectSingleFace(image)
        .withFaceLandmarks()
        .withFaceDescriptor();

      if (!fullFaceDescription) {
        throw new Error(`no faces detected`);
      }

      const faceDescriptors = [fullFaceDescription.descriptor];
      // console.log(label)
      return new faceapi.LabeledFaceDescriptors(label, faceDescriptors);
    })
  );

  const maxDescriptorDistance = 0.6; // 0.6 euclidean distance percentage
  const faceMatcher = new faceapi.FaceMatcher(
    labeledFaceDescriptors,
    maxDescriptorDistance
  );

  const results = fullFaceDescriptions.map((fd) =>
    faceMatcher.findBestMatch(fd.descriptor)
  );
  const force = document.getElementById("email").value.trim();
  try {
    if (force == "") throw new error(e);
  } catch (e) {
    var errorMessage = document.getElementById("error");
    errorMessage.textContent = "Email field cannot be left blank";
    setTimeout(() => {
      window.location.href = "/login";
    }, 3000);
  }

  try {
    //var resultFlag
    if (results[0]._label == force) {
      const submit = document.getElementById("submit");
      submit.click();

      console.log("success");
    } else throw new error(e);
  } catch (e) {
    var errorMessage = document.getElementById("error");
    errorMessage.textContent =
      "Face not detected or Email not found... try again";
    setTimeout(() => {
      window.location.href = "/login";
    }, 3000);
  }
}

viewer.addEventListener("play", (onPlay) => {
  match();
});

async function submit() {
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "text/plain",
    },
    body: "success",
  };
  await fetch("/login", options);
}
