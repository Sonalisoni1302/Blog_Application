import React, { createContext, useContext, useEffect, useState } from "react";
import { UserContext } from "../App";
import { Navigate, useParams } from "react-router-dom";
import Publish from "../component/publishForm";
import BlogEditor from "../component/Blog.editor";
import Loader from "../component/Loader";
import axios from "axios";

const blogStructure = {
  title: "",
  banner: "",
  bannerFile: null,
  content: [],
  tags: [],
  des: "",
  author: { personal_Info: {} },
};

export const EditorContext = createContext({});

const Editor = () => {
  let { blog_Id } = useParams();

  const [blog, setBlog] = useState(blogStructure);
  const [editorState, setEditorState] = useState("editor");
  const [textEditor, setTextEditor] = useState({ isReady: true });
  const [loading, setLoading] = useState(true);

  let {
    userAuth: { token },
  } = useContext(UserContext);

  useEffect(() => {
    if (!blog_Id) {
      setLoading(false);
    }

    axios
      .post(process.env.REACT_APP_SERVER_DOMAIN + "/blog/get-blog", {
        blog_Id,
        draft: true,
        mode: "edit",
      })
      .then(({ data: { blog } }) => {
        setBlog({
          ...blog,
          bannerFile: null,
        });
        setLoading(false);
      })
      .catch((err) => {
        setBlog(blogStructure);
        setLoading(false);
      });
  }, [blog_Id]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <EditorContext.Provider
      value={{
        blog,
        setBlog,
        editorState,
        setEditorState,
        textEditor,
        setTextEditor,
      }}
    >
      {token === undefined ? (
        <Navigate to="/user/signin" />
      ) : loading ? (
        <Loader />
      ) : editorState === "editor" ? (
        <BlogEditor />
      ) : (
        <Publish />
      )}
    </EditorContext.Provider>
  );
};

export default Editor;
