import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationArrow, faSpinner } from "@fortawesome/free-solid-svg-icons";

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
        <FontAwesomeIcon icon={faLocationArrow} className="h-5 w-5" />

        {isLocating && (
          <FontAwesomeIcon
            icon={faSpinner}
            spin
            className="absolute h-3.5 w-3.5 text-[#014565]"
          />
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
