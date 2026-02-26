# Children Education Support Arts

A demo international charity e-commerce platform to sell children's digital artwork and support their education.

## Features

- **Premium Design**: Prime Blue & White theme with glassmorphism effects
- **Responsive**: Mobile-first design that works on all devices
- **User Authentication**: Session-based login system
- **Demo Payment System**: Support artwork with $5 contributions
- **Progress Tracking**: Real-time progress bars showing support status
- **Social Sharing**: WhatsApp, Facebook, Twitter, LinkedIn integration
- **Dynamic Content**: Server-side data management with Express.js

## Project Structure

```
ChildDemo/
├── index.html          # Homepage with hero section
├── children.html       # Children gallery page
├── profile.html        # Individual child profile page
├── login.html          # Login page
├── css/
│   └── style.css       # Complete styling with glassmorphism
├── js/
│   └── script.js       # Frontend JavaScript functionality
├── server.js           # Express server with session management
└── README.md           # This file
```

## Installation & Setup

1. **Install Dependencies**:
   ```bash
   npm install express express-session
   ```

2. **Start the Server**:
   ```bash
   node server.js
   ```

3. **Open in Browser**:
   Navigate to `http://localhost:3000`

## Features Overview

### 🎨 Design Theme
- Royal blue gradient backgrounds
- Glassmorphism cards with soft shadows
- Elegant typography (Poppins font)
- Smooth animations and transitions
- Sticky navigation bar

### 👥 User System
- **Demo Login**: Simple form with name, email, and phone
- **Session Management**: Secure session-based authentication
- **User Profile**: Display logged-in user information

### 🎭 Children Profiles
- **8 Sample Children**: Each with unique stories and artwork
- **Artwork Gallery**: 3 artworks per child (24 total)
- **Personal Stories**: Heartfelt descriptions of each child's dreams

### 💰 Support System
- **$5 per Support**: Fixed contribution amount
- **20 Supporters Max**: Each artwork needs 20 supporters ($100 total)
- **Progress Tracking**: Real-time progress bars
- **Invoice Generation**: Automatic invoice with unique ID
- **Download Access**: Download artwork after supporting

### 📱 Social Features
- **WhatsApp Sharing**: Direct message sharing
- **Social Media**: Facebook, Twitter, LinkedIn integration
- **Auto Message**: Pre-written support message

### 🔧 Technical Features
- **Express Server**: RESTful API endpoints
- **Session Storage**: Secure user session management
- **Real-time Updates**: Live progress tracking
- **Responsive Design**: Works on all screen sizes
- **Error Handling**: Comprehensive error management

## API Endpoints

### User Management
- `POST /api/login` - User login
- `POST /api/logout` - User logout
- `GET /api/user` - Get current user

### Children Data
- `GET /api/children` - Get all children
- `GET /api/children/:id` - Get specific child

### Support System
- `POST /api/support` - Support artwork
- `GET /api/download-count/:artworkId` - Get download count
- `POST /api/download/:artworkId` - Download artwork

### Statistics
- `GET /api/stats` - Get platform statistics

## Data Structure

### Child Object
```javascript
{
  id: "child001",
  name: "Priya Sharma",
  age: 8,
  location: "Mumbai, India",
  talent: "Art",
  dream: "Doctor",
  image: "https://picsum.photos/seed/priya/400/400",
  story: "Personal story...",
  artworks: [
    {
      id: "art001",
      title: "Sunflower Garden",
      image: "https://picsum.photos/seed/sunflower/300/300",
      description: "Artwork description"
    }
  ]
}
```

## Usage Instructions

1. **Browse Homepage**: View the hero section and platform overview
2. **Explore Children**: Visit the children gallery to see all young artists
3. **Login**: Fill out the simple login form to enable support features
4. **Support Artwork**: Click "Support $5" on any artwork to contribute
5. **Download Artwork**: After supporting, download the digital artwork
6. **Share**: Use social sharing buttons to spread awareness

## Browser Compatibility

- Chrome (Recommended)
- Firefox
- Safari
- Edge
- Mobile browsers

## Security Notes

- This is a demo application with basic security
- Sessions are stored in memory (restart server clears sessions)
- No real payment processing (demo only)
- Images use placeholder services

## Contributing

This is a demo project for educational purposes. Feel free to modify and enhance the features.

## License

MIT License - Feel free to use this project for learning and development.

---

**Support children's education through the power of art! 🎨📚**
