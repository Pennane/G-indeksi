import type { GambinaIndex, IndexCache, History, HistoryCache } from './types.d.ts'
import { INDEX_EXPIRATION, INDEX_HISTORY_EXPIRATION } from './config.ts'

let indexCache: IndexCache = {
    value: null,
    time: null
}

let historyCache: HistoryCache = {
    value: null,
    time: null
}

// Update the cache by mutation
function setIndexCache(value: GambinaIndex): void {
    indexCache = { value, time: Date.now() }
}

async function getOrSetIndexCache(settingFunction: () => GambinaIndex | Promise<GambinaIndex>) {
    if (!indexCache.time || Date.now() > indexCache.time + INDEX_EXPIRATION) {
        setIndexCache(await Promise.resolve(settingFunction()))
    }

    return indexCache.value
}

// Update the cache by mutation
function setHistoryCache(value: History): void {
    historyCache = { value, time: Date.now() }
}

async function getOrSetHistoryCache(settingFunction: () => History | Promise<History>) {
    if (!historyCache.time || Date.now() > historyCache.time + INDEX_HISTORY_EXPIRATION) {
        setHistoryCache(await Promise.resolve(settingFunction()))
    }

    return historyCache.value
}

export { getOrSetIndexCache, getOrSetHistoryCache }
