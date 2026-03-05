let chartInstance = null;

function placeOrder(itemName, qtyId) {
    const quantity = document.getElementById(qtyId).value;
    
    if (quantity < 1) {
        showMessage('Please enter a valid quantity.', 'error');
        return;
    }

    const orderData = {
        item_name: itemName,
        item_quantity: parseInt(quantity)
    };

    fetch('/api/order', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(orderData)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            showMessage(`${quantity}x ${itemName} ordered successfully!`, 'success');
            // Trigger a manual poll immediately to update the chart
            pollAnalytics();
        } else {
            showMessage('Error placing order.', 'error');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        showMessage('Network error. Could not place order.', 'error');
    });
}

function showMessage(msg, type) {
    const msgElement = document.getElementById('order-message');
    msgElement.textContent = msg;
    msgElement.className = `order-message ${type}`;
    
    // Hide after 3 seconds
    setTimeout(() => {
        msgElement.className = 'order-message hidden';
    }, 3000);
}

// Analytics and Chart.js integration
function initChart(labels, dataValue) {
    const ctx = document.getElementById('ordersChart').getContext('2d');
    
    chartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Total Items Ordered',
                data: dataValue,
                backgroundColor: [
                    '#9B2226',
                    '#E9C46A',
                    '#264653',
                    '#FFB703'
                ],
                borderColor: '#2B2B2B',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true
                }
            },
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    });
}

function updateChart(labels, dataValue) {
    if (chartInstance) {
        chartInstance.data.labels = labels;
        chartInstance.data.datasets[0].data = dataValue;
        chartInstance.update();
    } else {
        initChart(labels, dataValue);
    }
}

function pollAnalytics() {
    fetch('/api/analytics')
    .then(response => response.json())
    .then(data => {
        if (data && data.labels) {
            updateChart(data.labels, data.data);
        }
    })
    .catch(error => {
        console.error('Error fetching analytics:', error);
    });
}

// Fetch polling every 5 seconds for real-time updates
setInterval(pollAnalytics, 5000);

// Initial load
document.addEventListener('DOMContentLoaded', () => {
    pollAnalytics();
});
