// Load user profile when page loads
document.addEventListener('DOMContentLoaded', async () => {
    await loadUserProfile();
    await loadOrderHistory();
    
    // Handle profile picture upload
    document.getElementById('upload-picture').addEventListener('change', handlePictureUpload);
});

async function loadUserProfile() {
    try {
        const response = await fetch('/api/user/profile');
        const data = await response.json();
        
        if (data.success) {
            const user = data.user;
            
            // Update profile display
            document.getElementById('profile-username').textContent = user.username;
            document.getElementById('profile-email').textContent = user.email;
            document.getElementById('profile-age').value = user.age || '';
            document.getElementById('profile-gender').value = user.gender || '';
            document.getElementById('profile-payment').value = user.payment_method || '';
            
            // Update profile picture
            if (user.profile_picture) {
                document.getElementById('profile-picture').src = user.profile_picture;
            }
            
            // Update nav profile initial
            const initial = user.username.charAt(0).toUpperCase();
            document.getElementById('nav-profile-initial').textContent = initial;
        }
    } catch (error) {
        console.error('Error loading profile:', error);
        alert('Failed to load profile. Please login again.');
        window.location.href = '/login';
    }
}

async function saveProfile() {
    const age = document.getElementById('profile-age').value;
    const gender = document.getElementById('profile-gender').value;
    const paymentMethod = document.getElementById('profile-payment').value;
    
    try {
        const response = await fetch('/api/user/profile', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                age,
                gender,
                payment_method: paymentMethod
            })
        });
        
        const data = await response.json();
        
        if (data.success) {
            alert('Profile updated successfully!');
        } else {
            alert('Failed to update profile: ' + data.message);
        }
    } catch (error) {
        console.error('Error saving profile:', error);
        alert('Failed to save profile. Please try again.');
    }
}

function handlePictureUpload(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            document.getElementById('profile-picture').src = e.target.result;
            // In a real app, you would upload this to the server
            // For now, we'll just update it locally
        };
        reader.readAsDataURL(file);
    }
}

async function loadOrderHistory() {
    try {
        const response = await fetch('/api/user/order-history');
        const data = await response.json();
        
        if (data.success && data.orders && data.orders.length > 0) {
            const historyList = document.getElementById('history-list');
            historyList.innerHTML = '';
            
            data.orders.forEach(order => {
                const historyItem = document.createElement('div');
                historyItem.className = 'history-item';
                
                const orderDate = new Date(order.created_at);
                const formattedDate = orderDate.toLocaleDateString('id-ID', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                });
                
                historyItem.innerHTML = `
                    <div class="history-item-header">
                        <div class="history-warung">${order.warung_name}</div>
                        <div class="history-time">${formattedDate}</div>
                    </div>
                    <div class="history-items">${order.items}</div>
                    <div class="history-price">Total: ${order.total_price}</div>
                `;
                
                historyList.appendChild(historyItem);
            });
        }
    } catch (error) {
        console.error('Error loading order history:', error);
    }
}

//logout
function logout() {
    if (confirm('Are you sure you want to logout?')) {
        fetch('/api/auth/logout', { method: 'POST' })
            .then(() => {
                window.location.href = '/login';
            })
            .catch(error => {
                console.error('Logout error:', error);
                window.location.href = '/login';
            });
    }
}