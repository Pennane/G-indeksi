import home from './templates/home.ts'

import { unknownEndpoint, unsupportedMethod, apiHtml, apiServerError, apiSuccess } from './util/responses.ts'
import { getIndex, getHistory } from './service.ts'

async function getIndexValue(_req: Request): Promise<Response> {
    const index = await getIndex()

    if (!index) {
        const body = JSON.stringify({ message: 'Failed to get', value: null })
        return apiServerError(body)
    }

    const body = JSON.stringify({ index })
    return apiSuccess(body)
}

async function getHistoryValue(_req: Request): Promise<Response> {
    const history = await getHistory()

    if (!history) {
        const body = JSON.stringify({ message: 'Failed to get', value: null })
        return apiServerError(body)
    }

    const body = JSON.stringify({ history })
    return apiSuccess(body)
}

async function getHome(_req: Request): Promise<Response> {
    const value = await getIndex()
    return apiHtml(home({ value }))
}

function requestHandler(req: Request) {
    if (req.method !== 'GET' && req.method !== 'HEAD') {
        return unsupportedMethod(req)
    }

    const url = new URL(req.url)

    switch (url.pathname) {
        case '/api/index': {
            return getIndexValue(req)
        }
        case '/api/history': {
            return getHistoryValue(req)
        }
        case '/': {
            return getHome(req)
        }
        default: {
            return unknownEndpoint(req)
        }
    }
}

export { requestHandler }
