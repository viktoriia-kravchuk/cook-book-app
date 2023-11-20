import React, { ReactNode } from "react";
import Sidebar from "../Sidebar";
import "./layout.css";

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="layout">
      <Sidebar />
      <div className="main">{children}</div>
    </div>
  );
};

export default Layout;