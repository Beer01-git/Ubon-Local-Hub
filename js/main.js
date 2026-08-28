const state = {
  selectedDistrict: 'all',
  selectedCategory: 'all',
  searchQuery: '',
  products: []
};

// DOM Elements
const searchInput = document.getElementById('search-input');
const clearSearchBtn = document.getElementById('clear-search-btn');
const categoryFiltersContainer = document.getElementById('category-filters');
const districtFiltersContainer = document.getElementById('district-filters');
const productGrid = document.getElementById('product-grid');
const resultsCount = document.getElementById('results-count');
const activeFilterTags = document.getElementById('active-filter-tags');
const heroTotalCount = document.getElementById('hero-total-count');
const heroDistrictCount = document.getElementById('hero-district-count');
const resetFiltersBtn = document.getElementById('reset-filters-btn');
const resetDataBtn = document.getElementById('reset-data-btn');
const toastContainer = document.getElementById('toast-container');

// Modal Elements
const detailModal = document.getElementById('product-detail-modal');
const closeDetailModalBtn = document.getElementById('close-detail-modal');
const modalImage = document.getElementById('modal-image');
const modalOtopBadge = document.getElementById('modal-otop-badge');
const modalCategory = document.getElementById('modal-category');
const modalDistrict = document.getElementById('modal-district');
const modalPrice = document.getElementById('modal-price');
const modalTitle = document.getElementById('modal-title');
const modalMerchant = document.getElementById('modal-merchant');
const modalDescription = document.getElementById('modal-description');
const modalAddress = document.getElementById('modal-address');
const modalPhoneBtn = document.getElementById('modal-phone-btn');
const modalLineBtn = document.getElementById('modal-line-btn');
const modalCopyBtn = document.getElementById('modal-copy-btn');

// About Website Modal Elements
const aboutModal = document.getElementById('about-website-modal');
const aboutWebsiteBtn = document.getElementById('about-website-btn');
const closeAboutModalBtn = document.getElementById('close-about-modal');
const closeAboutModalFooterBtn = document.getElementById('close-about-modal-btn');

