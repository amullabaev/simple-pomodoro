let timerId;
let wakeLock;

const workBtn = document.getElementById("work");
const shortBreakBtn = document.getElementById("short");
const longBreakBtn = document.getElementById("long");
const startBtn = document.getElementById("start");
const displayMode = document.getElementById("displayMode")
const progressBar = document.getElementById("progress")

const hours = document.getElementById("hours");
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

function disableActions() {
  workBtn.disabled = true
  shortBreakBtn.disabled = true
  longBreakBtn.disabled = true
}

function enableActions() {
  workBtn.disabled = false
  shortBreakBtn.disabled = false
  longBreakBtn.disabled = false
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
  disableActions()
  if (timerInSeconds <= 0) resetTimeToSelectedMode();
  runTimer();
  setWakeLock();
}

function resetTimer() {
  clearInterval(timerId);
  renameActionButton('Start')
  enableActions()
  if (wakeLock) {
    wakeLock.release();
    wakeLock = null;
  }
}

function runTimer() {
  if (timerId) clearTimeout(timerId)
  const startMs = performance.now()
  const endMs = startMs + timerInSeconds * 1000

  const tick = () => {
    const timeLeftMs = Math.max(0, endMs - performance.now())
    const secondsLeft = Math.ceil(timeLeftMs / 1000)
    setClock(secondsLeft)
    setProgress(secondsLeft)

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
    startBtn.innerText = timerInSeconds > 0 ? "Continue" : "Start"
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

function resetTimeToSelectedMode() {
  const activeMode = document.querySelector('.mode .active')
  setClock(Number(activeMode.value))
}

function setClock(timeInSeconds) {
  timerInSeconds = timeInSeconds
  hours.innerText = Math.floor(timeInSeconds / 60 / 60).toString().padStart(2, '0');
  minutes.innerText = Math.floor((timeInSeconds % 3600) / 60).toString().padStart(2, '0');
  seconds.innerText = Math.floor(timeInSeconds % 60).toString().padStart(2, '0');
};

function setProgress(timeInSeconds) {
  const activeMode = document.querySelector('.mode .active')
  progressBar.value = (timeInSeconds / activeMode.value) * 100
}

function onDisplayModeChange(mode) {
  const newMode = mode === 'mm:ss' ? 'hh:mm' : 'mm:ss'
  displayMode.value = newMode
  displayMode.innerText = newMode
  if (newMode === 'hh:mm') {
    seconds.hidden = true
    hours.hidden = false
  } else {
    seconds.hidden = false
    hours.hidden = true
  }
}