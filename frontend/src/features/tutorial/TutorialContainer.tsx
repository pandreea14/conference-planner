import { Box, Tab } from "@mui/material";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import LessonOne from "./lesson001/LessonOne";
import LessonTwo from "./lesson002/LessonTwo";
import L3 from "./lesson003/LessonThree";
import LessonFour from "./lesson004/LessonFour";
import LessonFive from "./lesson005/LessonFive";
import LessonSix from "./lesson006/LessonSix";
import LessonSeven from "./lesson007/LessonSeven";
import LessonEight from "./lesson008/LessonEight";
import LessonNine from "./lesson009/LessonNine";
import ThinkingInReact from "./thinkingInReact/ThinkingInReact";
import LessonTen from "./lesson010/LessonTen";
import { useSearchParams } from "react-router-dom";
import LessonEleven from "./lesson011/LessonEleven";
import LessonTwelve from "./lesson012/LessonTwelve";
import LessonThirteen from "./lesson013/LessonThirteen";

const TutorialContainer: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams("?tab=1");
  const value: string = searchParams.get("tab") || "1";
  // const [value, setValue] = useState<string>("1");

  return (
    <Box sx={{ width: "100%", height: "100%" }}>
      <TabContext value={value}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <TabList onChange={(_e, newValue) => setSearchParams({ tab: newValue })} variant="scrollable" scrollButtons="auto">
            <Tab label="Lesson One" value="1" />
            <Tab label="Lesson Two" value="2" />
            <Tab label="Lesson Three" value="3" />
            <Tab label="Lesson Four" value="4" />
            <Tab label="Lesson Five" value="5" />
            <Tab label="Lesson Six" value="6" />
            <Tab label="Lesson Seven" value="7" />
            <Tab label="Lesson Eight" value="8" />
            <Tab label="Lesson Nine" value="9" />
            <Tab label="Thinking in React" value="tir" />
            <Tab label="Lesson Ten" value="10" />
            <Tab label="Lesson Eleven" value="11" />
            <Tab label="Lesson Twelve" value="12" />
            <Tab label="Lesson Thirteen" value="13" />
          </TabList>
        </Box>
        <TabPanel value="1">
          <LessonOne />
        </TabPanel>
        <TabPanel value="2">
          <LessonTwo />
        </TabPanel>
        <TabPanel value="3">
          <L3 />
        </TabPanel>
        <TabPanel value="4">
          <LessonFour />
        </TabPanel>
        <TabPanel value="5">
          <LessonFive />
        </TabPanel>
        <TabPanel value="6">
          <LessonSix />
        </TabPanel>
        <TabPanel value="7">
          <LessonSeven />
        </TabPanel>
        <TabPanel value="8">
          <LessonEight />
        </TabPanel>
        <TabPanel value="9">
          <LessonNine />
        </TabPanel>
        <TabPanel value="tir">
          <ThinkingInReact />
        </TabPanel>
        <TabPanel value="10">
          <LessonTen />
        </TabPanel>
        <TabPanel value="11">
          <LessonEleven />
        </TabPanel>
        <TabPanel value="12">
          <LessonTwelve />
        </TabPanel>
        <TabPanel value="13">
          <LessonThirteen />
        </TabPanel>
      </TabContext>
    </Box>
  );
};

export default TutorialContainer;
