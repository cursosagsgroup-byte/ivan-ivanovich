
# Ivan Ivanovich Mobile App

This is the React Native (Expo) mobile application for the Ivan Ivanovich academy.

## Prerequisites
- Node.js (v18+)
- Expo Go app on your phone (iOS/Android) OR Xcode/Android Studio simulators.

## Setup

1.  **Install dependencies:**
    ```bash
    npm install
    ```

2.  **Configure API:**
    - Open `src/config.js`.
    - If testing on iOS Simulator, `http://localhost:3000/api/mobile` is fine.
    - If testing on a PHYSICAL DEVICE, change `localhost` to your computer's local IP address (e.g., `http://192.168.1.5:3000/api/mobile`).

## Running the App

1.  **Start the Backend:**
    - Go to the root folder of the project (parent folder).
    - Run `npm run dev` to start the Next.js server.

2.  **Start the Mobile App:**
    - Inside this `mobile-app` folder, run:
    ```bash
    npx expo start
    ```
    - Scan the QR code with your phone or press `i` for iOS simulator.

## Features
- **Login:** Secure authentication using the same credentials as the web platform.
- **Dashboard:** View all enrolled courses and progress.
- **Course Detail:** Browse modules and lessons.
- **Video Player:** Watch course videos (Vimeo embedded) directly in the app.
