/**
 * A utility class for string manipulation.
 */
export class Strings {

    /**
     * Capitalizes the first letter of a given string.
     *
     * @param {string} str The input string.
     * @returns {string} The string with the first letter capitalized, or the original string if it's empty or null.
     */
    public static ucFirstLetter(str: string): string {
        return str ? str.charAt(0).toUpperCase() + str.slice(1) : str;
    }
}