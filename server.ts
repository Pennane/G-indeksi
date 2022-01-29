import { serve } from 'https://deno.land/std@0.123.0/http/server.ts'
import { parse } from 'https://deno.land/std/flags/mod.ts'

const cacheExpiration = 1000 * 60 * 60
const productUrl = 'https://www.alko.fi/tuotteet/319027/Gambina-muovipullo/'

const { args } = Deno
const DEFAULT_PORT = 8080
const ARGS_PORT = parse(args).port
const PORT = ARGS_PORT ? Number(ARGS_PORT) : DEFAULT_PORT

type GambinaIndex = number

interface Cache {
    value: GambinaIndex | null
    time: number | null
}

let cache: Cache = {
    value: null,
    time: null
}

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

async function handler(_req: Request): Promise<Response> {
    const index = await getOrFetch()

    if (!index) {
        const body = JSON.stringify({ message: 'Failed to get' })
        return new Response(body, {
            status: 503,
            headers: {
                'content-type': 'application/json; charset=utf-8',
                'retry-after': new Date(Date.now() + 1000 * 60 * 60 * 24).toUTCString()
            }
        })
    }

    const body = JSON.stringify({ index })
    return new Response(body, {
        status: 200,
        headers: {
            'content-type': 'application/json; charset=utf-8'
        }
    })
}

serve(handler, { port: PORT })
console.log(`server running on port ${PORT}`)
