# Typetastic - A Next.js Typing Tutor

Typetastic is a modern and interactive typing tutor application built with Next.js. It aims to help users improve their typing speed and accuracy through engaging practice sessions and a competitive leaderboard.

## Features

*   **Typing Practice:** Interactive typing exercises to improve speed and accuracy.
*   **Real-time Feedback:** Instant feedback on WPM (Words Per Minute) and accuracy.
*   **Leaderboard:** Track and compare your typing performance with other users.
*   **User Settings:** Customize practice settings and themes.
*   **Responsive Design:** Optimized for various screen sizes.

## Technologies Used

*   **Next.js:** React framework for building fast web applications.
*   **React:** JavaScript library for building user interfaces.
*   **TypeScript:** Type-safe JavaScript.
*   **Tailwind CSS:** A utility-first CSS framework for rapid UI development.
*   **Firebase (Optional):** For authentication and database (if you choose to enable it).

## Getting Started

Follow these steps to set up and run the project locally.

### Prerequisites

*   Node.js (v18 or later)
*   npm or Yarn

### Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/iqra-riyaz/typetastic.git
    cd typetastic
    ```
2.  Install dependencies:
    ```bash
    npm install
    # or yarn install
    ```

### Running the Development Server

1.  Start the development server:
    ```bash
    npm run dev
    # or yarn dev
    ```
2.  Open your browser and visit `http://localhost:3000`.

## Deployment

This project can be easily deployed to Netlify.

### Netlify Configuration

*   **Build command:** `npm run build`
*   **Publish directory:** `.next/`
*   **Base directory:** (Leave empty or specify `.`)
*   **Environment Variables:** If you enable Firebase or other services requiring API keys, add them in Netlify's site settings (e.g., `NEXT_PUBLIC_FIREBASE_API_KEY`, `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`, etc.).

### Troubleshooting Netlify "Page Not Found"

If you encounter a "Page not found" error after deploying to Netlify, ensure that a `public/_redirects` file exists with the following content to enable client-side routing:

```
/*    /index.html 200
```

## Usage

Once the application is running, you can:

*   Navigate to the `/practice` page to start a typing test.
*   Check the `/leaderboard` to see top scores.
*   Adjust settings on the `/settings` page.
