# AAIR Task Manager

A modern, cross-platform task management application built with React Native and Expo. Features a clean, intuitive interface with dark/light theme support and comprehensive task management capabilities.

## 📱 Features

### Core Functionality
- ✅ **Create Tasks**: Add tasks with titles, descriptions, and optional due dates
- 🎤 **Voice-to-Task**: Speak naturally to add multiple tasks at once with intelligent parsing
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

#### Traditional Method
1. Navigate to the **Add** tab
2. Enter a task title (required)
3. Optionally add a description
4. Set a due date if needed
5. Tap **Save Task**

#### Voice-to-Task Method
1. Navigate to the **Voice** tab or tap the microphone FAB
2. Tap the microphone button to start recording
3. Speak naturally, e.g., "Buy groceries and call mom"
4. The app will automatically parse and add multiple tasks
5. Review the results and add more if needed

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

## 🎤 Voice-to-Task Feature

### API Choice: Hybrid Speech Recognition

The Voice-to-Task feature uses a **hybrid approach** for speech-to-text conversion, automatically selecting the best API for each platform:

#### Web Platform: Web Speech API
- **Native Browser Support**: Available in modern browsers without additional dependencies
- **Real-time Processing**: Provides both interim and final results during speech recognition
- **Language Support**: Supports multiple languages and dialects
- **Cost-Effective**: No external API costs or rate limits
- **Privacy-Focused**: Speech processing happens locally in the browser

#### Mobile Platform: Smart Text Input
- **Intelligent Text Parsing**: Uses the same natural language processing as voice input
- **User-Friendly Interface**: Clean text input dialog with helpful examples
- **Same Functionality**: Identical task splitting and parsing capabilities
- **Seamless Experience**: Same results as voice input, just through typing

#### Advantages:
- **Universal Compatibility**: Works on web, iOS, and Android
- **Platform Optimization**: Uses the best speech recognition engine for each platform
- **Seamless Experience**: Same interface and functionality across all platforms
- **No External Dependencies**: No third-party API keys or subscriptions required

#### Current Limitations:
- **Network Dependency**: Requires internet connection for speech processing
- **Permission Requirements**: Mobile devices require microphone permissions

#### Future Enhancements:
- Offline speech recognition capabilities
- Custom wake word detection
- Multi-language support with automatic detection

### Natural Language Parsing Approach

The app implements an intelligent natural language parser (`utils/taskParser.ts`) that can split spoken sentences into multiple discrete tasks.

#### Parsing Strategy:

1. **Separator Detection**: Identifies common conjunctions and separators:
   - Coordinating conjunctions: "and", "then", "also", "plus"
   - Punctuation-based: commas, semicolons
   - Sequential indicators: "after that", "next", "afterwards"

2. **Context Analysis**: Determines whether text represents:
   - Multiple discrete tasks: "Buy groceries and call mom"
   - Single complex task: "Buy flowers for mom's birthday"
   - Sequential steps: "Go to store then buy milk"

3. **Action Verb Recognition**: Identifies task-starting action verbs:
   - Communication: call, email, text, message, send
   - Purchasing: buy, order, purchase, get, pick up
   - Scheduling: schedule, book, reserve, meet, attend
   - Productivity: write, read, finish, complete, review

4. **Confidence Scoring**: Each parsed task receives a confidence score (0-1) based on:
   - Separator strength and context
   - Presence of action verbs
   - Task structure validity
   - Overall parsing method reliability

#### Example Parsing Results:

```typescript
// Input: "Buy groceries and call mom"
// Output: 
[
  { title: "Buy groceries", confidence: 0.9 },
  { title: "Call mom", confidence: 0.9 }
]

// Input: "Send email to John, schedule meeting with Sarah, and finish the report"
// Output:
[
  { title: "Send email to John", confidence: 0.8 },
  { title: "Schedule meeting with Sarah", confidence: 0.8 },
  { title: "Finish the report", confidence: 0.8 }
]

// Input: "Buy flowers for mom's birthday"
// Output: (treated as single task)
[
  { title: "Buy flowers for mom's birthday", confidence: 0.9 }
]
```

#### Parsing Methods:
- `split-by-and`: Tasks separated by "and"
- `split-by-punctuation`: Tasks separated by commas/semicolons
- `split-by-then`: Sequential tasks with "then"
- `single-complex-task`: Complex single task detected
- `single-task-fallback`: Default single task treatment

This intelligent parsing ensures that users can speak naturally while the app correctly interprets their intent, whether they're dictating one complex task or multiple simple ones.



## 👤 Author

**ehizojie7**
- GitHub: [@ehizojie7](https://github.com/ehizojie7)

## 🙏 Acknowledgments

- Built with [Expo](https://expo.dev/)
- Icons from [SF Symbols](https://developer.apple.com/sf-symbols/)
- Inspired by modern task management principles

---

**Happy Task Managing! 🎉**