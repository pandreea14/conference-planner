import type React from "react";
import type { Product } from "./mockup";
import ProductCategoryRow from "./ProductCategoryRow";
import type { JSX } from "react";
import ProductRow from "./ProductRow";

const ProductTable: React.FC<{ products: Product[]; filterText: string; inStockOnly: boolean }> = ({
  products,
  filterText,
  inStockOnly
}) => {
  const rows: JSX.Element[] = [];
  let lastCategory: string | null;

  products.forEach((product) => {
    if (product.name.toLocaleLowerCase().indexOf(filterText.toLocaleLowerCase()) === -1) return; //nu gasim ce e in searchbar
    if (inStockOnly && !product.stocked) return;
    if (product.category !== lastCategory) rows.push(<ProductCategoryRow key={product.category} category={product.category} />);
    rows.push(<ProductRow key={product.name} product={product} />);
    lastCategory = product.category;
  });

  return (
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Price</th>
        </tr>
      </thead>
      <tbody>{rows}</tbody>
    </table>
  );
};
export default ProductTable;
