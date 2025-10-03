interface SearchInputProps {
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  onReset: () => void;
}

export const SearchInput: React.FC<SearchInputProps> = ({ onChange, onReset }) => {
  return (
    <div>
      <label htmlFor="search-input">Search</label>
      <input
        id="search-input"
        type="text"
        className="border border-black"
        onChange={onChange}
        placeholder="Search advocates..."
        aria-label="Search for advocates"
      />
      <button onClick={onReset} aria-label="Reset search to show all advocates">Reset Search</button>
    </div>
  );
};