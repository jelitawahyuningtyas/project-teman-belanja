import prisma from "../lib/prisma.js";

// ==================================================
// GET ALL PRODUCTS
// GET /api/products
// ==================================================

export async function getProducts(req, res) {
  try {
    const products = await prisma.product.findMany({
        where: {
            isActive: true,
        },
        orderBy: {
            id: "asc",
        },
        include: {
            category: true,
        },
        });

    const formattedProducts = products.map(
      (product) => ({
        id: product.id,
        name: product.name,
        categoryId: product.categoryId,

        // Supaya cocok dengan frontend
        category: product.category?.name || null,

        price: product.price,
        stock: product.stock,
        image: product.image,
        brand: product.brand,
        variant: product.variant,
        weight: product.weight,
        description: product.description,

        createdAt: product.createdAt,
        updatedAt: product.updatedAt,
      })
    );

    return res.status(200).json({
      success: true,
      data: formattedProducts,
    });
  } catch (error) {
    console.error(
      "Get products error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Gagal mengambil data produk.",
    });
  }
}

// ==================================================
// GET PRODUCT BY ID
// GET /api/products/:id
// ==================================================

export async function getProductById(
  req,
  res
) {
  try {
    const productId = Number(
      req.params.id
    );

    if (Number.isNaN(productId)) {
      return res.status(400).json({
        success: false,
        message:
          "ID produk tidak valid.",
      });
    }

    const product =
      await prisma.product.findUnique({
        where: {
          id: productId,
        },
        include: {
          category: true,
        },
      });

    if (!product) {
      return res.status(404).json({
        success: false,
        message:
          "Produk tidak ditemukan.",
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        id: product.id,
        name: product.name,
        categoryId:
          product.categoryId,
        category:
          product.category?.name ||
          null,
        price: product.price,
        stock: product.stock,
        image: product.image,
        brand: product.brand,
        variant: product.variant,
        weight: product.weight,
        description:
          product.description,
        createdAt:
          product.createdAt,
        updatedAt:
          product.updatedAt,
      },
    });
  } catch (error) {
    console.error(
      "Get product by ID error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Gagal mengambil data produk.",
    });
  }
}

// ==================================================
// GET ALL CATEGORIES
// GET /api/categories
// ==================================================

export async function getCategories(
  req,
  res
) {
  try {
    const categories =
      await prisma.category.findMany({
        orderBy: {
          id: "asc",
        },
      });

    return res.status(200).json({
      success: true,
      data: categories,
    });
  } catch (error) {
    console.error(
      "Get categories error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Gagal mengambil data kategori.",
    });
  }
}

// ==================================================
// GET CATEGORY BY SLUG
// GET /api/categories/:slug
// ==================================================

export async function getCategoryBySlug(
  req,
  res
) {
  try {
    const { slug } = req.params;

    const category =
      await prisma.category.findUnique({
        where: {
          slug,
        },
        include: {
          products: {
            where: {
                isActive: true,
            },
            orderBy: {
                id: "asc",
            },
            },
        },
      });

    if (!category) {
      return res.status(404).json({
        success: false,
        message:
          "Kategori tidak ditemukan.",
      });
    }

    const formattedProducts =
      category.products.map(
        (product) => ({
          id: product.id,
          name: product.name,
          categoryId:
            product.categoryId,
          category: category.name,
          price: product.price,
          stock: product.stock,
          image: product.image,
          brand: product.brand,
          variant: product.variant,
          weight: product.weight,
          description:
            product.description,
          createdAt:
            product.createdAt,
          updatedAt:
            product.updatedAt,
        })
      );

    return res.status(200).json({
      success: true,
      data: {
        id: category.id,
        name: category.name,
        slug: category.slug,
        image: category.image,
        products: formattedProducts,
      },
    });
  } catch (error) {
    console.error(
      "Get category by slug error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Gagal mengambil data kategori.",
    });
  }
}

// ==================================================
// CREATE PRODUCT
// POST /api/products
// ADMIN ONLY
// ==================================================

