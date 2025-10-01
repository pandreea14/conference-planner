import { useState } from "react";
import AdminPanel from "./AdminPanel";
import LoginPanel from "./LoginPanel";

const LessonFive: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  //version 1: f statement
  let component: React.ReactElement;
  if (isLoggedIn) {
    component = <AdminPanel />;
  } else {
    component = <LoginPanel />;
  }

  return (
    <>
      <h1> Welcome to Lesson Five</h1>
      <button onClick={() => setIsLoggedIn(!isLoggedIn)}>Toggle login</button>
      <h2>Version 1: if statement</h2>
      {component}
      <h2>Version 2: decision ternary operator</h2>
      {isLoggedIn ? <AdminPanel /> : <LoginPanel />}
      <h2>Version 3: logical AND (&&) operator</h2>
      {isLoggedIn && <AdminPanel />}
      {!isLoggedIn && <LoginPanel />}
    </>
  );
};
export default LessonFive;
