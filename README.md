# Smart Diet Scanner

A comprehensive React Native app that allows users to scan packaged food labels and analyze ingredients for personalized health recommendations.

## Features

### 🔍 **Smart Scanning**
- Camera-based food label scanning
- OCR text extraction from ingredient lists
- Image gallery import support
- Real-time ingredient analysis

### 🏥 **Health-Focused Analysis**
- Personalized recommendations based on health conditions
- Allergy detection and warnings
- Dietary preference compliance checking
- Nutritional scoring system

### 📊 **Comprehensive Insights**
- Detailed ingredient categorization
- Health impact assessment
- Nutritional information breakdown
- Safety level indicators

### 🎯 **Personalization**
- Custom health condition profiles
- Allergy management
- Dietary preference settings
- Scan history tracking

### 💡 **Smart Recommendations**
- Healthier product alternatives
- Ingredient substitution suggestions
- Personalized health tips
- Risk level assessments

## Health Conditions Supported

- **Diabetes** - Sugar and carbohydrate monitoring
- **Hypertension** - Sodium intake tracking
- **Heart Disease** - Trans fat and saturated fat detection
- **Celiac Disease** - Gluten-free compliance
- **Kidney Disease** - Protein, phosphorus, and potassium monitoring
- **IBS** - FODMAP and artificial additive detection

## Allergy Detection

- **Major Allergens**: Peanuts, tree nuts, milk, eggs, soy, wheat, fish, shellfish, sesame
- **Severity Levels**: Mild, moderate, severe, anaphylactic
- **Cross-contamination warnings**
- **Alternative ingredient suggestions**

## Dietary Preferences

- **Vegetarian** - No meat, poultry, or fish
- **Vegan** - No animal products
- **Halal** - Islamic dietary compliance
- **Kosher** - Jewish dietary compliance
- **Ketogenic** - Low-carb, high-fat diet
- **Paleo** - Ancient diet principles
- **Low Sodium** - Reduced sodium intake
- **Organic Only** - Organic ingredients preference

## Technology Stack

- **React Native** - Cross-platform mobile development
- **TypeScript** - Type-safe development
- **React Navigation** - Navigation management
- **React Native Paper** - Material Design components
- **React Native Vision Camera** - Camera functionality
- **AsyncStorage** - Local data persistence
- **React Native Vector Icons** - Icon library

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd smart-diet-scanner
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **iOS Setup** (if targeting iOS)
   ```bash
   cd ios && pod install && cd ..
   ```

4. **Android Setup**
   - Ensure Android SDK is installed
   - Create local.properties file with SDK path

5. **Run the app**
   ```bash
   # For Android
   npm run android
   
   # For iOS
   npm run ios
   ```

## Project Structure

```
src/
├── components/          # Reusable UI components
├── screens/            # Screen components
├── services/           # Business logic services
├── types/              # TypeScript type definitions
├── constants/          # App constants and data
├── utils/              # Utility functions
└── hooks/              # Custom React hooks
```

## Key Services

### **OCRService**
- Text extraction from food labels
- Ingredient parsing and categorization
- Nutritional information extraction

### **IngredientAnalyzer**
- Health impact assessment
- Personalized analysis based on user profile
- Safety level calculation
- Alternative product suggestions

### **StorageService**
- User profile management
- Scan history persistence
- Settings storage
- Data export/import functionality

## Usage

1. **Setup Profile**
   - Add your name and basic information
   - Select relevant health conditions
   - Configure allergy information
   - Set dietary preferences

2. **Scan Products**
   - Use camera to scan ingredient lists
   - Import images from gallery
   - Review extracted text accuracy

3. **Review Analysis**
   - Check overall safety rating
   - Review flagged ingredients
   - Read personalized recommendations
   - Explore healthier alternatives

4. **Track History**
   - View past scans
   - Filter by safety levels
   - Export data for records

## Safety Features

- **Critical Allergy Warnings** - Immediate alerts for dangerous ingredients
- **Severity-based Color Coding** - Visual safety indicators
- **Emergency Information** - Links to allergy resources
- **Offline Functionality** - Works without internet connection

## Privacy & Security

- **Local Data Storage** - All data stored on device
- **No Data Collection** - No personal information sent to servers
- **Secure Storage** - Encrypted local storage
- **Data Export** - User-controlled data portability

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## Health Disclaimer

This app provides general nutritional information and should not replace professional medical advice. Always consult with healthcare professionals for specific dietary needs and medical conditions.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, feature requests, or bug reports, please create an issue in the repository.

---

**Made with ❤️ for your health and wellbeing**