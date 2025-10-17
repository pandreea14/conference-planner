import { Slide, useScrollTrigger } from "@mui/material";

interface HideOnScrollProps {
  children: React.ReactElement;
}

const HideOnScroll: React.FC<HideOnScrollProps> = ({ children }) => {
  const trigger = useScrollTrigger({
    threshold: 20,
    disableHysteresis: true
  });

  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  );
};
export default HideOnScroll;
