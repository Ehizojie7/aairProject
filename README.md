# AAIR Task Manager

A modern, cross-platform task management application built with React Native and Expo. Features a clean, intuitive interface with dark/light theme support and comprehensive task management capabilities.

## 📱 Features

### Core Functionality
- ✅ **Create Tasks**: Add tasks with titles, descriptions, and optional due dates
- ✅ **Task Management**: Mark tasks as complete/incomplete, delete individual tasks
- 🔍 **Search & Filter**: Search tasks by title/description, filter by status (all/active/completed)
- 📊 **Sorting**: Sort tasks by creation date, due date, or alphabetically
- 📅 **Due Date Tracking**: Visual indicators for overdue tasks
- 🗑️ **Bulk Operations**: Clear all tasks with confirmation

### User Experience
- 🌗 **Theme Support**: Toggle between light and dark themes with system preference detection
- 💾 **Persistent Storage**: Tasks automatically save to device storage
- 📱 **Cross-Platform**: Runs on iOS, Android, and Web
- ⌨️ **Keyboard Shortcuts**: Quick task creation with return key
- 🎨 **Modern UI**: Clean, accessible interface with smooth animations

### Technical Features
- 🏗️ **TypeScript**: Full type safety throughout the application
- 🧭 **File-based Routing**: Expo Router for navigation
- 📦 **Context API**: State management with React Context
- 🔄 **Real-time Updates**: Instant UI updates with optimistic rendering
- 📱 **Responsive Design**: Adapts to different screen sizes

## 🚀 Getting Started

### Prerequisites

Before running this project, make sure you have the following installed:

- **Node.js** (version 18 or higher) - [Download here](https://nodejs.org/)
- **npm** or **yarn** package manager
- **Expo CLI** (optional but recommended)
- For mobile development:
  - **Expo Go** app on your phone ([iOS](https://apps.apple.com/app/expo-go/id982107779) | [Android](https://play.google.com/store/apps/details?id=host.exp.exponent))
  - Or **Android Studio** / **Xcode** for emulators

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/ehizojie7/aairProject.git
   cd aairProject
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm start
   ```

### Running the App

After starting the development server, you'll see a QR code in your terminal. You can run the app in several ways:

#### 📱 On Your Phone
- Install the **Expo Go** app from your app store
- Scan the QR code with your phone's camera (iOS) or the Expo Go app (Android)

#### 💻 On Your Computer
- Press `w` to open in web browser
- Press `i` to open iOS simulator (requires Xcode on macOS)
- Press `a` to open Android emulator (requires Android Studio)

#### Alternative Commands
```bash
# Run on specific platforms
npm run ios       # iOS simulator
npm run android   # Android emulator  
npm run web       # Web browser

# Other useful commands
npm run lint      # Run ESLint
npm run reset-project  # Reset to template state
```

## 🏗️ Project Structure

```
aairProject/
├── app/                    # App screens (file-based routing)
│   ├── (tabs)/
│   │   ├── _layout.tsx    # Tab navigation layout
│   │   ├── index.tsx      # Home screen (task list)
│   │   └── add.tsx        # Add task screen
│   ├── _layout.tsx        # Root layout
│   └── +not-found.tsx     # 404 screen
├── components/             # Reusable UI components
│   ├── ui/                # Platform-specific components
│   ├── ThemedText.tsx     # Themed text component
│   └── ThemedView.tsx     # Themed view component
├── contexts/              # React Context providers
│   ├── TasksProvider.tsx  # Task state management
│   └── ThemePreferenceProvider.tsx  # Theme management
├── hooks/                 # Custom React hooks
│   ├── useTasks.ts       # Task operations hook
│   ├── useThemePreference.ts  # Theme preference hook
│   └── useColorScheme.ts  # Color scheme detection
├── constants/             # App constants
│   └── Colors.ts         # Color definitions
└── assets/               # Static assets (images, fonts)
```

## 🎯 Usage

### Creating Tasks
1. Navigate to the **Add** tab
2. Enter a task title (required)
3. Optionally add a description
4. Set a due date if needed
5. Tap **Save Task**

### Managing Tasks
- **Complete/Uncomplete**: Tap the checkbox next to any task
- **Delete**: Tap the "Delete" button on individual tasks
- **Search**: Use the search bar to find specific tasks
- **Filter**: Toggle between All, Active, and Completed tasks
- **Sort**: Cycle through sorting options (Date, Due Date, A-Z)
- **Clear All**: Remove all tasks with confirmation

### Theme Switching
- Tap the sun/moon icon in the top-right corner to toggle themes
- The app remembers your preference and respects system settings

## 🛠️ Development

### Tech Stack
- **React Native** - Cross-platform mobile framework
- **Expo** - Development platform and tools
- **TypeScript** - Type-safe JavaScript
- **Expo Router** - File-based navigation
- **AsyncStorage** - Local data persistence
- **React Navigation** - Navigation library

### Key Dependencies
- `@react-native-async-storage/async-storage` - Local storage
- `@react-native-community/datetimepicker` - Date picker
- `expo-router` - File-based routing
- `react-native-reanimated` - Animations

### Code Quality
- **ESLint** configuration for code linting
- **TypeScript** for type safety
- **Consistent** file structure and naming
- **React hooks** for state management

## 📱 Screenshots

*Screenshots would be added here showing the app in light/dark themes, task list, add task screen, etc.*

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 👤 Author

**ehizojie7**
- GitHub: [@ehizojie7](https://github.com/ehizojie7)

## 🙏 Acknowledgments

- Built with [Expo](https://expo.dev/)
- Icons from [SF Symbols](https://developer.apple.com/sf-symbols/)
- Inspired by modern task management principles

---

**Happy Task Managing! 🎉**