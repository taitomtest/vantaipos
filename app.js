const DEFAULT_PRODUCTS = [
  { id: 1, name: 'Cà phê đen đá', price: 29000, category: 'Cà phê', img: 'https://images.unsplash.com/photo-1578314675249-a6910e80a49f?w=400&q=80' },
  { id: 2, name: 'Cà phê sữa đá', price: 35000, category: 'Cà phê', img: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?w=400&q=80' },
  { id: 3, name: 'Bạc xỉu', price: 35000, category: 'Cà phê', img: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=400&q=80' },
  { id: 4, name: 'Trà sen vàng', price: 45000, category: 'Trà', img: 'https://images.unsplash.com/photo-1582667104992-0b25e791e2b5?w=400&q=80' },
  { id: 5, name: 'Trà đào cam sả', price: 49000, category: 'Trà', img: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400&q=80' },
  { id: 6, name: 'Trà sữa trân châu', price: 40000, category: 'Trà sữa', img: 'https://images.unsplash.com/photo-1622485540304-453075c3db0a?w=400&q=80' },
  { id: 7, name: 'Bánh sừng bò', price: 35000, category: 'Bánh ngọt', img: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=400&q=80' },
  { id: 8, name: 'Tiramisu', price: 45000, category: 'Bánh ngọt', img: 'https://images.unsplash.com/photo-1571115177098-24ec42ed204d?w=400&q=80' },
  { id: 9, name: 'Sinh tố bơ', price: 50000, category: 'Sinh tố', img: 'https://images.unsplash.com/photo-1601622340356-654ec47184ff?w=400&q=80' },
  { id: 10, name: 'Nước ép cam', price: 40000, category: 'Nước ép', img: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=400&q=80' },
];

// State
let categories, products, orders, carts, activeCartId, cart, currentShift, customers, users, currentUser, suppliers, deliveryPartners, cashVouchers, vouchers, purchases, tables, activityLogs;

const loadStateFromLocalStorage = () => {
  categories = JSON.parse(localStorage.getItem('kiot_categories')) || ['Cà phê', 'Trà', 'Trà sữa', 'Sinh tố', 'Nước ép', 'Bánh ngọt'];
  products = JSON.parse(localStorage.getItem('kiot_products')) || DEFAULT_PRODUCTS;
  products.forEach(p => {
    if (p.stock === undefined) p.stock = 100;
    if (p.costPrice === undefined) p.costPrice = Math.floor(p.price * 0.6);
  });
  orders = JSON.parse(localStorage.getItem('kiot_orders')) || [];
  carts = JSON.parse(localStorage.getItem('kiot_carts')) || [{ id: 1, name: 'Đơn 1', items: [] }];
  activeCartId = JSON.parse(localStorage.getItem('kiot_active_cart_id')) || carts[0].id;
  const activeCart = carts.find(x => x.id === activeCartId) || carts[0];
  activeCartId = activeCart.id;
  cart = activeCart.items;
  currentShift = JSON.parse(localStorage.getItem('kiot_shift')) || null;
  customers = JSON.parse(localStorage.getItem('kiot_customers')) || [];
  users = JSON.parse(localStorage.getItem('kiot_users')) || [
    { username: 'admin', password: '123', role: 'admin' }
  ];
  currentUser = JSON.parse(localStorage.getItem('kiot_current_user')) || null;
  suppliers = JSON.parse(localStorage.getItem('kiot_suppliers')) || [
    { id: 'NCC01', name: 'Nhà cung cấp Nguyên liệu A', phone: '0123456789', address: 'Hà Nội' }
  ];
  deliveryPartners = JSON.parse(localStorage.getItem('kiot_delivery')) || [
    { id: 'DT01', name: 'Giao hàng Nhanh', phone: '19001234' }
  ];
  cashVouchers = JSON.parse(localStorage.getItem('kiot_cashbook')) || [];
  vouchers = JSON.parse(localStorage.getItem('kiot_vouchers')) || [
    { code: 'KM20K', type: 'fixed', value: 20000, minOrder: 100000, expiry: '2027-12-31', isActive: true },
    { code: 'GIAM10', type: 'percent', value: 10, minOrder: 50000, expiry: '2027-12-31', isActive: true }
  ];
  purchases = JSON.parse(localStorage.getItem('kiot_purchases')) || [];
  tables = JSON.parse(localStorage.getItem('kiot_tables')) || [
    { id: 'T1', name: 'Bàn 1', status: 'vacant' },
    { id: 'T2', name: 'Bàn 2', status: 'vacant' },
    { id: 'T3', name: 'Bàn 3', status: 'vacant' },
    { id: 'T4', name: 'Bàn 4', status: 'vacant' },
    { id: 'T5', name: 'Bàn 5', status: 'vacant' },
    { id: 'T6', name: 'Bàn 6', status: 'vacant' },
    { id: 'T7', name: 'Bàn 7', status: 'vacant' },
    { id: 'T8', name: 'Bàn 8', status: 'vacant' },
    { id: 'VIP1', name: 'VIP 1', status: 'vacant' },
    { id: 'VIP2', name: 'VIP 2', status: 'vacant' }
  ];
  activityLogs = JSON.parse(localStorage.getItem('kiot_activity_logs')) || [];
};
loadStateFromLocalStorage();

window.switchCart = (id) => {
  activeCartId = id;
  const c = carts.find(x => x.id === activeCartId);
  cart = c.items;
  renderCartTabs();
  renderCart();
};

const syncCart = () => {
  const c = carts.find(x => x.id === activeCartId);
  if (c) c.items = cart;
};

window.addCart = () => {
  const newId = Date.now();
  carts.push({ id: newId, name: `Đơn ${carts.length + 1}`, items: [] });
  switchCart(newId);
};

window.removeCart = (id, e) => {
  if (e) e.stopPropagation();
  if (carts.length === 1) {
    cart.length = 0;
    renderCart();
    return;
  }
  if (carts.find(x => x.id === id).items.length > 0) {
    if (!confirm('Đơn này đang có sản phẩm, bạn có chắc muốn xoá?')) return;
  }
  carts = carts.filter(x => x.id !== id);
  if (activeCartId === id) {
    switchCart(carts[carts.length - 1].id);
  } else {
    renderCartTabs();
  }
};

window.renderCartTabs = () => {
  if (!DOM.cartTabs) return;
  DOM.cartTabs.innerHTML = carts.map(c => `
    <div style="padding: 6px 12px; border-radius: 6px; font-size: 0.85rem; font-weight: 500; cursor: pointer; display: flex; align-items: center; gap: 4px; white-space: nowrap; ${c.id === activeCartId ? 'background: var(--primary); color: white; border: 1px solid var(--primary);' : 'background: white; border: 1px solid var(--border); color: var(--text-main);'}" onclick="switchCart(${c.id})">
      ${c.name}
      ${carts.length > 1 ? `<span class="material-symbols-rounded" style="font-size: 14px; margin-left: 4px;" onclick="removeCart(${c.id}, event)">close</span>` : ''}
    </div>
  `).join('') + `
    <div style="padding: 6px 10px; border-radius: 6px; font-size: 0.85rem; font-weight: 500; cursor: pointer; background: var(--primary-light); border: 1px dashed var(--primary); color: var(--primary); display: flex; align-items: center; white-space: nowrap;" onclick="addCart()">
      <span class="material-symbols-rounded" style="font-size: 16px;">add</span>
    </div>
  `;
};
let activeCategory = 'Tất cả';
let searchQuery = '';

// Auto-detect server URL if loaded via http/https
const defaultSyncUrl = window.location.protocol.startsWith('http') ? window.location.origin : 'http://localhost:3000';
let syncEnabled = localStorage.getItem('kiot_sync_enabled') === null ? true : JSON.parse(localStorage.getItem('kiot_sync_enabled'));
let syncUrl = localStorage.getItem('kiot_sync_url') || defaultSyncUrl;

// Save to LocalStorage
const saveState = () => {
  localStorage.setItem('kiot_products', JSON.stringify(products));
  localStorage.setItem('kiot_orders', JSON.stringify(orders));
  localStorage.setItem('kiot_categories', JSON.stringify(categories));
  localStorage.setItem('kiot_customers', JSON.stringify(customers));
  localStorage.setItem('kiot_suppliers', JSON.stringify(suppliers));
  localStorage.setItem('kiot_delivery', JSON.stringify(deliveryPartners));
  localStorage.setItem('kiot_cashbook', JSON.stringify(cashVouchers));
  localStorage.setItem('kiot_users', JSON.stringify(users));
  localStorage.setItem('kiot_current_user', JSON.stringify(currentUser));
  if (currentShift) {
    localStorage.setItem('kiot_shift', JSON.stringify(currentShift));
  } else {
    localStorage.removeItem('kiot_shift');
  }
  localStorage.setItem('kiot_carts', JSON.stringify(carts));
  localStorage.setItem('kiot_active_cart_id', JSON.stringify(activeCartId));
  localStorage.setItem('kiot_vouchers', JSON.stringify(vouchers));
  localStorage.setItem('kiot_tables', JSON.stringify(tables));
  localStorage.setItem('kiot_activity_logs', JSON.stringify(activityLogs));
  localStorage.setItem('kiot_purchases', JSON.stringify(purchases));
  
  // Background REST Sync push if enabled
  if (syncEnabled) {
    const payload = {
      products, orders, categories, customers, suppliers, delivery: deliveryPartners,
      cashbook: cashVouchers, users, shift: currentShift,
      shift_history: JSON.parse(localStorage.getItem('kiot_shift_history')) || [],
      vouchers,
      tables,
      activity_logs: activityLogs,
      purchases,
      settings: JSON.parse(localStorage.getItem('kiot_settings')) || {}
    };
    fetch(`${syncUrl}/api/sync`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    }).catch(e => console.warn('Background sync failed:', e));
  }
};

const DOM = {
  headerTitle: document.getElementById('header-title'),
  categories: document.getElementById('categories-container'),
  productsGrid: document.getElementById('products-grid'),
  noProducts: document.getElementById('no-products'),
  cartItems: document.getElementById('cart-items'),
  cartCount: document.getElementById('cart-count'),
  cartSubtotal: document.getElementById('cart-subtotal'),
  cartTotal: document.getElementById('cart-total'),
  checkoutBtn: document.getElementById('checkout-btn'),
  clearCartBtn: document.getElementById('clear-cart-btn'),
  searchInput: document.getElementById('search-input'),
  toastContainer: document.getElementById('toast-container'),
  cartPanel: document.getElementById('cart-panel'),
  cartOverlay: document.getElementById('cart-overlay'),
  mobileCartBtn: document.getElementById('mobile-cart-btn'),
  cartCloseBtn: document.getElementById('cart-close-btn'),
  mobileCartBadge: document.getElementById('mobile-cart-badge'),
  // Views
  views: {
    pos: document.getElementById('view-pos'),
    products: document.getElementById('view-products'),
    transactions: document.getElementById('view-transactions'),
    partners: document.getElementById('view-partners'),
    cashbook: document.getElementById('view-cashbook'),
    reports: document.getElementById('view-reports'),
    settings: document.getElementById('view-settings')
  },
  // Tables (Getters for dynamic elements)
  get productsTbody() { return document.getElementById('products-tbody'); },
  set productsTbody(v) {},
  get invoicesTbody() { return document.getElementById('invoices-tbody'); },
  set invoicesTbody(v) {},
  get reportsTbody() { return document.getElementById('reports-tbody'); },
  set reportsTbody(v) {},
  get topProductsTbody() { return document.getElementById('top-products-tbody'); },
  set topProductsTbody(v) {},
  get topCustomersTbody() { return document.getElementById('top-customers-tbody'); },
  set topCustomersTbody(v) {},
  // Reports
  get reportToday() { return document.getElementById('report-today'); },
  set reportToday(v) {},
  get reportOrders() { return document.getElementById('report-orders'); },
  set reportOrders(v) {},
  // Modals
  productModal: document.getElementById('product-modal-overlay'),
  mName: document.getElementById('modal-name'),
  mSku: document.getElementById('modal-sku'),
  mCat: document.getElementById('modal-category'),
  mCostPrice: document.getElementById('modal-cost-price'),
  mStock: document.getElementById('modal-stock'),
  mPrice: document.getElementById('modal-price'),
  mImg: document.getElementById('modal-img'),
  mImgFile: document.getElementById('modal-img-file'),
  mImgPreview: document.getElementById('modal-img-preview'),
  get reportProfit() { return document.getElementById('report-profit'); },
  set reportProfit(v) {},
  
  cartTabs: document.getElementById('cart-tabs'),
  catModal: document.getElementById('category-modal-overlay'),
  catInput: document.getElementById('new-category-input'),
  catList: document.getElementById('category-list'),
  
  shiftBtnText: document.getElementById('shift-btn-text'),
  shiftHeaderBtn: document.getElementById('shift-header-btn'),
  shiftModal: document.getElementById('shift-modal-overlay'),
  shiftTitle: document.getElementById('shift-modal-title'),
  openShiftBody: document.getElementById('open-shift-body'),
  closeShiftBody: document.getElementById('close-shift-body'),
  sInitialCashInput: document.getElementById('shift-initial-cash'),
  sActualCashInput: document.getElementById('shift-actual-cash'),
  sStartTime: document.getElementById('shift-start-time'),
  sInitialDisplay: document.getElementById('shift-initial-display'),
  sCashRevenue: document.getElementById('shift-cash-revenue'),
  sExpectedCash: document.getElementById('shift-expected-cash'),
  sDiff: document.getElementById('shift-diff'),
  shiftActionBtn: document.getElementById('shift-action-btn'),
  
  checkoutModal: document.getElementById('checkout-modal-overlay'),
  cDiscount: document.getElementById('checkout-discount'),
  cVAT: document.getElementById('checkout-vat'),
  cSubtotal: document.getElementById('checkout-subtotal'),
  cDiscountVal: document.getElementById('checkout-discount-val'),
  cVATVal: document.getElementById('checkout-vat-val'),
  cTotal: document.getElementById('checkout-total'),
  qrContainer: document.getElementById('qr-code-container'),
  qrImg: document.getElementById('qr-code-img'),
  
  navCustomers: document.getElementById('nav-customers'),
  mnavPartners: document.getElementById('mnav-partners'),
  viewCustomers: document.getElementById('view-customers'),
  get customersTbody() { return document.getElementById('customers-tbody'); },
  set customersTbody(v) {},
  customerModal: document.getElementById('customer-modal-overlay'),
  cmName: document.getElementById('modal-customer-name'),
  cmPhone: document.getElementById('modal-customer-phone'),
  cmTier: document.getElementById('modal-customer-tier'),
  cmPoints: document.getElementById('modal-customer-points'),
  cmDebt: document.getElementById('modal-customer-debt'),
  checkoutCustomer: document.getElementById('checkout-customer'),
  get aiInsights() { return document.getElementById('ai-insights-container'); },
  set aiInsights(v) {},
  get cSearch() { return document.getElementById('customer-search'); },
  set cSearch(v) {},
  get cFilter() { return document.getElementById('customer-group-filter'); },
  set cFilter(v) {},
  get reportTotalDebt() { return document.getElementById('report-total-debt'); },
  set reportTotalDebt(v) {},
};

const formatPrice = (price) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
};

const showToast = (message) => {
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `<span class="material-symbols-rounded" style="color: var(--success)">check_circle</span> ${message}`;
  DOM.toastContainer.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
};

// --- View Navigation ---
const viewTitles = {
  pos: 'Bán hàng',
  products: 'Quản lý hàng hoá',
  transactions: 'Giao dịch',
  partners: 'Đối tác',
  cashbook: 'Sổ quỹ',
  reports: 'Báo cáo & Phân tích',
  settings: 'Thiết lập hệ thống'
};

window.switchView = (viewName) => {
  // Hide all views
  Object.values(DOM.views).forEach(el => el.classList.remove('active'));
  // Show selected view
  DOM.views[viewName].classList.add('active');
  
  // Update Title
  DOM.headerTitle.innerText = viewTitles[viewName];

  // Update Desktop Sidebar active state
  document.querySelectorAll('.pos-sidebar .sidebar-icon').forEach(el => el.classList.remove('active'));
  document.getElementById(`nav-${viewName}`)?.classList.add('active');

  // Update Mobile Nav active state
  document.querySelectorAll('.mobile-nav-item').forEach(el => el.classList.remove('active'));
  document.getElementById(`mnav-${viewName}`)?.classList.add('active');

  // Show/Hide Cart button & panel on non-POS views
  if (viewName !== 'pos') {
    DOM.mobileCartBtn.style.display = 'none';
    DOM.cartPanel.style.display = 'none';
  } else {
    DOM.mobileCartBtn.style.display = 'flex';
    if (window.innerWidth >= 1024) DOM.cartPanel.style.display = 'flex';
  }

  // Refresh data for the view
  if (viewName === 'products') renderProductTabContent();
  if (viewName === 'transactions') switchTransactionTab('invoice');
  if (viewName === 'partners') switchPartnerTab('customer');
  if (viewName === 'reports') switchReportTab('profit');
  if (viewName === 'pos') {
    renderProducts();
    renderCustomerTable();
  }
};

// --- POS Logic ---
const renderCategoryDropdown = () => {
  if(DOM.mCat) {
    DOM.mCat.innerHTML = categories.map(c => `<option value="${c}">${c}</option>`).join('');
  }
};

const renderCategories = () => {
  DOM.categories.innerHTML = ['Tất cả', ...categories].map(cat => `
    <button class="category-btn ${cat === activeCategory ? 'active' : ''}" onclick="setCategory('${cat}')">${cat}</button>
  `).join('');
};

window.setCategory = (cat) => {
  activeCategory = cat;
  renderCategories();
  renderProducts();
};

const renderProducts = () => {
  const filtered = products.filter(p => {
    const matchCat = activeCategory === 'Tất cả' || p.category === activeCategory;
    const matchSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  if (filtered.length === 0) {
    DOM.productsGrid.innerHTML = '';
    DOM.noProducts.style.display = 'block';
  } else {
    DOM.noProducts.style.display = 'none';
    DOM.productsGrid.innerHTML = filtered.map(product => `
      <div class="product-card" onclick="addToCart(${product.id})">
        <img src="${product.img}" alt="${product.name}" class="product-img" loading="lazy">
        <div class="product-info">
          <div class="product-title">${product.name}</div>
          <div class="product-price">${formatPrice(product.price)}</div>
        </div>
      </div>
    `).join('');
  }
};

// --- Cart Logic ---
window.addToCart = (id) => {
  const product = products.find(p => p.id === id);
  const existing = cart.find(item => item.id === id);
  
  const currentQty = existing ? existing.qty : 0;
  if (product.stock !== undefined && currentQty + 1 > product.stock) {
    alert(`Không đủ hàng! Sản phẩm này chỉ còn ${product.stock} trong kho.`);
    return;
  }
  
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ ...product, qty: 1 });
  }
  showToast(`Đã thêm ${product.name}`);
  saveState();
  renderCart();
};

window.updateQty = (id, delta) => {
  const item = cart.find(i => i.id === id);
  if (item) {
    if (delta > 0) {
      const p = products.find(x => x.id === id);
      if (p && p.stock !== undefined && item.qty + delta > p.stock) {
        alert(`Không đủ hàng! Sản phẩm này chỉ còn ${p.stock} trong kho.`);
        return;
      }
    }
    item.qty += delta;
    if (item.qty <= 0) { cart = cart.filter(i => i.id !== id); syncCart(); }
  }
  saveState();
  renderCart();
};

window.setQty = (id, val) => {
  const item = cart.find(i => i.id === id);
  if (item) {
    let q = parseInt(val);
    if (isNaN(q) || q <= 0) {
      removeItem(id);
      return;
    }
    
    const p = products.find(x => x.id === id);
    if (p && p.stock !== undefined && q > p.stock) {
      alert(`Không đủ hàng! Sản phẩm này chỉ còn ${p.stock} trong kho.`);
      q = p.stock;
      if (q <= 0) {
        removeItem(id);
        return;
      }
    }
    item.qty = q;
  }
  saveState();
  renderCart();
};

window.removeItem = (id) => {
  cart = cart.filter(i => i.id !== id);
  syncCart();
  renderCart();
};

const renderCart = () => {
  if (cart.length === 0) {
    DOM.cartItems.innerHTML = `
      <div class="empty-cart">
        <span class="material-symbols-rounded">add_shopping_cart</span>
        <p>Chưa có sản phẩm nào</p>
      </div>
    `;
    DOM.checkoutBtn.disabled = true; DOM.checkoutBtn.style.opacity = '0.5';
    DOM.clearCartBtn.disabled = true; DOM.clearCartBtn.style.opacity = '0.5';
  } else {
    DOM.checkoutBtn.disabled = false; DOM.checkoutBtn.style.opacity = '1';
    DOM.clearCartBtn.disabled = false; DOM.clearCartBtn.style.opacity = '1';
    DOM.cartItems.innerHTML = cart.map(item => `
      <div class="cart-item">
        <img src="${item.img}" alt="${item.name}" class="cart-item-img">
        <div class="cart-item-details">
          <div class="cart-item-name">${item.name}</div>
          <div class="cart-item-price">${formatPrice(item.price)}</div>
        </div>
        <div class="cart-item-actions">
          ${item.qty === 1 
            ? `<button class="qty-btn del" onclick="removeItem(${item.id})"><span class="material-symbols-rounded" style="font-size: 18px;">delete</span></button>`
            : `<button class="qty-btn" onclick="updateQty(${item.id}, -1)"><span class="material-symbols-rounded" style="font-size: 18px;">remove</span></button>`
          }
          <input type="number" class="cart-qty" value="${item.qty}" min="1" onchange="setQty(${item.id}, this.value)" onclick="this.select()">
          <button class="qty-btn" onclick="updateQty(${item.id}, 1)"><span class="material-symbols-rounded" style="font-size: 18px;">add</span></button>
        </div>
      </div>
    `).join('');
  }

  const count = cart.reduce((acc, item) => acc + item.qty, 0);
  const total = cart.reduce((acc, item) => acc + item.price * item.qty, 0);

  DOM.cartCount.innerText = `${count} món`;
  DOM.cartSubtotal.innerText = formatPrice(total);
  DOM.cartTotal.innerText = formatPrice(total);

  if (count > 0) {
    DOM.mobileCartBadge.style.display = 'flex';
    DOM.mobileCartBadge.innerText = count;
  } else {
    DOM.mobileCartBadge.style.display = 'none';
  }
};

DOM.clearCartBtn.addEventListener('click', () => {
  if (cart.length === 0) return;
  if (confirm('Bạn có chắc chắn muốn huỷ đơn hàng này?')) {
    cart = [];
    syncCart();
    renderCart();
    showToast('Đã huỷ đơn hàng');
    toggleCart(false);
  }
});

DOM.checkoutBtn.addEventListener('click', () => {
  if (cart.length === 0) return;
  openCheckoutModal();
});

let currentPaymentMethod = 'Tiền mặt';

window.openCheckoutModal = () => {
  DOM.cDiscount.value = '';
  DOM.cVAT.value = '';
  selectPaymentMethod('Tiền mặt', document.querySelector('#payment-methods button[data-method="Tiền mặt"]'));
  calculateCheckout();
  DOM.checkoutModal.style.display = 'flex';
};

window.closeCheckoutModal = () => {
  DOM.checkoutModal.style.display = 'none';
};

const generateVietQR = (amount) => {
  const settings = JSON.parse(localStorage.getItem('kiot_settings')) || {};
  const bankCode = settings.bankCode;
  const bankAcc = settings.bankAcc;
  const bankName = settings.bankName;
  
  if (bankCode && bankAcc) {
    const memo = encodeURIComponent(`Thanh toan don hang POS`);
    const accName = bankName ? encodeURIComponent(bankName) : '';
    return `https://img.vietqr.io/image/${bankCode}-${bankAcc}-compact2.jpg?amount=${amount}&addInfo=${memo}&accountName=${accName}`;
  } else {
    // Mock QR server fallback with helpful note
    return `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=ChuyenKhoan_POS_${amount}_VuiLongCauHinhNganHangTrongSettings`;
  }
};

window.selectPaymentMethod = (method, btnElement) => {
  currentPaymentMethod = method;
  document.querySelectorAll('#payment-methods button').forEach(btn => btn.classList.remove('active'));
  if (btnElement) btnElement.classList.add('active');
  
  if (method === 'Chuyển khoản') {
    DOM.qrContainer.style.display = 'flex';
    const { finalTotal } = calculateCheckout();
    DOM.qrImg.src = generateVietQR(finalTotal);
  } else {
    DOM.qrContainer.style.display = 'none';
  }
};

let appliedVoucher = null;

window.applyVoucherCode = () => {
  const input = document.getElementById('checkout-voucher');
  const status = document.getElementById('checkout-voucher-status');
  if (!input) return;
  const code = input.value.trim().toUpperCase();
  
  if (!code) {
    appliedVoucher = null;
    calculateCheckout();
    if (status) status.style.display = 'none';
    return;
  }
  
  const voucher = vouchers.find(v => v.code === code);
  const subtotal = cart.reduce((acc, item) => acc + item.price * item.qty, 0);
  
  if (!voucher) {
    appliedVoucher = null;
    calculateCheckout();
    if (status) {
      status.innerText = 'Mã voucher không tồn tại!';
      status.style.color = 'var(--danger)';
      status.style.display = 'block';
    }
    return;
  }
  
  if (!voucher.isActive) {
    appliedVoucher = null;
    calculateCheckout();
    if (status) {
      status.innerText = 'Voucher này đã bị khóa!';
      status.style.color = 'var(--danger)';
      status.style.display = 'block';
    }
    return;
  }
  
  if (new Date(voucher.expiry) < new Date()) {
    appliedVoucher = null;
    calculateCheckout();
    if (status) {
      status.innerText = 'Voucher này đã hết hạn!';
      status.style.color = 'var(--danger)';
      status.style.display = 'block';
    }
    return;
  }
  
  if (subtotal < voucher.minOrder) {
    appliedVoucher = null;
    calculateCheckout();
    if (status) {
      status.innerText = `Chưa đạt đơn hàng tối thiểu ${formatPrice(voucher.minOrder)}!`;
      status.style.color = 'var(--danger)';
      status.style.display = 'block';
    }
    return;
  }
  
  appliedVoucher = voucher;
  calculateCheckout();
  if (status) {
    status.innerText = `Áp dụng thành công Voucher ${voucher.code}!`;
    status.style.color = 'var(--success)';
    status.style.display = 'block';
  }
};

window.calculateCheckout = () => {
  const subtotal = cart.reduce((acc, item) => acc + item.price * item.qty, 0);
  DOM.cSubtotal.innerText = formatPrice(subtotal);
  
  let discount = 0;
  let dVal = DOM.cDiscount.value.trim();
  if (dVal.endsWith('%')) {
    const percent = parseFloat(dVal.replace('%', ''));
    if (!isNaN(percent)) discount = (subtotal * percent) / 100;
  } else {
    const val = parseFloat(dVal);
    if (!isNaN(val)) discount = val;
  }
  DOM.cDiscountVal.innerText = '-' + formatPrice(discount);
  
  // Voucher Discount
  let voucherDiscount = 0;
  const vRow = document.getElementById('checkout-voucher-row');
  const vCodeDisp = document.getElementById('checkout-voucher-code-display');
  const vValDisp = document.getElementById('checkout-voucher-val');
  
  if (appliedVoucher) {
    if (appliedVoucher.type === 'percent') {
      voucherDiscount = ((subtotal - discount) * appliedVoucher.value) / 100;
      if (appliedVoucher.maxDiscount && voucherDiscount > appliedVoucher.maxDiscount) {
        voucherDiscount = appliedVoucher.maxDiscount;
      }
    } else {
      voucherDiscount = appliedVoucher.value;
    }
    
    if (vRow) vRow.style.display = 'flex';
    if (vCodeDisp) vCodeDisp.innerText = appliedVoucher.code;
    if (vValDisp) vValDisp.innerText = '-' + formatPrice(voucherDiscount);
  } else {
    if (vRow) vRow.style.display = 'none';
  }
  
  let vat = 0;
  let vVal = parseFloat(DOM.cVAT.value);
  if (!isNaN(vVal)) {
    vat = ((subtotal - discount - voucherDiscount) * vVal) / 100;
  }
  
  DOM.cVATVal.innerText = '+' + formatPrice(vat);
  
  const finalTotal = subtotal - discount - voucherDiscount + vat;
  const result = finalTotal > 0 ? finalTotal : 0;
  DOM.cTotal.innerText = formatPrice(result);
  
  if (currentPaymentMethod === 'Chuyển khoản') {
    DOM.qrImg.src = generateVietQR(result);
  }
  
  return { subtotal, discount, voucherDiscount, vat, finalTotal: result };
};

window.confirmCheckout = (isProvisional) => {
  if (cart.length === 0) return;
  
  const { subtotal, discount, voucherDiscount, vat, finalTotal } = calculateCheckout();
  const totalCost = cart.reduce((acc, item) => acc + (item.costPrice || 0) * item.qty, 0);
  const count = cart.reduce((acc, item) => acc + item.qty, 0);
  
  const customerId = DOM.checkoutCustomer ? DOM.checkoutCustomer.value : '';
  const customer = customers.find(c => c.id === customerId);
  
  if (currentPaymentMethod === 'Ghi nợ' && !customer) {
    alert('Vui lòng chọn Khách hàng để ghi nợ!');
    return;
  }
  
  const newOrder = {
    id: 'HD' + Date.now().toString().slice(-6),
    date: new Date().toISOString(),
    itemsCount: count,
    subtotal: subtotal,
    discount: discount,
    voucherCode: appliedVoucher ? appliedVoucher.code : null,
    voucherDiscount: voucherDiscount || 0,
    vat: vat,
    total: finalTotal,
    totalCost: totalCost,
    profit: finalTotal - totalCost,
    paymentMethod: currentPaymentMethod,
    items: [...cart],
    isProvisional: isProvisional,
    customerId: customer ? customer.id : null,
    customerName: customer ? customer.name : null
  };
  
  if (isProvisional) {
    printInvoice(newOrder);
    return;
  }
  
  orders.unshift(newOrder);
  
  // Trừ số lượng tồn kho
  cart.forEach(cartItem => {
    const p = products.find(x => x.id === cartItem.id);
    if (p && p.stock !== undefined) {
      p.stock -= cartItem.qty;
    }
  });
  
  // Xử lý nợ và điểm cho khách hàng
  if (customer) {
    if (currentPaymentMethod === 'Ghi nợ') {
      customer.debt += finalTotal;
    } else {
      customer.points += Math.floor(finalTotal / 10000);
    }
    renderCustomerTable();
  }
  
  saveState();
  
  // Đồng bộ lại các view khác
  renderProducts(); // Cập nhật tồn kho ở màn hình bán hàng
  if (DOM.views.transactions.classList.contains('active')) renderInvoices();
  if (DOM.views.reports.classList.contains('active')) renderReports();
  
  showToast('Thanh toán thành công!');
  if (carts.length > 1) {
    carts = carts.filter(x => x.id !== activeCartId);
    activeCartId = carts[carts.length - 1].id;
    cart = carts.find(x => x.id === activeCartId).items;
    renderCartTabs();
    renderCart();
  } else {
    cart = [];
    syncCart();
    renderCart();
  }
  toggleCart(false);
  closeCheckoutModal();
  
  // Reset voucher checkout state
  appliedVoucher = null;
  const vIn = document.getElementById('checkout-voucher');
  if (vIn) vIn.value = '';
  const vStatus = document.getElementById('checkout-voucher-status');
  if (vStatus) vStatus.style.display = 'none';
  
  if (confirm('Thanh toán hoàn tất! Bạn có muốn in hoá đơn không?')) {
    printInvoice(newOrder);
  }
};

// --- Shift Management Logic ---
window.renderShiftButton = () => {
  if (!DOM.shiftBtnText) return;
  if (currentShift) {
    DOM.shiftBtnText.innerText = 'Đóng ca';
    DOM.shiftHeaderBtn.style.background = 'var(--danger)';
  } else {
    DOM.shiftBtnText.innerText = 'Mở ca';
    DOM.shiftHeaderBtn.style.background = 'var(--primary)';
  }
};

window.openShiftModal = () => {
  if (currentShift) {
    // Show Close Shift
    DOM.shiftTitle.innerText = 'Đóng ca làm việc';
    DOM.openShiftBody.style.display = 'none';
    DOM.closeShiftBody.style.display = 'block';
    DOM.shiftActionBtn.innerText = 'Đóng ca';
    DOM.shiftActionBtn.style.background = 'var(--danger)';
    
    // Calculate cash revenue during this shift
    const shiftOrders = orders.filter(o => new Date(o.date) >= new Date(currentShift.startTime));
    const cashOrders = shiftOrders.filter(o => !o.paymentMethod || o.paymentMethod === 'Tiền mặt');
    const cashRevenue = cashOrders.reduce((sum, o) => sum + (o.total || 0), 0);
    
    currentShift.cashRevenue = cashRevenue;
    currentShift.expectedCash = currentShift.initialCash + cashRevenue;
    
    DOM.sStartTime.innerText = new Date(currentShift.startTime).toLocaleString('vi-VN');
    DOM.sInitialDisplay.innerText = formatPrice(currentShift.initialCash);
    DOM.sCashRevenue.innerText = '+' + formatPrice(cashRevenue);
    DOM.sExpectedCash.innerText = formatPrice(currentShift.expectedCash);
    
    DOM.sActualCashInput.value = '';
    DOM.sDiff.innerText = '0 ₫';
    DOM.sDiff.style.color = 'inherit';
    
  } else {
    // Show Open Shift
    DOM.shiftTitle.innerText = 'Mở ca làm việc';
    DOM.openShiftBody.style.display = 'block';
    DOM.closeShiftBody.style.display = 'none';
    DOM.shiftActionBtn.innerText = 'Mở ca';
    DOM.shiftActionBtn.style.background = 'var(--primary)';
    DOM.sInitialCashInput.value = '';
  }
  DOM.shiftModal.style.display = 'flex';
};

window.closeShiftModal = () => {
  DOM.shiftModal.style.display = 'none';
};

window.calculateShiftDiff = () => {
  if (!currentShift) return;
  const actual = parseInt(DOM.sActualCashInput.value) || 0;
  const diff = actual - currentShift.expectedCash;
  DOM.sDiff.innerText = formatPrice(diff);
  if (diff < 0) {
    DOM.sDiff.style.color = 'var(--danger)';
  } else if (diff > 0) {
    DOM.sDiff.style.color = 'var(--success)';
  } else {
    DOM.sDiff.style.color = 'inherit';
  }
};

window.submitShift = () => {
  if (currentShift) {
    // Close Shift
    const actual = parseInt(DOM.sActualCashInput.value);
    if (isNaN(actual)) {
      alert('Vui lòng nhập tiền mặt kiểm đếm!');
      return;
    }
    const diff = actual - currentShift.expectedCash;
    const confirmMsg = `Bạn sắp đóng ca với mức lệch quỹ là ${formatPrice(diff)}. Xác nhận?`;
    if (!confirm(confirmMsg)) return;
    
    currentShift.endTime = new Date().toISOString();
    currentShift.actualCash = actual;
    currentShift.diff = diff;
    
    let history = JSON.parse(localStorage.getItem('kiot_shift_history')) || [];
    history.push(currentShift);
    localStorage.setItem('kiot_shift_history', JSON.stringify(history));
    
    currentShift = null;
    showToast('Đã đóng ca thành công!');
    
  } else {
    // Open Shift
    const initialCash = parseInt(DOM.sInitialCashInput.value) || 0;
    currentShift = {
      id: 'CA' + Date.now().toString().slice(-6),
      startTime: new Date().toISOString(),
      initialCash: initialCash
    };
    showToast('Đã mở ca thành công!');
  }
  
  saveState();
  renderShiftButton();
  closeShiftModal();
};

// --- Category Management Logic ---
window.openCategoryModal = () => {
  renderCategoryList();
  DOM.catModal.style.display = 'flex';
};

window.closeCategoryModal = () => {
  DOM.catModal.style.display = 'none';
};

window.addCategory = () => {
  const newCat = DOM.catInput.value.trim();
  if (newCat && !categories.includes(newCat)) {
    categories.push(newCat);
    DOM.catInput.value = '';
    saveState();
    renderCategoryList();
    renderCategories();
    renderCategoryDropdown();
    showToast('Thêm danh mục thành công!');
  } else if (categories.includes(newCat)) {
    alert('Danh mục này đã tồn tại!');
  }
};

window.deleteCategory = (cat) => {
  if (confirm(`Bạn muốn xoá danh mục "${cat}"? Các sản phẩm thuộc danh mục này vẫn sẽ giữ nguyên.`)) {
    categories = categories.filter(c => c !== cat);
    if (activeCategory === cat) activeCategory = 'Tất cả';
    saveState();
    renderCategoryList();
    renderCategories();
    renderCategoryDropdown();
    showToast('Đã xoá danh mục!');
  }
};

const renderCategoryList = () => {
  DOM.catList.innerHTML = categories.map(cat => `
    <div style="display: flex; justify-content: space-between; align-items: center; padding: 10px; background: #f9fafb; border-radius: 8px; border: 1px solid #e5e7eb;">
      <span style="font-weight: 500;">${cat}</span>
      <button class="clear-btn" style="color: var(--danger); padding: 0;" onclick="deleteCategory('${cat}')" title="Xoá danh mục">
        <span class="material-symbols-rounded">delete</span>
      </button>
    </div>
  `).join('');
};

// --- Product Management Logic ---
window.openProductModal = (id = null) => {
  DOM.mImgFile.value = '';
  if (id) {
    const p = products.find(x => x.id === id);
    DOM.mName.value = p.name;
    DOM.mSku.value = p.sku || '';
    DOM.mCostPrice.value = p.costPrice || 0;
    DOM.mPrice.value = p.price;
    DOM.mStock.value = p.stock !== undefined ? p.stock : 0;
    DOM.mCat.value = p.category;
    DOM.mImg.value = p.img;
    DOM.mImgPreview.querySelector('img').src = p.img;
    DOM.mImgPreview.style.display = p.img ? 'block' : 'none';
    DOM.productModal.dataset.editId = id;
    document.querySelector('#product-modal-overlay h3').innerText = 'Chỉnh sửa sản phẩm';
  } else {
    DOM.mName.value = '';
    DOM.mSku.value = '';
    DOM.mCostPrice.value = '';
    DOM.mPrice.value = '';
    DOM.mStock.value = '100';
    DOM.mCat.value = 'Cà phê';
    DOM.mImg.value = '';
    DOM.mImgPreview.style.display = 'none';
    DOM.productModal.dataset.editId = '';
    document.querySelector('#product-modal-overlay h3').innerText = 'Thêm sản phẩm mới';
  }
  DOM.productModal.style.display = 'flex';
};

window.closeProductModal = () => {
  DOM.productModal.style.display = 'none';
};

window.saveProduct = () => {
  const name = DOM.mName.value.trim();
  const sku = DOM.mSku.value.trim();
  const costPrice = parseInt(DOM.mCostPrice.value) || 0;
  const price = parseInt(DOM.mPrice.value);
  const stock = parseInt(DOM.mStock.value) || 0;
  const category = DOM.mCat.value;
  let img = DOM.mImg.value.trim();
  
  if (!name || isNaN(price)) {
    alert("Vui lòng nhập tên và giá bán hợp lệ!");
    return;
  }
  
  if (!img) img = 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=400&q=80'; // fallback image
  
  const editId = DOM.productModal.dataset.editId;
  
  if (editId) {
    const index = products.findIndex(p => p.id == editId);
    if (index > -1) {
      products[index] = { ...products[index], name, sku, costPrice, price, stock, category, img };
      showToast('Đã cập nhật sản phẩm!');
      
      // Update cart prices if the item is in the cart
      cart = cart.map(item => item.id == editId ? { ...item, name, costPrice, price, img } : item);
    }
  } else {
    const newProduct = {
      id: Date.now(),
      name,
      sku,
      costPrice,
      price,
      stock,
      category,
      img
    };
    products.unshift(newProduct);
    showToast('Đã thêm sản phẩm mới!');
  }
  
  saveState();
  closeProductModal();
  renderProductTable();
  renderProducts(); // refresh POS view
  renderCart(); // refresh Cart view
};

window.deleteProduct = (id) => {
  if (confirm('Bạn có chắc chắn muốn xoá sản phẩm này?')) {
    products = products.filter(p => p.id !== id);
    saveState();
    renderProductTable();
    showToast('Đã xoá sản phẩm');
  }
};

const renderProductTable = () => {
  if (products.length === 0) {
    DOM.productsTbody.innerHTML = `<tr><td colspan="5" style="text-align:center;">Chưa có sản phẩm nào</td></tr>`;
    return;
  }
  DOM.productsTbody.innerHTML = products.map(p => `
    <tr>
      <td><img src="${p.img}" style="width:40px; height:40px; border-radius:8px; object-fit:cover;"></td>
      <td style="font-weight:500;">${p.name}</td>
      <td><span style="background:var(--primary-light); color:var(--primary); padding:4px 8px; border-radius:12px; font-size:0.8rem;">${p.category}</span></td>
      <td style="font-weight:600;">${p.stock !== undefined ? p.stock : '-'}</td>
      <td style="font-weight:600;">${formatPrice(p.costPrice || 0)}</td>
      <td style="font-weight:600; color:var(--primary);">${formatPrice(p.price)}</td>
      <td style="display: flex; gap: 0.5rem;">
        <button class="clear-btn" style="padding: 0.5rem; border:none; background:transparent; color: var(--primary);" onclick="openProductModal(${p.id})" title="Chỉnh sửa">
          <span class="material-symbols-rounded" style="font-size:20px;">edit</span>
        </button>
        <button class="clear-btn" style="padding: 0.5rem; border:none; background:transparent;" onclick="deleteProduct(${p.id})" title="Xoá">
          <span class="material-symbols-rounded" style="font-size:20px;">delete</span>
        </button>
      </td>
    </tr>
  `).join('');
};

// --- Invoices Logic ---
const formatDate = (isoString) => {
  const d = new Date(isoString);
  return d.toLocaleDateString('vi-VN') + ' ' + d.toLocaleTimeString('vi-VN', {hour: '2-digit', minute:'2-digit'});
};

window.printInvoice = (order) => {
  if (!order) return;
  const printArea = document.getElementById('print-area');
  
  // Extract dynamic invoice print settings from local storage
  const settings = JSON.parse(localStorage.getItem('kiot_settings')) || {};
  const storeName = settings.storeName || "VĂN TÀI POS";
  const subtitle = settings.receiptSubtitle || "Giải Pháp Quản Lý Bán Hàng Chuyên Nghiệp";
  const address = settings.receiptAddress || "123 Đường Số 1, Phường 2, Quận 3, TP.HCM";
  const phone = settings.receiptPhone || "0901.234.567";
  const footerMessage = settings.receiptFooter || "Hẹn gặp lại quý khách lần sau";

  const itemsHtml = order.items.map(item => `
    <tr>
      <td>
        <div style="font-weight: 700;">${item.name}</div>
        <div style="font-size: 11px; color: #555;">${formatPrice(item.price)}</div>
      </td>
      <td style="text-align: center;">${item.qty}</td>
      <td style="font-weight: 600;">${formatPrice(item.price * item.qty)}</td>
    </tr>
  `).join('');

  const isProvisional = order.isProvisional;
  const title = isProvisional ? "PHIẾU TẠM TÍNH" : "HOÁ ĐƠN BÁN HÀNG";
  
  let detailsHtml = '';
  if (order.discount > 0 || order.vat > 0 || (order.voucherDiscount && order.voucherDiscount > 0)) {
    detailsHtml += `
      <div class="print-row">
        <span>Tổng tiền hàng:</span>
        <span>${formatPrice(order.subtotal || order.total)}</span>
      </div>
    `;
    if (order.discount > 0) {
      detailsHtml += `
        <div class="print-row">
          <span>Giảm trực tiếp:</span>
          <span>-${formatPrice(order.discount)}</span>
        </div>
      `;
    }
    if (order.voucherDiscount && order.voucherDiscount > 0) {
      detailsHtml += `
        <div class="print-row">
          <span>Voucher (${order.voucherCode || 'KM'}):</span>
          <span>-${formatPrice(order.voucherDiscount)}</span>
        </div>
      `;
    }
    if (order.vat > 0) {
      detailsHtml += `
        <div class="print-row">
          <span>Thuế VAT:</span>
          <span>+${formatPrice(order.vat)}</span>
        </div>
      `;
    }
  }

  printArea.innerHTML = `
    <div class="print-container">
      <div class="print-header">
        <div class="print-logo">${storeName.toUpperCase()}</div>
        <div class="print-subtitle">${subtitle}</div>
        <div style="font-size: 12px;">ĐC: ${address}</div>
        <div style="font-size: 12px;">ĐT: ${phone}</div>
        <div class="print-divider"></div>
        <div class="print-title">${title}</div>
      </div>
      
      <div class="print-info">
        <div class="print-row"><span>Số HĐ:</span> <strong>${order.id}</strong></div>
        <div class="print-row"><span>Ngày:</span> <span>${formatDate(order.date)}</span></div>
        <div class="print-row"><span>Thu ngân:</span> <span>Admin</span></div>
        ${order.customerName ? `<div class="print-row"><span>Khách hàng:</span> <strong>${order.customerName}</strong></div>` : ''}
        ${!isProvisional && order.paymentMethod ? `<div class="print-row"><span>Thanh toán:</span> <span>${order.paymentMethod}</span></div>` : ''}
      </div>

      <table class="print-table">
        <thead>
          <tr>
            <th style="text-align: left;">Sản phẩm</th>
            <th style="text-align: center;">SL</th>
            <th style="text-align: right;">T.Tiền</th>
          </tr>
        </thead>
        <tbody>
          ${itemsHtml}
        </tbody>
      </table>

      <div class="print-summary">
        ${detailsHtml}
        <div class="print-row total">
          <span>TỔNG CỘNG:</span>
          <span>${formatPrice(order.total)}</span>
        </div>
      </div>

      <div class="print-footer">
        <div class="print-thanks">${isProvisional ? "Vui lòng kiểm tra lại đơn hàng." : "CẢM ƠN QUÝ KHÁCH!"}</div>
        <div>${footerMessage}</div>
        <div class="print-barcode">*${order.id}*</div>
        <div style="font-size: 10px; margin-top: 10px; color: #888;">Cung cấp bởi vantai.vn</div>
      </div>
    </div>
  `;

  window.print();
};

window.cancelInvoice = (id) => {
  if (confirm('Bạn có chắc chắn muốn huỷ hoá đơn này?')) {
    const orderIndex = orders.findIndex(o => o.id === id);
    if (orderIndex > -1) {
      const order = orders[orderIndex];
      
      // Hoàn lại tồn kho
      order.items.forEach(cartItem => {
        const p = products.find(x => x.id === cartItem.id);
        if (p && p.stock !== undefined) {
          p.stock += cartItem.qty;
        }
      });
      
      // Hoàn lại nợ và điểm cho khách hàng
      if (order.customerId) {
        const customer = customers.find(c => c.id === order.customerId);
        if (customer) {
          if (order.paymentMethod === 'Ghi nợ') {
            customer.debt = Math.max(0, customer.debt - order.total);
          } else {
            customer.points = Math.max(0, customer.points - Math.floor(order.total / 10000));
          }
          renderCustomerTable();
        }
      }

      // Xoá hoá đơn
      orders.splice(orderIndex, 1);
      saveState();
      
      renderInvoices();
      renderReports();
      renderProductTable();
      showToast('Đã huỷ đơn, hoàn kho và cập nhật lại nợ khách!');
    }
  }
};

const renderInvoices = () => {
  if (orders.length === 0) {
    DOM.invoicesTbody.innerHTML = `<tr><td colspan="5" style="text-align:center;">Chưa có hoá đơn nào</td></tr>`;
    return;
  }
  DOM.invoicesTbody.innerHTML = orders.map(o => `
    <tr onclick="viewInvoiceDetail('${o.id}')" style="cursor: pointer;">
      <td style="font-weight:600;">${o.id}</td>
      <td>${formatDate(o.date)}</td>
      <td>${o.itemsCount}</td>
      <td style="font-weight:600; color:var(--primary);">${formatPrice(o.total)}</td>
      <td style="display: flex; gap: 0.5rem;">
        <button class="clear-btn" style="padding: 0.5rem; border:none; background:transparent; color: var(--primary);" onclick="event.stopPropagation(); printInvoice(orders.find(x => x.id === '${o.id}'))" title="In hoá đơn">
          <span class="material-symbols-rounded" style="font-size:20px;">print</span>
        </button>
        <button class="clear-btn" style="padding: 0.5rem; border:none; background:transparent;" onclick="event.stopPropagation(); cancelInvoice('${o.id}')" title="Huỷ hoá đơn">
          <span class="material-symbols-rounded" style="font-size:20px;">delete</span>
        </button>
      </td>
    </tr>
  `).join('');
};

window.viewInvoiceDetail = (id) => {
  const order = orders.find(o => o.id === id);
  if (!order) return;
  
  document.getElementById('detail-invoice-id').innerText = order.id;
  document.getElementById('detail-invoice-date').innerText = formatDate(order.date);
  document.getElementById('detail-invoice-method').innerText = order.paymentMethod || 'Tiền mặt';
  document.getElementById('detail-invoice-customer').innerText = order.customerName || 'Khách lẻ';
  
  const tbody = document.getElementById('detail-invoice-items-tbody');
  tbody.innerHTML = order.items.map(item => `
    <tr>
      <td style="font-weight: 500;">${item.name}</td>
      <td style="text-align: center;">${item.qty}</td>
      <td style="text-align: right;">${formatPrice(item.price)}</td>
      <td style="text-align: right; font-weight: 600;">${formatPrice(item.price * item.qty)}</td>
    </tr>
  `).join('');
  
  document.getElementById('detail-invoice-subtotal').innerText = formatPrice(order.subtotal || order.total);
  const discountVal = (order.discount || 0) + (order.voucherDiscount || 0);
  document.getElementById('detail-invoice-discount').innerText = '-' + formatPrice(discountVal);
  document.getElementById('detail-invoice-vat').innerText = '+' + formatPrice(order.vat || 0);
  document.getElementById('detail-invoice-total').innerText = formatPrice(order.total);
  
  const printBtn = document.getElementById('btn-print-detail-invoice');
  printBtn.onclick = () => printInvoice(order);
  
  document.getElementById('invoice-detail-modal-overlay').style.display = 'flex';
};

window.closeInvoiceDetailModal = () => {
  document.getElementById('invoice-detail-modal-overlay').style.display = 'none';
};

// --- Reports Logic ---
let reportRange = 'today';
let customStartDate = '';
let customEndDate = '';

window.setReportDateRange = (range, btn) => {
  reportRange = range;
  
  // Toggle active class on date buttons
  document.querySelectorAll('#reports-date-selectors button').forEach(el => el.classList.remove('active'));
  if (btn) btn.classList.add('active');
  
  const customDiv = document.getElementById('reports-custom-dates');
  if (range === 'custom') {
    if (customDiv) customDiv.style.display = 'flex';
    const startIn = document.getElementById('report-start-date');
    const endIn = document.getElementById('report-end-date');
    if (startIn && !startIn.value) {
      const d = new Date();
      d.setDate(d.getDate() - 7);
      startIn.value = d.toISOString().split('T')[0];
    }
    if (endIn && !endIn.value) {
      endIn.value = new Date().toISOString().split('T')[0];
    }
    updateCustomReportDates();
  } else {
    if (customDiv) customDiv.style.display = 'none';
    renderReports();
  }
};

window.updateCustomReportDates = () => {
  customStartDate = document.getElementById('report-start-date').value;
  customEndDate = document.getElementById('report-end-date').value;
  renderReports();
};

const getFilteredOrders = () => {
  const now = new Date();
  return orders.filter(o => {
    const date = new Date(o.date);
    switch (reportRange) {
      case 'today':
        return date.toLocaleDateString('vi-VN') === now.toLocaleDateString('vi-VN');
      case '7days':
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(now.getDate() - 7);
        return date >= sevenDaysAgo;
      case 'thismonth':
        return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
      case 'lastmonth':
        const lastMonth = now.getMonth() === 0 ? 11 : now.getMonth() - 1;
        const lastMonthYear = now.getMonth() === 0 ? now.getFullYear() - 1 : now.getFullYear();
        return date.getMonth() === lastMonth && date.getFullYear() === lastMonthYear;
      case 'thisyear':
        return date.getFullYear() === now.getFullYear();
      case 'custom':
        if (!customStartDate || !customEndDate) return true;
        const start = new Date(customStartDate);
        start.setHours(0, 0, 0, 0);
        const end = new Date(customEndDate);
        end.setHours(23, 59, 59, 999);
        return date >= start && date <= end;
      default:
        return true;
    }
  });
};

let revenueChartInstance = null;

const renderReports = () => {
  const todayStr = new Date().toLocaleDateString('vi-VN');
  let todayRevenue = 0;
  let todayProfit = 0;
  
  const dailyData = {};
  const productStats = {};
  const customerStats = {};
  const filteredOrders = getFilteredOrders();
  
  filteredOrders.forEach(o => {
    const dStr = new Date(o.date).toLocaleDateString('vi-VN');
    const profit = o.profit || 0;
    if (dStr === todayStr) {
      todayRevenue += o.total;
      todayProfit += profit;
    }
    
    if (!dailyData[dStr]) dailyData[dStr] = { count: 0, revenue: 0, profit: 0 };
    dailyData[dStr].count += 1;
    dailyData[dStr].revenue += o.total;
    dailyData[dStr].profit += profit;
    
    // Aggregate Top Products
    o.items.forEach(item => {
      if (!productStats[item.id]) {
        productStats[item.id] = { name: item.name, qty: 0 };
      }
      productStats[item.id].qty += item.qty;
    });
    
    // Aggregate Top Customers
    if (o.customerName) {
      if (!customerStats[o.customerId]) {
        customerStats[o.customerId] = { name: o.customerName, spend: 0 };
      }
      customerStats[o.customerId].spend += o.total;
    }
  });
  
  DOM.reportToday.innerText = formatPrice(todayRevenue);
  DOM.reportOrders.innerText = filteredOrders.length;
  if (DOM.reportProfit) DOM.reportProfit.innerText = formatPrice(todayProfit);
  
  if (DOM.reportTotalDebt) {
    const totalDebt = customers.reduce((acc, c) => acc + (c.debt || 0), 0);
    DOM.reportTotalDebt.innerText = formatPrice(totalDebt);
  }
  
  // Render Daily Table
  const sortedDays = Object.keys(dailyData).sort((a,b) => {
    const [d1, m1, y1] = a.split('/');
    const [d2, m2, y2] = b.split('/');
    return new Date(`${y2}-${m2}-${d2}`) - new Date(`${y1}-${m1}-${d1}`);
  });
  
  if (sortedDays.length === 0) {
    DOM.reportsTbody.innerHTML = `<tr><td colspan="4" style="text-align:center;">Chưa có dữ liệu báo cáo</td></tr>`;
  } else {
    DOM.reportsTbody.innerHTML = sortedDays.map(date => `
      <tr>
        <td style="font-weight:500;">${date}</td>
        <td>${dailyData[date].count} đơn</td>
        <td style="font-weight:600; color:var(--primary);">${formatPrice(dailyData[date].revenue)}</td>
        <td style="font-weight:600; color:var(--success);">${formatPrice(dailyData[date].profit)}</td>
      </tr>
    `).join('');
  }

  // Render Top Products
  const topProducts = Object.values(productStats).sort((a,b) => b.qty - a.qty).slice(0, 5);
  if (DOM.topProductsTbody) {
    DOM.topProductsTbody.innerHTML = topProducts.length ? topProducts.map(p => `
      <tr><td style="font-weight:500">${p.name}</td><td><span class="badge" style="background:var(--primary-light); color:var(--primary)">${p.qty}</span></td></tr>
    `).join('') : '<tr><td colspan="2" style="text-align:center; color:var(--text-muted)">Chưa có dữ liệu</td></tr>';
  }

  // Render Top Customers
  const topCustomers = Object.values(customerStats).sort((a,b) => b.spend - a.spend).slice(0, 5);
  if (DOM.topCustomersTbody) {
    DOM.topCustomersTbody.innerHTML = topCustomers.length ? topCustomers.map(c => `
      <tr><td style="font-weight:500">${c.name}</td><td style="font-weight:600; color:var(--primary)">${formatPrice(c.spend)}</td></tr>
    `).join('') : '<tr><td colspan="2" style="text-align:center; color:var(--text-muted)">Chưa có dữ liệu</td></tr>';
  }

  // Render Chart
  const ctx = document.getElementById('revenueChart');
  if (ctx && window.Chart) {
    const chartLabels = sortedDays.slice(0, 7).reverse();
    const chartData = chartLabels.map(d => dailyData[d].revenue);
    
    if (revenueChartInstance) {
      revenueChartInstance.destroy();
    }
    
    revenueChartInstance = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: chartLabels,
        datasets: [{
          label: 'Doanh thu',
          data: chartData,
          backgroundColor: '#0a66c2',
          borderRadius: 6
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: false }
        },
        scales: {
          y: { beginAtZero: true }
        }
      }
    });
  }
  
  renderAIInsights(productStats);
};

