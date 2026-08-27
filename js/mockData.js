const districts = [
  { id: 'all', name: 'ทุกอำเภอ' },
  { id: 'ubon', name: 'เมืองอุบลฯ' },
  { id: 'khongjiam', name: 'โขงเจียม' },
  { id: 'warin', name: 'วารินชำราบ' },
  { id: 'phibun', name: 'พิบูลมังสาหาร' },
  { id: 'sawang', name: 'สว่างวีระวงศ์' }
];

const categories = [
  { id: 'all', name: 'ทั้งหมด' },
  { id: 'textiles', name: 'ผ้าทอ/เครื่องแต่งกาย' },
  { id: 'food', name: 'อาหาร/ของกินพื้นถิ่น' },
  { id: 'crafts', name: 'งานจักสาน/หัตถกรรม' },
  { id: 'herbs', name: 'สมุนไพร/สุขภาพ' },
  { id: 'jewelry', name: 'เครื่องประดับ/ของที่ระลึก' },
  { id: 'souvenirs', name: 'ของฝากทั่วไป' }
];

const initialProducts = [
  {
    id: 1,
    name: 'ผ้าทอมือย้อมครามลายกาบบัว',
    merchantName: 'กลุ่มทอผ้าโบราณบ้านโขงเจียม',
    price: 850,
    districtId: 'khongjiam',
    districtName: 'โขงเจียม',
    categoryId: 'textiles',
    categoryName: 'ผ้าทอ/เครื่องแต่งกาย',
    otopStars: 5,
    description: 'ผ้าทอมือลายเอกลักษณ์ประจำจังหวัดอุบลราชธานี ลวดลายประณีต ย้อมด้วยสีครามธรรมชาติจากลำน้ำโขง เนื้อผ้านุ่ม ระบายอากาศได้ดีเยี่ยม เหมาะสำหรับตัดชุดไทยหรือเป็นของขวัญมงคล',
    phone: '081-234-5678',
    lineId: '@khongjiamcraft',
    address: 'หมู่ 2 ต.โขงเจียม อ.โขงเจียม จ.อุบลราชธานี',
    imageUrl: 'JPG/ผ้าทอมือย้อมครามลายกาบบัว.jpg'
  },
  {
    id: 2,
    name: 'น้ำพริกกะปิปลาแม่น้ำมูลสูตรโบราณ',
    merchantName: 'วิสาหกิจชุมชนวารินร่วมใจ',
    price: 85,
    districtId: 'warin',
    districtName: 'วารินชำราบ',
    categoryId: 'food',
    categoryName: 'อาหาร/ของกินพื้นถิ่น',
    otopStars: 4,
    description: 'น้ำพริกกะปิปลาแม่น้ำมูลแท้ หอมกลิ่นเคยธรรมชาติและปลาเนื้ออ่อนย่างเตาถ่าน รสชาติกลมกล่อม เผ็ดกำลังดี ไม่ใส่วัตถุกันเสีย ทานคู่กับผักเคียงริมมูล',
    phone: '089-876-5432',
    lineId: '@warinfood',
    address: 'ตลาดสดวารินชำราบ อ.วารินชำราบ จ.อุบลราชธานี',
    imageUrl: 'JPG/น้ำพริกกะปิปลาแม่น้ำมูลสูตรโบราณ.jpg'
  },
  {
    id: 3,
    name: 'หมูยอพริกไทยดำเมืองอุบล',
    merchantName: 'ร้านหมูยอเป็นหนึ่ง',
    price: 180,
    districtId: 'ubon',
    districtName: 'เมืองอุบลฯ',
    categoryId: 'food',
    categoryName: 'อาหาร/ของกินพื้นถิ่น',
    otopStars: 5,
    description: 'หมูยอสูตรดั้งเดิมเมืองอุบลฯ เนื้อหมูแท้แน่นเด้ง หอมพริกไทยดำแท้จากสวน ห่อด้วยใบตองสดนึ่งจนหอมกรุ่น ของฝากยอดนิยมอันดับหนึ่งของผู้มาเยือนอุบลราชธานี',
    phone: '045-241-111',
    lineId: '@baankhamubon',
    address: 'ถ.สรรพสิทธิ์ ต.ในเมือง อ.เมือง จ.อุบลราชธานี',
    imageUrl: 'JPG/หมูยอพริกไทยดำเมืองอุบลฯjpg.jpg'
  },
  {
    id: 4,
    name: 'ซาลาเปาโบราณไส้หมูสับไข่เค็มแก่งสะพือ',
    merchantName: 'ซาลาเปาแม่ประไพ พิบูลมังสาหาร',
    price: 120,
    districtId: 'phibun',
    districtName: 'พิบูลมังสาหาร',
    categoryId: 'food',
    categoryName: 'อาหาร/ของกินพื้นถิ่น',
    otopStars: 4,
    description: 'ซาลาเปาแป้งหมักสูตรโบราณนุ่มละมุน ไส้หมูสับหมักพริกไทยเข้มข้น ไข่เค็มแดงมันเต็มลูก จุดเด่นของฝากเลื่องชื่อเมื่อแวะเที่ยวแก่งสะพือ',
    phone: '087-654-3210',
    lineId: '@praphai_phibun',
    address: 'หน้าแก่งสะพือ อ.พิบูลมังสาหาร จ.อุบลราชธานี',
    imageUrl: 'JPG/ซาลาเปาโบราณไส้หมูสับไข่เค็มแก่งสะพือ.jpg'
  },
  {
    id: 5,
    name: 'เครื่องจักสาน',
    merchantName: 'พ่อใหญ่ลีจักสานทุ่งเพียง',
    price: 150,
    districtId: 'sawang',
    districtName: 'สว่างวีระวงศ์',
    categoryId: 'crafts',
    categoryName: 'งานจักสาน/หัตถกรรม',
    otopStars: 5,
    description: 'เครื่องจักสาน อ.สว่างวีระวงศ์ ฝีมือปราณีตจากไม้ไผ่และคล้าธรรมชาติ เหมาะสำหรับตกแต่งบ้านหรือใช้งานจริง แข็งแรงทนทาน ลายมัดหมี่สวยงามเป็นเอกลักษณ์ จากพ่อใหญ่ลี ประสบการณ์กว่า 30 ปี',
    phone: '086-345-6789',
    lineId: '@sawangorganic',
    address: 'หมู่ 4 ต.สว่าง อ.สว่างวีระวงศ์ จ.อุบลราชธานี',
    imageUrl: 'JPG/เครื่องจักสาน.jpg'
  }
];

