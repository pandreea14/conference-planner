import Button from "./Button";

const LessonEleven: React.FC = () => {
  const handlePlayMovie = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    alert("Playing");
  };
  const handleUploading = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    alert("Uploading");
  };

  return (
    <div>
      <h1>Welcome to Lesson Eleven</h1>
      <h4>Responding to events</h4>
      <div
        style={{ display: "flex", gap: "10px", padding: "10px 60px", backgroundColor: "red" }}
        onClick={() => alert("Container clicked!")}
      >
        <Button onSmash={handlePlayMovie}>Play Movie</Button>
        <Button onSmash={handleUploading}>Upload image</Button>
        <a href="https://reactrouter.com/api/hooks/useSearchParams" target="_blank" onClick={(e) => (e.preventDefault(), alert("clicked"))}>
          {/* <a href="https://reactrouter.com/api/hooks/useSearchParams" target="_blank"> */}
          Read more
        </a>
      </div>
    </div>
  );
};

export default LessonEleven;
