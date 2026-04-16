# AWS Configuration Guide

## AWS RDS MySQL Setup

### Step 1: Create RDS Instance via AWS Console

```
1. Navigate to RDS → Databases → Create Database
2. Select MySQL engine (latest version recommended)
3. Configuration:
   - DB Instance Identifier: sampah-db
   - Master Username: admin
   - Master Password: (Choose strong password)
   - Storage: 20 GB (free tier)
   - Storage Type: gp2 (General Purpose SSD)
```

### Step 2: Network & Security Configuration

```
VPC: Default VPC (atau custom VPC)
Subnet: Default
Public Accessibility: Yes (for development/testing)
VPC Security Group: Create new
Inbound Rules:
  - Type: MySQL/Aurora
  - Port: 3306
  - Source: Your IP (atau 0.0.0.0/0 for testing)
```

### Step 3: Database Configuration

```
Database Name: sampah-db
Parameter Group: default.mysql8.0
Backup Retention: 7 days
Multi-AZ: Disable (for development)
```

### Step 4: Connection Details

Setelah RDS instance selesai (5-10 menit), catat:
- **Endpoint**: xxxx.rds.amazonaws.com
- **Port**: 3306
- **Username**: admin
- **Password**: (yang sudah Anda buat)
- **Database**: sampah-db

## Environment Variables

Buat file `.env` di folder backend dengan:

```env
# Database Configuration
DB_HOST=your-rds-endpoint.rds.amazonaws.com
DB_USER=admin
DB_PASSWORD=your_secure_password
DB_NAME=sampah-db
DB_PORT=3306

# Server Configuration
PORT=5000
NODE_ENV=development

# AWS Configuration (optional, jika menggunakan SDK)
AWS_REGION=ap-southeast-1
AWS_ACCESS_KEY_ID=YOUR_ACCESS_KEY
AWS_SECRET_ACCESS_KEY=YOUR_SECRET_KEY
```

## Connection String

**MySQL Connection String Format:**
```
mysql://admin:password@your-rds-endpoint.rds.amazonaws.com:3306/sampah-db
```

## AWS CLI Setup (Optional)

### Install AWS CLI
```powershell
# Windows
msiexec.exe /i https://awscli.amazonaws.com/AWSCLIV2.msi

# Verify installation
aws --version
```

### Configure AWS Credentials
```powershell
aws configure
# Enter:
# AWS Access Key ID: [your-access-key]
# AWS Secret Access Key: [your-secret-key]
# Default region: ap-southeast-1
# Default output format: json
```

## Database Access Methods

### Method 1: MySQL Workbench (GUI)
```
1. Download MySQL Workbench
2. Database → New Connection
3. Fill in RDS endpoint details
4. Test Connection
5. Execute SQL queries
```

### Method 2: MySQL CLI
```bash
mysql -h your-rds-endpoint.rds.amazonaws.com \
      -u admin \
      -p
# Enter password when prompted
```

### Method 3: VS Code Extension
```
1. Install "MySQL" extension
2. Cmd+Shift+P → MySQL: Add Connection
3. Fill endpoint, username, password
4. Query directly in VS Code
```

### Method 4: Python Script
```python
import mysql.connector

connection = mysql.connector.connect(
    host="your-rds-endpoint.rds.amazonaws.com",
    user="admin",
    password="your_password",
    database="sampah-db",
    port=3306
)

cursor = connection.cursor()
cursor.execute("SELECT * FROM rumah")
for row in cursor.fetchall():
    print(row)

connection.close()
```

## Security Best Practices

### ✅ DO:
- Use strong passwords (min 20 characters)
- Restrict security group to specific IPs
- Enable automated backups
- Use private RDS endpoint (no public access for production)
- Encrypt EBS volumes
- Enable Performance Insights for monitoring

### ❌ DON'T:
- Don't commit .env file to Git
- Don't use same password everywhere
- Don't expose RDS to 0.0.0.0/0 in production
- Don't store credentials in code
- Don't disable backups

## Monitoring & Maintenance

### CloudWatch Metrics
- CPU Utilization
- Database Connections
- Read/Write IOPS
- Storage Space

### AWS Backup
- Automated daily backups (7 days retention)
- Manual snapshots for important data
- Cross-region backup support

## Cost Estimation

**Free Tier (12 months):**
- db.t3.micro: ~730 hours/month
- 20 GB storage included
- 20 GB data transfer

**After Free Tier:**
- db.t3.micro: ~$0.017/hour
- Storage: $0.12/GB-month
- Data transfer: $0.02/GB (outbound)

## Troubleshooting Connection Issues

### Error: "Access denied for user 'admin'"
```
Solution: Check username and password in .env
```

### Error: "Unknown MySQL server host"
```
Solution: Verify RDS endpoint - ensure no typos
```

### Error: "Connection timeout"
```
Solution: 
1. Check security group allows port 3306
2. Verify RDS is publicly accessible
3. Check your firewall/network
```

### Error: "Too many connections"
```
Solution: Increase max_connections in RDS parameter group
```

## Resources

- [AWS RDS Documentation](https://docs.aws.amazon.com/rds/)
- [MySQL Documentation](https://dev.mysql.com/doc/)
- [AWS Security Best Practices](https://aws.amazon.com/security/best-practices/)

---

**Last Updated:** April 2026
