import { DateTimeHelper } from '../../utils';
import { LogArgs } from './Logger.types';

export class Logger {
  private logArray: LogArgs[];
  constructor() {
    this.logArray = [];
  }

  logEvent = (eventName: string, log: string, obj?: any) => {
    this.logArray.push({
      timestamp: DateTimeHelper.getCurrentTimestamp(),
      eventName,
      log,
      logObj: obj,
    });
  };

  getLogTexts = (from?: Date, to?: Date): string[] => {
    const logsToPrint = this.logArray?.filter(
      (it) =>
        (!from || it?.timestamp >= from?.valueOf()) &&
        (!to || it?.timestamp >= to?.valueOf())
    );
    return logsToPrint?.map((it) => Logger.getLogText(it));
  };

  private static getLogText = (args: LogArgs): string => {
    const date = new Date(args.timestamp);
    let obj = '';
    try {
      obj = args?.logObj ? JSON.stringify(args?.logObj) : '';
    } catch (e) {
      obj = 'illegible obj';
    }
    return `- [${date?.toISOString()}] [${args?.eventName}] [${
      args?.log
    }] [${obj}]`;
  };
}
