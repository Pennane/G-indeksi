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
        <a href="https://g-indeksi.pennanen.dev/api/index">Päivän G-indeksi</a>
      </li>
      <li>
        <a href="https://g-indeksi.pennanen.dev/api/history">G-indeksihistoria</a>
      </li>
    </ul>
  </section>
  <script src="
  https://cdn.jsdelivr.net/npm/chart.js@4.2.1/dist/chart.umd.min.js
  "></script>
  <script src="
  https://cdn.jsdelivr.net/npm/chartjs-adapter-date-fns@3.0.0/dist/chartjs-adapter-date-fns.bundle.min.js
  "></script>
  <script type="module">
    import { fi } from 'https://cdn.jsdelivr.net/npm/date-fns@2.29.3/locale/+esm'

    const INDEX_TARGET = document.querySelector('#index')
    const CHART_TARGET = document.getElementById('chart')

    const CHART_CONFIG = {
      type: 'line',
      options: {
        interaction: {
          mode: 'nearest',
          axis: 'x',
          intersect: false
        },
        parsing: false,
        plugins: {
          decimation: {
            algorithm: 'lttb',
            enabled: true,
            samples: 50
          }
        },
        scales: {
          x: {
            type: 'time',
            time: {
              tooltipFormat: 'dd MMM yyyy'
            },
            adapters: {
              date: {
                locale: fi
              }
            },
            ticks: {
              source: 'auto',
              maxRotation: 0,
              autoSkip: true
            }
          },
          y: {
            title: {
              display: true,
              text: 'Hinta (€)'
            }
          }
        }
      }
    }

    function removeElementChildren(element) {
      while (element.firstChild) {
        element.removeChild(element.firstChild)
      }
    }

    function displayCurrentIndex(data) {
      INDEX_TARGET.textContent = data.index
    }

    function displayChart(data) {
      const history = data.history
      const dataPoints = history
        .map((i) => ({ x: new Date(i.timestamp).valueOf(), y: i.value }))
        .sort((a, b) => a.x - b.x)

      const datasets = [
        {
          label: 'G-indeksi',
          backgroundColor: 'rgb(255, 99, 132)',
          borderColor: 'rgb(255, 99, 132)',
          data: dataPoints,
          borderWidth: 1.5,
          radius: 0
        }
      ]

      removeElementChildren(CHART_TARGET)

      new Chart(CHART_TARGET, { ...CHART_CONFIG, datasets })
    }

    fetch('/api/index')
      .then((response) => response.json())
      .then(displayCurrentIndex)

    fetch('/api/history')
      .then((response) => response.json())
      .then(displayChart)

  </script>
</body>

</html>
    `
}
