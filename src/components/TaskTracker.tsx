import { useEffect, useState } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { MenuProps, Select } from 'antd';
import { GET_SELECTED_TASK, GET_TIMER, GET_UNPLANNED_TASKS } from '../graphql/Task';
import { LOGIN } from '../graphql/Auth';
import '../assets/styles/TaskTracker.scss';
import Timer from './Timer';
import client from '../apolloClient';
import { UnplannedTask } from '../interface/Task.interface';
import Loader from './Loader';
import { GetFocusTimeQuery } from '../interface/CacheData.interface';
import Watch from './Watch';

type ExtendedMenuItem = {
    label: string;
    key: string;
    focustime: number;
    value: string;
};

const TaskDropdown: React.FC = () => {
    const { data, error, loading, refetch } = useQuery(GET_UNPLANNED_TASKS);
    const { data: focusTimeData } = useQuery<GetFocusTimeQuery>(GET_TIMER);
    const [login] = useMutation(LOGIN);
    const [unplannedTasks, setUnplannedTasks] = useState<ExtendedMenuItem[]>([]);

    console.log('data', data);
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token || error?.message?.includes('401')) {
            handleLogin();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [error]);

    useEffect(() => {
        if (data?.user?.unplannedTasks?.length > 0) {
            const tasks = data?.user?.unplannedTasks?.map((item: UnplannedTask) => ({
                label: item.name,
                key: item.id,
                value: item.id,
                focustime: item.focusTime
            }));

            setUnplannedTasks(tasks);
        }
    }, [data]);

    // Login to store auth token
    const handleLogin = async () => {
        const user = {
            email: process.env.REACT_APP_USER_NAME!,
            password: process.env.REACT_APP_USER_PASSWORD!,
        }
        const response = await login({ variables: { user } });
        if (response?.data?.login?.token) {
            refetch();
            localStorage.setItem('token', response?.data?.login?.token);
        }
    }

    // Set selected task details
    const setSelectedTask = (taskId: string) => {
        const selectedTask = unplannedTasks?.find(x => x?.key === taskId);
        if (selectedTask != null) {
            storeSelectedTask(selectedTask);
        }
        else {
            storeSelectedTask(null);
        }
    }

    // Store selected task in graphql store
    const storeSelectedTask = (selectedTask: ExtendedMenuItem | null) => {
        if (selectedTask) {
            client.writeQuery({
                query: GET_SELECTED_TASK,
                data: {
                    selectedTaskData: {
                        __typename: 'SelectedData',
                        selectedTaskId: selectedTask?.key,
                        focusTime: selectedTask?.focustime,
                        selectedTaskName: selectedTask?.label
                    },
                },
            });

            // Store focus time in apollo cache/store
            const seconds = selectedTask?.focustime;
            client.writeQuery({
                query: GET_TIMER,
                data: { seconds }
            });
        }
        else {
            // Clear store data
            client.cache.evict({
                id: 'ROOT_QUERY',
                fieldName: 'selectedTaskData',
            });
            client.cache.evict({
                id: 'ROOT_QUERY',
                fieldName: 'seconds',
            });
            client.cache.gc();
        }
    }

    // On task selecor change
    const handleChange: MenuProps['onClick'] = (e) => {
        setSelectedTask(e?.toString());
    }

    return (
        <>
            {loading ? <Loader />
                :
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <div className="task-tracker-container">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                            <label>Task</label>
                            <Select
                                options={unplannedTasks}
                                showSearch
                                placeholder="Select A Task"
                                onChange={handleChange}
                                optionFilterProp="label"
                                size='large'
                                allowClear
                            />
                        </div>
                        <Timer />
                        <Watch time={focusTimeData?.seconds} />
                    </div>
                </div>
            }
        </>
    )
};

export default TaskDropdown