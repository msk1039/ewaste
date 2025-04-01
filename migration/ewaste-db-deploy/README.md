# E-Waste Database Deployment

This project is designed to deploy an e-waste management database using MySQL. It includes scripts for setting up the database, creating tables, defining stored procedures, and seeding initial data.

## Project Structure

```
ewaste-db-deploy
├── src
│   ├── deploy.js          # Main script to connect to MySQL and execute SQL files
│   ├── config.js          # Configuration settings for database connection
│   └── utils
│       └── logger.js      # Utility functions for logging
├── sql
│   ├── 01-setup.sql       # SQL commands to create the database
│   ├── 02-tables.sql      # SQL commands to create necessary tables
│   ├── 03-procedures.sql   # SQL commands to define stored procedures
│   ├── 04-request.sql      # SQL commands for handling donation requests
│   ├── 05-donor.sql        # SQL commands for managing donor data
│   ├── 06-educational-content.sql # SQL commands for educational content
│   ├── 07-analysis.sql     # SQL commands for generating analytical reports
│   └── 08-seed.sql        # SQL commands to seed initial data
├── package.json            # npm configuration file
├── .env.example            # Template for environment variables
├── .gitignore              # Files and directories to ignore by Git
└── README.md               # Project documentation
```

## Setup Instructions

1. **Clone the Repository**
   ```bash
   git clone <repository-url>
   cd ewaste-db-deploy
   ```

2. **Install Dependencies**
   Make sure you have Node.js installed. Then run:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**
   Copy the `.env.example` file to `.env` and fill in the required values for your database connection.

4. **Run the Deployment Script**
   Execute the deployment script to set up the database:
   ```bash
   node src/deploy.js
   ```

## Usage

- The `deploy.js` script will connect to your Aiven MySQL database and execute all SQL files in the specified order.
- Ensure that your database credentials are correctly set in the `.env` file before running the script.

## Logging

- The project includes a logging utility to track the execution flow and any errors that may occur during the deployment process. Logs will be printed to the console.

## Contributing

Feel free to submit issues or pull requests for improvements or bug fixes. 

## License

This project is licensed under the MIT License.