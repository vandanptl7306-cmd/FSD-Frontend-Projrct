// Cart Management System
let cartItems = [];

// Load cart from localStorage
function loadCart() {
  const savedCart = localStorage.getItem('joyespoonCart');
  if (savedCart) {
    cartItems = JSON.parse(savedCart);
    updateCartUI();
  }
}

// Save cart to localStorage
function saveCart() {
  localStorage.setItem('joyespoonCart', JSON.stringify(cartItems));
}

// Add item to cart
function addToCart(product) {
  // Check if item already exists in cart
  const existingItem = cartItems.find((item) => item.name === product.name);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cartItems.push({
      ...product,
      quantity: 1,
    });
  }

  saveCart();
  updateCartUI();
}

// Remove item from cart
function removeFromCart(productName) {
  cartItems = cartItems.filter((item) => item.name !== productName);
  saveCart();
  updateCartUI();
}

// Update item quantity
function updateQuantity(productName, newQuantity) {
  const item = cartItems.find((item) => item.name === productName);
  if (item) {
    if (newQuantity <= 0) {
      removeFromCart(productName);
    } else {
      item.quantity = newQuantity;
      saveCart();
      updateCartUI();
    }
  }
}

// Render cart items
function renderCartItems() {
  const cartItemsContainer = document.getElementById('cartItems');

  if (cartItems.length === 0) {
    cartItemsContainer.innerHTML = `
      <div class="empty-cart">
        <i class="fas fa-shopping-cart"></i>
        <p>Your cart is empty</p>
      </div>
    `;
    return;
  }

  cartItemsContainer.innerHTML = cartItems
    .map(
      (item) => `
    <div class="cart-item" data-product-name="${item.name}">
      <img src="${item.image}" alt="${item.name}" class="cart-item-image">
      <div class="cart-item-details">
        <h6>${item.name}</h6>
        <div class="cart-item-controls">
          <div class="quantity-controls">
            <button class="qty-btn qty-minus" data-product="${item.name}">
              <i class="fas fa-minus"></i>
            </button>
            <input type="number" value="${
              item.quantity
            }" min="1" class="qty-input" readonly>
            <button class="qty-btn qty-plus" data-product="${item.name}">
              <i class="fas fa-plus"></i>
            </button>
          </div>
          <div class="cart-item-price">
            ${
              item.oldPrice
                ? `<span class="original-price">₹${item.oldPrice}</span>`
                : ''
            }
            <span class="discounted-price">₹${item.price}</span>
          </div>
        </div>
      </div>
      <button class="cart-item-remove" data-product="${item.name}">
        <i class="fas fa-trash-alt"></i>
      </button>
    </div>
  `
    )
    .join('');
}

// Calculate cart total
function calculateCartTotal() {
  return cartItems.reduce((total, item) => {
    return total + item.price * item.quantity;
  }, 0);
}

// Update cart UI
function updateCartUI() {
  renderCartItems();
  updateCartCount();
  updateCartTotal();
}

// Smooth Scrolling for Navigation Links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  });
});

// Navbar Scroll Effect
window.addEventListener('scroll', function () {
  const navbar = document.querySelector('.navbar');
  if (window.scrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});

// Scroll to Top Button
const scrollTopBtn = document.getElementById('scrollTop');

window.addEventListener('scroll', function () {
  if (window.scrollY > 300) {
    scrollTopBtn.classList.add('visible');
  } else {
    scrollTopBtn.classList.remove('visible');
  }
});

scrollTopBtn.addEventListener('click', function () {
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  });
});

