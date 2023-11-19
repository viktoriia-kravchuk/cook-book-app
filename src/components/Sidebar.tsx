import "./sidebar.css";
import Nav from "./Nav/Nav";
import { FaHome } from "react-icons/fa";
import { ImBooks } from "react-icons/im";
import { RxExit } from "react-icons/rx";
import { GrPlan } from "react-icons/gr";
import { FaList } from "react-icons/fa";

import { useContext } from "react";
import { AuthContext } from "../context/auth-context";

let data = [
  { id: 0, name: "Home", icon: FaHome, link: "/home" },
  { id: 1, name: "Saved", icon: ImBooks, link: "/saved" },
  { id: 2, name: "Planner", icon: GrPlan, link: "/planner" },
  { id: 3, name: "Lists", icon: FaList, link: "/lists" },
];

const Sidebar = () => {
  const { currentUser, signOut } = useContext(AuthContext);
  <button onClick={signOut}>Sign Out</button>;
  return (
    <div className="side-panel">
      <div className="profile">
        <img
          src="https://source.unsplash.com/QXevDflbl8A/60x60"
          alt="profile_photo"
          width="60"
          height="60"
        />
        <span>{currentUser?.email}</span>
      </div>
      <div className="item-container">
        {data.map((item) => (
          <Nav
            key={item.id}
            id={item.id}
            name={item.name}
            icon={item.icon}
            link={item.link}
          />
        ))}
        <Nav id={5} name="Sign Out" icon={RxExit} onClick={signOut} />
      </div>
    </div>
  );
};

export default Sidebar;
