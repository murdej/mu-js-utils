/**
 * A class for managing cached data with various validation strategies.
 */
export class CachedData {
    /**
     * Retrieves data from the cache using a specified key.
     * If the data is not found or is invalid, it calls a provided getter function
     * to fetch the new data and stores it in the cache before returning.
     * The result is cached separately for each set of arguments.
     * @template T The type of the data to be retrieved.
     * @param {string} key The unique key for the cache entry.
     * @param {(...args: any[]) => T} getter The function that fetches the data if it's not in the cache.
     * @param {CacheValidator} cacheValidator Callback that verifies the validity of the cache, or the validity period in milliseconds..
     * @param {...any[]} args Additional arguments to pass to the getter and validator functions.
     * @returns {T} The retrieved data, either from the cache or from the getter function.
     */
    public get<T>(
        key: string,
        getter: (...args: any[]) => T,
        cacheValidator: CacheValidator,
        ...args: any[]): T
    {
        const cacheKey = this.getCacheKey(key, args);
        const cacheEntry = this.cachedData[cacheKey];
        if (!cacheEntry || !this.validateCache(cacheValidator, cacheEntry, ...args)) {
            this.set(key, getter(...args), ...args);
        }

        return this.cachedData[cacheKey].data;
    }

    /**
     * Put value into cache
     * @param key
     * @param value
     * @param args
     */
    public set(
        key: string,
        value: any,
        ...args: any[]
    ): void {
        const cacheKey = this.getCacheKey(key, args);
        this.cachedData[cacheKey] = {
            data: value,
            getTime: Date.now(),
        };
    }


    /**
    * Creates and returns a function that is a wrapper for the `get` method.
    * This wrapped function remembers `key`, `getter`, and `cacheValidator`
    * and only accepts `args`, which it then passes to the `get` method.
    * This is useful for simplifying calls when you want to repeatedly
    * používat stejný `getter` a strategii cacheování.
    * @template T Funkce, která načítá data.
    * @param {string} key Unikátní klíč pro cache.
    * @param {T} getter Funkce, která načítá data, pokud nejsou v cache.
    * @param {CacheValidator} cacheValidator Callback, který ověřuje platnost cache, nebo dobu platnosti v milisekundách.
    * @returns {(...args: Parameters<T>) => ReturnType<T>} Funkce, která přijímá argumenty pro `getter` a vrací hodnotu z cache.
    */
    public useEntry<T extends ((...args: any) => any)>(
        key: string,
        getter: T,
        cacheValidator: CacheValidator,
    ): (...args: Parameters<T>) => ReturnType<T> {
        return (...args) => this.get(key, getter, cacheValidator, ...args);
    }

    private getCacheKey(key: string, args: any[]|null) {
        return JSON.stringify(key) + ':' + (args !== null ? JSON.stringify(args) : '');
    }

    /**
     * Flushes (deletes) entries from the cache.
     * If no key is provided, the entire cache is cleared.
     * If a key is provided but no arguments, all entries with that key are cleared.
     * If both a key and arguments are provided, only that specific cache entry is cleared.
     * @param {string|null} [key=null] The key of the cache entry or entries to flush.
     * @param {any[]|null} [args=null] The arguments associated with the cache entry to flush.
     * @returns {void}
     */
    public flush(
        key: string|null = null,
        args: any[]|null = null,
    ): void
    {
        if (key === null) {
            this.cachedData = {};
        } else if (args === null) {
            const keyPrefix = this.getCacheKey(key, null);
            for (const k in this.cachedData) {
                if (k.startsWith(keyPrefix)) delete this.cachedData[k];
            }
        } else {
            const fullKey = this.getCacheKey(key, args);
            delete this.cachedData[fullKey];
        }
    }

    protected cachedData: Record<string, CacheDataEntry> = {};

    private validateCache(cacheValidator: CacheValidator, cacheEntry: CacheDataEntry, ...args: any[]) {
        switch (typeof cacheValidator) {
            case 'function':
                return cacheValidator(cacheEntry, ...args);
            case 'number':
                return Date.now() - cacheEntry.getTime < cacheValidator;
        }
        return true;
    }
}

export type CacheDataEntry = { data: any, getTime: number };

export type CacheValidator = ((entry: CacheDataEntry, ...args: any[]) => boolean) | null | number /*| string */;

export type ValueResolver<TP extends any[],TV> = (...args: TP) => TV;