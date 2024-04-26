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
            <p>Sialkot Road Daska 51010, Pakistan</p>
            <p>
              Email:
              <a className="ml-1" href="mailto:info@highgears.pk">
                info@highgears.pk
              </a>
            </p>
            <p>
              Phone:
              <a href="tel:+92526617859" className="ml-1">
                +92-526-617859
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
                href="https://www.facebook.com/qadeer8964"
                target="_blank"
                className="text-2xl text-gray-500 hover:text-blue-500 transition-colors duration-300"
              >
                <i className="fa-brands fa-facebook"></i>
              </a>
              <a
                href="https://www.instagram.com/grandstoreonline"
                target="_blank"
                className="text-2xl text-gray-500 hover:text-red-500 transition-colors duration-300"
              >
                <i className="fa-brands fa-instagram"></i>
              </a>
              <a
                href="https://twitter.com/"
                target="_blank"
                className="text-2xl text-gray-500 hover:text-black transition-colors duration-300"
              >
                <i className="fa-brands fa-x-twitter"></i>
              </a>
              {/* // Linkedin */}
              <a
                href="https://www.linkedin.com"
                target="_blank"
                className="text-2xl text-gray-500 hover:text-blue-500 transition-colors duration-300"
              >
                <i className="fa-brands fa-linkedin"></i>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
