import type { GambinaIndex, History } from './types.d.ts'
import { PRODUCT_URL } from './config.ts'
import { getOrSetIndexCache, getOrSetHistoryCache } from './cache.ts'
import { findOnePerDay } from './database.ts'

async function fetchProductPage() {
    const res = await fetch(PRODUCT_URL)
    return res.text()
}

function parseIndexFromHtml(html: string): GambinaIndex {
    const regex = new RegExp(/itemprop="price"\s+content="(\d+\.\d+)"/)
    const matches = regex.exec(html)
    if (!matches || !matches[1]) throw new Error('Failed to parse the index')
    return Number(matches[1])
}

async function fetchingFunction() {
    try {
        const html = await fetchProductPage()
        const value = parseIndexFromHtml(html)
        return value
    } catch (e) {
        console.error(e)
        return null
    }
}

export async function getIndex(): Promise<GambinaIndex | null> {
    return await getOrSetIndexCache(fetchingFunction)
}

export async function getHistory(): Promise<History | null> {
    return await getOrSetHistoryCache(findOnePerDay)
}
