import { useEffect, useRef, useState } from "react";
import '../assets/styles/Clock.scss';

const DEGREES_PER_HOUR = 360 / 12;
const DEGREES_PER_MINUTE = 360 / 60;

const Watch = ({ time = 0 }) => {
    const hoursRef = useRef<SVGLineElement>(null);
    const minuteRef = useRef<SVGLineElement>(null);
    const [timeString, setTimeString] = useState('00:00');

    const tick = (seconds: number) => {

        let h = Math.floor(seconds / 3600);
        let m = Math.floor(seconds % 3600 / 60);

        const hh = h.toString().padStart(2, "0");
        const mm = m.toString().padStart(2, "0");
        setTimeString(`${hh}:${mm}`);

        // set it by 5 minutes to tick only 5 minute interval
        // const module = seconds % 300;
        // seconds = seconds - module;
        
        h = Math.floor(seconds / 3600);
        m = Math.floor(seconds % 3600 / 60);

        h = h === 0 ? 12 : h % 12;
        let hourPosition = DEGREES_PER_HOUR * h + m / 2;
        if (hoursRef.current)
            hoursRef.current.setAttribute("transform", `rotate(${hourPosition})`);

        let minutePosition = DEGREES_PER_MINUTE * m;
        if (minuteRef.current)
            minuteRef.current.setAttribute("transform", `rotate(${minutePosition})`);
    }

    useEffect(() => {
        tick(time);
    }, [time])

    return (
        <div className="clock-container">
            <svg viewBox="-50 -50 100 100">
                <circle className="clock-face" r="48" />

                <line className="major" y1="35" y2="45" transform="rotate(0)" />

                <line className="major" y1="35" y2="45" transform="rotate(30)" />

                <line className="major" y1="35" y2="45" transform="rotate(60)" />

                <line className="major" y1="35" y2="45" transform="rotate(90)" />

                <line className="major" y1="35" y2="45" transform="rotate(120)" />

                <line className="major" y1="35" y2="45" transform="rotate(150)" />

                <line className="major" y1="35" y2="45" transform="rotate(180)" />

                <line className="major" y1="35" y2="45" transform="rotate(210)" />

                <line className="major" y1="35" y2="45" transform="rotate(240)" />

                <line className="major" y1="35" y2="45" transform="rotate(270)" />

                <line className="major" y1="35" y2="45" transform="rotate(300)" />

                <line className="major" y1="35" y2="45" transform="rotate(330)" />

                <line className="hour" y1="2" y2="-20" ref={hoursRef} />

                <line className="minute" y1="4" y2="-30" ref={minuteRef} />
            </svg>
            <div className="d-flex justify-content-center"><strong>Total Time: </strong>{timeString}</div>
        </div>
    )
}

export default Watch;