function showToast(message, type = 'success') {
  if (!toastContainer) return;

  const toast = document.createElement('div');
  const bgColor = type === 'success' ? 'bg-[#087A5B] text-white' : 'bg-[#172B26] text-white';
  const icon = type === 'success' ? '✓' : 'ℹ';

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

function loadProducts() {
  state.products = window.UbonStore ? window.UbonStore.getProducts() : [...window.initialProducts];
}

function renderHeroStats() {
  if (!heroTotalCount) return;
  const stats = window.UbonStore ? window.UbonStore.getStats() : { totalItems: state.products.length, activeDistricts: 4 };
  heroTotalCount.textContent = `${stats.totalItems} รายการ`;
  if (heroDistrictCount) {
    heroDistrictCount.textContent = `${stats.activeDistricts} อำเภอ`;
  }
}

function renderCategoryFilters() {
  if (!categoryFiltersContainer) return;

  categoryFiltersContainer.innerHTML = window.categories
    .map((cat) => {
      const isActive = state.selectedCategory === cat.id;
      return `
        <button
          type="button"
          class="inline-flex items-center rounded-full border px-3.5 py-1.5 text-xs font-semibold transition ${
            isActive ? 'chip-active shadow-sm' : 'chip-inactive'
          }"
          data-category="${cat.id}"
        >
          <span>${cat.name}</span>
        </button>
      `;
    })
    .join('');
}

function renderDistrictFilters() {
  if (!districtFiltersContainer) return;

  districtFiltersContainer.innerHTML = window.districts
    .map((district) => {
      const isActive = state.selectedDistrict === district.id;

      // Calculate count for this district
      let count = 0;
      if (district.id === 'all') {
        count = state.products.length;
      } else {
        count = state.products.filter((p) => p.districtId === district.id).length;
      }

      return `
        <button
          type="button"
          class="inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-semibold transition ${
            isActive ? 'chip-active shadow-sm' : 'chip-inactive'
          }"
          data-district="${district.id}"
        >
          <span>${district.name}</span>
          <span class="rounded-full px-1.5 py-0.2 text-[10px] font-bold font-numeric ${
            isActive ? 'bg-white/25 text-white' : 'bg-surface-sage text-emerald-deep'
          }">
            ${count}
          </span>
        </button>
      `;
    })
    .join('');
}

function getFilteredProducts() {
  return state.products.filter((product) => {
    // District match
    const matchesDistrict = state.selectedDistrict === 'all' || product.districtId === state.selectedDistrict;

    // Category match
    const matchesCategory = state.selectedCategory === 'all' || product.categoryId === state.selectedCategory;

    // Search query match
    let matchesSearch = true;
    if (state.searchQuery.trim() !== '') {
      const query = state.searchQuery.toLowerCase().trim();
      const name = (product.name || '').toLowerCase();
      const merchant = (product.merchantName || '').toLowerCase();
      const district = (product.districtName || '').toLowerCase();
      const desc = (product.description || '').toLowerCase();
      matchesSearch = name.includes(query) || merchant.includes(query) || district.includes(query) || desc.includes(query);
    }

    return matchesDistrict && matchesCategory && matchesSearch;
  });
}

function renderProducts() {
  if (!productGrid) return;

  const filtered = getFilteredProducts();

  // Results count
  if (resultsCount) {
    resultsCount.textContent = `พบสินค้า ${filtered.length} รายการ จากทั้งหมด ${state.products.length} รายการ`;
  }

  // Active filters badges
  if (activeFilterTags) {
    const tags = [];
    if (state.selectedDistrict !== 'all') {
      const dName = window.districts.find((d) => d.id === state.selectedDistrict)?.name || state.selectedDistrict;
      tags.push(`อำเภอ: ${dName}`);
    }
    if (state.selectedCategory !== 'all') {
      const cName = window.categories.find((c) => c.id === state.selectedCategory)?.name || state.selectedCategory;
      tags.push(`หมวดหมู่: ${cName}`);
    }
    if (state.searchQuery) {
      tags.push(`คำค้น: "${state.searchQuery}"`);
    }

    activeFilterTags.innerHTML = tags
      .map(
        (t) => `
          <span class="inline-flex items-center gap-1 rounded-full border border-subtle bg-white px-2.5 py-0.5 text-[11px] font-medium text-secondaryText">
            ${t}
          </span>
        `
      )
      .join('');
  }

  if (filtered.length === 0) {
    productGrid.innerHTML = `
      <div class="col-span-full rounded-2xl border border-dashed border-subtle bg-white p-12 text-center">
        <div class="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-surface-sage text-emerald-deep text-xl font-bold">
          !
        </div>
        <h3 class="mt-4 text-base font-bold text-primaryText">ไม่พบสินค้าที่ตรงตามเงื่อนไข</h3>
        <p class="mt-1 text-sm text-secondaryText max-w-md mx-auto">
          ลองเปลี่ยนคำค้นหา หรือเลือกอำเภอและหมวดหมู่อื่นเพื่อค้นหาของดีเมืองอุบลฯ
        </p>
        <button
          id="empty-reset-btn"
          class="btn-primary mt-5 px-5 py-2 text-xs shadow-sm"
        >
          ล้างตัวกรองทั้งหมด
        </button>
      </div>
    `;

    document.getElementById('empty-reset-btn')?.addEventListener('click', resetAllFilters);
    return;
  }

  productGrid.innerHTML = filtered
    .map((product) => {
      const starRating = product.otopStars ? '★'.repeat(product.otopStars) : '★'.repeat(5);
      const otopLabel = product.otopStars ? `OTOP ${product.otopStars} ดาว` : 'OTOP คุณภาพ';

      return `
        <article
          class="card-product group cursor-pointer overflow-hidden flex flex-col justify-between"
          data-product-id="${product.id}"
        >
          <div>
            <!-- Product Thumbnail: 4:3 Ratio Visual Anchor -->
            <div class="relative aspect-[4/3] w-full overflow-hidden bg-sage-light">
              <img
                src="${product.imageUrl || window.fallbackImage}"
                alt="${product.name}"
                loading="lazy"
                onerror="this.src=window.fallbackImage"
                class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div class="absolute top-3 left-3 rounded-full bg-black/60 px-2.5 py-0.5 text-[11px] font-semibold text-white backdrop-blur-sm">
                ${product.districtName}
              </div>
              <div class="badge-otop absolute bottom-3 right-3 rounded-full px-2.5 py-0.5 text-[11px] font-bold shadow-sm">
                ${otopLabel}
              </div>
            </div>

            <!-- Content -->
            <div class="p-5">
              <div class="flex items-center justify-between gap-2">
                <span class="badge-category rounded-full px-2.5 py-0.5 text-[11px] font-semibold">
                  ${product.categoryName || 'ของดีพื้นถิ่น'}
                </span>
                <span class="text-xs text-rating tracking-wider">${starRating}</span>
              </div>

              <h3 class="mt-3 text-base font-bold text-primaryText line-clamp-2 leading-snug group-hover:text-emerald-deep transition-colors">
                ${product.name}
              </h3>
              
              <p class="mt-1.5 text-xs text-secondaryText flex items-center gap-1">
                <span></span>
                <span class="truncate font-medium">${product.merchantName}</span>
              </p>

              <p class="mt-2.5 text-xs text-secondaryText line-clamp-2 leading-relaxed">
                ${product.description || 'สินค้าคุณภาพคัดสรรจากภูมิปัญญาท้องถิ่นอุบลราชธานี'}
              </p>
            </div>
          </div>

          <!-- Card Footer -->
          <div class="border-t border-subtle px-5 py-3.5 flex items-center justify-between bg-surface-sage/40">
            <div>
              <span class="text-[11px] text-secondaryText">ราคา</span>
              <p class="text-base font-bold font-numeric text-price">฿${Number(product.price).toLocaleString()}</p>
            </div>
            <span class="btn-primary px-3.5 py-1.5 text-xs shadow-sm">
              ดูข้อมูล / สั่งซื้อ →
            </span>
          </div>
        </article>
      `;
    })
    .join('');
}

function openDetailModal(productId) {
  const product = state.products.find((p) => Number(p.id) === Number(productId));
  if (!product || !detailModal) return;

  modalImage.src = product.imageUrl || window.fallbackImage;
  modalImage.onerror = () => {
    modalImage.src = window.fallbackImage;
  };
  modalOtopBadge.textContent = product.otopStars ? `⭐ OTOP ${product.otopStars} ดาว` : '⭐ OTOP คุณภาพ';
  modalCategory.textContent = product.categoryName || 'ของดีพื้นถิ่น';
  modalDistrict.textContent = `อ.${product.districtName}`;
  modalPrice.textContent = `฿${Number(product.price).toLocaleString()}`;
  modalTitle.textContent = product.name;
  modalMerchant.textContent = product.merchantName;
  modalDescription.textContent = product.description || 'สินค้า OTOP คุณภาพจากผู้ผลิตและกลุ่มวิสาหกิจชุมชนในจังหวัดอุบลราชธานี ผลิตด้วยความใส่ใจและอนุรักษ์ภูมิปัญญาท้องถิ่น';
  modalAddress.textContent = product.address || `อำเภอ${product.districtName} จังหวัดอุบลราชธานี`;

  // Contact links
  const cleanPhone = (product.phone || '045-000-000').replace(/[^0-9]/g, '');
  modalPhoneBtn.href = `tel:${cleanPhone}`;

  const cleanLine = (product.lineId || '@ubonhub').replace('@', '');
  modalLineBtn.href = `https://line.me/R/ti/p/~${cleanLine}`;

  modalCopyBtn.onclick = () => {
    const textToCopy = `สินค้า: ${product.name}\nราคา: ฿${product.price}\nร้าน: ${product.merchantName}\nเบอร์โทร: ${product.phone || 'ไม่ระบุ'}\nLINE: ${product.lineId || 'ไม่ระบุ'}\nอำเภอ${product.districtName} จ.อุบลราชธานี`;
    navigator.clipboard.writeText(textToCopy).then(() => {
      showToast('คัดลอกข้อมูลสินค้าและร้านค้าแล้ว');
    });
  };

  detailModal.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
}

function closeDetailModal() {
  detailModal?.classList.add('hidden');
  document.body.style.overflow = '';
}

function resetAllFilters() {
  state.selectedDistrict = 'all';
  state.selectedCategory = 'all';
  state.searchQuery = '';
  if (searchInput) searchInput.value = '';
  clearSearchBtn?.classList.add('hidden');
  render();
}

function render() {
  renderHeroStats();
  renderCategoryFilters();
  renderDistrictFilters();
  renderProducts();
}

function openAboutModal() {
  if (!aboutModal) return;
  aboutModal.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
}

function closeAboutModal() {
  if (!aboutModal) return;
  aboutModal.classList.add('hidden');
  if (detailModal?.classList.contains('hidden')) {
    document.body.style.overflow = '';
  }
}

// Event Listeners
document.querySelectorAll('.open-about-trigger').forEach((el) => {
  el.addEventListener('click', (e) => {
    e.preventDefault();
    openAboutModal();
  });
});
closeAboutModalBtn?.addEventListener('click', closeAboutModal);
closeAboutModalFooterBtn?.addEventListener('click', closeAboutModal);
aboutModal?.addEventListener('click', (e) => {
  if (e.target === aboutModal) {
    closeAboutModal();
  }
});

categoryFiltersContainer?.addEventListener('click', (e) => {
  const btn = e.target.closest('[data-category]');
  if (!btn) return;
  state.selectedCategory = btn.dataset.category;
  render();
});

districtFiltersContainer?.addEventListener('click', (e) => {
  const btn = e.target.closest('[data-district]');
  if (!btn) return;
  state.selectedDistrict = btn.dataset.district;
  render();
});

searchInput?.addEventListener('input', (e) => {
  state.searchQuery = e.target.value;
  if (state.searchQuery) {
    clearSearchBtn?.classList.remove('hidden');
  } else {
    clearSearchBtn?.classList.add('hidden');
  }
  renderProducts();
});

clearSearchBtn?.addEventListener('click', () => {
  if (searchInput) searchInput.value = '';
  state.searchQuery = '';
  clearSearchBtn.classList.add('hidden');
  renderProducts();
});

resetFiltersBtn?.addEventListener('click', resetAllFilters);

resetDataBtn?.addEventListener('click', () => {
  if (confirm('ต้องการรีเซ็ตข้อมูลสินค้าทั้งหมดกลับเป็นค่าเริ่มต้นหรือไม่?')) {
    if (window.UbonStore) {
      window.UbonStore.resetToDefault();
    }
    loadProducts();
    resetAllFilters();
    showToast('รีเซ็ตข้อมูลตัวอย่างเริ่มต้นสำเร็จ');
  }
});

productGrid?.addEventListener('click', (e) => {
  const card = e.target.closest('[data-product-id]');
  if (!card) return;
  openDetailModal(Number(card.dataset.productId));
});

closeDetailModalBtn?.addEventListener('click', closeDetailModal);
detailModal?.addEventListener('click', (e) => {
  if (e.target === detailModal) {
    closeDetailModal();
  }
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    if (!aboutModal?.classList.contains('hidden')) {
      closeAboutModal();
    } else if (!detailModal?.classList.contains('hidden')) {
      closeDetailModal();
    }
  }
});

// Initial Bootstrap
document.addEventListener('DOMContentLoaded', () => {
  loadProducts();
  render();
});

