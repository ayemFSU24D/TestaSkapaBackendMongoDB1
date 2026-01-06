import { NavLink, Outlet } from "react-router-dom";

export const Layout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="bg-blue-600 text-white">
        <nav className="container mx-auto flex justify-between items-center py-4 px-6">
          <div className="text-xl font-bold">MyWebsite</div>
          <ul className="flex space-x-6">
            <li>
              <NavLink
                to="/"
                className={({ isActive }) =>
                  isActive ? "text-yellow-300 font-semibold" : "hover:text-yellow-300"
                }
              >
                Home
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/ModelPage"
                className={({ isActive }) =>
                  isActive ? "text-yellow-300 font-semibold" : "hover:text-yellow-300"
                }
              >
                ModelPage
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/Signup"
                className={({ isActive }) =>
                  isActive ? "text-yellow-300 font-semibold" : "hover:text-yellow-300"
                }
              >
                Sign in
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/Contact"
                className={({ isActive }) =>
                  isActive ? "text-yellow-300 font-semibold" : "hover:text-yellow-300"
                }
              >
                Contact us
              </NavLink>
            </li>
          </ul>
        </nav>
      </header>

      {/* Main content */}
      <main className="flex-1 container mx-auto px-6 py-8">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-gray-200 py-6 mt-auto">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div>Social media</div>
          <div>Karta</div>
          <div>Kontaktinfo</div>
        </div>
      </footer>
    </div>
  );
};

