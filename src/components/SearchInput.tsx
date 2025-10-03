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
        style={{ border: "1px solid black" }}
        onChange={onChange}
        placeholder="Search advocates..."
        aria-label="Search for advocates"
      />
      <button onClick={onReset}>Reset Search</button>
    </div>
  );
};