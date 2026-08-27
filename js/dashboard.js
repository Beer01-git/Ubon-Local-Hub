const dashboardState = {
  products: [],
  productToDeleteId: null
};

// DOM Elements
const tableBody = document.getElementById('product-table-body');
const modal = document.getElementById('product-modal');
const addProductBtn = document.getElementById('add-product-btn');
const closeModalBtn = document.getElementById('close-modal');
const cancelModalBtn = document.getElementById('cancel-modal');
const productForm = document.getElementById('product-form');
const districtSelect = document.getElementById('district');
const categorySelect = document.getElementById('category');
const otopStarsSelect = document.getElementById('otopStars');
const productIdInput = document.getElementById('product-id');
const imageUrlInput = document.getElementById('imageUrl');
const imagePreview = document.getElementById('image-preview');
const modalFormBadge = document.getElementById('modal-form-badge');
const modalFormTitle = document.getElementById('modal-form-title');
const resetDashboardDataBtn = document.getElementById('reset-dashboard-data-btn');
const toastContainer = document.getElementById('toast-container');

// Delete Modal Elements
const deleteModal = document.getElementById('delete-modal');
const deleteModalText = document.getElementById('delete-modal-text');
const cancelDeleteBtn = document.getElementById('cancel-delete-btn');
const confirmDeleteBtn = document.getElementById('confirm-delete-btn');

// Stats Elements
const statTotalItems = document.getElementById('stat-total-items');
const statTotalValue = document.getElementById('stat-total-value');
const statActiveDistricts = document.getElementById('stat-active-districts');

function showToast(message, type = 'success') {
  if (!toastContainer) return;

  const toast = document.createElement('div');
  const bgColor = type === 'success' ? 'bg-[#087A5B] text-white' : type === 'danger' ? 'bg-red-700 text-white' : 'bg-[#172B26] text-white';
  const icon = type === 'success' ? '✓' : type === 'danger' ? '✕' : 'ℹ';

  toast.className = `flex items-center gap-3 rounded-2xl ${bgColor} px-4 py-3 text-sm shadow-lg toast-enter font-medium border border-white/10`;
  toast.innerHTML = `
    <span class="flex h-6 w-6 items-center justify-center rounded-full bg-white/20 text-xs font-bold">${icon}</span>
    <span>${message}</span>
  `;

  toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.classList.remove('toast-enter');
    toast.classList.add('toast-exit');
    setTimeout(() => toast.remove(), 250);
  }, 2800);
}

function loadDashboardData() {
  dashboardState.products = window.UbonStore ? window.UbonStore.getProducts() : [...window.initialProducts];
}

function renderStats() {
  const stats = window.UbonStore ? window.UbonStore.getStats() : {
    totalItems: dashboardState.products.length,
    totalValue: dashboardState.products.reduce((sum, p) => sum + (Number(p.price) || 0), 0),
    activeDistricts: new Set(dashboardState.products.map(p => p.districtId)).size
  };

  if (statTotalItems) statTotalItems.textContent = `${stats.totalItems} รายการ`;
  if (statTotalValue) statTotalValue.textContent = `฿${stats.totalValue.toLocaleString()}`;
  if (statActiveDistricts) statActiveDistricts.textContent = `${stats.activeDistricts} อำเภอ`;
}

function populateSelectOptions() {
  if (districtSelect) {
    districtSelect.innerHTML = window.districts
      .filter((d) => d.id !== 'all')
      .map((d) => `<option value="${d.id}">${d.name}</option>`)
      .join('');
  }

  if (categorySelect) {
    categorySelect.innerHTML = window.categories
      .filter((c) => c.id !== 'all')
      .map((c) => `<option value="${c.id}">${c.name}</option>`)
      .join('');
  }
}

function updateImagePreview(url) {
  if (!imagePreview) return;
  const targetUrl = url && url.trim() !== '' ? url.trim() : window.fallbackImage;
  imagePreview.src = targetUrl;
  imagePreview.onerror = () => {
    imagePreview.src = window.fallbackImage;
  };
}

