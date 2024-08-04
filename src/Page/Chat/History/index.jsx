import { Fragment, useState } from "react";
import { ChevronRight, ChevronLeft } from 'react-feather';

import Sidebar from "./Sidebar";

const History = () => {
    return ( 
        <>
        <SidebarLayout></SidebarLayout>
        </>
     );
}

const SidebarLayout = (p) => {
    const { children } = p

    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [isChevronRight, setIsChevronRight] = useState(false);

    const handleChevronClick = () => {
        setIsChevronRight(prevState => !prevState);
        setSidebarOpen(prevState => !prevState)
    };
    


    return (
        <Fragment>
            {sidebarOpen && <Sidebar />}
            <div className="content-ui">
                <div className="icon-wrapper" onClick={handleChevronClick}>
                    {isChevronRight
                    ? <ChevronLeft className='chevron-icon'/>
                    : <ChevronRight className='chevron-icon'/>
                    }
                </div>
                {children}
            </div>
        </Fragment>
    )
}
 
export default History;