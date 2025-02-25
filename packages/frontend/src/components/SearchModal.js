"use client";
import React, { useState, useEffect } from "react";
import { X, Search, Filter, ArrowUpDown } from "lucide-react";
import axiosInstance from "@/utils/axiosConfig";

const SearchModal = ({
  isOpen,
  onClose,
  warehouseId,
  query,
  setQuery,
  onClick,
}) => {
  const [results, setResults] = useState([]);
  const [filters, setFilters] = useState([]);
  const [sortBy, setSortBy] = useState("name");
  const [loading, setLoading] = useState(false);
  const [uniqueTags, setUniqueTags] = useState([]);

  // Fake API Call
  useEffect(() => {
    if (!isOpen) return;
    // Request for search
    handleSearch();
    // setResults(fakeResults);
  }, [isOpen]);

  const handleSearch = async () => {
    try {
      console.log("SEARCHING BLOCS");
      const response = await axiosInstance.get(
        `/bloc/search/${warehouseId}?query=${query}`
      );
      console.log(response.data);
      setResults(response.data);

      // Extract unique tags from results
      const tags = response.data.flatMap((bloc) =>
        bloc.tags.map((tag) => tag.name)
      );
      const uniqueTags = [...new Set(tags)];
      setUniqueTags(uniqueTags);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Filtrage & Tri
  const filteredResults = results
    .filter(
      (bloc) =>
        filters.length === 0 ||
        filters.some((f) => bloc.tags.map((tag) => tag.name).includes(f))
    )
    .sort((a, b) => {
      if (sortBy === "name") return a.name.localeCompare(b.name);
      if (sortBy === "weight") return a.weight - b.weight;
      if (sortBy === "date")
        return new Date(b.createdAt) - new Date(a.createdAt);
    });

  const toggleFilter = (tag) => {
    setFilters((prevFilters) =>
      prevFilters.includes(tag)
        ? prevFilters.filter((f) => f !== tag)
        : [...prevFilters, tag]
    );
  };

  return isOpen ? (
    <div className="fixed inset-0 flex items-center  flex-col justify-center bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="  relative  w-full max-w-md  mb-4">
        <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSearch();
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

      {uniqueTags && (
        <div className="flex flex-wrap gap-2 mb-4">
          {uniqueTags.map((tag) => (
            <button
              key={tag}
              className={`px-3 py-1.5 text-sm rounded-full ${
                filters.includes(tag) ? "bg-blue-500 text-white" : "bg-gray-200"
              }`}
              onClick={() => toggleFilter(tag)}
            >
              {tag}
            </button>
          ))}
        </div>
      )}
      <div className="bg-white w-[90%] max-w-lg p-6 rounded-2xl shadow-xl relative">
        <button
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
          onClick={onClose}
        >
          <X size={20} />
        </button>
        <h2 className="text-lg font-semibold mb-4">Results for "{query}"</h2>

        {/* Filtres */}
        <div className="flex gap-2 mb-4">
          <button
            className="flex items-center gap-1 px-3 py-1.5 bg-gray-100 rounded-full text-sm"
            onClick={() => setSortBy("name")}
          >
            <ArrowUpDown size={16} /> Name
          </button>
          <button
            className="flex items-center gap-1 px-3 py-1.5 bg-gray-100 rounded-full text-sm"
            onClick={() => setSortBy("weight")}
          >
            <ArrowUpDown size={16} /> Weight
          </button>
          <button
            className="flex items-center gap-1 px-3 py-1.5 bg-gray-100 rounded-full text-sm"
            onClick={() => setSortBy("date")}
          >
            <ArrowUpDown size={16} /> Date
          </button>
        </div>

        {/* Résultats */}
        <div className="max-h-80  overflow-y-auto space-y-3">
          {filteredResults.length > 0 ? (
            filteredResults.map((bloc) => (
              <div
                key={bloc._id}
                className="p-3 bg-gray-50 rounded-lg shadow flex justify-between items-center"
              >
                <div>
                  <h3 className="font-semibold">{bloc.name}</h3>
                  <p className="text-sm text-gray-500">
                    {bloc.blocs.length ? `${bloc.blocs.length} blocs` : "Empty"}
                  </p>
                  <p className="text-sm text-gray-500">
                    {bloc.parent ? `Inside: ${bloc.parent.name}` : ""}
                  </p>
                </div>
                <div className="flex gap-1">
                  {bloc.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 text-xs bg-blue-100 text-blue-600 rounded-full"
                    >
                      {tag.name}
                    </span>
                  ))}
                </div>
                <button onClick={() => onClick(bloc)}>View</button>
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
