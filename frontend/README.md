# Aurora Voyages Frontend

This is the frontend for the Aurora Voyages application, a travel companion app for Pakistani adventurers.

## Features

- User authentication (register, login, logout)
- Tour guide registration
- Tour guide package submission
- Admin approval/rejection of packages
- Responsive design with Tailwind CSS

## Project Structure

- `src/components`: Reusable UI components
  - `layout`: Layout components like Navbar and Footer
  - `routing`: Route protection components
- `src/context`: React context for state management
- `src/pages`: Page components
  - `admin`: Admin-specific pages
  - `tourGuide`: Tour guide-specific pages
- `src/utils`: Utility functions and configurations

## Tour Guide Package Submission Flow

1. User registers as a tour guide
2. Tour guide submits a vacation package
3. Admin reviews the package
4. Admin approves or rejects the package
5. If approved, the package is displayed to users
6. If rejected, the tour guide can edit and resubmit

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository
2. Navigate to the frontend directory
3. Install dependencies:
   ```
   npm install
   ```
4. Start the development server:
   ```
   npm start
   ```

### Environment Variables

Create a `.env` file in the frontend directory with the following variables:

```
REACT_APP_API_URL=http://localhost:5000/api
```

## API Integration

The frontend communicates with the backend API using Axios. The API utility is configured in `src/utils/api.js`.

## Authentication

Authentication is handled using JWT tokens. The token is stored in localStorage and included in API requests using an Axios interceptor.

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

### `npm test`

Launches the test runner in the interactive watch mode.

### `npm run build`

Builds the app for production to the `build` folder.

## Technologies Used

- React
- React Router
- Tailwind CSS
- Axios
- Headless UI
- Heroicons
