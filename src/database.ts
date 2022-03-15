import { MongoClient } from 'https://deno.land/x/mongo@v0.29.2/mod.ts'
import { ObjectId } from 'https://deno.land/x/web_bson@v0.1.9/mod.ts'
import { DB } from './config.ts'
import { History, IndexSchema } from './types.d.ts'

const client = new MongoClient()

const db = await client.connect(
    `mongodb+srv://${DB.username}:${DB.password}@${DB.cluster}/${DB.name}?authMechanism=SCRAM-SHA-1`
)

const data = db.collection<IndexSchema>('indexes')

export async function insert(value: number, date?: Date): Promise<ObjectId> {
    let timestamp
    if (date) {
        timestamp = new Date(date.setMinutes(0, 0, 0))
    } else {
        timestamp = new Date(new Date().setMinutes(0, 0, 0))
    }

    const result = await data.findOne({
        timestamp: {
            $eq: timestamp
        }
    })

    if (result) {
        return result._id
    }

    return await data.insertOne({ timestamp, value })
}

export async function findOnePerDay(): Promise<History> {
    const pipeline = [
        {
            $project: {
                _id: 1,
                value: 1,
                day: {
                    $dayOfMonth: '$timestamp'
                },
                month: {
                    $month: '$timestamp'
                },
                year: {
                    $year: '$timestamp'
                },
                originalTimestamp: '$timestamp'
            }
        },
        {
            $project: {
                _id: 1,
                value: 1,
                originalTimestamp: 1,
                timestamp: {
                    $concat: [
                        {
                            $substr: ['$year', 0, 4]
                        },
                        '-',
                        {
                            $substr: ['$month', 0, 2]
                        },
                        '-',
                        {
                            $substr: ['$day', 0, 2]
                        }
                    ]
                }
            }
        },
        {
            $group: {
                _id: '$timestamp',
                timestamp: {
                    $first: '$timestamp'
                },
                value: {
                    $first: '$value'
                },
                originalTimestamp: {
                    $first: '$originalTimestamp'
                }
            }
        },

        {
            $sort: {
                originalTimestamp: 1
            }
        },
        {
            $unset: ['_id', 'originalTimestamp']
        }
    ]
    const result = await data.aggregate(pipeline).toArray()
    return result
}
