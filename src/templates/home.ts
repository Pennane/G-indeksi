export default function (data: { value: number | null }) {
    if (!data.value) {
        return `
        <!DOCTYPE html>
        <html lang="fi">
            <head>
                <meta charset="utf-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
                <title>G-indeksi</title>
            </head>
            <body>
                <h1>Päivän G-indeksi hakemisessa on havaittu vaikeuksia.</h1>
<<<<<<< HEAD
                <a href="/api/index">Tavallisesti G-indeksin voi hakea JSON muodossa täältä</a>
=======
                <a href="/api/v1/index">Tavallisesti G-indeksin voi hakea JSON muodossa täältä</a>
>>>>>>> 30fa705271ed580826ee6692b45083c634bece2d
            </body>
        </html>
        `
    }

    return `
        <!DOCTYPE html>
        <html lang="fi">
            <head>
                <meta charset="utf-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
                <title>G-indeksi</title>
            </head>
            <body>
                <h1>Päivän G-indeksi on ${String(data.value)}</h1>
                <a href="/api/index">G-indeksin voi hakea JSON muodossa täältä</a>
            </body>
        </html>
    `
}
