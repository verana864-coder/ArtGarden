// Global Variables
let childrenData = [];
let currentUser = null;
let cart = [];

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM Content Loaded - Initializing app...');
    
    // Load user data first
    loadUserData();
    
    // Page-specific initialization
    if (document.getElementById('childrenGrid')) {
        console.log('Children grid found - loading children...');
        loadChildren();
    }
    
    if (document.getElementById('childName')) {
        console.log('Child name found - loading profile...');
        loadChildProfile();
    }
    
    if (document.getElementById('featuredArtists')) {
        console.log('Featured artists found - loading...');
        loadFeaturedArtists();
    }
    
    if (document.getElementById('cartItems') || document.getElementById('cartContainer')) {
        console.log('Cart elements found - cart will load after user data');
    }
    
    // Setup event listeners
    setupEventListeners();
    
    // Setup mobile menu
    setupMobileMenu();
    
    console.log('App initialization complete');
});

function setupHeroVideo() {
    console.log('Setting up hero video...');
    const video = document.getElementById('heroVideo');
    if (video) {
        console.log('Hero video element found');
        
        // Set video attributes explicitly
        video.muted = true;
        video.autoplay = true;
        video.loop = true;
        video.playsInline = true;
        
        video.addEventListener('loadstart', function() {
            console.log('Video loading started');
        });
        
        video.addEventListener('canplay', function() {
            console.log('Video can play');
        });
        
        video.addEventListener('error', function(e) {
            console.error('Video error:', e);
            console.error('Video error details:', video.error);
        });
        
        video.addEventListener('loadeddata', function() {
            console.log('Video data loaded');
            console.log('Video dimensions:', video.videoWidth, 'x', video.videoHeight);
            console.log('Video duration:', video.duration);
        });
        
        video.addEventListener('loadedmetadata', function() {
            console.log('Video metadata loaded');
        });
        
        video.addEventListener('play', function() {
            console.log('Video is playing');
        });
        
        video.addEventListener('pause', function() {
            console.log('Video is paused');
        });
        
        // Force video to load and play
        video.load();
        
        // Try to play the video
        setTimeout(function() {
            video.play().then(function() {
                console.log('Video playback started successfully');
            }).catch(function(error) {
                console.error('Video playback failed:', error);
                console.error('Autoplay policy error - trying user interaction fallback');
                
                // Add a click listener to start video on first interaction
                document.addEventListener('click', function playVideo() {
                    video.play().then(function() {
                        console.log('Video playback started after user interaction');
                    }).catch(function(e) {
                        console.error('Video still failed after user interaction:', e);
                    });
                    document.removeEventListener('click', playVideo);
                }, { once: true });
            });
        }, 100);
        
    } else {
        console.log('Hero video element not found');
    }
}

// User Management
async function loadUserData() {
    console.log('Loading user data...');
    try {
        const response = await fetch('/api/user');
        if (response.ok) {
            const user = await response.json();
            currentUser = user;
            console.log('User loaded:', user);
            updateUserInterface();
            
            // Load cart after user data is loaded
            if (document.getElementById('cartItems') || document.getElementById('cartContainer')) {
                loadCart();
            }
        } else {
            console.log('User not logged in');
            currentUser = null;
            updateUserInterface();
            
            // Show empty cart for non-logged in users
            if (document.getElementById('cartItems') || document.getElementById('cartContainer')) {
                updateCartPage();
            }
        }
    } catch (error) {
        console.log('User not logged in:', error);
        currentUser = null;
        updateUserInterface();
        
        // Show empty cart for non-logged in users
        if (document.getElementById('cartItems') || document.getElementById('cartContainer')) {
            updateCartPage();
        }
    }
}

