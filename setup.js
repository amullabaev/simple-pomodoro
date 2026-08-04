const defaultSettings = {
  workDuration: 25,
  shortDuration: 5,
  longDuration: 15,
  theme: 'light',
  format: 'mm:ss',
  showProgress: true,
  showCycles: true
}

let settings;

const initSettings = () => {
  try {
    const savedSettings = JSON.parse(localStorage.getItem('settings') || {})
    settings = { ...defaultSettings, ...savedSettings }
  } catch {
    settings = defaultSettings
  }

  localStorage.setItem('settings', JSON.stringify(settings));

  // set theme
  // theme is set in the first script before the body

  document.getElementById('themeDay').checked = settings.theme === 'light'
  document.getElementById('themeNight').checked = settings.theme === 'dark'

  // set timers
  document.getElementById('work').value = settings.workDuration * 60
  document.getElementById('work').innerHTML = settings.workDuration + ' min'
  document.getElementById('short').value = settings.shortDuration * 60
  document.getElementById('short').innerHTML = settings.shortDuration + ' min'
  document.getElementById('long').value = settings.longDuration * 60
  document.getElementById('long').innerHTML = settings.longDuration + ' min'
  setMode(document.getElementById('work'))

  document.getElementById('workDuration').value = settings.workDuration
  document.getElementById('shortDuration').value = settings.shortDuration
  document.getElementById('longDuration').value = settings.longDuration

  // set format
  document.getElementById('settingsFormatHHMM').checked = settings.format === 'hh:mm'
  document.getElementById('settingsFormatMMSS').checked = settings.format === 'mm:ss'
  updateDisplayMode(settings.format)

  // set progress visibility
  document.getElementById('settingsProgress').checked = settings.showProgress === true
  document.getElementById('progress').style.display = settings.showProgress ? 'block' : 'none'

  // set cycles visibility
  document.getElementById('settingsCycles').checked = settings.showCycles === true
  document.getElementById('finishedCyclesCountBlock').style.display = settings.showCycles ? 'block' : 'none'
}

initSettings()


