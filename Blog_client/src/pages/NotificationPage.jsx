import { useContext, useState, useEffect } from "react";
import { filterPagination } from "../common/filter-pagination-data";
import axios from "axios";
import { UserContext } from "../App";
import AnimationWrapper from "../common/pageAnimation";
import Loader from "../component/Loader";
import NoDataMessage from "../component/Nodata";
import NotificationCard from "../component/ntfcn-card";
import LoadMoreData from "../component/load-more";


const Notifications = () => {

    let {userAuth, userAuth : {token, new_notification_available}, setUserAuth} = useContext(UserContext)

    const [filter, setFilter] = useState('all');
    const [notifications, setNotifications] = useState(null);

    let filters = ['all', 'Like', 'comment', 'reply'];

    const fetchNotifications = ({page, deletedDocCount = 0}) => {

        axios.post(process.env.REACT_APP_SERVER_DOMAIN + "/user/notifications", {page, filter, deletedDocCount}, {

            headers : {
                'Authorization' : `Bearer ${token}`
            }

        }).then(async ({data : {notifications : data}}) => {

            if(new_notification_available){
                setUserAuth({...userAuth, new_notification_available:false})
            }
            
            let formatedData = await filterPagination({
                state : notifications,
                data, page,
                countRoute : "/user/all-notifications-count",
                data_to_send : {filter},
                user : token
            })

            
            setNotifications(formatedData);

        })
    }

    useEffect(() => {
        
        if(token){
            fetchNotifications({page: 1});
        }

    }, [token, filter]) // eslint-disable-line react-hooks/exhaustive-deps

    const handleFilter = (e) => {
        let btn = e.target;

        setFilter(btn.innerHTML);
        setNotifications(null);
    }

    return (
        <>
            <h1 className="max-md:hidden">Recent Notifications</h1>

            <div className="my-8 flex gap-6">
                {
                    filters.map((filtername, i) => {
                        return <button key={i} className={"py-2 " + (filter === filtername ? "btn-dark" : "btn-light")} onClick={handleFilter}>{filtername}</button>
                    })
                }
            </div>

            {
                notifications == null ? <Loader/> : 
                <>
                    {
                       notifications.results.length ? 
                            notifications.results.map((notification, i) => {
                                return <AnimationWrapper key={i} transition={{delay : i*0.08}}>
                                    <NotificationCard data={notification} index={i} notificationState={{notifications, setNotifications}}/>
                                </AnimationWrapper>
                            }) : <NoDataMessage message="Nothing Available"/>
                    }

                    <LoadMoreData state={notifications} fetchDataFun={fetchNotifications} additionalParam={{dleteDocCount : notifications.deletedDocCount}}/>
                </>
            }
        </>
    )
}

export default Notifications;