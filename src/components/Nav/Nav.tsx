import React, { useState } from "react";
import { IconType } from "react-icons";
import { Link } from "react-router-dom";
import "./nav.css";

interface Data {
  id: number;
  name: string;
  icon: IconType;
  link?: string;
  onClick?: () => void;
}

const Nav: React.FC<Data> = (props) => {
  const { icon: Icon, name, onClick, link } = props;
  return (
    <Link to={link || "#"}>
      <div className="item" onClick={onClick}>
        {Icon && <Icon className="icon" />}
        <span>{name}</span>
      </div>
    </Link>
  );
};

export default Nav;
