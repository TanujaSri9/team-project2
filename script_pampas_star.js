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

    fetch('/api/order_rio', {
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
        type: 'doughnut', // Doughnut chart for Rio
        data: {
            labels: labels,
            datasets: [{
                label: 'Total Items Ordered',
                data: dataValue,
                backgroundColor: [
                    '#1B9E77', // Brazilian green
                    '#F4A261', // Grill orange
                    '#D62828', // Flame red
                    '#E76F51'  // Warm orange/red
                ],
                borderColor: '#FFF8F3', // Background
                borderWidth: 3
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'right',
                    labels: {
                        font: {
                            family: "'Open Sans', sans-serif",
                            size: 14
                        }
                    }
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
    fetch('/api/analytics_rio')
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
