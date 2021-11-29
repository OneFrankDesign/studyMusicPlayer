const image = document.querySelector("img");
const title = document.getElementById("title");
const artist = document.getElementById("artist");
const body = document.querySelector("body");
const colors = document.getElementById("colors");

const numberOfBars = 50;

const music = document.querySelector("audio");

const progressContainer = document.getElementById("progress-container");
const progress = document.getElementById("progress");
const playBtn = document.getElementById("play");
const prevBtn = document.getElementById("prev");
const nextBtn = document.getElementById("next");
const progressBar = document.querySelector(".progress-bar");
const currentTime = document.getElementById("current-time");
const duration = document.getElementById("duration");
const shuffleBtn = document.getElementById("shuffle");
const repeatBtn = document.getElementById("repeat");

const visualizerContainer = document.querySelector(".visualizer-container");

let songs = [
  {
    name: "All-this-bs",
    displayName: "All-this-bs",
    artist: "WataBoi",
  },
  {
    name: "Commercial-rock-beats",
    displayName: "Commercial-rock-beats",
    artist: "Coma Media",
  },
  {
    name: "Awakening Instrumental",
    displayName: "Awakening Instrumental",
    artist: "WataBoi",
  },
  {
    name: "Jazzy-abstract-beat",
    displayName: "Jazzy-abstract-beat",
    artist: "Coma Media",
  },
  {
    name: "Cali",
    displayName: "Cali",
    artist: "WataBoi",
  },
  {
    name: "Lofi-chill-x2",
    displayName: "Lofi-chill-x2",
    artist: "Ceeadidit",
  },
  {
    name: "Fluid",
    displayName: "Fluid",
    artist: "WataBoi",
  },
  {
    name: "Moonshiner",
    displayName: "Moonshiner",
    artist: "Jacob Field",
  },
  {
    name: "Tula",
    displayName: "Tula",
    artist: "Ansfoto",
  },
  {
    name: "Lo-Fi-Beat",
    displayName: "Lo-Fi-Beat",
    artist: "Coma Media",
  },
];

let isPlaying = false;

function togglePlay() {
  isPlaying = true;
  music.play();
  playBtn.classList.replace("fa-play", "fa-pause");
  playBtn.setAttribute("title", "Pause");
}
function togglePause() {
  isPlaying = false;
  music.pause();
  playBtn.classList.replace("fa-pause", "fa-play");
  playBtn.setAttribute("title", "Play");
}

function loadSong(song) {
  title.textContent = song.displayName;
  artist.textContent = song.artist;
  image.src = `./img/${song.name}.jpg`;
  music.src = `./music/${song.name}.mp3`;
}

loadSong(songs[9]);

let currentSong = 9;

const formatTime = (time) => {
  let minutes = Math.floor(time / 60);
  let seconds = Math.floor(time % 60);
  minutes = minutes < 10 ? "0" + minutes : minutes;
  seconds = seconds < 10 ? "0" + seconds : seconds;
  return minutes + ":" + seconds;
};

const updateProgress = async (e) => {
  if (isPlaying) {
    const { duration: songDuration, currentTime: songCurrentTime } = music;
    progress.style.width = `${(songCurrentTime / songDuration) * 100}%`;
    currentTime.textContent = formatTime(songCurrentTime);
    duration.textContent = formatTime(songDuration);
    if (songCurrentTime === songDuration) {
      progress.style.width = 0;
      nextBtn.click();
    } else {
      setTimeout(updateProgress, 1000);
    }
  }
};

const repeatSong = () => {
  if (repeatBtn.classList.contains("active")) {
    repeatBtn.classList.remove("active");
    music.loop = false;
  } else {
    music.loop = false;
    repeatBtn.classList.add("active");
    if (repeatBtn.classList.contains("active")) {
      music.loop = true;
      music.play();
    } else {
      music.loop = false;
    }
  }
};

const progressClick = (e) => {
  const width = progressContainer.clientWidth;
  const clickX = e.offsetX;
  const { duration } = music;
  music.currentTime = (clickX / width) * duration;
  updateProgress();
};

playBtn.addEventListener("click", () => {
  isPlaying ? togglePause() : togglePlay();
  const audioContext = new AudioContext();
  const audioSource = audioContext.createMediaElementSource(music);
  const analyser = audioContext.createAnalyser();
  audioSource.connect(analyser);
  audioSource.connect(audioContext.destination);

  const frequencyData = new Uint8Array(analyser.frequencyBinCount);
  analyser.getByteFrequencyData(frequencyData);
  for (let i = 0; i < frequencyData.length; i++) {
    const bar = document.createElement("div");
    bar.setAttribute("id", `bar${i}`);
    bar.setAttribute("class", "visualizer-bar");
    visualizerContainer.appendChild(bar);
  }

  function renderFrame() {
    analyser.getByteFrequencyData(frequencyData);
    for (let i = 0; i < numberOfBars; i++) {
      const index = Math.floor((i + 10) * 2);

      fd = frequencyData[index];
      const bar = document.getElementById(`bar${i}`);
      if (!bar) continue;
      barHeight = Math.max(4, fd / 2 || 0);
      bar.style.height = `${barHeight}px`;
    }
    requestAnimationFrame(renderFrame);
  }

  renderFrame();
});
prevBtn.addEventListener("click", () => {
  currentSong--;
  if (currentSong < 0) currentSong = songs.length - 1;
  loadSong(songs[currentSong]);
  body.style.background = `url(./img/${songs[currentSong].name}.jpg)`;
  body.style.backgroundSize = "cover";
  body.style.backgroundRepeat = "no-repeat";
  body.style.backgroundPosition = "center";
  body.style.backgroundAttachment = "fixed";
  togglePlay();
});

nextBtn.addEventListener("click", () => {
  currentSong++;
  if (currentSong > songs.length - 1) currentSong = 0;
  loadSong(songs[currentSong]);
  body.style.background = `url(./img/${songs[currentSong].name}.jpg)`;
  body.style.backgroundSize = "cover";
  body.style.backgroundRepeat = "no-repeat";
  body.style.backgroundPosition = "center";
  body.style.backgroundAttachment = "fixed";

  togglePlay();
  updateProgress();
});

music.addEventListener("timeupdate", updateProgress);
repeatBtn.addEventListener("click", repeatSong);
progressContainer.addEventListener("click", progressClick);
