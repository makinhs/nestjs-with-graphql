export const GET_USERS_OPERATION_NAME = 'ListUsers';

export const GET_USERS_QUERY = `query ListUsers($args:ConnectionArgs!){
  listUsersWithCursor(args: $args) {
    page {
      edges {
        node {
          _id
          firstName
          lastName
          email
          role
        }
      }
      pageInfo {
        startCursor
        endCursor
        hasPreviousPage
        hasNextPage
      }
    }
  }
}`;
