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
let categories = JSON.parse(localStorage.getItem('kiot_categories')) || ['Cà phê', 'Trà', 'Trà sữa', 'Sinh tố', 'Nước ép', 'Bánh ngọt'];
let products = JSON.parse(localStorage.getItem('kiot_products')) || DEFAULT_PRODUCTS;
// Tự động thêm Tồn kho và Giá nhập cho các sản phẩm cũ chưa có
products.forEach(p => {
  if (p.stock === undefined) p.stock = 100;
  if (p.costPrice === undefined) p.costPrice = Math.floor(p.price * 0.6);
});

let orders = JSON.parse(localStorage.getItem('kiot_orders')) || [];
let carts = [{ id: 1, name: 'Đơn 1', items: [] }];
let activeCartId = 1;
let cart = carts[0].items;

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

let currentShift = JSON.parse(localStorage.getItem('kiot_shift')) || null;
let customers = JSON.parse(localStorage.getItem('kiot_customers')) || [];
let users = JSON.parse(localStorage.getItem('kiot_users')) || [
  { username: 'admin', password: '2403', role: 'admin' }
];
let currentUser = JSON.parse(localStorage.getItem('kiot_current_user')) || null;

// Save to LocalStorage
const saveState = () => {
  localStorage.setItem('kiot_products', JSON.stringify(products));
  localStorage.setItem('kiot_orders', JSON.stringify(orders));
  localStorage.setItem('kiot_categories', JSON.stringify(categories));
  localStorage.setItem('kiot_customers', JSON.stringify(customers));
  localStorage.setItem('kiot_users', JSON.stringify(users));
  localStorage.setItem('kiot_current_user', JSON.stringify(currentUser));
  if (currentShift) {
    localStorage.setItem('kiot_shift', JSON.stringify(currentShift));
  } else {
    localStorage.removeItem('kiot_shift');
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
    customers: document.getElementById('view-customers'),
    invoices: document.getElementById('view-invoices'),
    reports: document.getElementById('view-reports'),
    settings: document.getElementById('view-settings')
  },
  // Tables
  productsTbody: document.getElementById('products-tbody'),
  invoicesTbody: document.getElementById('invoices-tbody'),
  reportsTbody: document.getElementById('reports-tbody'),
  topProductsTbody: document.getElementById('top-products-tbody'),
  topCustomersTbody: document.getElementById('top-customers-tbody'),
  // Reports
  reportToday: document.getElementById('report-today'),
  reportOrders: document.getElementById('report-orders'),
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
  reportProfit: document.getElementById('report-profit'),
  
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
  mnavCustomers: document.getElementById('mnav-customers'),
  viewCustomers: document.getElementById('view-customers'),
  customersTbody: document.getElementById('customers-tbody'),
  customerModal: document.getElementById('customer-modal-overlay'),
  cmName: document.getElementById('modal-customer-name'),
  cmPhone: document.getElementById('modal-customer-phone'),
  cmTier: document.getElementById('modal-customer-tier'),
  cmPoints: document.getElementById('modal-customer-points'),
  cmDebt: document.getElementById('modal-customer-debt'),
  checkoutCustomer: document.getElementById('checkout-customer'),
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
  products: 'Quản lý sản phẩm',
  customers: 'Quản lý khách hàng',
  invoices: 'Lịch sử hoá đơn',
  reports: 'Báo cáo doanh thu',
  settings: 'Cài đặt hệ thống'
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
  if (viewName === 'products') renderProductTable();
  if (viewName === 'invoices') renderInvoices();
  if (viewName === 'reports') renderReports();
  if (viewName === 'pos') renderProducts();
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

window.selectPaymentMethod = (method, btnElement) => {
  currentPaymentMethod = method;
  document.querySelectorAll('#payment-methods button').forEach(btn => btn.classList.remove('active'));
  if (btnElement) btnElement.classList.add('active');
  
  if (method === 'Chuyển khoản') {
    DOM.qrContainer.style.display = 'flex';
    const subtotal = cart.reduce((acc, item) => acc + item.price * item.qty, 0);
    // Sinh mã QR mẫu cho số tiền hiện tại
    DOM.qrImg.src = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=ChuyenKhoan_${subtotal}`;
  } else {
    DOM.qrContainer.style.display = 'none';
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
  
  let vat = 0;
  let vVal = parseFloat(DOM.cVAT.value);
  if (!isNaN(vVal)) {
    vat = ((subtotal - discount) * vVal) / 100;
  }
  
  DOM.cVATVal.innerText = '+' + formatPrice(vat);
  
  const finalTotal = subtotal - discount + vat;
  const result = finalTotal > 0 ? finalTotal : 0;
  DOM.cTotal.innerText = formatPrice(result);
  
  if (currentPaymentMethod === 'Chuyển khoản') {
    DOM.qrImg.src = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=ChuyenKhoan_${result}`;
  }
  
  return { subtotal, discount, vat, finalTotal: result };
};

window.confirmCheckout = (isProvisional) => {
  if (cart.length === 0) return;
  
  const { subtotal, discount, vat, finalTotal } = calculateCheckout();
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
  
  const itemsHtml = order.items.map(item => `
    <tr>
      <td colspan="2" style="font-weight: 600; text-align: left; padding-bottom: 2px;">${item.name}</td>
    </tr>
    <tr style="border-bottom: 1px dashed #000;">
      <td style="text-align: left; padding-top: 0; color: #333;">${item.qty} x ${formatPrice(item.price)}</td>
      <td style="text-align: right; padding-top: 0; font-weight: 600;">${formatPrice(item.price * item.qty)}</td>
    </tr>
  `).join('');

  const isProvisional = order.isProvisional;
  const title = isProvisional ? "PHIẾU TẠM TÍNH" : "HOÁ ĐƠN BÁN HÀNG";
  
  let detailsHtml = '';
  if (order.discount > 0 || order.vat > 0) {
    detailsHtml += `
      <div style="display: flex; justify-content: space-between; font-size: 13px; margin-top: 5px;">
        <span>Tổng tiền hàng:</span>
        <span>${formatPrice(order.subtotal || order.total)}</span>
      </div>
    `;
    if (order.discount > 0) {
      detailsHtml += `
        <div style="display: flex; justify-content: space-between; font-size: 13px;">
          <span>Giảm giá:</span>
          <span>-${formatPrice(order.discount)}</span>
        </div>
      `;
    }
    if (order.vat > 0) {
      detailsHtml += `
        <div style="display: flex; justify-content: space-between; font-size: 13px;">
          <span>Thuế VAT:</span>
          <span>+${formatPrice(order.vat)}</span>
        </div>
      `;
    }
  }

  printArea.innerHTML = `
    <div class="print-header">
      <div class="print-title" style="font-size: 18px; margin-bottom: 4px;">VĂN TÀI POS</div>
      <div>ĐC: Cửa hàng Văn Tài</div>
      <div style="border-bottom: 1px dashed #000; margin: 10px 0;"></div>
      <div style="font-size:16px; font-weight:bold;">${title}</div>
      <div style="text-align:left; margin-top:10px;">
        Mã HĐ: ${order.id}<br>
        Ngày: ${formatDate(order.date)}<br>
        ${!isProvisional && order.paymentMethod ? `Thanh toán: ${order.paymentMethod}` : ''}
        ${order.customerName ? `<br>Khách hàng: ${order.customerName}` : ''}
      </div>
      <div style="border-bottom: 1px dashed #000; margin: 10px 0;"></div>
    </div>
    <table class="print-table" style="width: 100%; border-collapse: collapse; margin-bottom: 10px;">
      <tbody>
        ${itemsHtml}
      </tbody>
    </table>
    <div style="border-top: 1px dashed #000; margin-top: 10px; padding-top: 5px;"></div>
    ${detailsHtml}
    <div class="print-total" style="display: flex; justify-content: space-between; font-size: 16px; font-weight: bold; border-top: none; padding-top: 5px; margin-top: 5px;">
      <span>TỔNG CỘNG:</span>
      <span>${formatPrice(order.total)}</span>
    </div>
    <div style="border-top: 1px dashed #000; margin-top: 10px;"></div>
    <div class="print-footer" style="text-align: center; margin-top: 15px; font-style: italic;">
      ${isProvisional ? "Vui lòng kiểm tra lại đơn hàng trước khi thanh toán." : "Xin cảm ơn và hẹn gặp lại quý khách!"}
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
    <tr>
      <td style="font-weight:600;">${o.id}</td>
      <td>${formatDate(o.date)}</td>
      <td>${o.itemsCount}</td>
      <td style="font-weight:600; color:var(--primary);">${formatPrice(o.total)}</td>
      <td style="display: flex; gap: 0.5rem;">
        <button class="clear-btn" style="padding: 0.5rem; border:none; background:transparent; color: var(--primary);" onclick="printInvoice(orders.find(x => x.id === '${o.id}'))" title="In hoá đơn">
          <span class="material-symbols-rounded" style="font-size:20px;">print</span>
        </button>
        <button class="clear-btn" style="padding: 0.5rem; border:none; background:transparent;" onclick="cancelInvoice('${o.id}')" title="Huỷ hoá đơn">
          <span class="material-symbols-rounded" style="font-size:20px;">delete</span>
        </button>
      </td>
    </tr>
  `).join('');
};

