import type { Product } from "./MockUp";
import ProductTable from "./ProductTable";
import SearchBar from "./SearchBar";

const FilteredProductTable: React.FC<{ products: Product[] }> = ({ products }) => {
  return (
    <div>
      <SearchBar />
      <ProductTable products={products} />
    </div>
  );
};
export default FilteredProductTable;
