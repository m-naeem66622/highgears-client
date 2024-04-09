export const genders = [
  { value: "", label: "Select Gender" },
  { value: "MALE", label: "Male" },
  { value: "FEMALE", label: "Female" },
  { value: "OTHER", label: "Other" },
];

export const orderStatus = [
  { key: "PENDING", label: "PENDING" },
  { key: "PROCESSING", label: "PROCESSING" },
  { key: "SHIPPED", label: "SHIPPED" },
  { key: "COMPLETED", label: "COMPLETED" },
  { key: "CANCELLED", label: "CANCELLED" },
];

export const productColumns = [
  { name: "IMAGES", uid: "images", sortable: false },
  { name: "NAME", uid: "name", sortable: true },
  { name: "CURRENCY", uid: "currency", sortable: true },
  { name: "SELLING PRICE", uid: "selling_price", sortable: true },
  { name: "ORIGINAL PRICE", uid: "original_price", sortable: true },
  { name: "REVIEWS COUNT", uid: "reviews_count", sortable: true },
  { name: "BRAND", uid: "brand", sortable: true },
  { name: "SHIPPING PRICE", uid: "shipping_price", sortable: true },
  { name: "AVAILABILITY", uid: "in_stock", sortable: true },
  { name: "SKU", uid: "sku" },
  { name: "ACTIONS", uid: "actions" },
];

export const collectionColumns = [
  { name: "NAME", uid: "name", sortable: true },
  { name: "NO. OF PRODUCTS", uid: "productsCount", sortable: true },
  { name: "SHOW ON HOME", uid: "showOnHomepage", sortable: true },
  { name: "CREATED AT", uid: "createdAt", sortable: true },
  { name: "UPDATED AT", uid: "updatedAt", sortable: true },
  { name: "ACTIONS", uid: "actions" },
];

export const cartColumns = [
  { name: "IMAGE", uid: "images" },
  { name: "PRODUCT", uid: "name" },
  { name: "SHIPPING PRICE", uid: "shipping_price" },
  { name: "PRICE", uid: "selling_price" },
  { name: "QUANTITY", uid: "quantity" },
  { name: "ACTIONS", uid: "actions" },
];

export const orderColumns = [
  { name: "ORDER ID", uid: "_id", sortable: true },
  { name: "CUSTOMER NAME", uid: "user.name", sortable: true },
  { name: "EMAIL", uid: "user.email", sortable: true },
  { name: "PHONE NUMBER", uid: "user.phoneNumber", sortable: true },
  { name: "AMOUNT", uid: "totalPrice", sortable: true },
  { name: "PLACED AT", uid: "placedAt", sortable: true },
  { name: "ORDER STATUS", uid: "orderStatus", sortable: true },
  { name: "PAYMENT METHOD", uid: "paymentMethod", sortable: true },
  { name: "PAYMENT STATUS", uid: "paymentStatus", sortable: true },
  { name: "ACTIONS", uid: "actions" },
];

export const priceRange = [1, 1000];

export const colors = [
  { value: "", label: "Select Color" },
  { label: "Blue", value: "Blue" },
  { label: "Red", value: "Red" },
  { label: "Gold", value: "Gold" },
  { label: "Orange", value: "Orange" },
  { label: "Redstone", value: "Redstone" },
  { label: "Gorge Green", value: "Gorge Green" },
  { label: "Team Gold", value: "Team Gold" },
  { label: "Blackened Blue", value: "Blackened Blue" },
  { label: "Siren Red", value: "Siren Red" },
  { label: "Aegean Storm", value: "Aegean Storm" },
  { label: "Thunder Blue", value: "Thunder Blue" },
  { label: "Tour Yellow", value: "Tour Yellow" },
  { label: "Safety Orange", value: "Safety Orange" },
];

export const sizes = [
  { label: "S", value: "S" },
  { label: "M", value: "M" },
  { label: "L", value: "L" },
  { label: "XL", value: "XL" },
];

export const reviews = [
  {
    id: 1,
    author: "John Doe",
    rating: 5,
    comment:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptates.",
  },
  {
    id: 2,
    author: "Jane Doe",
    rating: 3,
    comment:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptates.",
  },
];
