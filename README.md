# EcoDrive - Sustainable Driving Companion

EcoDrive is a React.js application that helps users track their driving efficiency, analyze their driving patterns, and participate in an energy credit marketplace.

## Features

- User authentication with Firebase
- Real-time dashboard with driving statistics
- Detailed driving analysis and recommendations
- WattSwap marketplace for energy credits
- Responsive design with Tailwind CSS

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)
- Firebase account and project

## Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd eco-drive
```

2. Install dependencies:
```bash
npm install
```

3. Create a Firebase project and update the configuration:
   - Go to the Firebase Console
   - Create a new project
   - Enable Authentication and Firestore
   - Copy your Firebase configuration
   - Update the configuration in `src/config/firebase.ts`

4. Start the development server:
```bash
npm run dev
```

5. Open your browser and navigate to `http://localhost:5173`

## Project Structure

```
src/
├── components/     # Reusable UI components
├── pages/         # Page components
├── config/        # Configuration files
├── assets/        # Static assets
└── App.tsx        # Main application component
```

## Technologies Used

- React.js
- TypeScript
- Tailwind CSS
- Firebase (Authentication & Firestore)
- React Router
- Heroicons

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
