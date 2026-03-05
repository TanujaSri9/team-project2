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

    fetch('/api/order_saffron_court', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(orderData)
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                showMessage(`${quantity}x ${itemName} ordered successfully! Enjoy your visit!`, 'success');
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
    }, 4000);
}

// Analytics Integration
function initChart(labels, dataValue) {
    const ctx = document.getElementById('ordersChart').getContext('2d');

    chartInstance = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: labels,
            datasets: [{
                label: 'Dessert Orders',
                data: dataValue,
                backgroundColor: [
                    '#C1121F', // Ottoman red
                    '#E9C46A', // Golden dessert
                    '#264653', // Turkish teal
                    '#F4A261'  // Orange accent
                ],
                borderWidth: 5,
                borderColor: '#ffffff'
            }]
        },
        options: {
            responsive: true,
            cutoutPercentage: 65,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        font: {
                            family: "'Cinzel', serif",
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
    fetch('/api/analytics_saffron_court')
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
