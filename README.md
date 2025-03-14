# ExPhil Exam Project

## Description
ExPhil Exam Project is a platform for taking exams to practice for Ex.Phil. It provides a user-friendly interface for students to prepare for their exams.

## Features
- User authentication.
- Exam taking functionality.
- Firebase integration for data storage.
- Responsive design.

## Installation

1. Clone the repository:
    ```sh
    git clone https://github.com/yourusername/ExPhilExamProject.git
    ```

2. Navigate to the project directory:
    ```sh
    cd ExPhilExamProject
    ```

3. Install the dependencies:
    ```sh
    npm install
    ```

4. Create a [.env] file in the root directory and add your Firebase configuration:
    ```env
    NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
    NEXT_PUBLIC_FIREBASE_DATABASE_URL=your_database_url
    NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
    NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
    ```

## Usage

1. Start the development server:
    ```sh
    npm run dev
    ```

2. Open your browser and navigate to `http://localhost:3000`.

## Project Structure

- [app]: Contains the main application components.
- [context]: Contains context providers for the application.
- [firebase]: Contains Firebase configuration and initialization.
- [public]: Contains public assets like images and icons.
- [ISSUE_TEMPLATE]: Contains issue templates for bug reports and feature requests.

