export class Logger {
  private static isDebugMode = true

  static debug(message: string, ...args: any[]): void {
    if (this.isDebugMode) {
      console.log(`[YouTube Content Filter DEBUG] ${message}`, ...args)
    }
  }

  static info(message: string, ...args: any[]): void {
    console.log(`[YouTube Content Filter INFO] ${message}`, ...args)
  }

  static error(message: string, ...args: any[]): void {
    console.error(`[YouTube Content Filter ERROR] ${message}`, ...args)
  }
}
