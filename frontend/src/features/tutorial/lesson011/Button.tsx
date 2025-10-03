interface ButtonProps {
  children: React.ReactNode;
  onSmash: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

export default function Button({ children, onSmash }: ButtonProps) {
  return <button onClick={onSmash}>{children}</button>;
}
