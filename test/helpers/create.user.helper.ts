import * as Chance from 'chance';

const chance = new Chance();
const userRole = 'User';

export const CREATE_USER_OPERATION_NAME = 'CreateUser';

export const CREATE_USER_MUTATION = `mutation CreateUser($createUserInput: CreateUserInput!){
  createUser(createUserInput:$createUserInput){
    _id
    firstName
    lastName
    email
    role
  }
}`;

export const generateCreateUserVariables = (role = userRole) => {
  return {
    createUserInput: {
      firstName: chance.first(),
      lastName: chance.last(),
      email: chance.email(),
      password: chance.string({ length: 15 }),
      role: role,
      addresses: [
        {
          street: chance.street(),
          city: chance.city(),
          state: chance.state(),
          zip: chance.zip(),
        },
      ],
    },
  };
};
