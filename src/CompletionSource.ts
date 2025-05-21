class CompletionSource<T>
{
    // @ts-ignore
    private resolver: (data:T)=>void;
    private promise: Promise<T> = new Promise<T>((resolve, reject) => this.resolver = resolve);

    // @ts-ignore
    done(data: T = undefined) {
        this.resolver(data);
    }

    wait(): Promise<T> {
        return this.promise;
    }
}