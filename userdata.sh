#!/bin/bash
apt-get update -y
apt-get install -y docker.io docker-compose git nginx certbot python3-certbot-nginx

# Start and enable docker
systemctl start docker
systemctl enable docker
usermod -aG docker ubuntu

# Clone repo
sudo -u ubuntu git clone https://github.com/Debsmit16/Event_Management.git /home/ubuntu/app
cd /home/ubuntu/app

# Create necessary environment variables
cat << 'EOF' > /home/ubuntu/app/backend/.env
PORT=5000
NODE_ENV=production
DATABASE_URL="postgres://postgres:postgres@db:5432/event_db?sslmode=disable"
JWT_SECRET="supers3cr3tpr0ducti0nkey123987"
REDIS_URL="redis://redis:6379"
FRONTEND_URL="/"
EOF

cat << 'EOF' > /home/ubuntu/app/frontend/.env.local
NEXT_PUBLIC_API_URL=/api/v1
EOF

# Make sure permissions are correct
chown -R ubuntu:ubuntu /home/ubuntu/app

# Stop local nginx so docker nginx can bind to port 80
systemctl stop nginx
systemctl disable nginx

# Build and start docker-compose
# Note: Doing this as root is fine in user data context
docker-compose up --build -d
