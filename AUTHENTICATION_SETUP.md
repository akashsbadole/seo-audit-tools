# Authentication Setup for SEO Audit Tools

This document outlines the complete authentication system setup for the SEO Audit Tools application, including user roles, credentials, and security features.

## 🚀 Quick Start

### Development Server

The application is running on: **http://localhost:3001**

### Login Credentials

The following user accounts have been created for testing:

#### 🔧 Admin Account

- **Email**: `admin@seoaudit.com`
- **Password**: `Admin@123456`
- **Role**: `ADMIN`
- **Premium**: `Yes`

#### 👤 Regular User Account

- **Email**: `user@seoaudit.com`
- **Password**: `User@123456`
- **Role**: `USER`
- **Premium**: `No`

#### ⭐ Premium User Account

- **Email**: `premium@seoaudit.com`
- **Password**: `Premium@123456`
- **Role**: `USER`
- **Premium**: `Yes`

---

## 🏗️ System Architecture

### Database Schema

- **Provider**: SQLite (development)
- **User Model**: Enhanced with role-based access control
- **Authentication**: NextAuth.js with Credentials Provider
- **Password Security**: bcrypt hashing (10 rounds)

### User Roles

1. **ADMIN**: Full system access, user management
2. **USER**: Standard access to SEO tools
3. **FREELANCER**: Specialized access for freelancers
4. **CLIENT**: Client-specific access controls

### Security Features

- ✅ Password hashing with bcrypt
- ✅ JWT token-based sessions
- ✅ Role-based access control
- ✅ Environment variable configuration
- ✅ Input validation and sanitization

---

## 📁 File Structure

```
├── lib/
│   └── auth.ts                    # NextAuth configuration
├── prisma/
│   └── schema.prisma              # Database schema with roles
├── app/api/auth/
│   ├── register/route.ts           # User registration endpoint
│   ├── login/route.ts             # User login endpoint
│   └── me/route.ts               # Current user info
├── scripts/
│   └── seed-users.ts             # Database seeding script
└── .env.local                    # Environment variables
```

---

## 🔧 Configuration

### Environment Variables

```env
NEXTAUTH_URL=http://localhost:3001
NEXTAUTH_SECRET=your-secret-key-here-change-this-in-production
DATABASE_URL="file:./dev.db"
```

### NextAuth Configuration

- **Provider**: Credentials (email/password)
- **Session Strategy**: JWT
- **Token Expiry**: 7 days
- **Login Page**: `/login`

---

## 🛠️ Setup Commands

### Database Operations

```bash
# Push schema changes to database
npx prisma db push

# Generate Prisma client (if needed)
npx prisma generate

# Seed initial users
npx tsx scripts/seed-users.ts
```

### Development Server

```bash
npm run dev
```

---

## 🔐 Authentication Flow

### User Registration

1. User submits email, password, and name
2. Password is hashed using bcrypt (10 rounds)
3. User is created with default `USER` role
4. JWT token is generated and returned

### User Login

1. User submits credentials
2. Database lookup by email
3. Password verification with bcrypt compare
4. JWT token created with user data and role
5. Session established with role information

### Session Management

- JWT tokens contain user ID, email, role, and premium status
- Tokens are valid for 7 days
- Role information persists throughout session

---

## 🎯 Usage Instructions

### For Testing

1. Navigate to `http://localhost:3001/login`
2. Use any of the provided credential sets
3. Verify role-based functionality works correctly
4. Test premium features with premium accounts

### For Production

1. Change all default passwords
2. Update `NEXTAUTH_SECRET` with a secure value
3. Configure proper database URL
4. Set up environment-specific configurations
5. Enable HTTPS for production

---

## 🚨 Security Notes

### Current Implementation

- ✅ Passwords are properly hashed
- ✅ Role-based access control implemented
- ✅ JWT tokens with expiry
- ✅ Environment variable protection

### Production Recommendations

- 🔒 Change default passwords immediately
- 🔒 Use strong NEXTAUTH_SECRET
- 🔒 Enable rate limiting on auth endpoints
- 🔒 Implement account lockout after failed attempts
- 🔒 Add two-factor authentication
- 🔒 Regular security audits

---

## 📞 Support

### Common Issues

1. **Database Connection**: Ensure DATABASE_URL is set correctly
2. **Prisma Client**: Run `npx prisma generate` if types are missing
3. **Environment**: Check `.env.local` file exists
4. **Ports**: Verify port 3001 is available

### Debugging

- Check browser console for authentication errors
- Verify network requests to auth endpoints
- Review server logs for detailed error messages
- Use Prisma Studio to inspect database: `npx prisma studio`

---

## 🔄 Maintenance

### Regular Tasks

- Rotate secrets and passwords
- Update dependencies
- Monitor authentication logs
- Backup database regularly
- Review user access patterns

### User Management

- Create new admin users as needed
- Deactivate inactive accounts
- Update user roles when necessary
- Monitor premium subscription status

---

_Last Updated: November 17, 2025_
_Version: 1.0.0_
