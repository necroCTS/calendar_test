import './App.css'
import {z} from "zod";
import eventsRawData from '../test.json'
import {Calendar} from "./components";

const EventSchema = z.object({
    id: z.number(),
    start: z.string(),
    duration: z.number(),
});

const EventsSchema = z.array(EventSchema);


function App() {
    try {
        const events = EventsSchema.parse(eventsRawData);
        return (
            <Calendar events={events}/>
        )
    } catch (e) {
        console.error(e);
        return <div>Invalid data</div>
    }
}

export default App
