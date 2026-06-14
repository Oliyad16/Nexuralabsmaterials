document.addEventListener('DOMContentLoaded', () => {
  // ==========================================================================
  // 1. Application State
  // ==========================================================================
  let cart = [];
  let activeCategory = 'All';
  let searchQuery = '';
  let docsQuery = '';
  let inStockOnly = false;
  let sortBy = 'featured';
  let appliedDiscount = 0; // 0.1 means 10% off

  // DOM Elements Cache
  const productsGrid = document.getElementById('productsGrid');
  const categoryList = document.getElementById('categoryList');
  const searchInput = document.getElementById('searchInput');
  const docsSearchInput = document.getElementById('docsSearchInput');
  const docsGrid = document.getElementById('docsGrid');
  const catalogInfo = document.getElementById('catalogInfo');
  const sortBySelect = document.getElementById('sortBySelect');
  
  // Cart DOM Elements
  const cartDrawer = document.getElementById('cartDrawer');
  const cartOverlay = document.getElementById('cartOverlay');
  const cartToggleBtn = document.getElementById('cartToggleBtn');
  const cartCloseBtn = document.getElementById('cartCloseBtn');
  const cartBadge = document.getElementById('cartBadge');
  const cartItemsList = document.getElementById('cartItemsList');
  const cartSubtotal = document.getElementById('cartSubtotal');
  const cartShipping = document.getElementById('cartShipping');
  const cartTax = document.getElementById('cartTax');
  const cartTotal = document.getElementById('cartTotal');
  const cartWarnings = document.getElementById('cartWarnings');
  const promoInput = document.getElementById('promoInput');
  const promoApplyBtn = document.getElementById('promoApplyBtn');
  const checkoutBtn = document.getElementById('checkoutBtn');

  // Dialogs
  const productDialog = document.getElementById('productDialog');
  const productDialogCloseBtn = document.getElementById('productDialogCloseBtn');
  const checkoutDialog = document.getElementById('checkoutDialog');
  const checkoutDialogCloseBtn = document.getElementById('checkoutDialogCloseBtn');
  const successDialog = document.getElementById('successDialog');
  const successCloseBtn = document.getElementById('successCloseBtn');
  const successDownloadInvoiceBtn = document.getElementById('successDownloadInvoiceBtn');
  const checkoutForm = document.getElementById('checkoutForm');
  const checkoutOrderTotal = document.getElementById('checkoutOrderTotal');
  const invoicePreview = document.getElementById('invoicePreview');

  // Theme Toggler Elements
  const themeToggleBtn = document.getElementById('themeToggleBtn');
  const themeDarkIcon = document.getElementById('themeDarkIcon');
  const themeLightIcon = document.getElementById('themeLightIcon');

  // ==========================================================================
  // 2. Initialization
  // ==========================================================================
  function init() {
    // Load Cart from localStorage
    const savedCart = localStorage.getItem('nexura_cart');
    if (savedCart) {
      try {
        cart = JSON.parse(savedCart);
      } catch (e) {
        cart = [];
      }
    }
    cart = cart.filter(item => PRODUCTS.some(prod => prod.id === item.productId));
    saveCart();

    // Set Theme from localStorage or preference
    const savedTheme = localStorage.getItem('nexura_theme');
    if (savedTheme === 'light' || !savedTheme) {
      document.body.classList.add('light-theme');
      themeDarkIcon.style.display = 'none';
      themeLightIcon.style.display = 'block';
      if (!savedTheme) localStorage.setItem('nexura_theme', 'light');
    }

    setupEventListeners();
    updateCategoryCounts();
    renderProducts();
    renderCart();
    renderDocs();
  }

  // ==========================================================================
  // 3. Event Listeners Setup
  // ==========================================================================
  function setupEventListeners() {
    // Search Event
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value.toLowerCase().trim();
      renderProducts();
    });

    // Documentation Search Event
    docsSearchInput.addEventListener('input', (e) => {
      docsQuery = e.target.value.toLowerCase().trim();
      renderDocs();
    });

    // Category Filter Clicks
    categoryList.addEventListener('click', (e) => {
      const item = e.target.closest('.category-item');
      if (!item) return;

      document.querySelectorAll('.category-item').forEach(el => el.classList.remove('active'));
      item.classList.add('active');
      activeCategory = item.dataset.category;
      renderProducts();
    });

    // Sort Selector Change
    sortBySelect.addEventListener('change', (e) => {
      sortBy = e.target.value;
      renderProducts();
    });

    // In Stock Only Checkbox
    document.getElementById('inStockFilter').addEventListener('change', (e) => {
      inStockOnly = e.target.checked;
      renderProducts();
    });

    // Cart Drawer Toggle Actions
    cartToggleBtn.addEventListener('click', toggleCartDrawer);
    cartCloseBtn.addEventListener('click', toggleCartDrawer);
    cartOverlay.addEventListener('click', toggleCartDrawer);

    // Apply Promo Code
    promoApplyBtn.addEventListener('click', applyPromoCode);

    // Proceed to Checkout
    checkoutBtn.addEventListener('click', openCheckout);

    // Native Dialog Closures
    productDialogCloseBtn.addEventListener('click', () => closeNativeDialog(productDialog));
    checkoutDialogCloseBtn.addEventListener('click', () => closeNativeDialog(checkoutDialog));
    successCloseBtn.addEventListener('click', () => {
      closeNativeDialog(successDialog);
      window.location.reload(); // Refresh to reset state
    });

    // Light dismiss behavior for dialogs (click on backdrop closes)
    [productDialog, checkoutDialog, successDialog].forEach(dialog => {
      dialog.addEventListener('click', (e) => {
        const rect = dialog.getBoundingClientRect();
        const isInDialog = (
          rect.top <= e.clientY &&
          e.clientY <= rect.top + rect.height &&
          rect.left <= e.clientX &&
          e.clientX <= rect.left + rect.width
        );
        if (!isInDialog) {
          closeNativeDialog(dialog);
        }
      });
    });

    // Theme Toggle Click
    themeToggleBtn.addEventListener('click', toggleTheme);

    // Checkout Form Submission
    checkoutForm.addEventListener('submit', handleCheckoutSubmit);

    // Checkout payment method toggle
    const paymentSelect = document.getElementById('checkoutPayment');
    const poGroup = document.getElementById('poFieldGroup');
    const cardGroup = document.getElementById('cardFieldGroup');
    const poInput = document.getElementById('checkoutPO');
    const cardInput = document.getElementById('checkoutCard');

    paymentSelect.addEventListener('change', (e) => {
      if (e.target.value === 'po') {
        poGroup.style.display = 'flex';
        cardGroup.style.display = 'none';
        poInput.required = true;
        cardInput.required = false;
      } else {
        poGroup.style.display = 'none';
        cardGroup.style.display = 'flex';
        poInput.required = false;
        cardInput.required = true;
      }
    });

    // Print Invoice Button
    successDownloadInvoiceBtn.addEventListener('click', () => {
      window.print();
    });
  }

  // ==========================================================================
  // 4. Products Rendering & Filtering
  // ==========================================================================
  function renderProducts() {
    // 1. Filtering
    let filtered = PRODUCTS.filter(prod => {
      // Category Match
      if (activeCategory !== 'All' && prod.category !== activeCategory) {
        return false;
      }

      // Search Match (name, tier, unit, description)
      if (searchQuery) {
        const nameMatch = prod.name.toLowerCase().includes(searchQuery);
        const tierMatch = prod.category.toLowerCase().includes(searchQuery) || prod.grade.toLowerCase().includes(searchQuery);
        const unitMatch = prod.unit.toLowerCase().includes(searchQuery);
        const descMatch = prod.description.toLowerCase().includes(searchQuery);
        if (!nameMatch && !tierMatch && !unitMatch && !descMatch) {
          return false;
        }
      }

      // Stock Match
      if (inStockOnly && prod.inStock === 0) {
        return false;
      }

      return true;
    });

    // 2. Sorting
    if (sortBy === 'price-low') {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high') {
      filtered.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating') {
      filtered.sort((a, b) => b.rating - a.rating);
    }

    // 3. Render
    catalogInfo.textContent = `Showing ${filtered.length} of ${PRODUCTS.length} products`;

    if (filtered.length === 0) {
      productsGrid.innerHTML = `
        <div class="glass-panel" style="grid-column: 1/-1; padding: 40px; text-align: center; color: var(--text-secondary);">
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="margin-bottom:16px; opacity:0.5;">
            <circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/>
          </svg>
          <h3>No kits or supplies matched your filters.</h3>
          <p style="margin-top: 8px;">Try clearing search keywords or choosing another price tier.</p>
        </div>
      `;
      return;
    }

    productsGrid.innerHTML = filtered.map(prod => {
      const ratingStars = '★'.repeat(Math.round(prod.rating)) + '☆'.repeat(5 - Math.round(prod.rating));
      const inStockBadge = prod.inStock > 0 
        ? `<span class="badge badge-green">In Stock</span>`
        : `<span class="badge badge-danger">Out of Stock</span>`;

      // Sigma-Aldrich style specifications block
      let specsHtml = '';
      if (prod.formula && prod.formula !== 'N/A' && prod.formula !== 'N/A (Glass)' && prod.formula !== 'N/A (Electrical)') {
        specsHtml += `<span>Formula: <strong>${prod.formula}</strong></span>`;
      }
      if (prod.cas && prod.cas !== 'N/A') {
        specsHtml += `<span>CAS: <strong>${prod.cas}</strong></span>`;
      }
      // Get first key specification
      const firstSpecKey = Object.keys(prod.specs)[0];
      if (firstSpecKey) {
        specsHtml += `<span>${firstSpecKey}: <strong>${prod.specs[firstSpecKey]}</strong></span>`;
      }
      
      const specsSummaryBox = specsHtml 
        ? `<div class="product-specs-summary">${specsHtml}</div>` 
        : '';

      return `
        <article class="glass-panel product-card">
          <div class="product-image-container">
            <img class="product-image" src="${prod.image}" alt="${prod.name}">
            <div class="product-badges">
              <span class="badge badge-cyan">${prod.grade}</span>
              ${inStockBadge}
            </div>
          </div>
          <div class="product-info">
            <span class="product-category">${prod.category}</span>
            <h3 class="product-name" title="${prod.name}">${prod.name}</h3>
            
            <div class="product-meta">
              <span class="product-rating">${ratingStars}</span>
              <span>(${prod.reviews} reviews)</span>
            </div>

            ${specsSummaryBox}

            <p style="font-size: 0.82rem; color: var(--text-secondary); margin-bottom: 16px; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; line-height: 1.45;">
              ${prod.description}
            </p>

            <div class="product-price-section">
              <div>
                <span class="product-price">$${prod.price.toFixed(2)}</span>
                <span class="product-unit">/ ${prod.unit}</span>
              </div>
            </div>

            <div class="product-card-actions">
              <button type="button" class="btn btn-secondary btn-quickview" data-id="${prod.id}" style="flex: 1; padding: 10px; font-size: 0.88rem;">Quick View</button>
              <button type="button" class="btn btn-primary btn-addcart" data-id="${prod.id}" style="padding: 10px 14px;" aria-label="Add to cart" ${prod.inStock === 0 ? 'disabled' : ''}>
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/>
                  <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/>
                </svg>
              </button>
            </div>
          </div>
        </article>
      `;
    }).join('');

    // Attach Dynamic Actions to Buttons
    document.querySelectorAll('.btn-quickview').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.dataset.id;
        showProductDetails(id);
      });
    });

    document.querySelectorAll('.btn-addcart').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.dataset.id;
        addToCart(id);
      });
    });
  }

  // ==========================================================================
  // 5. Category Counts Helper
  // ==========================================================================
  function updateCategoryCounts() {
    const counts = {
      All: PRODUCTS.length,
      'Entry Tier': 0,
      'Core Tier': 0,
      'Popular Tier': 0,
      'Premium Tier': 0
    };

    PRODUCTS.forEach(p => {
      if (counts[p.category] !== undefined) {
        counts[p.category]++;
      }
    });

    document.getElementById('count-All').textContent = counts.All;
    document.getElementById('count-Entry').textContent = counts['Entry Tier'];
    document.getElementById('count-Core').textContent = counts['Core Tier'];
    document.getElementById('count-Popular').textContent = counts['Popular Tier'];
    document.getElementById('count-Premium').textContent = counts['Premium Tier'];
  }

  // ==========================================================================
  // 6. Cart Drawer & Calculations Logic
  // ==========================================================================
  function toggleCartDrawer() {
    cartDrawer.classList.toggle('active');
    cartOverlay.classList.toggle('active');
  }

  function addToCart(productId, quantity = 1) {
    const prod = PRODUCTS.find(p => p.id === productId);
    if (!prod || prod.inStock === 0) return;

    const existing = cart.find(item => item.productId === productId);
    if (existing) {
      if (existing.quantity + quantity <= prod.inStock) {
        existing.quantity += quantity;
      } else {
        existing.quantity = prod.inStock;
        alert(`Cannot add more. Limited stock available (${prod.inStock} items max).`);
      }
    } else {
      cart.push({ productId, quantity });
    }

    saveCart();
    renderCart();
    animateCartIcon();

    // Auto open drawer to confirm add
    cartDrawer.classList.add('active');
    cartOverlay.classList.add('active');
  }

  function updateCartQty(productId, delta) {
    const item = cart.find(i => i.productId === productId);
    if (!item) return;

    const prod = PRODUCTS.find(p => p.id === productId);
    const newQty = item.quantity + delta;

    if (newQty <= 0) {
      removeFromCart(productId);
    } else if (newQty <= prod.inStock) {
      item.quantity = newQty;
      saveCart();
      renderCart();
    } else {
      alert(`Cannot exceed available warehouse inventory (${prod.inStock} units).`);
    }
  }

  function removeFromCart(productId) {
    cart = cart.filter(item => item.productId !== productId);
    saveCart();
    renderCart();
  }

  function saveCart() {
    localStorage.setItem('nexura_cart', JSON.stringify(cart));
  }

  function animateCartIcon() {
    cartBadge.classList.add('active');
    setTimeout(() => {
      cartBadge.classList.remove('active');
    }, 300);
  }

  function applyPromoCode() {
    const code = promoInput.value.toUpperCase().trim();
    if (code === 'NEXURA10') {
      appliedDiscount = 0.10;
      alert('Promo applied! 10% discount off laboratory materials.');
    } else {
      appliedDiscount = 0;
      alert('Invalid promo code.');
    }
    renderCart();
  }

  // Render & Calculate Cart
  function renderCart() {
    // 1. Total quantities
    const totalQty = cart.reduce((sum, item) => sum + item.quantity, 0);
    if (totalQty > 0) {
      cartBadge.textContent = totalQty;
      cartBadge.style.display = 'flex';
    } else {
      cartBadge.style.display = 'none';
    }

    if (cart.length === 0) {
      cartItemsList.innerHTML = `
        <div class="cart-empty-state">
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/>
            <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/>
          </svg>
          <p>Your research requisition cart is empty.</p>
        </div>
      `;
      cartSubtotal.textContent = '$0.00';
      cartShipping.textContent = '$0.00';
      cartTax.textContent = '$0.00';
      cartTotal.textContent = '$0.00';
      cartWarnings.innerHTML = '';
      checkoutBtn.disabled = true;
      return;
    }

    checkoutBtn.disabled = false;

    // 2. Render Items
    cartItemsList.innerHTML = cart.map(item => {
      const prod = PRODUCTS.find(p => p.id === item.productId);

      return `
        <div class="cart-item">
          <div class="cart-item-img"><img src="${prod.image}" alt="${prod.name}"></div>
          <div class="cart-item-details">
            <h4 class="cart-item-name">${prod.name}</h4>
            <div class="cart-item-price">$${prod.price.toFixed(2)} <span style="font-size:0.75rem; color:var(--text-secondary);">/ ${prod.unit}</span></div>
            <div class="cart-item-controls">
              <div class="qty-control">
                <button type="button" class="qty-btn" onclick="updateQty('${prod.id}', -1)">-</button>
                <div class="qty-val">${item.quantity}</div>
                <button type="button" class="qty-btn" onclick="updateQty('${prod.id}', 1)">+</button>
              </div>
              <button type="button" class="cart-item-remove" onclick="removeCartItem('${prod.id}')">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
                </svg>
                Remove
              </button>
            </div>
          </div>
        </div>
      `;
    }).join('');

    // 3. Incompatibilities Check
    checkProductCompatibility();

    // 4. Financial Calculations
    let subtotal = 0;
    let hasSpecialHandling = false;
    let specialHandlingCount = 0;

    cart.forEach(item => {
      const prod = PRODUCTS.find(p => p.id === item.productId);
      subtotal += prod.price * item.quantity;

    });

    // Subtotal Discount
    if (appliedDiscount > 0) {
      subtotal = subtotal * (1 - appliedDiscount);
    }

    let shippingFee = 8.50; // Standard base shipping

    const taxRate = 0.0825; // 8.25%
    const taxes = subtotal * taxRate;
    const finalTotal = subtotal + shippingFee + taxes;

    // Update DOM
    cartSubtotal.textContent = `$${subtotal.toFixed(2)}`;
    cartShipping.textContent = `$${shippingFee.toFixed(2)}`;
    cartTax.textContent = `$${taxes.toFixed(2)}`;
    cartTotal.textContent = `$${finalTotal.toFixed(2)}`;
  }

  // Compatibility checker placeholder for future product-specific rules.
  function checkProductCompatibility() {
    cartWarnings.innerHTML = '';
    const cartProductIds = cart.map(item => item.productId);

    PRODUCT_COMPATIBILITY_WARNINGS.forEach(warn => {
      const hasGroupA = warn.groupA.some(id => cartProductIds.includes(id));
      const hasGroupB = warn.groupB.some(id => cartProductIds.includes(id));

      if (hasGroupA && hasGroupB) {
        // Show Warning
        const alertBox = document.createElement('div');
        alertBox.className = `warning-box ${warn.severity}`;
        alertBox.innerHTML = `
          <h4>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/>
              <line x1="12" y1="9" x2="12" y2="13"/>
              <line x1="12" y1="17" x2="12.01" y2="17"/>
            </svg>
            ${warn.title}
          </h4>
          <p>${warn.message}</p>
        `;
        cartWarnings.appendChild(alertBox);
      }
    });
  }

  // Global triggers for inside HTML onclick
  window.updateQty = function(productId, delta) {
    updateCartQty(productId, delta);
  };

  window.removeCartItem = function(productId) {
    removeFromCart(productId);
  };

  // ==========================================================================
  // 7. Dialog Controllers (Modal Details & Forms)
  // ==========================================================================
  function showProductDetails(id) {
    const prod = PRODUCTS.find(p => p.id === id);
    if (!prod) return;

    // Cache elements
    document.getElementById('modalProductName').textContent = prod.name;
    document.getElementById('modalProductFormula').textContent = prod.formula !== 'N/A' ? `Formula: ${prod.formula}` : '';
    document.getElementById('modalProductDesc').textContent = prod.longDescription;
    document.getElementById('modalProductPrice').textContent = `$${prod.price.toFixed(2)}`;
    document.getElementById('modalProductUnit').textContent = `/ ${prod.unit}`;

    document.getElementById('modalProductImg').innerHTML = `<img src="${prod.image}" alt="${prod.name}">`;

    const badgesContainer = document.getElementById('modalProductBadges');
    badgesContainer.innerHTML = `<span class="badge badge-cyan">${prod.grade}</span>`;

    // Specifications Table
    const specsBody = document.getElementById('modalProductSpecsBody');
    specsBody.innerHTML = Object.entries(prod.specs)
      .map(([key, val]) => `<tr><th>${key}</th><td>${val}</td></tr>`)
      .join('');

    // Safety text
    document.getElementById('modalProductSafetyText').textContent = prod.safetyPrecautions;

    // Setup Add to Cart inside Modal
    const addBtn = document.getElementById('modalAddToCartBtn');
    addBtn.disabled = prod.inStock === 0;
    addBtn.textContent = prod.inStock > 0 ? 'Add to Order Requisition' : 'Temporarily Out of Stock';
    
    // Clear old listeners
    const newAddBtn = addBtn.cloneNode(true);
    addBtn.replaceWith(newAddBtn);
    
    newAddBtn.addEventListener('click', () => {
      addToCart(prod.id);
      closeNativeDialog(productDialog);
    });

    openNativeDialog(productDialog);
  }

  function openCheckout() {
    if (cart.length === 0) return;
    
    // Hide Cart Drawer
    cartDrawer.classList.remove('active');
    cartOverlay.classList.remove('active');

    // Populate Totals
    checkoutOrderTotal.textContent = cartTotal.textContent;
    openNativeDialog(checkoutDialog);
  }

  function handleCheckoutSubmit(e) {
    e.preventDefault();

    // Extract checkout parameters
    const firstName = document.getElementById('checkoutFirstName').value;
    const lastName = document.getElementById('checkoutLastName').value;
    const institution = document.getElementById('checkoutInstitution').value;
    const email = document.getElementById('checkoutEmail').value;
    const paymentMethod = document.getElementById('checkoutPayment').value;
    const poNum = document.getElementById('checkoutPO').value || 'CC-AUTH-OK';

    // Generate Invoice Summary
    const dateStr = new Date().toLocaleString();
    const orderId = 'NEX-' + Math.floor(100000 + Math.random() * 900000);

    let itemsRows = cart.map(item => {
      const prod = PRODUCTS.find(p => p.id === item.productId);
      const rowTotal = prod.price * item.quantity;
      return `<div class="invoice-item-row">
        <span>${prod.name.substring(0,25)}... x${item.quantity}</span>
        <span>$${rowTotal.toFixed(2)}</span>
      </div>`;
    }).join('');

    invoicePreview.innerHTML = `
      <div class="invoice-header">
        <span>ORDER ID: ${orderId}</span>
        <span>${dateStr.split(',')[0]}</span>
      </div>
      <div style="margin-bottom: 12px; font-size:0.8rem; line-height:1.4;">
        <strong>Authorized To:</strong> ${firstName} ${lastName}<br>
        <strong>Facility:</strong> ${institution}<br>
        <strong>Verification Email:</strong> ${email}<br>
        <strong>Account Code / Method:</strong> ${paymentMethod.toUpperCase()} (${poNum})
      </div>
      <div style="border-top: 1px dashed var(--border-color); padding-top: 12px; margin-bottom: 12px;">
        ${itemsRows}
      </div>
      <div class="invoice-footer">
        <span>Invoice Charged</span>
        <span>${cartTotal.textContent}</span>
      </div>
    `;

    closeNativeDialog(checkoutDialog);
    openNativeDialog(successDialog);

    // Wipe Cart
    cart = [];
    saveCart();
    renderCart();
  }

  // Dialog Helper Utils
  function openNativeDialog(dialog) {
    dialog.classList.remove('modal-closing');
    dialog.showModal();
  }

  function closeNativeDialog(dialog) {
    dialog.classList.add('modal-closing');
    dialog.addEventListener('animationend', function handler() {
      dialog.close();
      dialog.classList.remove('modal-closing');
      dialog.removeEventListener('animationend', handler);
    });
  }

  // ==========================================================================
  // 8. Theme Switcher Logic
  // ==========================================================================
  function toggleTheme() {
    const isLight = document.body.classList.toggle('light-theme');
    
    if (isLight) {
      themeDarkIcon.style.display = 'none';
      themeLightIcon.style.display = 'block';
      localStorage.setItem('nexura_theme', 'light');
    } else {
      themeDarkIcon.style.display = 'block';
      themeLightIcon.style.display = 'none';
      localStorage.setItem('nexura_theme', 'dark');
    }
  }

  // ==========================================================================
  // 9. Product Documentation Panel rendering
  // ==========================================================================
  function renderDocs() {
    const matchedDocs = PRODUCTS.filter(prod => {
      if (docsQuery) {
        const nameMatch = prod.name.toLowerCase().includes(docsQuery);
        const categoryMatch = prod.category.toLowerCase().includes(docsQuery);
        const gradeMatch = prod.grade.toLowerCase().includes(docsQuery);
        return nameMatch || categoryMatch || gradeMatch;
      }
      return true;
    });

    if (matchedDocs.length === 0) {
      docsGrid.innerHTML = `
        <div class="glass-panel" style="grid-column: 1/-1; padding: 20px; text-align: center; color: var(--text-secondary);">
          No product documents match your search query.
        </div>
      `;
      return;
    }

    docsGrid.innerHTML = matchedDocs.map(prod => {
      return `
        <div class="glass-panel docs-card">
          <div class="docs-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
              <polyline points="14 2 14 8 20 8" />
              <path d="M12 18v-6" />
              <path d="m9 15 3 3 3-3" />
            </svg>
          </div>
          <div class="docs-info">
            <h4>${prod.name.split(',')[0]}</h4>
            <p>${prod.category} | ${prod.grade}</p>
          </div>
          <button type="button" class="docs-download-btn" onclick="downloadProductDoc('${prod.id}')" aria-label="Download product reference for ${prod.name}">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
          </button>
        </div>
      `;
    }).join('');
  }

  window.downloadProductDoc = function(productId) {
    const prod = PRODUCTS.find(p => p.id === productId);
    if (!prod) return;

    const docContent = `========================================================================
NEXURA LABS MATERIALS PRODUCT REFERENCE
========================================================================
Product Name: ${prod.name}
Category: ${prod.category}
Configuration: ${prod.grade}
Unit: ${prod.unit}
Price: $${prod.price.toFixed(2)}

DESCRIPTION
${prod.longDescription}

SPECIFICATIONS
${Object.entries(prod.specs).map(([key, value]) => `${key}: ${value}`).join('\n')}

USE NOTES
${prod.safetyPrecautions}

========================================================================
Generated by Nexura Labs Materials. Date: ${new Date().toLocaleDateString()}
========================================================================`;

    const blob = new Blob([docContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${prod.id}_product_reference.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Launch App
  init();
});
