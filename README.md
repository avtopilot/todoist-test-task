# TODO application

This is the test task for the coding assessment that implements the TODO application.

## Task Description

Implement a TODO application using

1. Single Page application using React + Typescript - Preferable
2. Or ASP.NET core + razor view if you don’t know any client framework
3. Asp.NET core as server side api
4. Just in Memory collection as database.

The application should support:

1. List existing tasks
2. Add and Edit tasks
3. Deletion of completed tasks only

Validation:

- Every task has a name, priority, and status (not started, in progress,
  completed)
- Every task must have a name
- You should validate that we don't have two tasks with the same name
- Priority is a number.
- Business may ask more validation in the future.

Validation must be done at both client and server sides.

## How to run the app

### Client side

The client-side application is located under the _client_ folder. To run it, please:

1. install npm packages by running `yarn` command
2. start the application `yarn start`

The application will start on the _3000_ port (http://localhost:3000). If you would like to run it on a different port, please change it in `start` command inside _package.json_ file.

The client application is integrated with the backend API. The URL to the API is configured in _public -> env.js_ file and currently set to http://localhost:5000.

### Backend side

The backend-side application is located under the _server_ folder. It can be run from any IDE supporting .Net 7 or a console by running:

- `dotnet run --project src/Todoist.WebApi`

The backend application contains both UnitTests and IntegrationTests, which can be run from IDE as well or console by running:

- `dotnet test *.sln`

The application is configured to run on _5000_ port, this can be changed by ammending _launchSettings.json_ file. Please if you change the port, don't forget to amend it on the client-side application as well, instruction can be found [here](#client-side).

### Assumptions:

- it was assumed the Task name is unique and cannot be changed
- there are no Unit Tests for the repository and controller since the logic is covered with Integration Tests

### TODO:

- introduce Result Pattern on BE
- move controller logic to Action Handlers
