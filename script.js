document.addEventListener("DOMContentLoaded", function () {
    generateRandomData();
});

let chartInstance = null;

function generateRandomData() {
    let dataPoints = 50;
    let gadgetData = [];

    // Generate random price data
    for (let i = 0; i < dataPoints; i++) {
        gadgetData.push(Math.floor(Math.random() * 100) + 50);
    }

    calculateAndDisplayMetrics(gadgetData);
    drawChart(gadgetData);
}

function calculateAndDisplayMetrics(data) {
    let movingAverage = calculateMovingAverage(data, 5);
    let volatility = calculateVolatility(data);

    let rsi = calculateRSI(data, 14);

    document.getElementById("movingAvgValue").innerText = 
        document.getElementById("movingAvg").checked ? `Moving Average: ${movingAverage.toFixed(2)}` : "";

    document.getElementById("volatilityValue").innerText = 
        document.getElementById("volatility").checked ? `Volatility: ${volatility.toFixed(2)}` : "";

    document.getElementById("rsiValue").innerText = 
        document.getElementById("rsi").checked ? `RSI: ${rsi.toFixed(2)}` : "";
}

function calculateMovingAverage(data, period) {
    let sum = 0;
    for (let i = 0; i < period; i++) {
        sum += data[i];
    }
    return sum / period;
}

function calculateVolatility(data) {
    let mean = data.reduce((a, b) => a + b, 0) / data.length;
    let variance = data.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / data.length;
    return Math.sqrt(variance);
}

function calculateRSI(data, period) {
    let gains = 0, losses = 0;

    for (let i = 1; i < period; i++) {
        let change = data[i] - data[i - 1];
        if (change > 0) gains += change;
        else losses -= change;
    }

    let avgGain = gains / period;
    let avgLoss = losses / period;

    if (avgLoss === 0) return 100;
    let rs = avgGain / avgLoss;
    return 100 - (100 / (1 + rs));
}

function drawChart(data) {
    let ctx = document.getElementById("chart").getContext("2d");

    if (chartInstance) {
        chartInstance.destroy();
    }

    chartInstance = new Chart(ctx, {
        type: "line",
        data: {
            labels: Array.from({ length: data.length }, (_, i) => i + 1),
            datasets: [{
                label: "Gadget Prices",

                data: data,
                borderColor: "blue",
                fill: false,
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    });
}
