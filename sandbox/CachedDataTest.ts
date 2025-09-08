import {CachedData} from "../lib/CachedData";
import {sleepPromise} from "../lib/utils";

class CachedDataTest extends CachedData {

    ma100(p: string) {
        return this.get('ma100', (a)=> {
            console.log('Refresh ' + a);
            return 'Nazrar!';
        }, 100, p)
    }

    protected formatTimeMark(t: number): string {
        const str = String(t - this.start).split('').reverse().join('');
        const formattedStr = str.replace(/(\d{4}(?=\d))/g, '$1 ');
        return '+' + formattedStr.split('').reverse().join('');
    }

    constructor() {
        super();
    }

    protected start = Date.now();
}

const cd = new CachedDataTest();

(async() => {
    for(let i = 0; i < 20; i++) {
        for (const p of ['a', 'b', 'c']) {
            await sleepPromise(10);
            console.log(cd.ma100(p));
        }
    }
    const getImage = cd.useEntry(
        'images',
        (a:number, b:string)=> {
            console.log('Refresh ', [a,b]);
            return [ a , b ];
        },
        100
    );
    for(let i = 0; i < 20; i++) {
        for (const p of ['a', 'b', 'c']) {
            await sleepPromise(10);
            console.log(getImage(42, p));
        }
    }
})();
