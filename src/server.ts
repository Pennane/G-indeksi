import { parse } from 'https://deno.land/std/flags/mod.ts'
import { getCurrentIndex, getRoot } from './controller.ts'

const { args } = Deno
const DEFAULT_PORT = 8080
const ARGS_PORT = parse(args).port
const PORT = ARGS_PORT ? Number(ARGS_PORT) : DEFAULT_PORT

function unknownEndpoint(): Response {
    return new Response('Unknown endpoint', {
        status: 404
    })
}

function unsupportedMethod(): Response {
    return new Response('Unsupported method', {
        status: 501
    })
}

async function requestHandler(req: Request): Promise<Response> {
    if (req.method !== 'GET' && req.method !== 'HEAD') {
        return unsupportedMethod()
    }

    const url = new URL(req.url)

    switch (url.pathname) {
        case '/api/index': {
            return await getCurrentIndex(req)
        }
        case '/': {
            return await getRoot(req)
        }
        default: {
            return unknownEndpoint()
        }
    }
}

const server = Deno.listen({ port: PORT })

async function serveHttp(connection: Deno.Conn) {
    const httpConnection = Deno.serveHttp(connection)

    for await (const requestEvent of httpConnection) {
        requestEvent.respondWith(await requestHandler(requestEvent.request))
    }
}

console.log(`server running on port ${PORT}`)

for await (const connection of server) {
    serveHttp(connection)
}
