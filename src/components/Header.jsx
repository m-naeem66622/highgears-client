import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { CartIcon } from "../assets/CartIcon";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Badge,
  Avatar,
} from "@nextui-org/react";
import { CustomButton } from "./CustomButton";
import { logout } from "../slices/authSlice";

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const pathname = location.pathname;
  const userInfo = useSelector((state) => state.auth.userInfo);
  const cart = useSelector((state) => state.cart);

  const publicRoutes = [
    { key: "women", name: "Women", path: "/women" },
    { key: "men", name: "Men", path: "/men" },
    { key: "kids", name: "Kids", path: "/kids" },
  ];

  const publicNestedRoutes = {
    women: [
      { name: "Sale", path: "/collections/all-women-deals" },
      { name: "Eastern Wear", path: "/collections/women-eastern-wear" },
      { name: "Western Wear", path: "/collections/women-western-wear" },
      { name: "Active Wear", path: "/collections/women-active-wear" },
      { name: "Footwear", path: "/collections/women-footwear" },
      { name: "Sports Wear", path: "/collections/women-sports-wear" },
      { name: "Accessories", path: "/collections/women-accessories" },
      { name: "Brands", path: "/collections/brands" },
    ],
    men: [
      { name: "Sale", path: "/collections/all-men-deals" },
      { name: "Eastern Wear", path: "/collections/men-eastern-wear" },
      { name: "Western Wear", path: "/collections/men-western-wear" },
      { name: "Active Wear", path: "/collections/men-active-wear" },
      { name: "Footwear", path: "/collections/men-footwear" },
      { name: "Sports Wear", path: "/collections/men-sports-wear" },
      { name: "Accessories", path: "/collections/men-accessories" },
    ],
    kids: [
      { name: "Sale", path: "/collections/kidswear-deals" },
      { name: "Girls", path: "/collections/kidswear-girls" },
      { name: "Boys", path: "/collections/kidswear-boys" },
      { name: "NewBorn Kids", path: "/collections/kidswear-toddler-baby" },
    ],
  };

  const adminRoutes = [
    { key: "products", name: "Products", path: "/admin/products" },
    { key: "orders", name: "Orders", path: "/admin/orders" },
    { key: "collections", name: "Collections", path: "/admin/collections" },
  ];

  const adminNestedRoutes = {
    products: [
      { name: "All Products", path: "/admin/products" },
      { name: "Add Product", path: "/admin/products/create" },
    ],
    orders: [
      { name: "All Orders", path: "/admin/orders" },
      { name: "Pending Orders", path: "/admin/orders/pending" },
      { name: "Completed Orders", path: "/admin/orders/completed" },
    ],
    collections: [
      { name: "All Collections", path: "/admin/collections" },
      { name: "Add Collection", path: "/admin/collections/create" },
    ],
  };

  const [activeRoute, setActiveRoute] = useState(
    userInfo?.isAdmin
      ? adminRoutes.find((r) => r.path === pathname) ||
          adminRoutes.find((r) =>
            adminNestedRoutes[r.key].some((r) => r.path === pathname)
          ) ||
          adminRoutes[0]
      : publicRoutes.find((r) => r.path === pathname) ||
          publicRoutes.find((r) =>
            publicNestedRoutes[r.key].some((r) => r.path === pathname)
          ) ||
          publicRoutes[0]
  );

  const [routeFixed, setRouteFixed] = useState(false);

  const PublicHeader = (
    <>
      <div className="flex justify-between items-center w-full">
        <div className="sm:flex gap-x-3 hidden">
          {publicRoutes.map((route) => {
            const isActive =
              route.path === pathname ||
              publicNestedRoutes[route.key].some((r) => r.path === pathname);
            // : index === 0;
            return (
              <div key={route.key}>
                <Link
                  onMouseEnter={() => setActiveRoute(route)}
                  key={route.path}
                  className={`${
                    isActive
                      ? "bg-black text-white"
                      : "bg-white text-[#888] hover:text-black"
                  } py-2 px-4`}
                  to={route.path}
                >
                  {route.name}
                </Link>
              </div>
            );
          })}
        </div>

        <Link to="/" className="flex bg-black p-2 text-lg poppins-bold gap-x-3">
          <span className="bg-white text-black px-2">GRAND</span>{" "}
          <span className="text-white">ONLINE STORE</span>
        </Link>

        <div className="flex items-center justify-center gap-x-3">
          <Dropdown radius="none">
            <DropdownTrigger>
              <div className="flex text-black cursor-pointer relative">
                <Badge
                  content={cart.cartItems.length}
                  isInvisible={cart.cartItems.length ? false : true}
                  color="danger"
                  placement="top-right"
                >
                  <CartIcon size={30} />
                </Badge>
              </div>
            </DropdownTrigger>
            <DropdownMenu aria-label="Cart Summary">
              <DropdownItem
                key={1}
                textValue={`${cart.cartItems.length || 0} Item(s)`}
                className="rounded-none"
              >
                <span className="font-bold">
                  {cart.cartItems.length} Item(s)
                </span>
              </DropdownItem>
              <DropdownItem
                key={2}
                textValue={`Subtotal: ₨. ${cart.itemsPrice || 0}`}
                className="rounded-none"
              >
                <span className=" text-primary font-bold">
                  Subtotal: ₨. {cart.itemsPrice || 0}
                </span>
              </DropdownItem>

              <DropdownItem
                key={3}
                textValue="View Cart"
                className="rounded-none"
              >
                <CustomButton
                  to="/cart"
                  as={Link}
                  color="dark"
                  radius="none"
                  className="w-full"
                >
                  View Cart
                </CustomButton>
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
          <Dropdown radius="none" placement="bottom-end">
            <DropdownTrigger>
              <Avatar
                size="sm"
                isBordered
                as="button"
                className="transition-transform"
                src="https://gravatar.com/avatar?s=200&d=mp"
              />
            </DropdownTrigger>
            {userInfo ? (
              <DropdownMenu aria-label="Profile Actions" variant="flat">
                <DropdownItem
                  key="userInfo"
                  textValue={`Signed in as ${userInfo?.email}`}
                  className="h-14 gap-2 rounded-none"
                >
                  <p className="font-semibold">Signed in as</p>
                  <p className="font-semibold">{userInfo?.email}</p>
                </DropdownItem>
                <DropdownItem
                  key="profile"
                  textValue="Profile"
                  className="rounded-none text-neutral-600"
                  to="/user/account?tab=profile"
                  as={Link}
                >
                  Profile
                </DropdownItem>
                <DropdownItem
                  key="orders"
                  textValue="My Orders"
                  className="rounded-none text-neutral-600"
                  to="/user/account?tab=orders"
                  as={Link}
                >
                  My Orders
                </DropdownItem>
                <DropdownItem
                  key="reviews"
                  textValue="My Reviews"
                  className="rounded-none text-neutral-600"
                  to="/user/account?tab=reviews"
                  as={Link}
                >
                  My Reviews
                </DropdownItem>
                <DropdownItem
                  key="logout"
                  color="danger"
                  textValue="Log Out"
                  className="rounded-none"
                  onClick={() => {
                    dispatch(logout());
                    navigate("/");
                  }}
                >
                  Log Out
                </DropdownItem>
              </DropdownMenu>
            ) : (
              <DropdownMenu aria-label="Profile Actions" variant="flat">
                <DropdownItem
                  key="profile"
                  textValue="New Here"
                  className="h-14 gap-2 rounded-none"
                >
                  <p className="font-semibold">New here?</p>
                </DropdownItem>
                <DropdownItem
                  key="login"
                  textValue="Login"
                  className="rounded-none text-neutral-600"
                  as={Link}
                  to="/login"
                >
                  Login
                </DropdownItem>
                <DropdownItem
                  key="register"
                  textValue="Register"
                  className="rounded-none text-neutral-600"
                  as={Link}
                  to="/register"
                >
                  Register
                </DropdownItem>
              </DropdownMenu>
            )}
          </Dropdown>
          <div className="hidden sm:block max-w-full sm:max-w-[14rem]"></div>
        </div>
      </div>
      <div className="sm:flex justify-between w-full hidden">
        <div
          className="flex flex-wrap gap-x-2 text-base"
          onMouseLeave={() => {
            !routeFixed &&
              setActiveRoute(
                publicRoutes.find((r) => r.path === pathname) ||
                  publicRoutes.find((r) =>
                    publicNestedRoutes[r.key].some((r) => r.path === pathname)
                  ) ||
                  publicRoutes[0]
              );
            setRouteFixed(false);
          }}
        >
          {publicNestedRoutes[activeRoute.key]?.map((route) => {
            return (
              <div
                key={route.path}
                className={`border-b-3 border-transparent text-[#888] hover:border-black hover:text-black my-2 py-1 px-2`}
              >
                <Link
                  onClick={() => {
                    setRouteFixed(true);
                  }}
                  className=""
                  to={route.path}
                >
                  {route.name}
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );

  const AdminHeader = (
    <>
      <div className="flex justify-between items-center w-full">
        <div className="sm:flex gap-x-3 hidden">
          {adminRoutes.map((route, index) => {
            const splittedPathname = pathname.split("/").filter(Boolean);
            const isAdminRoute = splittedPathname[0];

            const isActive = isAdminRoute
              ? route.path === pathname ||
                adminNestedRoutes[route.key].some((r) => r.path === pathname) ||
                route.key === splittedPathname[1]
              : index === 0;

            return (
              <div onMouseEnter={() => setActiveRoute(route)} key={route.path}>
                <Link
                  className={`${
                    isActive
                      ? "bg-black text-white"
                      : "bg-white text-[#888] hover:text-black"
                  } py-2 px-4`}
                  to={route.path}
                >
                  {route.name}
                </Link>
              </div>
            );
          })}
        </div>

        <Link to="/" className="flex bg-black p-2 text-lg poppins-bold gap-x-3">
          <span className="bg-white text-black px-2">GRAND</span>{" "}
          <span className="text-white">ONLINE STORE</span>
        </Link>

        <div className="flex items-center gap-x-3">
          <Dropdown radius="none" placement="bottom-end">
            <DropdownTrigger>
              <Avatar
                size="sm"
                isBordered
                as="button"
                className="transition-transform"
                src="https://gravatar.com/avatar?s=200&d=mp"
              />
            </DropdownTrigger>
            {userInfo ? (
              <DropdownMenu aria-label="Profile Actions" variant="flat">
                <DropdownItem
                  key="userInfo"
                  textValue={`Signed in as ${userInfo?.email}`}
                  className="h-14 gap-2 rounded-none"
                >
                  <p className="font-semibold">Signed in as</p>
                  <p className="font-semibold">{userInfo?.email}</p>
                </DropdownItem>
                <DropdownItem
                  key="profile"
                  textValue="Profile"
                  className="rounded-none text-neutral-600"
                  to="/admin/account?tab=profile"
                  as={Link}
                >
                  Profile
                </DropdownItem>
                <DropdownItem
                  key="orders"
                  textValue="My Orders"
                  className="rounded-none text-neutral-600"
                  to="/admin/account?tab=orders"
                  as={Link}
                >
                  My Orders
                </DropdownItem>
                <DropdownItem
                  key="reviews"
                  textValue="My Reviews"
                  className="rounded-none text-neutral-600"
                  to="/admin/account?tab=reviews"
                  as={Link}
                >
                  My Reviews
                </DropdownItem>
                <DropdownItem
                  key="logout"
                  color="danger"
                  textValue="Log Out"
                  className="rounded-none"
                  onClick={() => {
                    dispatch(logout());
                    navigate("/");
                  }}
                >
                  Log Out
                </DropdownItem>
              </DropdownMenu>
            ) : (
              <DropdownMenu aria-label="Profile Actions" variant="flat">
                <DropdownItem
                  key="profile"
                  textValue="New Here"
                  className="h-14 gap-2 rounded-none"
                >
                  <p className="font-semibold">New here?</p>
                </DropdownItem>
                <DropdownItem
                  key="login"
                  textValue="Login"
                  className="rounded-none text-neutral-600"
                  as={Link}
                  to="/login"
                >
                  Login
                </DropdownItem>
                <DropdownItem
                  key="register"
                  textValue="Register"
                  className="rounded-none text-neutral-600"
                  as={Link}
                  to="/register"
                >
                  Register
                </DropdownItem>
              </DropdownMenu>
            )}
          </Dropdown>
        </div>
      </div>
      <div className="sm:flex justify-between w-full hidden">
        <div
          className="flex flex-wrap gap-x-2 text-base"
          onMouseLeave={() => {
            !routeFixed &&
              setActiveRoute(
                adminRoutes.find((r) => r.path === pathname) ||
                  adminRoutes.find((r) =>
                    adminNestedRoutes[r.key].some((r) => r.path === pathname)
                  ) ||
                  adminRoutes[0]
              );
            setRouteFixed(false);
          }}
        >
          {adminNestedRoutes[activeRoute.key]?.map((route) => {
            return (
              <div
                key={route.path}
                className={`border-b-3 border-transparent text-[#888] hover:border-black hover:text-black my-2 py-1 px-2`}
                onClick={() => setRouteFixed(true)}
              >
                <Link className="" to={route.path}>
                  {route.name}
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );

  return (
    <>
      <header className="flex flex-col py-3 px-3 max-w-screen-xl mx-auto">
        {userInfo?.isAdmin === true ? AdminHeader : PublicHeader}
      </header>
    </>
  );
};

export default Header;
