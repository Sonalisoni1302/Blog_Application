import { useContext, useEffect } from "react";
import { BlogContext } from "../pages/BlogPage";
import { Link } from "react-router-dom";
import {UserContext} from "../App";
import { toast, Toaster } from "react-hot-toast";
import axios from 'axios';

const BlogIntraction = () => {

    let { blog, setBlog } = useContext(BlogContext);
    let {isLikedBlog, setIsLikedBlog} = useContext(BlogContext);
    let {setCommentsWrapper} = useContext(BlogContext);
    let { _id, blog_Id, title, author_id, activity } = blog || {};
    let { total_likes = 0, total_comment = 0 } = activity || {};
    let { personal_Info } = author_id || {};
    let { username: author_username } = personal_Info || {};

    let { userAuth: { username, token } = {} } = useContext(UserContext);

    useEffect(() => {
        if(token){
            axios.post(process.env.REACT_APP_SERVER_DOMAIN + "/ntfcn/is-like", {_id}, {
                headers : {
                    'Authorization' : `Bearer ${token}`
                }
            }).then(({data : {result}})=>{
                setIsLikedBlog(Boolean(result));
            }).catch(err => {
                console.log(err);
            })
        }
    },[token, _id, setIsLikedBlog])

    const handleLike = () =>{
        if(token){
            setIsLikedBlog(preval => !preval);

            !isLikedBlog ? total_likes++ : total_likes--;

            setBlog({...blog, activity:{...activity, total_likes}});

            axios.post(process.env.REACT_APP_SERVER_DOMAIN + "/ntfcn/like-blog", {_id, isLikedBlog}, {
                headers : {
                    'Authorization' : `Bearer ${token}`
                }
            }).then(({data}) => {
                console.log(data);
            })
        }else{
            toast.error("please login to like the blog");
        }
    }

    return (
        <>
            <Toaster/>
            <hr className="border-grey my-2"/>

            <div className="flex gap-6 justify-between">
                <div className="flex gap-3 items-center">
                    <button onClick={handleLike} className={"w-10 h-10 rounded-full flex items-center justify-center " + (isLikedBlog ? "bg-red/30 text-red" : "bg-grey/80")}>
                        <i className={"fi" + (isLikedBlog ? " fi-sr-heart" : " fi-rr-heart")}/>
                    </button>

                    <p className="text-xl text-dark-grey">{total_likes}</p>

                    <button onClick={() => setCommentsWrapper(preval => !preval)} className="w-10 h-10 rounded-full flex items-center justify-center bg-grey/80">
                        <i className="fi fi-rr-comment-dots"/>
                    </button>

                    <p className="text-xl text-dark-grey">{total_comment}</p>
                </div>

                <div className="flex gap-6 items-center">

                    {
                        username === author_username ? 
                        <Link to={`/editor/${blog_Id}`} className="underline hover:text-purple">Edit</Link> : ""
                    }

                    <Link to={`https://twitter.com/intent/tweet?text=Read ${title}&url=${window.location.href}`}><i className="fi fi-brands-twitter text-xl hover:text-twitter"/></Link>
                </div>
            </div>

            <hr className="border-grey my-2"/>
        </>
    )
}

export default BlogIntraction;