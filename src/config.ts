import { parse } from 'https://deno.land/std@0.129.0/flags/mod.ts'
import { config } from 'https://deno.land/x/dotenv@v3.2.0/mod.ts'
const env = config()

const { args } = Deno
const parsedArgs = parse(args)

const INDEX_EXPIRATION = 1000 * 60 * 60
const INDEX_HISTORY_EXPIRATION = 1000 * 60 * 60
const PRODUCT_URL = 'https://www.alko.fi/tuotteet/319027/Gambina-muovipullo/'
const DEFAULT_PORT = 8080

const DB = {
    username: env.db_username,
    password: env.db_password,
    cluster: env.db_cluster,
    name: env.db_name
}

const argsPort = parsedArgs.port
const PORT = argsPort ? Number(argsPort) : DEFAULT_PORT

export { INDEX_EXPIRATION, INDEX_HISTORY_EXPIRATION, PRODUCT_URL, PORT, DB }
