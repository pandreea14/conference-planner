const user = {
    name: 'Hedy Lamarr',
    imageUrl: 'https://i.imgur.com/yXOvdOSs.jpg',
    imageSize: 90,
};

const LessonFour: React.FC = () => {
    return (
        <>
            <h1>Welcome to Lesson Four</h1>
            <h2>{user.name}</h2>
            <img src={user.imageUrl} alt={user.name} style={{
                borderRadius: '50%',
                width: user.imageSize,
                height: user.imageSize
            }}/>
        </>
    );
};
export default LessonFour;