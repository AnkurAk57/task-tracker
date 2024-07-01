import { setContext } from '@apollo/client/link/context';
import { AuthToken } from './interface/Token.interface';


const authLink = setContext(async(_, { headers }) => {
    const token = localStorage.getItem('token') as AuthToken['token']; // Type assertion for safety

    return {
        headers: {
            ...headers,
            'leaf-auth-token': token ? token : '',
        },
    };
});

export default authLink;