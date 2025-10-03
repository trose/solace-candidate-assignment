interface SearchInputProps {
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  onReset: () => void;
  value?: string;
}

export const SearchInput: React.FC<SearchInputProps> = ({ onChange, onReset, value = "" }) => {
  return (
    <div className="flex gap-2 items-center">
      <label htmlFor="search-input" className="font-medium">Search</label>
      <input
        id="search-input"
        type="text"
        className="border border-gray-300 rounded px-3 py-2 flex-1"
        onChange={onChange}
        value={value}
        placeholder="Search advocates..."
        aria-label="Search for advocates"
      />
      <button
        onClick={onReset}
        className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded"
        aria-label="Reset search to show all advocates"
      >
        Reset Search
      </button>
    </div>
  );
};