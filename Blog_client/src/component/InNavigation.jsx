import { useEffect, useRef, useState } from "react";

export let ActiveTabInRef;
export let ActiveTabRef;

const InNavigation = ({routes, defaultHidden=[], defaultActiveInd = 0, children}) => {

    ActiveTabInRef = useRef();
    ActiveTabRef = useRef();

    let [inNavigationInd, setInNavigationInd] = useState(defaultActiveInd);
    
    let [isResizeEventAdded, setIsResizeEventAdded] = useState(false);
    let [width, setWidth] = useState(window.innerWidth);

    const changePageState = (btn, i) => {
        let {offsetWidth, offsetLeft} = btn;

        ActiveTabInRef.current.style.width = offsetWidth + "px";
        ActiveTabInRef.current.style.left = offsetLeft + "px";

        setInNavigationInd(i);
    }

    useEffect(()=>{

        if(width>766 && inNavigationInd != defaultActiveInd){
            changePageState(ActiveTabRef.current, defaultActiveInd);
        }

        if(!isResizeEventAdded){
            window.addEventListener('resize', () => {
                if(!isResizeEventAdded){
                    setIsResizeEventAdded(true);
                }

                setWidth(window.innerWidth);
            })
        }

    }, [width]);

    return (
        <>
            <div className="relative mb-8 bg-white border-b border-grey flex flex-nowrap overflow-x-auto">
                {
                    routes.map((route, i)=>{
                        return (
                            <button key={i} ref={i == defaultActiveInd ? ActiveTabRef : null} className={"p-4 px-5 capitalize " + (inNavigationInd == i ? "text-black" : "text-dark-grey ") + (defaultHidden.includes(route) ? "md:hidden" : "")} onClick={(e) => { changePageState(e.target, i)}}>
                                {route}
                            </button> 
                        )
                    })
                }

                <hr ref={ActiveTabInRef} className="absolute bottom-0 duration-300 border-dark-grey"/>
            </div>

            {Array.isArray(children) ? children[inNavigationInd] : children}
        </>
    )
}

export default InNavigation; 