export async function createProduct(req, res) {
  try {
    const {
      name,
      categoryId,
      brand,
      variant,
      price,
      weightValue,
      weightUnit,
      stock,
      description,
    } = req.body;

    // =========================
    // VALIDASI FIELD
    // =========================
    if (!name?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Nama produk wajib diisi.",
      });
    }

    if (!categoryId) {
      return res.status(400).json({
        success: false,
        message: "Kategori produk wajib dipilih.",
      });
    }

    if (!brand?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Merk wajib diisi.",
      });
    }

    if (!variant?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Varian wajib diisi.",
      });
    }

    if (
      price === undefined ||
      Number(price) <= 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Harga harus lebih dari 0.",
      });
    }

    if (
      weightValue === undefined ||
      Number(weightValue) <= 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Berat harus lebih dari 0.",
      });
    }

    if (
      stock === undefined ||
      Number(stock) < 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Stok tidak valid.",
      });
    }

    if (!description?.trim()) {
      return res.status(400).json({
        success: false,
        message:
          "Deskripsi produk wajib diisi.",
      });
    }

    // =========================
    // IMAGE REQUIRED
    // =========================
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message:
          "Gambar produk wajib ditambahkan.",
      });
    }

    // =========================
    // CATEGORY
    // =========================
    const category =
      await prisma.category.findUnique({
        where: {
          id: Number(categoryId),
        },
      });

    if (!category) {
      return res.status(404).json({
        success: false,
        message:
          "Kategori produk tidak ditemukan.",
      });
    }

    // =========================
    // WEIGHT
    // =========================
    const weight =
      `${Number(weightValue)} ${weightUnit}`;

    // =========================
    // IMAGE URL
    // =========================
    const imageUrl =
      `/uploads/${req.file.filename}`;

    // =========================
    // CREATE PRODUCT
    // =========================
    const product =
      await prisma.product.create({
        data: {
          name: name.trim(),
          categoryId: Number(categoryId),

          brand: brand.trim(),
          variant: variant.trim(),

          price: Number(price),

          weight,

          stock: Number(stock),

          description:
            description.trim(),

          image: imageUrl,
        },

        include: {
          category: true,
        },
      });

    // =========================
    // RESPONSE
    // =========================
    return res.status(201).json({
      success: true,
      message:
        "Produk berhasil ditambahkan.",

      data: {
        id: product.id,
        name: product.name,

        categoryId:
          product.categoryId,

        category:
          product.category?.name ||
          null,

        price: product.price,
        stock: product.stock,

        image: product.image,

        brand: product.brand,
        variant: product.variant,
        weight: product.weight,
        description:
          product.description,

        createdAt:
          product.createdAt,
        updatedAt:
          product.updatedAt,
      },
    });
  } catch (error) {
    console.error(
      "Create product error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Gagal menambahkan produk.",
    });
  }
}

// ==================================================
// DELETE PRODUCT
// DELETE /api/products/:id
// ADMIN ONLY
// ==================================================

export async function deleteProduct(req, res) {
  try {
    const productId = Number(req.params.id);

    if (Number.isNaN(productId)) {
      return res.status(400).json({
        success: false,
        message: "ID produk tidak valid.",
      });
    }

    const product = await prisma.product.findUnique({
      where: {
        id: productId,
      },
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Produk tidak ditemukan.",
      });
    }

    if (!product.isActive) {
      return res.status(404).json({
        success: false,
        message: "Produk sudah dihapus.",
      });
    }

    const updatedProduct = await prisma.product.update({
      where: {
        id: productId,
      },
      data: {
        isActive: false,
      },
    });

    return res.status(200).json({
      success: true,
      message: "Produk berhasil dihapus.",
      data: {
        id: updatedProduct.id,
        isActive: updatedProduct.isActive,
      },
    });
  } catch (error) {
    console.error("Delete product error:", error);

    return res.status(500).json({
      success: false,
      message: "Gagal menghapus produk.",
    });
  }
}