import React, { useEffect } from "react";
import Container from "@material-ui/core/Container";
import { useHistory } from "react-router-dom";
import Fab from "@material-ui/core/Fab";
import EditIcon from "@material-ui/icons/Edit";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import MenuIcon from "@material-ui/icons/Menu";
import Memo from "./memo";
import Box from "@material-ui/core/Box";
import Tooltip from "@material-ui/core/Tooltip";
import ip from "./ip.json";

import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";

import axios from "axios";

import AuthContext from "./context/AuthContext";

export default function MainScreen() {
  const history = useHistory();
  const auth = React.useContext(AuthContext);
  const [memos, setMemos] = React.useState([]);
  //sessionStorage, localStorage
  const id =
    window.sessionStorage.length == 2
      ? window.sessionStorage.getItem("id")
      : window.localStorage.getItem("id");
  const salt =
    window.sessionStorage.length == 2
      ? window.sessionStorage.getItem("salt")
      : window.localStorage.getItem("salt");

  const [isMenuOpen, setMenuOpen] = React.useState(false);

  useEffect(() => {
    //메모들을 불러오자
    getMemos();
    console.log(id, salt);
  }, []);

  //id와 salt 대조 후 일치하면 가져옴
  const getMemos = () => {
    axios
      .get(`https://${ip.ip}/api/memos`, {
        params: { id: id, salt: salt },
      })
      .then((res) => {
        if (res.data === "wrong access") {
          console.log(res.data);
        } else {
          setMemos(res.data);
        }
      });
  };

  const createMemo = () => {
    axios
      .post(`https://${ip.ip}/api/memos/write`, null, {
        params: { id: id },
      })
      .then((res) => {
        getMemos(); //새로 불러온다.
      });
  };

  const pressWrite = () => {
    createMemo();
  };

  const pressLogOut = () => {
    auth.functions.signOut();
    history.push("/signin");
  };

  const parse = (value) => {
    if (!value) return;
    if (value.slice(0, 5) === "image") return true;
    else return false;
  };

  const toggleMenu = () => {
    setMenuOpen(!isMenuOpen);
  };

  return (
    <Container style={{ marginBottom: 20 }}>
      <h1 display="flex" align="center">
        안녕하세요!
      </h1>
      {memos.map((c, i) => (
        <Memo
          key={c._id}
          _id={c._id}
          id={c.id}
          title={c.title}
          contents={c.contents}
          date={c.lastDate}
          refresh={getMemos}
          file={c.file}
          isImage={parse(c.fileType)}
          fileType={c.fileType}
          fileName={c.fileName}
        />
      ))}
      <Box
        display="flex"
        flexDirection="column"
        style={{
          position: "fixed",
          bottom: "1vh",
          right: "1vh",
        }}
      >
        {isMenuOpen ? (
          <Box display="flex" flexDirection="column">
            <Tooltip title="Add" aria-label="add" placement="left">
              <Fab
                style={{ marginBottom: 5 }}
                color="secondary"
                aria-label="edit"
                onClick={pressWrite}
              >
                <EditIcon />
              </Fab>
            </Tooltip>
            <Tooltip title="Log Out" aria-label="logout" placement="left">
              <Fab
                style={{ marginBottom: 5 }}
                color="secondary"
                aria-label="edit"
                onClick={pressLogOut}
              >
                <ExitToAppIcon />
              </Fab>
            </Tooltip>
            <Tooltip title="Menu" aria-label="menu" placement="left">
              <Fab color="secondary" aria-label="edit" onClick={toggleMenu}>
                <KeyboardArrowDownIcon />
              </Fab>
            </Tooltip>
          </Box>
        ) : (
          <Tooltip title="Menu" aria-label="menu" placement="left">
            <Fab color="secondary" aria-label="edit" onClick={toggleMenu}>
              <KeyboardArrowUpIcon />
            </Fab>
          </Tooltip>
        )}
      </Box>
      <Box style={{ height: 110 }}></Box>
    </Container>
  );
}
