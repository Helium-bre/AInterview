// recording audio

let mediaRecorder;
let audioChunks = [];
let audioBlob;

export async function startRecording() {
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

  mediaRecorder = new MediaRecorder(stream, {
    mimeType: "audio/webm"
  });

  audioChunks = [];

  mediaRecorder.ondataavailable = (event) => {
    if (event.data.size > 0) {
        console.log(`Recording ${event.data.size} bytes of audio data`);
        audioChunks.push(event.data);
    }
  };

  mediaRecorder.start();
}

export function stopRecording() {
    return new Promise((resolve) => {
        mediaRecorder.onstop = () => {
            //const audioBlob = new Blob(audioChunks, {
            audioBlob = new Blob(audioChunks, { //update global instead
                type: "audio/webm"
            });
            resolve(audioBlob);
        };

        mediaRecorder.stop();
    });
}

// playing audio

export async function playAudio() {
    //const audioBlob = await stopRecording();
    try {
        const url = URL.createObjectURL(audioBlob);
        const audio = new Audio(url);

        const audioElement = new Audio(url);
        audioElement.play();
    }
    catch (error) {
        console.error("Error playing audio:", error);
    }

}