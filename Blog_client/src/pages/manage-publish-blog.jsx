import { Link } from "react-router-dom";
import { getDay } from "../common/date";
import { useContext, useState } from "react";
import axios from "axios";
import { UserContext } from "../App";

const BlogStats = ({stats}) => {
    return (
        <div className="flex gap-1">
            {
                Object.keys(stats).map((key, i) => {
                    return !key.includes("parent") ? <div key={i} className={"flex flex-col items-center w-full h-full justify-center p-4 px-6 " + (i !== 0 ? "border-grey border-l " : "")}>
                        <h1 className="text-xl lg:text-2xl mb-2">{stats[key].toLocaleString()}</h1>
                        <p className="max-lg:text-dark-grey capatalize">{key.split("_")[1]}</p>
                    </div> : ""
                })
            }
        </div>
    )
}

const deleteBlog = (blog, token, target) => {

    let {index, blog_Id, setStateFunc} = blog;

    target.setAttribute("disabled", true);

    axios.post(process.env.REACT_APP_SERVER_DOMAIN + "/blog/delete-blog", {blog_Id}, {
        headers: {
            'Authorization' : `Bearer ${token}` 
        }
    }).then(({data})=>{
        target.removeAttribute("disabled");

        setStateFunc(preVal => {
            let {deleteDocCount, totalDocs, results} = preVal;

            results.splice(index, 1);

            if(!deleteDocCount){
                deleteDocCount = 0;
            }

            if(!results.length && totalDocs-1>0){
                return null;
            }

            console.log({...preVal, totalDocs: totalDocs-1, deleteDocCount: deleteDocCount+1});
            return {...preVal, totalDocs: totalDocs-1, deleteDocCount: deleteDocCount+1}
        })
    }).catch(err => {
        console.log(err);
    })
}

export const ManagePublishedBlogs = ({blog}) => {

    let {banner, blog_Id, title, createdAt, activity} = blog;

    let [showStat, setShowStat] = useState(false);

    let {userAuth : {token}} = useContext(UserContext);

    return (
        <>
            <div className="flex gap-10 border-b mb-6 max-md:px-4 border-grey pb-6 items-center">
                <img src={banner} className="max-md:hidden lg:hidden xl-block w-28 h-28 flex-none bg-grey object-cover" alt="Blog banner" />

                <div className="flex flex-col justify-between py-2 w-full min-w-[300px]">
                    <div>
                        <Link to={`/blog/${blog_Id}`} className="blog-title mb-4 hover:underline">{title}</Link>

                        <p>Published On {getDay(createdAt)}</p>
                    </div>

                    <div className="flex gap-6 mt-3">
                        <Link to={`/editor/${blog_Id}`} className="pr-4 py-2 underline">Edit</Link>

                        <button className="lg:hidden pr-4 py-2 underline" onClick={() => setShowStat(preVal => !preVal)}>Stats</button>

                        <button className="pr-4 py-2 underline text-red" onClick={(e) => deleteBlog(blog, token, e.target)}>Delete</button>
                    </div>
                </div>

                <div className="max-lg:hidden">
                    <BlogStats stats={activity}/>
                </div>
            </div>

            {
                showStat ? <div className="lg:hidden"><BlogStats stats={activity}/></div> : ""
            }
        </>
    )
}


export const ManageDraftBlogPost = ({blog}) => {

    let {title, des, blog_Id, index} = blog;
    index++;
    let {userAuth : {token}} = useContext(UserContext);

    return(
        <>
            <div className="flex gap-5 lg:gap-10 pb-6 border-b mb-6 border-grey">
                <h1  className="blog-index text-center pl-4 md:pl-6 flex-none">{index < 10 ? "0" + index : index}</h1>

                <div>
                    <h1 className="blog-title mb-3">{title}</h1>

                    <p className="line-clamp-2 font-gelassio">{des.length ? des : "No Description"}</p>

                    <div className="flex gap-6 mt-3">
                        <Link to={`/editor/${blog_Id}`} className="pr-4 py-2 underline">Edit</Link>

                        <button className="pr-4 py-2 underline text-red" onClick={(e) => deleteBlog(blog, token, e.target)}>Delete</button>
                    </div>
                </div>
            </div>
        </>
    )
}