function updateUserInterface() {
    console.log('Updating user interface...');
    const navActions = document.querySelector('.nav-actions');
    if (!navActions) {
        console.log('Nav actions not found');
        return;
    }
    
    if (currentUser) {
        console.log('User logged in - updating nav for user');
        // Update nav for logged in user
        navActions.innerHTML = `
            <div class="cart-icon" onclick="window.location.href='cart.html'">
                <i class="fas fa-shopping-bag"></i>
                <span class="cart-count" id="cartCount">0</span>
            </div>
            <button class="nav-btn" onclick="showUserProfile()">${currentUser.name}</button>
            <button class="nav-btn" onclick="handleLogout()">Sign Out</button>
            <div class="hamburger" onclick="toggleMobileMenu()">
                <i class="fas fa-bars"></i>
            </div>
        `;
    } else {
        console.log('User not logged in - updating nav for guest');
        // Update nav for logged out user
        navActions.innerHTML = `
            <div class="cart-icon" onclick="openAuthModal()">
                <i class="fas fa-shopping-bag"></i>
                <span class="cart-count" id="cartCount">0</span>
            </div>
            <button class="nav-btn" onclick="openAuthModal()">Sign In</button>
            <button class="nav-btn primary" onclick="openAuthModal()">Join</button>
            <div class="hamburger" onclick="toggleMobileMenu()">
                <i class="fas fa-bars"></i>
            </div>
        `;
    }
    
    // Update cart count
    updateCartUI();
}

async function saveUserData(user) {
    try {
        const response = await fetch('/api/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(user)
        });
        
        if (response.ok) {
            const result = await response.json();
            currentUser = result.user;
            updateUserInterface();
            return true;
        } else {
            const error = await response.json();
            console.error('Signup failed:', error.error);
            return false;
        }
    } catch (error) {
        console.error('Signup error:', error);
        return false;
    }
}

async function signInUser(email, password) {
    try {
        const response = await fetch('/api/signin', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });
        
        if (response.ok) {
            const result = await response.json();
            currentUser = result.user;
            updateUserInterface();
            return true;
        } else {
            const error = await response.json();
            console.error('Signin failed:', error.error);
            return false;
        }
    } catch (error) {
        console.error('Signin error:', error);
        return false;
    }
}

function handleLogout() {
    console.log('Sign out button clicked');
    logout();
}

async function logout() {
    console.log('Logging out...');
    try {
        const response = await fetch('/api/logout', {
            method: 'POST'
        });
        
        if (response.ok) {
            console.log('Logout successful');
            currentUser = null;
            cart = [];
            updateUserInterface();
            showNotification('Logged out successfully');
            window.location.href = 'index.html';
        } else {
            console.error('Logout failed');
            showNotification('Logout failed', 'error');
        }
    } catch (error) {
        console.error('Logout error:', error);
        showNotification('Logout error', 'error');
    }
}

// Cart Management
async function loadCart() {
    if (!currentUser) return;
    
    console.log('Loading cart...');
    try {
        const response = await fetch('/api/cart');
        if (!response.ok) {
            throw new Error('Failed to load cart');
        }
        cart = await response.json();
        console.log('Cart loaded:', cart);
        // Ensure quantity property exists for all items
        cart = cart.map(item => ({
            ...item,
            quantity: item.quantity || 1
        }));
        console.log('Cart items with quantities:', cart);
        updateCartUI();
        updateCartPage();
    } catch (error) {
        console.error('Error loading cart:', error);
        // Show empty cart on error
        updateCartPage();
    }
}

async function addToCart(artwork) {
    if (!currentUser) {
        openAuthModal();
        return;
    }
    
    try {
        const response = await fetch('/api/cart/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                artworkId: artwork.id,
                artworkTitle: artwork.title,
                artworkImage: artwork.image,
                price: artwork.price || 5
            })
        });
        
        if (response.ok) {
            await loadCart();
            showNotification('Item added to cart');
            // Update cart UI immediately after adding
            updateCartUI();
        } else {
            const error = await response.json();
            showNotification('Failed to add item: ' + error.error, 'error');
        }
    } catch (error) {
        console.error('Error adding to cart:', error);
        showNotification('Failed to add item', 'error');
    }
}

function updateCartUI() {
    console.log('Updating cart UI...');
    const cartCount = document.getElementById('cartCount');
    if (cartCount) {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalItems;
        console.log('Cart count updated to:', totalItems);
    } else {
        console.log('Cart count element not found');
    }
}

