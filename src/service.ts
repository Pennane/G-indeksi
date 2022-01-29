import type { GambinaIndex } from './types.d.ts'
import { PRODUCT_URL } from './config.ts'
import { getOrSet } from './cache.ts'

async function fetchProductPage() {
    const res = await fetch(PRODUCT_URL)
    return res.text()
}

function parseValueFromHtml(html: string): GambinaIndex {
    const regex = new RegExp(/itemprop="price"\s+content="(\d+\.\d+)"/)
    const matches = regex.exec(html)
    if (!matches || !matches[1]) throw new Error('Failed to parse the index')
    return Number(matches[1])
}

async function fetchingFunction() {
    try {
        const html = await fetchProductPage()
        const value = parseValueFromHtml(html)
        return value
    } catch (e) {
        console.error(e)
        return null
    }
}

export async function getValue(): Promise<GambinaIndex | null> {
    return await getOrSet(fetchingFunction)
}
