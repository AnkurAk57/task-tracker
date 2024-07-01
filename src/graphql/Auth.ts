import { gql } from "@apollo/client";


export const LOGIN = gql`
    mutation Mutation($user: GetUserInput!) {
        login(user: $user) {
        user {
            id
            email
            name
        }
        token
        }
    }
`;
