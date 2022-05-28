import "./menu.css";
import { Link } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";

import { setDatabase } from "../../reducers/datebase";
function Menu() {
  const nameColor = useSelector((state) => state.colours.colours);
  const searchRef = useRef(null);
  const [user, setUser] = useState(["none"]);
  const ref = useRef();
  const refTwo = useRef();
  const refThree = useRef();
  const refFour = useRef();
  const [stateOfWindow, setStateOfWindow] = useState("none");
  window.onclick = (event) => {
    if (event.target !== ref.current) setStateOfWindow("none");
    if (
      event.target === refTwo.current ||
      event.target === refThree.current ||
      event.target === refFour.current
    ) {
      showWindow();
      console.log("img");
    }
  };
  const sendDataAboutUser = async () => {
    let response = await fetch(
      `http://localhost:8000/api/post/findAuthorizedUser?logMessage=${localStorage.getItem(
        "token"
      )}`
    );
    let result = await response.json();

    setUser(result);
  };
  const leaveFromAccount = () => {
    localStorage.setItem("token", " ");
    window.location.reload();
  };
  const showWindow = () => {
    if (stateOfWindow === "grid") setStateOfWindow("none");
    if (stateOfWindow === "none") setStateOfWindow("grid");
  };
  const dispatch = useDispatch();
  const searchArticle = async () => {
    if (window.location.pathname !== "/") return;
    let response = await fetch(
      "http://localhost:8000/api/post/searchArticle/",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json;charset=utf-8",
        },
        body: JSON.stringify({
          text: searchRef.current.value,
        }),
      }
    );
    let result = await response.json();
    dispatch(setDatabase(result));
  };

  useEffect(() => {
    sendDataAboutUser();
  }, [stateOfWindow]);
  return (
    <div>
      <div>
        <div className="menu">
          <div className="firstPart">
            <div className="logo">
              <Link to="/" className="logoWithout">
                <p>.blognode</p>
              </Link>
            </div>
            <div className="searchField">
              <input
                onInput={searchArticle}
                ref={searchRef}
                id="infoFromSearchField"
                type="text"
                placeholder="Search"
              />
            </div>
          </div>
          <div className="secondPart">
            {user.map((item, index) => {
              if (item === "none")
                return (
                  <div className="singUpAndIn" key={index}>
                    <div className="signUp">
                      <Link to="/signUp" className="linkRegister">
                        Sign Up
                      </Link>
                    </div>
                    <div>
                      <Link to="/signIn" className="linkRegister">
                        Sign In
                      </Link>
                    </div>
                  </div>
                );
              else
                return (
                  <div key={index}>
                    <div className="userInfo" ref={refTwo}>
                      <img src={item.img} ref={refThree} width="35px" alt="" />
                      <p ref={refFour}>{item.name}</p>
                    </div>
                    <div
                      className="settignsAndSomething"
                      ref={ref}
                      style={{ display: stateOfWindow }}
                    >
                      <div className="point">
                        <p>Settings</p>
                      </div>

                      <div className="point">
                        <Link to="/editor" className="publishLink">
                          <p>Post article</p>
                        </Link>
                      </div>
                      <div className="point">
                        <p onClick={leaveFromAccount}>Log out</p>
                      </div>
                    </div>
                  </div>
                );
            })}
          </div>
          <div className="menuLeft">
            <Link to="/" className="linkRegister">
              <p className="" style={{ color: nameColor[0] }}>
                Tape
              </p>
            </Link>
            <Link to="/subs" className="linkRegister">
              <p className="gray" style={{ color: nameColor[1] }}>
                Subscriptions
              </p>
            </Link>
            <Link to={"/saved?name=" + user[0].name} className="linkRegister">
              <p className="gray" style={{ color: nameColor[2] }}>
                Saved
              </p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Menu;
