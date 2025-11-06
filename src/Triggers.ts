/**
 * @class Triggers
 * @description A static utility class for managing and dispatching events (triggers).
 */
export class Triggers<T = string> {

    /**
     * @static
     * @method addHandler
     * @description Registers one or more handler functions for a specific trigger name(s).
     * @param {string|string[]} names - The name or array of names of the trigger(s) to listen for.
     * @param {TriggerCallback} handler - The function to execute when the trigger fires.
     * @param {boolean} [oneTime=false] - If true, the handler is removed after the first execution.
     */
    public static addHandler(names: string|string[], handler: TriggerCallback, oneTime: boolean = false) {
        for(const name of (typeof names === "string" ? [ names ] : names)) {
            this.handlers[name] = this.handlers[name] ?? [];
            this.handlers[name].push({
                callback: handler,
                oneTime,
            })
        }
    }

    /**
     * @static
     * @method removeHandler
     * @description Removes a specific handler function from one or more trigger name(s).
     * @param {string|string[]} names - The name or array of names of the trigger(s) to remove the handler from.
     * @param {TriggerCallback} handler - The specific handler function to remove.
     */
    public static removeHandler(names: string|string[], handler: TriggerCallback) {
        for(const name of (typeof names === "string" ? [ names ] : names)) {
            if (this.handlers[name]) {
                this.handlers[name] = this.handlers[name].filter(
                    itemHandler => itemHandler.callback !== handler
                )
            }
        }
    }

    /**
     * @static
     * @method dispatch
     * @description Executes all registered handlers for the specified trigger name.
     * Handlers marked as 'oneTime' are removed after execution.
     * @param {string} name - The name of the trigger to dispatch.
     * @param {...any} args - Arguments to pass to the handler functions.
     */
    public static dispatch(name: string, ...args: any[]) {
        if (this.useLog) console.log(['Dispatching "' + name + '"', args]);
        let rm = false;
        for(const handler of this.handlers[name] ?? []) {
            if (this.useLog) console.log([' - Handler', handler]);
            const ev: TriggerEvent = {
                name
            };
            handler.callback(ev, ...args);
            if (handler.oneTime) rm = true;
        }
        if (rm) {
            this.handlers[name] = this.handlers[name].filter(
                itemHandler => !itemHandler.oneTime
            );
        }
    }

    /**
     * @static
     * @method dispatchAsync
     * @description WIP: Executes all registered handlers for the specified trigger name asynchrony.
     * @param {string} name - The name of the trigger to dispatch.
     * @param {...any} args - Arguments to pass to the handler functions.
     */
    public static async dispatchAsync(name: string, ...args: any[]) {
        this.dispatch(name, ...args);
    }

    /**
     * @static
     * @method reset
     * @description Clears all registered trigger handlers, effectively resetting the system.
     */
    public static reset() {
        this.handlers = {};
    }

    /**
     * @static
     * @method waitFor
     * @description Returns a Promise that resolves when the specified trigger is dispatched.
     * The handler is automatically removed after the trigger fires (oneTime: true).
     * @param {string} name - The name of the trigger to wait for.
     * @returns {Promise<any[]>} A Promise that resolves with the arguments passed to the `dispatch` method.
     */
    public static waitFor(name: string): Promise<any[]>
    {
        return new Promise((resolve, reject) => {
            this.addHandler(
                name,
                (...args: any[]) => resolve(args),
                true
            );
        });
    }

    protected static handlers: Record<string, Trigger[]> = {};

    /**
     * @static
     * @type {boolean}
     * @description Flag to enable console logging for dispatch actions.
     */
    public static useLog = false;
}

/**
 * @callback TriggerCallback
 * @description A callback function executed when a trigger is dispatched.
 * @param {TriggerEvent} ev - The event object containing details about the dispatched trigger.
 * @param {...any} args - Additional arguments passed to the dispatch method.
 * @returns {any}
 */
export type TriggerCallback = (ev: TriggerEvent, ...args: any[]) => any;

/**
 * @typedef {object} TriggerEvent
 * @property {string} name - The name of the dispatched trigger.
 */
export type TriggerEvent = {
    name: string,
};

/**
 * @typedef {object} Trigger
 * @property {TriggerCallback} callback - The function to execute when the trigger fires.
 * @property {boolean} oneTime - If true, the handler is removed after the first execution.
 */
export type Trigger = {
    callback: TriggerCallback,
    oneTime: boolean,
}