window.renderAIInsights = (productStats) => {
  if (!DOM.aiInsights) return;
  
  const allProductIds = products.map(p => p.id);
  const soldProductIds = Object.keys(productStats).map(Number);
  
  // 1. Best Sellers (Top 3)
  const bestSellers = Object.values(productStats)
    .sort((a, b) => b.qty - a.qty)
    .slice(0, 3);

  // 2. Slow Sellers (Ế - No sales or very low sales)
  // Products not in soldProductIds or qty < 2
  const slowSellers = products
    .filter(p => !productStats[p.id] || productStats[p.id].qty < 2)
    .slice(0, 3);

  // 3. Overstock (Tồn lâu - High stock and low sales)
  const overstock = products
    .filter(p => p.stock > 50 && (!productStats[p.id] || productStats[p.id].qty < 5))
    .sort((a, b) => b.stock - a.stock)
    .slice(0, 3);

  let html = `
    <!-- Best Sellers -->
    <div style="background: rgba(34, 197, 94, 0.1); border-left: 4px solid #22c55e; padding: 1rem; border-radius: 8px;">
      <h4 style="color: #4ade80; margin-top: 0; margin-bottom: 0.5rem; display: flex; align-items: center; gap: 5px;">
        <span class="material-symbols-rounded">trending_up</span> Bán chạy nhất
      </h4>
      <div style="font-size: 0.9rem; opacity: 0.9;">
        ${bestSellers.length ? bestSellers.map(p => `• <strong>${p.name}</strong> (${p.qty} món)`).join('<br>') : 'Chưa có đủ dữ liệu'}
      </div>
      <p style="font-size: 0.75rem; margin-top: 10px; color: #a7f3d0;">Gợi ý: Cân nhắc nhập thêm hàng hoặc tạo combo.</p>
    </div>

    <!-- Slow Sellers -->
    <div style="background: rgba(239, 68, 68, 0.1); border-left: 4px solid #ef4444; padding: 1rem; border-radius: 8px;">
      <h4 style="color: #f87171; margin-top: 0; margin-bottom: 0.5rem; display: flex; align-items: center; gap: 5px;">
        <span class="material-symbols-rounded">sentiment_dissatisfied</span> Mặt hàng bán chậm
      </h4>
      <div style="font-size: 0.9rem; opacity: 0.9;">
        ${slowSellers.length ? slowSellers.map(p => `• <strong>${p.name}</strong>`).join('<br>') : 'Mọi mặt hàng đều bán tốt'}
      </div>
      <p style="font-size: 0.75rem; margin-top: 10px; color: #fca5a5;">Gợi ý: Chạy chương trình giảm giá hoặc tặng kèm.</p>
    </div>

    <!-- Overstock -->
    <div style="background: rgba(245, 158, 11, 0.1); border-left: 4px solid #f59e0b; padding: 1rem; border-radius: 8px;">
      <h4 style="color: #fbbf24; margin-top: 0; margin-bottom: 0.5rem; display: flex; align-items: center; gap: 5px;">
        <span class="material-symbols-rounded">inventory</span> Tồn kho cao (Ế lâu)
      </h4>
      <div style="font-size: 0.9rem; opacity: 0.9;">
        ${overstock.length ? overstock.map(p => `• <strong>${p.name}</strong> (Tồn: ${p.stock})`).join('<br>') : 'Tồn kho đang ở mức an toàn'}
      </div>
      <p style="font-size: 0.75rem; margin-top: 10px; color: #fde68a;">Gợi ý: Hạn chế nhập thêm, xả hàng để thu hồi vốn.</p>
    </div>
  `;
  
  DOM.aiInsights.innerHTML = html;
};

