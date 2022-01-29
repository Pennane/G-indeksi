import { requestHandler } from './controller.ts'
import { PORT } from './config.ts'

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
