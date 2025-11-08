import React from "react";
import { Link } from "react-router-dom";

export default function ItemList({ title, items, basePath }) {
  // Ensure we always have an array
  const safeItems = Array.isArray(items) ? items : [];

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-3">{title}</h2>
      <ul className="space-y-2">
        {safeItems.length > 0 ? (
          safeItems.map((item) => (
            <li key={item.id} className="border p-2 rounded hover:bg-gray-50  text-white">
              <Link to={`/${basePath}/${item.id}`} className="text-blue-600">
                {item.title || item.name || item.username || "(unnamed)"}
              </Link>
            </li>
          ))
        ) : (
          <strong>No {basePath} found.</strong>
        )}
      </ul>
    </div>
  );
}
