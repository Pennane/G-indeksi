import { Bson } from 'https://deno.land/x/mongo@v0.29.2/mod.ts'

export type GambinaIndex = number | null

export interface IndexCache {
    value: GambinaIndex | null
    time: number | null
}

export interface IndexSchema {
    _id: Bson.ObjectId
    timestamp: Date
    value: number
}

export type HistoryItem = Omit<IndexSchema, '_id'>
export type History = HistoryItem[]
export interface HistoryCache {
    value: History | null
    time: number | null
}
