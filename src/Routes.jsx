import { Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import UserProductsList from "./pages/ProductsList";
import UserCollectionList from "./pages/CollectionList";
import Register from "./pages/Register";
import ProductDetail from "./pages/ProductDetail";
import AddProduct from "./pages/admin/AddProduct";
import AdminProductList from "./pages/admin/ProductsList";
import EditProduct from "./pages/admin/EditProduct";
import CollectionList from "./pages/admin/CollectionsList";
import AddCollection from "./pages/admin/AddCollection";
import EditCollection from "./pages/admin/EditCollection";
import Cart from "./pages/Cart";
import Checkout from "./pages/private/Checkout";
import OrderList from "./pages/admin/OrderList";
import Account from "./pages/private/Account";
import OrderDetail from "./pages/private/OrderDetail";

export const publicRoutes = [
  { path: "/", element: <Home /> },
  { path: "/cart", element: <Cart /> },
  { path: "/products", element: <UserProductsList /> },
  { path: "/products/:_id", element: <ProductDetail /> },
  { path: "/collections/:slug", element: <UserCollectionList /> },
  { path: "/women", element: <UserProductsList /> },
  { path: "/men", element: <UserProductsList /> },
  { path: "/kids", element: <UserProductsList /> },
  { path: "/login", element: <Login /> },
  { path: "/register", element: <Register /> },
];

export const privateRoutes = [
  { path: "/checkout", element: <Checkout /> },
  { path: "/user/account", element: <Account /> },
  { path: "/user/orders/:id", element: <OrderDetail /> },
];

export const adminRoutes = [
  { path: "/admin/account", element: <Account /> },
  { path: "/admin/", element: <Navigate to="/admin/products" /> },
  { path: "/admin/products/create", element: <AddProduct /> },
  { path: "/admin/products", element: <AdminProductList /> },
  { path: "/admin/products/edit/:_id", element: <EditProduct /> },
  { path: "/admin/collections", element: <CollectionList /> },
  { path: "/admin/collections/create", element: <AddCollection /> },
  { path: "/admin/collections/edit/:slug", element: <EditCollection /> },
  { path: "/admin/users", element: <ComingSoon /> },
  { path: "/admin/orders", element: <OrderList /> },
  { path: "/admin/reports", element: <ComingSoon /> },
];
