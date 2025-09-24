# CineMate Mobile App 🎬

A modern React Native movie discovery and recommendation app built with Expo. CineMate helps users discover amazing movies, get personalized recommendations, and keep track of their favorite films.

## Features ✨

- **Movie Discovery**: Browse trending, popular, and top-rated movies
- **Personalized Recommendations**: Get movie suggestions based on your favorite genres
- **User Authentication**: Secure signup/signin with JWT tokens
- **Genre Selection**: Choose your favorite movie genres for better recommendations
- **Movie Details**: View detailed information about movies including cast, ratings, and trailers
- **Responsive Design**: Beautiful UI with dark theme and smooth animations
- **Cross-platform**: Runs on iOS, Android, and web

## Tech Stack 🛠️

- **Frontend**: React Native with Expo
- **Language**: TypeScript
- **Styling**: NativeWind (Tailwind CSS for React Native)
- **Navigation**: Expo Router (file-based routing)
- **State Management**: React Context API
- **HTTP Client**: Axios with custom API hooks
- **Authentication**: JWT tokens with secure storage
- **Icons**: Expo Vector Icons (Feather)
- **Backend**: Django REST API (separate repository)

## Prerequisites 📋

- Node.js (v18 or higher)
- npm or yarn
- Expo CLI
- For iOS development: Xcode (macOS only)
- For Android development: Android Studio
- Django API server running (see API setup below)

## Installation 🚀

1. **Clone the repository**
   ```bash
   git clone https://github.com/codexoft-ke/cinemate-mobile-app.git
   cd cinemate-mobile-app/app
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure API endpoint**
   - Update the `BASE_URL` in `hooks/use-api.ts` to point to your Django API server
   - For local development: `http://192.168.11.143:8000` (replace with your local IP)
   - For production: Update to your production API URL

4. **Start the development server**

   ```bash
   npx expo start
   ```

## Development Setup 💻

### API Configuration

The app requires the CineMate Django API server to be running. Update the API base URL in `hooks/use-api.ts`:

```typescript
const BASE_URL = "http://192.168.11.143:8000"; // Replace with your API URL
```

### Running on Different Platforms

- **iOS Simulator**: Press `i` in the terminal or scan QR code with Camera app
- **Android Emulator**: Press `a` in the terminal or scan QR code with Expo Go
- **Physical Device**: Install Expo Go and scan the QR code
- **Web**: Press `w` in the terminal

## Project Structure 📁

```
app/
├── app/                    # Main application screens
│   ├── (app)/             # Protected app screens
│   │   ├── (tabs)/        # Tab navigation screens
│   │   └── movie/         # Movie detail screens
│   ├── auth/              # Authentication screens
│   └── _layout.tsx        # Root layout
├── components/            # Reusable UI components
│   ├── ui/               # Base UI components
│   └── movie-card/       # Movie-specific components
├── hooks/                # Custom React hooks
├── contexts/             # React Context providers
├── constants/            # App constants and configuration
├── types/               # TypeScript type definitions
├── utils/               # Utility functions
└── assets/              # Images, fonts, and other assets
```

## Key Features Implementation 🔧

### Authentication System
- JWT-based authentication with refresh tokens
- Secure token storage using Expo SecureStore
- Automatic token refresh on API calls
- Protected routes with authentication context

### Movie Data Integration
- Integration with The Movie Database (TMDb) API
- Caching with Redis for improved performance
- Genre-based movie filtering and recommendations
- Real-time movie data updates

### Error Handling
- Comprehensive error handling with validation
- Field-specific error messages for forms
- Network error recovery and retry logic
- User-friendly error notifications

## API Integration 🔗

The app communicates with a Django REST API that provides:
- User authentication and management
- Movie data from TMDb API
- Personalized recommendations
- User preferences and genre selection

### API Endpoints Used
- `POST /auth/signup` - User registration
- `POST /auth/signin` - User login  
- `POST /auth/refresh` - Token refresh
- `GET /movies/genres` - Movie genres
- `GET /movies/trending` - Trending movies
- `GET /movies/recommendations` - Personalized recommendations

## Environment Configuration 🌍

Create appropriate environment configurations for different stages:

- **Development**: Local API server with hot reloading
- **Staging**: Staging API server for testing
- **Production**: Production API server with optimizations

## Contributing 🤝

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Scripts 📜

- `npm start` - Start the Expo development server
- `npm run android` - Run on Android
- `npm run ios` - Run on iOS
- `npm run web` - Run on web
- `npm run reset-project` - Reset to blank project

## Troubleshooting 🔍

### Common Issues

1. **Network Error**: Ensure Django API server is running and accessible
2. **CORS Issues**: Check API server CORS configuration
3. **Metro bundler issues**: Clear cache with `npx expo start --clear`
4. **iOS build issues**: Clean Xcode build folder
5. **Android build issues**: Clean and rebuild in Android Studio

### API Connection Issues
- Verify API server is running on correct port
- Check firewall settings for network access
- Ensure CORS is properly configured on backend
- Verify JWT token handling is working correctly

## License 📄

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support 💬

For support and questions:
- Create an issue in this repository
- Contact: [your-email@example.com]
- Discord: [Your Discord Community Link]

## Acknowledgments 🙏

- [The Movie Database (TMDb)](https://www.themoviedb.org/) for movie data
- [Expo](https://expo.dev/) for the amazing development platform
- [React Native](https://reactnative.dev/) community
- All contributors who helped build this project

---

**Happy Movie Discovering! 🍿**
