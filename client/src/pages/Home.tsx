import { NavLink } from "react-router-dom";
import { useEffect, useState } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "../firebase";

export default function Home() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, setUser);
    return unsubscribe;
  }, []);

  return (
    <div className="max-w-6xl mx-auto space-y-16">

      {/* Hero section */}
      <section className="text-center space-y-6">
        <h1 className="text-4xl font-bold">
          Interactive 3D Drug & Human Anatomy Viewer
        </h1>

        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          This project visualizes how different drugs affect the human body
          using an interactive 3D anatomical model.  
          Designed for education, research, and better understanding of
          drug–organ interactions.
        </p>

        <div className="flex justify-center gap-4">
          {user ? (
            <NavLink
              to="/ModelPage"
              className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 transition"
            >
              Explore the 3D Model
            </NavLink>
          ) : (
            <NavLink
              to="/Signup"
              className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 transition"
            >
              Log in to use the service
            </NavLink>
          )}

          <NavLink
            to="/Contact"
            className="border border-blue-600 text-blue-600 px-6 py-3 rounded hover:bg-blue-50 transition"
          >
            Contact Us
          </NavLink>
        </div>
      </section>

      {/* Features */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
        <div className="p-6 bg-white rounded shadow">
          <h3 className="font-semibold text-lg mb-2">🧠 Human Anatomy in 3D</h3>
          <p className="text-gray-600">
            Explore a full 3D human body model with interactive organs
            rendered in real time.
          </p>
        </div>

        <div className="p-6 bg-white rounded shadow">
          <h3 className="font-semibold text-lg mb-2">💊 Drug–Organ Interaction</h3>
          <p className="text-gray-600">
            Search for drugs and instantly see which organs are affected
            and how they are impacted.
          </p>
        </div>

        <div className="p-6 bg-white rounded shadow">
          <h3 className="font-semibold text-lg mb-2">🎓 Educational Focus</h3>
          <p className="text-gray-600">
            Built as an educational tool for students, researchers,
            and healthcare-related studies.
          </p>
        </div>
      </section>

      {/* About project */}
      <section className="bg-gray-50 p-8 rounded text-center space-y-4">
        <h2 className="text-2xl font-semibold">About the Project</h2>
        <p className="text-gray-600 max-w-3xl mx-auto">
          This application is developed as part of a software development
          project focusing on modern web technologies, 3D visualization,
          and data-driven interaction.
        </p>
      </section>

    </div>
  );
}
