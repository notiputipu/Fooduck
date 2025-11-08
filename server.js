const session = require('express-session');
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');
const path = require('path');
const loginRouter = require('./routes/login');
const registerRouter = require('./routes/register');

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname));

//debugging result
app.use(session({
  secret: 'fooduck-secret-key-2024',
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 24 * 60 * 60 * 1000,
    httpOnly: true
  }
}));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use('/styleLoginPage', express.static(path.join(__dirname, 'styleLoginPage')));

app.use((req, _res, next) => {
  req.db = db;       // reuse the SQLite connection
  next();
});

app.use('/login', loginRouter);
app.use('/register', registerRouter);

app.get('/', (_req, res) => res.redirect('/login'));

app.get('/home', requireAuth, (_req, res) =>
  res.sendFile(path.join(__dirname, 'HomePage.html'))
);

// Session configuration
app.use(session({
    secret: 'fooduck-secret-key-2024',
    resave: false,
    saveUninitialized: false,
    cookie: { 
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
        httpOnly: true
    }
}));

// Database connection
const DB_PATH = process.env.DATABASE_FILE || './auth.db';
const db = new sqlite3.Database(DB_PATH, (err) => {
    if (err) {
        console.error('Error connecting to database:', err);
    } else {
        console.log('Connected to SQLite database');
        initializeDatabase();
    }
});

// Initialize database tables
function initializeDatabase() {
    // Users table 
    db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE NOT NULL,
        username TEXT NOT NULL,
        password_hash TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);
    
    // User profiles table
    db.run(`CREATE TABLE IF NOT EXISTS user_profiles (
        user_id INTEGER PRIMARY KEY,
        age INTEGER,
        gender TEXT,
        payment_method TEXT,
        profile_picture TEXT,
        FOREIGN KEY (user_id) REFERENCES users(id)
    )`);
    
    // Orders table
    db.run(`CREATE TABLE IF NOT EXISTS orders (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        warung_name TEXT NOT NULL,
        items TEXT NOT NULL,
        total_price REAL NOT NULL,
        payment_method TEXT NOT NULL,
        status TEXT DEFAULT 'preparing',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id)
    )`);
    
    console.log('Database tables initialized');
}

// Middleware to check if user is logged in
function requireAuth(req, res, next) {
    if (!req.session.userId) {
        return res.status(401).json({ success: false, message: 'Not authenticated' });
    }
    next();
}

app.use((req, _res, next) => {
  req.db = db;
  next();
});

//routes

// Login
app.post('/api/auth/login', (req, res) => {
    const { email, password } = req.body;
    
    db.get('SELECT * FROM users WHERE email = ?', [email], async (err, user) => {
        if (err) {
            return res.status(500).json({ success: false, message: 'Database error' });
        }
        
        if (!user) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }
        
        const isValid = await bcrypt.compare(password, user.password_hash);
        if (!isValid) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }
        
        req.session.userId = user.id;
        req.session.username = user.username;
        
        res.json({ success: true, message: 'Login successful' });
    });
});

