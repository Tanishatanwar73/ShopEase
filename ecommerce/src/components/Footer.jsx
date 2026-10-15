function Footer() {
  return (
    <footer className="bg-gray-900 text-white mt-16">

      <div className="max-w-7xl mx-auto px-6 py-10">

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

          <div>
            <h2 className="text-2xl font-bold text-blue-400">
              ShopEase
            </h2>

            <p className="text-gray-400 mt-3">
              Your trusted online shopping destination.
            </p>
          </div>

          <div>

            <h3 className="font-semibold text-lg">
              Quick Links
            </h3>

            <div className="flex flex-col gap-2 mt-3">

              <a
                href="/"
                className="text-gray-400 hover:text-white"
              >
                Home
              </a>

              <a
                href="/login"
                className="text-gray-400 hover:text-white"
              >
                Login
              </a>

              <a
                href="/register"
                className="text-gray-400 hover:text-white"
              >
                Register
              </a>

            </div>

          </div>

          <div>

            <h3 className="font-semibold text-lg">
              Contact
            </h3>

            <p className="text-gray-400 mt-3">
              support@shopease.com
            </p>

            <p className="text-gray-400 mt-2">
              +91 98765 43210
            </p>

          </div>

        </div>

        <div className="border-t border-gray-700 mt-8 pt-6 text-center text-gray-400">
          © 2026 ShopEase. All rights reserved.
        </div>

      </div>

    </footer>
  );
}

export default Footer;