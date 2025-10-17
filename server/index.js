const express = require('express');
const cors = require('cors');
const multer = require('multer');
const Tesseract = require('tesseract.js');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('uploads'));

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

// Initialize SQLite database
const db = new sqlite3.Database('./diet_scanner.db');

// Create tables
db.serialize(() => {
  // Users table
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE,
    email TEXT UNIQUE,
    password TEXT,
    health_conditions TEXT,
    allergies TEXT,
    dietary_preferences TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // Ingredients database
  db.run(`CREATE TABLE IF NOT EXISTS ingredients (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE,
    category TEXT,
    health_impact TEXT,
    restrictions TEXT,
    alternatives TEXT,
    nutritional_info TEXT
  )`);

  // Scan history
  db.run(`CREATE TABLE IF NOT EXISTS scan_history (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    product_name TEXT,
    ingredients TEXT,
    analysis_result TEXT,
    scan_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id)
  )`);
});

// Initialize ingredient database with sample data
const initializeIngredients = () => {
  const ingredients = [
    {
      name: 'High Fructose Corn Syrup',
      category: 'Sweetener',
      health_impact: 'High',
      restrictions: 'diabetes,obesity,metabolic_syndrome',
      alternatives: 'Honey, Maple Syrup, Stevia',
      nutritional_info: '{"calories": 4, "sugar": 4, "fiber": 0}'
    },
    {
      name: 'Trans Fat',
      category: 'Fat',
      health_impact: 'Very High',
      restrictions: 'heart_disease,high_cholesterol,diabetes',
      alternatives: 'Olive Oil, Avocado Oil, Coconut Oil',
      nutritional_info: '{"calories": 9, "saturated_fat": 9, "trans_fat": 1}'
    },
    {
      name: 'Sodium Nitrite',
      category: 'Preservative',
      health_impact: 'High',
      restrictions: 'cancer_risk,hypertension',
      alternatives: 'Celery Powder, Sea Salt',
      nutritional_info: '{"sodium": 1000, "nitrites": 1}'
    },
    {
      name: 'Artificial Colors',
      category: 'Additive',
      health_impact: 'Medium',
      restrictions: 'adhd,allergies',
      alternatives: 'Natural Food Colors, Beet Juice',
      nutritional_info: '{"artificial": true}'
    },
    {
      name: 'Monosodium Glutamate',
      category: 'Flavor Enhancer',
      health_impact: 'Medium',
      restrictions: 'migraines,allergies',
      alternatives: 'Sea Salt, Nutritional Yeast',
      nutritional_info: '{"sodium": 600, "msg": 1}'
    },
    {
      name: 'Sodium Benzoate',
      category: 'Preservative',
      health_impact: 'Low',
      restrictions: 'asthma,allergies',
      alternatives: 'Vitamin E, Rosemary Extract',
      nutritional_info: '{"sodium": 200, "preservative": true}'
    }
  ];

  ingredients.forEach(ingredient => {
    db.run(`INSERT OR IGNORE INTO ingredients (name, category, health_impact, restrictions, alternatives, nutritional_info) 
            VALUES (?, ?, ?, ?, ?, ?)`,
      [ingredient.name, ingredient.category, ingredient.health_impact, 
       ingredient.restrictions, ingredient.alternatives, ingredient.nutritional_info]);
  });
};

initializeIngredients();

// Authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret', (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    req.user = user;
    next();
  });
};

// Routes

