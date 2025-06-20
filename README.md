# JobTracker - Job Application Assistant

A full-stack application for managing job applications with a React frontend and Node.js/Express backend with PostgreSQL database.

## Features

- **Dashboard**: Overview of application progress and statistics
- **Job Management**: Track job applications with detailed information
- **Status Tracking**: Monitor application status from initial review to final outcome
- **Priority System**: Automatically calculate job priorities based on location, technologies, and compensation
- **Notes & Communication**: Track communication history and add personal notes
- **Suggestions**: AI-powered recommendations for improving applications

## Tech Stack

### Frontend
- React 18 with TypeScript
- Tailwind CSS for styling
- Lucide React for icons
- Vite for development and building

### Backend
- Node.js with Express.js
- PostgreSQL database
- Prisma ORM
- TypeScript

## Getting Started

This project is configured to run with a single command, which handles everything from installing dependencies to starting the servers.

### Prerequisites

- **Node.js**: v18 or higher
- **Docker**: Docker and Docker Compose must be installed and running.
- **npm**: Included with Node.js.

### 1. Clone the Repository

First, clone the repository to your local machine:

```bash
git clone <repository-url>
cd <repository-folder>
```

### 2. Configure the Environment

Next, create the environment file for the server. This only needs to be done once.

```bash
# From the project root, navigate to the server directory
cd server

# Copy the example environment file
cp .env.example .env
```

Open the newly created `server/.env` file and ensure the `DATABASE_URL` is set correctly:

```env
DATABASE_URL="postgresql://jobtracker_user:jobtracker_password@localhost:5433/jobtracker?schema=public"
```

### 3. Start the Application

With the setup complete, you can now start the entire application with a single command from the **project root**.

```bash
npm run start:app
```

This command will automatically:

1.  **Install all dependencies** for both the frontend and backend.
2.  **Start the PostgreSQL database** using Docker.
3.  **Set up the database schema** with Prisma.
4.  **Start the backend server**, automatically finding a free port if the default is busy.
5.  **Start the frontend server**, which waits for the backend to be ready before launching.

The application will be available at the URL shown in the terminal (usually `http://localhost:5173` or the next available port).

### 5. Populate the Database (Optional)

After starting the application, you can populate the database with the sample job data from `JOBS_SOURCE.md`. There are two ways to do this:

**Method 1: Using the Import Script**

Run the following command from the `server` directory. This is useful for the initial setup.

```bash
# From the server directory
npm run db:import
```

**Method 2: Using the API Endpoint**

While the application is running, you can trigger the import by sending a POST request to the API. This is useful for re-importing data without restarting the server.

```bash
curl -X POST http://localhost:3001/api/import/markdown
```
This will return a JSON response indicating the number of created and skipped jobs.

## Troubleshooting

### Port in Use Errors

If you encounter an error like `Error: listen EADDRINUSE: address already in use`, it means a previous server instance is still running. Before starting the application, it's a good practice to ensure all old processes are stopped.

You can do this by running the following command from the project root:

```bash
# This command forcefully stops any lingering server or vite processes.
pkill -f "(concurrently|tsx|vite)" || true
```

After running this, you can safely start the application with `npm run dev:full`.

## Deployment to GitHub

To upload this project to a new GitHub repository:

1. **Create a new repository on GitHub**
   - Go to [GitHub](https://github.com/new)
   - Choose a name for your repository (e.g., `JobsOrganizer-BOLT`)
   - Keep it public or private as per your preference
   - Do NOT initialize with a README, .gitignore, or license

2. **Initialize Git and push to GitHub**
   ```bash
   # Initialize git repository
   git init -b main
   
   # Add all files
   git add .
   
   # Make initial commit
   git commit -m "Initial commit"
   
   # Add the remote repository
   git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPOSITORY-NAME.git
   
   # Push to GitHub
   git push -u origin main
   ```
   Replace `YOUR-USERNAME` with your GitHub username and `YOUR-REPOSITORY-NAME` with your repository name.

3. **Set up GitHub token (if required)**
   - If you get authentication errors, you'll need to create a personal access token:
     1. Go to GitHub > Settings > Developer settings > Personal access tokens > Tokens (classic)
     2. Generate a new token with 'repo' scope
     3. Use this token as your password when pushing

4. **For existing repositories**
   If you're adding to an existing repository, first pull any changes:
   ```bash
   git pull origin main --allow-unrelated-histories
   ```
   Then push your changes:
   ```bash
   git push -u origin main
   ```

The application will be available at:
- Frontend: http://localhost:5173
- Backend API: http://localhost:3001

### API Endpoints

#### Jobs
- `GET /api/jobs` - Get all jobs
- `GET /api/jobs/:id` - Get job by ID
- `POST /api/jobs` - Create new job
- `PUT /api/jobs/:id` - Update job
- `DELETE /api/jobs/:id` - Delete job
- `PATCH /api/jobs/:id/status` - Update job status
- `PATCH /api/jobs/:id/notes` - Update job notes

#### Responses
- DELETE /api/responses/:id - Delete response

#### Import
- POST /api/import/markdown - Import jobs from `JOBS_SOURCE.md` into the database. Returns JSON with counts of created and skipped jobs.
- `POST /api/responses` - Create new response
- `GET /api/responses/job/:jobId` - Get responses for a job
- `DELETE /api/responses/:id` - Delete response

### Database Schema

The application uses the following main entities:

- **Job**: Core job application data
- **Response**: Communication history for each job

See `server/prisma/schema.prisma` for the complete schema definition.

### Project Structure

```
├── src/                    # Frontend source code
│   ├── components/         # React components
│   ├── hooks/             # Custom React hooks
│   ├── services/          # API service layer
│   ├── types/             # TypeScript type definitions
│   └── utils/             # Utility functions
├── server/                # Backend source code
│   ├── src/
│   │   ├── routes/        # Express routes
│   │   ├── middleware/    # Express middleware
│   │   ├── utils/         # Utility functions
│   │   └── scripts/       # Database scripts
│   └── prisma/            # Database schema and migrations
└── public/                # Static assets
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.