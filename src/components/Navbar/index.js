import React, { useState } from "react";
import styled from "styled-components";
import { FaBars } from "react-icons/fa";
import { useLocation, useHistory } from "react-router-dom";
import { isDistributor, isLogedIn } from "../../utilities/storage";

const Navbar = (props) => {
  const location = useLocation();
  const history = useHistory();
  const [menu, setmenu] = useState(false);

  const signInBtn = () => {
    setmenu(!menu);
    history.push({
      pathname: "/signin",
      state: { prePath: location.pathname },
    });
  };
  const signOutBtn = () => {
    setmenu(!menu);
    history.push("/signout");
  };

  const homeBtn = () => {
    setmenu(!menu);
    history.push("/");
  };
  const mealRequestBtn = () => {
    setmenu(!menu);
    history.push("/mealrequest");
  };
  const myMealBtn = () => {
    setmenu(!menu);
    history.push("/mymeal");
  };

  return (
    <MainCont>
      <NavCont>
        <div style={{ marginLeft: 30 }}>
          <h3 style={{ fontWeight: "bold", color: "#469623" }}>
            Food For Life
          </h3>
        </div>
        <MenuBtn
          onClick={() => {
            setmenu(!menu);
          }}
        ></MenuBtn>
      </NavCont>
      <div style={{ height: 60, width: "100%" }}></div>
      <MenuCont menu={menu}>
        <MenuItem onClick={homeBtn}>
          <MenuItemTxt>HOME</MenuItemTxt>
        </MenuItem>
        {isLogedIn() && isDistributor() ? (
          <MenuItem onClick={mealRequestBtn}>
            <MenuItemTxt>MEAL REQUEST</MenuItemTxt>
          </MenuItem>
        ) : null}
        {isLogedIn() && !isDistributor() ? (
          <MenuItem onClick={myMealBtn}>
            <MenuItemTxt>MY MEAL</MenuItemTxt>
          </MenuItem>
        ) : null}
        {isLogedIn() ? (
          <MenuItem onClick={signOutBtn}>
            <MenuItemTxt>SIGN OUT</MenuItemTxt>
          </MenuItem>
        ) : (
          <MenuItem onClick={signInBtn}>
            <MenuItemTxt>SIGN IN</MenuItemTxt>
          </MenuItem>
        )}
      </MenuCont>
    </MainCont>
  );
};

export default Navbar;

const MainCont = styled.div`
  display: flex;
  flex-direction: column;
  background: #1f2223;
  transition: 0.3s;
  z-index: 10;
`;

const NavCont = styled.div`
  position: absolute;
  top: 0px;
  width: 100%;
  display: flex;
  align-items: center;
  height: 60px;
  background: #1f2223;
  box-shadow: 1px 1px 1px black;
  z-index: 10;
`;
const MenuCont = styled.div`
  display: flex;
  flex-direction: column;
  transition: 0.3s;
  margin-top: ${({ menu }) => (menu ? "0px" : "-150px")};
`;
const MenuItem = styled.div`
  display: flex;
  text-decoration: none;
  background: #273a23;
  box-shadow: 0px 0px 0px;
  height: 50px;
  color: #469623;
  cursor: pointer;
  justify-content: flex-end;
  align-items: flex-end;
  border-bottom: 1px solid #212823;

  :hover {
    background: #232e23;
    color: #57a32a;
  }
`;
const MenuItemTxt = styled.h4`
  text-decoration: none;
  font-size: 1.2rem;
  font-weight: bold;
  margin-right: 36px;
`;

const MenuBtn = styled(FaBars)`
  position: absolute;
  right: 30px;
  height: 2rem;
  width: 2rem;
  padding: 6px;
  color: #469623;
`;