// User registration
app.post('/api/register', async (req, res) => {
  try {
    const { username, email, password, health_conditions, allergies, dietary_preferences } = req.body;
    
    const hashedPassword = await bcrypt.hash(password, 10);
    
    db.run(`INSERT INTO users (username, email, password, health_conditions, allergies, dietary_preferences) 
            VALUES (?, ?, ?, ?, ?, ?)`,
      [username, email, hashedPassword, 
       JSON.stringify(health_conditions || []), 
       JSON.stringify(allergies || []), 
       JSON.stringify(dietary_preferences || [])],
      function(err) {
        if (err) {
          return res.status(400).json({ error: 'User already exists' });
        }
        
        const token = jwt.sign({ id: this.lastID, username }, process.env.JWT_SECRET || 'fallback_secret');
        res.json({ token, user: { id: this.lastID, username, email } });
      });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// User login
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  
  db.get(`SELECT * FROM users WHERE username = ?`, [username], async (err, user) => {
    if (err) return res.status(500).json({ error: 'Server error' });
    if (!user) return res.status(400).json({ error: 'Invalid credentials' });
    
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(400).json({ error: 'Invalid credentials' });
    
    const token = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET || 'fallback_secret');
    res.json({ 
      token, 
      user: { 
        id: user.id, 
        username: user.username, 
        email: user.email,
        health_conditions: JSON.parse(user.health_conditions || '[]'),
        allergies: JSON.parse(user.allergies || '[]'),
        dietary_preferences: JSON.parse(user.dietary_preferences || '[]')
      } 
    });
  });
});

// Get user profile
app.get('/api/profile', authenticateToken, (req, res) => {
  db.get(`SELECT * FROM users WHERE id = ?`, [req.user.id], (err, user) => {
    if (err) return res.status(500).json({ error: 'Server error' });
    if (!user) return res.status(404).json({ error: 'User not found' });
    
    res.json({
      id: user.id,
      username: user.username,
      email: user.email,
      health_conditions: JSON.parse(user.health_conditions || '[]'),
      allergies: JSON.parse(user.allergies || '[]'),
      dietary_preferences: JSON.parse(user.dietary_preferences || '[]')
    });
  });
});

// Update user profile
app.put('/api/profile', authenticateToken, (req, res) => {
  const { health_conditions, allergies, dietary_preferences } = req.body;
  
  db.run(`UPDATE users SET health_conditions = ?, allergies = ?, dietary_preferences = ? WHERE id = ?`,
    [JSON.stringify(health_conditions || []), 
     JSON.stringify(allergies || []), 
     JSON.stringify(dietary_preferences || []), 
     req.user.id],
    function(err) {
      if (err) return res.status(500).json({ error: 'Server error' });
      res.json({ message: 'Profile updated successfully' });
    });
});

// Scan food label
app.post('/api/scan', authenticateToken, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image uploaded' });
    }

    // Perform OCR on the uploaded image
    const { data: { text } } = await Tesseract.recognize(req.file.path, 'eng');
    
    // Extract ingredients from the text
    const ingredients = extractIngredients(text);
    
    // Analyze ingredients against user's health profile
    const analysis = await analyzeIngredients(ingredients, req.user.id);
    
    // Save scan to history
    db.run(`INSERT INTO scan_history (user_id, product_name, ingredients, analysis_result) 
            VALUES (?, ?, ?, ?)`,
      [req.user.id, analysis.product_name || 'Unknown Product', 
       JSON.stringify(ingredients), JSON.stringify(analysis)],
      function(err) {
        if (err) console.error('Error saving scan history:', err);
      });

    res.json(analysis);
  } catch (error) {
    console.error('Scan error:', error);
    res.status(500).json({ error: 'Failed to process image' });
  }
});

// Get scan history
app.get('/api/scan-history', authenticateToken, (req, res) => {
  db.all(`SELECT * FROM scan_history WHERE user_id = ? ORDER BY scan_date DESC LIMIT 20`,
    [req.user.id], (err, rows) => {
      if (err) return res.status(500).json({ error: 'Server error' });
      
      const history = rows.map(row => ({
        id: row.id,
        product_name: row.product_name,
        ingredients: JSON.parse(row.ingredients),
        analysis_result: JSON.parse(row.analysis_result),
        scan_date: row.scan_date
      }));
      
      res.json(history);
    });
});

