import { Toaster, toast } from "react-hot-toast";
import AnimationWrapper from "../common/pageAnimation";
import { useContext } from "react";
import { EditorContext } from "../pages/editor";
// import defaultBanner from "../images/defaultBanner.png";
import { Tag } from "./Tag";
import { useNavigate} from "react-router-dom";
import axios from "axios";
import { UserContext } from "../App";

const Publish = () => {
  let characterLength = 350;
  let taglimit = 10;

  let {
    userAuth: { token },
  } = useContext(UserContext);

//   let { blog_Id } = useParams();

  let navigate = useNavigate();

  let {
    blog,
    blog: { title, banner, bannerFile, des, content, tags },
    setEditorState,
    setBlog,
  } = useContext(EditorContext);

  const handleCloseEvent = () => {
    setEditorState("editor");
  };

  const handleBlogTitleChange = (e) => {
    let input = e.target;
    setBlog({ ...blog, title: input.value });
  };

  const handleBlogDesChange = (e) => {
    let input = e.target;
    setBlog({ ...blog, des: input.value });
  };

  const handleTitleKeyDown = (e) => {
    if (e.keyCode === 13) {
      e.preventDefault();
    }
  };

  const handleKeyDown = (e) => {
    if (e.keyCode === 13 || e.keyCode === 188) {
      e.preventDefault();

      let tag = e.target.value;

      if (tags.length < taglimit) {
        if (!tags.includes(tag) && tag.length) {
          setBlog({ ...blog, tags: [...tags, tag] });
        }
      } else {
        toast.error(`You can add max ${taglimit} Tags`);
      }

      e.target.value = "";
    }
  };

  const publishBlog = (e) => {
    if (e.target.classList.contains("disable")) {
      return;
    }

    if (!title.length) {
      return toast.error("write Blog title before publishing");
    }

    if (!des.length || des.length > characterLength) {
      return toast.error(
        `write a description about your blog within ${characterLength} characters to publish`,
      );
    }

    if (!tags.length) {
      return toast.error("Enter at least 1 tag to help us rank your blog");
    }

    let loadingToast = toast.loading("Publishing...");

    e.target.classList.add("disable");

    const formData = new FormData();

    formData.append("title", title);
    formData.append("des", des);
    formData.append("content", JSON.stringify(content));
    formData.append("draft", false);

    tags.forEach((tag) => {
      formData.append("tags", tag);
    });

    formData.append("banner", bannerFile);
    axios
      .post(
        process.env.REACT_APP_SERVER_DOMAIN + "/blog/create-blog",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )
      .then(() => {
        e.target.classList.remove("disable");

        toast.dismiss(loadingToast);
        toast.success("Published");

        setTimeout(() => {
          navigate("/dashboard/blogs");
        }, 500);
      })
      .catch((error) => {

        console.log("STATUS:", error.response?.status);
        console.log("DATA:", error.response?.data);

        e.target.classList.remove("disable");
        toast.dismiss(loadingToast);
        console.log(error);

        return toast.error(
          error.response?.data?.message ||
            error.response?.data?.error ||
            "Something went wrong",
        );
      });
  };

  return (
    <>
      <AnimationWrapper>
        <section className="w-screen min-h-screen grid items-center lg:grid-cols-2 py-16 lg:gap-4">
          <Toaster />
          <button
            className="w-12 h-12 absolute right-[5vw] z-10 top-[5%] lg:top-[10%]"
            onClick={handleCloseEvent}
          >
            <i className="fi fi-rr-cross-circle"></i>
          </button>

          <div className="max-w-[550px] center">
            <p className="text-dark-grey mb-1">Preview</p>

            <div className="w-full aspect-video rounded-lg overflow-hidden bg-grey mt-4">
              <img src={banner} alt="Blog Banner" />
            </div>

            <h1 className="text-4xl font-medium mt-12 leading-tight line-clamp-2">
              {title}
            </h1>

            <p className="font-gelasio line-clamp-2 text-xl leading-7 mt-4">
              {des}
            </p>
          </div>

          <div className="border-grey lg:border-1 lg:pl-8">
            <p className="text-dark-grey mb-2 mt-9">Blog Title</p>
            <input
              type="text"
              placeholder="Blog Title"
              defaultValue={title}
              className="input-box pl-4"
              onChange={handleBlogTitleChange}
            />

            <p className="text-dark-grey mb-2 mt-9">
              Short description about your blog
            </p>
            <textarea
              maxLength={characterLength}
              defaultValue={des}
              className="h-40 resize-none leading-7 input-box pl-4"
              onChange={handleBlogDesChange}
              onKeyDown={handleTitleKeyDown}
            ></textarea>
            <p className="mt-1 text-dark-grey text-5m text-right">
              {characterLength - des.length} characters left
            </p>

            <p className="text-dark-grey mb-2 mt-9">
              Topics - (Helps in searching and ranking your blog post)
            </p>
            <div className="relative input-box pl-2 py-2 pb-4">
              <input
                className="sticky input-box bg-white top-0 left-0 pl-4 mb-3 focus:bg-white"
                type="text"
                placeholder="Topic"
                onKeyDown={handleKeyDown}
              />

              {tags.map((tag, i) => {
                return <Tag tag={tag} tagIndex={i} key={i} />;
              })}
            </div>

            <p className="mt-1 mb-4 text-dark-grey text-right">
              {taglimit - tags.length} Tags Left
            </p>
            <button className="btn-dark px-8" onClick={publishBlog}>
              Publish
            </button>
          </div>
        </section>
      </AnimationWrapper>
    </>
  );
};

export default Publish;
