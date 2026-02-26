const express = require('express');
const session = require('express-session');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize SQLite Database
const db = new sqlite3.Database('./children_arts.db', (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
    } else {
        console.log('Connected to SQLite database.');
        initializeDatabase();
    }
});

// Initialize database tables
function initializeDatabase() {
    // Create users table
    db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        phone TEXT NOT NULL,
        password TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`, (err) => {
        if (err) console.error('Error creating users table:', err.message);
    });

    // Create cart table
    db.run(`CREATE TABLE IF NOT EXISTS cart (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        artwork_id TEXT NOT NULL,
        artwork_title TEXT NOT NULL,
        artwork_image TEXT NOT NULL,
        price REAL NOT NULL,
        quantity INTEGER DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id)
    )`, (err) => {
        if (err) console.error('Error creating cart table:', err.message);
    });

    // Create support table
    db.run(`CREATE TABLE IF NOT EXISTS support (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        artwork_id TEXT NOT NULL,
        artwork_title TEXT NOT NULL,
        amount REAL NOT NULL,
        invoice_id TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id)
    )`, (err) => {
        if (err) console.error('Error creating support table:', err.message);
    });
}

// Children data stored in server
const children = [
    {
        id: "child001",
        name: "Priya Sharma",
        age: 8,
        location: "Mumbai, India",
        talent: "Art",
        dream: "Doctor",
        image: "https://picsum.photos/seed/priya/400/400",
        story: "My name is Priya and I love to paint colorful pictures of flowers and animals. I want to become a doctor when I grow up so I can help sick people feel better. My parents work very hard to send me to school, but sometimes it's difficult to afford art supplies. When I paint, I feel happy and I can share my happiness with others through my artwork.",
        artworks: [
            {
                id: "art001",
                title: "Sunflower Garden",
                image: "https://picsum.photos/seed/sunflower/300/300",
                description: "A beautiful painting of sunflowers in a garden",
                price: 5.00
            },
            {
                id: "art002",
                title: "Happy Elephant",
                image: "https://picsum.photos/seed/elephant/300/300",
                description: "A colorful elephant playing in the water",
                price: 5.00
            },
            {
                id: "art003",
                title: "Rainbow Butterfly",
                image: "https://picsum.photos/seed/butterfly/300/300",
                description: "A butterfly with rainbow colors",
                price: 5.00
            }
        ]
    },
    {
        id: "child002",
        name: "Rahul Kumar",
        age: 10,
        location: "Delhi, India",
        talent: "Art",
        dream: "Engineer",
        image: "https://picsum.photos/seed/rahul/400/400",
        story: "I am Rahul and I love drawing buildings and machines. I want to become an engineer and design amazing structures that help people. My father is a construction worker and he shows me how buildings are made. I practice drawing every day after school. Your support helps me buy better drawing materials and continue my education.",
        artworks: [
            {
                id: "art004",
                title: "Future City",
                image: "https://picsum.photos/seed/city/300/300",
                description: "A drawing of a modern city with tall buildings",
                price: 5.00
            },
            {
                id: "art005",
                title: "Smart Robot",
                image: "https://picsum.photos/seed/robot/300/300",
                description: "A robot helping people with daily tasks",
                price: 5.00
            },
            {
                id: "art006",
                title: "Green Bridge",
                image: "https://picsum.photos/seed/bridge/300/300",
                description: "An eco-friendly bridge connecting communities",
                price: 5.00
            }
        ]
    },
    {
        id: "child003",
        name: "Ananya Patel",
        age: 7,
        location: "Bangalore, India",
        talent: "Music",
        dream: "Teacher",
        image: "https://picsum.photos/seed/ananya/400/400",
        story: "My name is Ananya and I love singing and playing music. I want to become a music teacher and teach other children how to sing beautifully. My mother sings traditional songs and she taught me everything I know. I practice every morning before school. Music makes me feel peaceful and happy.",
        artworks: [
            {
                id: "art007",
                title: "Musical Notes",
                image: "https://picsum.photos/seed/notes/300/300",
                description: "Colorful musical notes dancing on paper",
                price: 5.00
            },
            {
                id: "art008",
                title: "Singing Birds",
                image: "https://picsum.photos/seed/birds/300/300",
                description: "Birds singing on tree branches",
                price: 5.00
            },
            {
                id: "art009",
                title: "Rain Song",
                image: "https://picsum.photos/seed/rain/300/300",
                description: "Musical interpretation of rainfall",
                price: 5.00
            }
        ]
    },
    {
        id: "child004",
        name: "Amit Singh",
        age: 9,
        location: "Kolkata, India",
        talent: "Dance",
        dream: "Artist",
        image: "https://picsum.photos/seed/amit/400/400",
        story: "I am Amit and I love dancing! Traditional Indian dance is my favorite. I want to become a professional dancer and perform on big stages. My sister teaches me new dance steps and we practice together every evening. Dancing helps me express my feelings and makes me feel strong and confident.",
        artworks: [
            {
                id: "art010",
                title: "Dancing Peacock",
                image: "https://picsum.photos/seed/peacock/300/300",
                description: "A peacock dancing in the rain",
                price: 5.00
            },
            {
                id: "art011",
                title: "Festival Colors",
                image: "https://picsum.photos/seed/festival/300/300",
                description: "Dancers celebrating with colorful costumes",
                price: 5.00
            },
            {
                id: "art012",
                title: "Rhythm of Life",
                image: "https://picsum.photos/seed/rhythm/300/300",
                description: "Abstract representation of dance movements",
                price: 5.00
            }
        ]
    },
    {
        id: "child005",
        name: "Meera Gupta",
        age: 11,
        location: "Chennai, India",
        talent: "Art",
        dream: "Scientist",
        image: "https://picsum.photos/seed/meera/400/400",
        story: "My name is Meera and I love painting nature and science experiments. I want to become a scientist and discover new things that can help the world. My teacher says I ask very good questions about how things work. I paint what I learn in science class - it helps me remember better. Your support helps me continue my education and buy science books.",
        artworks: [
            {
                id: "art013",
                title: "Solar System",
                image: "https://picsum.photos/seed/solar/300/300",
                description: "A colorful painting of our solar system",
                price: 5.00
            },
            {
                id: "art014",
                title: "Plant Life",
                image: "https://picsum.photos/seed/plants/300/300",
                description: "Different stages of plant growth",
                price: 5.00
            },
            {
                id: "art015",
                title: "Water Cycle",
                image: "https://picsum.photos/seed/water/300/300",
                description: "How water moves through nature",
                price: 5.00
            }
        ]
    },
    {
        id: "child006",
        name: "Vikram Reddy",
        age: 8,
        location: "Hyderabad, India",
        talent: "Art",
        dream: "Pilot",
        image: "https://picsum.photos/seed/vikram/400/400",
        story: "I am Vikram and I love drawing airplanes and rockets. I want to become a pilot and fly around the world. My uncle works at the airport and tells me stories about different countries. I draw all types of aircraft - from small planes to big rockets. Someday I want to design my own airplane!",
        artworks: [
            {
                id: "art016",
                title: "Flying Dreams",
                image: "https://picsum.photos/seed/flying/300/300",
                description: "Airplanes flying through clouds",
                price: 5.00
            },
            {
                id: "art017",
                title: "Space Rocket",
                image: "https://picsum.photos/seed/rocket/300/300",
                description: "A rocket going to the moon",
                price: 5.00
            },
            {
                id: "art018",
                title: "Airport Scene",
                image: "https://picsum.photos/seed/airport/300/300",
                description: "Busy airport with different airplanes",
                price: 5.00
            }
        ]
    },
    {
        id: "child007",
        name: "Kavita Nair",
        age: 10,
        location: "Pune, India",
        talent: "Music",
        dream: "Doctor",
        image: "https://picsum.photos/seed/kavita/400/400",
        story: "My name is Kavita and I love playing the flute. I want to become a doctor and heal people with both medicine and music. My grandfather was a music teacher and he taught me how to play. I believe music can make sick people feel better. I practice every day and compose my own melodies.",
        artworks: [
            {
                id: "art019",
                title: "Melody of Nature",
                image: "https://picsum.photos/seed/melody/300/300",
                description: "Musical notes flowing like a river",
                price: 5.00
            },
            {
                id: "art020",
                title: "Healing Music",
                image: "https://picsum.photos/seed/healing/300/300",
                description: "Music bringing peace and comfort",
                price: 5.00
            },
            {
                id: "art021",
                title: "Flute Dreams",
                image: "https://picsum.photos/seed/flute/300/300",
                description: "Magical flute playing in nature",
                price: 5.00
            }
        ]
    },
    {
        id: "child008",
        name: "Rohan Joshi",
        age: 9,
        location: "Ahmedabad, India",
        talent: "Dance",
        dream: "Teacher",
        image: "https://picsum.photos/seed/rohan/400/400",
        story: "I am Rohan and I love folk dancing. I want to become a dance teacher and keep our traditional dances alive. My grandmother teaches me old folk dances that tell stories about our culture. I perform at school events and community celebrations. Dancing connects me to my roots and makes me proud of my heritage.",
        artworks: [
            {
                id: "art022",
                title: "Folk Dance",
                image: "https://picsum.photos/seed/folk/300/300",
                description: "Traditional folk dancers in colorful costumes",
                price: 5.00
            },
            {
                id: "art023",
                title: "Harvest Celebration",
                image: "https://picsum.photos/seed/harvest/300/300",
                description: "Dance celebrating the harvest season",
                price: 5.00
            },
            {
                id: "art024",
                title: "Circle of Joy",
                image: "https://picsum.photos/seed/circle/300/300",
                description: "People dancing in a circle of happiness",
                price: 5.00
            }
        ]
    },
    {
        id: "child009",
        name: "Sneha Desai",
        age: 12,
        location: "Jaipur, India",
        talent: "Art",
        dream: "Architect",
        image: "https://picsum.photos/seed/sneha/400/400",
        story: "My name is Sneha and I love drawing buildings and monuments. I want to become an architect and design beautiful buildings that inspire people. My city Jaipur has amazing palaces and forts that inspire my artwork. I practice drawing every day and dream of designing buildings that combine beauty with functionality.",
        artworks: [
            {
                id: "art025",
                title: "Palace Dreams",
                image: "https://picsum.photos/seed/palace/300/300",
                description: "A magnificent palace with intricate architecture",
                price: 5.00
            },
            {
                id: "art026",
                title: "Modern Home",
                image: "https://picsum.photos/seed/home/300/300",
                description: "A sustainable modern house design",
                price: 5.00
            },
            {
                id: "art027",
                title: "City Skyline",
                image: "https://picsum.photos/seed/skyline/300/300",
                description: "Futuristic city with green buildings",
                price: 5.00
            }
        ]
    },
    {
        id: "child010",
        name: "Arjun Mehta",
        age: 11,
        location: "Lucknow, India",
        talent: "Music",
        dream: "Musician",
        image: "https://picsum.photos/seed/arjun/400/400",
        story: "I am Arjun and I love playing the tabla and composing music. I want to become a professional musician and share our traditional Indian music with the world. My father is a music teacher and he has been teaching me since I was very young. Music is in my blood and I feel most alive when I'm playing.",
        artworks: [
            {
                id: "art028",
                title: "Tabla Beats",
                image: "https://picsum.photos/seed/tabella/300/300",
                description: "Rhythmic patterns of traditional tabla",
                price: 5.00
            },
            {
                id: "art029",
                title: "Musical Journey",
                image: "https://picsum.photos/seed/journey/300/300",
                description: "A visual representation of musical notes",
                price: 5.00
            },
            {
                id: "art030",
                title: "Rhythm of India",
                image: "https://picsum.photos/seed/rhythmindia/300/300",
                description: "Traditional Indian musical instruments",
                price: 5.00
            }
        ]
    },
    {
        id: "child011",
        name: "Divya Sharma",
        age: 10,
        location: "Chandigarh, India",
        talent: "Dance",
        dream: "Choreographer",
        image: "https://picsum.photos/seed/divya/400/400",
        story: "My name is Divya and I love creating dance routines. I want to become a choreographer and create beautiful performances that tell stories. I watch dance videos and create my own moves. My friends love dancing to my choreography and we perform at school events. Dance is my way of expressing emotions without words.",
        artworks: [
            {
                id: "art031",
                title: "Dance Flow",
                image: "https://picsum.photos/seed/flow/300/300",
                description: "Fluid movements captured in art",
                price: 5.00
            },
            {
                id: "art032",
                title: "Group Performance",
                image: "https://picsum.photos/seed/group/300/300",
                description: "Synchronized dance formation",
                price: 5.00
            },
            {
                id: "art033",
                title: "Emotional Dance",
                image: "https://picsum.photos/seed/emotional/300/300",
                description: "Expressing feelings through movement",
                price: 5.00
            }
        ]
    },
    {
        id: "child012",
        name: "Karan Singh",
        age: 9,
        location: "Udaipur, India",
        talent: "Art",
        dream: "Artist",
        image: "https://picsum.photos/seed/karan/400/400",
        story: "My name is Karan and I love painting landscapes and portraits. I want to become a professional artist and have my own gallery someday. Udaipur's lakes and palaces inspire my artwork. I paint every day and sell my paintings at local markets to help my family. Art is not just my hobby, it's my passion and my future.",
        artworks: [
            {
                id: "art034",
                title: "Lake Sunset",
                image: "https://picsum.photos/seed/lake/300/300",
                description: "Beautiful sunset over a calm lake",
                price: 5.00
            },
            {
                id: "art035",
                title: "Portrait Study",
                image: "https://picsum.photos/seed/portrait/300/300",
                description: "A detailed portrait study",
                price: 5.00
            },
            {
                id: "art036",
                title: "Mountain View",
                image: "https://picsum.photos/seed/mountain/300/300",
                description: "Majestic mountains in morning light",
                price: 5.00
            }
        ]
    }
];

// In-memory storage for download counters
let downloadCounters = {};

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname)));
// Serve videos directory specifically
app.use('/videos', express.static(path.join(__dirname, 'videos')));

// Session configuration
app.use(session({
    secret: 'children-arts-secret-key-2024',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false,
        maxAge: 24 * 60 * 60 * 1000
    }
}));

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/children.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'children.html'));
});

app.get('/profile.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'profile.html'));
});

app.get('/cart.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'cart.html'));
});

// API Routes
app.get('/api/children', (req, res) => {
    res.json(children);
});

app.get('/api/children/:id', (req, res) => {
    const child = children.find(c => c.id === req.params.id);
    if (!child) {
        return res.status(404).json({ error: 'Child not found' });
    }
    res.json(child);
});

// Sign up endpoint
app.post('/api/signup', (req, res) => {
    const { name, email, phone, password } = req.body;
    
    if (!name || !email || !phone || !password) {
        return res.status(400).json({ error: 'All fields are required' });
    }
    
    db.get('SELECT id FROM users WHERE email = ?', [email], (err, row) => {
        if (err) {
            return res.status(500).json({ error: 'Database error' });
        }
        
        if (row) {
            return res.status(400).json({ error: 'User already exists' });
        }
        
        db.run('INSERT INTO users (name, email, phone, password) VALUES (?, ?, ?, ?)', 
            [name, email, phone, password], 
            function(err) {
                if (err) {
                    return res.status(500).json({ error: 'Failed to create user' });
                }
                
                const user = {
                    id: this.lastID,
                    name,
                    email,
                    phone
                };
                
                req.session.user = user;
                
                res.json({ 
                    success: true, 
                    message: 'Account created successfully',
                    user: {
                        id: user.id,
                        name: user.name,
                        email: user.email
                    }
                });
            }
        );
    });
});

// Sign in endpoint
app.post('/api/signin', (req, res) => {
    const { email, password } = req.body;
    
    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
    }
    
    db.get('SELECT * FROM users WHERE email = ? AND password = ?', [email, password], (err, row) => {
        if (err) {
            return res.status(500).json({ error: 'Database error' });
        }
        
        if (!row) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }
        
        const user = {
            id: row.id,
            name: row.name,
            email: row.email,
            phone: row.phone
        };
        
        req.session.user = user;
        
        res.json({ 
            success: true, 
            message: 'Login successful',
            user: {
                id: user.id,
                name: user.name,
                email: user.email
            }
        });
    });
});

// Get current user
app.get('/api/user', (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({ error: 'Not logged in' });
    }
    res.json({
        id: req.session.user.id,
        name: req.session.user.name,
        email: req.session.user.email
    });
});

// Logout endpoint
app.post('/api/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Logout error:', err);
            return res.status(500).json({ error: 'Logout failed' });
        }
        res.json({ success: true, message: 'Logged out successfully' });
    });
});

// Cart endpoints
app.get('/api/cart', (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({ error: 'Login required' });
    }
    
    db.all('SELECT * FROM cart WHERE user_id = ?', [req.session.user.id], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: 'Database error' });
        }
        res.json(rows);
    });
});

app.post('/api/cart/add', (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({ error: 'Login required' });
    }
    
    const { artworkId, artworkTitle, artworkImage, price } = req.body;
    
    // Check if item already in cart
    db.get('SELECT * FROM cart WHERE user_id = ? AND artwork_id = ?', 
        [req.session.user.id, artworkId], 
        (err, row) => {
            if (err) {
                return res.status(500).json({ error: 'Database error' });
            }
            
            if (row) {
                // Update quantity
                db.run('UPDATE cart SET quantity = quantity + 1 WHERE id = ?', [row.id], (err) => {
                    if (err) {
                        return res.status(500).json({ error: 'Failed to update cart' });
                    }
                    res.json({ success: true, message: 'Cart updated' });
                });
            } else {
                // Add new item
                db.run('INSERT INTO cart (user_id, artwork_id, artwork_title, artwork_image, price) VALUES (?, ?, ?, ?, ?)', 
                    [req.session.user.id, artworkId, artworkTitle, artworkImage, price], 
                    function(err) {
                        if (err) {
                            return res.status(500).json({ error: 'Failed to add to cart' });
                        }
                        res.json({ success: true, message: 'Item added to cart' });
                    }
                );
            }
        }
    );
});

app.put('/api/cart/:id', (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({ error: 'Login required' });
    }
    
    const cartId = req.params.id;
    const { quantity } = req.body;
    
    if (!quantity || quantity < 1 || quantity > 10) {
        return res.status(400).json({ error: 'Invalid quantity' });
    }
    
    db.run('UPDATE cart SET quantity = ? WHERE id = ? AND user_id = ?', 
        [quantity, cartId, req.session.user.id], 
        function(err) {
            if (err) {
                return res.status(500).json({ error: 'Failed to update quantity' });
            }
            
            if (this.changes === 0) {
                return res.status(404).json({ error: 'Item not found' });
            }
            
            res.json({ success: true, message: 'Quantity updated' });
        }
    );
});

app.delete('/api/cart/:id', (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({ error: 'Login required' });
    }
    
    const cartId = req.params.id;
    
    db.run('DELETE FROM cart WHERE id = ? AND user_id = ?', [cartId, req.session.user.id], function(err) {
        if (err) {
            return res.status(500).json({ error: 'Failed to remove item' });
        }
        
        if (this.changes === 0) {
            return res.status(404).json({ error: 'Item not found' });
        }
        
        res.json({ success: true, message: 'Item removed from cart' });
    });
});

// Support artwork endpoint
app.post('/api/support', (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({ error: 'Login required' });
    }
    
    const { artworkId, artworkTitle } = req.body;
    
    if (!artworkId || !artworkTitle) {
        return res.status(400).json({ error: 'Artwork ID and title are required' });
    }
    
    // Initialize counter if not exists
    if (!downloadCounters[artworkId]) {
        downloadCounters[artworkId] = 0;
    }
    
    // Increment counter
    downloadCounters[artworkId]++;
    const newCount = downloadCounters[artworkId];
    const progress = (newCount / 20) * 100;
    
    // Generate invoice
    const invoiceId = 'INV-' + Math.random().toString(36).substr(2, 9).toUpperCase();
    const invoice = {
        id: invoiceId,
        supporterName: req.session.user.name,
        artworkTitle: artworkTitle,
        amount: 5,
        supporterCount: newCount,
        maxSupporters: 20,
        progress: Math.round(progress),
        isFullySupported: newCount >= 20,
        timestamp: new Date()
    };
    
    // Save to database
    db.run('INSERT INTO support (user_id, artwork_id, artwork_title, amount, invoice_id) VALUES (?, ?, ?, ?, ?)', 
        [req.session.user.id, artworkId, artworkTitle, 5, invoiceId], 
        (err) => {
            if (err) {
                console.error('Failed to save support record:', err);
            }
        }
    );
    
    res.json({
        success: true,
        message: 'Support recorded successfully',
        invoice: invoice,
        downloadCount: newCount,
        progress: Math.round(progress)
    });
});

// Get download count for artwork
app.get('/api/download-count/:artworkId', (req, res) => {
    const artworkId = req.params.artworkId;
    const count = downloadCounters[artworkId] || 0;
    const progress = (count / 20) * 100;
    
    res.json({
        downloadCount: count,
        progress: Math.round(progress),
        isFullySupported: count >= 20
    });
});

// Download artwork endpoint
app.post('/api/download/:artworkId', (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({ error: 'Login required' });
    }
    
    const artworkId = req.params.artworkId;
    const count = downloadCounters[artworkId] || 0;
    
    if (count === 0) {
        return res.status(400).json({ error: 'Artwork not supported yet' });
    }
    
    // Find the artwork
    let artwork = null;
    for (const child of children) {
        const found = child.artworks.find(a => a.id === artworkId);
        if (found) {
            artwork = found;
            break;
        }
    }
    
    if (!artwork) {
        return res.status(404).json({ error: 'Artwork not found' });
    }
    
    res.json({
        success: true,
        message: 'Download started',
        artwork: {
            id: artwork.id,
            title: artwork.title,
            image: artwork.image,
            downloadUrl: artwork.image
        }
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Children Education Support Arts server running on port ${PORT}`);
    console.log(`Open http://localhost:${PORT} in your browser`);
});

module.exports = app;
