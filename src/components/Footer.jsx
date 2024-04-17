import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="mb-4 md:mb-0">
            <h2 className="text-lg font-semibold mb-2">About Us</h2>
            <p>
              Welcome to Grand Online Store! We are dedicated to providing
              high-quality products and exceptional delivery service.
            </p>
          </div>
          <div className="mb-4 md:mb-0">
            <h2 className="text-lg font-semibold mb-2">Contact Us</h2>
            <p>123 Fashion St, City, Country</p>
            <p>
              Email:
              <a className="ml-1" href="mailto:info@example.com">
                info@example.com
              </a>
            </p>
            <p>
              Phone:
              <a href="tel:+1234567890" className="ml-1">
                +123 456 7890
              </a>
            </p>
          </div>
          <div className="mb-4 md:mb-0">
            <h2 className="text-lg font-semibold mb-2">Links</h2>
            <ul>
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/products">Products</Link>
              </li>
              <li>
                <Link to="/cart">Cart</Link>
              </li>
              <li>
                <Link to="/login">Login</Link>
              </li>
            </ul>
          </div>
          <div>
            <h2 className="text-lg font-semibold mb-2">Follow Us</h2>
            <div className="flex space-x-4">
              <a
                href="#"
                className="text-2xl text-gray-500 hover:text-blue-500 transition-colors duration-300"
              >
                <i className="fa-brands fa-facebook"></i>
              </a>
              <a
                href="#"
                className="text-2xl text-gray-500 hover:text-red-500 transition-colors duration-300"
              >
                <i className="fa-brands fa-instagram"></i>
              </a>
              <a
                href="#"
                className="text-2xl text-gray-500 hover:text-black transition-colors duration-300"
              >
                <i className="fa-brands fa-x-twitter"></i>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
