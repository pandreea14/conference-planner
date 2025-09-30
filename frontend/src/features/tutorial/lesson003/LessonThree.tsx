import Paragraph from "./Paragraph.styled";

const LessonThree: React.FC = () => {
    return (
        <div>
            <h1>Welcome to Lesson Three</h1>
            <p>This is a normal paragraph</p>
            <p style={{ color: 'red' }}>This is a red paragraph.</p>
            <Paragraph> This is a special paragraph </Paragraph>
        </div>
    );
};  
export default LessonThree;