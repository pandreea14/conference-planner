import { useState } from "react";
import type { Product } from "./mockup";
import ProductTable from "./ProductTable";
import SearchBar from "./SearchBar";

const FilteredProductTable: React.FC<{ products: Product[] }> = ({ products }) => {
  const [filterText, setFilterText] = useState<string>("");
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);

  return (
    <div>
      <SearchBar
        filterText={filterText}
        onFilterTextChange={setFilterText}
        inStockOnly={inStockOnly}
        onInStockOnlyChange={setInStockOnly}
      />
      {/* asta nu calculeaza - doar afiseaza ce se calculeaza la search bar*/}
      <ProductTable products={products} filterText={filterText} inStockOnly={inStockOnly} />
    </div>
  );
};
export default FilteredProductTable;
