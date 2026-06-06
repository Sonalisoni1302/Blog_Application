import {useContext, useEffect, useState } from "react";
import {Link, useParams} from "react-router-dom";
import axios from "axios";
import AnimationWrapper from "../common/pageAnimation";
import Loader from "../component/Loader";
import { UserContext } from "../App";
import AboutUser from "../component/About";
import { filterPagination } from "../common/filter-pagination-data";
import InNavigation from "../component/InNavigation";
import NoDataMessage from "../component/Nodata";
import LoadMoreData from "../component/load-more";
import BlogCard from "../component/BlogCards";
import PageNotFound from "./404Page";


export const profileDataStructure = {
    personal_Info : {
        fullname : "",
        username : "",
        profile_img: "",
        bio: "",
    },
    account_Info : {
        total_posts : 0,
        total_reads : 0
    },
    social_links:{},
    joinedAt : " "
}

const ProfilePage = () => {
  let {id : profileId} = useParams();

  const [profile, setProfile] = useState(profileDataStructure);
  let [blogs, setBlogs] = useState({ results: [] });
  let [loading, setLoading] = useState(true);
  

  let { userAuth : {username} } = useContext(UserContext);
  
  let {personal_Info : {fullname, username : profile_username, profile_img, bio}, account_Info: {total_posts, total_reads}, social_links, joinedAt} = profile;

  
    const fetchUserProfile = () =>{
        axios.post(process.env.REACT_APP_SERVER_DOMAIN + "/user/get-profile", {username : profileId}).then(({data : user})=>{
          if(user != null){
            setProfile(user);
          }  
            getBlogs({user_id : user._id})
            setLoading(false);

        }).catch(err => {
            console.log(err);
            setLoading(false);
        })
    }

    
    const getBlogs = ({page = 1, user_id}) => {
      user_id = user_id === undefined ? blogs.user_id : user_id;

      axios.post(process.env.REACT_APP_SERVER_DOMAIN + "/Blog/search-blogs", {
          author : user_id,
          page
      }).then(async({data})=>{
          let formateDate = await filterPagination({
              state : blogs,
              data : data.blogs,
              page,
              countRoute : "/Blog/search-blogs-count",
              data_to_snd : {author : user_id}
          })

          formateDate.user_id = user_id;
          setBlogs(formateDate);
      })
  }

    useEffect(()=>{

      
        resetStates();
        fetchUserProfile();
      
    },  [profileId]) // eslint-disable-line react-hooks/exhaustive-deps


    const resetStates = () => {
      setProfile(profileDataStructure);
      setLoading(true);
    }

  return (
    <>
      <AnimationWrapper>

          {
            loading ? <Loader/> : 
            profile_username.length ? 
            <section  className="h-cover md:flex flex-row-reverse items-start gap-5 min-[1100px]:gap-12">
                <div className="flex flex-col max-md:items-center gap-5 min-w-[250px] md:w-[50%] md:pl-8 md:border-1 border-grey md:sticky md:top-[100px] md:py-10">
                  <img src={profile_img} className="w-48 h-48 bg-grey rounded-full md:w-52 md:h-52" alt="User profile" />
                  <h1 className="text-2xl font-medium">@{profile_username}</h1>
                  <p className="text-xl capatalize h-6">{fullname}</p>
                  <p>{total_posts.toLocaleString()} Blogs - {total_reads.toLocaleString()} Reads</p>

                  
                    <div className="flex gap-4 mt-2">
                        {
                          profileId === username ? <Link to="/settings/edit-profile" className="btn-light rounded-md">Edit Profile</Link> : " "
                        }
                        
                    </div>

                    
                    <AboutUser className="max-md:hidden" bio={bio} social_links={social_links} joinedAt={joinedAt}/>
                </div>

                <div className="max-md:mt-12 w-full">
                        <InNavigation routes={["Blogs Published", "About"]} defaultHidden={["About"]}>
                        <>  
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
                                        <LoadMoreData state={blogs} fetchDataFun={getBlogs}/>
                                      </>
                        
                                      <AboutUser social_links={social_links} joinedAt={joinedAt}/>
                                      
                        </InNavigation>
                </div>
            </section>
            : <PageNotFound/>
          }
      </AnimationWrapper>
    </>
  )
}

export default ProfilePage;