let guest = 0;

const Cup: React.FC = () => {
  guest += 1;
  return <h2>Rea cup for guest #{guest}</h2>;
};
export default Cup;
