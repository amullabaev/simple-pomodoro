let timerId;
let wakeLock;

const workBtn = document.getElementById("work");
const shortBreakBtn = document.getElementById("short");
const longBreakBtn = document.getElementById("long");
const startBtn = document.getElementById("start");
const minutes = document.getElementById("minutes");
const seconds = document.getElementById("seconds");

const defaultWorkTimeSeconds = workBtn.value
const shortBreakSeconds = shortBreakBtn.value
const longBreakSeconds = longBreakBtn.value

let timerInSeconds = defaultWorkTimeSeconds

function setMode(selectedModeButton) {
  workBtn.classList.remove("active");
  longBreakBtn.classList.remove("active");
  shortBreakBtn.classList.remove("active");

  selectedModeButton.classList.add("active")

  setClock(Number(selectedModeButton.value));
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

function onStartPauseClick(action) {
  if (action === 'start') {
    onStartClick()
  } else {
    resetTimer()
  }
}

function onStartClick() {
  renameActionButton('Pause');
  if (timerInSeconds <= 0) resetTimeToSelectedMode();
  runTimer();
  setWakeLock();
}

function runTimer() {
  if (timerId) clearTimeout(timerId)
  const startMs = performance.now()
  const endMs = startMs + timerInSeconds * 1000

  const tick = () => {
    const timeLeftMs = Math.max(0, endMs - performance.now())
    const secondsLeft = Math.ceil(timeLeftMs / 1000)
    setClock(secondsLeft)

    if (timeLeftMs <= 0) {
      resetTimer()
      return
    }
    const delay = timeLeftMs % 1000 || 1000
    timerId = setTimeout(tick, delay)
  }

  tick()
}

function renameActionButton(name) {
  if (name === 'Start') {
    startBtn.innerText = "Start"
    startBtn.value = "start"
  } else {
    startBtn.innerText = "Pause"
    startBtn.value = "pause"
  }
}

async function setWakeLock() {
  try {
    wakeLock = await navigator.wakeLock.request("screen");
  } catch (e) {
    console.log(e)
  }
}

function resetTimer() {
  clearInterval(timerId);
  renameActionButton('Start')
  if (wakeLock) {
    wakeLock.release();
    wakeLock = null;
  }
}

function resetTimeToSelectedMode() {
  const activeMode = document.querySelector('.mode .active')
  setClock(Number(activeMode.value))
}

function setClock(timeInSeconds) {
  timerInSeconds = timeInSeconds
  minutes.innerText = Math.floor(timeInSeconds / 60).toString().padStart(2, '0');
  seconds.innerText = Math.floor(timeInSeconds % 60).toString().padStart(2, '0');
};