window.exportCSV = () => {
  let csvContent = "data:text/csv;charset=utf-8,\uFEFF";
  csvContent += "Ma HD,Ngay Tao,So Luong Mon,Doanh Thu,Loi Nhuan,Khach Hang\n";
  
  getFilteredOrders().forEach(o => {
    const date = new Date(o.date).toLocaleString('vi-VN');
    const itemsCount = o.itemsCount || 0;
    const total = o.total || 0;
    const profit = o.profit || 0;
    const customer = o.customerName || "Khach le";
    csvContent += `"${o.id}","${date}",${itemsCount},${total},${profit},"${customer}"\n`;
  });
  
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", `baocao_doanhthu_${new Date().getTime()}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// Event Listeners for UI
DOM.mImgFile.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (event) => {
      DOM.mImg.value = event.target.result;
      DOM.mImgPreview.querySelector('img').src = event.target.result;
      DOM.mImgPreview.style.display = 'block';
    };
    reader.readAsDataURL(file);
  }
});

DOM.searchInput.addEventListener('input', (e) => {
  searchQuery = e.target.value;
  renderProducts();
});

DOM.searchInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    const query = e.target.value.trim();
    if (!query) return;
    
    // Look for exact SKU match
    const p = products.find(x => x.sku && x.sku.toLowerCase() === query.toLowerCase());
    if (p) {
      addToCart(p.id);
      e.target.value = '';
      searchQuery = '';
      renderProducts();
    }
  }
});

