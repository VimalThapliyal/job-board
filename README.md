# Job Board with Interview Prep

A modern job board application built with Next.js, TypeScript, and MongoDB, featuring a comprehensive React interview questions section.

## Features

### Job Board
- Browse and search job listings
- Apply to jobs with resume upload
- Admin dashboard for managing leads and subscriptions
- Social media integration

### Interview Prep
- **Comprehensive React Interview Questions**: Over 100 manually curated, high-quality questions
- **Categorized by Difficulty**: Beginner, Intermediate, and Advanced levels
- **Multiple Categories**: React Fundamentals, Hooks, Performance, Testing, Routing, and more
- **Search and Filter**: Find questions by difficulty, category, or search terms
- **Detailed Explanations**: Each question includes comprehensive answers and explanations
- **Code Examples**: Practical code examples for complex concepts
- **User Feedback**: Helpful/not helpful voting system
- **Mobile Responsive**: Optimized for all devices

## Interview Questions Database

### Content Overview
- **Total Questions**: 100+ manually curated questions
- **Difficulty Levels**: 
  - Beginner: 30+ questions
  - Intermediate: 40+ questions  
  - Advanced: 30+ questions
- **Categories**: React Fundamentals, Hooks, Performance, Testing, Routing, Security, Advanced Patterns

### Question Quality
- **Manually Curated**: All questions are hand-picked for quality and relevance
- **Comprehensive Answers**: Detailed explanations with practical examples
- **Real-world Focus**: Questions based on actual interview scenarios
- **Regular Updates**: Content is regularly reviewed and updated

### Categories Covered
1. **React Fundamentals**: Components, JSX, Virtual DOM, State, Props
2. **React Hooks**: useState, useEffect, useContext, custom hooks
3. **React Performance**: Optimization, memoization, code splitting
4. **React Testing**: Testing strategies, tools, best practices
5. **React Routing**: Client-side routing, navigation
6. **React Security**: Authentication, authorization, security best practices
7. **React Advanced**: Suspense, Portals, SSR, Concurrent Features

## Technical Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS, DaisyUI
- **Database**: MongoDB Atlas
- **Deployment**: Vercel
- **Image Storage**: Vercel Blob
- **Analytics**: Vercel Analytics

## Getting Started

### Prerequisites
- Node.js 18+
- MongoDB Atlas account
- Vercel account (for deployment)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd job-board
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment setup**
   ```bash
   cp env.example .env.local
   ```
   Add your MongoDB URI and other environment variables to `.env.local`

4. **Run development server**
   ```bash
   npm run dev
   ```

5. **Build for production**
   ```bash
   npm run build
   ```

## Database Schema

### Interview Questions Collection
```typescript
interface InterviewQuestion {
  id: string;
  question: string;
  answer: string;
  explanation: string;
  codeExample?: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  category: string[];
  tags: string[];
  source: string;
  sourceUrl?: string;
  createdAt: Date;
  updatedAt: Date;
  viewCount: number;
  helpfulCount: number;
  notHelpfulCount: number;
}
```

### Question Categories Collection
```typescript
interface QuestionCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  questionCount: number;
}
```

## API Endpoints

### Interview Questions
- `GET /api/interview-questions` - Get all questions with filtering
- `GET /api/interview-questions/[id]` - Get specific question
- `GET /api/interview-questions/categories` - Get question categories
- `PATCH /api/interview-questions/[id]` - Update question feedback

### Query Parameters
- `search` - Search questions by text
- `difficulty` - Filter by difficulty level
- `category` - Filter by category
- `limit` - Limit number of results
- `page` - Pagination support

## Deployment

### Vercel Deployment
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Environment Variables
```bash
MONGODB_URI=your_mongodb_atlas_uri
VERCEL_BLOB_READ_WRITE_TOKEN=your_vercel_blob_token
```

## Contributing

### Adding New Questions
1. Questions are manually curated in `src/lib/interview-scraper.ts`
2. Follow the existing format and structure
3. Ensure questions are high-quality and relevant
4. Include comprehensive answers and explanations

### Development Guidelines
- Follow TypeScript best practices
- Use ESLint and Prettier for code formatting
- Write meaningful commit messages
- Test thoroughly before submitting PRs

## License

This project is licensed under the MIT License.

## Support

For support or questions, please open an issue on GitHub or contact the development team.
