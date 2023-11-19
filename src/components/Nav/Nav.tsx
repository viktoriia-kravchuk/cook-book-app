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
    <div className="item" onClick={onClick}>
      {Icon && <Icon className="icon" />}
      {link ? (
        <span>
          <Link to={link}>{name}</Link>
        </span>
      ) : (
        <span>{name}</span>
      )}
    </div>
  );
};

export default Nav;
