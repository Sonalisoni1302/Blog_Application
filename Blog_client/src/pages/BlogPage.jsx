import { createContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import AnimationWrapper from "../common/pageAnimation";
import Loader from "../component/Loader";
import { getDay } from "../common/date";
import BlogIntraction from "../component/BlogIntraction";
import BlogCard from "../component/BlogCards";
import BlogContent from "../component/BlogContent";
import CommentsContainer, { fetchcomments } from "../component/commentsCon";

export const blogStructure = {
  title: "",
  des: "",
  content: [],
  author_id: { personal_Info: {} },
  banner: "",
  createdAt: "",
};

export const BlogContext = createContext({});

const BlogPage = () => {
  const {blog_Id} = useParams();

  const [blog, setBlog] = useState(blogStructure);
  const [loading, setLoading] = useState(true);
  const [similarBlogs, setSimilarBlogs] = useState(null);
  const [isLikedBlog, setIsLikedBlog] = useState(false);
  const [commentsWrapper, setCommentsWrapper] = useState(false);
  const [totalParentComments, setTotalParentComments] = useState(0);

  let {
    title,
    content,
    banner,
    author_id: {
      personal_Info: { fullname, username: author_username, profile_img },
    },
    createdAt,
  } = blog;

  const fetchBlog = () => {
    axios
      .post(process.env.REACT_APP_SERVER_DOMAIN + "/blog/get-blog", { blog_Id })
      .then(async({ data: { blog } }) => {

        blog.Comments = await fetchcomments({blog_id : blog._id, setParentCommentCountFun : setTotalParentComments});


        setLoading(true);
        setBlog(blogStructure);  

        axios.post(process.env.REACT_APP_SERVER_DOMAIN + "/blog/search-blogs", {tag : blog.tags[0], limit : 6, eliminate_blog : blog_Id}).then(({data}) =>{
          setSimilarBlogs(data.blogs);
        })
        setBlog(blog);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    resetStates();
    fetchBlog();
  }, [blog_Id]);

  const resetStates = () => {
    // setCommentsWrapper(false);
    setTotalParentComments(0);
  }

  return (
    <>
      <AnimationWrapper>
        {loading ? (
          <Loader />
        ) : (
          <BlogContext.Provider value={{ blog, setBlog, isLikedBlog, setIsLikedBlog, commentsWrapper, setCommentsWrapper, totalParentComments, setTotalParentComments}}>
            <CommentsContainer/>
            <div className="max-w-[900px] center py-10 max-lg:px-[5vw]">
              <img src={banner} className="aspect-video" />
              <div className="mt-12">
                <h2>{title}</h2>
                <div className="flex max-sm:flex-col justify-between my-8">
                  <div className="flex gap-5 items-start">
                    <img src={profile_img} className="w-12 h-12 rounded-full" />
                    <p className="capitalize">
                      {fullname}
                      <br />@
                      <Link
                        to={`/user/${author_username}`}
                        className="underline"
                      >
                        {author_username}
                      </Link>
                    </p>
                  </div>
                  <p className="text-dark-grey opacity-75 max-sm:mt-6 max-sm:ml-12 max-sm:pl-5">
                    Published on {getDay(createdAt)}
                  </p>
                </div>
              </div>

              <BlogIntraction />

                <div className="my-12 font-gelasio blog-page-content">
                  {
                    content.blocks.map((block, i)=>{
                      return <div key={i} className="my-4 md:my-8">
                        <BlogContent block = {block}/>
                      </div>
                    })
                  }
                </div>

              <BlogIntraction />

              {
                similarBlogs != null && similarBlogs.length ?
                <> 
                  <h1 className="text-2xl mt-14 mb-10 font-medium">Similar Blogs</h1>
                  {
                    similarBlogs.map((blog, i) => {
                      let {author_id : {personal_Info}} = blog;

                      return <AnimationWrapper key={blog.blog_Id || i} transition={{duration : 1, delay : i*0.08}}><BlogCard content={blog} author={personal_Info}/></AnimationWrapper>
                    })
                  }
                </>
                : ""
              }

            </div>
          </BlogContext.Provider>
        )}
      </AnimationWrapper>
    </>
  );
};

export default BlogPage;