const toggleCart = (show) => {
  if (show) {
    DOM.cartPanel.classList.add('open');
    DOM.cartOverlay.classList.add('open');
  } else {
    DOM.cartPanel.classList.remove('open');
    DOM.cartOverlay.classList.remove('open');
  }
};

DOM.mobileCartBtn.addEventListener('click', () => toggleCart(true));
DOM.cartCloseBtn.addEventListener('click', () => toggleCart(false));
DOM.cartOverlay.addEventListener('click', () => toggleCart(false));

// --- Customer Management Logic ---
window.renderCustomerTable = () => {
  if (!DOM.customersTbody) return;
  
  const sQuery = DOM.cSearch ? DOM.cSearch.value.toLowerCase() : '';
  const gFilter = DOM.cFilter ? DOM.cFilter.value : 'Tất cả';
  
  const filtered = customers.filter(c => {
    const nameMatch = c.name.toLowerCase().includes(sQuery);
    const phoneMatch = c.phone && c.phone.includes(sQuery);
    const groupMatch = gFilter === 'Tất cả' || c.tier === gFilter;
    return (nameMatch || phoneMatch) && groupMatch;
  });

  DOM.customersTbody.innerHTML = filtered.map(c => `
    <tr>
      <td style="font-weight: 600;">${c.id}</td>
      <td style="font-weight: 500;">${c.name}</td>
      <td>${c.phone || '-'}</td>
      <td><span class="badge" style="background: ${c.tier === 'VIP' ? 'var(--warning)' : (c.tier === 'Đại lý' ? 'var(--success)' : 'var(--border)')}; color: ${c.tier === 'Thành viên' ? 'var(--text-main)' : 'white'}">${c.tier}</span></td>
      <td>
        <div style="font-size: 0.85rem">Điểm: <span style="font-weight:600; color:var(--primary)">${c.points}</span></div>
        ${c.debt > 0 ? `<div style="font-size: 0.85rem">Nợ: <span style="font-weight:600; color:var(--danger)">${formatPrice(c.debt)}</span></div>` : '<div style="font-size: 0.85rem; color: var(--text-muted)">Không có nợ</div>'}
      </td>
      <td style="display: flex; gap: 0.5rem;">
        <button class="qty-btn" onclick="openCustomerModal('${c.id}')" title="Sửa"><span class="material-symbols-rounded" style="font-size: 16px;">edit</span></button>
        ${c.debt > 0 ? `<button class="qty-btn" style="background: var(--success-light); color: var(--success);" onclick="payDebt('${c.id}')" title="Trả nợ"><span class="material-symbols-rounded" style="font-size: 16px;">payments</span></button>` : ''}
        <button class="qty-btn" style="background: var(--danger-light); color: var(--danger);" onclick="deleteCustomer('${c.id}')" title="Xoá"><span class="material-symbols-rounded" style="font-size: 16px;">delete</span></button>
      </td>
    </tr>
  `).join('');
  
  if (DOM.checkoutCustomer) {
    const selected = DOM.checkoutCustomer.value;
    DOM.checkoutCustomer.innerHTML = '<option value="">-- Khách lẻ --</option>' + customers.map(c => `
      <option value="${c.id}">${c.name} - ${c.phone} (${c.tier})</option>
    `).join('');
    DOM.checkoutCustomer.value = selected;
  }
};

window.payDebt = (id) => {
  const c = customers.find(x => x.id === id);
  if (!c) return;
  
  const amount = prompt(`Khách hàng ${c.name} đang nợ ${formatPrice(c.debt)}. Nhập số tiền khách trả:`, c.debt);
  if (amount === null) return;
  
  const pay = parseInt(amount);
  if (isNaN(pay) || pay <= 0) {
    alert('Số tiền không hợp lệ!');
    return;
  }
  
  c.debt = Math.max(0, c.debt - pay);
  saveState();
  renderCustomerTable();
  if (DOM.views.reports.classList.contains('active')) renderReports();
  showToast(`Đã thu ${formatPrice(pay)} tiền nợ từ ${c.name}`);
};

window.openCustomerModal = (id = null) => {
  if (id && typeof id === 'string') {
    const c = customers.find(x => x.id === id);
    if (c) {
      DOM.cmName.value = c.name;
      DOM.cmPhone.value = c.phone || '';
      DOM.cmTier.value = c.tier || 'Thành viên';
      DOM.cmPoints.value = c.points || 0;
      DOM.cmDebt.value = c.debt || 0;
      DOM.customerModal.dataset.editId = id;
      document.getElementById('customer-modal-title').innerText = 'Chỉnh sửa Khách hàng';
    }
  } else {
    DOM.cmName.value = '';
    DOM.cmPhone.value = '';
    DOM.cmTier.value = 'Thành viên';
    DOM.cmPoints.value = 0;
    DOM.cmDebt.value = 0;
    DOM.customerModal.dataset.editId = '';
    document.getElementById('customer-modal-title').innerText = 'Thêm Khách hàng mới';
  }
  DOM.customerModal.style.display = 'flex';
};

window.closeCustomerModal = () => {
  DOM.customerModal.style.display = 'none';
};

window.saveCustomer = () => {
  const name = DOM.cmName.value.trim();
  const phone = DOM.cmPhone.value.trim();
  const tier = DOM.cmTier.value;
  const points = parseInt(DOM.cmPoints.value) || 0;
  const debt = parseInt(DOM.cmDebt.value) || 0;
  
  if (!name) {
    alert("Vui lòng nhập tên khách hàng!");
    return;
  }
  
  const editId = DOM.customerModal.dataset.editId;
  if (editId) {
    const idx = customers.findIndex(c => c.id === editId);
    if (idx > -1) {
      customers[idx] = { ...customers[idx], name, phone, tier, points, debt };
    }
  } else {
    customers.push({
      id: 'KH' + Date.now().toString().slice(-4),
      name,
      phone,
      tier,
      points,
      debt
    });
  }
  
  saveState();
  renderCustomerTable();
  if (DOM.views.reports.classList.contains('active')) renderReports();
  closeCustomerModal();
  showToast('Đã lưu thông tin khách hàng!');
};

window.deleteCustomer = (id) => {
  if (confirm('Bạn có chắc chắn muốn xoá khách hàng này?')) {
    customers = customers.filter(c => c.id !== id);
    saveState();
    renderCustomerTable();
    showToast('Đã xoá khách hàng');
  }
};

// Responsive check for resizing
window.addEventListener('resize', () => {
  if (window.innerWidth >= 1024) {
    if (DOM.views.pos.classList.contains('active')) {
      DOM.cartPanel.style.display = 'flex';
    }
  } else {
    DOM.cartPanel.style.display = 'flex'; 
  }
});

// --- Settings & Backup Logic ---
window.saveSettings = () => {
  const storeName = document.getElementById('setting-store-name').value;
  const branchName = document.getElementById('setting-branch-name').value;
  
  const bankCode = document.getElementById('setting-bank-code').value;
  const bankAcc = document.getElementById('setting-bank-acc').value.trim();
  const bankName = document.getElementById('setting-bank-name').value.toUpperCase().trim();
  
  const receiptSubtitle = document.getElementById('setting-receipt-subtitle').value;
  const receiptAddress = document.getElementById('setting-receipt-address').value;
  const receiptPhone = document.getElementById('setting-receipt-phone').value;
  const receiptFooter = document.getElementById('setting-receipt-footer').value;
  
  const prevSettings = JSON.parse(localStorage.getItem('kiot_settings')) || {};
  const themeColor = prevSettings.themeColor || 'indigo';

  localStorage.setItem('kiot_settings', JSON.stringify({
    storeName,
    branchName,
    bankCode,
    bankAcc,
    bankName,
    receiptSubtitle,
    receiptAddress,
    receiptPhone,
    receiptFooter,
    themeColor
  }));
  
  // Update header/sidebar brands dynamically in UI
  const sidebarBrand = document.querySelector('.sidebar-brand h2');
  if (sidebarBrand) sidebarBrand.innerText = storeName.toUpperCase();
  
  showToast('Đã lưu cài đặt thành công!');
};

window.saveGeminiKey = () => {
  const keyInput = document.getElementById('setting-gemini-key');
  if (keyInput) {
    const key = keyInput.value.trim();
    localStorage.setItem('kiot_gemini_key', key);
    showToast('Đã lưu Gemini API Key thành công!');
  }
};

const THEMES = {
  indigo: { primary: '#4F46E5', hover: '#4338CA', light: '#EEF2FF', darkLight: 'rgba(79, 70, 229, 0.25)' },
  teal: { primary: '#0D9488', hover: '#0F766E', light: '#F0FDFA', darkLight: 'rgba(13, 148, 136, 0.25)' },
  emerald: { primary: '#10B981', hover: '#059669', light: '#ECFDF5', darkLight: 'rgba(16, 185, 129, 0.25)' },
  blue: { primary: '#0A66C2', hover: '#00509E', light: '#F0F7FF', darkLight: 'rgba(10, 102, 194, 0.25)' },
  orange: { primary: '#F97316', hover: '#EA580C', light: '#FFF7ED', darkLight: 'rgba(249, 115, 22, 0.25)' },
  rose: { primary: '#F43F5E', hover: '#E11D48', light: '#FFF1F2', darkLight: 'rgba(244, 63, 94, 0.25)' }
};

window.toggleDarkMode = () => {
  const isDark = document.body.classList.toggle('dark-mode');
  localStorage.setItem('kiot_dark_mode', JSON.stringify(isDark));
  
  const icon = document.getElementById('dark-mode-icon');
  const text = document.getElementById('dark-mode-text');
  const btn = document.getElementById('settings-dark-mode-btn');
  
  if (isDark) {
    if (icon) icon.innerText = 'light_mode';
    if (text) text.innerText = 'Chế độ sáng';
    if (btn) btn.innerHTML = '<span class="material-symbols-rounded">light_mode</span> Tắt';
  } else {
    if (icon) icon.innerText = 'dark_mode';
    if (text) text.innerText = 'Chế độ tối';
    if (btn) btn.innerHTML = '<span class="material-symbols-rounded">dark_mode</span> Bật';
  }
  
  // Re-apply primary light for the theme when dark mode is toggled
  const settings = JSON.parse(localStorage.getItem('kiot_settings')) || {};
  const currentTheme = settings.themeColor || 'indigo';
  const theme = THEMES[currentTheme];
  if (theme) {
    document.documentElement.style.setProperty('--primary-light', isDark ? theme.darkLight : theme.light);
  }
};

window.changeThemeColor = (colorName) => {
  const theme = THEMES[colorName];
  if (!theme) return;
  
  // Update document root CSS variables
  document.documentElement.style.setProperty('--primary', theme.primary);
  document.documentElement.style.setProperty('--primary-hover', theme.hover);
  
  const isDark = document.body.classList.contains('dark-mode');
  document.documentElement.style.setProperty('--primary-light', isDark ? theme.darkLight : theme.light);
  
  // Toggle active styling on UI selector buttons
  document.querySelectorAll('#settings-theme-picker .theme-dot').forEach(el => {
    el.classList.remove('active');
  });
  const activeDot = document.querySelector(`#settings-theme-picker .theme-dot[data-theme="${colorName}"]`);
  if (activeDot) activeDot.classList.add('active');
  
  // Update theme setting
  const settings = JSON.parse(localStorage.getItem('kiot_settings')) || {};
  settings.themeColor = colorName;
  localStorage.setItem('kiot_settings', JSON.stringify(settings));
  
  showToast(`Đã đổi màu chủ đạo sang ${colorName.toUpperCase()}`);
};

window.exportAllData = () => {
  const data = {
    products,
    orders,
    categories,
    customers,
    settings: JSON.parse(localStorage.getItem('kiot_settings'))
  };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `vt_pos_backup_${new Date().getTime()}.json`;
  link.click();
  showToast('Đã xuất file lưu trữ!');
};

window.importAllData = (event) => {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const data = JSON.parse(e.target.result);
      if (confirm('Khôi phục dữ liệu sẽ ghi đè lên dữ liệu hiện tại. Bạn có chắc chắn?')) {
        if (data.products) products = data.products;
        if (data.orders) orders = data.orders;
        if (data.categories) categories = data.categories;
        if (data.customers) customers = data.customers;
        if (data.settings) {
          localStorage.setItem('kiot_settings', JSON.stringify(data.settings));
        }
        saveState();
        location.reload();
      }
    } catch (err) {
      alert('File không hợp lệ!');
    }
  };
  reader.readAsText(file);
};

window.renderUserTable = () => {
  const tbody = document.getElementById('users-tbody');
  if (!tbody) return;
  tbody.innerHTML = users.map(u => `
    <tr>
      <td style="font-weight: 500;">${u.username}</td>
      <td><span class="badge" style="background: var(--primary-light); color: var(--primary);">${u.role}</span></td>
      <td>
        ${u.role !== 'admin' ? `<button class="qty-btn" style="background: var(--danger-light); color: var(--danger);" onclick="deleteUser('${u.username}')"><span class="material-symbols-rounded" style="font-size: 16px;">delete</span></button>` : '<span style="color:var(--text-muted); font-size:0.8rem">Gốc</span>'}
      </td>
    </tr>
  `).join('');
};

window.addUser = () => {
  const nameIn = document.getElementById('new-user-name');
  const passIn = document.getElementById('new-user-pass');
  const name = nameIn.value.trim();
  const pass = passIn.value.trim();
  
  if (!name || !pass) {
    alert('Vui lòng nhập đủ tên và mật khẩu!');
    return;
  }
  
  if (users.find(u => u.username === name)) {
    alert('Tên đăng nhập đã tồn tại!');
    return;
  }
  
  users.push({ username: name, password: pass, role: 'staff' });
  saveState();
  renderUserTable();
  nameIn.value = '';
  passIn.value = '';
  showToast('Đã thêm tài khoản mới!');
};

window.deleteUser = (username) => {
  if (confirm(`Bạn có chắc muốn xoá tài khoản ${username}?`)) {
    users = users.filter(u => u.username !== username);
    saveState();
    renderUserTable();
    showToast('Đã xoá tài khoản');
  }
};

window.changePassword = () => {
  const newPassEl = document.getElementById('change-pass-input');
  const newPass = newPassEl.value.trim();
  
  if (!newPass) {
    alert('Vui lòng nhập mật khẩu mới!');
    return;
  }
  
  if (confirm('Bạn có chắc chắn muốn đổi mật khẩu?')) {
    // Update in users array
    const userIndex = users.findIndex(u => u.username === currentUser.username);
    if (userIndex !== -1) {
      users[userIndex].password = newPass;
      currentUser.password = newPass;
      saveState();
      newPassEl.value = '';
      showToast('Đổi mật khẩu thành công!');
    }
  }
};

// --- Authentication Logic ---
const checkAuth = () => {
  const loginScreen = document.getElementById('login-screen');
  const appLayout = document.getElementById('app-layout');
  if (!currentUser) {
    loginScreen.style.display = 'flex';
    appLayout.style.display = 'none';
  } else {
    loginScreen.style.display = 'none';
    appLayout.style.display = 'flex';
  }
};

window.handleLogin = async () => {
  const userIn = document.getElementById('login-username').value.trim();
  const passIn = document.getElementById('login-password').value.trim();
  const errorEl = document.getElementById('login-error');
  
  // Pull latest users and database from server before login validation
  await initAppSync();
  
  const user = users.find(u => u.username === userIn && u.password === passIn);
  if (user) {
    currentUser = user;
    saveState();
    
    // Show Welcome Transition
    const welcome = document.getElementById('welcome-screen');
    const login = document.getElementById('login-screen');
    login.style.display = 'none';
    welcome.style.display = 'flex';
    
    setTimeout(() => {
      welcome.classList.add('fade-out');
      setTimeout(() => {
        welcome.style.display = 'none';
        welcome.classList.remove('fade-out');
        checkAuth();
        showToast(`Chào mừng trở lại, ${user.username}!`);
      }, 800);
    }, 2500);
  } else {
    errorEl.style.display = 'block';
  }
};

window.handleLogout = () => {
  if (confirm('Bạn có chắc muốn đăng xuất?')) {
    currentUser = null;
    saveState();
    location.reload();
  }
};

// --- Keyboard Shortcuts & Helpers ---
const handleEnterKey = (containerId, callback) => {
  const container = document.getElementById(containerId);
  if (!container) return;
  
  const inputs = container.querySelectorAll('input, select');
  inputs.forEach(input => {
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        callback();
      }
    });
  });
};

const initEnterKeys = () => {
  handleEnterKey('login-screen', handleLogin);
  handleEnterKey('product-modal-overlay', saveProduct);
  handleEnterKey('customer-modal-overlay', saveCustomer);
  handleEnterKey('category-modal-overlay', addCategory);
  handleEnterKey('shift-modal-overlay', submitShift);
  handleEnterKey('cash-modal-overlay', saveCashVoucher);
  handleEnterKey('partner-modal-overlay', savePartner);
  
  // Settings Enter
  handleEnterKey('view-settings', saveSettings);
};

