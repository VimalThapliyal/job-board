# Job Board Aggregator

A modern job board that aggregates React developer jobs from multiple sources, built with Next.js, TypeScript, and TailwindCSS.

## 🚀 Features

- **Job Listings**: Browse React developer jobs with search and filtering
- **Responsive Design**: Works perfectly on desktop and mobile
- **Automated Scraping**: Jobs are automatically scraped every 6 hours
- **SEO Optimized**: Built for search engine visibility
- **Fast Performance**: Built with Next.js for optimal performance

## 🛠️ Tech Stack

- **Frontend**: Next.js 15 + React 19 + TypeScript
- **Styling**: TailwindCSS
- **Scraping**: Playwright
- **Automation**: GitHub Actions
- **Hosting**: Vercel (recommended)

## 📋 Prerequisites

- Node.js 18+
- npm or yarn
- Git

## 🚀 Quick Start

### 1. Clone and Install

```bash
git clone <your-repo-url>
cd job-board
npm install
```

### 2. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

### 3. Test the Scraper (Optional)

```bash
npm run scrape
```

This will run the Indeed scraper and save jobs to `data/jobs.json`.

## 📁 Project Structure

```
job-board/
├── src/
│   ├── app/                 # Next.js app router
│   │   ├── api/jobs/        # API routes
│   │   └── page.tsx         # Homepage
│   ├── components/          # React components
│   │   ├── JobCard.tsx
│   │   ├── SearchBar.tsx
│   │   └── FilterBar.tsx
│   └── types/              # TypeScript types
│       └── job.ts
├── scripts/
│   └── scrapers/           # Scraping scripts
│       └── indeed-scraper.ts
├── data/                   # Scraped job data (auto-generated)
└── .github/workflows/      # GitHub Actions
    └── scrape-jobs.yml
```

## 🔧 Configuration

### Environment Variables

Create a `.env.local` file for local development:

```env
# Add any environment variables here
NEXT_PUBLIC_API_URL=http://localhost:3000
```

### Scraper Configuration

The scraper is configured to search for "react developer" jobs in "remote" locations. You can modify the search terms in `scripts/scrapers/indeed-scraper.ts`.

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Deploy automatically

### Manual Deployment

```bash
npm run build
npm start
```

## 🤖 Automation

The project includes GitHub Actions that:

- **Scrapes jobs every 6 hours** automatically
- **Commits updated job data** to the repository
- **Can be triggered manually** via GitHub Actions UI

### Manual Scraping

```bash
npm run scrape
```

## 📊 Data Flow

1. **Scraping**: Playwright scrapes Indeed for React developer jobs
2. **Storage**: Jobs are saved to `data/jobs.json`
3. **API**: Next.js API routes serve the job data
4. **Frontend**: React components display the jobs with search/filter

## 🔍 SEO Features

- Static job pages for each listing
- Meta tags and schema markup
- Sitemap generation
- Optimized for search engines

## 🎨 Customization

### Adding New Job Sources

1. Create a new scraper in `scripts/scrapers/`
2. Follow the `IndeedScraper` pattern
3. Add to the GitHub Actions workflow

### Styling

The app uses TailwindCSS. Modify `src/app/globals.css` for custom styles.

### Job Data Structure

Jobs follow this TypeScript interface:

```typescript
interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  salary?: string;
  description: string;
  applyUrl: string;
  postedDate: string;
  logo?: string;
}
```

## 🐛 Troubleshooting

### Scraper Issues

- Check if Indeed's structure has changed
- Verify Playwright is installed: `npx playwright install`
- Check network connectivity

### Build Issues

- Clear Next.js cache: `rm -rf .next`
- Reinstall dependencies: `rm -rf node_modules && npm install`

## 📈 Future Enhancements

- [ ] Email job alerts
- [ ] User authentication
- [ ] Company dashboards
- [ ] AI job matching
- [ ] Multiple job categories
- [ ] Monetization features

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

## 🙏 Acknowledgments

- Built with Next.js and TailwindCSS
- Job data scraped from Indeed
- Automated with GitHub Actions