// Add to Cart Functionality
function initAddToCartButtons() {
  const addToCartButtons = document.querySelectorAll('.btn-add-cart');

  addToCartButtons.forEach((button) => {
    // Remove existing listeners
    const newButton = button.cloneNode(true);
    button.parentNode.replaceChild(newButton, button);

    newButton.addEventListener('click', function (e) {
      e.preventDefault();

      // Get product information from the card
      const productCard = this.closest('.product-card, .gift-card');
      if (!productCard) return;

      const productName = productCard.querySelector('h5').textContent;
      const productImage = productCard.querySelector('img').src;
      const priceElement = productCard.querySelector('.price');

      // Extract price (remove ₹ and get the main price)
      let price, oldPrice;
      const priceText = priceElement.textContent;
      const priceMatch = priceText.match(/₹(\d+)/g);

      if (priceMatch && priceMatch.length >= 1) {
        price = parseInt(priceMatch[0].replace('₹', ''));
        if (priceMatch.length >= 2) {
          oldPrice = parseInt(priceMatch[1].replace('₹', ''));
        }
      }

      // Create product object
      const product = {
        name: productName,
        image: productImage,
        price: price,
        oldPrice: oldPrice,
      };

      // Add to cart
      addToCart(product);

      // Add animation class
      this.innerHTML = '<i class="fas fa-check"></i> ADDED!';
      this.style.background = '#4CAF50';

      // Reset after 2 seconds
      setTimeout(() => {
        this.innerHTML = 'ADD TO CART';
        this.style.background = '';
      }, 2000);

      // Show notification
      showNotification('Product added to cart!');

      // Open cart drawer
      setTimeout(() => {
        openCart();
      }, 500);
    });
  });
}

// Initialize Add to Cart buttons on page load
initAddToCartButtons();

// Notification Function
function showNotification(message) {
  // Check if notification already exists
  let existingNotification = document.querySelector('.cart-notification');
  if (existingNotification) {
    existingNotification.remove();
  }

  // Create notification element
  const notification = document.createElement('div');
  notification.className = 'cart-notification';
  notification.innerHTML = `
        <i class="fas fa-check-circle"></i>
        <span>${message}</span>
    `;

  // Style the notification
  notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 30px;
        background: linear-gradient(135deg, #4CAF50, #45a049);
        color: white;
        padding: 15px 25px;
        border-radius: 50px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        z-index: 10000;
        display: flex;
        align-items: center;
        gap: 10px;
        animation: slideInRight 0.5s ease;
        font-weight: 600;
    `;

  document.body.appendChild(notification);

  // Remove notification after 3 seconds
  setTimeout(() => {
    notification.style.animation = 'slideOutRight 0.5s ease';
    setTimeout(() => {
      notification.remove();
    }, 500);
  }, 3000);
}

// Add CSS for notification animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            opacity: 0;
            transform: translateX(100px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
    
    @keyframes slideOutRight {
        from {
            opacity: 1;
            transform: translateX(0);
        }
        to {
            opacity: 0;
            transform: translateX(100px);
        }
    }
`;
document.head.appendChild(style);

// Newsletter Signup
// const newsletterBtn = document.querySelector('.btn-newsletter');
// if (newsletterBtn) {
//   newsletterBtn.addEventListener('click', function (e) {
//     e.preventDefault();

//     // Create modal/prompt for email
//     const email = prompt('Enter your email address to subscribe:');

//     if (email && validateEmail(email)) {
//       showNotification('Successfully subscribed to newsletter!');
//     } else if (email) {
//       alert('Please enter a valid email address.');
//     }
//   });
// }

// Email Validation
function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

// Product Card Hover Effects
const productCards = document.querySelectorAll('.product-card, .gift-card');

productCards.forEach((card) => {
  card.addEventListener('mouseenter', function () {
    this.style.transform = 'translateY(-10px) scale(1.02)';
  });

  card.addEventListener('mouseleave', function () {
    this.style.transform = 'translateY(0) scale(1)';
  });
});

// Collection Cards Click Handler
const collectionCards = document.querySelectorAll('.collection-card');

collectionCards.forEach((card) => {
  card.addEventListener('click', function () {
    const collectionName = this.querySelector('h3').textContent;
    showNotification(`Exploring ${collectionName}...`);
  });
});

// Lazy Loading Images
if ('IntersectionObserver' in window) {
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.classList.add('loaded');
        observer.unobserve(img);
      }
    });
  });

  const images = document.querySelectorAll('img');
  images.forEach((img) => imageObserver.observe(img));
}

