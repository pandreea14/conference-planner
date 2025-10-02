const SearchBar: React.FC<{
  filterText: string;
  inStockOnly: boolean;
  onFilterTextChange: (value: string) => void;
  onInStockOnlyChange: (value: boolean) => void;
}> = ({ filterText, inStockOnly, onFilterTextChange, onInStockOnlyChange }) => {
  const handleFilterTextChange = (event: { target: { value: string } }) => onFilterTextChange(event.target.value);
  const handleInStockONlyChange = (event: { target: { checked: boolean } }) => onInStockOnlyChange(event.target.checked);

  return (
    <form>
      <input type="text" placeholder="Search..." value={filterText} onChange={handleFilterTextChange} />
      <br />
      <label>
        <input type="checkbox" checked={inStockOnly} onChange={handleInStockONlyChange} /> Only show products on stock
      </label>
    </form>
  );
};
export default SearchBar;
