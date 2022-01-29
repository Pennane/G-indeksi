function apiHtml(body: string): Response {
    return new Response(body, {
        status: 200,
        headers: {
            'content-type': 'text/html; charset=utf-8'
        }
    })
}

function apiSuccess(body: string): Response {
    return new Response(body, {
        status: 200,
        headers: {
            'content-type': 'application/json; charset=utf-8'
        }
    })
}

function apiServerError(body: string): Response {
    return new Response(body, {
        status: 503,
        headers: {
            'content-type': 'application/json; charset=utf-8',
            'retry-after': new Date(Date.now() + 1000 * 60 * 60 * 24).toUTCString()
        }
    })
}

export { apiSuccess, apiServerError, apiHtml }
