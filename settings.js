function openSettings() {
  document.getElementById('settingsDialog').showModal()
}

function updateTheme(theme) {
  settings.theme = theme

  const action = theme === 'dark' ? 'add' : 'remove'
  document.documentElement.classList[action]('dark');
}

function updateDisplayMode(mode) {
  settings.format = mode
  if (mode === 'hh:mm') {
    seconds.hidden = true
    hours.hidden = false
  } else {
    seconds.hidden = false
    hours.hidden = true
  }
}

function updateDuration(element) {
  settings[element.id] = element.value
}

function updateProgressVisibility(value) {
  settings.showProgress = value
  document.getElementById('progress').style.display = value ? 'block' : 'none'
}

function updateCyclesVisibility(value) {
  settings.showCycles = value
  document.getElementById('finishedCyclesCountBlock').style.display = value ? 'block' : 'none'
}

function updateSettings() {
  localStorage.setItem('settings', JSON.stringify(settings));
  initSettings()
}

function onCloseSettings() {
  document.getElementById('settingsDialog').close()
}