import { parse, differenceInMinutes, startOfDay } from 'date-fns';

export const parseTime = (time: string) => {
    const timeParsed = parse(time, 'HH:mm', new Date());
    return differenceInMinutes(timeParsed, startOfDay(timeParsed));
};
