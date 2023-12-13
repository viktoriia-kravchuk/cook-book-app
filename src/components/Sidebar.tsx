import "./sidebar.css";
import Nav from "./Nav/Nav";
import { FaHome } from "react-icons/fa";
import { ImBooks } from "react-icons/im";
import { RxExit } from "react-icons/rx";
import { GrPlan } from "react-icons/gr";
import { FaList } from "react-icons/fa";
import { DocumentData } from 'firebase/firestore';
import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../context/auth-context";
import { getUserDataById } from "../firebase/firebaseAuth";

let data = [
  { id: 0, name: "Home", icon: FaHome, link: "/home" },
  { id: 1, name: "Saved", icon: ImBooks, link: "/saved" },
  { id: 2, name: "Planner", icon: GrPlan, link: "/planner" },
  { id: 3, name: "Lists", icon: FaList, link: "/lists" },
];

const Sidebar = () => {
  const { currentUser, signOut } = useContext(AuthContext);
  console.log(currentUser);
  const [userData, setUserData] =useState<DocumentData | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      if (currentUser) {
        try {
          const userId = currentUser.uid;
          const userData = await getUserDataById(userId);
          setUserData(userData);
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
    };

    fetchUserData();
  }, [currentUser]);

  
  <button onClick={signOut}>Sign Out</button>;
  return (
    <div className="side-panel">
      <div className="profile">
      {userData && (
          <>
            <img
              src={userData.photoUrl || "https://source.unsplash.com/QXevDflbl8A/60x60"}
              alt="profile_photo"
              width="60"
              height="60"
            />
            <span>{userData.nickname || currentUser?.email}</span>
          </>
        )}
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
