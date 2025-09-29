# Expense Manager Mobile App

A React Native mobile application for managing personal expenses with category-wise organization.

## Features

- ✅ **Dashboard**: Overview of total expenses and category breakdowns
- ✅ **Add Expenses**: Create new expense entries with title, amount, description, and category
- ✅ **Edit Expenses**: Modify existing expense details
- ✅ **Delete Expenses**: Remove unwanted expense entries
- ✅ **Category Filtering**: Filter expenses by predefined categories
- ✅ **Local Storage**: All data stored locally using AsyncStorage
- ✅ **Stack Navigation**: Smooth navigation between screens

## Categories

The app includes the following predefined expense categories:
- Food
- Transport
- Shopping
- Bills
- Entertainment
- Health
- Education
- Other

## Screens

1. **Dashboard Screen**: Shows total expenses, category summaries, quick actions, and recent expenses
2. **Expense List Screen**: Displays all expenses with filtering options and search by category
3. **Add Expense Screen**: Form to create new expense entries
4. **Edit Expense Screen**: Form to modify existing expenses with delete option

## Tech Stack

- **React Native** with Expo
- **React Navigation** (Stack Navigator)
- **AsyncStorage** for local data persistence
- **Expo CLI** for development and building

## Installation & Setup

1. **Prerequisites**:
   - Node.js (v14 or higher)
   - npm or yarn
   - Expo CLI (`npm install -g @expo/cli`)

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Start Development Server**:
   ```bash
   npx expo start
   ```

4. **Run on Device/Simulator**:
   - **Android**: `npx expo start --android`
   - **iOS**: `npx expo start --ios` (macOS only)
   - **Web**: `npx expo start --web`

## Usage

### Adding an Expense
1. Open the app and tap "Add New Expense" on the Dashboard
2. Fill in the expense details:
   - Title (required)
   - Amount (required)
   - Description (optional)
   - Category (required)
3. Tap "Save Expense"

### Viewing Expenses
1. From Dashboard, tap "View All Expenses" or tap on a category card
2. Use the filter button to filter by specific categories
3. Tap on any expense to edit it

### Editing/Deleting Expenses
1. Tap on an expense from the list
2. Modify the details and tap "Save Changes"
3. Or tap "Delete" to remove the expense

## Project Structure

```
src/
├── screens/
│   ├── DashboardScreen.js       # Main dashboard
│   ├── ExpenseListScreen.js     # List with filtering
│   ├── AddExpenseScreen.js      # Add new expense
│   └── EditExpenseScreen.js     # Edit existing expense
├── services/
│   └── StorageService.js        # AsyncStorage operations
├── types/
│   └── index.js                 # Categories and utilities
└── components/                  # (For future reusable components)
```

## Data Storage

The app uses AsyncStorage to persist data locally on the device. Data includes:
- Expense entries with ID, title, amount, description, category, and timestamps
- Auto-incrementing ID system for unique expense identification

## Development Notes

- All expenses are stored locally - no server required
- App works offline
- Data persists between app restarts
- Responsive design for different screen sizes
- Form validation for required fields

## Future Enhancements

- Export expenses to CSV/PDF
- Expense statistics and charts
- Budget tracking and alerts
- Backup/restore functionality
- Dark mode support
- Multiple currency support