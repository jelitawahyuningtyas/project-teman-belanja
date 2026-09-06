import { products } from "./products";

const product1 = products[0];
const product2 = products[1];
const product3 = products[2];

export const dummyOrders = [
  {
    id: "TB-20260905-1001",

    date: "5 September 2026",

    items: [
      {
        productId: product1?.id,
        quantity: 2,
      },
      {
        productId: product2?.id,
        quantity: 1,
      },
    ],

    address: {
      label: "Rumah",
      recipientName: "Jelita",
      phone: "081234567899",
      address:
        "Jl. Cempaka Putih Barat, Jakarta Pusat",
    },

    paymentMethod: "QRIS",

    orderStatus: "Dikemas",

    total:
      (product1?.price || 0) * 2 +
      (product2?.price || 0),

    shippingNumber: "",
  },

  {
    id: "TB-20260905-1002",

    date: "5 September 2026",

    items: [
      {
        productId: product3?.id,
        quantity: 1,
      },
    ],

    address: {
      label: "Kos",
      recipientName: "Jelita",
      phone: "081234567899",
      address:
        "Jl. Kemayoran Gempol, Jakarta Pusat",
    },

    paymentMethod: "COD",

    orderStatus: "Dikirim",

    total: product3?.price || 0,

    shippingNumber: "TB-SHP-1002",
  },
];