const SearchBar: React.FC = () => {
  return (
    <form>
      <input type="text" placeholder="Search..." />
      <br />
      <label>
        <input type="checkbox" /> Only show products on stock
      </label>
    </form>
  );
};
export default SearchBar;
