let timerId;
let wakeLock;

const modes = {
  work: 'work',
  short: 'short',
  long: 'long'
}

let activeMode = modes.work;

const workBtn = document.getElementById("work");
const shortBreakBtn = document.getElementById("short");
const longBreakBtn = document.getElementById("long");
const startBtn = document.getElementById("start");
const minutes = document.getElementById("minutes");
const seconds = document.getElementById("seconds");

function setWorkTime() {
  activeMode = modes.work;
  workBtn.classList.add("active");
  longBreakBtn.classList.remove("active");
  shortBreakBtn.classList.remove("active");
  setTime('25', '00');
}

function setShortBreak() {
  activeMode = modes.short;
  workBtn.classList.remove("active");
  longBreakBtn.classList.remove("active");
  shortBreakBtn.classList.add("active");
  setTime('05', '00');
}

function setLongBreak() {
  activeMode = modes.long;
  workBtn.classList.remove("active");
  longBreakBtn.classList.add("active");
  shortBreakBtn.classList.remove("active");
  setTime('15', '00');
}

function onThemeClick() {
  document.documentElement.classList.toggle('dark');
  localStorage.setItem('theme', document.documentElement.classList.contains('dark') ? 'dark' : 'light');
}

function toggleFullScreen() {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen();
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    }
  }
}

function onStartClick() {
  const action = startBtn.innerText === "Start" ? "start" : "pause";
  action === "start" ? (startBtn.innerText = "Pause") : (startBtn.innerText = "Start");
  if (action === "start") {
    setWakeLock()
    timerId = setInterval(() => {
      if (seconds.innerText !== "00") {
        seconds.innerText = (+seconds.innerText - 1).toString().padStart(2, '0');
      } else if (minutes.innerText !== "00") {
        minutes.innerText = (+minutes.innerText - 1).toString().padStart(2, '0');
        seconds.innerText = "59";
      } else {
        clearInterval(timerId);
        startBtn.innerText = "Start";
      }
    }, 1000);
  } else {
    resetTimer()
  }
}

function setWakeLock() {
  if ('wakeLock' in navigator) {
    navigator.wakeLock.request('screen').then(wl => {
      wakeLock = wl;
      wakeLock.addEventListener('release', () => {
        console.log('Wake Lock was released');
      });
    })
  }
}

function resetTimer() {
  clearInterval(timerId);
  if (wakeLock) {
    wakeLock.release();
    wakeLock = null;
  }
}

function setTime(m, s) {
  const minutes = document.getElementById("minutes");
  const seconds = document.getElementById("seconds");
  minutes.innerText = m;
  seconds.innerText = s;
};