# Smart Diet Scanner

A comprehensive food label scanning application that analyzes ingredients and provides personalized health recommendations based on individual health conditions, allergies, and dietary preferences.

## Features

### 🔍 **Smart Label Scanning**
- **OCR Technology**: Uses Tesseract.js for accurate text extraction from food labels
- **Camera Integration**: Real-time camera scanning with overlay guidance
- **File Upload**: Support for image uploads (JPG, PNG, GIF)
- **Multi-format Support**: Works with various label layouts and orientations

### 🏥 **Personalized Health Analysis**
- **Health Condition Matching**: Analyzes ingredients against user's health conditions
- **Allergy Detection**: Identifies potential allergens and cross-contaminants
- **Dietary Preference Filtering**: Respects vegan, vegetarian, keto, and other dietary choices
- **Risk Assessment**: Categorizes ingredients by health impact (Low, Medium, High, Very High)

### 📊 **Comprehensive Insights**
- **Health Score**: Overall product health rating (0-100)
- **Warning System**: Color-coded alerts for problematic ingredients
- **Nutritional Analysis**: Detailed breakdown of nutritional components
- **Alternative Suggestions**: Healthier ingredient alternatives

### 👤 **User Management**
- **Secure Authentication**: JWT-based user authentication
- **Profile Management**: Customizable health conditions, allergies, and preferences
- **Scan History**: Track and review past analyses
- **Personalized Dashboard**: Overview of scanning activity and health trends

### 🎨 **Modern UI/UX**
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Intuitive Interface**: Clean, modern design with clear navigation
- **Real-time Feedback**: Instant analysis results with visual indicators
- **Accessibility**: Screen reader friendly and keyboard navigable

## Technology Stack

### Frontend
- **React 18**: Modern React with hooks and functional components
- **React Router**: Client-side routing
- **Tailwind CSS**: Utility-first CSS framework
- **Lucide React**: Beautiful, customizable icons
- **Axios**: HTTP client for API communication

### Backend
- **Node.js**: JavaScript runtime
- **Express.js**: Web application framework
- **SQLite**: Lightweight database for data persistence
- **Tesseract.js**: OCR engine for text extraction
- **Multer**: File upload handling
- **JWT**: Secure authentication
- **bcryptjs**: Password hashing

## Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn package manager
- Modern web browser with camera access

### Quick Start

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd smart-diet-scanner
   ```

2. **Install dependencies**
   ```bash
   npm run install-all
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your preferred settings
   ```

4. **Start the development servers**
   ```bash
   npm run dev
   ```

   This will start:
   - Backend server on `http://localhost:5000`
   - Frontend development server on `http://localhost:3000`

5. **Access the application**
   Open your browser and navigate to `http://localhost:3000`

### Manual Setup

If you prefer to set up the frontend and backend separately:

#### Backend Setup
```bash
cd server
npm install
npm run dev
```

#### Frontend Setup
```bash
cd client
npm install
npm start
```

## Usage Guide

### 1. **Account Creation**
- Click "Create Account" on the login page
- Fill in your username, email, and password
- Select your health conditions, allergies, and dietary preferences
- Click "Create Account" to register

### 2. **Profile Configuration**
- Navigate to the Profile page
- Update your health conditions, allergies, and dietary preferences
- Save changes to personalize your analysis

### 3. **Scanning Food Labels**
- Go to the Scanner page
- Choose between camera scanning or file upload
- For camera: Click "Use Camera" and position the label in the overlay
- For upload: Drag and drop an image or click to browse
- Click "Analyze Image" to process the label

### 4. **Understanding Results**
- **Health Score**: Overall rating from 0-100
- **Warnings**: Red alerts for ingredients that may affect your health
- **Recommendations**: Suggestions for healthier alternatives
- **Ingredients List**: All detected ingredients with analysis

### 5. **Review History**
- Visit the History page to see all your past scans
- Filter by health score or search for specific products
- Sort by date, score, or number of warnings

## API Endpoints

### Authentication
- `POST /api/register` - User registration
- `POST /api/login` - User login
- `GET /api/profile` - Get user profile
- `PUT /api/profile` - Update user profile

### Scanning
- `POST /api/scan` - Analyze food label image
- `GET /api/scan-history` - Get user's scan history

### Data
- `GET /api/ingredients` - Get ingredient database
- `GET /api/health` - Health check endpoint

## Database Schema

### Users Table
- `id`: Primary key
- `username`: Unique username
- `email`: Unique email address
- `password`: Hashed password
- `health_conditions`: JSON array of health conditions
- `allergies`: JSON array of allergies
- `dietary_preferences`: JSON array of dietary preferences
- `created_at`: Timestamp

### Ingredients Table
- `id`: Primary key
- `name`: Ingredient name
- `category`: Ingredient category
- `health_impact`: Health impact level
- `restrictions`: Comma-separated health restrictions
- `alternatives`: Suggested alternatives
- `nutritional_info`: JSON nutritional data

### Scan History Table
- `id`: Primary key
- `user_id`: Foreign key to users
- `product_name`: Name of scanned product
- `ingredients`: JSON array of detected ingredients
- `analysis_result`: JSON analysis results
- `scan_date`: Timestamp

## Health Condition Categories

### Supported Health Conditions
- Diabetes
- Hypertension
- Heart Disease
- High Cholesterol
- Obesity
- Metabolic Syndrome
- Cancer Risk
- Migraines

### Supported Allergies
- Nuts
- Dairy
- Eggs
- Soy
- Wheat
- Fish
- Shellfish
- Sesame
- Sulfites
- MSG

### Supported Dietary Preferences
- Vegan
- Vegetarian
- Keto
- Paleo
- Gluten-Free
- Dairy-Free
- Low Sodium
- Low Sugar

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Security Considerations

- All passwords are hashed using bcryptjs
- JWT tokens are used for authentication
- File uploads are validated and sanitized
- SQL injection protection through parameterized queries
- CORS is properly configured

## Performance Optimization

- Image compression before OCR processing
- Lazy loading of scan history
- Efficient database queries with proper indexing
- Responsive image handling
- Optimized bundle sizes

## Browser Compatibility

- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

## Troubleshooting

### Common Issues

1. **Camera not working**
   - Ensure browser has camera permissions
   - Try using HTTPS in production
   - Check if camera is being used by another application

2. **OCR accuracy issues**
   - Ensure good lighting when taking photos
   - Keep the label flat and in focus
   - Try different angles if text is unclear

3. **Database errors**
   - Check if SQLite database file has proper permissions
   - Ensure server has write access to the database directory

4. **Build errors**
   - Clear node_modules and reinstall dependencies
   - Check Node.js version compatibility
   - Ensure all environment variables are set

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, email support@smartdietscanner.com or create an issue in the repository.

## Roadmap

### Upcoming Features
- [ ] Barcode scanning integration
- [ ] Nutritional value comparison
- [ ] Meal planning integration
- [ ] Social sharing of healthy finds
- [ ] Advanced dietary tracking
- [ ] Multi-language support
- [ ] Offline mode
- [ ] Mobile app (React Native)

---

**Smart Diet Scanner** - Making informed food choices easier and healthier! 🥗✨