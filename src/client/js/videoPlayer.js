const video = document.querySelector("video");
const playBtn = document.getElementById("play");
const playBtnIcon = playBtn.querySelector("i");
const muteBtn = document.getElementById("mute");
const muteBtnIcon = muteBtn.querySelector("i");
const volumeRange = document.getElementById("volume");
const currentTime = document.getElementById("currentTime")
const totalTime = document.getElementById("totalTime")
const timeline = document.getElementById("timeline")    
const fullScreenBtn = document.getElementById("fullScreen")
const fullScreenIcon = fullScreenBtn.querySelector("i");
const videoContainer = document.getElementById("videoContainer")
const videoControls = document.getElementById("videoControls")

let controlsTimeout = null;
let controlsMovementTimeout = null;
let volumeValue = 0.5;
video.volume = volumeValue;

const handlePlayClick = (e) => {
    if(video.paused){
        video.play();
    } else {
        video.pause();
    }
    playBtnIcon.classList = video.paused ? "fas fa-play" : "fas fa-pause";
}

const handleMute = (e) => {
    if (video.muted) {
    video.muted = false;
    video.volume = volumeValue;
    } else {
    video.muted = true;
    }
    muteBtnIcon.classList = video.muted
    ? "fas fa-volume-mute"
    : "fas fa-volume-up";
    volumeRange.value = video.muted ? 0 : volumeValue;
    };

const handleInputVolumeRange = (event) => {
    const {
    target: { value },
    } = event;
    if (video.muted) {
    video.muted = false;
    muteBtn.innerText = "Mute";
    }
    if (value == 0) {
    video.muted = true;
    muteBtn.innerText = "Unmute";
    }
    video.volume = value;
};

const handleChangeVolumeRange = (event) => {
    const {
    target: { value },
    } = event;
    if (value != 0) {
    volumeValue = value;
    }
};

const formatTime = (seconds) => new Date(seconds * 1000).toISOString().substring(14, 19);

const handleLoadedMetadata = () => {   
    totalTime.innerText = formatTime(Math.floor(video.duration))
    timeline.max = Math.floor(video.duration);
}

const handleMetadata = () => {
    video.readyState;
}

const handleTimeUpdate = () => {
    currentTime.innerText = formatTime(Math.floor(video.currentTime))
    timeline.value = Math.floor(video.currentTime)
}

const handleTimelineChange = (event) => {
    const { target: {value}} = event;
    video.currentTime = value;
}

const handleFullScreen = () => {
    const fullscreen = document.fullscreenElement;
    if(fullscreen){
        document.exitFullscreen();
        fullScreenIcon.classList = "fas fa-expand";
    } else {
        videoContainer.requestFullscreen();
        fullScreenIcon.classList = "fas fa-compress";
    }
}

const hideControls = () => videoControls.classList.remove("showing");

const handleMouseMove = () => {
    if(controlsTimeout){
        clearTimeout(controlsTimeout)
        controlsTimeout = null;
    }   
    if(controlsMovementTimeout){
        clearTimeout(controlsMovementTimeout);
        controlsMovementTimeout = null;
    }
    videoControls.classList.add("showing")
    controlsMovementTimeout = setTimeout(hideControls, 3000);
}

const handleMouseLeave = () => {
    controlsTimeout = setTimeout(hideControls, 3000);
}

const handleSpacebar = (event) => {
    if (event.code === "Space"){
        handlePlayClick(); 
    }
}

const handleFKey = (event) => {
    if (event.code === "KeyF") {
      handleFullScreen();
    }
  };
  
  const handleESCKey = (event) => {
    if (event.code === "Escape") {
      handleFullScreen();
    }
  };

playBtn.addEventListener("click", handlePlayClick);
video.addEventListener("click", handlePlayClick);
document.addEventListener("keyup", handleSpacebar)
muteBtn.addEventListener("click", handleMute);
volumeRange.addEventListener("input", handleInputVolumeRange);
volumeRange.addEventListener("change", handleChangeVolumeRange);
video.addEventListener("loadeddata", handleLoadedMetadata);
video.addEventListener("loadeddata", handleMetadata);
video.addEventListener("timeupdate", handleTimeUpdate)
timeline.addEventListener("input", handleTimelineChange)
fullScreenBtn.addEventListener("click", handleFullScreen)
videoContainer.addEventListener("mousemove", handleMouseMove)
videoContainer.addEventListener("mouseleave", handleMouseLeave)
document.addEventListener("keydown", handleSpacebar)
document.addEventListener("keydown", handleFKey)
document.addEventListener("keydown", handleESCKey)