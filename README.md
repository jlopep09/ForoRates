# ForoRates  
ForoRates repository  

React application with a Spring backend and a MySQL database.  

## Getting Started  
To install the project, you need to have Docker installed.  
To start all services, run the following command from the project's root directory (the directory containing the `compose.yml` file):  

Windows
```sh
docker compose up --build

```
Linux
```sh

docker-compose up --build
```

Once the containers are up and running, you can access the web aplication from http://localhost/ 

## Troubleshoot 

### Updating dependencies
If we change dependencies and get an error, we must:
 - stop the app (locally and docker compose)
 - delete node_modules
 - delete the Docker volume
 - install in .ui the dependencies with -> npm install
 - run the app with -> docker compose up --build
