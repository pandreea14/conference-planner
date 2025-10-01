const LessonSeven: React.FC = () => {
  const handleClick = () => {
    alert("I was clicked");
  };
  return (
    <div>
      <h1>Welcome to Lesson Seven</h1>
      <button onClick={handleClick}>Click me</button>
    </div>
  );
};
export default LessonSeven;
