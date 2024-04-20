import {useEffect, useState} from "react";
import _ from "lodash";

export const useWindowDimensions = () => {
    const [dimensions, setDimensions] = useState({height: window.innerHeight, width: window.innerWidth});

    useEffect(() => {
        const handleResize = _.debounce(() => setDimensions({height: window.innerHeight, width: window.innerWidth}), 1000);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return dimensions;
}
