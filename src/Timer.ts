export class Timer {

    /**
     * The date and time when the timer was started.
     * Null if the timer has not been started or has been reset.
     */
    public dateStart: Date|null = null;

    /**
     * The resolve function for the internal promise.
     * This function is called when the timer fires.
     * @private
     */
        // @ts-ignore
    private promiseResolve: () => void;

    /**
     * A promise that resolves when the timer's timeout expires.
     * Calling `wait()` returns this promise.
     * @private
     */
    private promise: Promise<void>;

    /**
     * Gets the current timeout value in milliseconds.
     */
    public get timeout(): number {
        return this._timeout;
    }

    /**
     * Sets the timeout value in milliseconds.
     * If a timer is currently running, it will be updated with the new timeout.
     * @param value The new timeout value in milliseconds.
     */
    public set timeout(value) {
        if (this._timeout === value) return;
        this._timeout = value;
        this.update();
    }

    /**
     * The current timeout value in milliseconds.
     * @protected
     */
    protected _timeout: number = 0;

    /**
     * The ID of the `setTimeout` timer.
     * Null if no timer is currently active.
     * @protected
     */
    protected setTimeoutId: number|null = null;

    /**
     * Creates a new Timer instance.
     * @param timeout The initial timeout value in milliseconds.
     * @param start Whether to start the timer immediately.
     * If a `Date` object is provided, the timer will start at that specific time.
     * Defaults to `true` (start immediately).
     */
    constructor(timeout: number, start: boolean|Date = true) {
        this._timeout = timeout;
        this.promise = new Promise(resolve => this.promiseResolve = resolve);
        if (start) this.start(start === true ? null : start);
    }

    /**
     * Starts the timer.
     * @param date An optional `Date` object specifying the start time.
     * If null or undefined, the timer starts immediately.
     */
    public start(date: Date|null) {
        this.dateStart = date ?? new Date();
        this.update();
    }

    /**
     * Updates the internal `setTimeout` based on the current `dateStart` and `timeout`.
     * If a timer is already running, it will be cleared and a new one will be set.
     * @private
     */
    private update() {
        if (this.setTimeoutId) clearTimeout(this.setTimeoutId);
        if (this.dateStart) {
            const left = this.dateStart.getTime() + this.timeout - (new Date()).getTime();
            if (left > 0) this.setTimeoutId = setTimeout(() => this.fire(), left);
            else this.fire();
        }
    }

    /**
     * Resolves the internal promise, indicating that the timer has expired.
     * @private
     */
    private fire() {
        this.promiseResolve();
    }

    /**
     * Returns a promise that resolves when the timer's timeout expires.
     * You can use `await` with this method to pause execution until the timer finishes.
     * @returns A promise that resolves after the specified timeout.
     */
    public wait(): Promise<void> {
        return this.promise;
    }

    public stop(): void {
        this.dateStart = null;
        this.update();
    }
}