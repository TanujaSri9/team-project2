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

    fetch('/api/order_kimchi_soul', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(orderData)
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                showMessage(`${quantity}x ${itemName} sizzled up successfully!`, 'success');
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

    setTimeout(() => {
        msgElement.className = 'order-message hidden';
    }, 3000);
}

// Analytics Integration
function initChart(labels, dataValue) {
    const ctx = document.getElementById('ordersChart').getContext('2d');

    chartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Orders Today',
                data: dataValue,
                backgroundColor: [
                    'rgba(181, 23, 46, 0.8)', // BBQ Red
                    'rgba(233, 196, 106, 0.8)', // Gold
                    'rgba(27, 38, 59, 0.8)',  // Dark Charcoal
                    'rgba(181, 23, 46, 0.5)'   // Faded Red
                ],
                borderColor: '#E9C46A',
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    },
                    ticks: {
                        color: '#ffffff'
                    }
                },
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        color: '#ffffff',
                        font: {
                            family: "'Noto Sans KR', sans-serif",
                            weight: '700'
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
    fetch('/api/analytics_kimchi_soul')
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
