import React, { useEffect, useRef, useState } from "react";
import AnimationWrapper from "../common/pageAnimation";
import InNavigation, { ActiveTabRef } from "../component/InNavigation";
import axios from "axios";
import Loader from "../component/Loader";
import BlogCard from "../component/BlogCards";
import MinimalBlogs from "../component/minimalBlogs";
import NoDataMessage from "../component/Nodata";
import { filterPagination } from "../common/filter-pagination-data";
import LoadMoreData from "../component/load-more";

const Home = () => {
  let [blogs, setBlog] = useState({results : []});
  let [trendingBlogs, setTrendingBlogs] = useState([]);
  let [pageState, setPageState] = useState("home");

  let categories = [
    "programming",
    "DSA",
    "Problem-Solving",
    "System Design",
    "Python",
    "tech",
    "finances",
    "Coding",
    
  ];

  const fetchLatestBlogs = ({page = 1}) => {
    axios
      .post(process.env.REACT_APP_SERVER_DOMAIN + "/blog/latest-blogs", {page})
      .then(async({ data }) => {

        let formatedData = await filterPagination({
          state : blogs,
          data : data.blogs,
          page,
          countRoute : "/blog/all-latest-blogs-count"
        })

        setBlog(formatedData);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  let blogCache = useRef({});

    const fetchBlogByCategory = ({page = 1}) => {

      let cacheKey = `home-page-${page}`;
      if (blogCache.current[cacheKey]) {
        setBlog(blogCache.current[cacheKey]);
        return;
      }
      axios
      .post(process.env.REACT_APP_SERVER_DOMAIN + "/blog/search-blogs", {tag: pageState.trim().toLowerCase(), page})
      .then(async({ data }) => {
        let formatedData = await filterPagination({
          state : blogs,
          data : data.blogs,
          page,
          countRoute : "/blog/search-blogs-count",
          data_to_send : {tage : pageState.trim().toLowerCase()}
        })

        setBlog(formatedData);
      })
      .catch((err) => {
        console.log(err);
      });
    }


  const fetchTrendingBlogs = () => {
    axios
      .post(process.env.REACT_APP_SERVER_DOMAIN + "/blog/trending-blogs")
      .then(({ data }) => {
        setTrendingBlogs(data.blogs);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {

    ActiveTabRef.current.click();

    if(pageState === "home"){
      fetchLatestBlogs({page : 1});
    }else{
      fetchBlogByCategory({page : 1});
    }
    
    fetchTrendingBlogs();
    
  }, [pageState]);

  const loadBlogByCategory = (e) => {
    let category = e.target.innerText.toLowerCase();
    setBlog({results : []});
    if(pageState === category){
      setPageState("home");
      return;
    }

    setPageState(category);
  }

  return (
    <>
      <AnimationWrapper>
        <section className="h-cover flex justify-center gap-10">
          <div className="w-full">
            <InNavigation
              routes={[pageState, "trending blogs"]}
              defaultHidden={["trending blogs"]}
            >
              <div>

                {blogs == null ? (
                  <Loader />
                ) : (
                  blogs && blogs.results && blogs.results.length > 0 ?
                    blogs.results.map((blog, i) => (
                      <AnimationWrapper
                        transition={{ duration: 1, delay: i * 0.1 }}
                        key={i}
                      >
                        <BlogCard
                          content={blog}
                          author={blog.author_id.personal_Info}
                        />
                      </AnimationWrapper>
                    ))
                  : <NoDataMessage message="No blogs published"/>
                )}
                <LoadMoreData state={blogs} fetchDataFun={(pageState === "home" ? fetchLatestBlogs : fetchBlogByCategory)}/>
              </div>

              <div>
                {trendingBlogs.length == 0 ? (
                  <Loader />
                ) : (
                  trendingBlogs.length > 0 ?
                    trendingBlogs.map((blog, i) => (
                      <AnimationWrapper
                        transition={{ duration: 1, delay: i * 0.1 }}
                        key={i}
                      >
                        <MinimalBlogs blog={blog} index={i} />
                      </AnimationWrapper>
                    ))
                  : <NoDataMessage message="No blogs published"/>
                )}
              </div>
            </InNavigation>
          </div>

          {/* filter and trending Blogs */}
          <div className="min-w-[40%] lg:min-w-[400px] max-w-min border-1 border-grey pl-8 pt-3 max-md:hidden">
            <div className="flex flex-col gap-10">
              <div>
                <h1 className="font-medium text-xl mb-8">
                  Stories from all intrests
                </h1>

                <div className="flex gap-3 flex-wrap">
                  {categories.map((category, i) => (
                    <button className={"tag " + (pageState.toLowerCase().trim()  === category.toLowerCase().trim() ? "bg-black text-white" : " ")} key={i} onClick={loadBlogByCategory} >
                      {category}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h1 className="font-medium text-xl mb-8">
                  Trending <i className="fi fi-rr-arrow-trend-up"></i>
                </h1>

                {trendingBlogs.length === 0 ? (
                  <Loader />
                ) : (
                  trendingBlogs.map((blog, i) => (
                    <AnimationWrapper
                      transition={{ duration: 1, delay: i * 0.1 }}
                      key={i}
                    >
                      <MinimalBlogs blog={blog} index={i} />
                    </AnimationWrapper>
                  ))
                )}
              </div>
            </div>
          </div>
        </section>
      </AnimationWrapper>
    </>
  );
};
export default Home;