// Fallback Placeholder SVG matching Warm Cream / Soft Sage Palette
const fallbackImage = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'%3E%3Crect width='400' height='300' fill='%23F8F6F0'/%3E%3Crect x='10' y='10' width='380' height='280' rx='12' fill='%23E7F1EA' stroke='%23D9E2DD' stroke-width='1.5'/%3E%3Ccircle cx='160' cy='120' r='24' fill='%23087A5B' fill-opacity='0.25'/%3E%3Cpath d='M130 190l40-50 35 40 45-60 50 70H130z' fill='%23087A5B' fill-opacity='0.35'/%3E%3Ctext x='50%25' y='225' font-family='Prompt, sans-serif' font-size='14' font-weight='600' fill='%23172B26' text-anchor='middle'%3EUbon Local OTOP%3C/text%3E%3Ctext x='50%25' y='245' font-family='Prompt, sans-serif' font-size='11' fill='%2368756F' text-anchor='middle'%3Eของดีชุมชนเมืองอุบลฯ%3C/text%3E%3C/svg%3E";

const STORAGE_KEY = 'ubon_products_store_v5';

// Unified Store Manager
const UbonStore = {
  getProducts() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('LocalStorage not available, falling back to initial data', e);
    }
    // Initialize default if empty
    this.resetToDefault();
    return [...initialProducts];
  },

  saveProduct(productData) {
    const products = this.getProducts();
    const isEdit = Boolean(productData.id);
    let updated;

    if (isEdit) {
      updated = products.map((p) => (Number(p.id) === Number(productData.id) ? { ...p, ...productData } : p));
    } else {
      const newProduct = {
        ...productData,
        id: Date.now()
      };
      updated = [newProduct, ...products];
    }

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to save to localStorage', e);
    }

    return updated;
  },

  deleteProduct(productId) {
    const products = this.getProducts();
    const updated = products.filter((p) => Number(p.id) !== Number(productId));
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to delete from localStorage', e);
    }
    return updated;
  },

  resetToDefault() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initialProducts));
    } catch (e) {
      console.error('Failed to reset localStorage', e);
    }
    return [...initialProducts];
  },

  getStats() {
    const products = this.getProducts();
    const totalItems = products.length;
    const totalValue = products.reduce((sum, p) => sum + (Number(p.price) || 0), 0);
    const activeDistricts = new Set(products.map((p) => p.districtId)).size;

    return {
      totalItems,
      totalValue,
      activeDistricts
    };
  }
};

window.districts = districts;
window.categories = categories;
window.initialProducts = initialProducts;
window.fallbackImage = fallbackImage;
window.UbonStore = UbonStore;