function renderDashboardProducts() {
  if (!tableBody) return;

  if (dashboardState.products.length === 0) {
    tableBody.innerHTML = `
      <tr>
        <td colspan="6" class="px-6 py-12 text-center text-secondaryText">
          <p class="text-base font-bold text-primaryText">ยังไม่มีสินค้าในคลัง</p>
          <p class="text-xs text-secondaryText mt-1">คลิกปุ่ม "+ เพิ่มสินค้าใหม่" ด้านบนเพื่อเพิ่มสินค้าชิ้นแรกของคุณ</p>
        </td>
      </tr>
    `;
    return;
  }

  tableBody.innerHTML = dashboardState.products
    .map((product) => {
      return `
        <tr class="hover:bg-surface-sage/30 transition-colors">
          <td class="px-4 py-3.5 whitespace-nowrap">
            <img
              src="${product.imageUrl || window.fallbackImage}"
              alt="${product.name}"
              onerror="this.src=window.fallbackImage"
              class="h-12 w-12 rounded-xl object-cover border border-subtle bg-sage-light"
            />
          </td>
          <td class="px-4 py-3.5">
            <p class="font-bold text-primaryText line-clamp-1">${product.name}</p>
            <p class="text-xs text-secondaryText line-clamp-1 mt-0.5">${product.merchantName}</p>
          </td>
          <td class="px-4 py-3.5 whitespace-nowrap">
            <span class="badge-category inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold">
              ${product.categoryName || 'ของดีพื้นถิ่น'}
            </span>
          </td>
          <td class="px-4 py-3.5 whitespace-nowrap text-primaryText font-medium">
            ${product.districtName}
          </td>
          <td class="px-4 py-3.5 whitespace-nowrap font-bold font-numeric text-price">
            ฿${Number(product.price).toLocaleString()}
          </td>
          <td class="px-4 py-3.5 whitespace-nowrap text-right">
            <div class="inline-flex items-center gap-2">
              <button
                class="btn-secondary px-3 py-1.5 text-xs"
                data-edit-id="${product.id}"
              >
                แก้ไข
              </button>
              <button
                class="rounded-full border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-700 transition hover:bg-red-100 hover:border-red-300"
                data-delete-id="${product.id}"
                aria-label="ลบสินค้า ${product.name}"
              >
                ลบ
              </button>
            </div>
          </td>
        </tr>
      `;
    })
    .join('');
}

function openModal(isEdit = false, product = null) {
  if (!modal || !productForm) return;

  productForm.reset();

  if (isEdit && product) {
    modalFormBadge.textContent = 'แก้ไขข้อมูลสินค้า';
    modalFormTitle.textContent = 'แก้ไขสินค้าในคลัง';
    productIdInput.value = product.id;
    document.getElementById('name').value = product.name || '';
    document.getElementById('merchantName').value = product.merchantName || '';
    document.getElementById('price').value = product.price || '';
    document.getElementById('district').value = product.districtId || 'ubon';
    document.getElementById('category').value = product.categoryId || 'souvenirs';
    document.getElementById('otopStars').value = product.otopStars || '5';
    document.getElementById('phone').value = product.phone || '';
    document.getElementById('lineId').value = product.lineId || '';
    document.getElementById('address').value = product.address || '';
    document.getElementById('description').value = product.description || '';
    document.getElementById('imageUrl').value = product.imageUrl || '';
    updateImagePreview(product.imageUrl);
  } else {
    modalFormBadge.textContent = 'เพิ่มสินค้าใหม่';
    modalFormTitle.textContent = 'กรอกข้อมูลสินค้า';
    productIdInput.value = '';
    updateImagePreview(window.fallbackImage);
  }

  modal.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  modal?.classList.add('hidden');
  document.body.style.overflow = '';
  productForm?.reset();
  updateImagePreview(window.fallbackImage);
}

