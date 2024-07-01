import { gql } from '@apollo/client';

export const ADD_SESSION = gql`
    mutation Mutation($focusSession: AddFocusSessionInput!) {
        addFocusSession(focusSession: $focusSession) {
          focusSession {
            task {
              id
              name
            }
            id
          }
          task {
            focusTime
          }
        }
      }
`
export const GET_SELECTED_TASK = gql`
  query GetSelectedTask {
    selectedTaskData @client {
        selectedTaskId
        focusTime
        selectedTaskName
    }
  }
`;

export const GET_UNPLANNED_TASKS = gql`
    query getUnplannedTasks {
        user {
            unplannedTasks {
                name
                id
                isCompleted
                focusTime
            }
        }
    }
`;

export const GET_TIMER = gql`
  query GetTimer {
    seconds @client
  }
`;
