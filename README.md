# ForoRates – Software Engineering II


## Table of Contents

1. [Project Information](#project-information)  
2. [Team Members](#team-members)  
3. [Technologies Used](#technologies-used)  
4. [How to Run the Project](#how-to-run-the-project)  
   1. [Environment Variable Configuration](#environment-variable-configuration)  
   2. [Running with Docker Compose](#running-with-docker-compose)  
   3. [Running Only Frontend on Localhost](#running-only-frontend-on-localhost)  

---

## Project Information

ForoRates is a web-based social network application where users can share their opinions on various products and services through organized comment threads. The main goal is to provide a respectful community environment where users can discuss and exchange experiences about places or products they are considering visiting or purchasing. While the primary focus is on product and service reviews, users are free to create threads on other topics as long as they adhere to the basic conduct guidelines.

- **Deploy:** https://fororates.joselp.com/  

---

## Team Members

The project team consists of the following students:

- **David González Álvarez**  
- **Alejandro Vidal Álvarez**  
- **José Benito Edú Ngomo Medja**  
- **José Antonio López Perez**  

---

## Technologies Used

- **Backend:** FastAPI  
- **Frontend:** React + JavaScript + Vite + MUI + Tailwind
- **Database:** PostgreSQL (Render)  
- **Version Control:** Git + GitHub  
- **Containers & Deployment:** Docker + Docker Compose  

---

## How to Run the Project

### Environment Variable Configuration

#### For Using Render Database and Localhost Backend

1. In the project root directory, create a file named `.env` and set the following variable:

   ```ini
   DATABASE_URL=""
    ```

   > **Note:** If you are unsure of what value to assign, refer to the WhatsApp group or check the GitHub repository secrets. This step protects against DDOS and similar attacks.

#### Configure Backend URL for the Frontend

1. In the `ui` directory, create a file named `.env` and set the following variable:

   ```ini
   VITE_API_URL=""
   ```

   > **Note:** If you do not know the correct value, refer to the WhatsApp group or the GitHub secrets. This prevents unauthorized access and abuse.

---

### Running with Docker Compose

1. From the project root (the same directory containing `compose.yml`), run one of the following commands depending on your Docker version:

   ```bash
   docker compose up --build
   ```

   or

   ```bash
   docker-compose up --build
   ```

2. Once the containers are up and running, open your browser and navigate to [http://localhost](http://localhost/) to access ForoRates.

---

### Running Only Frontend on Localhost

1. Navigate to the `ui` directory:

   ```bash
   cd ui
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the development server:

   ```bash
   npm run dev
   ```

4. Open [http://localhost:5173](http://localhost:5173/) in your browser to view the frontend. Ensure that the backend is already running or accessible via the configured `VITE_API_URL`.