function handleFormSubmit(event) {
  event.preventDefault();

  const formData = new FormData(productForm);
  const existingId = formData.get('id');

  const districtId = formData.get('district').toString();
  const districtName = window.districts.find((d) => d.id === districtId)?.name || 'ไม่ระบุ';

  const categoryId = formData.get('category').toString();
  const categoryName = window.categories.find((c) => c.id === categoryId)?.name || 'ของฝากทั่วไป';

  const productData = {
    id: existingId ? Number(existingId) : undefined,
    name: formData.get('name').toString().trim(),
    merchantName: formData.get('merchantName').toString().trim(),
    price: Number(formData.get('price')),
    districtId,
    districtName,
    categoryId,
    categoryName,
    otopStars: Number(formData.get('otopStars') || 5),
    phone: formData.get('phone')?.toString().trim() || '',
    lineId: formData.get('lineId')?.toString().trim() || '',
    address: formData.get('address')?.toString().trim() || '',
    description: formData.get('description')?.toString().trim() || '',
    imageUrl: formData.get('imageUrl')?.toString().trim() || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=900&q=80'
  };

  if (!productData.name || !productData.merchantName || !productData.price) {
    alert('กรุณากรอกชื่อสินค้า ชื่อร้านค้า และราคาให้ครบถ้วน');
    return;
  }

  if (window.UbonStore) {
    dashboardState.products = window.UbonStore.saveProduct(productData);
  }

  renderStats();
  renderDashboardProducts();
  closeModal();
  showToast(existingId ? 'บันทึกการแก้ไขสินค้าสำเร็จ' : 'เพิ่มสินค้าใหม่ลงในคลังสำเร็จ');
}

function promptDelete(productId) {
  const product = dashboardState.products.find((p) => Number(p.id) === Number(productId));
  if (!product || !deleteModal) return;

  dashboardState.productToDeleteId = Number(productId);
  deleteModalText.textContent = `คุณแน่ใจหรือไม่ว่าต้องการลบรายการ "${product.name}" (${product.districtName})? การดำเนินการนี้จะถูกลบออกจากหน้าร้านทันที`;
  deleteModal.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
}

function closeDeleteModal() {
  deleteModal?.classList.add('hidden');
  document.body.style.overflow = '';
  dashboardState.productToDeleteId = null;
}

function handleDeleteConfirm() {
  if (!dashboardState.productToDeleteId) return;

  if (window.UbonStore) {
    dashboardState.products = window.UbonStore.deleteProduct(dashboardState.productToDeleteId);
  }

  renderStats();
  renderDashboardProducts();
  closeDeleteModal();
  showToast('ลบสินค้าออกจากคลังสำเร็จ', 'danger');
}

// Event Listeners
tableBody?.addEventListener('click', (event) => {
  const editBtn = event.target.closest('[data-edit-id]');
  if (editBtn) {
    const id = Number(editBtn.dataset.editId);
    const product = dashboardState.products.find((p) => Number(p.id) === id);
    if (product) {
      openModal(true, product);
    }
    return;
  }

  const deleteBtn = event.target.closest('[data-delete-id]');
  if (deleteBtn) {
    const id = Number(deleteBtn.dataset.deleteId);
    promptDelete(id);
  }
});

addProductBtn?.addEventListener('click', () => openModal(false));
closeModalBtn?.addEventListener('click', closeModal);
cancelModalBtn?.addEventListener('click', closeModal);
modal?.addEventListener('click', (e) => {
  if (e.target === modal) closeModal();
});

productForm?.addEventListener('submit', handleFormSubmit);

imageUrlInput?.addEventListener('input', (e) => {
  updateImagePreview(e.target.value);
});

// Delete modal listeners
cancelDeleteBtn?.addEventListener('click', closeDeleteModal);
confirmDeleteBtn?.addEventListener('click', handleDeleteConfirm);
deleteModal?.addEventListener('click', (e) => {
  if (e.target === deleteModal) closeDeleteModal();
});

resetDashboardDataBtn?.addEventListener('click', () => {
  if (confirm('ต้องการรีเซ็ตข้อมูลสินค้าทั้งหมดกลับเป็นค่าเริ่มต้นหรือไม่?')) {
    if (window.UbonStore) {
      dashboardState.products = window.UbonStore.resetToDefault();
    }
    renderStats();
    renderDashboardProducts();
    showToast('รีเซ็ตข้อมูลตัวอย่างเริ่มต้นสำเร็จ');
  }
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    if (!modal?.classList.contains('hidden')) closeModal();
    if (!deleteModal?.classList.contains('hidden')) closeDeleteModal();
  }
});

// Initial Bootstrap
document.addEventListener('DOMContentLoaded', () => {
  loadDashboardData();
  populateSelectOptions();
  renderStats();
  renderDashboardProducts();
});