// Init
const initializeApp = async () => {
  await initAppSync();

  checkAuth();

  let savedSettings = {};
  try {
    const settingsStr = localStorage.getItem('kiot_settings');
    if (settingsStr) {
      if (settingsStr.trim().startsWith('{')) {
        savedSettings = JSON.parse(settingsStr) || {};
      } else {
        // Legacy support for plain-string store name
        savedSettings = { storeName: settingsStr };
      }
    }
  } catch (e) {
    console.warn("Failed to parse kiot_settings, using defaults.", e);
  }

  const getEl = (id) => document.getElementById(id);
  if (getEl('setting-store-name')) getEl('setting-store-name').value = savedSettings.storeName || 'Văn Tài POS';
  if (getEl('setting-branch-name')) getEl('setting-branch-name').value = savedSettings.branchName || 'Chi nhánh 1';

  if (getEl('setting-bank-code')) getEl('setting-bank-code').value = savedSettings.bankCode || '';
  if (getEl('setting-bank-acc')) getEl('setting-bank-acc').value = savedSettings.bankAcc || '';
  if (getEl('setting-bank-name')) getEl('setting-bank-name').value = savedSettings.bankName || '';

  if (getEl('setting-receipt-subtitle')) getEl('setting-receipt-subtitle').value = savedSettings.receiptSubtitle || 'Giải Pháp Quản Lý Bán Hàng Chuyên Nghiệp';
  if (getEl('setting-receipt-address')) getEl('setting-receipt-address').value = savedSettings.receiptAddress || '123 Đường Số 1, Phường 2, Quận 3, TP.HCM';
  if (getEl('setting-receipt-phone')) getEl('setting-receipt-phone').value = savedSettings.receiptPhone || '0901.234.567';
  if (getEl('setting-receipt-footer')) getEl('setting-receipt-footer').value = savedSettings.receiptFooter || 'Hẹn gặp lại quý khách lần sau';
  if (getEl('setting-gemini-key')) getEl('setting-gemini-key').value = localStorage.getItem('kiot_gemini_key') || '';

  if (savedSettings.storeName) {
    const sidebarBrand = document.querySelector('.sidebar-brand h2');
    if (sidebarBrand) sidebarBrand.innerText = savedSettings.storeName.toUpperCase();
  }
  renderShiftButton();
  renderCustomerTable();
  renderCartTabs();
  renderCategoryDropdown();
  renderCategories();
  renderProducts();
  renderProductTable();
  renderUserTable();

  // Apply Dark Mode
  let isDarkModeEnabled = false;
  try {
    const dmVal = localStorage.getItem('kiot_dark_mode');
    if (dmVal) {
      isDarkModeEnabled = JSON.parse(dmVal);
    }
  } catch (e) {
    isDarkModeEnabled = localStorage.getItem('kiot_dark_mode') === 'true';
  }

  if (isDarkModeEnabled) {
    document.body.classList.add('dark-mode');
    const icon = document.getElementById('dark-mode-icon');
    const text = document.getElementById('dark-mode-text');
    const btn = document.getElementById('settings-dark-mode-btn');
    if (icon) icon.innerText = 'light_mode';
    if (text) text.innerText = 'Chế độ sáng';
    if (btn) btn.innerHTML = '<span class="material-symbols-rounded">light_mode</span> Tắt';
  }

  // Apply Brand Theme Color
  const savedTheme = savedSettings.themeColor || 'indigo';
  const themeObj = THEMES[savedTheme];
  if (themeObj) {
    document.documentElement.style.setProperty('--primary', themeObj.primary);
    document.documentElement.style.setProperty('--primary-hover', themeObj.hover);
    const isDark = document.body.classList.contains('dark-mode');
    document.documentElement.style.setProperty('--primary-light', isDark ? themeObj.darkLight : themeObj.light);
    
    // Highlighting active dot indicator in Settings UI
    setTimeout(() => {
      document.querySelectorAll('#settings-theme-picker .theme-dot').forEach(el => {
        el.classList.remove('active');
      });
      const activeDot = document.querySelector(`#settings-theme-picker .theme-dot[data-theme="${savedTheme}"]`);
      if (activeDot) activeDot.classList.add('active');
    }, 100);
  }
};
initializeApp();

let currentProductTab = 'list';
window.switchProductTab = (tab) => {
  currentProductTab = tab;
  
  // Update Tab UI
  document.querySelectorAll('.tab-item').forEach(el => {
    el.classList.remove('active');
    el.style.color = 'var(--text-muted)';
    el.style.borderBottom = 'none';
    el.style.fontWeight = '500';
  });
  
  const activeTab = document.getElementById(`tab-p-${tab}`);
  if (activeTab) {
    activeTab.classList.add('active');
    activeTab.style.color = 'var(--primary)';
    activeTab.style.borderBottom = '3px solid var(--primary)';
    activeTab.style.fontWeight = '600';
  }
  
  renderProductTabContent();
};

