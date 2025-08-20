export class Arrays {
    public static remove(array: any[], element: any): void {
        const index: number = array.indexOf(element);
        if (index >= 0) {
            array.splice(index, 1);
        }
    }

    public static intersect<T1,T2,K = keyof any>(array1: T1[], array2: T2[], getKey1Callback: null|((item:T1)=>K) = null, getKey2Callback: null|((item:T2)=>K) = null): [T1, T2][] {
        if (!getKey1Callback) getKey1Callback = (item)=> item as unknown as K;
        if (!getKey2Callback) getKey2Callback = (item)=> item as unknown as K;
        const map = new Map(array2.map(obj => [getKey2Callback(obj), obj]));
        
        return array1.reduce((accumulator: [T1,T2][], obj1) => {
            const key = getKey1Callback(obj1);
            if (map.has(key)) {
                // @ts-ignore
                accumulator.push([obj1, map.get(key)]);
            }

            return accumulator;
        }, []);
    }
}