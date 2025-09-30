import { styled } from "@mui/system";

const Paragraph = styled("p")(({ theme }) => ({
    fontSize: '2rem',
    lineHeight: 2.2,
    color: theme.palette.text.secondary,
}));
export default Paragraph;