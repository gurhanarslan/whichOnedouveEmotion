const video = document.getElementById('video');

Promise.all([
    faceapi.nets.tinyFaceDetector.loadFromUri("./models"),
    faceapi.nets.ageGenderNet.loadFromUri('./models'),
    faceapi.nets.faceLandmark68Net.loadFromUri("./models"),
    faceapi.nets.faceRecognitionNet.loadFromUri("./models"),
    faceapi.nets.faceExpressionNet.loadFromUri("./models"),
]).then(startCamera())

function startCamera() {
    navigator.getUserMedia({
        video :{} },
        stream => (video.srcObject = stream), err=> console.log(err))
}


video.addEventListener('play',  ()=>{
    const canvas = faceapi.createCanvasFromMedia(video);
   const boxSize = {
       width: video.width,
       height: video.height
   }
    document.body.append(canvas)

faceapi.matchDimensions(canvas,boxSize)
    setInterval(async() => {
        const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions().withFaceDescriptors()
            canvas.getContext('2d').clearRect(0,0,canvas.width,canvas.height)
        console.log(detections);
    
        
        const resizedDetections = faceapi.resizeResults(detections,boxSize);
        faceapi.draw.drawDetections(canvas,resizedDetections)
        faceapi.draw.drawFaceLandmarks(canvas,resizedDetections)
        faceapi.draw.drawFaceExpressions(canvas,resizedDetections)
      //  faceapi.draw.drawAgeGender(canvas,resizedDetections)
    }, 100);
})

//startCamera()