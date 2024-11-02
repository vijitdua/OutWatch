# OutWatch – Service Outage Monitor (Backend)

> This is a backend only repository, frontend implementations can vary. An example implementation
> is [here](https://vijitdua.com/projects/#info) the repository of which can be
> viewed [here](https://github.com/vijitdua/vijitdua.com)

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Getting Started](#getting-started)
    - [Prerequisites](#prerequisites)
    - [Installation](#installation)
    - [Configuration](#configuration)
    - [Running the Application](#running-the-application)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
    - [Service Status](#service-status)
    - [Bug Reporting](#bug-reporting)
    - [Adding Services](#adding-services)
- [Technologies Used](#technologies-used)
- [License](#license)
- [Disclaimer](#disclaimer)

## Overview

OutWatch is a backend service designed for monitoring your application’s uptime and assisting with bug report
management. It periodically checks service status, logs uptime data, and sends notifications to a Discord channel when a
service is offline. User-submitted bug reports are also forwarded to Discord.

## Features

- **Automated Uptime Tracking**: Regularly monitors service status every 10 minutes, logging results for analysis.
  Accessible through discord and GET requests.
- **Discord Notifications**: Alerts Discord channels for any downtime or submitted bug reports.
- **Discord Command**: Allows you to check the current service status through a discord command /service-status.
- **User Bug Reporting**: Users can submit detailed bug reports, saved in the database and forwarded to a designated
  Discord channel.
- **Data Retention Policy**: Logs older than 7 days are automatically deleted, ensuring relevant, up-to-date data.
- **Private & Public Services**: Allows you to have some services to be publicly displayable on any service tracking
  webpage through GET requests, while allowing you to have some services that are private and only visible through the
  discord client.

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/en/) (version 14.x or higher)
- [npm](https://www.npmjs.com/get-npm)
- [PostgreSQL](https://www.postgresql.org/) as the primary database

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/yourusername/outwatch-backend.git
   cd outwatch-backend
   ```
2. **Install dependencies**:
   ```bash
   npm install
   ```

### Configuration

1. **Environment Variables**:  
   Create a `.env` file in the root directory by cloning the `.env.sample` and fill it with appropriate data.
2. **Service Seeing**:  
   Ensure `./src/seeders/serviceSeeder.js` is set up correctly. Make relevant services private / public for
   discord-only / public accessibility.
   > - In this <ins>public repository</ins> I have some <ins>"private" services</ins>
   > - However, do recall, that this repository is public. Meaning these services are not truly "private".
   > - To ensure your services are private, make sure your configuration files are not public. Beyond that, the code
       won't expose your services to the public.
   > - (Irrelevant yapping) The specific case of this repository
       >
   - In my case, I don't mind making these private while technically still publicly visible in my source code.
   >   - These files are only private to prevent un-necessary spam of services on
         my [website](https://vijitdua.com/projects#status) that other people (besides me) don't care about.
   >   - However, I still want to be able to easily update, modify, and deploy this file from the same open-source repo
         without managing multiple repos. Hence here it is public.

### Running the Application

To start the server and scheduler, use:

```bash
npm start
```

The server should now be running on `http://localhost:3000`, with uptime checks scheduled to execute every 10 minutes.

## Usage

Once up and running, OutWatch will:

1. Perform periodic health checks on all configured services every 10 minutes, logging status updates and notifying a
   designated Discord channel if any service is offline.
2. Accept and store user-submitted bug reports, forwarding them to a specific Discord channel for real-time updates.

## API Endpoints

### Service Status

- **GET /api/status**  
  Retrieves the current status of all monitored services.

### Bug Reporting

- **POST /api/bug**  
  Allows users to submit a bug report. Requires `serviceId` and `description`; `email` is optional.
    - **Parameters**:
        - `serviceId`: The ID of the affected service.
        - `description`: Details of the issue encountered.
        - `email` (optional): User's email for follow-up.

### Adding Services

There are multiple ways to add services to OutWatch:

1. **Database Insertion**: Manually insert entries in the `Service` table.
2. **POST Endpoint**: Use the `/api/services` endpoint, providing `serviceName`, `type`, and `url`. Example payload:
   ```json
   {
       "serviceName": "Backend API",
       "type": "Backend",
       "url": "https://api.example.com"
   }
   ```
3. **Database Seeder**: Use the `seeders/serviceSeeder.js` to initialize predefined services.

## Technologies Used

- **Node.js** and **Express** – Server and API routing.
- **PostgreSQL** – Primary data storage and persistence.
- **Discord.js** – For Discord notification integration on outages and bug reports.
- **Sequelize** – ORM for PostgreSQL.
- **node-cron** – Schedules regular uptime checks.

## License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for more information.

---

### Notes

OutWatch is designed to maintain up-to-date information, automatically deleting logs older than 7 days to keep data
relevant.

### *Disclaimer*:

- README.md written by ChatGPT based on code and user prompt.
