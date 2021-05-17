
declare let window;



class Settings{


  defaultSettings = {
    tickDuration: 1000,
    visitActiveThreshold: 60 * 1000,
    pauseQuota: 10 * 60 * 1000,
    quotaRenewalHour: 17
  }
  _settings;

  constructor() {

    if (localStorage.getItem('settings')) {
      try {
        this._settings = JSON.parse(localStorage.getItem('settings'))
      } catch (error) {
        this._settings = this.defaultSettings
        console.error(error)
      }
    } else {
      this._settings = this.defaultSettings
      localStorage.setItem('settings', JSON.stringify(this.defaultSettings))

    }
  }


  get pauseQuota(){
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

}



const settings = new Settings();
(window).settings = settings;
export default settings