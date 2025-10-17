# Smart Diet Scanner

A comprehensive web application that helps users make informed food choices by scanning food labels and analyzing ingredients based on individual health conditions, allergies, and dietary preferences.

## 🌟 Features

### Core Functionality
- **Smart Food Label Scanning**: Upload images of food labels for instant ingredient analysis
- **Manual Ingredient Entry**: Enter ingredients manually when scanning isn't possible
- **Real-time Health Analysis**: Get immediate feedback on food safety based on your profile

### Health & Safety
- **Health Condition Support**: Built-in support for diabetes, hypertension, celiac disease, and lactose intolerance
- **Allergy Management**: Track and avoid allergens with critical alerts
- **Dietary Preference Matching**: Support for vegetarian, vegan, keto, and paleo diets
- **Personalized Risk Assessment**: Ingredients categorized as safe, warning, or dangerous

### Smart Recommendations
- **Health Scoring**: Products rated 0-100 based on your health profile
- **Alternative Suggestions**: Get healthier product recommendations
- **Nutritional Insights**: Detailed nutrition facts analysis
- **Personalized Advice**: Tailored recommendations based on your conditions

### User Experience
- **Intuitive Profile Management**: Easy setup and management of health conditions
- **Scan History**: Track all previously scanned products
- **Detailed Analysis**: Comprehensive ingredient breakdown and explanations
- **Mobile-Responsive Design**: Works seamlessly on all devices

## 🚀 Getting Started

### Prerequisites
- Node.js (version 16 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd smart-diet-scanner
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000` to use the application

### Building for Production

```bash
npm run build
npm run preview
```

## 📱 How to Use

### 1. Set Up Your Profile
- Navigate to the Profile page
- Add your health conditions (diabetes, hypertension, etc.)
- Select dietary preferences (vegetarian, vegan, keto, etc.)
- List any allergies you have

### 2. Scan Food Products
- Go to the Scanner page
- Upload a photo of the ingredients list, or
- Enter ingredients manually
- Get instant analysis results

### 3. Review Analysis
- View your health score (0-100)
- See which ingredients to avoid (red alerts)
- Check ingredients that need caution (yellow warnings)
- Review safe ingredients (green indicators)

### 4. Get Recommendations
- View detailed product analysis
- See healthier alternative suggestions
- Access nutritional insights
- Track your scanning history

## 🏗️ Technical Architecture

### Frontend Framework
- **React 18**: Modern React with hooks and context
- **React Router**: Client-side routing
- **Tailwind CSS**: Utility-first styling
- **Lucide React**: Beautiful icons

### State Management
- **React Context**: User profile and product data management
- **Local Storage**: Persistent data storage

### Core Services
- **Ingredient Analyzer**: Advanced ingredient analysis engine
- **Health Condition Matching**: Smart condition-based filtering
- **Recommendation Engine**: Personalized suggestion system

### Data Structure
```javascript
// User Profile
{
  id: string,
  name: string,
  healthConditions: string[],
  dietaryPreferences: string[],
  allergies: string[],
  customRestrictions: string[]
}

// Product Analysis
{
  id: string,
  name: string,
  ingredients: string[],
  analysis: {
    safe: string[],
    warnings: object[],
    dangerous: object[],
    score: number,
    recommendations: object[]
  },
  nutritionFacts: object,
  scannedAt: string
}
```

## 🔧 Configuration

### Health Conditions Supported
- **Diabetes**: Monitors sugar and carbohydrate content
- **Hypertension**: Tracks sodium and salt levels
- **Celiac Disease**: Identifies gluten-containing ingredients
- **Lactose Intolerance**: Detects dairy products

### Dietary Preferences
- **Vegetarian**: Excludes meat, poultry, and fish
- **Vegan**: Excludes all animal products
- **Ketogenic**: Identifies high-carb ingredients
- **Paleo**: Flags processed and grain-based ingredients

### Customization
The app can be easily extended with:
- Additional health conditions
- New dietary preferences
- Custom ingredient databases
- Enhanced OCR capabilities
- API integrations for product databases

## 🛠️ Development

### Project Structure
```
src/
├── components/          # Reusable UI components
├── contexts/           # React context providers
├── data/              # Static data and configurations
├── pages/             # Main application pages
├── services/          # Business logic and utilities
└── styles/            # CSS and styling files
```

### Key Components
- **Header**: Navigation and branding
- **Scanner**: Image upload and processing
- **Profile**: User preference management
- **ProductDetails**: Detailed analysis view
- **History**: Scan history management

### Services
- **IngredientAnalyzer**: Core analysis engine
- **UserContext**: User profile management
- **ProductContext**: Product data management

## 🔮 Future Enhancements

### Planned Features
- **Real OCR Integration**: Google Vision API or similar
- **Barcode Scanning**: UPC/EAN code recognition
- **Product Database**: Integration with food databases
- **Nutrition Tracking**: Calorie and macro tracking
- **Social Features**: Share safe products with friends
- **AI Recommendations**: Machine learning-based suggestions

### Technical Improvements
- **Offline Support**: PWA capabilities
- **Cloud Sync**: User data synchronization
- **Advanced Analytics**: Usage patterns and insights
- **Multi-language Support**: Internationalization
- **API Integration**: Third-party nutrition services

## 🤝 Contributing

We welcome contributions! Please see our contributing guidelines for:
- Code style and standards
- Testing requirements
- Pull request process
- Issue reporting

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support, please:
1. Check the documentation
2. Search existing issues
3. Create a new issue with detailed information
4. Contact the development team

## 🙏 Acknowledgments

- React team for the excellent framework
- Tailwind CSS for the utility-first approach
- Lucide for beautiful icons
- Open source community for inspiration and tools

---

**Smart Diet Scanner** - Making food choices safer and smarter for everyone! 🥗✨