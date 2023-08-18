export interface LogArgs {
  /**timestamp the log is written */
  timestamp: number;
  /**@optional eventName of the log */
  eventName?: string;
  /**log info */
  log: string;
  /**@optional object data of the log that should be saved */
  logObj?: any;
}
