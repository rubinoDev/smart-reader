# SmartReader

SmartReader is a web platform that allows users to manage personal reading libraries, track progress, write reviews, and rank books.

## Features

- **User Authentication**: Register, login, and logout using Firebase Authentication
- **Dashboard**: View summary of your reading activity
- **Book Management**: Add, edit, and remove books from your library
- **Book Status Tracking**: Mark books as "To Read", "In Progress", or "Read"
- **Book Rating**: Rate books on a scale of 1-5 stars
- **Reviews**: Write, edit, and delete reviews for books
- **Rankings**: View top-rated books and filter by author

## Tech Stack

- **Frontend**: React, TypeScript
- **UI Library**: Material UI, Tailwind CSS
- **State Management**: Zustand
- **Routing**: React Router
- **Backend/Database**: Firebase (Authentication, Firestore)
- **Hosting**: Vercel

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Firebase account

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/smart-reader.git
   cd smart-reader
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a Firebase project:
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Create a new project
   - Set up Authentication (Email/Password)
   - Set up Firestore Database

4. Configure environment variables:
   - Rename `.env.example` to `.env`
   - Fill in your Firebase configuration details

5. Start the development server:
   ```
   npm run dev
   ```

6. Open your browser and navigate to `http://localhost:5173`

## Project Structure

```
src/
├── components/       # Reusable UI components
├── context/          # Zustand stores
├── pages/            # Application pages
│   ├── Auth/         # Authentication pages
│   ├── Home.tsx      # Landing page
│   ├── Dashboard.tsx # User dashboard
│   ├── Books.tsx     # Book management
│   ├── BookDetails.tsx # Book details and reviews
│   └── Rankings.tsx  # Book rankings
├── services/         # Firebase services
├── types/            # TypeScript type definitions
├── utils/            # Utility functions
├── App.tsx           # Main application component
└── main.tsx          # Application entry point
```

## Deployment

To deploy the application to Vercel:

1. Push your code to a GitHub repository
2. Connect your repository to Vercel
3. Configure environment variables in Vercel
4. Deploy

## License

This project is licensed under the MIT License - see the LICENSE file for details.
