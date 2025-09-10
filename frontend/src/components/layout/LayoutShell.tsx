import React from "react";
import { LayoutProvider } from "providers";
import MainContainer from "./MainContainer";

const LayoutShell: React.FC = () => {
  return (
    <LayoutProvider>
      <MainContainer />
    </LayoutProvider>
  );
};

export default LayoutShell;
