import React, { useState, useEffect } from "react";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Grid from "@material-ui/core/Grid";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import { Link, useHistory } from "react-router-dom";
import axios from "axios";
import Tooltip from "@material-ui/core/Tooltip";
import ip from "./ip.json";

import logo from "./image/logo_transparent.png";

import AuthContext from "./context/AuthContext";

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

export default function SignIn(props) {
  const classes = useStyles();
  const history = useHistory();
  const [id, setId] = useState("");
  const [pass, setPass] = useState("");
  const [open, setOpen] = useState(false);
  const [openDone, setOpenDone] = useState(false);
  const [autoLoginMode, setAutoLoginMode] = useState(false);

  const auth = React.useContext(AuthContext);

  useEffect(() => {
    //만약 props.location이 true라면(회원가입이 완료되어서 로그인 화면으로 돌아왔을 때)
    props.location.state && setOpenDone(true);
    //console.log(props.location && props.location.state);
  }, []);

  useEffect(() => {});

  const toggleLoginMode = () => {
    setAutoLoginMode(!autoLoginMode);
  };

  async function loginProcess() {
    if (!id || !pass) {
      setOpen(true);
    } else {
      axios
        .get(`https://${ip.ip}/api/members`, {
          params: { id: id, pass: pass },
        })
        .then((res) => {
          //console.log(res.data);
          if (res.data.login === true) {
            //로그인 성공
            auth.functions.signIn(id, autoLoginMode, res.data.salt);
            history.push("/main");
          } else {
            if (res.data.login === false) {
              console.log("아이디가 존재하지 않음");
            } else console.log("암호가 틀림");
            //로그인 실패
            setOpen(true);
          }
        });
    }
  }

  const handleLoginPress = () => {
    loginProcess();
    //id, pass가 회원정보 db에 있는 값인지 확인 후, 있는 값이면 로그인.(sessionStorage 이용)
  };

  const handleKeyPress = (event) => {
    //엔터를 누면 login 버튼을 누른것과 같이 동작한다.
    if (event.key == "Enter") {
      handleLoginPress();
    }
  };

  const handleClose = (event, reason) => {
    setOpen(false);
    setOpenDone(false);
  };

  const testFunction = () => {
    console.log(window.sessionStorage.getItem("id"));
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Snackbar open={open} autoHideDuration={1500} onClose={handleClose}>
          <Alert severity="error">아이디와 비밀번호를 확인하세요</Alert>
        </Snackbar>
        <Snackbar open={openDone} autoHideDuration={1500} onClose={handleClose}>
          <Alert severity="success">회원가입이 완료되었습니다!</Alert>
        </Snackbar>
        <img src={logo} width={300} />
        <form className={classes.form} noValidate>
          <TextField
            variant="outlined"
            margin="normal"
            fullWidth
            id="id"
            label="ID"
            name="id"
            autoComplete="id"
            autoFocus
            onChange={(e) => setId(e.target.value)}
          />
          <TextField
            variant="outlined"
            margin="normal"
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            onChange={(e) => setPass(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <Tooltip
            title="개인 환경(개인 pc,모바일 등)에서만 사용하세요!"
            placement="right"
          >
            <FormControlLabel
              control={
                <Checkbox
                  value="remember"
                  color="primary"
                  onChange={toggleLoginMode}
                />
              }
              label="자동 로그인"
            />
          </Tooltip>

          <Button
            //type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            //component={Link}
            //to="/main"
            onClick={handleLoginPress}
          >
            로그인
          </Button>
          <Grid container justify="center">
            <Grid item>
              <Link href="#" to="/signup" variant="body2">
                {"새로운 계정 만들기"}
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
    </Container>
  );
}

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));
