export default function () {
    return `
<!DOCTYPE html>
<html lang="fi">
    <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
        <title>G-indeksi</title>
        <style>
            body {
                margin: 2rem;
                display: flex;
                flex-direction: column;
                align-items: center;
                font-family: Avenir, Helvetica, Arial, sans-serif;
            }
            section {
                max-width: 700px;
                width: 100%;
            }
            div {
                max-width: 100%;
                margin-bottom: 1rem;
            }
        </style>
    </head>

    <body>
        <section>
            <h1>Päivän G-indeksi on <span id="index">(loading...)</span></h1>
        </section>
        <section>
            <h2>G-indeksihistoria</h2>
            <div>
                <canvas id="chart"></canvas>
            </div>
           
        </section>
        <section>
            <h3>API</h3>
            <ul>
                <li>
                    <a href="/api/index">Päivän G-indeksi</a>
                </li>
                 <li>
                    <a href="/api/history">G-indeksihistoria</a>
                </li>
            </ul>
        </section>
        <script src="https://cdn.jsdelivr.net/npm/chart.js@3.7.1/dist/chart.min.js"></script>
        <script>
            ;(async () => {
                fetch('/api/index')
                    .then((response) => response.json())
                    .then((data) => {
                        document.querySelector('#index').textContent = data.index
                    })
                fetch('/api/history')
                    .then((response) => response.json())
                    .then((data) => {
                        const history = data.history

                        let reducedHistory

                        if (history.length > 21) {
                            reducedHistory = history.filter((_item, i) => i % 7 === 0)
                        } else if (history.length > 120) {
                            reducedHistory = history.filter((_item, i) => i % 30 === 0)
                        } else {
                            reducedHistory = history
                        }

                        const chartLabels = reducedHistory.map((i) => i.timestamp)
                        const chartData = reducedHistory.map((i) => i.value)

                        const config = {
                            type: 'line',
                            data: {
                                labels: chartLabels,
                                datasets: [
                                    {
                                        label: 'G-indeksi',
                                        backgroundColor: 'rgb(255, 99, 132)',
                                        borderColor: 'rgb(255, 99, 132)',
                                        data: chartData
                                    }
                                ],
                                options: {}
                            }
                        }

                        const chart = new Chart(document.getElementById('chart'), config)
                    })
            })()
        </script>
    </body>
</html>
    `
}
