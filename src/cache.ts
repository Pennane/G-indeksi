import type { GambinaIndex, Cache } from './types.d.ts'
import { CACHE_EXPIRATION } from './config.ts'

let cache: Cache = {
    value: null,
    time: null
}

// Update the cache by mutation
function setCache(value: GambinaIndex): void {
    cache = { value, time: Date.now() }
}

async function getOrSet(settingFunction: () => GambinaIndex | Promise<GambinaIndex>) {
    if (!cache.time || Date.now() > cache.time + CACHE_EXPIRATION) {
        setCache(await Promise.resolve(settingFunction()))
    }

    return cache.value
}

export { getOrSet }
