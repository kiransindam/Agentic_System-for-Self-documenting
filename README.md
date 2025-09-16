# Coding Documentation

`Coding Documentation` is an AI-powered developer tool built with Next.js and Genkit that helps you automatically generate, improve, and manage documentation for your code. Simply paste your code, and let the AI assist you in creating clear and comprehensive documentation.

## Features

- **AI-Powered Documentation Generation**: Instantly create documentation from your code.
- **Documentation Improvement**: Get AI-driven suggestions to enhance existing documentation.
- **Modern 3D UI**: A sleek, interactive user interface with 3D card effects.
- **File Upload & Code Pasting**: Easily input code by pasting it or uploading a file.
- **Markdown Export**: Download your generated documentation as a Markdown file.

## Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (with App Router)
- **AI Integration**: [Genkit (Google)](https://firebase.google.com/docs/genkit)
- **UI Components**: [ShadCN UI](https://ui.shadcn.com/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)

---

## Getting Started: End-to-End Local Setup

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### 1. Prerequisites

Before you begin, ensure you have the following installed on your system:

- **Node.js**: Version 18.x or later. You can download it from [nodejs.org](https://nodejs.org/).
- **npm (Node Package Manager)**: This is included with the Node.js installation.

### 2. Download the Project

First, download the project files. In a web-based IDE like Firebase Studio, you can typically find an **"Export to Zip"** or **"Download Project"** option in the file menu or explorer.

Once downloaded, unzip the project folder to your desired location.

### 3. Installation and Setup

1.  **Navigate to the Project Directory**:
    Open your terminal or command prompt and change your directory to the project's root folder.
    ```bash
    cd path/to/your/project-folder
    ```

2.  **Install Dependencies**:
    Run the following command to install all the necessary packages defined in `package.json`.
    ```bash
    npm install
    ```

3.  **Set Up Environment Variables**:
    The application uses the Gemini API for its AI features, which requires an API key.

    - Create a new file named `.env.local` in the root directory of your project.
    - Obtain a free API key from [Google AI Studio](https://aistudio.google.com/app/apikey).
    - Add the API key to your `.env.local` file as shown below:

    ```env
    GEMINI_API_KEY=your_api_key_here
    ```
    > **Note**: This file is included in `.gitignore` and should not be committed to your repository to keep your API key secure.

### 4. Running the Application

Now you are ready to run the application locally.

1.  **Start the Development Server**:
    Execute the following command to start the Next.js development server:
    ```bash
    npm run dev
    ```
    This command runs the app in development mode with Turbopack for faster performance.
2. **🔗 Live Demonstration**
   link : https://9000-firebase-studio-1758006815631.cluster-va5f6x3wzzh4stde63ddr3qgge.cloudworkstations.dev/
   
3.  **View the Application**:
    Open your web browser and navigate to the following address:
    [http://localhost:9002](http://localhost:9002)

You should now see the "Coding Documentation" application running on your local machine!

## Available Scripts

In the `package.json` file, you will find several scripts for managing the application:

- `npm run dev`: Starts the application in development mode.
- `npm run build`: Creates a production-ready build of the application.
- `npm start`: Starts the application in production mode (requires a build to be run first).
- `npm run lint`: Lints the project files to check for code quality and style issues.
- `npm run typecheck`: Runs the TypeScript compiler to check for type errors.

