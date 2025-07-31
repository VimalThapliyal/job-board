
📄 Product Requirements Document (PRD): Job Board Aggregator

1️⃣ Overview

The Job Board Aggregator will scrape job postings from multiple job portals and company career pages to create a niche job board. Initially, it will focus on a specific category (e.g., "Remote React Developer Jobs") and later expand into multiple categories.


---

2️⃣ Objectives

Launch an MVP at zero cost using free-tier tools.

Provide a centralized, clean, and fast job search platform.

Automate job scraping and refresh listings daily.

Enable SEO-friendly job pages to drive organic traffic.

Introduce email job alerts and monetization in later phases.



---

3️⃣ Scope

✅ In-Scope (MVP):

1. Job Scraping (Automated via Playwright & GitHub Actions):

Scrape jobs from Indeed (initially).

Extract title, company, location, posting date, apply link.

Save jobs in JSON (later migrate to MongoDB).



2. Frontend (Next.js + TailwindCSS):

Job listing page with search & filters.

Job details page with apply link.

Responsive UI (desktop/mobile).



3. SEO Optimization:

Generate static SEO pages (e.g., /jobs/react-developer/delhi).

Add meta tags, schema markup for jobs.



4. Automation:

GitHub Actions to run scraper every 6 hours (free cron jobs).

Auto-deploy updates on Vercel.





---

🚫 Out-of-Scope (For MVP, Planned Later):

User authentication & resumes.

AI job matching.

Paid sponsored job postings.

Company dashboard for posting jobs.



---

4️⃣ User Stories

1. Job Seeker:

As a user, I want to see a list of latest jobs so I can easily apply.

As a user, I want to filter jobs by keyword/location.

As a user, I want an apply link that takes me directly to the job posting.



2. Admin (You):

As admin, I want the scraper to run automatically and update jobs.

As admin, I want to view logs of scraper runs (success/failure).





---

5️⃣ Functional Requirements

Frontend:

[FR1] Job list page with title, company, location, and "Apply" button.

[FR2] Search bar & basic filters (location, keyword).

[FR3] Responsive design.


Scraping:

[FR4] Playwright scraper extracting data.

[FR5] Deduplicate jobs before displaying.

[FR6] JSON output auto-pushed to GitHub.


Automation:

[FR7] GitHub Actions schedule scraper (every 6 hrs).

[FR8] Deploy new jobs automatically to Vercel.



---

6️⃣ Non-Functional Requirements

Performance: Job list loads in <2 sec.

Uptime: Hosted on Vercel (99% uptime).

Cost: Free-tier services only.

Scalability: Easy migration to DB & paid hosting later.



---

7️⃣ Tech Stack

Frontend: Next.js (React) + TailwindCSS.

Scraping: Playwright (Node.js).

Storage (MVP): JSON (GitHub repo).

Hosting: Vercel (Frontend), GitHub Actions (Scraper automation).

Database (Future): MongoDB Atlas Free Tier.



---

8️⃣ Milestones & Timeline

Week 1:

Set up Next.js UI with static job list.

Build Playwright scraper (manual runs).

Deploy MVP to Vercel.


Week 2:

Automate scraper with GitHub Actions.

Add search/filter to UI.

Enable SEO pages & submit sitemap to Google.



---

9️⃣ Future Enhancements

[PH2] Migrate to MongoDB Atlas (store jobs persistently).

[PH3] Add email job alerts (SendGrid free tier).

[PH4] Implement monetization (affiliate links, sponsored posts).

[PH5] Multi-niche expansion: Add categories (UI/UX, Data Science).

[PH6] Premium features (AI matching, resume builder).



---

🔟 Initial Cost (MVP)

Domain name: ₹800–1,000/year (optional for MVP; use vercel.app URL initially).

Hosting: Free (Vercel Free Tier).

Database: JSON (free) → MongoDB free tier later.

Email alerts: Free (Mailgun/SendGrid starter).


💰 Total Initial Cost: ₹0 (domain optional).