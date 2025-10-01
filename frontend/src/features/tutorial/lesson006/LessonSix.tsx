const products = [
  { title: "Cabbage", isFruit: false, id: 1 },
  { title: "Garlic", isFruit: false, id: 2 },
  { title: "Apple", isFruit: true, id: 3 }
];

const LessonSix: React.FC = () => {
  const components = products.map((product, _index, _list) => (
    <li key={product.id} style={{ color: product.isFruit ? "magenta" : "darkgreen" }}>
      {product.title}
    </li>
  ));
  return (
    <div>
      <h1>Welcome to Lesson Six</h1>
      <ul>{components}</ul>
    </div>
  );
};
export default LessonSix;
