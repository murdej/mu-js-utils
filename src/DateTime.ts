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
    public static dateToInput(date: Date|null|string, accuracy: 'day'|'minute'|'second'): string
    {
        if (typeof date === 'string') date = new Date(date);
        if (!date) return '';
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

    public static modifyAdd(date: Date, seconds: number): Date
    {
        date.setTime(date.getTime() + seconds * 1000);
        return date;
    }

    public static add(date: Date, seconds: number): Date
    {
        return this.modifyAdd(new Date(date), seconds);
    }

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

    public static dateFromInput(value: string) {

    }
}