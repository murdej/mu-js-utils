/**
 * A utility class that ensures that the callback function is executed only once in a given interval, if send is called multiple times in a given interval the interval is extended with each call. The callback is called with the parameters of the last send.
 */
export class DelayedSingleRun {
	private timeout: number;
	private callback: (...args: any[]) => void;
	// @ts-ignore
	private lastSend: Date;
	private timeoutHandler: number|null = null;
	private doIgnoreNextSend: boolean = false;

	/**
	 * @constructor
	 * @param {number} timeout - The delay in miliseconds for the callback execution.
	 * @param {(...args: any[]) => void} callback - The function to execute.
	 */
	constructor(timeout: number, callback: (...args: any[]) => void) {
		this.timeout = timeout;
		this.callback = callback;
	}
	/**
	 * @public
	 * @method send
	 * @description Triggers the delayed execution of the callback. If `send` is called multiple times
	 * within the `timeout` period, the previous pending executions are effectively cancelled, and
	 * only the latest call in interval will potentially lead to the callback's execution after its respective delay.
	 * The callback is only invoked if the time elapsed since the last `send` call is greater than or equal to the configured timeout.
	 * @param {...any[]} args - Arguments to be passed to the callback function.
	 */
	public send(...args: any[]) {
		// if (this.timeoutHandler) clearTimeout(this.timeoutHandler);
		if (this.doIgnoreNextSend) {
			this.doIgnoreNextSend = false;
			return;
		}
		this.lastSend = new Date();
		this.timeoutHandler = setTimeout(() => {
			if (!this.timeoutHandler) return;
			const diff = (new Date().getTime() - this.lastSend.getTime());
			if (diff >= this.timeout) {
				this.callback(...args);
			}
		}, this.timeout + 1)
	}

	/**
	 * @description Cancel current waiting
	 */
	public cancel() {
		if (this.timeout) clearTimeout(this.timeout);
		this.timeout = 0;
	}

	/**
	 * @description Execute callback immediately without waiting
	 * @param args
	 */
	public runNow(...args: any[]) {
		this.callback(...args);
	}

	/**
	 * @description ignore one next call of .send()
	 */
	public ignoreNextSend() {
		this.doIgnoreNextSend = true;
	}
}
