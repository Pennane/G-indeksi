import home from './templates/home.ts'
import { getOrFetch } from './cache.ts'
import { apiHtml, apiServerError, apiSuccess } from './util/response.ts'

async function getCurrentIndex(_req: Request): Promise<Response> {
    const value = await getOrFetch()

    if (!value) {
        const body = JSON.stringify({ message: 'Failed to get', value: null })
        return apiServerError(body)
    }

    const body = JSON.stringify({ value })
    return apiSuccess(body)
}

async function getRoot(_req: Request): Promise<Response> {
    const value = await getOrFetch()
    return apiHtml(home({ value }))
}

export { getCurrentIndex, getRoot }