// Counter Animation for Stats (if needed)
function animateCounter(element, target, duration = 2000) {
  let start = 0;
  const increment = target / (duration / 16);

  const timer = setInterval(() => {
    start += increment;
    if (start >= target) {
      element.textContent = target;
      clearInterval(timer);
    } else {
      element.textContent = Math.floor(start);
    }
  }, 16);
}

// Rating Stars Interaction
const ratingStars = document.querySelectorAll('.rating i');

ratingStars.forEach((star, index) => {
  star.addEventListener('mouseenter', function () {
    this.style.transform = 'scale(1.3) rotate(10deg)';
  });

  star.addEventListener('mouseleave', function () {
    this.style.transform = 'scale(1) rotate(0deg)';
  });
});

// Platform Logos Animation on Scroll
const observerOptions = {
  threshold: 0.5,
  rootMargin: '0px 0px -100px 0px',
};

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('animate-in');
    }
  });
}, observerOptions);

const sections = document.querySelectorAll('section');
sections.forEach((section) => {
  sectionObserver.observe(section);
});

// Mobile Menu Close on Click
const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
const navbarCollapse = document.querySelector('.navbar-collapse');

navLinks.forEach((link) => {
  link.addEventListener('click', () => {
    if (window.innerWidth < 992) {
      const bsCollapse = bootstrap.Collapse.getInstance(navbarCollapse);
      if (bsCollapse) {
        bsCollapse.hide();
      }
    }
  });
});

// Search Functionality (Basic)
// const searchIcon = document.querySelector('.nav-link .fa-search');
// if (searchIcon) {
//   searchIcon.parentElement.addEventListener('click', function (e) {
//     e.preventDefault();
//     const searchQuery = prompt('What are you looking for?');
//     if (searchQuery) {
//       showNotification(`Searching for "${searchQuery}"...`);
//     }
//   });
// }

// Cart Icon Click - Open Cart Drawer
function initCartDrawer() {
  const cartIcon = document.querySelector('.fa-shopping-cart');
  const cartDrawer = document.getElementById('cartDrawer');
  const cartOverlay = document.getElementById('cartOverlay');
  const cartClose = document.getElementById('cartClose');

  if (cartIcon) {
    cartIcon.parentElement.addEventListener('click', function (e) {
      e.preventDefault();
      openCart();
    });
  }

  // Close cart when clicking close button
  if (cartClose) {
    cartClose.addEventListener('click', closeCart);
  }

  // Close cart when clicking overlay
  if (cartOverlay) {
    cartOverlay.addEventListener('click', closeCart);
  }

  // Close cart with Escape key
  document.addEventListener('keydown', function (e) {
    if (
      e.key === 'Escape' &&
      cartDrawer &&
      cartDrawer.classList.contains('active')
    ) {
      closeCart();
    }
  });
}

// Initialize cart drawer
initCartDrawer();

