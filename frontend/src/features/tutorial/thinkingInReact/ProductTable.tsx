import type React from "react";
import type { Product } from "./MockUp";
import ProductCategoryRow from "./ProductCategoryRow";
import type { JSX } from "react";
import ProductRow from "./ProductRow";

const ProductTable: React.FC<{ products: Product[] }> = ({ products }) => {
  const rows: JSX.Element[] = [];
  let lastCategory: string | null;

  products.forEach((product) => {
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
