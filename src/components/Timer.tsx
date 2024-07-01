import React, { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import { useMutation, useQuery } from '@apollo/client';
import { Button, Tooltip } from 'antd';
import { toast } from 'react-toastify';
import { GetLocalDataQuery } from '../interface/CacheData.interface';
import styles from '../assets/styles/Timer.module.scss';
import { formatTime } from '../utils/formatTime';
import client from '../apolloClient';
import { ADD_SESSION, GET_SELECTED_TASK, GET_TIMER, GET_UNPLANNED_TASKS } from '../graphql/Task';
import Loader from './Loader';
import { CaretRightFilled, XFilled } from '@ant-design/icons';

const Timer: React.FC = () => {
    const [startTimeString, setStartTimeString] = useState<string | null>(null);
    const [timerString, setTimerString] = useState<string>('00:00');
    const [isRunning, setIsRunning] = useState<boolean>(false);
    const [addFocusSession, { loading }] = useMutation(ADD_SESSION, {
        refetchQueries: [GET_UNPLANNED_TASKS],
    });
    const { data: selectedData, loading: localLoader, error: localError } = useQuery<GetLocalDataQuery>(GET_SELECTED_TASK);

    useEffect(() => {
        let interval: NodeJS.Timeout | null = null;
        if (isRunning && startTimeString) {
            // Run interval every minute
            interval = setInterval(() => {
                const now = dayjs();
                const diffMinutes = now.diff(startTimeString, 'minutes');
                const hh = Math.floor(diffMinutes / 60).toString().padStart(2, '0');
                const mm = Math.floor(diffMinutes % 60).toString().padStart(2, '0');
                setTimerString(`${hh}:${mm}`);

                // Set in total focus time at every 5 minutes
                if (diffMinutes > 0 && diffMinutes % 5 === 0) {
                    const durationInSeconds = now.diff(dayjs(startTimeString), 'seconds');
                    updateApolloCache((selectedData?.selectedTaskData.focusTime || 0) + durationInSeconds);
                }
            }, 60000);
        } else {
            clearInterval(interval!);
        }
        return () => clearInterval(interval as NodeJS.Timeout);
    }, [isRunning, startTimeString]);

    // Timer start/stop method
    const handleStartStop = async () => {
        if (isRunning) {
            setIsRunning(false);
            const endTiming = dayjs();
            const difference = endTiming.diff(startTimeString, 'seconds');
            const focusSession = {
                start: startTimeString,
                end: endTiming.toISOString(),
                task: selectedData?.selectedTaskData?.selectedTaskId,
                segmentDurations: [difference]
            }
            const res = await addFocusSession({ variables: { focusSession } });
            if (res?.data?.addFocusSession?.task?.focusTime) {
                toast.success(
                    <>
                        <span>Your focus time on <strong>{selectedData?.selectedTaskData?.selectedTaskName} task</strong> is {formatTime(res?.data?.addFocusSession?.task?.focusTime)}</span>
                    </>,
                    { autoClose: 5000, position: 'top-right' }
                );
                setTimerString('00:00');

                // Update clock
                client.writeQuery({
                    query: GET_TIMER,
                    data: { seconds: res.data.addFocusSession.task.focusTime }
                });
            }
        } else {
            // Start the timer
            setIsRunning(true);
            setStartTimeString(dayjs().toISOString());
            setTimerString('00:00');
        }
    };

    // Store total focus time in apollo cache/store
    const updateApolloCache = (seconds: number) => {
        client.writeQuery({
            query: GET_TIMER,
            data: { seconds }
        });
    }

    return (
        <div>
            {(loading || localLoader) ? <Loader />
                :
                <>
                    <div className={styles['timer-container']}>
                        <Tooltip title={isRunning ? 'Stop' : 'Start'}>
                            <Button
                                disabled={!selectedData?.selectedTaskData?.selectedTaskId}
                                shape="circle"
                                icon={isRunning ? <XFilled size={20} /> : <CaretRightFilled size={20} />}
                                onClick={handleStartStop}
                                className={isRunning ? styles['active-timer'] : ''}
                            />
                        </Tooltip>
                        <div className={styles['time-string']}><strong>Time: </strong>{timerString}</div>
                    </div>
                </>
            }
        </div>
    );
};

export default Timer;
