"use client";
import React, { useState, useEffect } from "react";
import { X, Search, Filter, ArrowUpDown } from "lucide-react";

const SearchModal = ({ isOpen, onClose, query, setQuery }) => {
  const [results, setResults] = useState([]);
  const [filters, setFilters] = useState([]);
  const [sortBy, setSortBy] = useState("name");

  // Fake API Call
  useEffect(() => {
    if (!isOpen) return;

    // Simule une recherche avec des blocs factices
    const fakeResults = [
      {
        id: 1,
        name: "Bloc A",
        height: 10,
        width: 20,
        weight: 5,
        tags: ["Stock", "Fragile"],
        createdAt: "2024-02-15",
      },
      {
        id: 2,
        name: "Bloc B",
        height: 15,
        width: 25,
        weight: 8,
        tags: ["Lourd"],
        createdAt: "2024-02-12",
      },
      {
        id: 3,
        name: "Bloc C",
        height: 8,
        width: 18,
        weight: 3,
        tags: ["Stock"],
        createdAt: "2024-02-18",
      },
    ];

    setResults(fakeResults);
  }, [isOpen]);

  // Filtrage & Tri
  const filteredResults = results
    .filter(
      (bloc) =>
        filters.length === 0 || filters.some((f) => bloc.tags.includes(f))
    )
    .sort((a, b) => {
      if (sortBy === "name") return a.name.localeCompare(b.name);
      if (sortBy === "weight") return a.weight - b.weight;
      if (sortBy === "date")
        return new Date(b.createdAt) - new Date(a.createdAt);
    });

  return isOpen ? (
    <div className="fixed inset-0 flex items-center  flex-col justify-center bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="  relative  w-full max-w-md  mb-4">
        <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
        <form
          onSubmit={(e) => {
            e.preventDefault();
          }}
        >
          <input
            type="text"
            placeholder="Rechercher..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-full bg-white shadow-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </form>
      </div>
      <div className="bg-white w-[90%] max-w-lg p-6 rounded-2xl shadow-xl relative">
        <button
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
          onClick={onClose}
        >
          <X size={20} />
        </button>
        <h2 className="text-lg font-semibold mb-4">Résultats pour "{query}"</h2>

        {/* Filtres */}
        <div className="flex gap-2 mb-4">
          <button
            className="flex items-center gap-1 px-3 py-1.5 bg-gray-100 rounded-full text-sm"
            onClick={() => setSortBy("name")}
          >
            <ArrowUpDown size={16} /> Nom
          </button>
          <button
            className="flex items-center gap-1 px-3 py-1.5 bg-gray-100 rounded-full text-sm"
            onClick={() => setSortBy("weight")}
          >
            <ArrowUpDown size={16} /> Poids
          </button>
          <button
            className="flex items-center gap-1 px-3 py-1.5 bg-gray-100 rounded-full text-sm"
            onClick={() => setSortBy("date")}
          >
            <ArrowUpDown size={16} /> Date
          </button>
        </div>

        {/* Résultats */}
        <div className="max-h-80 overflow-y-auto space-y-3">
          {filteredResults.length > 0 ? (
            filteredResults.map((bloc) => (
              <div
                key={bloc.id}
                className="p-3 bg-gray-50 rounded-lg shadow flex justify-between items-center"
              >
                <div>
                  <h3 className="font-semibold">{bloc.name}</h3>
                  <p className="text-sm text-gray-500">
                    Poids: {bloc.weight}kg
                  </p>
                  <p className="text-sm text-gray-500">
                    Taille: {bloc.height}x{bloc.width}
                  </p>
                </div>
                <div className="flex gap-1">
                  {bloc.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 text-xs bg-blue-100 text-blue-600 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center">Aucun résultat trouvé.</p>
          )}
        </div>
      </div>
    </div>
  ) : null;
};

export default SearchModal;
