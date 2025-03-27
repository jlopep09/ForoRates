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

If we change dependencies and get an error, we must:
 -delete node_modules
 -delete the Docker volume
 -install in UI npm install
 -docker compose up --build
