interface PureCupProps {
  guest: number;
}

const PureCup: React.FC<PureCupProps> = ({ guest }) => {
  return <h2>Tea cup for guest #{guest}</h2>;
};
export default PureCup;
