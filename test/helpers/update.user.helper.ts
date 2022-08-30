export const UPDATE_USER_OPERATION_NAME = 'UpdateUser';

export const UPDATE_USER_MUTATION = `mutation UpdateUser($updateUserInput:UpdateUserInput!){
  updateUser(updateUserInput:$updateUserInput){
    _id
    firstName
    lastName
    email
    role
  }
}`;

export const generateUpdateUserVariables = (_id: string, firstName = null, lastName = null, email = null, role = null) => {
  return {
    updateUserInput: {
      _id,
      firstName,
      lastName,
      email,
      role,
    },
  };
};
