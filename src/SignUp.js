import React, { useState } from "react";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import { Link, useHistory } from "react-router-dom";
import MuiAlert from "@material-ui/lab/Alert";
import Snackbar from "@material-ui/core/Snackbar";
import ip from "./ip.json";

import logo from "./image/logo_transparent.png";

import axios from "axios";
function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
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
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export default function SignUp() {
  const [id, setId] = useState("");
  const [pass, setPass] = useState("");
  const [passCheck, setPassCheck] = useState("");
  const [open, setOpen] = useState(false);
  const [alertFlag, setAlertFlag] = useState(false);
  const classes = useStyles();
  const history = useHistory();

  const handleCreatePress = () => {
    if (!id || !pass || !passCheck) {
      console.log("빈칸 확인"); //이것도 toast 처리를 해야할까?
    } else if (pass != passCheck) {
      setAlertFlag(false);
      setOpen(true);
    } else {
      createProcess();
    }
  };

  const createProcess = () => {
    axios
      .post(`https://${ip.ip}/api/members`, null, {
        params: { id: id, pass: pass },
      })
      .then((res) => {
        //console.log("sex");
        //console.log(res.data);
        if (res.data === false) {
          setAlertFlag(true);
          setOpen(true);
        } else {
          //회원가입이 정상적으로 완료되었을 때
          //modal 같은걸로 회원가입이 완료되었다는 것을 보여줘야함
          console.log("회원가입 완료");
          history.push("/signin", true);
        }
      });
  };

  const handleClose = (event, reason) => {
    setOpen(false);
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Snackbar open={open} autoHideDuration={2000} onClose={handleClose}>
          {!alertFlag ? (
            <Alert severity="warning">
              비밀번호와 비밀번호 확인이 일치하지 않습니다.
            </Alert>
          ) : (
            <Alert severity="warning">이미 존재하는 아이디입니다.</Alert>
          )}
        </Snackbar>
        <img src={logo} width={300} />
        <Typography component="h1" variant="h5">
          회원가입
        </Typography>
        <form className={classes.form} noValidate>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                fullWidth
                id="id"
                margin="normal"
                label="ID"
                name="id"
                autoComplete="id"
                onChange={(e) => setId(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                style={{ paddingBottom: 5 }}
                variant="outlined"
                fullWidth
                name="password"
                label="비밀번호"
                type="password"
                id="password"
                autoComplete="password"
                onChange={(e) => setPass(e.target.value)}
              />
              <TextField
                variant="outlined"
                fullWidth
                name="passwordCheck"
                label="비밀번호 확인"
                type="passwordCheck"
                id="passwordCheck"
                onChange={(e) => setPassCheck(e.target.value)}
              />
            </Grid>
          </Grid>
          <Button
            //type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            onClick={handleCreatePress}
          >
            회원가입
          </Button>
          <Grid container justify="center">
            <Grid item>
              <Link href="#" to="/signin" variant="body2">
                로그인 화면으로 가기
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
    </Container>
  );
}
