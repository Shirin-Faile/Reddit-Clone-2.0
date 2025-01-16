'use client';
import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-xl font-bold">
          <Link to="/">
            <span className="text-blue-400 hover:underline">Reddit Clone</span>
          </Link>
        </h1>
        <nav>
          <Link to="/">
            <span className="text-blue-400 hover:underline">Home</span>
          </Link>
        </nav>
      </div>
    </header>
  );
}