// --- Reports Logic ---
let revenueChartInstance = null;

const renderReports = () => {
  const todayStr = new Date().toLocaleDateString('vi-VN');
  let todayRevenue = 0;
  let todayProfit = 0;
  
  const dailyData = {};
  const productStats = {};
  const customerStats = {};
  
  orders.forEach(o => {
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
  DOM.reportOrders.innerText = orders.length;
  if (DOM.reportProfit) DOM.reportProfit.innerText = formatPrice(todayProfit);
  
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
};

window.exportCSV = () => {
  let csvContent = "data:text/csv;charset=utf-8,\uFEFF";
  csvContent += "Ma HD,Ngay Tao,So Luong Mon,Doanh Thu,Loi Nhuan,Khach Hang\n";
  
  orders.forEach(o => {
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
  DOM.customersTbody.innerHTML = customers.map(c => `
    <tr>
      <td style="font-weight: 600;">${c.id}</td>
      <td style="font-weight: 500;">${c.name}</td>
      <td>${c.phone}</td>
      <td><span class="badge" style="background: ${c.tier === 'VIP' ? 'var(--warning)' : (c.tier === 'Đại lý' ? 'var(--success)' : 'var(--border)')}; color: ${c.tier === 'Thành viên' ? 'var(--text-main)' : 'white'}">${c.tier}</span></td>
      <td>
        <div style="font-size: 0.85rem">Điểm: <span style="font-weight:600; color:var(--primary)">${c.points}</span></div>
        ${c.debt > 0 ? `<div style="font-size: 0.85rem">Nợ: <span style="font-weight:600; color:var(--danger)">${formatPrice(c.debt)}</span></div>` : '<div style="font-size: 0.85rem; color: var(--text-muted)">Không có nợ</div>'}
      </td>
      <td style="display: flex; gap: 0.5rem;">
        <button class="qty-btn" onclick="openCustomerModal('${c.id}')"><span class="material-symbols-rounded" style="font-size: 16px;">edit</span></button>
        <button class="qty-btn" style="background: var(--danger-light); color: var(--danger);" onclick="deleteCustomer('${c.id}')"><span class="material-symbols-rounded" style="font-size: 16px;">delete</span></button>
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
  localStorage.setItem('kiot_settings', JSON.stringify({ storeName, branchName }));
  showToast('Đã lưu cài đặt!');
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

window.handleLogin = () => {
  const userIn = document.getElementById('login-username').value.trim();
  const passIn = document.getElementById('login-password').value.trim();
  const errorEl = document.getElementById('login-error');
  
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

// Init
checkAuth();
const savedSettings = JSON.parse(localStorage.getItem('kiot_settings'));
if (savedSettings) {
  document.getElementById('setting-store-name').value = savedSettings.storeName;
  document.getElementById('setting-branch-name').value = savedSettings.branchName;
}
renderShiftButton();
renderCustomerTable();
renderCartTabs();
renderCategoryDropdown();
renderCategories();
renderProducts();
renderProductTable();
renderUserTable();
