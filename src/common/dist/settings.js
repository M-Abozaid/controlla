"use strict";
exports.__esModule = true;
var Settings = /** @class */ (function () {
    function Settings() {
        this.defaultSettings = {
            apiUrl: 'http://localhost:36168',
            tickDuration: 1000,
            visitActiveThreshold: 60 * 1000,
            pauseQuota: 2 * 60 * 1000,
            quotaRenewalHour: 17
        };
        if (localStorage.getItem('settings')) {
            try {
                this._settings = JSON.parse(localStorage.getItem('settings'));
                var newSetting = false;
                for (var key in this.defaultSettings) {
                    if (!(key in this._settings)) {
                        this._settings[key] = this.defaultSettings[key];
                        newSetting = true;
                    }
                }
                if (newSetting)
                    localStorage.setItem('settings', JSON.stringify(this._settings));
            }
            catch (error) {
                this._settings = this.defaultSettings;
                console.error(error);
            }
        }
        else {
            this._settings = this.defaultSettings;
            localStorage.setItem('settings', JSON.stringify(this.defaultSettings));
        }
    }
    Object.defineProperty(Settings.prototype, "pauseQuota", {
        get: function () {
            return this._settings.pauseQuota;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Settings.prototype, "visitActiveThreshold", {
        get: function () {
            return this._settings.visitActiveThreshold;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Settings.prototype, "quotaRenewalHour", {
        get: function () {
            return this._settings.quotaRenewalHour;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Settings.prototype, "tickDuration", {
        get: function () {
            return this._settings.tickDuration;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Settings.prototype, "apiUrl", {
        get: function () {
            return this._settings.apiUrl;
        },
        enumerable: false,
        configurable: true
    });
    return Settings;
}());
var settings = new Settings();
(window).settings = settings;
exports["default"] = settings;
