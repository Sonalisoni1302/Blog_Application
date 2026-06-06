import { Link, useNavigate, useParams } from "react-router-dom";
import lightLogo from "../images/imgs/logo-light.png";
import darkLogo from "../images/imgs/logo-dark.png";
import AnimationWrapper from "../common/pageAnimation";
import darkBanner from "../images/imgs/blog banner dark.png";
import lightBanner from "../images/imgs/blog banner light.png";
import { EditorContext } from "../pages/editor";
import { useContext, useEffect } from "react";
import EditorJS from "@editorjs/editorjs";
import { tools } from "./tools";
import { Toaster, toast } from "react-hot-toast";
import axios from "axios";
import { ThemeContext, UserContext } from "../App";

const BlogEditor = () => {
  let {
    userAuth: { token },
  } = useContext(UserContext);

  let { blog_Id } = useParams();

  let navigate = useNavigate();

  let { theme } = useContext(ThemeContext);

  let {
    blog,
    blog: { title, banner, des, content, tags },
    setBlog,
    textEditor,
    setTextEditor,
    setEditorState,
  } = useContext(EditorContext);

  useEffect(() => {
  const editor = new EditorJS({
    holder: "textEditor",
    data: content,
    tools,
    placeholder: "Let's write an awesome story",
  });

  setTextEditor(editor);

  return () => {
    if (editor.destroy) {
      editor.destroy();
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
}, []);

  const handleBannerUpload = (e) => {
  const img = e.target.files[0];

  if (!img) return;

  // store actual file
  setBlog(prev => ({
    ...prev,
    bannerFile: img
  }));

  // store preview image
  const reader = new FileReader();

  reader.onload = () => {
    setBlog(prev => ({
      ...prev,
      banner: reader.result
    }));
  };

  reader.readAsDataURL(img);
};
  const handleTitleKeyDown = (e) => {
    if (e.keyCode === 13) {
      e.preventDefault();
    }
  };

  const handleTitleChage = (e) => {
    let input = e.target;

    input.style.height = "auto";
    input.style.height = input.scrollHeight + "px";

    setBlog({ ...blog, title: input.value });
  };

  const handlePublishEvent = async () => {
    if (!banner.length) {
      return toast.error("Upload a blog banner to publish it");
    }

    if (!title.length) {
      return toast.error("Write blog title to publish it");
    }

    if (textEditor?.isReady) {
      textEditor.save().then((data) => {
        if (data.blocks.length) {
          setBlog({ ...blog, content: data });
          setEditorState("publish");
        } else {
          return toast.error("write something in your blog to publish it");
        }
      });
    }
  };

  const handleSaveDraft = (e) => {
    if (e.target.classList.contains("disable")) {
      return;
    }

    if (!title.length || typeof title !== "string") {
      return toast.error("write Blog title before publishing");
    }

    let loadingToast = toast.loading("Saving Draft...");

    e.target.classList.add("disable");

    if (textEditor.isReady) {
      textEditor.save().then((content) => {
        let blogObj = { title, banner, des, content, tags, draft: true };

        axios
          .post(
            process.env.REACT_APP_SERVER_DOMAIN + "/blog/create-blog",
            { ...blogObj, id: blog_Id },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            },
          )
          .then(() => {
            e.target.classList.remove("disable");

            toast.dismiss(loadingToast);
            toast.success("Saved");

            setTimeout(() => {
              navigate("/dashboard/blogs?tab=draft");
            }, 500);
          })
          .catch((error) => {
            e.target.classList.remove("disable");
            toast.dismiss(loadingToast);
            console.log(error);
            return toast.error(error.response.data.error);
          });
      });
    }
  };

  const handleError = (e) => {
    let img = e.target;
    img.src = theme === "light" ? lightBanner : darkBanner;
  };

  return (
    <>
      <nav className="navbar">
        <Toaster />
        <Link to="/" className="flex-none w-10">
          <img src={theme === "light" ? darkLogo : lightLogo} alt="Logo" />
        </Link>
        <p className="max-md:hidden text-black line-clamp-1 w-full">
          {title?.length ? title : "New Blog"}
        </p>

        <div className="flex gap-4 ml-auto">
          <button className="btn-dark py-2" onClick={handlePublishEvent}>
            Publish
          </button>
          <button className="btn-light py-2" onClick={handleSaveDraft}>
            Save Draft
          </button>
        </div>
      </nav>

      <AnimationWrapper>
        <section>
          <div className="mx-auto max-w-[900px] w-full">
            <div className="relative aspect-video hover:opacity-80 bg-white border-4 border-grey">
              <label htmlFor="uploadBanner">
                <img src={banner} alt="Banner" className="z-20" onError={handleError} />
                <input
                  id="uploadBanner"
                  type="file"
                  name="banner"
                  accept=".png, .jpg, .jpeg"
                  hidden
                  onChange={handleBannerUpload}
                />
              </label>
            </div>

            <textarea
              defaultValue={title}
              placeholder="Blog Title"
              className="text-4xl font-medium w-full h-20 outline-none resize-none mt-10 leading-tight placeholder:opacity-40 bg-white"
              onKeyDown={handleTitleKeyDown}
              onChange={handleTitleChage}
            ></textarea>

            <hr className="w-full opacity-10 my-5" />

            <div id="textEditor" className="font-gelasio"></div>
          </div>
        </section>
      </AnimationWrapper>
    </>
  );
};

export default BlogEditor;
