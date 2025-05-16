# SEO Audit Tools

A comprehensive SEO audit and analysis platform built with Next.js, Prisma, and Clerk authentication.

## Features

### 1. User Management

- Secure authentication via Clerk
- Usage tracking for free reports and searches
- Premium user status management
- Personalized dashboard

### 2. SEO Audit System

- Create and track comprehensive SEO audits
- Monitor audit status and scores in real-time
- Track and manage technical issues
- Generate and download PDF reports
- Audit history tracking
- Detailed recommendations

### 3. Keyword Tracking

- Monitor keyword positions and changes
- Track search volume and difficulty metrics
- Historical position tracking
- Regular position updates
- Keyword performance analytics
- Position change notifications

### 4. Competitor Analysis

- Track competitor domains
- Monitor domain authority metrics
- Track backlinks and organic keywords
- Monitor organic traffic
- Competitor performance comparison
- Regular competitor updates

### 5. Goal Management

- Set and track SEO goals
- Monitor progress and deadlines
- Automatic milestone notifications
- Goal status tracking
- Progress visualization
- Goal completion celebrations

### 6. Notification System

- Real-time notifications for:
  - Keyword position changes
  - Competitor updates
  - Technical issues
  - Goal milestones
  - Audit completions
- Read/unread status tracking
- Notification management
- Customizable notification preferences

### 7. Technical SEO

- Comprehensive technical SEO analysis
- Issue severity tracking
- Affected pages monitoring
- Issue resolution tracking
- Technical SEO score calculation
- Priority-based recommendations

## Tech Stack

- **Frontend**: Next.js, React, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: Clerk
- **UI Components**: Custom components with shadcn/ui
- **Icons**: Lucide React

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables:
   ```env
   DATABASE_URL="your-postgresql-url"
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="your-clerk-key"
   CLERK_SECRET_KEY="your-clerk-secret"
   ```
4. Run database migrations:
   ```bash
   npx prisma migrate dev
   ```
5. Start the development server:
   ```bash
   npm run dev
   ```

## API Routes

### Audits

- `POST /api/audits` - Create new audit
- `GET /api/audits` - Get user's audits

### Keywords

- `POST /api/keywords` - Add new keyword
- `GET /api/keywords` - Get user's keywords
- `PATCH /api/keywords` - Update keyword position

### Competitors

- `POST /api/competitors` - Add new competitor
- `GET /api/competitors` - Get user's competitors
- `PATCH /api/competitors` - Update competitor data

### Goals

- `POST /api/goals` - Create new goal
- `GET /api/goals` - Get user's goals
- `PATCH /api/goals` - Update goal progress

### Notifications

- `GET /api/notifications` - Get user's notifications
- `PATCH /api/notifications` - Update notification status
- `DELETE /api/notifications` - Delete notification

## Database Schema

The application uses the following main models:

- User
- Usage
- Audit
- Issue
- Keyword
- Competitor
- Goal
- Notification
- Recommendation

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
