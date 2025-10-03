import { useState } from "react";

const LessonTwelve: React.FC = () => {
  const [count, setCount] = useState<number>(0);
  return (
    <div>
      <h1>Welcome to Lesson Twelve</h1>
      <h4>rendering takes a snapshot in time</h4>
      <div style={{ columnCount: 2, columnGap: "2rem", justifyContent: "left", display: "flex" }}>
        <h5>{count}</h5>
        <button
          onClick={() => {
            setCount(count + 1);
            setCount(count + 1);
            setCount(count + 1);
          }}
        >
          {" "}
          +1 la counter{" "}
        </button>

        <button
          onClick={() => {
            setCount((c) => c + 1);
            setCount((c) => c + 1);
            setCount((c) => c + 1);
          }}
        >
          {" "}
          +3 la counter{" "}
        </button>

        <button
          onClick={() => {
            setCount(count + 5);
            setCount((c) => c + 1);
          }}
        >
          {" "}
          +6{" "}
        </button>

        <button
          onClick={() => {
            setCount(count + 5);
            setCount((c) => c + 1);
            setCount(100);
          }}
        >
          {" "}
          100{" "}
        </button>
      </div>
    </div>
  );
};

export default LessonTwelve;
