import moment from "moment";
import { DateTimeObjects } from "../../services/ExpressionApi/ExpressionApi.types";

export const getCurrentTimestamp = (isUTC: boolean = true) => {
    const now = new Date();

    if (isUTC) {
        const utcDate = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(),
            now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds(), now.getUTCMilliseconds());

        return utcDate.valueOf();
    }

    return now.valueOf();
}

export const formatDate = (date?: Date | string, format?: string) => {
    if (!date) {
        return undefined;
    }
    const mDate: moment.Moment = typeof date === 'string'
        ? moment(date, 'YYYY/MM/DD') //FIXME: use common format
        : moment(date);

    return mDate.format(format ?? 'LL');
}

export const getHourByPeriod = (time: Date) => {
    return {
        hours: (time.getHours() % 12) || 12,
        minutes: time.getMinutes(),
        seconds: time.getSeconds(),
        period: time.getHours() < 12 ? 'AM' : 'PM',
    }
}

export const msToHMS = (ms: number) => {
    // 1- Convert to seconds:
    let seconds = ms / 1000;
    // 2- Extract hours:
    const hours = Math.round(seconds / 3600); // 3,600 seconds in 1 hour
    seconds = seconds % 3600; // seconds remaining after extracting hours
    // 3- Extract minutes:
    const minutes = Math.round(seconds / 60); // 60 seconds in 1 minute
    // 4- Keep only seconds not extracted to minutes:
    seconds = Math.round(seconds % 60);

    const timeParts: string[] = [];
    if (hours) {
        timeParts.push(hours >= 10 ? `${hours}` : `0${hours}`);
    }
    timeParts.push(minutes >= 10 ? `${minutes}` : `0${minutes}`);
    timeParts.push(seconds >= 10 ? `${seconds}` : `0${seconds}`);

    return timeParts?.join(':');
}

export const formatMindXDatetime = (
    datetime: Date,
    endDate?: Date,
    pickerProps?: DateTimeObjects,
    options?: {
        isDateOnly?: boolean;
        isTimeOnly?: boolean;
    }
) => {
    let finalStr = '';

    let format = pickerProps?.format ?? 'YYYY/MM/DD';

    // change to moment format type
    format = format.replace(/AM\/PM/g, 'A');

    //Handle specials chars
    if (format.includes('오전/오후')) {
        format = format.replace(/오전\/오후/g, 'A[.k]');
    }

    if (datetime?.valueOf?.()) {
        let mDateStr = moment(datetime).format(format);
        let mEndDateStr = endDate ? moment(endDate).format(format) : '';

        if (pickerProps?.type === 'date_range') {
            finalStr = [mDateStr, mEndDateStr]?.filter(it => !!it)?.join(' - ');
        } else {
            finalStr = mDateStr
        }

        //Reformat back special chars
        finalStr = finalStr
            .replace(/AM.k/g, '오전')
            .replace(/PM.k/g, '오후');
    }

    if (options?.isDateOnly) {
        return finalStr?.split(MINDX_DATE_TIME_SEPARATOR)?.[0] ?? '';
    } else if (options?.isTimeOnly) {
        return finalStr?.split(MINDX_DATE_TIME_SEPARATOR)?.[1] ?? '';
    }

    return finalStr;
}

export const MINDX_DATE_TIME_SEPARATOR = ', ';