export const LOGIN_USER_OPERATION_NAME = 'LoginUser';
export const LOGIN_USER_MUTATION = `mutation LoginUser($loginCredentials:LoginUserInput!){
  loginUser(loginUserInput:$loginCredentials){
    access_token
  }
}`;

export const generateLoginUserVariables = (email, password) => {
  return {
    loginCredentials: {
      email,
      password,
    },
  };
};