window.renderProductTabContent = () => {
  const container = document.getElementById('product-tab-content');
  if (!container) return;
  
  if (currentProductTab === 'list') {
    container.innerHTML = `
      <div class="table-container">
        <table class="data-table">
          <thead>
            <tr>
              <th>Ảnh</th>
              <th>Tên sản phẩm</th>
              <th>Danh mục</th>
              <th>Tồn kho</th>
              <th>Giá nhập</th>
              <th>Giá bán</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody id="products-tbody"></tbody>
        </table>
      </div>
    `;
    renderProductTable();
  } else if (currentProductTab === 'price') {
    container.innerHTML = `
      <div class="table-container">
        <table class="data-table">
          <thead>
            <tr>
              <th>Tên sản phẩm</th>
              <th>Giá nhập</th>
              <th>Giá bán</th>
              <th>Lợi nhuận</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            ${products.map(p => `
              <tr>
                <td style="font-weight: 500;">${p.name}</td>
                <td><input type="number" value="${p.costPrice}" class="form-input" style="width: 120px; padding: 4px 8px;" onchange="updateProductPrice(${p.id}, 'costPrice', this.value)"></td>
                <td><input type="number" value="${p.price}" class="form-input" style="width: 120px; padding: 4px 8px;" onchange="updateProductPrice(${p.id}, 'price', this.value)"></td>
                <td style="color: var(--success); font-weight: 600;">${formatPrice(p.price - p.costPrice)}</td>
                <td><button class="primary-btn" style="padding: 4px 10px; font-size: 0.8rem;" onclick="saveProductPrice(${p.id})">Lưu</button></td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  } else if (currentProductTab === 'stock') {
    container.innerHTML = `
      <div class="table-container">
        <table class="data-table">
          <thead>
            <tr>
              <th>Tên sản phẩm</th>
              <th>Tồn kho</th>
              <th>Trạng thái</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            ${products.map(p => `
              <tr>
                <td style="font-weight: 500;">${p.name}</td>
                <td style="font-weight: 600; color: ${p.stock < 10 ? 'var(--danger)' : 'var(--text-main)'}">${p.stock}</td>
                <td>
                  ${p.stock < 10 ? '<span class="badge" style="background: var(--danger-light); color: var(--danger);">Sắp hết hàng</span>' : '<span class="badge" style="background: var(--success-light); color: var(--success);">Đủ hàng</span>'}
                </td>
                <td><button class="qty-btn" onclick="switchView('products'); openProductModal(${p.id});"><span class="material-symbols-rounded" style="font-size: 16px;">add_box</span> Nhập hàng</button></td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  } else if (currentProductTab === 'audit') {
    container.innerHTML = `
      <div style="background: var(--bg-color); padding: 1.5rem; border-radius: 8px; margin-bottom: 1.5rem;">
        <h4 style="margin-top: 0;">Phiếu kiểm kho mới</h4>
        <p style="font-size: 0.9rem; color: var(--text-muted); margin-bottom: 1rem;">Nhập số lượng thực tế để hệ thống tự động cân đối.</p>
        <div class="table-container" style="background: white;">
          <table class="data-table">
            <thead>
              <tr>
                <th>Tên sản phẩm</th>
                <th>Tồn hệ thống</th>
                <th>Thực tế</th>
                <th>Chênh lệch</th>
              </tr>
            </thead>
            <tbody>
              ${products.map(p => `
                <tr>
                  <td>${p.name}</td>
                  <td id="audit-sys-${p.id}">${p.stock}</td>
                  <td><input type="number" class="form-input" style="width: 80px; padding: 4px 8px;" oninput="calculateAuditDiff(${p.id}, this.value)"></td>
                  <td id="audit-diff-${p.id}" style="font-weight: 600;">0</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
        <div style="margin-top: 1.5rem; display: flex; justify-content: flex-end;">
          <button class="primary-btn" onclick="submitAudit()">Xác nhận kiểm kho</button>
        </div>
      </div>
    `;
  } else if (currentProductTab === 'voucher') {
    container.innerHTML = `
      <div style="display: grid; grid-template-columns: 1fr 2fr; gap: 1.5rem; align-items: start;">
        <!-- Left: Create Voucher -->
        <div style="background: white; padding: 1.5rem; border-radius: var(--radius-lg); box-shadow: var(--shadow-sm);">
          <h4 style="margin-top: 0; margin-bottom: 1rem;">Tạo Voucher mới</h4>
          <div class="form-group" style="margin-bottom: 1rem;">
            <label>Mã Voucher (Chữ HOA không dấu)</label>
            <input type="text" id="v-code" class="form-input" style="padding-left: 10px; width: 100%; height: 38px; border-radius: 8px; border: 1px solid var(--border);" placeholder="VD: TET2026">
          </div>
          <div class="form-group" style="margin-bottom: 1rem; display: flex; gap: 1rem;">
            <div style="flex: 1;">
              <label>Loại giảm giá</label>
              <select id="v-type" class="form-input" style="padding-left: 10px; width: 100%; height: 38px; border-radius: 8px; border: 1px solid var(--border);">
                <option value="fixed">Số tiền cố định (đ)</option>
                <option value="percent">Tỉ lệ phần trăm (%)</option>
              </select>
            </div>
            <div style="flex: 1;">
              <label>Mức giảm</label>
              <input type="number" id="v-value" class="form-input" style="padding-left: 10px; width: 100%; height: 38px; border-radius: 8px; border: 1px solid var(--border);" placeholder="Vd: 20000 hoặc 10">
            </div>
          </div>
          <div class="form-group" style="margin-bottom: 1rem; display: flex; gap: 1rem;">
            <div style="flex: 1;">
              <label>Đơn tối thiểu (đ)</label>
              <input type="number" id="v-min" class="form-input" style="padding-left: 10px; width: 100%; height: 38px; border-radius: 8px; border: 1px solid var(--border);" value="0">
            </div>
            <div style="flex: 1;">
              <label>Giảm tối đa (đ)</label>
              <input type="number" id="v-max" class="form-input" style="padding-left: 10px; width: 100%; height: 38px; border-radius: 8px; border: 1px solid var(--border);" value="100000">
            </div>
          </div>
          <div class="form-group" style="margin-bottom: 1.5rem;">
            <label>Ngày hết hạn</label>
            <input type="date" id="v-expiry" class="form-input" style="padding-left: 10px; width: 100%; height: 38px; border-radius: 8px; border: 1px solid var(--border);">
          </div>
          <button class="primary-btn" style="width: 100%; justify-content: center; padding: 10px; border-radius: 8px;" onclick="createNewVoucher()">Tạo mã</button>
        </div>
        
        <!-- Right: List Vouchers -->
        <div style="background: white; padding: 1.5rem; border-radius: var(--radius-lg); box-shadow: var(--shadow-sm);">
          <h4 style="margin-top: 0; margin-bottom: 1rem;">Danh sách Voucher đang chạy</h4>
          <div id="voucher-list-container" style="display: flex; flex-direction: column; gap: 10px; max-height: 400px; overflow-y: auto; padding-right: 5px;">
            <!-- Rendered via JS -->
          </div>
        </div>
      </div>
    `;
    
    // Set default expiry date to 1 month from now
    const nextMonth = new Date();
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    const dateInput = document.getElementById('v-expiry');
    if (dateInput) dateInput.value = nextMonth.toISOString().split('T')[0];
    
    renderVouchersList();
  }
};

window.updateProductPrice = (id, field, value) => {
  const p = products.find(x => x.id === id);
  if (p) p[field] = parseInt(value) || 0;
};

window.saveProductPrice = (id) => {
  saveState();
  showToast('Đã cập nhật giá sản phẩm');
  renderProductTabContent();
};

window.calculateAuditDiff = (id, actual) => {
  const sys = parseInt(document.getElementById(`audit-sys-${id}`).innerText);
  const diff = (parseInt(actual) || 0) - sys;
  const diffEl = document.getElementById(`audit-diff-${id}`);
  diffEl.innerText = diff > 0 ? `+${diff}` : diff;
  diffEl.style.color = diff === 0 ? 'var(--text-muted)' : (diff > 0 ? 'var(--success)' : 'var(--danger)');
  diffEl.dataset.actual = actual;
};

window.submitAudit = () => {
  if (!confirm('Hệ thống sẽ cập nhật lại toàn bộ tồn kho dựa trên số liệu thực tế. Tiếp tục?')) return;
  products.forEach(p => {
    const diffEl = document.getElementById(`audit-diff-${p.id}`);
    if (diffEl && diffEl.dataset.actual !== undefined) {
      const actual = parseInt(diffEl.dataset.actual);
      if (!isNaN(actual)) p.stock = actual;
    }
  });
  saveState();
  renderProducts();
  switchProductTab('stock');
  showToast('Đã cân bằng kho thành công!');
};

// --- Transaction Tab Logic ---
window.switchTransactionTab = (tab) => {
  document.querySelectorAll('#view-transactions .tab-item').forEach(el => {
    el.style.borderBottom = 'none';
    el.style.color = 'var(--text-muted)';
    el.style.fontWeight = '500';
  });
  const activeTab = document.getElementById(`tab-t-${tab}`);
  if (activeTab) {
    activeTab.style.borderBottom = '3px solid var(--primary)';
    activeTab.style.color = 'var(--primary)';
    activeTab.style.fontWeight = '600';
  }
  
  const container = document.getElementById('transaction-tab-content');
  if (tab === 'invoice') {
    container.innerHTML = `
      <div class="table-container">
        <table class="data-table">
          <thead><tr><th>Mã HĐ</th><th>Thời gian</th><th>Số lượng</th><th>Tổng tiền</th><th>Thao tác</th></tr></thead>
          <tbody id="invoices-tbody"></tbody>
        </table>
      </div>
    `;
    renderInvoices();
  } else {
    const draftCarts = carts.filter(c => c.items.length > 0);
    if (draftCarts.length === 0) {
      container.innerHTML = `<div style="text-align: center; padding: 3rem; opacity: 0.5;">Danh sách Đơn đặt hàng (đang mở) trống.</div>`;
    } else {
      container.innerHTML = `
        <div class="table-container">
          <table class="data-table">
            <thead><tr><th>Tên đơn</th><th>Sản phẩm</th><th>Tổng tiền</th><th>Thao tác</th></tr></thead>
            <tbody>
              ${draftCarts.map(c => {
                const total = c.items.reduce((sum, item) => sum + item.price * item.qty, 0);
                const itemsList = c.items.map(i => `${i.name} (x${i.qty})`).join(', ');
                return `
                  <tr>
                    <td style="font-weight: 600;">${c.name}</td>
                    <td style="font-size: 0.85rem; max-width: 300px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;" title="${itemsList}">${itemsList}</td>
                    <td style="font-weight: 600; color: var(--primary);">${formatPrice(total)}</td>
                    <td>
                      <button class="primary-btn" style="padding: 4px 10px; font-size: 0.8rem;" onclick="switchView('pos'); switchCart(${c.id});">Mở đơn</button>
                      <button class="clear-btn" style="color: var(--danger); margin-left: 8px;" onclick="removeCart(${c.id})">Xoá</button>
                    </td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </div>
      `;
    }
  }
};

// --- Partner Tab Logic ---
window.switchPartnerTab = (tab) => {
  document.querySelectorAll('#view-partners .tab-item').forEach(el => {
    el.style.borderBottom = 'none';
    el.style.color = 'var(--text-muted)';
    el.style.fontWeight = '500';
  });
  const activeTab = document.getElementById(`tab-pt-${tab}`);
  if (activeTab) {
    activeTab.style.borderBottom = '3px solid var(--primary)';
    activeTab.style.color = 'var(--primary)';
    activeTab.style.fontWeight = '600';
  }
  
  const container = document.getElementById('partner-tab-content');
  const addBtn = document.getElementById('partner-add-btn');
  addBtn.onclick = () => openPartnerModal(tab);
  
  if (tab === 'customer') {
    container.innerHTML = `
      <div style="display: flex; gap: 10px; margin-bottom: 1rem;">
        <div class="input-wrapper" style="width: 250px;">
          <span class="material-symbols-rounded">search</span>
          <input type="text" id="customer-search" class="form-input" placeholder="Tìm tên/SĐT..." oninput="renderCustomerTable()">
        </div>
        <select id="customer-group-filter" class="form-input" style="width: 150px;" onchange="renderCustomerTable()">
          <option value="Tất cả">Tất cả nhóm</option>
          <option value="Thành viên">Thành viên</option><option value="VIP">VIP</option><option value="Đại lý">Đại lý</option>
        </select>
      </div>
      <div class="table-container">
        <table class="data-table">
          <thead><tr><th>Mã KH</th><th>Tên khách hàng</th><th>SĐT</th><th>Phân hạng</th><th>Điểm/Nợ</th><th>Thao tác</th></tr></thead>
          <tbody id="customers-tbody"></tbody>
        </table>
      </div>
    `;
    DOM.cSearch = document.getElementById('customer-search');
    DOM.cFilter = document.getElementById('customer-group-filter');
    DOM.customersTbody = document.getElementById('customers-tbody');
    renderCustomerTable();
  } else if (tab === 'supplier') {
    container.innerHTML = `
      <div class="table-container">
        <table class="data-table">
          <thead><tr><th>Mã NCC</th><th>Tên nhà cung cấp</th><th>SĐT</th><th>Địa chỉ</th><th>Thao tác</th></tr></thead>
          <tbody>
            ${suppliers.map(s => `
              <tr>
                <td>${s.id}</td>
                <td style="font-weight: 600;">${s.name}</td>
                <td>${s.phone}</td>
                <td>${s.address}</td>
                <td><button class="clear-btn" style="color: var(--danger);" onclick="deletePartner('supplier', '${s.id}')">Xoá</button></td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  } else if (tab === 'delivery') {
    container.innerHTML = `
      <div class="table-container">
        <table class="data-table">
          <thead><tr><th>Mã ĐT</th><th>Tên đối tác</th><th>SĐT</th><th>Thao tác</th></tr></thead>
          <tbody>
            ${deliveryPartners.map(d => `
              <tr>
                <td>${d.id}</td>
                <td style="font-weight: 600;">${d.name}</td>
                <td>${d.phone}</td>
                <td><button class="clear-btn" style="color: var(--danger);" onclick="deletePartner('delivery', '${d.id}')">Xoá</button></td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  }
};

// --- Cashbook Tab Logic ---
window.switchCashTab = (tab) => {
  document.querySelectorAll('#view-cashbook .tab-item').forEach(el => {
    el.style.borderBottom = 'none';
    el.style.color = 'var(--text-muted)';
    el.style.fontWeight = '500';
  });
  const activeTab = document.getElementById(`tab-c-${tab}`);
  if (activeTab) {
    activeTab.style.borderBottom = '3px solid var(--primary)';
    activeTab.style.color = 'var(--primary)';
    activeTab.style.fontWeight = '600';
  }
  
  const container = document.getElementById('cash-tab-content');
  const totalIn = cashVouchers.filter(v => v.type === 'Thu').reduce((sum, v) => sum + v.amount, 0);
  const totalOut = cashVouchers.filter(v => v.type === 'Chi').reduce((sum, v) => sum + v.amount, 0);
  
  if (tab === 'receipt' || tab === 'payment') {
    const type = tab === 'receipt' ? 'Thu' : 'Chi';
    const list = cashVouchers.filter(v => v.type === type);
    container.innerHTML = `
      <div class="table-container">
        <table class="data-table">
          <thead><tr><th>Thời gian</th><th>Mô tả</th><th>Số tiền</th></tr></thead>
          <tbody>
            ${list.map(v => `
              <tr>
                <td>${new Date(v.date).toLocaleString()}</td>
                <td>${v.note}</td>
                <td style="font-weight: 600; color: ${v.type === 'Thu' ? 'var(--success)' : 'var(--danger)'}">${v.type === 'Thu' ? '+' : '-'}${formatPrice(v.amount)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  } else if (tab === 'fund') {
    container.innerHTML = `
      <div class="report-cards" style="grid-template-columns: repeat(3, 1fr); margin-bottom: 2rem;">
        <div class="report-card"><h3>Tổng thu</h3><div class="report-value" style="color: var(--success);">+${formatPrice(totalIn)}</div></div>
        <div class="report-card"><h3>Tổng chi</h3><div class="report-value" style="color: var(--danger);">${formatPrice(totalOut)}</div></div>
        <div class="report-card"><h3>Tồn quỹ hiện tại</h3><div class="report-value" style="color: var(--primary);">${formatPrice(totalIn - totalOut)}</div></div>
      </div>
      <h4 style="margin-bottom: 1rem;">Lịch sử quỹ gần đây</h4>
      <div class="table-container">
        <table class="data-table">
          <thead><tr><th>Thời gian</th><th>Loại</th><th>Nội dung</th><th>Số tiền</th></tr></thead>
          <tbody>
            ${cashVouchers.slice(0, 10).map(v => `
              <tr>
                <td>${new Date(v.date).toLocaleString()}</td>
                <td><span class="badge" style="background: ${v.type === 'Thu' ? 'var(--success-light)' : 'var(--danger-light)'}; color: ${v.type === 'Thu' ? 'var(--success)' : 'var(--danger)'}">${v.type}</span></td>
                <td>${v.note}</td>
                <td style="font-weight: 600;">${formatPrice(v.amount)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  }
};

// --- Report Tab Logic ---
window.switchReportTab = (tab) => {
  document.querySelectorAll('#view-reports .tab-item').forEach(el => {
    el.style.borderBottom = 'none';
    el.style.color = 'var(--text-muted)';
    el.style.fontWeight = '500';
  });
  const activeTab = document.getElementById(`tab-r-${tab}`);
  if (activeTab) {
    activeTab.style.borderBottom = '3px solid var(--primary)';
    activeTab.style.color = 'var(--primary)';
    activeTab.style.fontWeight = '600';
  }
  
  const container = document.getElementById('report-tab-content');
  if (tab === 'profit') {
    container.innerHTML = `
      <div class="report-cards">
        <div class="report-card"><h3>Doanh thu hôm nay</h3><div class="report-value" id="report-today">0 ₫</div></div>
        <div class="report-card"><h3>Tổng số đơn</h3><div class="report-value" id="report-orders">0</div></div>
        <div class="report-card"><h3>Lợi nhuận hôm nay</h3><div class="report-value" id="report-profit" style="color: var(--success);">0 ₫</div></div>
        <div class="report-card"><h3>Tổng nợ khách hàng</h3><div class="report-value" id="report-total-debt" style="color: var(--danger);">0 ₫</div></div>
      </div>
      <div id="ai-insights-container"></div>
      <div style="background: white; padding: 1.5rem; border-radius: var(--radius-lg); box-shadow: var(--shadow-sm); margin-top: 1.5rem;">
        <canvas id="revenueChart" height="80"></canvas>
      </div>
      <h3 style="margin-top: 2rem; margin-bottom: 1rem;">Doanh thu chi tiết theo ngày</h3>
      <div class="table-container">
        <table class="data-table">
          <thead>
            <tr>
              <th>Ngày</th>
              <th>Số đơn</th>
              <th>Doanh thu</th>
              <th>Lợi nhuận</th>
            </tr>
          </thead>
          <tbody id="reports-tbody"></tbody>
        </table>
      </div>
    `;
    DOM.reportToday = document.getElementById('report-today');
    DOM.reportOrders = document.getElementById('report-orders');
    DOM.reportProfit = document.getElementById('report-profit');
    DOM.reportTotalDebt = document.getElementById('report-total-debt');
    DOM.aiInsights = document.getElementById('ai-insights-container');
    DOM.reportsTbody = document.getElementById('reports-tbody');
    renderReports();
  } else if (tab === 'group') {
    renderGroupReport(container);
  } else if (tab === 'endday') {
    renderEndDayReport(container);
  } else if (tab === 'stock') {
    renderStockReport(container);
  } else if (tab === 'debt') {
    renderDebtReport(container);
  }
};

const renderGroupReport = (container) => {
  const catStats = {};
  categories.forEach(cat => catStats[cat] = { qty: 0, revenue: 0, profit: 0 });
  
  getFilteredOrders().forEach(o => {
    o.items.forEach(item => {
      if (catStats[item.category]) {
        catStats[item.category].qty += item.qty;
        catStats[item.category].revenue += item.price * item.qty;
        catStats[item.category].profit += (item.price - (item.costPrice || 0)) * item.qty;
      }
    });
  });

  container.innerHTML = `
    <h3 style="margin-bottom: 1rem;">Báo cáo theo nhóm hàng</h3>
    <div class="table-container">
      <table class="data-table">
        <thead>
          <tr>
            <th>Tên nhóm</th>
            <th>Số lượng bán</th>
            <th>Doanh thu</th>
            <th>Lợi nhuận</th>
          </tr>
        </thead>
        <tbody>
          ${Object.keys(catStats).map(cat => `
            <tr>
              <td style="font-weight: 600;">${cat}</td>
              <td>${catStats[cat].qty}</td>
              <td style="font-weight: 600; color: var(--primary);">${formatPrice(catStats[cat].revenue)}</td>
              <td style="font-weight: 600; color: var(--success);">${formatPrice(catStats[cat].profit)}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;
};

const renderEndDayReport = (container) => {
  const today = new Date().toLocaleDateString('vi-VN');
  const todayOrders = orders.filter(o => new Date(o.date).toLocaleDateString('vi-VN') === today);
  
  const cashTotal = todayOrders.filter(o => o.paymentMethod === 'Tiền mặt').reduce((s, o) => s + o.total, 0);
  const transferTotal = todayOrders.filter(o => o.paymentMethod === 'Chuyển khoản').reduce((s, o) => s + o.total, 0);
  const debtTotal = todayOrders.filter(o => o.paymentMethod === 'Ghi nợ').reduce((s, o) => s + o.total, 0);
  
  const totalRevenue = todayOrders.reduce((s, o) => s + o.total, 0);
  
  container.innerHTML = `
    <h3 style="margin-bottom: 1rem;">Tổng kết cuối ngày (${today})</h3>
    <div class="report-cards" style="grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));">
      <div class="report-card"><h3>Tiền mặt</h3><div class="report-value">${formatPrice(cashTotal)}</div></div>
      <div class="report-card"><h3>Chuyển khoản</h3><div class="report-value">${formatPrice(transferTotal)}</div></div>
      <div class="report-card"><h3>Ghi nợ</h3><div class="report-value" style="color: var(--danger);">${formatPrice(debtTotal)}</div></div>
      <div class="report-card"><h3>Tổng doanh thu</h3><div class="report-value" style="color: var(--primary);">${formatPrice(totalRevenue)}</div></div>
    </div>
    
    <h4 style="margin-top: 2rem; margin-bottom: 1rem;">Ca làm việc trong ngày</h4>
    <div class="table-container">
      <table class="data-table">
        <thead>
          <tr>
            <th>Mã ca</th>
            <th>Bắt đầu</th>
            <th>Kết thúc</th>
            <th>Tiền đầu ca</th>
            <th>Doanh thu TM</th>
            <th>Thực tế</th>
            <th>Lệch</th>
          </tr>
        </thead>
        <tbody>
          ${(JSON.parse(localStorage.getItem('kiot_shift_history')) || [])
            .filter(s => new Date(s.startTime).toLocaleDateString('vi-VN') === today)
            .map(s => `
            <tr>
              <td>${s.id}</td>
              <td>${new Date(s.startTime).toLocaleTimeString()}</td>
              <td>${s.endTime ? new Date(s.endTime).toLocaleTimeString() : '<span style="color:var(--success)">Đang mở</span>'}</td>
              <td>${formatPrice(s.initialCash)}</td>
              <td>${formatPrice(s.cashRevenue || 0)}</td>
              <td>${s.actualCash ? formatPrice(s.actualCash) : '-'}</td>
              <td style="color: ${s.diff < 0 ? 'var(--danger)' : (s.diff > 0 ? 'var(--success)' : 'inherit')}">${s.diff !== undefined ? formatPrice(s.diff) : '-'}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;
};

const renderStockReport = (container) => {
  const totalStockValue = products.reduce((s, p) => s + (p.stock || 0) * (p.costPrice || 0), 0);
  const potentialRevenue = products.reduce((s, p) => s + (p.stock || 0) * p.price, 0);
  
  container.innerHTML = `
    <h3 style="margin-bottom: 1rem;">Báo cáo kho hàng</h3>
    <div class="report-cards" style="grid-template-columns: 1fr 1fr;">
      <div class="report-card"><h3>Tổng giá trị kho (Giá nhập)</h3><div class="report-value">${formatPrice(totalStockValue)}</div></div>
      <div class="report-card"><h3>Giá trị kỳ vọng (Giá bán)</h3><div class="report-value" style="color: var(--primary);">${formatPrice(potentialRevenue)}</div></div>
    </div>
    
    <div class="table-container" style="margin-top: 1.5rem;">
      <table class="data-table">
        <thead>
          <tr>
            <th>Tên sản phẩm</th>
            <th>Tồn kho</th>
            <th>Đơn giá nhập</th>
            <th>Giá trị tồn</th>
          </tr>
        </thead>
        <tbody>
          ${products.map(p => `
            <tr>
              <td style="font-weight: 500;">${p.name}</td>
              <td>${p.stock}</td>
              <td>${formatPrice(p.costPrice || 0)}</td>
              <td style="font-weight: 600;">${formatPrice((p.stock || 0) * (p.costPrice || 0))}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;
};

const renderDebtReport = (container) => {
  const debtCustomers = customers.filter(c => c.debt > 0);
  const totalDebt = debtCustomers.reduce((s, c) => s + c.debt, 0);
  
  container.innerHTML = `
    <h3 style="margin-bottom: 1rem;">Báo cáo công nợ khách hàng</h3>
    <div class="report-card" style="margin-bottom: 1.5rem; max-width: 400px;">
      <h3>Tổng nợ chưa thu</h3>
      <div class="report-value" style="color: var(--danger);">${formatPrice(totalDebt)}</div>
    </div>
    
    <div class="table-container">
      <table class="data-table">
        <thead>
          <tr>
            <th>Khách hàng</th>
            <th>SĐT</th>
            <th>Số nợ</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          ${debtCustomers.length ? debtCustomers.map(c => `
            <tr>
              <td style="font-weight: 600;">${c.name}</td>
              <td>${c.phone}</td>
              <td style="font-weight: 600; color: var(--danger);">${formatPrice(c.debt)}</td>
              <td><button class="primary-btn" style="padding: 4px 10px; font-size: 0.8rem;" onclick="payDebt('${c.id}')">Thu nợ</button></td>
            </tr>
          `).join('') : '<tr><td colspan="4" style="text-align:center; padding: 2rem; opacity: 0.5;">Không có khách hàng nào đang nợ.</td></tr>'}
        </tbody>
      </table>
    </div>
  `;
};


// --- Modal Actions ---
window.openCashModal = () => {
  document.getElementById('modal-cash-amount').value = '';
  document.getElementById('modal-cash-note').value = '';
  document.getElementById('cash-modal-overlay').style.display = 'flex';
};
window.closeCashModal = () => document.getElementById('cash-modal-overlay').style.display = 'none';

window.saveCashVoucher = () => {
  const type = document.getElementById('modal-cash-type').value;
  const amount = parseInt(document.getElementById('modal-cash-amount').value);
  const note = document.getElementById('modal-cash-note').value;
  
  if (!amount || amount <= 0) return alert('Vui lòng nhập số tiền hợp lệ');
  
  cashVouchers.unshift({ date: new Date().toISOString(), type, amount, note });
  saveState();
  closeCashModal();
  switchCashTab('fund');
  showToast('Đã lưu phiếu thu/chi!');
};

window.openPartnerModal = (type) => {
  document.getElementById('modal-partner-type').value = type;
  document.getElementById('modal-partner-name').value = '';
  document.getElementById('modal-partner-phone').value = '';
  document.getElementById('modal-partner-address').value = '';
  document.getElementById('partner-modal-title').innerText = type === 'supplier' ? 'Nhà cung cấp mới' : 'Đối tác giao hàng mới';
  document.getElementById('partner-address-group').style.display = type === 'supplier' ? 'block' : 'none';
  document.getElementById('partner-modal-overlay').style.display = 'flex';
};
window.closePartnerModal = () => document.getElementById('partner-modal-overlay').style.display = 'none';

window.savePartner = () => {
  const type = document.getElementById('modal-partner-type').value;
  const name = document.getElementById('modal-partner-name').value;
  const phone = document.getElementById('modal-partner-phone').value;
  const address = document.getElementById('modal-partner-address').value;
  
  if (!name) return alert('Vui lòng nhập tên đối tác');
  
  const partner = { id: (type === 'supplier' ? 'NCC' : 'DT') + Date.now().toString().slice(-4), name, phone, address };
  if (type === 'supplier') suppliers.push(partner);
  else deliveryPartners.push(partner);
  
  saveState();
  closePartnerModal();
  switchPartnerTab(type);
  showToast('Đã lưu thông tin đối tác!');
};

window.deletePartner = (type, id) => {
  if (!confirm('Bạn có chắc chắn muốn xoá đối tác này?')) return;
  if (type === 'supplier') suppliers = suppliers.filter(s => s.id !== id);
  else deliveryPartners = deliveryPartners.filter(d => d.id !== id);
  saveState();
  switchPartnerTab(type);
};

// ========================================================
// 📷 1. CAMERA BARCODE SCANNER LOGIC (html5-qrcode)
// ========================================================
let html5QrScanner = null;
let continuousScan = true;

window.openScannerModal = () => {
  document.getElementById('scanner-modal-overlay').style.display = 'flex';
  
  if (window.Html5Qrcode) {
    html5QrScanner = new Html5Qrcode("barcode-reader");
    const config = { fps: 15, qrbox: { width: 280, height: 120 } };
    
    html5QrScanner.start(
      { facingMode: "environment" }, // use back camera on mobile
      config,
      onScanSuccess,
      onScanFailure
    ).catch(err => {
      console.error("Camera scan start error:", err);
      alert("Không thể khởi động camera! Vui lòng cấp quyền camera cho trình duyệt.");
      closeScannerModal();
    });
  } else {
    alert("Thư viện quét mã vạch đang tải, vui lòng thử lại sau!");
  }
};

window.closeScannerModal = () => {
  document.getElementById('scanner-modal-overlay').style.display = 'none';
  if (html5QrScanner) {
    html5QrScanner.stop().then(() => {
      html5QrScanner = null;
    }).catch(err => {
      console.warn("Failed to stop scanner cleanly:", err);
      html5QrScanner = null;
    });
  }
};

window.toggleContinuousScan = () => {
  continuousScan = !continuousScan;
  const btn = document.getElementById('btn-scan-mode');
  if (btn) {
    btn.innerText = continuousScan ? 'Quét liên tục: BẬT' : 'Quét liên tục: TẮT';
    btn.style.background = continuousScan ? 'var(--primary)' : 'var(--border)';
    btn.style.color = continuousScan ? 'white' : 'var(--text-main)';
  }
};

const onScanSuccess = (decodedText, decodedResult) => {
  console.log(`Mã vạch quét được: ${decodedText}`);
  
  // Find product by SKU
  const product = products.find(p => p.sku && p.sku.toLowerCase() === decodedText.trim().toLowerCase());
  if (product) {
    playBeepSound();
    addToCart(product.id);
    showToast(`Đã thêm ${product.name} vào giỏ`);
    
    if (!continuousScan) {
      closeScannerModal();
    }
  } else {
    showToast(`Không tìm thấy sản phẩm có mã SKU: ${decodedText}`);
  }
};

const onScanFailure = (error) => {
  // Silent capture noise
};

const playBeepSound = () => {
  try {
    const context = new (window.AudioContext || window.webkitAudioContext)();
    const osc = context.createOscillator();
    const gain = context.createGain();
    osc.connect(gain);
    gain.connect(context.destination);
    osc.type = "sine";
    osc.frequency.value = 1000; // 1kHz beep sound
    gain.gain.setValueAtTime(0.2, context.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, context.currentTime + 0.15);
    osc.start(context.currentTime);
    osc.stop(context.currentTime + 0.15);
  } catch (e) {
    console.warn("Web Audio API not supported or user gesture needed:", e);
  }
};

// ========================================================
// 🎫 2. VOUCHER COUPONS MANAGEMENT LOGIC
// ========================================================
window.renderVouchersList = () => {
  const container = document.getElementById('voucher-list-container');
  if (!container) return;
  
  if (vouchers.length === 0) {
    container.innerHTML = `<div style="text-align: center; padding: 2rem; color: var(--text-muted); opacity: 0.5;">Chưa có mã giảm giá nào.</div>`;
    return;
  }
  
  container.innerHTML = vouchers.map(v => `
    <div class="voucher-tag">
      <div>
        <div style="font-weight: 700; color: var(--primary); font-size: 1.1rem;">${v.code}</div>
        <div style="font-size: 0.8rem; color: var(--text-muted); margin-top: 2px;">
          Giảm: <strong>${v.type === 'fixed' ? formatPrice(v.value) : v.value + '%'}</strong> 
          | Đơn tối thiểu: <strong>${formatPrice(v.minOrder)}</strong>
        </div>
        <div style="font-size: 0.75rem; color: var(--text-muted); margin-top: 2px;">
          Hạn dùng: <strong>${new Date(v.expiry).toLocaleDateString('vi-VN')}</strong>
        </div>
      </div>
      <div style="display: flex; gap: 8px; align-items: center;">
        <button class="qty-btn" style="background: ${v.isActive ? 'var(--primary-light)' : 'var(--border)'}; color: ${v.isActive ? 'var(--primary)' : 'var(--text-muted)'}; width: auto; height: auto; border-radius: 8px; padding: 4px 8px; font-size: 0.75rem; font-weight: 600;" onclick="toggleVoucherStatus('${v.code}')">
          ${v.isActive ? 'Đang chạy' : 'Đã khóa'}
        </button>
        <button class="qty-btn del" onclick="deleteVoucher('${v.code}')">
          <span class="material-symbols-rounded" style="font-size: 16px;">delete</span>
        </button>
      </div>
    </div>
  `).join('');
};

window.createNewVoucher = () => {
  const codeIn = document.getElementById('v-code');
  const typeIn = document.getElementById('v-type');
  const valIn = document.getElementById('v-value');
  const minIn = document.getElementById('v-min');
  const maxIn = document.getElementById('v-max');
  const expIn = document.getElementById('v-expiry');
  
  const code = codeIn.value.trim().toUpperCase();
  const type = typeIn.value;
  const value = parseInt(valIn.value);
  const minOrder = parseInt(minIn.value) || 0;
  const maxDiscount = parseInt(maxIn.value) || 0;
  const expiry = expIn.value;
  
  if (!code || isNaN(value) || !expiry) {
    alert('Vui lòng điền đầy đủ thông tin mã voucher!');
    return;
  }
  
  if (vouchers.find(v => v.code === code)) {
    alert('Mã Voucher này đã tồn tại!');
    return;
  }
  
  vouchers.push({
    code,
    type,
    value,
    minOrder,
    maxDiscount,
    expiry,
    isActive: true
  });
  
  saveState();
  renderVouchersList();
  
  // Clear inputs
  codeIn.value = '';
  valIn.value = '';
  minIn.value = '0';
  maxIn.value = '100000';
  showToast(`Đã tạo thành công Voucher ${code}!`);
};

window.toggleVoucherStatus = (code) => {
  const v = vouchers.find(x => x.code === code);
  if (v) {
    v.isActive = !v.isActive;
    saveState();
    renderVouchersList();
    showToast(`Đã cập nhật trạng thái Voucher ${code}`);
  }
};

window.deleteVoucher = (code) => {
  if (confirm(`Bạn muốn xóa Voucher ${code}?`)) {
    vouchers = vouchers.filter(x => x.code !== code);
    saveState();
    renderVouchersList();
    showToast(`Đã xóa Voucher ${code}`);
  }
};

// ========================================================
// 📡 3. CLOUD SERVER SYNCHRONIZATION (REST API)
// ========================================================
window.initAppSync = async () => {
  if (syncEnabled) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2000); // 2-second timeout
      const res = await fetch(`${syncUrl}/api/sync`, { signal: controller.signal });
      clearTimeout(timeoutId);
      
      const json = await res.json();
      if (json.success && json.data) {
        const db = json.data;
        if (db.products) localStorage.setItem('kiot_products', JSON.stringify(db.products));
        if (db.orders) localStorage.setItem('kiot_orders', JSON.stringify(db.orders));
        if (db.categories) localStorage.setItem('kiot_categories', JSON.stringify(db.categories));
        if (db.customers) localStorage.setItem('kiot_customers', JSON.stringify(db.customers));
        if (db.vouchers) localStorage.setItem('kiot_vouchers', JSON.stringify(db.vouchers));
        if (db.cashbook) localStorage.setItem('kiot_cashbook', JSON.stringify(db.cashbook));
        if (db.tables) localStorage.setItem('kiot_tables', JSON.stringify(db.tables));
        if (db.activity_logs) localStorage.setItem('kiot_activity_logs', JSON.stringify(db.activity_logs));
        if (db.users) localStorage.setItem('kiot_users', JSON.stringify(db.users));
        if (db.suppliers) localStorage.setItem('kiot_suppliers', JSON.stringify(db.suppliers));
        if (db.delivery) localStorage.setItem('kiot_delivery', JSON.stringify(db.delivery));
        if (db.shift_history) localStorage.setItem('kiot_shift_history', JSON.stringify(db.shift_history));
        if (db.settings) localStorage.setItem('kiot_settings', JSON.stringify(db.settings));
        if (db.purchases) localStorage.setItem('kiot_purchases', JSON.stringify(db.purchases));
        
        if (db.shift !== undefined) {
          if (db.shift) localStorage.setItem('kiot_shift', JSON.stringify(db.shift));
          else localStorage.removeItem('kiot_shift');
        }
        
        loadStateFromLocalStorage();
        console.log('App state sync from server successful.');
      }
    } catch (error) {
      console.warn("Server sync unreachable during init, running with offline state:", error);
    }
  }
};

window.toggleSyncMode = (enabled) => {
  syncEnabled = enabled;
  localStorage.setItem('kiot_sync_enabled', JSON.stringify(syncEnabled));
  updateSyncUI();
  
  if (syncEnabled) {
    // Attempt an initial data pull from cloud server
    syncWithCloudServer(true);
  }
};

const updateSyncUI = () => {
  const checkbox = document.getElementById('setting-sync-enabled');
  const badge = document.getElementById('sync-status-badge');
  if (checkbox) checkbox.checked = syncEnabled;
  if (badge) {
    if (syncEnabled) {
      badge.innerText = 'Đồng bộ: Máy chủ (Bật)';
      badge.style.background = 'var(--success)';
      badge.style.color = 'white';
    } else {
      badge.innerText = 'Đồng bộ: Local (Tắt)';
      badge.style.background = 'var(--border)';
      badge.style.color = 'var(--text-main)';
    }
  }
  
  const manualBtn = document.getElementById('btn-manual-sync');
  if (manualBtn) {
    manualBtn.disabled = !syncEnabled;
    manualBtn.style.opacity = syncEnabled ? '1' : '0.5';
  }
};

window.syncWithCloudServer = async (pullFirst = false) => {
  if (!syncEnabled) return;
  
  const syncUrlIn = document.getElementById('setting-sync-url');
  if (syncUrlIn) {
    syncUrl = syncUrlIn.value.trim() || 'http://localhost:3000';
    localStorage.setItem('kiot_sync_url', syncUrl);
  }
  
  const btn = document.getElementById('btn-manual-sync');
  if (btn) btn.innerHTML = '<span class="material-symbols-rounded">sync</span> Đang đồng bộ...';
  
  try {
    // 1. Pull data if enabling sync first time or requested
    if (pullFirst) {
      const res = await fetch(`${syncUrl}/api/sync`);
      const json = await res.json();
      if (json.success && json.data) {
        const db = json.data;
        if (db.products && db.products.length > 0) products = db.products;
        if (db.orders && db.orders.length > 0) orders = db.orders;
        if (db.categories && db.categories.length > 0) categories = db.categories;
        if (db.customers && db.customers.length > 0) customers = db.customers;
        if (db.vouchers && db.vouchers.length > 0) vouchers = db.vouchers;
        if (db.cashbook && db.cashbook.length > 0) cashVouchers = db.cashbook;
        if (db.tables && db.tables.length > 0) tables = db.tables;
        if (db.activity_logs && db.activity_logs.length > 0) activityLogs = db.activity_logs;
        if (db.shift_history) {
          localStorage.setItem('kiot_shift_history', JSON.stringify(db.shift_history));
        }
        
        saveState();
        showToast('Đã tải thành công dữ liệu đám mây về máy!');
      }
    }
    
    // 2. Push local state to server
    const payload = {
      products,
      orders,
      categories,
      customers,
      vouchers,
      cashbook: cashVouchers,
      tables,
      activity_logs: activityLogs,
      shift_history: JSON.parse(localStorage.getItem('kiot_shift_history')) || [],
      settings: JSON.parse(localStorage.getItem('kiot_settings')) || {}
    };
    
    const res = await fetch(`${syncUrl}/api/sync`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    
    const json = await res.json();
    if (json.success) {
      showToast('Đã đồng bộ hóa dữ liệu lên server thành công!');
    } else {
      throw new Error(json.message);
    }
  } catch (error) {
    console.warn("REST API connection error, fallback to offline LocalStorage:", error);
    showToast("Mất kết nối server! Ứng dụng tự động chạy offline.");
  } finally {
    if (btn) btn.innerHTML = '<span class="material-symbols-rounded">sync</span> Đồng bộ ngay';
    
    // Refresh active views
    renderProducts();
    renderProductTable();
    renderCustomerTable();
    renderCart();
  }
};

// Initialize Sync Status Badge on start
setTimeout(() => {
  updateSyncUI();
  // Perform initial visual upgrades setup
  renderAuditLogs();
  applyRolePermissions();
}, 200);

// ========================================================
// ☕ HẠNG MỤC 1 & 2 & 3 & 4 & 5: CÁC NÂNG CẤP CHUYÊN NGHIỆP
// ========================================================

// 1. Dữ liệu mảng toàn cục bổ sung
activityLogs = JSON.parse(localStorage.getItem('kiot_activity_logs')) || [];

// --- Hạng mục 2: Phân hệ Nhập hàng PO ---
window.renderImportTab = (container) => {
  container.innerHTML = `
    <div style="background: white; padding: 1.5rem; border-radius: var(--radius-lg); box-shadow: var(--shadow-sm); display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; align-items: start;">
      <div>
        <h4 style="margin-top: 0; margin-bottom: 1.25rem; font-size: 1.1rem; display: flex; align-items: center; gap: 8px; color: var(--primary);">
          <span class="material-symbols-rounded">shopping_bag</span> Tạo phiếu nhập kho (PO)
        </h4>
        <div class="form-group" style="margin-bottom: 1rem;">
          <label>Nhà cung cấp</label>
          <select id="po-supplier" class="search-input" style="padding-left: 10px; width: 100%;">
            ${suppliers.map(s => `<option value="${s.id}">${s.name}</option>`).join('')}
          </select>
        </div>
        <div class="form-group" style="margin-bottom: 1rem;">
          <label>Sản phẩm cần nhập</label>
          <select id="po-product" class="search-input" style="padding-left: 10px; width: 100%;" onchange="updatePOProductDefaults()">
            ${products.map(p => `<option value="${p.id}">${p.name} (Tồn hiện tại: ${p.stock})</option>`).join('')}
          </select>
        </div>
        <div class="form-group" style="margin-bottom: 1rem; display: flex; gap: 1rem;">
          <div style="flex: 1;">
            <label>Số lượng nhập</label>
            <input type="number" id="po-qty" class="form-input" style="padding-left: 10px; width: 100%; height: 38px; border-radius: 8px; border: 1px solid var(--border);" value="10" min="1" oninput="calculatePOTotal()">
          </div>
          <div style="flex: 1;">
            <label>Đơn giá nhập thực tế (₫)</label>
            <input type="number" id="po-cost" class="form-input" style="padding-left: 10px; width: 100%; height: 38px; border-radius: 8px; border: 1px solid var(--border);" value="15000" min="0" oninput="calculatePOTotal()">
          </div>
        </div>
        <div class="form-group" style="margin-bottom: 1rem; display: flex; align-items: center; gap: 8px; height: 38px;">
          <input type="checkbox" id="po-debt" style="width: 20px; height: 20px; cursor: pointer;" onchange="calculatePOTotal()">
          <label for="po-debt" style="cursor: pointer; margin-bottom: 0;">Ghi nợ Nhà cung cấp (NCC)</label>
        </div>
        <div style="background: var(--bg-color); padding: 1rem; border-radius: var(--radius-md); margin-bottom: 1.5rem;">
          <div style="display: flex; justify-content: space-between; font-weight: 700; font-size: 1.05rem;">
            <span>Tổng tiền nhập:</span>
            <span id="po-total" style="color: var(--primary);">150,000 ₫</span>
          </div>
        </div>
        <button class="primary-btn" style="width: 100%; justify-content: center; padding: 10px; border-radius: 8px; font-weight: 600;" onclick="submitPurchaseOrder()">Xác nhận Nhập kho</button>
      </div>
      
      <div>
        <h4 style="margin-top: 0; margin-bottom: 1.25rem; font-size: 1.1rem; display: flex; align-items: center; gap: 8px; color: var(--primary);">
          <span class="material-symbols-rounded">history</span> Lịch sử nhập hàng gần đây
        </h4>
        <div style="max-height: 400px; overflow-y: auto; display: flex; flex-direction: column; gap: 10px; padding-right: 5px;">
          ${(JSON.parse(localStorage.getItem('kiot_purchases')) || []).length === 0 ? `
            <div style="text-align: center; padding: 2rem; color: var(--text-muted); opacity: 0.5;">Chưa có lịch sử nhập kho nào.</div>
          ` : (JSON.parse(localStorage.getItem('kiot_purchases')) || []).map(p => `
            <div style="background: var(--bg-color); border: 1px solid var(--border); border-radius: 8px; padding: 10px 15px; font-size: 0.85rem;">
              <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
                <strong style="color: var(--primary);">${p.id}</strong>
                <span style="color: var(--text-muted);">${new Date(p.date).toLocaleDateString()}</span>
              </div>
              <div>Sản phẩm: <strong>${p.productName}</strong></div>
              <div>SL nhập: <strong>${p.qty}</strong> | Đơn giá: <strong>${formatPrice(p.costPrice)}</strong></div>
              <div style="display: flex; justify-content: space-between; margin-top: 4px; border-top: 1px dashed var(--border); padding-top: 4px;">
                <span>NCC: <strong>${p.supplierName}</strong></span>
                <span class="badge" style="background: ${p.isDebt ? 'var(--danger-light)' : 'var(--success-light)'}; color: ${p.isDebt ? 'var(--danger)' : 'var(--success)'}">${p.isDebt ? 'Ghi nợ' : 'Thanh toán'}</span>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  `;
  setTimeout(() => {
    updatePOProductDefaults();
    calculatePOTotal();
  }, 50);
};

window.updatePOProductDefaults = () => {
  const select = document.getElementById('po-product');
  const costInput = document.getElementById('po-cost');
  if (!select || !costInput) return;
  const pId = parseInt(select.value);
  const p = products.find(x => x.id === pId);
  if (p) {
    costInput.value = p.costPrice || 0;
    calculatePOTotal();
  }
};

window.calculatePOTotal = () => {
  const qty = parseInt(document.getElementById('po-qty').value) || 0;
  const cost = parseInt(document.getElementById('po-cost').value) || 0;
  const totalEl = document.getElementById('po-total');
  if (totalEl) totalEl.innerText = formatPrice(qty * cost);
};

window.submitPurchaseOrder = () => {
  const sSelect = document.getElementById('po-supplier');
  const pSelect = document.getElementById('po-product');
  const qtyInput = document.getElementById('po-qty');
  const costInput = document.getElementById('po-cost');
  const debtCheck = document.getElementById('po-debt');
  
  if (!sSelect || !pSelect || !qtyInput || !costInput || !debtCheck) return;
  
  const sId = sSelect.value;
  const pId = parseInt(pSelect.value);
  const qty = parseInt(qtyInput.value) || 0;
  const cost = parseInt(costInput.value) || 0;
  const isDebt = debtCheck.checked;
  
  if (qty <= 0) {
    alert('Số lượng nhập phải lớn hơn 0!');
    return;
  }
  
  const supplier = suppliers.find(s => s.id === sId);
  const product = products.find(p => p.id === pId);
  
  if (!supplier || !product) {
    alert('Dữ liệu không hợp lệ!');
    return;
  }
  
  const total = qty * cost;
  const oldStock = product.stock || 0;
  const oldCost = product.costPrice || 0;
  const totalStock = oldStock + qty;
  
  let newCost = cost;
  if (totalStock > 0) {
    newCost = Math.round(((oldStock * oldCost) + (qty * cost)) / totalStock);
  }
  
  product.stock = totalStock;
  product.costPrice = newCost;
  
  let purchases = JSON.parse(localStorage.getItem('kiot_purchases')) || [];
  const poId = 'PO' + Date.now().toString().slice(-6);
  const newPO = {
    id: poId,
    date: new Date().toISOString(),
    supplierId: sId,
    supplierName: supplier.name,
    productId: pId,
    productName: product.name,
    qty,
    costPrice: cost,
    total,
    isDebt
  };
  purchases.unshift(newPO);
  localStorage.setItem('kiot_purchases', JSON.stringify(purchases));
  
  if (isDebt) {
    supplier.debt = (supplier.debt || 0) + total;
  } else {
    cashVouchers.unshift({
      date: new Date().toISOString(),
      type: 'Chi',
      amount: total,
      note: `Chi thanh toán phiếu nhập hàng ${poId} - ${product.name} (x${qty})`
    });
  }
  
  logActivity(`Nhập hàng thành công: ${product.name} (x${qty}), Tổng: ${formatPrice(total)}, NCC: ${supplier.name}`);
  
  saveState();
  switchProductTab('import');
  showToast(`Nhập hàng thành công! Tồn kho: ${product.stock}, Giá vốn mới: ${formatPrice(product.costPrice)}`);
};

window.paySupplierDebt = (id) => {
  const s = suppliers.find(x => x.id === id);
  if (!s) return;
  
  const amountStr = prompt(`Tổng nợ NCC ${s.name} là ${formatPrice(s.debt)}. Nhập số tiền trả:`, s.debt);
  if (amountStr === null) return;
  
  const amount = parseInt(amountStr) || 0;
  if (amount <= 0 || amount > s.debt) {
    alert('Số tiền không hợp lệ!');
    return;
  }
  
  s.debt -= amount;
  
  cashVouchers.unshift({
    date: new Date().toISOString(),
    type: 'Chi',
    amount: amount,
    note: `Trả nợ nhà cung cấp ${s.name}`
  });
  
  logActivity(`Trả nợ NCC thành công: ${s.name}, Số tiền: ${formatPrice(amount)}`);
  saveState();
  switchPartnerTab('supplier');
  showToast(`Đã trả nợ thành công ${formatPrice(amount)} cho ${s.name}`);
};

// --- Hạng mục 3: Phân quyền & Nhật ký hoạt động Audit Logs ---
window.logActivity = (action) => {
  const user = currentUser ? currentUser.username : 'Hệ thống';
  activityLogs.unshift({
    date: new Date().toISOString(),
    username: user,
    action: action
  });
  if (activityLogs.length > 100) {
    activityLogs = activityLogs.slice(0, 100);
  }
  saveState();
  renderAuditLogs();
};

window.renderAuditLogs = () => {
  const tbody = document.getElementById('audit-logs-tbody');
  if (!tbody) return;
  
  if (activityLogs.length === 0) {
    tbody.innerHTML = `<tr><td colspan="3" style="text-align: center; color: var(--text-muted);">Không có nhật ký nào.</td></tr>`;
    return;
  }
  
  tbody.innerHTML = activityLogs.map(log => `
    <tr>
      <td style="font-size: 0.8rem; color: var(--text-muted);">${new Date(log.date).toLocaleString()}</td>
      <td style="font-weight: 600;">${log.username}</td>
      <td style="font-size: 0.85rem;">${log.action}</td>
    </tr>
  `).join('');
};

window.clearAuditLogs = () => {
  if (confirm('Bạn có chắc chắn muốn xóa toàn bộ nhật ký hoạt động hệ thống?')) {
    activityLogs = [];
    saveState();
    renderAuditLogs();
    showToast('Đã xóa sạch nhật ký hoạt động!');
  }
};

window.applyRolePermissions = () => {
  const isStaff = currentUser && currentUser.role === 'staff';
  
  const navReports = document.getElementById('nav-reports');
  const mnavReports = document.getElementById('mnav-reports');
  if (navReports) navReports.style.display = isStaff ? 'none' : 'flex';
  if (mnavReports) mnavReports.style.display = isStaff ? 'none' : 'flex';
  
  const auditLogsCard = document.getElementById('settings-audit-logs-card');
  const userManagementCard = auditLogsCard ? auditLogsCard.previousElementSibling : null;
  if (userManagementCard) {
    userManagementCard.style.display = isStaff ? 'none' : 'block';
  }
  
  const clearLogsBtn = auditLogsCard ? auditLogsCard.querySelector('button') : null;
  if (clearLogsBtn) {
    clearLogsBtn.style.display = isStaff ? 'none' : 'flex';
  }
};

// --- Hạng mục 4: Advanced Chart.js Dashboards ---
let pieChartInstance = null;
let lineChartInstance = null;

window.renderAnalyticsTab = (container) => {
  container.innerHTML = `
    <h3 style="margin-bottom: 1.5rem;">Biểu đồ & Chỉ số phân tích doanh số chuyên sâu</h3>
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; align-items: start;">
      <div style="background: white; padding: 1.5rem; border-radius: var(--radius-lg); box-shadow: var(--shadow-sm); display: flex; flex-direction: column; align-items: center;">
        <h4 style="margin-top: 0; margin-bottom: 1rem; width: 100%; text-align: left;">Doanh thu theo Danh mục sản phẩm (Pie Chart)</h4>
        <div style="width: 100%; max-width: 320px; height: 320px; display: flex; align-items: center; justify-content: center;">
          <canvas id="categoryPieChart" width="300" height="300"></canvas>
        </div>
      </div>
      <div style="background: white; padding: 1.5rem; border-radius: var(--radius-lg); box-shadow: var(--shadow-sm);">
        <h4 style="margin-top: 0; margin-bottom: 1rem;">So sánh doanh số Tuần này so với Tuần trước (Line Chart)</h4>
        <canvas id="weeklyComparisonLineChart" height="150"></canvas>
      </div>
    </div>
  `;
  
  const catRevenues = {};
  categories.forEach(cat => catRevenues[cat] = 0);
  
  getFilteredOrders().forEach(o => {
    o.items.forEach(item => {
      if (catRevenues[item.category] !== undefined) {
        catRevenues[item.category] += item.price * item.qty;
      }
    });
  });
  
  const pieLabels = Object.keys(catRevenues).filter(cat => catRevenues[cat] > 0);
  const pieData = pieLabels.map(cat => catRevenues[cat]);
  
  const pieCtx = document.getElementById('categoryPieChart');
  if (pieCtx && window.Chart) {
    if (pieChartInstance) pieChartInstance.destroy();
    
    if (pieData.length === 0) {
      pieCtx.style.display = 'none';
      pieCtx.parentElement.innerHTML = `<div style="color:var(--text-muted); font-size:0.9rem">Chưa có dữ liệu giao dịch trong kỳ này</div>`;
    } else {
      pieChartInstance = new Chart(pieCtx, {
        type: 'pie',
        data: {
          labels: pieLabels,
          datasets: [{
            data: pieData,
            backgroundColor: [
              '#4f46e5', '#10b981', '#f59e0b', '#ef4444', '#06b6d4', '#ec4899', '#8b5cf6'
            ]
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'bottom' }
          }
        }
      });
    }
  }
  
  const now = new Date();
  now.setHours(23, 59, 59, 999);
  
  const thisWeekRevenues = [0, 0, 0, 0, 0, 0, 0];
  const lastWeekRevenues = [0, 0, 0, 0, 0, 0, 0];
  
  const weekdayNames = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
  const lineLabels = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(now.getDate() - i);
    lineLabels.push(weekdayNames[d.getDay()] + ' (' + d.getDate() + '/' + (d.getMonth() + 1) + ')');
  }
  
  orders.forEach(o => {
    const oDate = new Date(o.date);
    const diffTime = now - oDate;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays >= 0 && diffDays < 7) {
      const idx = 6 - diffDays;
      if (idx >= 0 && idx < 7) thisWeekRevenues[idx] += o.total;
    } else if (diffDays >= 7 && diffDays < 14) {
      const idx = 13 - diffDays;
      if (idx >= 0 && idx < 7) lastWeekRevenues[idx] += o.total;
    }
  });
  
  const lineCtx = document.getElementById('weeklyComparisonLineChart');
  if (lineCtx && window.Chart) {
    if (lineChartInstance) lineChartInstance.destroy();
    
    lineChartInstance = new Chart(lineCtx, {
      type: 'line',
      data: {
        labels: lineLabels,
        datasets: [
          {
            label: 'Tuần này',
            data: thisWeekRevenues,
            borderColor: '#4f46e5',
            backgroundColor: 'rgba(79, 70, 229, 0.1)',
            tension: 0.3,
            fill: true,
            borderWidth: 3
          },
          {
            label: 'Tuần trước',
            data: lastWeekRevenues,
            borderColor: '#9ca3af',
            backgroundColor: 'transparent',
            tension: 0.3,
            borderDash: [5, 5],
            borderWidth: 2
          }
        ]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: 'top' }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              callback: function(value) {
                return formatPrice(value);
              }
            }
          }
        }
      }
    });
  }
};

// --- Hạng mục 5: AI Gemini Assistant ---
const removeAccents = (str) => {
  return str.normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/đ/g, 'd').replace(/Đ/g, 'D');
};

window.speakText = (text) => {
  try {
    const cleanText = text.replace(/[^\p{L}\p{N}\s,.:!?]/gu, '');
    const synth = window.speechSynthesis;
    const utter = new SpeechSynthesisUtterance(cleanText);
    utter.lang = 'vi-VN';
    utter.rate = 1.0;
    synth.speak(utter);
  } catch (e) {
    console.warn("Speech synthesis error:", e);
  }
};

window.toggleAIChatPanel = () => {
  const panel = document.getElementById('ai-chat-panel');
  if (panel) {
    const isHidden = panel.style.display === 'none';
    panel.style.display = isHidden ? 'flex' : 'none';
    if (isHidden) {
      document.getElementById('ai-chat-input').focus();
    }
  }
};

window.handleAIChatInput = (event) => {
  if (event.key === 'Enter') {
    event.preventDefault();
    submitAIChatQuery();
  }
};

const getStoreContext = () => {
  const today = new Date().toLocaleDateString('vi-VN');
  const todayOrders = orders.filter(o => new Date(o.date).toLocaleDateString('vi-VN') === today);
  const todayRevenue = todayOrders.reduce((sum, o) => sum + o.total, 0);
  const lowStock = products.filter(p => p.stock < 10).map(p => `${p.name} (còn ${p.stock})`);
  const debtList = customers.filter(c => c.debt > 0).map(c => `${c.name} (nợ ${formatPrice(c.debt)})`);
  const totalIn = cashVouchers.filter(v => v.type === 'Thu').reduce((sum, v) => sum + v.amount, 0);
  const totalOut = cashVouchers.filter(v => v.type === 'Chi').reduce((sum, v) => sum + v.amount, 0);
  const fundBalance = totalIn - totalOut;
  
  return `
Bạn là Trợ lý ảo AI của cửa hàng "Văn Tài POS", một hệ thống quản lý bán hàng thông minh.
Hãy trả lời câu hỏi của chủ tiệm một cách ngắn gọn, thân thiện, xưng hô "dạ, em" và gọi chủ tiệm là "anh Tài" hoặc "chị/anh".
Dưới đây là dữ liệu thực tế hiện tại của cửa hàng:
- Ngày hôm nay: ${today}
- Doanh thu hôm nay: ${formatPrice(todayRevenue)} (${todayOrders.length} đơn hàng)
- Tổng số sản phẩm trong kho: ${products.length} sản phẩm
- Sản phẩm sắp hết hàng (tồn < 10): ${lowStock.join(', ') || 'Không có sản phẩm nào tồn kho thấp.'}
- Khách hàng đang nợ: ${debtList.join(', ') || 'Không có ai nợ.'}
- Số dư sổ quỹ hiện tại: ${formatPrice(fundBalance)} (Tổng thu: ${formatPrice(totalIn)}, Tổng chi: ${formatPrice(totalOut)})
- Danh sách 5 hóa đơn gần nhất: ${orders.slice(0, 5).map(o => `${o.id} - ${formatPrice(o.total)} - ${o.paymentMethod}`).join(', ') || 'Chưa có hóa đơn nào.'}
`;
};

window.submitAIChatQuery = async () => {
  const input = document.getElementById('ai-chat-input');
  const messagesContainer = document.getElementById('ai-chat-messages');
  if (!input || !messagesContainer) return;
  
  const query = input.value.trim();
  if (!query) return;
  
  const userMsg = document.createElement('div');
  userMsg.className = 'ai-message user';
  userMsg.innerText = query;
  messagesContainer.appendChild(userMsg);
  
  input.value = '';
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
  
  const typing = document.createElement('div');
  typing.className = 'ai-message bot';
  typing.id = 'ai-typing-indicator';
  typing.innerHTML = `
    <div class="typing-dots">
      <span></span>
      <span></span>
      <span></span>
    </div>
  `;
  messagesContainer.appendChild(typing);
  messagesContainer.scrollTop = messagesContainer.scrollHeight;

  const apiKey = localStorage.getItem('kiot_gemini_key') || '';
  
  if (apiKey) {
    try {
      const storeContext = getStoreContext();
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `${storeContext}\n\nYêu cầu hoặc câu hỏi của chủ tiệm: "${query}"\n\nHãy trả lời một cách thông minh, chính xác dựa trên số liệu của cửa hàng. Không hiển thị các ký tự markdown như dấu sao đôi hay ký hiệu lạ để giọng nói có thể đọc dễ dàng hơn.`
                }
              ]
            }
          ]
        })
      });
      
      const indicator = document.getElementById('ai-typing-indicator');
      if (indicator) indicator.remove();

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      const answer = data.candidates?.[0]?.content?.parts?.[0]?.text || "Dạ, em gặp lỗi khi đọc câu trả lời từ Gemini. Anh kiểm tra lại API Key nhé!";
      
      const botMsg = document.createElement('div');
      botMsg.className = 'ai-message bot';
      botMsg.innerText = answer;
      messagesContainer.appendChild(botMsg);
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
      
      speakText(answer);
    } catch (e) {
      console.error("Gemini API call failed:", e);
      const indicator = document.getElementById('ai-typing-indicator');
      if (indicator) indicator.remove();
      
      const errAnswer = "Dạ, kết nối với Gemini thất bại. Anh vui lòng kiểm tra lại đường truyền mạng hoặc tính hợp lệ của API Key trong phần Cài đặt nhé!";
      const botMsg = document.createElement('div');
      botMsg.className = 'ai-message bot';
      botMsg.innerText = errAnswer;
      messagesContainer.appendChild(botMsg);
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
      speakText(errAnswer);
    }
  } else {
    // Fallback to local rules-based response
    setTimeout(() => {
      const indicator = document.getElementById('ai-typing-indicator');
      if (indicator) indicator.remove();
      
      const answer = processAIQuery(query) + "\n\n💡 Mách nhỏ: Cấu hình thêm Gemini API Key trong Cài đặt để kích hoạt AI thật thông minh nhé!";
      
      const botMsg = document.createElement('div');
      botMsg.className = 'ai-message bot';
      botMsg.innerText = answer;
      messagesContainer.appendChild(botMsg);
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
      
      speakText(answer);
    }, 800);
  }
};

const processAIQuery = (query) => {
  const qClean = removeAccents(query.toLowerCase());
  
  if (qClean.includes('doanh thu') || qClean.includes('doanh so') || qClean.includes('hom nay ban') || qClean.includes('bao nhieu tien')) {
    const today = new Date().toLocaleDateString('vi-VN');
    const todayOrders = orders.filter(o => new Date(o.date).toLocaleDateString('vi-VN') === today);
    const todayRevenue = todayOrders.reduce((sum, o) => sum + o.total, 0);
    return `Dạ, doanh thu hôm nay của cửa hàng mình là ${formatPrice(todayRevenue)} với tổng số ${todayOrders.length} hóa đơn đã thanh toán thành công ạ! 🚀`;
  }
  
  if (qClean.includes('ban chay') || qClean.includes('chay nhat') || qClean.includes('hot nhat') || qClean.includes('mon hot')) {
    const stats = {};
    orders.forEach(o => {
      o.items.forEach(item => {
        stats[item.name] = (stats[item.name] || 0) + item.qty;
      });
    });
    const items = Object.keys(stats).map(name => ({ name, qty: stats[name] }));
    if (items.length === 0) return "Dạ, hiện tại cửa hàng mình chưa bán được món nào trong hệ thống để thống kê ạ!";
    items.sort((a, b) => b.qty - a.qty);
    const top = items[0];
    return `Dạ, món bán chạy nhất của cửa hàng mình hiện tại là ${top.name} với ${top.qty} cốc/phần đã bán ra ạ! Tiếp tục phát huy nhé anh! ☕🔥`;
  }
  
  if (qClean.includes('ai no') || qClean.includes('no nhieu') || qClean.includes('khach no') || qClean.includes('no xau')) {
    const debtCustomers = customers.filter(c => c.debt > 0);
    if (debtCustomers.length === 0) return "Dạ tuyệt vời! Cửa hàng mình hiện tại không có khách hàng nào nợ nần gì cả ạ! 💖";
    debtCustomers.sort((a, b) => b.debt - a.debt);
    const top = debtCustomers[0];
    return `Dạ, khách hàng đang nợ nhiều nhất là ${top.name} với khoản nợ chưa thu là ${formatPrice(top.debt)} ạ. Anh nhớ liên hệ qua số điện thoại ${top.phone || 'chưa cập nhật'} để nhắc nợ nhé! 📞💸`;
  }
  
  if (qClean.includes('sap het') || qClean.includes('het hang') || qClean.includes('ton kho thap') || qClean.includes('nhap gi')) {
    const lowStock = products.filter(p => p.stock < 10);
    if (lowStock.length === 0) return "Dạ, hiện tại tồn kho tất cả các mặt hàng đều ở mức an toàn (trên 10) ạ! Cửa hàng mình vận hành rất tốt. 📦✅";
    const names = lowStock.map(p => `${p.name} (Tồn: ${p.stock})`).slice(0, 5).join(', ');
    return `Dạ, có ${lowStock.length} sản phẩm đang sắp hết hàng (tồn dưới 10), bao gồm: ${names} ạ. Anh nên cân nhắc mở phiếu Nhập hàng sớm nhé! 📦⚠️`;
  }
  
  if (qClean.includes('so quy') || qClean.includes('tong quy') || qClean.includes('quy con') || qClean.includes('tien mat quy') || qClean.includes('quy hien tai')) {
    const totalIn = cashVouchers.filter(v => v.type === 'Thu').reduce((sum, v) => sum + v.amount, 0);
    const totalOut = cashVouchers.filter(v => v.type === 'Chi').reduce((sum, v) => sum + v.amount, 0);
    const balance = totalIn - totalOut;
    return `Dạ, số dư tồn quỹ thực tế hiện tại của cửa hàng là ${formatPrice(balance)} ạ. Trong đó tổng thu là ${formatPrice(totalIn)} và tổng chi là ${formatPrice(totalOut)} nhé anh Tài! 💰📈`;
  }
  
  return "Dạ, em nghe đây ạ! Em có thể giúp anh Tài tra cứu doanh số hôm nay, món bán chạy nhất, khách nợ nhiều nhất, hàng sắp hết, hoặc số quỹ cửa hàng. Anh hỏi đi em trả lời liền nhé! 🤖✨";
};

// ========================================================
// 🔗 HOOKS & WRAPPERS FOR MODULAR FUNCTIONALITY
// ========================================================

// 1. Wrap switchView to block staff from reports
const originalSwitchView = window.switchView;
window.switchView = (viewName) => {
  const isStaff = currentUser && currentUser.role === 'staff';
  if (viewName === 'reports' && isStaff) {
    alert('Tài khoản của bạn không có quyền truy cập Báo cáo & Phân tích!');
    return;
  }
  originalSwitchView(viewName);
  if (viewName === 'settings') {
    renderAuditLogs();
  }
};

// 2. Wrap product tab rendering to support import & disabled inputs
const originalRenderProductTabContent = window.renderProductTabContent;
window.renderProductTabContent = () => {
  if (currentProductTab === 'import') {
    const container = document.getElementById('product-tab-content');
    renderImportTab(container);
  } else if (currentProductTab === 'price') {
    const container = document.getElementById('product-tab-content');
    const isStaff = currentUser && currentUser.role === 'staff';
    container.innerHTML = `
      <div class="table-container">
        <table class="data-table">
          <thead>
            <tr>
              <th>Tên sản phẩm</th>
              <th>Giá nhập</th>
              <th>Giá bán</th>
              <th>Lợi nhuận</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            ${products.map(p => `
              <tr>
                <td style="font-weight: 500;">${p.name}</td>
                <td><input type="number" value="${p.costPrice}" class="form-input" style="width: 120px; padding: 4px 8px;" onchange="updateProductPrice(${p.id}, 'costPrice', this.value)" ${isStaff ? 'disabled' : ''}></td>
                <td><input type="number" value="${p.price}" class="form-input" style="width: 120px; padding: 4px 8px;" onchange="updateProductPrice(${p.id}, 'price', this.value)" ${isStaff ? 'disabled' : ''}></td>
                <td style="color: var(--success); font-weight: 600;">${formatPrice(p.price - p.costPrice)}</td>
                <td><button class="primary-btn" style="padding: 4px 10px; font-size: 0.8rem;" onclick="saveProductPrice(${p.id})" ${isStaff ? 'disabled' : ''}>Lưu</button></td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  } else {
    originalRenderProductTabContent();
  }
};

// 3. Wrap switchReportTab to support analytics
const originalSwitchReportTab = window.switchReportTab;
window.switchReportTab = (tab) => {
  originalSwitchReportTab(tab);
  if (tab === 'analytics') {
    const container = document.getElementById('report-tab-content');
    renderAnalyticsTab(container);
  }
};

// 4. Wrap original auth check & logins
const originalHandleLogin = window.handleLogin;
window.handleLogin = async () => {
  await originalHandleLogin();
  setTimeout(() => {
    applyRolePermissions();
  }, 3000);
};

// 5. Wrap core events to write Audit logs
const originalSubmitShift = window.submitShift;
window.submitShift = () => {
  const isClosing = !!currentShift;
  const initialCash = currentShift ? currentShift.initialCash : 0;
  originalSubmitShift();
  if (currentShift) {
    logActivity(`Mở ca làm việc thành công, tiền đầu ca: ${formatPrice(currentShift.initialCash)}`);
  } else {
    const history = JSON.parse(localStorage.getItem('kiot_shift_history')) || [];
    const lastShift = history[history.length - 1];
    if (lastShift) {
      logActivity(`Đóng ca làm việc thành công ${lastShift.id}, doanh thu TM: ${formatPrice(lastShift.cashRevenue || 0)}, lệch quỹ: ${formatPrice(lastShift.diff || 0)}`);
    }
  }
};

const originalPayDebt = window.payDebt;
window.payDebt = (id) => {
  const customer = customers.find(c => c.id === id);
  const oldDebt = customer ? customer.debt : 0;
  originalPayDebt(id);
  const newCustomer = customers.find(c => c.id === id);
  if (newCustomer && newCustomer.debt < oldDebt) {
    const pay = oldDebt - newCustomer.debt;
    logActivity(`Thu nợ từ khách hàng ${newCustomer.name}, số tiền: ${formatPrice(pay)}`);
  }
};

const originalConfirmCheckout = window.confirmCheckout;
window.confirmCheckout = (isProvisional) => {
  const { finalTotal } = calculateCheckout();
  const cId = activeCartId;
  originalConfirmCheckout(isProvisional);
  if (!isProvisional && !carts.some(x => x.id === cId)) {
    const lastOrder = orders[0];
    if (lastOrder) {
      logActivity(`Thanh toán hóa đơn thành công ${lastOrder.id}, tổng cộng: ${formatPrice(lastOrder.total)}`);
    }
  }
};

const originalCancelInvoice = window.cancelInvoice;
window.cancelInvoice = (id) => {
  const order = orders.find(o => o.id === id);
  if (order) {
    originalCancelInvoice(id);
    const stillExists = orders.some(o => o.id === id);
    if (!stillExists) {
      logActivity(`Hủy hóa đơn ${id} thành công, đã hoàn kho và công nợ.`);
    }
  }
};

// 7. Wrap renderInvoices to hide deletion for staff
const originalRenderInvoices = window.renderInvoices;
window.renderInvoices = () => {
  const isStaff = currentUser && currentUser.role === 'staff';
  if (orders.length === 0) {
    DOM.invoicesTbody.innerHTML = `<tr><td colspan="5" style="text-align:center;">Chưa có hoá đơn nào</td></tr>`;
    return;
  }
  DOM.invoicesTbody.innerHTML = orders.map(o => `
    <tr onclick="viewInvoiceDetail('${o.id}')" style="cursor: pointer;">
      <td style="font-weight:600;">${o.id}</td>
      <td>${formatDate(o.date)}</td>
      <td>${o.itemsCount}</td>
      <td style="font-weight:600; color:var(--primary);">${formatPrice(o.total)}</td>
      <td style="display: flex; gap: 0.5rem;">
        <button class="clear-btn" style="padding: 0.5rem; border:none; background:transparent; color: var(--primary);" onclick="event.stopPropagation(); printInvoice(orders.find(x => x.id === '${o.id}'))" title="In hoá đơn">
          <span class="material-symbols-rounded" style="font-size:20px;">print</span>
        </button>
        ${!isStaff ? `
          <button class="clear-btn" style="padding: 0.5rem; border:none; background:transparent;" onclick="event.stopPropagation(); cancelInvoice('${o.id}')" title="Huỷ hoá đơn">
            <span class="material-symbols-rounded" style="font-size:20px;">delete</span>
          </button>
        ` : ''}
      </td>
    </tr>
  `).join('');
};

// Khởi chạy gán phím Enter ở cuối cùng khi tất cả các hàm global đã tải xong
initEnterKeys();
