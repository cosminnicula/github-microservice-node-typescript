docker build . -t github-microservice-nodejs:latest

docker run -d --name github-microservice-nodejs -e GITHUB_PERSONAL_ACCESS_TOKEN=<PersonalAccessToken> -p 8080:8080 --rm github-microservice-nodejs:latest

