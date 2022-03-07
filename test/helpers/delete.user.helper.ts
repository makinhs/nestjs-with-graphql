export const DELETE_USER_OPERATION_NAME = 'RemoveUser';

export const DELETE_USER_MUTATION = `mutation RemoveUser($userId: String!) {
  removeUser(_id: $userId) {
    _id
  }
}`;

export const generateRemoveUserVariable = (userId: string) => {
  return {
    userId,
  };
};
