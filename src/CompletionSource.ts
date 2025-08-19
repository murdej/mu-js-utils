export class CompletionSource<T>
{
    // @ts-ignore
    private resolver: (data:T)=>void;
    // @ts-ignore
    private promise: Promise<T>;

    // @ts-ignore
    done(data: T = undefined) {
        this.resolver(data);
    }

    wait(): Promise<T> {
        return this.promise;
    }

    reset(): void {
        this.promise = new Promise<T>((resolve, reject) => this.resolver = resolve);
    }

    constructor() {
        this.reset();
    }
}