import tehPoci from "../assets/products/teh-poci.png";

export const products = [
  // =========================================================
  // 1. BAHAN POKOK
  // categoryId: 1
  // =========================================================
  {
    id: 1,
    name: "Beras Premium 5 Kg",
    categoryId: 1,
    category: "Bahan Pokok",
    price: 75000,
    stock: 20,
    image: tehPoci,
    brand: "Topik",
    variant: "Premium",
    weight: "5 Kg",
    description:
      "Beras premium berkualitas untuk kebutuhan sehari-hari.",
  },

  {
    id: 2,
    name: "Minyak Goreng 2 L",
    categoryId: 1,
    category: "Bahan Pokok",
    price: 36000,
    stock: 25,
    image: tehPoci,
    brand: "Sunco",
    variant: "Minyak Goreng",
    weight: "2 L",
    description:
      "Minyak goreng untuk kebutuhan memasak sehari-hari.",
  },

  {
    id: 3,
    name: "Gula Pasir 1 Kg",
    categoryId: 1,
    category: "Bahan Pokok",
    price: 18000,
    stock: 30,
    image: tehPoci,
    brand: "Gulaku",
    variant: "Premium",
    weight: "1 Kg",
    description:
      "Gula pasir berkualitas dengan rasa manis yang pas.",
  },

  {
    id: 4,
    name: "Tepung Terigu 1 Kg",
    categoryId: 1,
    category: "Bahan Pokok",
    price: 14000,
    stock: 25,
    image: tehPoci,
    brand: "Segitiga Biru",
    variant: "Serbaguna",
    weight: "1 Kg",
    description:
      "Tepung terigu serbaguna untuk berbagai kebutuhan memasak.",
  },

  {
    id: 5,
    name: "Garam Halus 500 gr",
    categoryId: 1,
    category: "Bahan Pokok",
    price: 7000,
    stock: 40,
    image: tehPoci,
    brand: "Refina",
    variant: "Garam Halus",
    weight: "500 gr",
    description:
      "Garam halus untuk melengkapi berbagai masakan.",
  },

  // =========================================================
  // 2. KEBUTUHAN RUMAH TANGGA
  // categoryId: 2
  // =========================================================
  {
    id: 6,
    name: "Tisu Wajah 250 Sheets",
    categoryId: 2,
    category: "Kebutuhan Rumah Tangga",
    price: 16000,
    stock: 30,
    image: tehPoci,
    brand: "Paseo",
    variant: "Tisu Wajah",
    weight: "250 Sheets",
    description:
      "Tisu lembut untuk kebutuhan sehari-hari di rumah.",
  },

  {
    id: 7,
    name: "Kantong Sampah 30 L",
    categoryId: 2,
    category: "Kebutuhan Rumah Tangga",
    price: 18000,
    stock: 20,
    image: tehPoci,
    brand: "Lucky",
    variant: "Ukuran 30 L",
    weight: "30 L",
    description:
      "Kantong sampah praktis untuk menjaga rumah tetap bersih.",
  },

  {
    id: 8,
    name: "Aluminium Foil 8 m",
    categoryId: 2,
    category: "Kebutuhan Rumah Tangga",
    price: 22000,
    stock: 15,
    image: tehPoci,
    brand: "Klin Pak",
    variant: "Aluminium Foil",
    weight: "8 m",
    description:
      "Aluminium foil untuk membungkus dan menyimpan makanan.",
  },

  {
    id: 9,
    name: "Plastik Wrap 30 cm",
    categoryId: 2,
    category: "Kebutuhan Rumah Tangga",
    price: 20000,
    stock: 18,
    image: tehPoci,
    brand: "Cling Wrap",
    variant: "Plastik Wrap",
    weight: "30 cm",
    description:
      "Plastik pembungkus makanan yang praktis digunakan.",
  },

  {
    id: 10,
    name: "Spons Cuci Piring 3 Pcs",
    categoryId: 2,
    category: "Kebutuhan Rumah Tangga",
    price: 10000,
    stock: 35,
    image: tehPoci,
    brand: "Scotch-Brite",
    variant: "3 Pcs",
    weight: "3 Pcs",
    description:
      "Spons untuk membantu membersihkan peralatan makan.",
  },

  // =========================================================
  // 3. MAKANAN
  // categoryId: 3
  // =========================================================
  {
    id: 11,
    name: "Indomie Mi Goreng Original",
    categoryId: 3,
    category: "Makanan",
    price: 3500,
    stock: 50,
    image: tehPoci,
    brand: "Indomie",
    variant: "Mi Goreng Original",
    weight: "85 gr",
    description:
      "Mi instan rasa gurih yang praktis untuk dinikmati kapan saja.",
  },

  {
    id: 12,
    name: "Roti Tawar Gandum",
    categoryId: 3,
    category: "Makanan",
    price: 18000,
    stock: 25,
    image: tehPoci,
    brand: "Sari Roti",
    variant: "Gandum",
    weight: "350 gr",
    description:
      "Roti tawar berbahan gandum yang cocok untuk sarapan.",
  },

  {
    id: 13,
    name: "Biskuit Cokelat 200 gr",
    categoryId: 3,
    category: "Makanan",
    price: 12000,
    stock: 30,
    image: tehPoci,
    brand: "Roma",
    variant: "Cokelat",
    weight: "200 gr",
    description:
      "Biskuit renyah dengan rasa cokelat yang cocok untuk camilan.",
  },

  {
    id: 14,
    name: "Keripik Kentang Original",
    categoryId: 3,
    category: "Makanan",
    price: 15000,
    stock: 20,
    image: tehPoci,
    brand: "Chitato",
    variant: "Original",
    weight: "68 gr",
    description:
      "Keripik kentang renyah untuk menemani waktu santai.",
  },

  {
    id: 15,
    name: "Sereal Cokelat 300 gr",
    categoryId: 3,
    category: "Makanan",
    price: 32000,
    stock: 12,
    image: tehPoci,
    brand: "Koko Krunch",
    variant: "Cokelat",
    weight: "300 gr",
    description:
      "Sereal cokelat yang praktis untuk menu sarapan.",
  },

  // =========================================================
  // 4. MINUMAN
  // categoryId: 4
  // =========================================================
  {
    id: 16,
    name: "Teh Poci Teh Celup 50 gr",
    categoryId: 4,
    category: "Minuman",
    price: 12000,
    stock: 20,
    image: tehPoci,
    brand: "Teh Poci",
    variant: "Teh Celup",
    weight: "50 gr",
    description:
      "Teh celup dengan cita rasa khas Teh Poci.",
  },

  {
    id: 17,
    name: "Teh Poci Teh Celup 100 gr",
    categoryId: 4,
    category: "Minuman",
    price: 22000,
    stock: 15,
    image: tehPoci,
    brand: "Teh Poci",
    variant: "Teh Celup",
    weight: "100 gr",
    description:
      "Teh celup kemasan lebih besar untuk stok di rumah.",
  },

  {
    id: 18,
    name: "Teh Poci Teh Celup 25 gr",
    categoryId: 4,
    category: "Minuman",
    price: 7000,
    stock: 30,
    image: tehPoci,
    brand: "Teh Poci",
    variant: "Teh Celup",
    weight: "25 gr",
    description:
      "Kemasan praktis Teh Poci untuk kebutuhan sehari-hari.",
  },

  {
    id: 19,
    name: "Teh Poci Family Pack",
    categoryId: 4,
    category: "Minuman",
    price: 30000,
    stock: 10,
    image: tehPoci,
    brand: "Teh Poci",
    variant: "Family Pack",
    weight: "150 gr",
    description:
      "Kemasan keluarga untuk menikmati teh bersama.",
  },

  {
    id: 20,
    name: "Teh Poci Premium",
    categoryId: 4,
    category: "Minuman",
    price: 25000,
    stock: 8,
    image: tehPoci,
    brand: "Teh Poci",
    variant: "Premium",
    weight: "100 gr",
    description:
      "Teh premium dengan aroma dan cita rasa yang lebih kuat.",
  },

  // =========================================================
  // 5. KESEHATAN
  // categoryId: 5
  // =========================================================
  {
    id: 21,
    name: "Vitamin C 500 mg",
    categoryId: 5,
    category: "Kesehatan",
    price: 28000,
    stock: 15,
    image: tehPoci,
    brand: "Enervon-C",
    variant: "Vitamin C",
    weight: "30 Tablet",
    description:
      "Suplemen vitamin untuk membantu memenuhi kebutuhan vitamin C.",
  },

  {
    id: 22,
    name: "Masker Medis 50 Pcs",
    categoryId: 5,
    category: "Kesehatan",
    price: 25000,
    stock: 20,
    image: tehPoci,
    brand: "Sensi",
    variant: "3 Ply",
    weight: "50 Pcs",
    description:
      "Masker medis sekali pakai untuk perlindungan sehari-hari.",
  },

  {
    id: 23,
    name: "Plester Luka 10 Pcs",
    categoryId: 5,
    category: "Kesehatan",
    price: 10000,
    stock: 25,
    image: tehPoci,
    brand: "Hansaplast",
    variant: "Plester Luka",
    weight: "10 Pcs",
    description:
      "Plester praktis untuk perlindungan luka kecil.",
  },

  {
    id: 24,
    name: "Minyak Kayu Putih 60 ml",
    categoryId: 5,
    category: "Kesehatan",
    price: 18000,
    stock: 20,
    image: tehPoci,
    brand: "Cap Lang",
    variant: "Minyak Kayu Putih",
    weight: "60 ml",
    description:
      "Minyak kayu putih untuk kebutuhan keluarga sehari-hari.",
  },

  {
    id: 25,
    name: "Masker Anak 20 Pcs",
    categoryId: 5,
    category: "Kesehatan",
    price: 18000,
    stock: 18,
    image: tehPoci,
    brand: "Sensi",
    variant: "Masker Anak",
    weight: "20 Pcs",
    description:
      "Masker berukuran anak untuk penggunaan sehari-hari.",
  },

  // =========================================================
  // 6. KEBERSIHAN
  // categoryId: 6
  // =========================================================
  {
    id: 26,
    name: "Deterjen Bubuk 800 gr",
    categoryId: 6,
    category: "Kebersihan",
    price: 22000,
    stock: 20,
    image: tehPoci,
    brand: "Rinso",
    variant: "Molto",
    weight: "800 gr",
    description:
      "Deterjen bubuk untuk membantu membersihkan pakaian.",
  },

  {
    id: 27,
    name: "Sabun Cuci Piring 650 ml",
    categoryId: 6,
    category: "Kebersihan",
    price: 17000,
    stock: 25,
    image: tehPoci,
    brand: "Sunlight",
    variant: "Jeruk Nipis",
    weight: "650 ml",
    description:
      "Sabun cuci piring dengan formula pembersih minyak.",
  },

  {
    id: 28,
    name: "Pembersih Lantai 800 ml",
    categoryId: 6,
    category: "Kebersihan",
    price: 16000,
    stock: 18,
    image: tehPoci,
    brand: "Wipol",
    variant: "Citrus",
    weight: "800 ml",
    description:
      "Pembersih lantai untuk membantu menjaga lantai tetap bersih.",
  },

  {
    id: 29,
    name: "Sabun Mandi Cair 450 ml",
    categoryId: 6,
    category: "Kebersihan",
    price: 20000,
    stock: 20,
    image: tehPoci,
    brand: "Lifebuoy",
    variant: "Total 10",
    weight: "450 ml",
    description:
      "Sabun mandi cair untuk membersihkan tubuh sehari-hari.",
  },

  {
    id: 30,
    name: "Shampoo 340 ml",
    categoryId: 6,
    category: "Kebersihan",
    price: 26000,
    stock: 15,
    image: tehPoci,
    brand: "Sunsilk",
    variant: "Soft & Smooth",
    weight: "340 ml",
    description:
      "Shampoo untuk membantu merawat dan membersihkan rambut.",
  },
];