import React, { useEffect, useMemo } from "react";
import {
  Route,
  BrowserRouter,
  Redirect,
  BrowserRouter as Router,
} from "react-router-dom";

import AuthContext from "./context/AuthContext";

import SignIn from "./SignIn";
import SignUp from "./SignUp";
import MainScreen from "./MainScreen";

function App() {
  const isLogin = window.localStorage.getItem("id")
    ? true
    : window.sessionStorage.getItem("id")
    ? true
    : false;
  const authContext = useMemo(
    () => ({
      signIn: async (id, autoMode, salt) => {
        //자동 로그인: localStorage 활용
        if (autoMode) {
          window.localStorage.setItem("id", id);
          window.localStorage.setItem("salt", salt);
        }
        //세션 로그인: sessionStorage 활용
        else {
          window.sessionStorage.setItem("id", id);
          window.sessionStorage.setItem("salt", salt);
        }
      },
      signOut: () => {
        //그냥 두 storage에서 id를 다 비우자
        window.sessionStorage.clear();
        window.localStorage.clear();
      },
    }),
    []
  );

  useEffect(() => {
    //local storage와 session storage를 모두 확인한다
  }, []);

  document.title = "Cloud Memo";

  return (
    <AuthContext.Provider value={{ functions: authContext }}>
      <BrowserRouter basename={process.env.PUBLIC_URL}>
        <Route
          exact
          path="/"
          render={() => {
            return !isLogin ? (
              <Redirect to="/signin" />
            ) : (
              <Redirect to="/main" />
            );
          }}
        />
        <Route path="/signin" component={SignIn} />
        <Route path="/signup" component={SignUp} />
        <Route path="/main" component={MainScreen} />
      </BrowserRouter>
    </AuthContext.Provider>
  );
}

export default App;
