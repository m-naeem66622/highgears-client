export const publicRoutes = [
  { key: "sports-wear", name: "Sports Wear" },
  { key: "casual-wear", name: "Casual Wear" },
  { key: "fitness-wear", name: "Fitness Wear" },
  { key: "greek-wear", name: "Greek Wear" },
  { key: "masonic", name: "Masonic", parts: true },
  { key: "shriner", name: "Shriner", parts: true },
  { key: "oes", name: "OES", parts: true },
  { key: "doi", name: "DOI", parts: true },
  { key: "motorbike-suits", name: "Motorbike Suits", isLink: true },
];

export const publicNestedRoutes = {
  "sports-wear": [
    { name: "Boxing Gloves", path: "/collections/boxing-gloves" },
    { name: "Cricket Uniform", path: "/collections/cricket-uniform" },
    { name: "Tennis Uniform", path: "/collections/tennis-uniform" },
    { name: "Rugby Uniform", path: "/collections/rugby-uniform" },
    { name: "Ice Hockey Uniform", path: "/collections/ice-hockey-uniform" },
    { name: "Basketball Uniform", path: "/collections/basketball-uniform" },
    {
      name: "American Football Uniform",
      path: "/collections/american-football-uniform",
    },
    { name: "Baseball Uniform", path: "/collections/baseball-uniform" },
    { name: "Netball", path: "/collections/netball" },
    { name: "Rugby", path: "/collections/rugby" },
    { name: "Soccer Uniforms", path: "/collections/soccer-uniforms" },
  ],
  "casual-wear": [
    { name: "Casual Sweat Shirts", path: "/collections/casual-sweat-shirts" },
    { name: "Casual Shorts", path: "/collections/casual-shorts" },
    { name: "Casual Waistcoat Men", path: "/collections/casual-waistcoat-men" },
    { name: "Casual Jeans Jackets", path: "/collections/casual-jeans-jackets" },
    {
      name: "Casual Crew Neck Shirts",
      path: "/collections/casual-crew-neck-shirts",
    },
    { name: "Casual Sports Cap", path: "/collections/casual-sports-cap" },
    { name: "Casual Men Hoodies", path: "/collections/casual-men-hoodies" },
    {
      name: "Casual Puff Printing Hoodies",
      path: "/collections/casual-puff-printing-hoodies",
    },
    {
      name: "Casual Men Polo Shirt",
      path: "/collections/casual-men-polo-shirt",
    },
    { name: "Casual Men Tshirt", path: "/collections/casual-men-tshirt" },
  ],
  "fitness-wear": [
    { name: "Women Yoga Set", path: "/collections/women-yoga-set" },
    { name: "Singlet", path: "/collections/singlet" },
    { name: "Compression Wear", path: "/collections/compression-wear" },
    { name: "Fitness Hoodies", path: "/collections/fitness-hoodies" },
    { name: "Men Trouser", path: "/collections/men-trouser" },
    { name: "Tank Top", path: "/collections/tank-top" },
    { name: "Women Tank Top", path: "/collections/women-tank-top" },
    { name: "Sports Bra", path: "/collections/sports-bra" },
    { name: "Leggings", path: "/collections/leggings" },
  ],
  "greek-wear": [
    {
      name: "Greek Varsity Jackets",
      path: "/collections/greek-varsity-jackets",
    },
    {
      name: "Greek Windbreaker Jackets",
      path: "/collections/greek-windbreaker-jackets",
    },
    { name: "Greek T Shirts", path: "/collections/greek-t-shirts" },
    { name: "Greek Polo Shirts", path: "/collections/greek-polo-shirts" },
  ],
  masonic: {
    wear: [
      // Walking shirts, Varsity Jackets, Windbreaker jackets , T shirts, Hoodies
      {
        name: "Masonic Walking Shirts",
        path: "/collections/masonic-walking-shirts",
      },
      {
        name: "Masonic Varsity Jackets",
        path: "/collections/masonic-varsity-jackets",
      },
      {
        name: "Masonic Windbreaker Jackets",
        path: "/collections/masonic-windbreaker-jackets",
      },
      { name: "Masonic T Shirts", path: "/collections/masonic-t-shirts" },
      { name: "Masonic Hoodies", path: "/collections/masonic-hoodies" },
    ],
    accessories: [
      // Fez, Chain Collar, Aprons, Sashes and Ribbons, Jewels and Medals, Gloves, Cuffs and Collars, Fez case, Crowns, Banners
      { name: "Masonic Fez", path: "/collections/masonic-fez" },
      {
        name: "Masonic Chain Collar",
        path: "/collections/masonic-chain-collar",
      },
      { name: "Masonic Aprons", path: "/collections/masonic-aprons" },
      {
        name: "Masonic Sashes & Ribbons",
        path: "/collections/masonic-sashes-ribbons",
      },
      {
        name: "Masonic Jewels & Medals",
        path: "/collections/masonic-jewels-medals",
      },
      { name: "Masonic Gloves", path: "/collections/masonic-gloves" },
      {
        name: "Masonic Cuffs & Collars",
        path: "/collections/masonic-cuffs-collars",
      },
      { name: "Masonic Fez Case", path: "/collections/masonic-fez-case" },
      { name: "Masonic Crowns", path: "/collections/masonic-crowns" },
      { name: "Masonic Banners", path: "/collections/masonic-banners" },
    ],
  },
  shriner: {
    // Same as above like masonic but with Shriner
    wear: [
      {
        name: "Shriner Walking Shirts",
        path: "/collections/shriner-walking-shirts",
      },
      {
        name: "Shriner Varsity Jackets",
        path: "/collections/shriner-varsity-jackets",
      },
      {
        name: "Shriner Windbreaker Jackets",
        path: "/collections/shriner-windbreaker-jackets",
      },
      { name: "Shriner T Shirts", path: "/collections/shriner-t-shirts" },
      { name: "Shriner Hoodies", path: "/collections/shriner-hoodies" },
    ],
    accessories: [
      { name: "Shriner Fez", path: "/collections/shriner-fez" },
      {
        name: "Shriner Chain Collar",
        path: "/collections/shriner-chain-collar",
      },
      { name: "Shriner Aprons", path: "/collections/shriner-aprons" },
      {
        name: "Shriner Sashes & Ribbons",
        path: "/collections/shriner-sashes-ribbons",
      },
      {
        name: "Shriner Jewels & Medals",
        path: "/collections/shriner-jewels-medals",
      },
      { name: "Shriner Gloves", path: "/collections/shriner-gloves" },
      {
        name: "Shriner Cuffs & Collars",
        path: "/collections/shriner-cuffs-collars",
      },
      { name: "Shriner Fez Case", path: "/collections/shriner-fez-case" },
      { name: "Shriner Crowns", path: "/collections/shriner-crowns" },
      { name: "Shriner Banners", path: "/collections/shriner-banners" },
    ],
  },
  oes: {
    // Same as above like masonic but with OES
    wear: [
      {
        name: "OES Walking Shirts",
        path: "/collections/oes-walking-shirts",
      },
      {
        name: "OES Varsity Jackets",
        path: "/collections/oes-varsity-jackets",
      },
      {
        name: "OES Windbreaker Jackets",
        path: "/collections/oes-windbreaker-jackets",
      },
      { name: "OES T Shirts", path: "/collections/oes-t-shirts" },
      { name: "OES Hoodies", path: "/collections/oes-hoodies" },
    ],
    accessories: [
      { name: "OES Fez", path: "/collections/oes-fez" },
      {
        name: "OES Chain Collar",
        path: "/collections/oes-chain-collar",
      },
      { name: "OES Aprons", path: "/collections/oes-aprons" },
      {
        name: "OES Sashes & Ribbons",
        path: "/collections/oes-sashes-ribbons",
      },
      {
        name: "OES Jewels & Medals",
        path: "/collections/oes-jewels-medals",
      },
      { name: "OES Gloves", path: "/collections/oes-gloves" },
      {
        name: "OES Cuffs & Collars",
        path: "/collections/oes-cuffs-collars",
      },
      { name: "OES Fez Case", path: "/collections/oes-fez-case" },
      { name: "OES Crowns", path: "/collections/oes-crowns" },
      { name: "OES Banners", path: "/collections/oes-banners" },
    ],
  },
  doi: {
    // Same as above like masonic but with DOI
    wear: [
      {
        name: "DOI Walking Shirts",
        path: "/collections/doi-walking-shirts",
      },
      {
        name: "DOI Varsity Jackets",
        path: "/collections/doi-varsity-jackets",
      },
      {
        name: "DOI Windbreaker Jackets",
        path: "/collections/doi-windbreaker-jackets",
      },
      { name: "DOI T Shirts", path: "/collections/doi-t-shirts" },
      { name: "DOI Hoodies", path: "/collections/doi-hoodies" },
    ],
    accessories: [
      { name: "DOI Fez", path: "/collections/doi-fez" },
      {
        name: "DOI Chain Collar",
        path: "/collections/doi-chain-collar",
      },
      { name: "DOI Aprons", path: "/collections/doi-aprons" },
      {
        name: "DOI Sashes & Ribbons",
        path: "/collections/doi-sashes-ribbons",
      },
      {
        name: "DOI Jewels & Medals",
        path: "/collections/doi-jewels-medals",
      },
      { name: "DOI Gloves", path: "/collections/doi-gloves" },
      {
        name: "DOI Cuffs & Collars",
        path: "/collections/doi-cuffs-collars",
      },
      { name: "DOI Fez Case", path: "/collections/doi-fez-case" },
      { name: "DOI Crowns", path: "/collections/doi-crowns" },
      { name: "DOI Banners", path: "/collections/doi-banners" },
    ],
  },
};

export const adminRoutes = [
  { key: "products", name: "Products", path: "/admin/products" },
  { key: "orders", name: "Orders", path: "/admin/orders" },
  { key: "collections", name: "Collections", path: "/admin/collections" },
];

export const adminNestedRoutes = {
  products: [
    { name: "All Products", path: "/admin/products" },
    { name: "Add Product", path: "/admin/products/create" },
  ],
  orders: [
    { name: "All Orders", path: "/admin/orders" },
    { name: "Pending", path: "/admin/orders/status/pending" },
    { name: "Processing", path: "/admin/orders/status/processing" },
    { name: "Shipped", path: "/admin/orders/status/shipped" },
    { name: "Completed", path: "/admin/orders/status/completed" },
    { name: "Cancelled", path: "/admin/orders/status/cancelled" },
  ],
  collections: [
    { name: "All Collections", path: "/admin/collections" },
    { name: "Add Collection", path: "/admin/collections/create" },
  ],
};

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
