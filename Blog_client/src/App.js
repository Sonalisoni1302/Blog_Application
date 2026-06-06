import React, { useState, useEffect } from "react";
import Navbar from "./component/Navbar";
import { Route, Routes} from "react-router-dom";
import UserAuthForm from "./UserAuthForm";
import { createContext } from "react";
import { lookInSession } from "./common/session";
import Editor from "./pages/editor"
import Home from "./pages/Home";
import SearchPage from "./pages/search";
import PageNotFound from "./pages/404Page";
import ProfilePage from "./pages/Profile";
import BlogPage from "./pages/BlogPage";
import SideNav from "./component/SideNav";
import ChangePassword from "./component/changPassword";
import EditProfile from "./pages/edit-profilePage";
import Notifications from "./pages/NotificationPage";
import ManageBlogs from "./pages/ManageBlogs";

export const UserContext = createContext({});

export const ThemeContext = createContext({});

const darkThemePreference = () => window.matchMedia("(prefer-color-scheme: dark)").matches;

const App = () => {

  const[userAuth, setUserAuth] = useState({});

  const [theme, setTheme] = useState(() => darkThemePreference() ? "dark" : "light");

  useEffect(()=>{
    let userInSession = lookInSession("user");
    let themeInSession = lookInSession("theme");

    userInSession ? setUserAuth(JSON.parse(userInSession)) : setUserAuth({access_token : null})

    if(themeInSession){
      setTheme(() => {
        document.body.setAttribute('data-theme', themeInSession);

        return themeInSession;
      })
    }else {
      document.body.setAttribute('data-theme', theme);
    }

  }, [theme])

    return(
      <>
      <ThemeContext.Provider value={{theme, setTheme}}>
        <UserContext.Provider value = {{userAuth, setUserAuth}}>
          <Routes>
            <Route path = "/editor" element = {<Editor/>}></Route>
            <Route path = "/editor/:blog_Id" element = {<Editor/>}></Route>
            <Route path="/" element={<Navbar/>}>
              <Route index element={<Home/>}/>
              <Route path="dashboard" element={<SideNav/>}>
                  <Route path="blogs" element={<ManageBlogs/>}/>
                  <Route path="notifications" element={<Notifications/>}/>
                  <Route path="editor" element={<Editor/>}/>
              </Route>
              <Route path="settings" element={<SideNav/>}>
                <Route path="edit-profile" element={<EditProfile/>}/>
                <Route path="change-password" element={<ChangePassword/>}/>
              </Route>
              <Route path="user/signin" element={<UserAuthForm type="sign-in"/>}/>
              <Route path="user/signup" element={<UserAuthForm type="sign-up"/>}/>
              <Route path="search/:query" element ={<SearchPage/>}/>
              <Route path="user/:id" element={<ProfilePage/>}/>
              <Route path="blog/:blog_Id" element = {<BlogPage/>}/>
              <Route path="*" element={<PageNotFound/>}/>
            </Route>
          </Routes>
        </UserContext.Provider>
      </ThemeContext.Provider>
      </>
    );
};

export default App;
