interface EventProps {
    left: number;
    width: number;
    startMin: number;
    endMin: number;
    id: number;
    dayStart: number;
    pixelsPerMinute: number;
}

export const EventCalendar = ({id, left, width, startMin, endMin, dayStart, pixelsPerMinute}: EventProps) => {
    return <div className="absolute bg-red-500 border flex justify-center items-center overflow-hidden" key={id}
                style={{
                    left: `${left}px`,
                    width: `${width}px`,
                    top: `${(startMin - dayStart) * pixelsPerMinute}px`,
                    height: `${(endMin - startMin) * pixelsPerMinute}px`,
                }}>
        {id}
    </div>
}
