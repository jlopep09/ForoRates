# ForoRates  

React application with FastAPI backend and a Postgress database hosted on render.com

https://fororates.joselp.com/

http://fororates.joselp.com/

## Getting Started  
To install the project, you need to have Docker installed.

### To use the DDBB from Render and localhost backend
First you need to create a file called .env in the root directory and set the following environment variables.

If you don't know what value you should assign to each variable, ask about the WhatsApp group or check the GitHub secrets of the repository.This step is necessary to avoid DDOS or similar attacks that generate computing costs.

```.env
DATABASE_URL = ""
```

### Configure the backend that the frontend will use
Create a file called .env in the ui directory and set the following environment variables.

If you don't know what value you should assign to each variable, ask about the WhatsApp group or check the GitHub secrets of the repository. This step is necessary to avoid DDOS or similar attacks that generate computing costs.

```.env
VITE_API_URL = ""
```

### Start localhost frontend and backend
To start all services, run the following command from the project's root directory (the directory containing the `compose.yml` file):  

Depending on the version of Docker you have installed, use ONE of the following commands
```sh
docker compose up --build
```
```sh
docker-compose up --build
```

Once the containers are up and running, you can access the web aplication from http://localhost:80/ 

### Start only localhost frontend 

From the ui directory:    
```sh
npm run dev
```

## Troubleshoot 

### Updating dependencies
If we change dependencies and get an error, we must:
 - stop the app (locally and docker compose)
 - delete node_modules
 - delete the Docker volume
 - install in .ui the dependencies with -> npm install
 - run the app with -> docker compose up --build
