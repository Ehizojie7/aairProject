# GitHub Repository Setup Guide

Follow these steps to create and push your AAIR Task Manager project to GitHub.

## 🚀 Quick Setup

### 1. Create a GitHub Repository

1. Go to [GitHub.com](https://github.com) and sign in to your account (@ehizojie7)
2. Click the "+" icon in the top right corner
3. Select "New repository"
4. Fill in the repository details:
   - **Repository name**: `aairProject` (or your preferred name)
   - **Description**: "A modern cross-platform task management app built with React Native and Expo"
   - **Visibility**: Choose Public or Private
   - **DO NOT** initialize with README, .gitignore, or license (we already have these)
5. Click "Create repository"

### 2. Push Your Code to GitHub

Open your terminal in the project directory and run these commands:

```bash
# Navigate to your project directory
cd /Users/user/Desktop/aair-project/aairProject

# Initialize git repository (if not already done)
git init

# Add all files to staging
git add .

# Commit your changes
git commit -m "Initial commit: AAIR Task Manager app with full functionality"

# Add your GitHub repository as the remote origin
# Replace 'ehizojie7' with your actual GitHub username if different
git remote add origin https://github.com/ehizojie7/aairProject.git

# Push to GitHub
git push -u origin main
```

### 3. Alternative: Using GitHub CLI (if installed)

If you have GitHub CLI installed, you can create and push in one step:

```bash
# Create repository and push (from project directory)
gh repo create aairProject --public --source=. --remote=origin --push
```

## 📋 Repository Checklist

Make sure your repository includes:

- ✅ **README.md** - Comprehensive project documentation
- ✅ **Source Code** - All app files and components
- ✅ **package.json** - Dependencies and scripts
- ✅ **app.json** - Expo configuration
- ✅ **.gitignore** - Excludes node_modules and build files
- ✅ **TypeScript Config** - tsconfig.json for type checking
- ✅ **ESLint Config** - Code quality configuration

## 🔗 Repository URL

After setup, your repository will be available at:
`https://github.com/ehizojie7/aairProject`

## 🎯 Next Steps

1. **Add Topics/Tags**: In your GitHub repo settings, add relevant topics like:
   - `react-native`
   - `expo`
   - `typescript`
   - `task-manager`
   - `mobile-app`
   - `cross-platform`

2. **Enable GitHub Pages** (optional): If you want to showcase the web version
   - Go to Settings → Pages
   - Select source branch
   - Your web app will be available at: `https://ehizojie7.github.io/aairProject`

3. **Add Repository Description**: Make sure the description clearly explains what the app does

4. **Star Your Own Repo**: Give it a star to show it's a featured project!

## 🛠️ Troubleshooting

### Authentication Issues
If you encounter authentication issues:

```bash
# Use personal access token instead of password
# Or configure SSH keys for easier access
git remote set-url origin git@github.com:ehizojie7/aairProject.git
```

### Branch Name Issues
If your default branch is `master` instead of `main`:

```bash
git branch -M main
git push -u origin main
```

### Large File Issues
If you get warnings about large files, they're likely in node_modules (which should be ignored):

```bash
# Make sure .gitignore includes node_modules
echo "node_modules/" >> .gitignore
git rm -r --cached node_modules
git commit -m "Remove node_modules from tracking"
```

---

**You're all set! Your AAIR Task Manager is now on GitHub! 🎉**
