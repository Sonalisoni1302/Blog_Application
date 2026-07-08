import { Link } from "react-router-dom";
import { getDay } from "../common/date";

const MinimalBlogs = ({blog, index}) => {

    let {title, blog_Id : id, author_id:{personal_Info : {fullname, username, profile_img}}, createdAt} = blog;

    return(
        <>
            <Link to = {`/blog/${id}`} className="flex gap-5 mb-8">
                <h1 className="blog-index">{index<10 ? "0" + (index+1) : index}"</h1>
                <div>
                    <div className="flex gap-2 items-center mb-7">
                        <img src = {profile_img} alt = "" className="w-6 h-6 rounded-full"/>
                        <p className = "line-clamp-1">{fullname} @{username}</p>
                        <p className="min-w-fit">{getDay(createdAt)}</p>
                    </div>
                    <h1 className="blog-title">{title}</h1>
                </div>
            </Link>
        </>
    )
}

export default MinimalBlogs;