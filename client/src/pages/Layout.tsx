import { NavLink, Outlet } from "react-router-dom";

export const Layout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="bg-slate-100 text-slate-700 border-b border-slate-200">
  <nav className="container mx-auto flex justify-between items-center py-4 px-6">
    
    <div className="text-xl font-bold text-slate-800">
      Drug Targets 3D Human
    </div>

    <ul className="flex space-x-6">
      <li>
        <NavLink
          to="/"
          className={({ isActive }) =>
            isActive
              ? "text-teal-600 font-semibold"
              : "hover:text-teal-500 transition"
          }
        >
          Home
        </NavLink>
      </li>

      <li>
        <NavLink
          to="/ModelPage"
          className={({ isActive }) =>
            isActive
              ? "text-teal-600 font-semibold"
              : "hover:text-teal-500 transition"
          }
        >
          ModelPage
        </NavLink>
      </li>

      <li>
        <NavLink
          to="/Signup"
          className={({ isActive }) =>
            isActive
              ? "text-teal-600 font-semibold"
              : "hover:text-teal-500 transition"
          }
        >
          Sign up
        </NavLink>
      </li>

      <li>
        <NavLink
          to="/Contact"
          className={({ isActive }) =>
            isActive
              ? "text-teal-600 font-semibold"
              : "hover:text-teal-500 transition"
          }
        >
          Contact us
        </NavLink>
      </li>
    </ul>

  </nav>
</header>


      {/* Main content */}
      <main className="flex-1 container mx-auto px-4 py-4">
  <Outlet />
</main>

      {/* Footer */}
      <footer className="bg-gray-800 text-gray-200 text-sm">
      <div className="max-w-7xl mx-auto px-6 py-4 grid grid-cols-1 md:grid-cols-3 gap-4">

        {/* Stockholm */}
        <div>
          <p className="font-semibold">Stockholm</p>
          <p>Gustavslundsvägen 151 D, Bromma</p>
          <p>08–442 95 00</p>
        </div>

        {/* Göteborg */}
        <div>
          <p className="font-semibold">Göteborg</p>
          <p>Anders Personsgatan 14</p>
          <p>031–83 28 31</p>
        </div>

        {/* Malmö */}
        <div>
          <p className="font-semibold">Malmö</p>
          <p>Drottninggatan 4B</p>
          <p>040–643 96 10</p>
        </div>

      </div>

      <div className="text-center text-xs text-gray-400 pb-2">
        © {new Date().getFullYear()} Medieinstitutet
      </div>
    </footer>
    </div>
  );
};

