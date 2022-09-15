# GitHub Microservice

This is a sample TypeScript + Node.js & Express microservice that interacts with the GitHub API in order to retrieve Repositories + Branches information.

## Prerequisites

Node.js 18+
NPM 8+
Docker

## Configuration

- ```SERVER_PORT``` -> the port of the REST API server
- ```GITHUB_BASE_URL``` -> the GitHub API base url (default https://api.github.com)
- ```GITHUB_PERSONAL_ACCESS_TOKEN``` -> your GitHub Personal Access Token; if empty, the GitHub's API rate limit will be lower

## Build TypeScript sources

Run ```npm run build``` to build the project, and generate the minified JavaScript bundle

## Run TypeScript sources

Run ```npm start```

## Run TypeScript tests

Run ```npm test```

## Build Docker image

docker build . -t github-microservice-nodejs:latest

## Run Docker image

docker run -d --name github-microservice-nodejs -e GITHUB_PERSONAL_ACCESS_TOKEN=<PersonalAccessToken> -p 8080:8080 --rm github-microservice-nodejs:latest

## AWS ECS Fargate CloudFormation template

See the Java sources' example

## Swagger UI

```http://localhost:8080/swagger-ui```

## Health endpoint

```http://localhost:8080/health```