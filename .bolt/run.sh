#!/bin/bash

# Exit immediately if a command exits with a non-zero status.
set -e

# --- Helper Functions ---
# Function to print messages in a standard format
print_message() {
    echo "
======================================================
$1
======================================================
"
}

# --- Pre-flight Checks ---
print_message "Checking prerequisites..."

# 1. Check for Docker
if ! command -v docker &> /dev/null; then
    print_message "ERROR: Docker is not installed. Please install Docker to continue."
    exit 1
fi

if ! docker info &> /dev/null; then
    print_message "ERROR: The Docker daemon is not running. Please start Docker and try again."
    exit 1
fi

print_message "All prerequisites are met."

# --- One-Time Setup ---
# Create the server .env file if it doesn't exist
if [ ! -f "server/.env" ]; then
    print_message "Performing one-time setup: Creating server/.env file..."
    cp server/.env.example server/.env
    print_message ".env file created successfully."
fi

# --- Start the Application ---
print_message "Starting the Job Organizer application..."
print_message "This command will start the database, install dependencies, and launch the servers."
print_message "The process may take a few minutes on the first run."

# The main command to run the entire application
npm run start:app

print_message "Application is starting up. The URL will appear in the terminal shortly."
