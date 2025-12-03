#!/bin/bash
# Deploy script for Kotopes - Run locally before git push

set -e  # Exit on error

echo "🔨 Building React app..."
npm run build

if [ $? -ne 0 ]; then
  echo "❌ Build failed!"
  exit 1
fi

echo "✅ Build successful!"
echo ""
echo "📦 Next steps:"
echo "  1. Commit changes: git add -A && git commit -m 'Build: production React build'"
echo "  2. Push to GitHub: git push origin main"
echo "  3. On CityHosting server:"
echo "     - cd /var/www/kotopes"
echo "     - git pull origin main"
echo "     - npm install (if package.json changed)"
echo "     - pm2 restart kotopes (or NODE_ENV=production PORT=3000 node server/index.js)"
echo ""
echo "🧪 Test locally:"
echo "  npm run build:prod"
echo "  Then visit http://localhost:3000"
