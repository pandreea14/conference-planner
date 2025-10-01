interface MyButtonProps {
  counter: number;
  onClick: () => void;
}

const MyButton: React.FC<MyButtonProps> = ({ counter, onClick }) => {
  return <button onClick={onClick}>Count: {counter}</button>;
};
export default MyButton;
