import _ from 'lodash';
import {useMemo} from "react";
import {EventCalendar} from "../../components";
import {parseTime} from "./utils.ts";
import {useWindowDimensions} from "../../hooks";

interface CalendarProps {
    events: Event[];
}

export interface Event {
    id: number;
    start: string;
    duration: number;
}

interface EventWithPosition extends Event {
    width: number;
    left: number;
    startMin: number;
    endMin: number;
    maxOverlap: number;
}

const isOverlapping = (eventA: EventWithPosition, eventB: EventWithPosition) => eventA.endMin > eventB.startMin && eventA.startMin < eventB.endMin

const getOverlapNumberByColumn = (columns: Array<EventWithPosition[]>, event: EventWithPosition) => {
    let overlapNumber = 0
    for (const column of columns) {
        if (column.some((_event) => _event !== event && (isOverlapping(_event, event)))) {
            overlapNumber++
        }
    }
    return overlapNumber
}

const getWidthByMaxOverlap = (currentEvent: EventWithPosition, events: EventWithPosition[], widthTotal: number) => {
    let currentOverlapsByColumn = currentEvent.maxOverlap
    for (const event of events) {
        if (isOverlapping(currentEvent, event) && currentEvent.maxOverlap < event.maxOverlap) {
            currentOverlapsByColumn = event.maxOverlap
        }
    }
    return widthTotal / (currentOverlapsByColumn + 1)
}

const calculateEventPositions = (events: Event[], widthTotal: number): EventWithPosition[] => {
    const sortedEvents: EventWithPosition[] = _.chain(events)
        .map(event => ({
            ...event,
            startMin: parseTime(event.start),
            endMin: parseTime(event.start) + event.duration,
            width: 0,
            left: 0,
            maxOverlap: 0,
        }))
        .sortBy([event => -event.duration])
        .value();
    const columns: Array<EventWithPosition[]> = [];

    const findColumnByEvent = (event: EventWithPosition) => {
        for (const column of columns) {
            // Check if there is no overlap
            if (!column.some(_event => isOverlapping(_event, event))) {
                return column;
            }
        }
        const newColumn: EventWithPosition[] = [];
        columns.push(newColumn);
        return newColumn;
    };

    sortedEvents.forEach(event => {
        const column = findColumnByEvent(event);
        column.push(event);
    });

    columns.forEach((column) => {
        column.forEach(event => {
            event.maxOverlap = getOverlapNumberByColumn(columns, event)
        });
    });
    // Calculate width and left for each event
    columns.forEach((column, index) => {
        column.forEach(event => {
            event.left = index * (widthTotal / (event.maxOverlap + 1));
            event.width = getWidthByMaxOverlap(event, sortedEvents, widthTotal)
        });
    });

    return sortedEvents
}

export const Calendar = ({events}: CalendarProps) => {
    const {height: heightTotal, width: widthTotal} = useWindowDimensions()
    const dayStart = 9 * 60;
    const dayEnd = 21 * 60;
    const totalTimeByDay = dayEnd - dayStart;
    const sortedEventsWithPositions = calculateEventPositions(events, widthTotal)
    const pixelsPerMinute = useMemo(() => heightTotal / totalTimeByDay, [heightTotal]);

    return (
        <div className="relative w-full" style={{height: `${heightTotal}px`}}>
            {sortedEventsWithPositions.map(sortedEventsWithPosition => (
                <EventCalendar {...sortedEventsWithPosition} dayStart={dayStart} pixelsPerMinute={pixelsPerMinute}
                               key={sortedEventsWithPosition.id}/>
            ))}
        </div>
    );

}
