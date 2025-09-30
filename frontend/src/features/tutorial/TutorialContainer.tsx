import { Box, Tab } from "@mui/material";
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
// import { useSearchParams } from "react-router-dom";
import { useState } from "react";
import LessonOne from "./lesson001/LessonOne";
import LessonTwo from "./lesson002/LessonTwo";
import L3 from "./lesson003/LessonThree";
import LessonFour from "./lesson004/LessonFour";

const TutorialContainer: React.FC = () => {
    // const [searchParams, setSearchParams] = useSearchParams("?tab=1");
    const [value, setValue] = useState<string>('1');

    // const handleChange = (_event: React.SyntheticEvent, newValue: string) => {
    //     setSearchParams({ tab: newValue });
    // };

    return (
        <Box sx={{ width: '100%', height: '100%' }}>
            <TabContext value={value}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <TabList onChange={(_e, newValue) => setValue(newValue)}>
                        <Tab label="Lesson One" value="1" />
                        <Tab label="Lesson Two" value="2" />
                        <Tab label="Lesson Three" value="3" />
                        <Tab label="Lesson Four" value="4" />
                        <Tab label="Lesson Five" value="5" />
                        <Tab label="Lesson Six" value="6" />
                        <Tab label="Lesson Seven" value="7" />
                        <Tab label="Lesson Eight" value="8" />
                        <Tab label="Lesson Nine" value="9" />
                        <Tab label="Thinking in React" value="TiR" />
                        <Tab label="Lesson Ten" value="10" />
                        <Tab label="Lesson Eleven" value="11" />
                        <Tab label="Lesson Twelve" value="12" />
                        <Tab label="Lesson Thirteen" value="13" />
                    </TabList>
                </Box>
                <TabPanel value="1"><LessonOne /></TabPanel>
                <TabPanel value="2"><LessonTwo /></TabPanel>
                <TabPanel value="3"><L3 /></TabPanel>
                <TabPanel value="4"><LessonFour /></TabPanel>
            </TabContext>
        </Box>
    );
};

export default TutorialContainer;