// Register
app.post('/api/auth/register', async (req, res) => {
    const { email, username, password } = req.body;
    
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        
        db.run(
            'INSERT INTO users (email, username, password_hash) VALUES (?, ?, ?)',
            [email, username, hashedPassword],
            function(err) {
                if (err) {
                    if (err.message.includes('UNIQUE')) {
                        return res.status(400).json({ success: false, message: 'Email already exists' });
                    }
                    return res.status(500).json({ success: false, message: 'Registration failed' });
                }
                
                // Create profile entry
                db.run('INSERT INTO user_profiles (user_id) VALUES (?)', [this.lastID]);
                
                res.json({ success: true, message: 'Registration successful' });
            }
        );
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Logout
app.post('/api/auth/logout', (req, res) => {
    req.session.destroy();
    res.json({ success: true });
});

//profile routes

// Get user profile
app.get('/api/user/profile', requireAuth, (req, res) => {
    const userId = req.session.userId;
    
    const query = `
        SELECT u.id, u.email, u.username, u.created_at,
               p.age, p.gender, p.payment_method, p.profile_picture
        FROM users u
        LEFT JOIN user_profiles p ON u.id = p.user_id
        WHERE u.id = ?
    `;
    
    db.get(query, [userId], (err, user) => {
        if (err) {
            return res.status(500).json({ success: false, message: 'Database error' });
        }
        
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        
        res.json({ success: true, user });
    });
});

// Update user profile
app.put('/api/user/profile', requireAuth, (req, res) => {
    const userId = req.session.userId;
    const { age, gender, payment_method } = req.body;
    
    const query = `
        INSERT INTO user_profiles (user_id, age, gender, payment_method)
        VALUES (?, ?, ?, ?)
        ON CONFLICT(user_id) DO UPDATE SET
            age = excluded.age,
            gender = excluded.gender,
            payment_method = excluded.payment_method
    `;
    
    db.run(query, [userId, age, gender, payment_method], (err) => {
        if (err) {
            return res.status(500).json({ success: false, message: 'Update failed' });
        }
        
        res.json({ success: true, message: 'Profile updated' });
    });
});

//order routes

// Create order
app.post('/api/orders', requireAuth, (req, res) => {
    const userId = req.session.userId;
    const { warung_name, items, total_price, payment_method } = req.body;
    
    const itemsJson = JSON.stringify(items);
    
    db.run(
        'INSERT INTO orders (user_id, warung_name, items, total_price, payment_method) VALUES (?, ?, ?, ?, ?)',
        [userId, warung_name, itemsJson, total_price, payment_method],
        function(err) {
            if (err) {
                return res.status(500).json({ success: false, message: 'Order failed' });
            }
            
            res.json({ 
                success: true, 
                message: 'Order placed successfully',
                orderId: this.lastID 
            });
        }
    );
});

// Get active orders
app.get('/api/orders/active', requireAuth, (req, res) => {
    const userId = req.session.userId;
    
    const query = `
        SELECT * FROM orders 
        WHERE user_id = ? AND status IN ('preparing', 'ready')
        ORDER BY created_at DESC
    `;
    
    db.all(query, [userId], (err, orders) => {
        if (err) {
            return res.status(500).json({ success: false, message: 'Database error' });
        }
        
        res.json({ success: true, orders });
    });
});

// Get order history
app.get('/api/user/order-history', requireAuth, (req, res) => {
    const userId = req.session.userId;
    
    const query = `
        SELECT id, warung_name, items, total_price, created_at
        FROM orders 
        WHERE user_id = ? AND status = 'completed'
        ORDER BY created_at DESC
        LIMIT 20
    `;
    
    db.all(query, [userId], (err, orders) => {
        if (err) {
            return res.status(500).json({ success: false, message: 'Database error' });
        }
        
        // Format orders for display
        const formattedOrders = orders.map(order => {
            const items = JSON.parse(order.items);
            const itemsList = items.map(item => `${item.name} (${item.quantity}x)`).join(', ');
            
            return {
                id: order.id,
                warung_name: order.warung_name,
                items: itemsList,
                total_price: `Rp ${parseInt(order.total_price).toLocaleString('id-ID')}`,
                created_at: order.created_at
            };
        });
        
        res.json({ success: true, orders: formattedOrders });
    });
});

// Update order status 
app.put('/api/orders/:id/status', requireAuth, (req, res) => {
    const orderId = req.params.id;
    const { status } = req.body;
    
    db.run(
        'UPDATE orders SET status = ? WHERE id = ?',
        [status, orderId],
        (err) => {
            if (err) {
                return res.status(500).json({ success: false, message: 'Update failed' });
            }
            
            res.json({ success: true, message: 'Status updated' });
        }
    );
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log('Database: auth.db');
});

process.on('SIGINT', () => {
    db.close((err) => {
        if (err) {
            console.error('Error closing database:', err);
        } else {
            console.log('Database connection closed');
        }
        process.exit(0);
    });

});
