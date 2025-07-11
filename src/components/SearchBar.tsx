import { useState } from "react";

export default function SearchBar({
  onSearch,
  onLocation,
  isLocating,
}: {
  onSearch: (value: string) => void;
  onLocation: () => void;
  isLocating: boolean;
}) {
  const [input, setInput] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      onSearch(input.trim());
      setInput("");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto flex w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl rounded-lg bg-white shadow-md overflow-hidden"
    >
      <button
        type="button"
        onClick={onLocation}
        disabled={isLocating}
        className={`relative flex items-center justify-center px-3 sm:px-4 text-sm sm:text-base transition-colors ${
          isLocating
            ? "text-gray-400 cursor-not-allowed"
            : "text-[#014565] hover:text-[#012f45]"
        }`}
        aria-label="Use current location"
        title="Use current location"
      >
        {/* Location icon (SVG) */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 11c.552 0 1 .448 1 1s-.448 1-1 1-1-.448-1-1 .448-1 1-1zm0-9v2m0 16v2m9-9h-2M4 12H2m15.364-6.364l-1.414 1.414M6.05 17.95l-1.414 1.414M17.95 17.95l1.414-1.414M6.05 6.05L4.636 7.464"
          />
        </svg>

        {/* Spinner overlays icon */}
        {isLocating && (
          <div className="absolute h-3.5 w-3.5 animate-spin rounded-full border-2 border-current border-t-transparent" />
        )}
      </button>

      <input
        type="text"
        placeholder="Enter city"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className="w-full px-4 py-2 sm:py-3 text-gray-700 text-sm sm:text-base focus:outline-none"
      />

      <button
        type="submit"
        className="bg-[#014565] text-white px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base hover:bg-[#01364e] transition-colors"
      >
        Search
      </button>
    </form>
  );
}