// Helper function to extract ingredients from OCR text
function extractIngredients(text) {
  const ingredientKeywords = [
    'ingredients', 'contains', 'may contain', 'allergens', 'ingredient list'
  ];
  
  let ingredientText = text.toLowerCase();
  
  // Find the ingredients section
  for (const keyword of ingredientKeywords) {
    const index = ingredientText.indexOf(keyword);
    if (index !== -1) {
      ingredientText = ingredientText.substring(index);
      break;
    }
  }
  
  // Extract individual ingredients (simplified approach)
  const ingredients = ingredientText
    .split(/[,;]/)
    .map(ingredient => ingredient.trim())
    .filter(ingredient => ingredient.length > 2)
    .slice(0, 20); // Limit to first 20 ingredients
  
  return ingredients;
}

// Helper function to analyze ingredients
async function analyzeIngredients(ingredients, userId) {
  return new Promise((resolve, reject) => {
    // Get user's health profile
    db.get(`SELECT * FROM users WHERE id = ?`, [userId], (err, user) => {
      if (err) return reject(err);
      
      const userHealthConditions = JSON.parse(user.health_conditions || '[]');
      const userAllergies = JSON.parse(user.allergies || '[]');
      const userDietaryPreferences = JSON.parse(user.dietary_preferences || '[]');
      
      // Get ingredient data from database
      db.all(`SELECT * FROM ingredients`, (err, ingredientData) => {
        if (err) return reject(err);
        
        const analysis = {
          product_name: ingredients[0] || 'Unknown Product',
          ingredients: ingredients,
          warnings: [],
          recommendations: [],
          nutritional_insights: {},
          alternatives: [],
          overall_health_score: 100
        };
        
        let healthScore = 100;
        
        // Analyze each ingredient
        ingredients.forEach(ingredient => {
          const foundIngredient = ingredientData.find(item => 
            ingredient.toLowerCase().includes(item.name.toLowerCase())
          );
          
          if (foundIngredient) {
            const restrictions = foundIngredient.restrictions.split(',');
            
            // Check against user's health conditions
            userHealthConditions.forEach(condition => {
              if (restrictions.includes(condition)) {
                analysis.warnings.push({
                  type: 'health_condition',
                  ingredient: foundIngredient.name,
                  condition: condition,
                  severity: foundIngredient.health_impact,
                  message: `${foundIngredient.name} may not be suitable for ${condition}`
                });
                healthScore -= 20;
              }
            });
            
            // Check against user's allergies
            userAllergies.forEach(allergy => {
              if (restrictions.includes(allergy)) {
                analysis.warnings.push({
                  type: 'allergy',
                  ingredient: foundIngredient.name,
                  allergy: allergy,
                  severity: 'high',
                  message: `WARNING: ${foundIngredient.name} may contain ${allergy} allergens`
                });
                healthScore -= 30;
              }
            });
            
            // Add alternatives
            if (foundIngredient.alternatives) {
              analysis.alternatives.push({
                ingredient: foundIngredient.name,
                alternatives: foundIngredient.alternatives.split(', ')
              });
            }
            
            // Add nutritional insights
            if (foundIngredient.nutritional_info) {
              const nutritionalInfo = JSON.parse(foundIngredient.nutritional_info);
              Object.assign(analysis.nutritional_insights, nutritionalInfo);
            }
          }
        });
        
        // Generate recommendations
        if (analysis.warnings.length > 0) {
          analysis.recommendations.push('Consider looking for products with fewer processed ingredients');
          analysis.recommendations.push('Check for organic or natural alternatives');
        }
        
        if (userDietaryPreferences.includes('vegan') && 
            ingredients.some(ing => ing.toLowerCase().includes('milk') || ing.toLowerCase().includes('egg'))) {
          analysis.warnings.push({
            type: 'dietary_preference',
            message: 'This product may not be suitable for a vegan diet'
          });
          healthScore -= 15;
        }
        
        analysis.overall_health_score = Math.max(0, healthScore);
        
        resolve(analysis);
      });
    });
  });
}

// Get ingredient database
app.get('/api/ingredients', (req, res) => {
  db.all(`SELECT * FROM ingredients ORDER BY name`, (err, rows) => {
    if (err) return res.status(500).json({ error: 'Server error' });
    res.json(rows);
  });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});