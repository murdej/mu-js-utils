import {StrParser} from "./StrParser";

export class DateTime {

    /**
     * Converts a Date object to a string format suitable for HTML input elements of type 'date' or 'datetime-local'.
     *
     * @param {Date|null} date The Date object to convert. If null, an empty string is returned.
     * @param {'day'|'minute'|'second'} accuracy The desired level of accuracy for the output string:
     *   - 'day': YYYY-MM-DD
     *   - 'minute': YYYY-MM-DDTHH:mm
     *   - 'second': YYYY-MM-DDTHH:mm:ss
     * @returns {string} The formatted string.
     */
    public static dateToInput(date: Date|null|string, accuracy: 'day'|'minute'|'second'|HTMLInputElement): string
    {
        if (typeof date === 'string') date = new Date(date);
        if (!date) return '';
        if (accuracy instanceof HTMLInputElement) {
            if (accuracy.type === 'date') accuracy = 'day';
            else accuracy = (accuracy.step === '' || parseInt(accuracy.step) >= 60)
                ? 'minute'
                : 'second';
        }
        switch (accuracy) {
            case 'day': return this.format(date, 'Y-m-d');
            case 'minute': return this.format(date, 'Y-m-d\TH:i');
            case 'second': return this.format(date, 'Y-m-d\TH:i:s');
        }
    }

    /**
     * Format Date like php function date
     * @param date
     * @param format
     */
    public static format(date: Date|null|string, format: string): string
    {
        if (!date) return '';
        if (typeof date === 'string') date = new Date(date);
        const stp = new StrParser(format);
        const replacement: Record<string,(d:Date)=>string> = {
            d: d => d.getDate().toString().padStart(2, '0'),
            j: d => d.getDate().toString(),
            m: d => (d.getMonth() + 1).toString().padStart(2, '0'),
            n: d => d.getMonth().toString(),
            i: d => d.getMinutes().toString().padStart(2, '0'),
            s: d => d.getSeconds().toString().padStart(2, '0'),
            H: d => d.getHours().toString().padStart(2, '0'),
            G: d => d.getHours().toString(),
            Y: d => d.getFullYear().toString().padStart(4, '0'),
            y: d => d.getFullYear().toString().substring(-2).padStart(2, '0'),
            '\\': d => {
                const ch = format.substr(stp.pos().position, 1);
                stp.moverel(1);
                return ch;
            }
        }
        const chunks = Object.keys(replacement);
        let res = '';
        stp.savePos('start');
        while (!stp.isEnd()) {
            const pos = stp.findNext(chunks, false);
            if (pos !== null) {
                res += stp.substring('start', pos);
                res += replacement[pos.chunk!](date);

            } else {
                res += stp.substring('start');
            }
            stp.toEndChunk();
            stp.savePos('start');
        }

        return res;
    }

    /**
     *
     * @param date
     * @param seconds
     */
    public static modifyAdd(date: Date, ...seconds: (number|DateTimeAddStr)[]): Date
    {
        for (const val of seconds) {

            if (typeof val === 'number') {
                date.setTime(date.getTime() + val * 1000);
            } else {
                const tmp = val.trim();
                const p = tmp.indexOf(' ');
                const num = parseInt(tmp.substring(0, p));
                // @ts-ignore
                let unit: DateTimeAddUnit = tmp.substring(p + 1).trim();
                unit = unitAlias[unit] ?? unit;
                switch (unit) {
                    case 'seconds':
                    case 'minutes':
                    case 'hours':
                        const sec = {
                            seconds: 1,
                            minutes: 60,
                            hours: 3600,
                        }[unit] * num;
                        date.setTime(date.getTime() + sec * 1000);
                        break;
                    case "days":
                        date.setDate(date.getDate() + num);
                        break;
                    case "weeks":
                        date.setDate(date.getDate() + num * 7);
                        break;
                    case "months":
                        date.setMonth(date.getMonth() + num);
                        break;
                    case "years":
                        date.setFullYear(date.getFullYear() + num);
                        break;
                }
            }
        }

        return date;
    }

    /**
     *
     * @param date
     * @param seconds
     */
    public static add(date: Date, ...seconds: (number|DateTimeAddStr)[]): Date
    {
        return this.modifyAdd(new Date(date), ...seconds);
    }

    /**
     *
     * @param value
     * @param accuracy
     */
    public static secondsToInput(value: number, accuracy: 'minute'|'seconds'): string
    {
        const s = value % 60;
        value = Math.floor(value / 60);
        const m = value % 60;
        value = Math.floor(value / 60);
        const h = value;

        return `${h.toString().padStart(2,'0')}:${m.toString().padStart(2, '0')}`
            + (accuracy === 'seconds' ? `:${m.toString().padStart(2, '0')}` : '');
    }

    /**
     *
     * @param value
     */
    public static dateFromInput(value: null|string) {
        return value
            ? new Date(value)
            : null;
    }

    /**
     *
     * @param date
     */
    public static getWeekNumberISO(date: Date): number {
        const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
        const dayNum = d.getUTCDay() || 7;
        d.setUTCDate(d.getUTCDate() + 4 - dayNum);
        const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
        // @ts-ignore
        return Math.ceil(((d - yearStart) / 86400000 + 1) / 7);
    }

    public static secondsFromInput(str: string): number
    {
        const [ h, m, s ] = str.split(':');
        return parseInt(h) * 3600 + parseInt(m) * 60 + parseInt(s ?? 0);
    }

    /**
     * Returns diff bewteen dates in seconds
     * @param a
     * @param b
     */
    public static diff(a: Date, b: Date): number
    {
        return (a.getTime() - b.getTime()) / 1000;
    }
}

type DateTimeAddUnit = 's' | 'second' | 'seconds' | 'm' | 'minute' | 'minutes' | 'h' | 'hour' | 'hours' | 'd' | 'day' | 'days' | 'w' | 'week' | 'weeks' | 'month' | 'months' | 'year' | 'years';

export type DateTimeAddStr = `${number} ${DateTimeAddUnit}`;

const unitAlias: Partial<Record<DateTimeAddUnit, DateTimeAddUnit>> = {
    s: 'seconds',
    second: 'seconds',
    m: 'minutes',
    minute: 'minutes',
    h: 'hours',
    hour: 'hours',
    d: 'days',
    day: 'days',
    w: 'weeks',
    week: 'weeks',
    month: 'months',
    year: 'years',
}