function updateCartPage() {
    const cartItems = document.getElementById('cartItems');
    const cartContainer = document.getElementById('cartContainer');
    const emptyCart = document.getElementById('emptyCart');
    const subtotal = document.getElementById('subtotal');
    const totalAmount = document.getElementById('totalAmount');
    
    if (!cartItems) return; // Not on cart page
    
    if (!currentUser || cart.length === 0) {
        cartContainer.style.display = 'none';
        emptyCart.style.display = 'block';
        return;
    }
    
    cartContainer.style.display = 'grid';
    emptyCart.style.display = 'none';
    
    cartItems.innerHTML = cart.map(item => `
        <div class="cart-item">
            <img src="${item.artwork_image}" alt="${item.artwork_title}" class="cart-item-image">
            <div class="cart-item-info">
                <div class="cart-item-title">${item.artwork_title}</div>
                <div class="cart-item-description">Support young artists through education</div>
                <div class="cart-item-price">$${item.price}</div>
                <div class="cart-item-actions">
                    <div class="quantity-control">
                        <button class="quantity-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
                        <input type="number" class="quantity-input" value="${item.quantity}" min="1" max="10" readonly>
                        <button class="quantity-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
                    </div>
                    <button class="remove-btn" onclick="removeFromCart(${item.id})">Remove</button>
                </div>
            </div>
        </div>
    `).join('');
    
    // Update totals
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    if (subtotal) subtotal.textContent = `$${total.toFixed(2)}`;
    if (totalAmount) totalAmount.textContent = `$${total.toFixed(2)}`;
}

