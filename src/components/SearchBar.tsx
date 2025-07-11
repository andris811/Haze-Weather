import { useState } from "react";

export default function SearchBar({ onSearch }: { onSearch: (value: string) => void }) {
  const [input, setInput] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      onSearch(input.trim());
      setInput("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mx-auto flex w-full max-w-md rounded-lg bg-white shadow-md overflow-hidden">
      <input
        type="text"
        placeholder="Enter city"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className="w-full px-4 py-2 text-gray-700 focus:outline-none"
      />
      <button
        type="submit"
        className="bg-[#014565] text-white px-4 py-2 hover:bg-[#01364e] transition-colors"
      >
        Search
      </button>
    </form>
  );
}
