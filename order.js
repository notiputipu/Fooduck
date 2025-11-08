document.addEventListener('DOMContentLoaded', () => {
    loadOrderData();
});

function loadOrderData() {
    const orderData = JSON.parse(sessionStorage.getItem('currentOrder') || '{}');
    
    if (!orderData.warungName || !orderData.items || orderData.items.length === 0) {
        alert('No order data found');
        window.location.href = 'HomePage.html';
        return;
    }
    
    // Display nama warung 
    document.getElementById('warung-name').textContent = orderData.warungName;
    
    // Display order items
    const itemsList = document.getElementById('order-items-list');
    itemsList.innerHTML = '';
    
    let subtotal = 0;
    
    orderData.items.forEach(item => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'order-item';
        
        const price = parsePrice(item.price);
        const itemTotal = price * item.qty;
        subtotal += itemTotal;
        
        itemDiv.innerHTML = `
            <div class="item-details">
                <div class="item-name">${item.name}</div>
                ${customizeInfo}
                <div class="item-quantity">Qty: ${item.qty}</div>
            </div>
            <div class="item-price">Rp ${itemTotal.toLocaleString('id-ID')}</div>
        `;
        
        itemsList.appendChild(itemDiv);
    });
    
    // Update summary
    document.getElementById('subtotal').textContent = `Rp ${subtotal.toLocaleString('id-ID')}`;
    document.getElementById('total').textContent = `Rp ${subtotal.toLocaleString('id-ID')}`;
}

function parsePrice(priceStr) {
    if (!priceStr) return 0;
    const cleaned = priceStr.replace(/[^0-9.]/g, '');
    const number = parseFloat(cleaned);
    
    // If price = K
    if (priceStr.toLowerCase().includes('k')) {
        return number * 1000;
    }
    
    return number;
}

async function confirmOrder() {
    const selectedPayment = document.querySelector('input[name="payment"]:checked');
    
    if (!selectedPayment) {
        alert('Please select a payment method');
        return;
    }
    
    const orderData = JSON.parse(sessionStorage.getItem('currentOrder'));
    const paymentMethod = selectedPayment.value;
    
    // Calculate total
    let total = 0;
    orderData.items.forEach(item => {
        const price = parsePrice(item.price);
        total += price * item.qty;
    });
    
    // Prepare order data for backend
    const orderPayload = {
        warung_name: orderData.warungName,
        items: orderData.items.map(item => ({
            name: item.name,
            quantity: item.qty,
            price: parsePrice(item.price),
            customize: item.customize
        })),
        total_price: total,
        payment_method: paymentMethod
    };
    
    try {
        const response = await fetch('/api/orders', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(orderPayload)
        });
        
        const data = await response.json();
        
        if (data.success) {
            // Clear order from session
            sessionStorage.removeItem('currentOrder');
            
            // Show success modal
            document.getElementById('success-modal').classList.add('show');
        } else {
            alert('Failed to place order: ' + data.message);
        }
    } catch (error) {
        console.error('Error placing order:', error);
        alert('Failed to place order. Please try again.');
    }
}

function goBack() {
    if (confirm('Are you sure you want to cancel this order?')) {
        window.history.back();
    }
}

function redirectToHome() {
    window.location.href = 'HomePage.html';
}