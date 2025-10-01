import type { Product } from "./MockUp";

const ProductRow: React.FC<{ product: Product }> = ({ product }) => {
  const name = product.stocked ? product.name : <span style={{ color: "red" }}>{product.name}</span>;
  return (
    <tr>
      <td>{name}</td>
      <td>{product.price}</td>
    </tr>
  );
};
export default ProductRow;
