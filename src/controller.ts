import home from './templates/home.ts'

import { unknownEndpoint, unsupportedMethod, apiHtml, apiServerError, apiSuccess } from './util/responses.ts'
import { getValue } from './service.ts'

async function getIndexValue(_req: Request): Promise<Response> {
    const value = await getValue()

    if (!value) {
        const body = JSON.stringify({ message: 'Failed to get', value: null })
        return apiServerError(body)
    }

    const body = JSON.stringify({ value })
    return apiSuccess(body)
}

async function getHome(_req: Request): Promise<Response> {
    const value = await getValue()
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
        case '/': {
            return getHome(req)
        }
        default: {
            return unknownEndpoint(req)
        }
    }
}

export { requestHandler }
