# Task Management App

## Project Overview
The Task Management App is a simple and intuitive application that allows users to create, edit, and manage their tasks efficiently. The app provides functionalities for setting due dates, descriptions, and task statuses. It aims to help users stay organized and on top of their tasks.

## Setup Instructions
To set up the project locally, follow these steps:

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Rojalini18/Task-Management-App.git
   cd Task-Management-App
   ```

2. **Install dependencies:**
   Make sure you have [Node.js](https://nodejs.org/) installed. Then, run:
   ```bash
   npm install
   ```

3. **Run the application:**
   Start the development server with:
   ```bash
   npm start
   ```
   This command will start the application, and you can view it in your browser or simulator.

4. **Run on mobile devices:**
   - For **iOS**: Run `npx react-native run-ios`
   - For **Android**: Run `npx react-native run-android`

5. **Make sure to install required native dependencies (if any)** as mentioned in the documentation of each library used in the project.

## Features Implemented
- User can create new tasks with a title, description, and due date.
- Users can edit existing tasks.
- Validation for required fields (title, description, due date).
- Data Persistence: AsyncStorage is used to persist task data, ensuring that tasks remain available even after the app is closed. Tasks are stored in AsyncStorage whenever they are added, updated, or deleted.
- Sorting: Users can sort tasks by Due date, newest and oldest task to efficiently manage their task list.
- Filtering: Tasks can be filtered based on their completion status (completed or pending), helping users focus on what needs to be done.
- Search Functionality: Users can search for tasks by title or description, allowing them to quickly find specific tasks within the list.
- Notifications for task creation and updates using toast messages.
- Date selection using a date picker.
- A user-friendly interface with a responsive design.

## Technologies and Libraries Used
- **React Native**: For building the mobile application.
- **Context API**: For managing state across components.
- **React Navigation**: For navigating between screens.
- **uuid**: For generating unique identifiers for tasks.
- **react-native-date-picker**: For selecting due dates.
- **react-native-toast-message**: For displaying notifications.
- **Typescript**: As the primary programming language.

## Known Limitations
- Limited error handling and validation messages.
- No user authentication or account management features.

## Future Improvements
- Add user authentication to allow for personalized task management.
- Improve UI/UX for better user experience.
- Implement features like task categorization, reminders, and recurring tasks.
- Optimize performance for larger datasets.

## Contributing
Contributions are welcome! Please feel free to contact.

## Live Demo
You can test the application by visiting the following link:

[Live Demo](https://your-live-demo-link.com)
