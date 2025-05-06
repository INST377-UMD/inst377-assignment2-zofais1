const POLYGON_API_KEY = 'YOUR_API_KEY';

let stockChart = null;

function epochToDate(epoch) {
    return new Date(epoch).toLocaleDateString();
}

async function fetchStockData(ticker, days) {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const formattedStartDate = startDate.toISOString().split('T')[0];
    const formattedEndDate = endDate.toISOString().split('T')[0];

    try {
        const response = await fetch(
            `https://api.polygon.io/v2/aggs/ticker/${ticker}/range/1/day/${formattedStartDate}/${formattedEndDate}?apiKey=${POLYGON_API_KEY}`
        );
        const data = await response.json();
        return data.results;
    } catch (error) {
        console.error('Error fetching stock data:', error);
        throw error;
    }
}

function updateChart(data, ticker) {
    const ctx = document.getElementById('stock-chart').getContext('2d');
    
    if (stockChart) {
        stockChart.destroy();
    }

    const dates = data.map(item => epochToDate(item.t));
    const closingPrices = data.map(item => item.c);

    stockChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: dates,
            datasets: [{
                label: `${ticker} Stock Price`,
                data: closingPrices,
                borderColor: 'rgb(75, 192, 192)',
                tension: 0.1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    });
}

async function fetchRedditStocks() {
    try {
        const response = await fetch('https://tradestie.com/api/v1/apps/reddit');
        const data = await response.json();
        
        const topStocks = data
            .sort((a, b) => b.no_of_comments - a.no_of_comments)
            .slice(0, 5);

        const tableBody = document.querySelector('#reddit-stocks-table tbody');
        tableBody.innerHTML = '';

        topStocks.forEach(stock => {
            const row = document.createElement('tr');
            const sentimentIcon = stock.sentiment === 'Bullish' ? '🐂' : '🐻';
            
            row.innerHTML = `
                <td><a href="https://finance.yahoo.com/quote/${stock.ticker}" target="_blank">${stock.ticker}</a></td>
                <td>${stock.no_of_comments}</td>
                <td>${sentimentIcon} ${stock.sentiment}</td>
            `;
            tableBody.appendChild(row);
        });
    } catch (error) {
        console.error('Error fetching Reddit stocks:', error);
    }
}

document.getElementById('lookup-stock').addEventListener('click', async () => {
    const ticker = document.getElementById('stock-ticker').value.toUpperCase();
    const days = parseInt(document.getElementById('time-period').value);

    try {
        const stockData = await fetchStockData(ticker, days);
        updateChart(stockData, ticker);
    } catch (error) {
        alert('Error fetching stock data. Please try again.');
    }
});

if (annyang) {
    annyang.addCommands({
        'lookup *stock': function(stock) {
            document.getElementById('stock-ticker').value = stock.toUpperCase();
            document.getElementById('lookup-stock').click();
        }
    });
}

document.addEventListener('DOMContentLoaded', fetchRedditStocks); 