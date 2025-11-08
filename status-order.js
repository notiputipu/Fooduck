// Load active orders when page loads
document.addEventListener('DOMContentLoaded', async () => {
    await loadActiveOrders();
    
    // Auto-refresh every 30 seconds
    setInterval(loadActiveOrders, 30000);
});

async function loadActiveOrders() {
    try {
        const response = await fetch('/api/orders/active');
        const data = await response.json();
        
        const ordersList = document.getElementById('orders-list');
        
        if (data.success && data.orders && data.orders.length > 0) {
            ordersList.innerHTML = '';
            
            data.orders.forEach(order => {
                const orderCard = createOrderCard(order);
                ordersList.appendChild(orderCard);
            });
        } else {
            ordersList.innerHTML = '<p class="no-orders">No active orders</p>';
        }
    } catch (error) {
        console.error('Error loading orders:', error);
    }
}

function createOrderCard(order) {
    const card = document.createElement('div');
    card.className = 'order-card';
    
    const orderDate = new Date(order.created_at);
    const formattedDate = orderDate.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
    
    
    const statusClass = getStatusClass(order.status);
    const statusText = getStatusText(order.status);
    
    
    const items = JSON.parse(order.items || '[]');
    let itemsHTML = '';
    items.forEach(item => {
        itemsHTML += `
            <div class="item-row">
                <span class="item-name">${item.name}</span>
                <span class="item-qty">x${item.quantity}</span>
            </div>
        `;
    });
    
    // Progress indicator
    const progressWidth = order.status === 'preparing' ? '50%' : '100%';
    
    card.innerHTML = `
        <div class="order-header">
            <div class="order-info">
                <h3>${order.warung_name}</h3>
                <p class="order-time">${formattedDate}</p>
                <p class="order-id">Order #${order.id}</p>
            </div>
            <div class="status-badge ${statusClass}">
                ${statusText}
            </div>
        </div>
        
        <div class="order-items">
            <h4>Items:</h4>
            <div class="items-summary">
                ${itemsHTML}
            </div>
        </div>
        
        <div class="order-total">
            <span class="total-label">Total:</span>
            <span class="total-amount">Rp ${parseInt(order.total_price).toLocaleString('id-ID')}</span>
        </div>
        
        <div class="progress-indicator">
            <div class="progress-line">
                <div class="progress-line-fill" style="width: ${progressWidth}"></div>
            </div>
            
            <div class="progress-step ${order.status === 'preparing' || order.status === 'ready' ? 'completed' : ''}">
                <div class="progress-circle">1</div>
                <div class="progress-label">Order Received</div>
            </div>
            
            <div class="progress-step ${order.status === 'preparing' ? 'active' : order.status === 'ready' ? 'completed' : ''}">
                <div class="progress-circle">2</div>
                <div class="progress-label">Preparing</div>
            </div>
            
            <div class="progress-step ${order.status === 'ready' ? 'active' : ''}">
                <div class="progress-circle">3</div>
                <div class="progress-label">Ready</div>
            </div>
        </div>
    `;
    
    return card;
}

function getStatusClass(status) {
    switch(status) {
        case 'preparing':
            return 'status-preparing';
        case 'ready':
            return 'status-ready';
        case 'completed':
            return 'status-completed';
        default:
            return 'status-preparing';
    }
}

function getStatusText(status) {
    switch(status) {
        case 'preparing':
            return 'Your food is getting prepared';
        case 'ready':
            return 'Your food is ready!';
        case 'completed':
            return 'Completed';
        default:
            return 'Processing';
    }
}