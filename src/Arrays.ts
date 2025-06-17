export class Arrays {
    public static remove(array: any[], element: any): void {
        const index: number = array.indexOf(element);
        if (index >= 0) {
            array.splice(index, 1);
        }
    }
}