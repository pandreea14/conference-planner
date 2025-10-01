import FilteredProductTable from "./FilteredProductTable";
import { mockup } from "./MockUp";

const ThinkingInReact: React.FC = () => {
  return (
    <div>
      <h1>Thinking in React</h1>
      <FilteredProductTable products={mockup} />
    </div>
  );
};
export default ThinkingInReact;
