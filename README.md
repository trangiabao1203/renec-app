# Renec - Video Sharing

This is a video sharing platform, where users can share videos from youtube platform.

## Introduction

This project is a video sharing platform where users can share YouTube videos with everyone. The key features of the project include:
- Register and login functionality
- Share videos by inputting the YouTube URL
- Users can view shared videos and provide thumbs-up or thumbs-down ratings

## Prerequisites
### Environment Setup
Before getting started with the project, ensure you have the following software and tools installed:
- Node.js v16 or higher
- Yarn package manager
- MongoDB database
- Lerna and Nx
- Docker and Docker Compose

### Database Setup
How to install MongoDB using docker compose
1. Create a docker-compose.yml file in your project directory and add the following content:
```yaml
version: '3'
services:
  mongo:
    image: mongo
    restart: always
    ports:
      - 27017:27017
    environment:
      MONGO_INITDB_ROOT_USERNAME: root
      MONGO_INITDB_ROOT_PASSWORD: root123
```
In this configuration, we're using the official MongoDB Docker image, exposing port 27017, and setting the root username and password. Make sure to change the password to a secure value in a production environment.

2. Run the following command to start the MongoDB container:
```bash
docker-compose up -d
```
This will download the MongoDB image (if not already present) and start the container in the background.

3. Once the MongoDB container is running, execute the following command to create a user and database:
```bash
docker exec -it <container_name> mongo admin -u root -p example --eval "db.createUser({ user: 'your_username', pwd: 'your_password', roles: [{ role: 'readWrite', db: 'your_database' }] })" 
```
Replace <container_name> with the name or ID of your MongoDB container. Also, update your_username, your_password, and your_database with your desired values.

For example:
```bash
docker exec -it my-mongodb-container mongo admin -u root -p example --eval "db.createUser({ user: 'renec', pwd: 'renec_123', roles: [{ role: 'readWrite', db: 'renec_db' }] })"
```
This command will connect to the MongoDB container, authenticate as the root user, and create a new user with read-write access to the specified database.

4. You can now use the created user and database credentials in your project's configuration to connect to the MongoDB instance.

P/S: Remember to update the credentials in your project's configuration files to match the ones you specified during the user and database creation step.

### Monorepo Setup with Lerna and Nx
This project is organized as a monorepo using Lerna and Nx. A monorepo allows you to manage multiple related projects in a single repository. Lerna is a tool for managing JavaScript projects with multiple packages, while Nx is a set of extensible dev tools for monorepo development.

To learn more about monorepos, Lerna, and Nx, you can refer to the following resources:
- [Monorepo Explained](https://monorepo.tools/)
- [Lerna Documentation](https://lerna.js.org/docs/getting-started)
- [Nx Documentation](https://nx.dev/getting-started/intro)

## Getting Started
### Installation & Configuration
To get the project up and running on your local machine, follow these steps:

1. Clone the repository:
```bash 
git clone https://github.com/username/project.git
```

2. Install project dependencies:
```bash
yarn install
```

3. Setup environment variables:
- Open file apps/renec-api/config.yml and edit your MongoDB connection
```bash
mongo:
  host: localhost
  port: 27017
  username: renec
  password: renec123
  database: renec_db
  connectTimeout: 20000
  directConnection: true
```

- Go to directory /apps/renec-web and create a file .env, then add the following content:
```bash
WEB_URL=https://localhost:3000
API_URL=https://localhost:9010
```

### Running the Project
In this project, you will see 2 packages in apps directory:
- renec-api: This is the backend API server develop with NestJS
- renec-web: This is the frontend web application develop with NextJS

All of packages are using Lerna and Nx to manage workspace, so you can run the following command to start the project:
```bash
yarn dev --scope @renec/api
yarn dev --scope @renec/web
```

Explaining the command:
- Each packages have a package.json file, and have a name with format @renec/<package_name>
- In the root of package.json file, there is a script with name dev, this script will run the command yarn dev as parallel for any packages have the same name script
- You can also specify the package name to run the command, for example: yarn dev --scope @renec/api
- You can do a similar thing with other scripts, for example: yarn build --scope @renec/api

## Usage
After running the project, you can access the web application at https://localhost:3000

You can also access the API documentation at https://localhost:9010/swagger

Once the application is up and running, you can use it as follows:
- Register a new account or log in with existing credentials.
- Share a video by entering the YouTube URL.
- Other users can view the shared video and provide thumbs-up or thumbs-down ratings.

Note: You can check the production release at:
- Web application: https://joktec.com/
- API documentation: https://api.joktec.com/swagger

## Deployment
### Manual Deployment (Using PM2 and Nginx)
1. Build the project:
```bash
yarn build
```

2. Deploy the project into VM (maybe using SFPT or Rsync)
3. Install PM2 and Nginx
4. Start project with PM2
```bash
pm2 start apps/renec-api/dist/main.js --name renec-api
pm2 start yarn --name renec-web -- serve
```

5. Configure Nginx with proxy_pass to the project
```bash
server {
    listen 80;
    server_name api.joktec.com;

    location / {
        proxy_pass http://localhost:9010;
    }
}
```

### Docker Deployment
(Note: This section is under development and will be updated in the future. Please refer to the project documentation or consult with the development team for the latest instructions on deploying the application using Docker.)

Deploying the application using Docker provides a convenient way to package and distribute your project as a containerized application. Docker allows for consistent deployment across different environments, making it easier to manage dependencies and ensure reproducibility.

To deploy the application using Docker, follow the instructions provided in the project documentation or consult with the development team for the specific steps. This section will be updated in the future to provide detailed instructions on building the Docker image and running containers.

In the meantime, you can explore Docker's official documentation to familiarize yourself with Docker concepts and commands:
- [Docker Overview](https://docs.docker.com/get-started/overview/)

Please refer to the project's future updates or documentation for the complete Docker deployment guide.

## Troubleshooting
If you encounter any issues during the setup or usage of the project, refer to the following troubleshooting steps:
- Ensure that you have installed all the required software and tools.
- Ensure that you have configured the project correctly.
- Ensure that you have started the MongoDB container.
- Ensure that you have started the project with the correct command.
- Ensure that you have specified the correct URLs in the web application's .env file.
- Ensure that you have specified the correct MongoDB credentials in the API server's config.yml file.

## Technical Debt
There are some technical debt in this project, and I will try to fix it in the future:
- [ ] Add unit tests
- [ ] Add e2e tests
- [ ] Add Dockerfile for API server
- [ ] Add Dockerfile for web application
- [ ] Setup deployment with Docker and Kubernetes
