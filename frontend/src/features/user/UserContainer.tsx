import React from "react";
import { UserDetailCard } from "./UserDetailCard";
import { UserCard } from "./UserCard";

const UserContainer: React.FC = () => {

  return (
    <>
      <UserCard/>
      <UserDetailCard/>
    </>
  );
};

export default UserContainer;
