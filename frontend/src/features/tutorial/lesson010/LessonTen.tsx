import Cup from "./Cup";
import PureCup from "./PureCup";
import Recipe from "./Recipe";

const LessonTen: React.FC = () => {
  const cups = [];
  for (let i = 1; i <= 3; i++) {
    cups.push(<PureCup key={i} guest={i} />);
  }

  return (
    <div>
      <h1>Welcome to Lesson Ten</h1>
      <h2>For 2 people you should:</h2>
      <Recipe drinkers={2} />
      <h2>For 4 people you should:</h2>
      <Recipe drinkers={4} />
      <section>
        <Cup />
        <Cup />
        <Cup />
      </section>
      <section>{cups}</section>
    </div>
  );
};

export default LessonTen;
