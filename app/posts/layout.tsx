import React from "react";

type Props = {
  children: React.ReactNode;
};

const Layout = ({ children }: Props) => {
  return (
    <div>
      <h1>/posts</h1>
      {children}
    </div>
  );
};

export default Layout;
