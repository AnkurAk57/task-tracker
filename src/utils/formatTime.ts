import dayjs from "dayjs";


export const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    // Using dayjs for formatting
    const formattedTime = dayjs().minute(minutes).second(remainingSeconds).format('m[m] ss[s]');

    return formattedTime;
}