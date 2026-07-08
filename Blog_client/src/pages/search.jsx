import { useParams } from "react-router-dom";
import InNavigation from "../component/InNavigation";
import { useEffect, useState } from "react";
import Loader from "../component/Loader";
import AnimationWrapper from "../common/pageAnimation";
import BlogCard from "../component/BlogCards";
import NoDataMessage from "../component/Nodata";
import LoadMoreData from "../component/load-more";
import axios from "axios";
import { filterPagination } from "../common/filter-pagination-data";
import UserCard from "../component/UserCard";

const SearchPage = () => {
  let { query } = useParams();
  let [blogs, setBlog] = useState({ results: [] });
  let [users, setUsers] = useState(null);

  const searchBlogs = ({page = 1, create_new_arr = false})=>{
    axios.post(process.env.REACT_APP_SERVER_DOMAIN + "/blog/search-blogs", {query,  page}).then(async({ data }) => {

      let formatedData = await filterPagination({
        state : blogs,
        data : data.blogs,
        page,
        countRoute : "/blog/search-blogs-count",
        data_to_snd : {query},
        create_new_arr
      })

      setBlog(formatedData);
    })
    .catch((err) => {
      console.log(err);
    });
  }

  const fetchUsers = () => {
    axios.post(process.env.REACT_APP_SERVER_DOMAIN + "/user/search-user", {query}).then(({data : {users}})=>{
      setUsers(users);
    })
  }

  useEffect(()=>{
    setBlog({ results: [] });
    setUsers(null);
    searchBlogs({page:1, create_new_arr: true });
    fetchUsers();
  }, [query])


  const UserCardWrapper = () => {
    return(
     <>
        {
          users == null ? <Loader/> : users.length ? users.map((user, i) => {
            return <AnimationWrapper key={i} transition={{duration : 1, delay : i*0.08}}>
              <UserCard user={user}/>
            </AnimationWrapper>
          }) : <NoDataMessage message = "No user found"/>
        }
     </>
    )
  }


  return (
    <section className="h-cover flex justify-center gap-10">
      <div className="w-full">
        <InNavigation
          routes={[`Search Results from "${query}"`, "Accounts Matched"]}
          defaultHidden={["Accounts Matched"]}
        >
          <>
            {blogs == null ? (
              <Loader />
            ) : blogs && blogs.results && blogs.results.length > 0 ? (
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
            ) : (
              <NoDataMessage message="No blogs published" />
            )}
            <LoadMoreData
              state={blogs}
              fetchDataFun={searchBlogs}
            />
          </>

          <UserCardWrapper/>

        </InNavigation>

      </div>

      <div className="min-w-[40%] lg:min-w-[350px] max-w-min border-l border-grey pl-8 pt-3 max-md:hidden">
          <h1 className="font-medium text-xl mb-8">User related to search<i className="fi fi-rr-user mt-1"></i></h1>
          <UserCardWrapper/>
      </div>

    </section>
  );
};

export default SearchPage;
