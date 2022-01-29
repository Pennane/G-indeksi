import { parse } from 'https://deno.land/std/flags/mod.ts'

const { args } = Deno

const CACHE_EXPIRATION = 1000 * 60 * 60
const PRODUCT_URL = 'https://www.alko.fi/tuotteet/319027/Gambina-muovipullo/'

const defaultPort = 8080
const argsPort = parse(args).port
const PORT = argsPort ? Number(argsPort) : defaultPort

export { CACHE_EXPIRATION, PRODUCT_URL, PORT }
