import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { CREATE_USER_MUTATION, CREATE_USER_OPERATION_NAME, generateCreateUserVariables } from './helpers/create.user.helper';
import { User } from '../src/users/entities/user.entity';
import { generateGetUserVariable, GET_USER_OPERATION_NAME, GET_USER_QUERY } from './helpers/get.user.helper';
import { generateUpdateUserVariables, UPDATE_USER_MUTATION, UPDATE_USER_OPERATION_NAME } from './helpers/update.user.helper';
import { GET_USERS_OPERATION_NAME, GET_USERS_QUERY } from './helpers/get.users.helper';
import { DELETE_USER_MUTATION, DELETE_USER_OPERATION_NAME } from './helpers/delete.user.helper';
import { generateLoginUserVariables, LOGIN_USER_MUTATION, LOGIN_USER_OPERATION_NAME } from './helpers/login.user.helper';

const GRAPHQL_ENDPOINT = '/graphql';

describe('Users resolver (e2e)', () => {
  let app: INestApplication;
  let user: User;
  let BEARER_JWT;
  let user_password;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('Should create an user with user mutation', () => {
    const createUserInput = generateCreateUserVariables().createUserInput;
    user_password = createUserInput.password;
    return request(app.getHttpServer())
      .post(GRAPHQL_ENDPOINT)
      .send({
        operationName: CREATE_USER_OPERATION_NAME,
        query: CREATE_USER_MUTATION,
        variables: { createUserInput },
      })
      .expect(200)
      .expect((res) => {
        expect(res.body.data.createUser).toBeDefined();
        user = res.body.data.createUser;
        expect(user._id).toBeDefined();
        expect(user.firstName).toBe(createUserInput.firstName);
        expect(user.lastName).toBe(createUserInput.lastName);
        expect(user.role).toBe(createUserInput.role);
      });
  });

  it('Should login the new user with login user mutation', () => {
    return request(app.getHttpServer())
      .post(GRAPHQL_ENDPOINT)
      .send({
        operationName: LOGIN_USER_OPERATION_NAME,
        query: LOGIN_USER_MUTATION,
        variables: generateLoginUserVariables(user.email, user_password),
      })
      .expect(200)
      .expect((res) => {
        expect(res.body.data.loginUser).toBeDefined();
        expect(res.body.data.loginUser.access_token).toBeDefined();
        BEARER_JWT = `Bearer ${res.body.data.loginUser.access_token}`;
      });
  });

  it('Should get the user by the generated userId', () => {
    return request(app.getHttpServer())
      .post(GRAPHQL_ENDPOINT)
      .send({
        operationName: GET_USER_OPERATION_NAME,
        query: GET_USER_QUERY,
        variables: generateGetUserVariable(<string>user._id),
      })
      .expect(200)
      .expect((res) => {
        expect(res.body.data.user).toBeDefined();
        expect(res.body.data.user._id).toBeDefined();
        expect(res.body.data.user.firstName).toBe(user.firstName);
        expect(res.body.data.user.lastName).toBe(user.lastName);
        expect(res.body.data.user.role).toBe(user.role);
      });
  });

  it('Should update the user', () => {
    const updatedFirstName = 'John';
    const updatedLastName = 'Doe';
    const updateUserInput = generateUpdateUserVariables(<string>user._id, updatedFirstName, updatedLastName, user.email, user.role).updateUserInput;
    return request(app.getHttpServer())
      .post(GRAPHQL_ENDPOINT)
      .set('Authorization', BEARER_JWT)
      .send({
        operationName: UPDATE_USER_OPERATION_NAME,
        query: UPDATE_USER_MUTATION,
        variables: { updateUserInput },
      })
      .expect(200)
      .expect((res) => {
        expect(res.body.data.updateUser).toBeDefined();
        expect(res.body.data.updateUser._id).toBeDefined();
        expect(res.body.data.updateUser.firstName).toBe(updatedFirstName);
        expect(res.body.data.updateUser.lastName).toBe(updatedLastName);
        expect(res.body.data.updateUser.email).toBe(user.email);
        expect(res.body.data.updateUser.role).toBe(user.role);
        user = { ...res.body.data.updateUser };
      });
  });

  it('Should not be able to update an user with different id', () => {
    const updatedFirstName = 'John';
    const updatedLastName = 'Doe';
    const updateUserInput = generateUpdateUserVariables('fake_id_here', updatedFirstName, updatedLastName, user.email, user.role).updateUserInput;
    return request(app.getHttpServer())
      .post(GRAPHQL_ENDPOINT)
      .set('Authorization', BEARER_JWT)
      .send({
        operationName: UPDATE_USER_OPERATION_NAME,
        query: UPDATE_USER_MUTATION,
        variables: { updateUserInput },
      })
      .expect(200)
      .expect((res) => {
        expect(res.body.errors).toBeDefined();
        expect(res.body.errors.length).toBe(1);
      });
  });

  it('Should list users with cursor', () => {
    return request(app.getHttpServer())
      .post(GRAPHQL_ENDPOINT)
      .set('Authorization', BEARER_JWT)
      .send({
        operationName: GET_USERS_OPERATION_NAME,
        query: GET_USERS_QUERY,
        variables: {
          args: {
            first: 5,
          },
        },
      })
      .expect(200)
      .expect((res) => {
        const dataResponse = res.body.data.listUsersWithCursor;
        expect(dataResponse).toBeDefined();
        expect(dataResponse.page).toBeDefined();
        expect(dataResponse.page.edges).toBeDefined();
        expect(dataResponse.page.edges[0].node).toBeDefined();
        expect(dataResponse.page.edges[0].node.firstName).toBeDefined();
        expect(dataResponse.page.edges[0].node.lastName).toBeDefined();
      });
  });

  it('Should remove our testing user by id', () => {
    return request(app.getHttpServer())
      .post(GRAPHQL_ENDPOINT)
      .set('Authorization', BEARER_JWT)
      .send({
        operationName: DELETE_USER_OPERATION_NAME,
        query: DELETE_USER_MUTATION,
        variables: generateGetUserVariable(<string>user._id),
      })
      .expect(200)
      .expect((res) => {
        const dataResponse = res.body.data.removeUser;
        expect(dataResponse).toBeDefined();
        expect(dataResponse._id).toBeDefined();
      });
  });

  it('Should not be able to get the user after it was deleted', () => {
    return request(app.getHttpServer())
      .post(GRAPHQL_ENDPOINT)
      .set('Authorization', BEARER_JWT)
      .send({
        operationName: GET_USER_OPERATION_NAME,
        query: GET_USER_QUERY,
        variables: generateGetUserVariable(<string>user._id),
      })
      .expect(200)
      .expect((res) => {
        expect(res.body.errors).toBeDefined();
        expect(res.body.errors.length).toBe(1);
        expect(res.body.errors[0].message).toBe(`User ${user._id} not found`);
      });
  });
});
