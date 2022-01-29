import type { GambinaIndex } from '../types.d.ts'

async function fetchHtml(url: string) {
    const res = await fetch(url)
    return res.text()
}

function parseIndexValue(html: string): GambinaIndex {
    const regex = new RegExp(/itemprop="price"\s+content="(\d+\.\d+)"/)
    const matches = regex.exec(html)
    if (!matches || !matches[1]) throw new Error('Failed to parse the index')

    return Number(matches[1])
}

export { fetchHtml, parseIndexValue }
