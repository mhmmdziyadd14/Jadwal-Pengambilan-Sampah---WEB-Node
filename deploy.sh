#!/bin/bash
# Deployment script untuk AWS EC2 atau server lain

# Set variables
PROJECT_NAME="sampah-scheduler"
PROJECT_DIR="/home/ubuntu/sampah-scheduler"
BACKEND_PORT=5000
DOMAIN="sampah.example.com"  # Ganti dengan domain Anda

echo "🚀 Starting deployment for $PROJECT_NAME..."

# 1. Pull latest code
cd $PROJECT_DIR
git pull origin main

# 2. Install backend dependencies
echo "📦 Installing dependencies..."
cd backend
npm install --production
npm run build 2>/dev/null || true

# 3. Update .env file (pastikan sudah sesuai dengan production AWS RDS)
echo "⚙️ Checking environment configuration..."
if [ ! -f .env ]; then
    echo "ERROR: .env file not found!"
    exit 1
fi

# 4. Restart backend service
echo "🔄 Restarting backend service..."
sudo systemctl restart sampah-backend

# 5. Check service status
echo "✅ Checking service status..."
sudo systemctl status sampah-backend --no-pager

# 6. Setup Nginx as reverse proxy (optional)
echo "🌐 Nginx configuration..."
# nginx configuration should already be set up

# 7. SSL certificate (optional, using Let's Encrypt)
echo "🔒 SSL certificate status..."
sudo certbot renew --non-interactive

echo "✨ Deployment completed!"
echo "Backend running at: http://$DOMAIN:$BACKEND_PORT"
echo "Frontend served at: http://$DOMAIN"

# Logs
echo "\n📋 Recent backend logs:"
sudo journalctl -u sampah-backend -n 20 --no-pager