// Open Cart Function
function openCart() {
  const cartDrawer = document.getElementById('cartDrawer');
  const cartOverlay = document.getElementById('cartOverlay');
  if (cartDrawer && cartOverlay) {
    cartDrawer.classList.add('active');
    cartOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
}

// Close Cart Function
function closeCart() {
  const cartDrawer = document.getElementById('cartDrawer');
  const cartOverlay = document.getElementById('cartOverlay');
  if (cartDrawer && cartOverlay) {
    cartDrawer.classList.remove('active');
    cartOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }
}

// Quantity Controls - Updated for Dynamic Cart
document.addEventListener('click', function (e) {
  // Increase quantity
  if (e.target.closest('.qty-plus')) {
    const productName = e.target.closest('.qty-plus').dataset.product;
    const item = cartItems.find((item) => item.name === productName);
    if (item) {
      updateQuantity(productName, item.quantity + 1);
    }
  }

  // Decrease quantity
  if (e.target.closest('.qty-minus')) {
    const productName = e.target.closest('.qty-minus').dataset.product;
    const item = cartItems.find((item) => item.name === productName);
    if (item && item.quantity > 1) {
      updateQuantity(productName, item.quantity - 1);
    }
  }

  // Remove item
  if (e.target.closest('.cart-item-remove')) {
    const productName = e.target.closest('.cart-item-remove').dataset.product;
    const cartItem = e.target.closest('.cart-item');

    cartItem.style.animation = 'slideOutRight 0.3s ease';
    setTimeout(() => {
      removeFromCart(productName);
      showNotification('Item removed from cart');
    }, 300);
  }
});

// Update Cart Total - Updated for Dynamic Cart
function updateCartTotal() {
  const total = calculateCartTotal();
  const totalLabel = document.querySelector('.total-label');
  if (totalLabel) {
    totalLabel.textContent = '₹' + total;
  }

  // Update progress bar
  const progressBar = document.querySelector('.milestone-progress');
  if (progressBar) {
    const progress = Math.min((total / 1299) * 100, 100);
    progressBar.style.width = progress + '%';
  }
}

// Update Cart Count - Updated for Dynamic Cart
function updateCartCount() {
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const cartCountElement = document.getElementById('cartItemCount');
  if (cartCountElement) {
    cartCountElement.textContent = totalItems;
  }
}

// Apply Coupon
const applyCouponBtn = document.getElementById('applyCoupon');
if (applyCouponBtn) {
  applyCouponBtn.addEventListener('click', function () {
    const couponCode = document.getElementById('couponCode').value.trim();

    if (couponCode) {
      if (
        couponCode.toUpperCase() === 'WELCOME10' ||
        couponCode.toUpperCase() === 'SAVE20'
      ) {
        showNotification('Coupon applied successfully!');
        document.getElementById('couponCode').value = '';
      } else {
        showNotification('Invalid coupon code');
      }
    } else {
      showNotification('Please enter a coupon code');
    }
  });
}

// Checkout Button
const checkoutBtn = document.querySelector('.btn-checkout');
if (checkoutBtn) {
  checkoutBtn.addEventListener('click', function () {
    // Check if cart has items
    if (cartItems.length === 0) {
      showNotification('Your cart is empty!');
      return;
    }

    showNotification('Proceeding to checkout...');
    setTimeout(() => {
      window.location.href = 'payment.html';
    }, 500);
  });
}

// Search Drawer Functionality
const searchIcon = document.getElementById('searchIcon');
const searchDrawer = document.getElementById('searchDrawer');
const searchOverlay = document.getElementById('searchOverlay');
const searchClose = document.getElementById('searchClose');
const searchInput = document.getElementById('searchInput');

// Open search drawer
if (searchIcon) {
  searchIcon.addEventListener('click', function (e) {
    e.preventDefault();
    openSearch();
  });
}

// Close search drawer
if (searchClose) {
  searchClose.addEventListener('click', function () {
    closeSearch();
  });
}

// Close on overlay click
if (searchOverlay) {
  searchOverlay.addEventListener('click', function () {
    closeSearch();
  });
}

// Close on ESC key
document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && searchDrawer.classList.contains('active')) {
    closeSearch();
  }
});

function openSearch() {
  searchDrawer.classList.add('active');
  searchOverlay.classList.add('active');
  document.body.style.overflow = 'hidden';

  // Focus on search input
  setTimeout(() => {
    searchInput.focus();
  }, 300);
}

function closeSearch() {
  searchDrawer.classList.remove('active');
  searchOverlay.classList.remove('active');
  document.body.style.overflow = '';
  searchInput.value = '';
}

// User Icon Click - Open Login Page
const userIcon = document.querySelector('.fa-user');
if (userIcon) {
  userIcon.parentElement.addEventListener('click', function (e) {
    e.preventDefault();
    window.location.href = 'login.html';
  });
}

