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

    fetch('/api/order_lotus_mist', {
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
                // Manual poll after order
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

// Analytics Integration
function initChart(labels, dataValue) {
    const ctx = document.getElementById('ordersChart').getContext('2d');

    chartInstance = new Chart(ctx, {
        type: 'horizontalBar', // Unique chart type for variety
        data: {
            labels: labels,
            datasets: [{
                label: 'Total Items Ordered',
                data: dataValue,
                backgroundColor: [
                    '#2A9D8F',
                    '#264653',
                    '#F4A261',
                    '#E9C46A'
                ],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            scales: {
                xAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            },
            legend: {
                display: false
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
        // Fallback for older Chart.js or first init
        initChart(labels, dataValue);
    }
}

function pollAnalytics() {
    fetch('/api/analytics_lotus_mist')
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

// Polling every 5 seconds
setInterval(pollAnalytics, 5000);

// Initial call
document.addEventListener('DOMContentLoaded', () => {
    pollAnalytics();
});
