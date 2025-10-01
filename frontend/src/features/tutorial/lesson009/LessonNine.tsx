import { useState } from "react";
import MyButton from "../lesson009/MyButton";

const LessonNine: React.FC = () => {
  const [count, setCount] = useState<number>(0);
  const handleClick = () => setCount(count + 1);
  return (
    <div>
      <h1>Welcome to Lesson Nine</h1>
      <MyButton counter={count} onClick={handleClick} />
      <br />
      <MyButton counter={count} onClick={handleClick} />
    </div>
  );
};
export default LessonNine;