async function updateQuantity(itemId, change) {
    if (!currentUser) return;
    
    const item = cart.find(i => i.id === itemId);
    if (!item) return;
    
    const newQuantity = Math.max(1, Math.min(10, item.quantity + change));
    
    if (newQuantity === item.quantity) return;
    
    // Update local cart first for immediate UI feedback
    item.quantity = newQuantity;
    updateCartUI();
    updateCartPage();
    
    // Update server
    try {
        const response = await fetch(`/api/cart/${itemId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ quantity: newQuantity })
        });
        
        if (!response.ok) {
            // Revert if server update fails
            item.quantity = item.quantity - change;
            updateCartUI();
            updateCartPage();
            const error = await response.json();
            showNotification('Failed to update quantity: ' + error.error, 'error');
        }
    } catch (error) {
        console.error('Error updating quantity:', error);
        // Revert if server update fails
        item.quantity = item.quantity - change;
        updateCartUI();
        updateCartPage();
        showNotification('Failed to update quantity', 'error');
    }
}

async function removeFromCart(itemId) {
    if (!currentUser) return;
    
    try {
        const response = await fetch(`/api/cart/${itemId}`, {
            method: 'DELETE'
        });
        
        if (response.ok) {
            await loadCart();
            showNotification('Item removed from cart');
        } else {
            const error = await response.json();
            showNotification('Failed to remove item: ' + error.error, 'error');
        }
    } catch (error) {
        console.error('Error removing from cart:', error);
        showNotification('Failed to remove item', 'error');
    }
}

function toggleCart() {
    console.log('Toggle cart clicked');
    const cartSidebar = document.getElementById('cartSidebar');
    if (cartSidebar) {
        cartSidebar.classList.toggle('open');
        console.log('Cart sidebar toggled');
    } else {
        console.log('Cart sidebar not found, redirecting to cart page');
        // If sidebar doesn't exist, redirect to cart page
        window.location.href = 'cart.html';
    }
}

function checkout() {
    console.log('Checkout process started');
    
    if (cart.length === 0) {
        console.log('Cart is empty');
        showNotification('Your cart is empty', 'error');
        return;
    }
    
    if (!currentUser) {
        console.log('User not logged in, opening auth modal');
        openAuthModal();
        return;
    }
    
    // Calculate total
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    console.log('Processing checkout for cart:', cart);
    console.log('Total amount:', total);
    
    // Create order summary
    const orderSummary = {
        items: cart,
        total: total,
        user: currentUser,
        timestamp: new Date()
    };
    
    // Show checkout confirmation
    const confirmed = confirm(`Confirm checkout for $${total.toFixed(2)}?\n\nItems: ${cart.length}\nTotal: $${total.toFixed(2)}`);
    
    if (confirmed) {
        console.log('User confirmed checkout');
        
        // Process checkout (simulate for now)
        showNotification('Processing checkout...');
        
        setTimeout(() => {
            // Clear cart after successful checkout
            cart = [];
            updateCartUI();
            updateCartPage();
            
            showNotification('Checkout successful! Thank you for your order.');
            console.log('Checkout completed successfully');
            
            // Redirect to home page after 2 seconds
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 2000);
        }, 2000);
    } else {
        console.log('User cancelled checkout');
        showNotification('Checkout cancelled');
    }
}

// Modal Functions
function openAuthModal() {
    console.log('Opening auth modal');
    const modal = document.getElementById('authModal');
    if (modal) {
        modal.classList.add('active');
        console.log('Auth modal opened');
    } else {
        console.error('Auth modal not found');
    }
}

function closeAuthModal() {
    console.log('Closing auth modal');
    const modal = document.getElementById('authModal');
    if (modal) {
        modal.classList.remove('active');
        console.log('Auth modal closed');
    } else {
        console.error('Auth modal not found');
    }
}

function switchTab(tabName) {
    console.log('Switching to tab:', tabName);
    // Update tab buttons
    const tabButtons = document.querySelectorAll('.tab-btn');
    tabButtons.forEach(btn => {
        btn.classList.remove('active');
        if (btn.textContent.toLowerCase().includes(tabName)) {
            btn.classList.add('active');
        }
    });
    
    // Update tab content
    const tabContents = document.querySelectorAll('.tab-content');
    tabContents.forEach(content => {
        content.classList.remove('active');
    });
    
    const activeTab = document.getElementById(tabName + 'Tab');
    if (activeTab) {
        activeTab.classList.add('active');
        console.log('Tab switched to:', tabName);
    } else {
        console.error('Tab not found:', tabName + 'Tab');
    }
}

function showUserProfile() {
    if (currentUser) {
        alert(`Logged in as: ${currentUser.name}\nEmail: ${currentUser.email}\nUser ID: ${currentUser.id}`);
    }
}

// Data Loading
async function loadChildren() {
    console.log('Loading children...');
    try {
        const response = await fetch('/api/children');
        if (!response.ok) {
            throw new Error('Failed to load children data');
        }
        childrenData = await response.json();
        console.log('Children loaded:', childrenData);
        displayChildren(childrenData);
        const loadingElement = document.getElementById('loading');
        if (loadingElement) {
            loadingElement.style.display = 'none';
        }
    } catch (error) {
        console.error('Error loading children data:', error);
        const loadingElement = document.getElementById('loading');
        if (loadingElement) {
            loadingElement.innerHTML = '<p>Error loading data. Please try again.</p>';
        }
    }
}

async function loadChildProfile() {
    console.log('Loading child profile...');
    const urlParams = new URLSearchParams(window.location.search);
    const childId = urlParams.get('id');
    
    if (!childId) {
        console.log('No child ID found, redirecting to children page');
        window.location.href = 'children.html';
        return;
    }
    
    try {
        const response = await fetch(`/api/children/${childId}`);
        if (!response.ok) {
            console.log('Child not found, redirecting to children page');
            window.location.href = 'children.html';
            return;
        }
        const child = await response.json();
        console.log('Child profile loaded:', child);
        displayChildProfile(child);
    } catch (error) {
        console.error('Error loading child profile:', error);
        window.location.href = 'children.html';
    }
}

async function loadFeaturedArtists() {
    console.log('Loading featured artists...');
    try {
        const response = await fetch('/api/children');
        const children = await response.json();
        displayFeaturedArtists(children.slice(0, 3)); // Show first 3 as featured
    } catch (error) {
        console.error('Error loading featured artists:', error);
    }
}

// Display Functions
function displayChildren(children) {
    console.log('Displaying children:', children);
    const grid = document.getElementById('childrenGrid');
    if (!grid) {
        console.log('Children grid not found');
        return;
    }
    
    grid.innerHTML = '';
    
    children.forEach(child => {
        const card = createChildCard(child);
        grid.appendChild(card);
    });
}

function createChildCard(child) {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.onclick = () => window.location.href = `profile.html?id=${child.id}`;
    
    card.innerHTML = `
        <img src="${child.image}" alt="${child.name}" class="product-image">
        <div class="product-info">
            <h3 class="product-title">${child.name}</h3>
            <p class="product-description">Age: ${child.age} | Location: ${child.location}</p>
            <p class="product-description">Talent: ${child.talent} | Dream: ${child.dream}</p>
            <div class="product-actions">
                <button class="btn btn-primary" onclick="event.stopPropagation(); window.location.href='profile.html?id=${child.id}'">View Profile</button>
                <button class="btn btn-secondary" onclick="event.stopPropagation(); supportArtist('${child.id}')">Support</button>
            </div>
        </div>
    `;
    
    return card;
}

function supportArtist(childId) {
    console.log('Supporting artist:', childId);
    if (!currentUser) {
        openAuthModal();
        return;
    }
    
    // Find the child and redirect to their profile
    const child = childrenData.find(c => c.id === childId);
    if (child && child.artworks && child.artworks.length > 0) {
        // Support the first artwork
        supportArtwork(child.artworks[0].id, child.artworks[0].title);
    } else {
        showNotification('No artworks available to support', 'error');
    }
}

function displayChildProfile(child) {
    console.log('Displaying child profile:', child);
    // Update profile header
    const childName = document.getElementById('childName');
    const childAge = document.getElementById('childAge');
    const childLocation = document.getElementById('childLocation');
    const childTalent = document.getElementById('childTalent');
    const childDream = document.getElementById('childDream');
    const childImage = document.getElementById('childImage');
    const childStory = document.getElementById('childStory');
    
    if (childName) childName.textContent = child.name;
    if (childAge) childAge.textContent = 'Age: ' + child.age;
    if (childLocation) childLocation.textContent = 'Location: ' + child.location;
    if (childTalent) childTalent.textContent = 'Talent: ' + child.talent;
    if (childDream) childDream.textContent = 'Dream: ' + child.dream;
    if (childImage) childImage.src = child.image;
    if (childStory) childStory.textContent = child.story || 'I love creating art and expressing my creativity through colors and shapes. Every artwork I create tells a story about my dreams and hopes for the future. Your support helps me continue my artistic journey and pursue my education.';
    
    // Display artworks
    displayArtworks(child.artworks);
    displaySupportCards(child.artworks);
}

function displayArtworks(artworks) {
    console.log('Displaying artworks:', artworks);
    const grid = document.getElementById('artworkGrid');
    if (!grid) {
        console.log('Artwork grid not found');
        return;
    }
    
    grid.innerHTML = '';
    
    artworks.forEach(artwork => {
        const card = document.createElement('div');
        card.className = 'product-card';
        
        card.innerHTML = `
            <img src="${artwork.image}" alt="${artwork.title}" class="product-image">
            <div class="product-info">
                <h4 class="product-title">${artwork.title}</h4>
                <p class="product-description">${artwork.description}</p>
                <div class="product-price">$${artwork.price || 5.00}</div>
                <div class="product-actions">
                    <button class="btn btn-primary" onclick="addToCart(${JSON.stringify(artwork).replace(/"/g, '&quot;')})">Add to Cart</button>
                    <button class="btn btn-outline" onclick="supportArtwork('${artwork.id}', '${artwork.title}')">Support $5</button>
                </div>
            </div>
        `;
        
        grid.appendChild(card);
    });
}

async function displaySupportCards(artworks) {
    console.log('Displaying support cards:', artworks);
    const container = document.getElementById('supportCards');
    if (!container) {
        console.log('Support cards container not found');
        return;
    }
    
    container.innerHTML = '';
    
    for (const artwork of artworks) {
        const card = await createSupportCard(artwork);
        container.appendChild(card);
    }
}

async function createSupportCard(artwork) {
    console.log('Creating support card for:', artwork);
    const card = document.createElement('div');
    card.className = 'support-card';
    
    try {
        const response = await fetch(`/api/download-count/${artwork.id}`);
        const data = await response.json();
        const downloadCount = data.downloadCount;
        const progress = data.progress;
        const isFullySupported = data.isFullySupported;
        
        card.innerHTML = `
            <h4>${artwork.title}</h4>
            <div class="progress-container">
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${progress}%"></div>
                </div>
                <div class="progress-text">
                    ${downloadCount}/20 supporters (${progress}%)
                </div>
            </div>
            <button class="support-btn" onclick="supportArtwork('${artwork.id}', '${artwork.title}')" ${isFullySupported ? 'disabled' : ''}>
                ${isFullySupported ? 'Fully Supported' : 'Support $5'}
            </button>
            <button class="download-btn" onclick="downloadArtwork('${artwork.id}', '${artwork.title}')" ${downloadCount === 0 ? 'disabled' : ''}>
                Download Artwork
            </button>
        `;
        
        console.log('Support card created with data:', { downloadCount, progress, isFullySupported });
    } catch (error) {
        console.error('Error loading download count:', error);
        // Show default state with 0 supporters
        card.innerHTML = `
            <h4>${artwork.title}</h4>
            <div class="progress-container">
                <div class="progress-bar">
                    <div class="progress-fill" style="width: 0%"></div>
                </div>
                <div class="progress-text">
                    0/20 supporters (0%)
                </div>
            </div>
            <button class="support-btn" onclick="supportArtwork('${artwork.id}', '${artwork.title}')">
                Support $5
            </button>
            <button class="download-btn" onclick="downloadArtwork('${artwork.id}', '${artwork.title}')" disabled>
                Download Artwork
            </button>
        `;
    }
    
    return card;
}

async function supportArtwork(artworkId, artworkTitle) {
    console.log('Supporting artwork:', artworkId, artworkTitle);
    if (!currentUser) {
        console.log('User not logged in, opening auth modal');
        openAuthModal();
        return;
    }
    
    try {
        const response = await fetch('/api/support', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                artworkId: artworkId,
                artworkTitle: artworkTitle
            })
        });
        
        if (response.ok) {
            const result = await response.json();
            console.log('Support successful:', result);
            showNotification('Thank you for your support!');
            
            // Update the specific support card immediately with new data
            console.log('Updating support card with new data...');
            const supportCards = document.querySelectorAll('.support-card');
            supportCards.forEach(card => {
                if (card.innerHTML.includes(artworkId)) {
                    const progressFill = card.querySelector('.progress-fill');
                    const progressText = card.querySelector('.progress-text');
                    const supportBtn = card.querySelector('.support-btn');
                    const downloadBtn = card.querySelector('.download-btn');
                    
                    if (progressFill) progressFill.style.width = `${result.progress}%`;
                    if (progressText) progressText.textContent = `${result.downloadCount}/20 supporters (${result.progress}%)`;
                    
                    if (result.downloadCount >= 20) {
                        if (supportBtn) {
                            supportBtn.textContent = 'Fully Supported';
                            supportBtn.disabled = true;
                        }
                    }
                    
                    if (downloadBtn && result.downloadCount > 0) {
                        downloadBtn.disabled = false;
                    }
                    
                    console.log('Support card updated with new progress:', result.progress);
                }
            });
        } else {
            const error = await response.json();
            console.error('Support failed:', error);
            showNotification('Support failed: ' + error.error, 'error');
        }
    } catch (error) {
        console.error('Error supporting artwork:', error);
        showNotification('Support failed', 'error');
    }
}

async function downloadArtwork(artworkId, artworkTitle) {
    console.log('Downloading artwork:', artworkId, artworkTitle);
    if (!currentUser) {
        openAuthModal();
        return;
    }
    
    try {
        const response = await fetch(`/api/download/${artworkId}`, {
            method: 'POST'
        });
        
        if (response.ok) {
            const result = await response.json();
            showNotification('Download started!');
            
            // Create download link
            const link = document.createElement('a');
            link.href = result.artwork.downloadUrl;
            link.download = result.artwork.title;
            link.target = '_blank';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } else {
            const error = await response.json();
            showNotification('Download failed: ' + error.error, 'error');
        }
    } catch (error) {
        console.error('Error downloading artwork:', error);
        showNotification('Download failed', 'error');
    }
}

function displayFeaturedArtists(children) {
    console.log('Displaying featured artists:', children);
    const grid = document.getElementById('featuredArtists');
    if (!grid) {
        console.log('Featured artists grid not found');
        return;
    }
    
    grid.innerHTML = '';
    
    children.forEach(child => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.onclick = () => window.location.href = `profile.html?id=${child.id}`;
        
        card.innerHTML = `
            <img src="${child.image}" alt="${child.name}" class="product-image">
            <div class="product-info">
                <h3 class="product-title">${child.name}</h3>
                <p class="product-description">Age: ${child.age} | ${child.talent}</p>
                <p class="product-description">${child.dream}</p>
                <button class="btn btn-primary" onclick="event.stopPropagation(); window.location.href='profile.html?id=${child.id}'">View Profile</button>
            </div>
        `;
        
        grid.appendChild(card);
    });
}

// Filter Functions
function filterChildren(filter) {
    console.log('Filtering children:', filter);
    let filtered = childrenData;
    
    if (filter !== 'all') {
        filtered = childrenData.filter(child => child.talent.toLowerCase() === filter.toLowerCase());
    }
    
    displayChildren(filtered);
    
    // Update active filter button
    const filterButtons = document.querySelectorAll('.filter-buttons .btn');
    filterButtons.forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.filter === filter) {
            btn.classList.add('active');
        }
    });
}

// Mobile Menu
function setupMobileMenu() {
    console.log('Setting up mobile menu...');
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }
}

// Toggle Mobile Menu Function
function toggleMobileMenu() {
    console.log('Toggle mobile menu clicked');
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
        console.log('Mobile menu toggled');
    } else {
        console.log('Mobile menu elements not found');
    }
}

// Login System
function setupLoginForm() {
    console.log('Setting up login forms...');
    const signinForm = document.getElementById('signinForm');
    const signupForm = document.getElementById('signupForm');
    
    if (signinForm) {
        signinForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            console.log('Sign in form submitted');
            
            const email = this.email.value;
            const password = this.password.value;
            
            console.log('Attempting login with:', email);
            
            const success = await signInUser(email, password);
            
            if (success) {
                closeAuthModal();
                showNotification('Login successful!');
                await loadCart();
            } else {
                showNotification('Login failed. Please check your credentials.', 'error');
            }
        });
    }
    
    if (signupForm) {
        signupForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            console.log('Sign up form submitted');
            
            const name = this.name.value;
            const email = this.email.value;
            const phone = this.phone.value;
            const password = this.password.value;
            
            console.log('Attempting signup with:', name, email);
            
            if (await saveUserData({ name, email, phone, password })) {
                closeAuthModal();
                showNotification('Account created successfully!');
            }
        });
    }
}

// Notification System
function showNotification(message, type = 'success') {
    console.log('Showing notification:', message, type);
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Event Listeners
function setupEventListeners() {
    console.log('Setting up event listeners...');
    
    // Setup login/signup forms
    setupLoginForm();
    
    // Filter buttons
    const filterButtons = document.querySelectorAll('.filter-buttons .btn');
    filterButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const filter = this.dataset.filter;
            console.log('Filter clicked:', filter);
            
            // Update active state
            filterButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // Filter children
            filterChildren(filter);
        });
    });
    
    // Close modal on outside click
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('modal-overlay')) {
            closeModal();
            closeAuthModal();
        }
    });
    
    // Escape key to close modal
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeModal();
            closeAuthModal();
        }
    });
    
    // Close cart on outside click
    document.addEventListener('click', function(e) {
        const cartSidebar = document.getElementById('cartSidebar');
        if (cartSidebar && !cartSidebar.contains(e.target) && !e.target.closest('.cart-icon')) {
            cartSidebar.classList.remove('open');
        }
    });
    
    console.log('Event listeners setup complete');
}

// Social Sharing
function shareOnWhatsApp() {
    const message = "Please support a child who needs education, food, and shelter in India by buying the artwork of his/her hard work.";
    const url = window.location.href;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message + ' ' + url)}`;
    window.open(whatsappUrl, '_blank');
}

console.log('Script loaded successfully');