// Explore Now Button
const exploreBtn = document.querySelector('.btn-hero');
if (exploreBtn) {
  exploreBtn.addEventListener('click', function (e) {
    e.preventDefault();
    const shopSection = document.querySelector('#shop');
    if (shopSection) {
      shopSection.scrollIntoView({ behavior: 'smooth' });
    }
  });
}

// Shop Now Buttons in Collections
const shopNowButtons = document.querySelectorAll('.btn-collection');
shopNowButtons.forEach((button) => {
  button.addEventListener('click', function (e) {
    e.stopPropagation();
    e.preventDefault();
    const collectionName = this.parentElement.querySelector('h3').textContent;
    showNotification(`Loading ${collectionName}...`);
  });
});

// Learn More Button
const learnMoreBtn = document.querySelector('.btn-shark-tank');
if (learnMoreBtn) {
  learnMoreBtn.addEventListener('click', function (e) {
    e.preventDefault();
    showNotification('Loading our story...');
  });
}

// Parallax Effect for Hero Section
window.addEventListener('scroll', function () {
  const scrolled = window.pageYOffset;
  const heroSection = document.querySelector('.hero-section');

  if (heroSection && scrolled < window.innerHeight) {
    heroSection.style.transform = `translateY(${scrolled * 0.5}px)`;
  }
});

// Add Loading Animation
window.addEventListener('load', function () {
  document.body.classList.add('loaded');

  // Animate product cards on load
  const cards = document.querySelectorAll('.product-card, .gift-card');
  cards.forEach((card, index) => {
    setTimeout(() => {
      card.style.opacity = '1';
      card.style.transform = 'translateY(0)';
    }, index * 100);
  });
});

// Price Animation on Hover
const prices = document.querySelectorAll('.price');
prices.forEach((price) => {
  price.addEventListener('mouseenter', function () {
    this.style.transform = 'scale(1.1)';
    this.style.transition = 'transform 0.3s ease';
  });

  price.addEventListener('mouseleave', function () {
    this.style.transform = 'scale(1)';
  });
});

// Social Icons Animation
const socialIcons = document.querySelectorAll('.social-icon');
socialIcons.forEach((icon, index) => {
  icon.addEventListener('mouseenter', function () {
    this.style.transform = 'translateY(-5px) rotate(360deg)';
    this.style.transition = 'transform 0.5s ease';
  });

  icon.addEventListener('mouseleave', function () {
    this.style.transform = 'translateY(0) rotate(0deg)';
  });
});

// Hero Carousel Auto-slide Configuration
document.addEventListener('DOMContentLoaded', function () {
  const heroCarousel = document.getElementById('heroCarousel');
  if (heroCarousel && typeof bootstrap !== 'undefined') {
    const carousel = new bootstrap.Carousel(heroCarousel, {
      interval: 5000, // Auto-slide every 5 seconds
      ride: 'carousel',
      pause: 'hover', // Pause on hover
      wrap: true, // Loop continuously
    });
  }
});

// Console Welcome Message
console.log(
  '%c Welcome to JoyeSpoon! ',
  'background: linear-gradient(135deg, #D2691E, #C85A54); color: white; font-size: 20px; padding: 10px 20px; border-radius: 5px;'
);
console.log(
  '%c Discover the joy of authentic Indian mouth fresheners! ',
  'color: #D2691E; font-size: 14px; font-weight: bold;'
);

// Initialize tooltips if Bootstrap is loaded
if (typeof bootstrap !== 'undefined') {
  const tooltipTriggerList = [].slice.call(
    document.querySelectorAll('[data-bs-toggle="tooltip"]')
  );
  tooltipTriggerList.map(function (tooltipTriggerEl) {
    return new bootstrap.Tooltip(tooltipTriggerEl);
  });
}

// Initialize cart on page load
window.addEventListener('DOMContentLoaded', function () {
  loadCart();
  updateCartUI();
});
