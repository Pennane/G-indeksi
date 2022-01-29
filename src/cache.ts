import { cacheExpiration, productUrl } from './config.ts'
import { fetchHtml, parseIndexValue } from './util/html.ts'
import type { Cache, GambinaIndex } from './types.d.ts'

let cache: Cache = {
    value: null,
    time: null
}

function updatedCache(value: GambinaIndex): Cache {
    return {
        value,
        time: Date.now()
    }
}

async function getOrFetch() {
    if (!cache.time || Date.now() > cache.time + cacheExpiration) {
        try {
            const html = await fetchHtml(productUrl)
            const index = parseIndexValue(html)
            cache = updatedCache(index)
        } catch (e) {
            console.error(e)
        }
    }

    return cache.value
}

export { getOrFetch }
