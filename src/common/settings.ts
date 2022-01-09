declare let window

class Settings {
  defaultSettings = {
    apiUrl: 'http://localhost:36168',
    tickDuration: 1000,
    visitActiveThreshold: 60 * 1000,
    pauseQuota: 0,
    quotaRenewalHour: 17,
  }
  _settings

  constructor() {
    if (localStorage.getItem('settings')) {
      try {
        this._settings = JSON.parse(localStorage.getItem('settings'))

        let newSetting = false
        for (const key in this.defaultSettings) {
          if (!(key in this._settings)) {
            this._settings[key] = this.defaultSettings[key]
            newSetting = true
          }
        }

        if (newSetting)
          localStorage.setItem('settings', JSON.stringify(this._settings))
      } catch (error) {
        this._settings = this.defaultSettings
        console.error(error)
      }
    } else {
      this._settings = this.defaultSettings
      localStorage.setItem('settings', JSON.stringify(this.defaultSettings))
    }
  }

  get pauseQuota() {
    return this._settings.pauseQuota
  }

  get visitActiveThreshold() {
    return this._settings.visitActiveThreshold
  }

  get quotaRenewalHour() {
    return this._settings.quotaRenewalHour
  }

  get tickDuration() {
    return this._settings.tickDuration
  }

  get apiUrl(): string {
    return this._settings.apiUrl
  }
}

const settings = new Settings()
window.settings = settings
export default settings
