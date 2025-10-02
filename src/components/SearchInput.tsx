interface SearchInputProps {
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  onReset: () => void;
}

export const SearchInput: React.FC<SearchInputProps> = ({ onChange, onReset }) => {
  return (
    <div>
      <p>Search</p>
      <input
        style={{ border: "1px solid black" }}
        onChange={onChange}
        placeholder="Search advocates..."
      />
      <button onClick={onReset}>Reset Search</button>
    </div>
  );
};