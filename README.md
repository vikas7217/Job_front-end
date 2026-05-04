# Job Portal Frontend

A modern job portal application built with React, TypeScript, and Tailwind CSS, featuring a mandatory onboarding flow with NOC selection and resume upload requirements.

## Features

- Modern, responsive UI with Tailwind CSS
- Type-safe development with TypeScript
- Form handling with Formik and Yup validation
- Toast notifications with react-hot-toast
- Routing with React Router v6
- Component-based architecture
- **Mandatory Onboarding Flow** with NOC selection and resume upload
- **Smart Authentication** with automatic redirection based on completion status
- **Protected Routes** ensuring users complete all onboarding steps
- **Modular Onboarding Logic** for easy extension

## 🔄 Onboarding Flow

The application enforces a mandatory onboarding process:

1. **Authentication**: Sign up/Sign in
2. **NOC Selection** (Required): Must select a National Occupational Classification code
3. **Resume Upload** (Required): Must upload resume or create from scratch
4. **Dashboard Access**: Only available after completing all steps

### No Skip Options
- Users cannot skip NOC selection
- Users cannot skip resume upload
- Dashboard is only accessible after completing both steps

## Getting Started

### Prerequisites

- Node.js 16.x or later
- npm 7.x or later

### Installation

1. Clone the repository
2. Navigate to the frontend directory:
   ```bash
   cd jobportal/fe
   ```
3. Install dependencies:
   ```bash
   npm install
   ```

### Development

To start the development server:

```bash
npm start
```

The application will be available at [http://localhost:3000](http://localhost:3000).

### Building for Production

To create a production build:

```bash
npm run build
```

The build artifacts will be stored in the `build/` directory.

## Project Structure

```
src/
├── components/        # Reusable components
│   ├── Auth/         # Authentication components
│   │   ├── SignIn.tsx       # Updated with onboarding logic
│   │   ├── SignUp.tsx       # User registration
│   │   └── ProtectedRoute.tsx # Route protection with onboarding checks
│   ├── layouts/      # Layout components
│   └── shared/       # Shared/common components
├── pages/            # Page components
│   ├── SelectNOC.tsx        # Mandatory NOC selection (no skip)
│   ├── UploadResume.tsx     # Mandatory resume upload (no skip)
│   ├── dashboard/           # Dashboard (protected)
│   └── ...
├── services/         # API services
│   └── api.ts              # Updated with onboarding endpoints
├── utils/            # Utility functions
│   └── onboarding.ts       # Onboarding logic and flow management
└── App.tsx           # Main application component
```

## 🔐 Authentication & Onboarding

### Onboarding Utils (`utils/onboarding.ts`)

The onboarding system is built around modular utility functions:

```typescript
// Core interfaces
interface UserData {
  id: string;
  fullName: string;
  email: string;
  role: string;
  nocSelected: boolean;
  resumeUploaded: boolean;
  nocCode?: string;
  resumeUrl?: string;
}

// Main functions
getNextOnboardingStep(user: UserData): string
isOnboardingComplete(user: UserData): boolean
getOnboardingProgress(user: UserData): number
```

### Protected Routes

The `ProtectedRoute` component now includes onboarding checks:

```tsx
<ProtectedRoute requiresOnboarding={true}>
  <Dashboard />
</ProtectedRoute>
```

### Automatic Redirects

Users are automatically redirected based on their completion status:
- Not authenticated → `/signin`
- NOC not selected → `/select-noc`
- Resume not uploaded → `/upload-resume`
- All complete → `/dashboard`

## 📄 Key Components

### SignIn Component
- Updated to handle user data from backend response
- Uses `getNextOnboardingStep()` for smart redirects
- Stores user data in localStorage for persistence

### SelectNOC Page
- **Mandatory completion**: No skip button
- Live search with NOC code validation
- Backend integration to save selection
- Automatic redirect to next step

### UploadResume Page
- **Mandatory completion**: No skip button
- Drag-and-drop file upload
- File validation (PDF/Word, 2MB limit)
- Backend integration to track upload status
- "Create from Scratch" option

### ProtectedRoute Component
- JWT authentication check
- Onboarding completion verification
- Smart redirection to incomplete steps
- Graceful error handling

## 🛠️ API Integration

### Authentication API
```typescript
authAPI.signin(credentials) // Returns user data with onboarding status
```

### User/Onboarding API
```typescript
userAPI.updateNOCSelection(nocCode)      // Mark NOC as selected
userAPI.updateResumeUpload(resumeUrl)    // Mark resume as uploaded
userAPI.getOnboardingStatus()            // Get current status
```

### Response Format
```json
{
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "fullName": "John Doe",
    "email": "john@example.com",
    "role": "applicant",
    "nocSelected": false,
    "resumeUploaded": false,
    "nocCode": null,
    "resumeUrl": null
  }
}
```

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the root directory:

```env
REACT_APP_API_URL=http://localhost:3001/api
```

### Extending Onboarding Steps

To add new mandatory steps:

1. **Update User Interface**: Add new fields to `UserData` interface
2. **Update Logic**: Modify `getNextOnboardingStep()` in `utils/onboarding.ts`
3. **Create Component**: Build new page/component for the step
4. **Add Route**: Include new route with `ProtectedRoute` wrapper
5. **Backend Integration**: Add corresponding API endpoints

Example:
```typescript
// utils/onboarding.ts
export const getNextOnboardingStep = (user: UserData): string => {
  if (!user.nocSelected) return '/select-noc';
  if (!user.resumeUploaded) return '/upload-resume';
  if (!user.profileCompleted) return '/complete-profile'; // New step
  return '/dashboard';
};
```

## 🎨 UI/UX Features

### Toast Notifications
- Success/error feedback for all actions
- Loading states during API calls
- User-friendly error messages

### Loading States
- Spinner indicators during NOC selection
- Upload progress for resume files
- Disabled states during processing

### Responsive Design
- Mobile-first approach
- Tailwind CSS utility classes
- Consistent design system

### Animations
- Smooth transitions between steps
- Fade-in effects for search results
- Hover animations on interactive elements

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm test -- --coverage

# Run tests in watch mode
npm test -- --watch
```

## 🚀 Production Deployment

### Build Optimization
```bash
npm run build
```

### Environment Considerations
- Update `REACT_APP_API_URL` for production
- Ensure backend API is accessible
- Configure proper CORS settings
- Test onboarding flow end-to-end

## 🔍 Debugging

### Common Issues

1. **User stuck in redirect loop**: Check localStorage for corrupted user data
2. **Onboarding not working**: Verify JWT token and API connectivity
3. **Skip buttons appearing**: Ensure you're using updated components

### Development Tools
- React Developer Tools
- Redux DevTools (if using Redux)
- Browser localStorage inspection
- Network tab for API calls

## 📚 Tech Stack

- **React 18**: Modern React with hooks
- **TypeScript**: Type-safe development
- **React Router v6**: Client-side routing with protection
- **Tailwind CSS**: Utility-first CSS framework
- **Formik + Yup**: Form handling and validation
- **React Hot Toast**: User notifications
- **Axios**: HTTP client for API calls

## 🔒 Security Considerations

- **JWT Storage**: Tokens stored in localStorage (consider httpOnly cookies for production)
- **Route Protection**: All sensitive routes protected with authentication checks
- **Input Validation**: Client-side validation with server-side verification
- **XSS Prevention**: Sanitized user inputs
- **CORS**: Proper configuration for cross-origin requests

## Contributing

1. Create a feature branch
2. Commit your changes
3. Test onboarding flow thoroughly
4. Ensure no skip options are present
5. Push to the branch
6. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
