import "dotenv/config";

import bcrypt from "bcryptjs";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client.ts";


// ==================================================
// PRISMA CLIENT
// ==================================================

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error(
    "DATABASE_URL belum ditemukan di file .env"
  );
}

const adapter = new PrismaPg({
  connectionString,
});

const prisma = new PrismaClient({
  adapter,
});

// ==================================================
// CATEGORY DATA
// ==================================================

const categories = [
  {
    id: 1,
    name: "Bahan Pokok",
    slug: "bahan-pokok",
    image: "bahan-pokok.png",
  },
  {
    id: 2,
    name: "Kebutuhan Rumah Tangga",
    slug: "kebutuhan-rumah-tangga",
    image: "kebutuhan-rumah-tangga.png",
  },
  {
    id: 3,
    name: "Makanan",
    slug: "makanan",
    image: "makanan.png",
  },
  {
    id: 4,
    name: "Minuman",
    slug: "minuman",
    image: "minuman.png",
  },
  {
    id: 5,
    name: "Kesehatan",
    slug: "kesehatan",
    image: "kesehatan.png",
  },
  {
    id: 6,
    name: "Kebersihan",
    slug: "kebersihan",
    image: "kebersihan.png",
  },
];

// ==================================================
// MAIN SEED
// ==================================================

async function main() {
  console.log(
    "🌱 Mulai seed database TemanBelanja..."
  );

  // =================================================
  // ADMIN ACCOUNT
  // =================================================

  const adminUsername =
    process.env.ADMIN_USERNAME || "admin";

  const adminPassword =
    process.env.ADMIN_PASSWORD;

  if (!adminPassword) {
    throw new Error(
      "ADMIN_PASSWORD belum diisi di file .env"
    );
  }

  const hashedAdminPassword =
    await bcrypt.hash(adminPassword, 10);

  const admin = await prisma.user.upsert({
    where: {
      username: adminUsername,
    },

    update: {
      name: "Admin TemanBelanja",
      phone: "-",
      email: "admin@temanbelanja.local",
      password: hashedAdminPassword,
      role: "ADMIN",
    },

    create: {
      name: "Admin TemanBelanja",
      phone: "-",
      username: adminUsername,
      email: "admin@temanbelanja.local",
      password: hashedAdminPassword,
      role: "ADMIN",
    },
  });

  console.log(
    `✅ Admin berhasil dibuat: ${admin.username}`
  );

  // =================================================
  // CATEGORY
  // =================================================

  for (const category of categories) {
    await prisma.category.upsert({
      where: {
        id: category.id,
      },

      update: {
        name: category.name,
        slug: category.slug,
        image: category.image,
      },

      create: {
        id: category.id,
        name: category.name,
        slug: category.slug,
        image: category.image,
      },
    });
  }

  console.log(
    `✅ ${categories.length} kategori berhasil dibuat`
  );

  // =================================================
  // PRODUCT
  // =================================================

  console.log(
    "ℹ️ Produk belum di-seed karena produk dibuat oleh Admin melalui Create Product."
  );

  console.log(
    "🎉 Seed database TemanBelanja selesai!"
  );
}

// ==================================================
// RUN
// ==================================================

main()
  .catch((error) => {
    console.error(
      "❌ Seed gagal:",
      error
    );

    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });