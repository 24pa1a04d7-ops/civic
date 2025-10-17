#!/bin/bash

echo "🥗 Smart Diet Scanner - Installation Script"
echo "=========================================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js (v16 or higher) first."
    echo "   Visit: https://nodejs.org/"
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 16 ]; then
    echo "❌ Node.js version $NODE_VERSION is too old. Please install Node.js v16 or higher."
    exit 1
fi

echo "✅ Node.js $(node -v) detected"

# Install root dependencies
echo "📦 Installing root dependencies..."
npm install

# Install server dependencies
echo "📦 Installing server dependencies..."
cd server
npm install
cd ..

# Install client dependencies
echo "📦 Installing client dependencies..."
cd client
npm install
cd ..

# Create uploads directory
echo "📁 Creating uploads directory..."
mkdir -p server/uploads

# Copy environment file
echo "⚙️  Setting up environment configuration..."
if [ ! -f server/.env ]; then
    cp .env.example server/.env
    echo "✅ Created server/.env from template"
else
    echo "ℹ️  server/.env already exists"
fi

echo ""
echo "🎉 Installation complete!"
echo ""
echo "To start the application:"
echo "  npm run dev"
echo ""
echo "This will start:"
echo "  - Backend server on http://localhost:5000"
echo "  - Frontend development server on http://localhost:3000"
echo ""
echo "Happy scanning! 🥗✨"