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
    public static DateToInput(date: Date|null, accuracy: 'day'|'minute'|'second'): string
    {
        if (!date) return '';
        switch (accuracy) {
            case 'day': return date.toISOString().slice(0, 19);
            case 'minute': return date.toISOString().slice(0, 16);
            case 'second': return date.toISOString().slice(0, 19);
        }
    }
}