import { useState } from "react";
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
  DropdownSection,
  Navbar,
  NavbarMenuToggle,
  NavbarMenu,
  NavbarBrand,
  Accordion,
  AccordionItem,
} from "@nextui-org/react";
import { CustomButton } from "./CustomButton";
import { logout } from "../slices/authSlice";
import {
  adminNestedRoutes,
  adminRoutes,
  publicNestedRoutes,
  publicRoutes,
} from "../staticData";

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const pathname = location.pathname;
  const userInfo = useSelector((state) => state.auth.userInfo);
  const cart = useSelector((state) => state.cart);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const [activeRoute, setActiveRoute] = useState(
    userInfo?.isAdmin
      ? adminRoutes.find((r) => r.path === pathname) ||
          adminRoutes.find((r) =>
            adminNestedRoutes[r.key].some((r) => r.path === pathname)
          ) ||
          adminRoutes[0]
      : {}
  );

  const [routeFixed, setRouteFixed] = useState(false);

  const PublicHeader = (
    <>
      <div className="flex justify-between items-center w-full">
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          className="sm:hidden mr-4"
        />
        <NavbarBrand>
          <Link
            to="/"
            className="flex bg-black p-2 text-lg poppins-bold gap-x-3"
          >
            <span className="bg-white text-black px-2">GRAND</span>{" "}
            <span className="text-white">ONLINE STORE</span>
          </Link>
        </NavbarBrand>

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
        <div className="flex flex-wrap gap-x-2 text-base">
          {publicRoutes.map((route) => {
            return route.isLink ? (
              <Link
                className="border-b-3 border-transparent text-[#888] hover:border-black hover:text-black my-2 py-1 px-2"
                to={`/collections/${route.key}`}
              >
                {route.name}
              </Link>
            ) : (
              <Dropdown radius="none" key={route.key}>
                <DropdownTrigger>
                  <button
                    key={route.path}
                    className={`border-b-3 border-transparent text-[#888] hover:border-black hover:text-black my-2 py-1 px-2`}
                  >
                    {route.name}
                  </button>
                </DropdownTrigger>
                {route.parts ? (
                  <DropdownMenu
                    aria-label={route.name}
                    classNames={{ list: "flex-row" }}
                  >
                    <DropdownSection>
                      <DropdownItem
                        isReadOnly
                        className="data-[hover]:bg-transparent"
                      >
                        {route.name} Wear
                      </DropdownItem>
                      {publicNestedRoutes[route.key]["wear"]?.map((r) => (
                        <DropdownItem
                          key={r.path}
                          textValue={r.name}
                          className="rounded-none text-[#888] hover:text-black"
                          as={Link}
                          to={r.path}
                        >
                          {r.name}
                        </DropdownItem>
                      ))}
                    </DropdownSection>
                    <DropdownSection>
                      <DropdownItem
                        isReadOnly
                        className="data-[hover]:bg-transparent"
                      >
                        {route.name} Accessories
                      </DropdownItem>
                      {publicNestedRoutes[route.key]["accessories"]?.map(
                        (r) => (
                          <DropdownItem
                            key={r.path}
                            textValue={r.name}
                            className="rounded-none text-[#888] hover:text-black"
                            as={Link}
                            to={r.path}
                          >
                            {r.name}
                          </DropdownItem>
                        )
                      )}
                    </DropdownSection>
                  </DropdownMenu>
                ) : (
                  <DropdownMenu>
                    {publicNestedRoutes[route.key]?.map((r) => (
                      <DropdownItem
                        key={r.path}
                        textValue={r.name}
                        className="rounded-none text-[#888] hover:text-black"
                        as={Link}
                        to={r.path}
                      >
                        {r.name}
                      </DropdownItem>
                    ))}
                  </DropdownMenu>
                )}
              </Dropdown>
            );
          })}
        </div>
      </div>
      <NavbarMenu className="pb-32">
        <Accordion variant="splitted">
          {publicRoutes.slice(0, publicRoutes.length - 1).map((route) => {
            return (
              <AccordionItem
                key={route.key}
                title={route.name}
                className="text-[#888] hover:text-black"
              >
                {route.parts ? (
                  <Accordion variant="splitted">
                    <AccordionItem title={`${route.name} Wear`}>
                      <div className="flex flex-col gap-y-2 text-medium">
                        {publicNestedRoutes[route.key]["wear"].map((r) => (
                          <Link
                            key={r.path}
                            to={r.path}
                            onClick={(prev) => setIsMenuOpen(!prev)}
                          >
                            {r.name}
                          </Link>
                        ))}
                      </div>
                    </AccordionItem>
                    <AccordionItem title={`${route.name} Accessories`}>
                      <div className="flex flex-col gap-y-2 text-medium">
                        {publicNestedRoutes[route.key]["accessories"].map(
                          (r) => (
                            <Link
                              key={r.path}
                              to={r.path}
                              onClick={(prev) => setIsMenuOpen(!prev)}
                            >
                              {r.name}
                            </Link>
                          )
                        )}
                      </div>
                    </AccordionItem>
                  </Accordion>
                ) : (
                  <div className="flex flex-col gap-y-2 text-medium">
                    {publicNestedRoutes[route.key].map((r) => (
                      <Link
                        key={r.path}
                        to={r.path}
                        onClick={(prev) => setIsMenuOpen(!prev)}
                      >
                        {r.name}
                      </Link>
                    ))}
                  </div>
                )}
              </AccordionItem>
            );
          })}
        </Accordion>
        <div className="px-2 group is-splitted flex flex-col gap-2 w-full">
          <Link
            className="group-[.is-splitted]:px-4 group-[.is-splitted]:bg-content1 group-[.is-splitted]:shadow-medium group-[.is-splitted]:rounded-medium text-[#888] hover:text-black"
            to={`/collections/${publicRoutes[publicRoutes.length - 1].key}`}
            onClick={(prev) => setIsMenuOpen(!prev)}
          >
            <span className="flex py-4 w-full h-full gap-3 items-center tap-highlight-transparent outline-none data-[focus-visible=true]:z-10 data-[focus-visible=true]:outline-2 data-[focus-visible=true]:outline-focus data-[focus-visible=true]:outline-offset-2 transition-opacity text-foreground text-large">
              {publicRoutes[publicRoutes.length - 1].name}
            </span>
          </Link>
        </div>
      </NavbarMenu>
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
      <Navbar
        position="static"
        isMenuOpen={isMenuOpen}
        onMenuOpenChange={setIsMenuOpen}
        classNames={{
          wrapper: "max-w-screen-xl px-0 flex-col p-3",
        }}
        height={
          userInfo?.isAdmin ? null : window.outerWidth >= 640 ? null : "68px"
        }
      >
        {userInfo?.isAdmin === true ? AdminHeader : PublicHeader}
      </Navbar>
    </>
  );
};

export default Header;
