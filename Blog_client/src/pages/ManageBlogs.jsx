import { useContext, useEffect, useState } from "react";
import { UserContext } from "../App";
import axios from "axios";
import { filterPagination } from "../common/filter-pagination-data";
import { Toaster } from "react-hot-toast";
import Loader from "../component/Loader";
import AnimationWrapper from "../common/pageAnimation";
import NoDataMessage from "../component/Nodata";
import {ManagePublishedBlogs, ManageDraftBlogPost } from "./manage-publish-blog";
import InNavigation from "../component/InNavigation";
import LoadMoreData from "../component/load-more";
import { useSearchParams } from "react-router-dom";

const ManageBlogs = () => {

    const [blogs, setBlogs] = useState(null);
    const [drafts, setDrafts] = useState(null);
    const [query, setQuery] = useState("");

    let activeTab = useSearchParams()[0].get("tab");

    let {userAuth : {token}} = useContext(UserContext);

    const getBlogs = ({page, draft, deleteDocCount = 0}) => {

        axios.post(process.env.REACT_APP_SERVER_DOMAIN + "/blog/user-blogs", {page, draft, query,  deleteDocCount}, {
            headers : {
                'Authorization' : `Bearer ${token}`
            }
        }).then(async({data}) => {
            let formatedData = await filterPagination({
                state : draft ? drafts : blogs,
                data : data.blogs,
                page,
                user : token,
                countRoute : "/blog/user-blogs-count",
                data_to_send : {draft, query}
            })

            if(draft){
                setDrafts(formatedData);
            }else{
                setBlogs(formatedData);
            }
        }).catch(err => {
            console.log(err);
        })

    }

    const handleSearch = (e) => {

        let searchQuery = e.target.value;

        setQuery(searchQuery);

        if(e.keyCode == 13 && searchQuery.length){
            setBlogs(null);
            setDrafts(null);
        }
    }

    const handleChange = (e) => {
        if(!e.target.value.length){
            setQuery("");
            setBlogs(null);
            setDrafts(null);
        }
    }

    useEffect(() => {
        if(token){
            if(blogs == null){
                getBlogs({page: 1, draft: false})
            }
            if(drafts == null){
                getBlogs({page: 1, draft: true})
            }
        }
    }, [token, blogs, drafts, query])

    return (
        <>
            <h1 className="max-md:hidden">Manage Blogs</h1>

            <Toaster/>

            <div className="relative max-md:mt-5 md:mt-8 mb-10">

                <input type="search" className="w-full bg-grey p-4 pl-12 pr-6 rounded-full placeholder:text-dark-grey" placeholder="searcg Blogs" onChange={handleChange} onKeyDown={handleSearch}/>

                <i className="fi fi-rr-search absolute right-[10%] md:pointer-events-none md:left-5  top-1/2 -translate-y-1/2 text-xl text-dark-grey"></i>

            </div>

            <InNavigation routes={["Published Blogs", "Drafts"]} defaultActiveInd={activeTab != 'draft' ? 0 : 1}>
                {
                    blogs == null ? <Loader/> : 
                    blogs.results.length ?  
                    <>
                    {
                            blogs.results.map((blog, i) => {
                                return <AnimationWrapper key={i} transition={{delay: i*0.04}}>
                                    <ManagePublishedBlogs blog={{...blog, index: i, setStateFunc: setBlogs}}/>
                                </AnimationWrapper>
                            })
                        }

                        <LoadMoreData state={blogs} fetchDataFun={getBlogs} additionalParam={{draft:false, deleteDocCount: blogs.deleteDocCount}}/>

                    </>
                    : <NoDataMessage message="No Published Blogs"/>
                }

                {
                    drafts == null ? <Loader/> : 
                    drafts.results.length ?  
                    <>
                    {
                            drafts.results.map((blog, i) => {
                                return <AnimationWrapper key={i} transition={{delay: i*0.04}}>
                                    <ManageDraftBlogPost blog={{...blog, index: i, setStateFunc: setDrafts}}/>
                                </AnimationWrapper>
                            })
                        }

                        <LoadMoreData state={drafts} fetchDataFun={getBlogs} additionalParam={{draft:true, deleteDocCount: drafts.deleteDocCount}}/>
                    </>
                    : <NoDataMessage message="No Published Blogs"/>
                }

            </InNavigation>

        </>
    )
}

export default ManageBlogs;