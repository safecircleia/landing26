````markdown
# SafeCircle Landing Page

A modern, high-performance landing page built with **Next.js 15**, **Payload CMS**, and **TypeScript**. This project showcases enterprise-level web development practices including headless CMS integration, advanced content management, and SEO optimization.

<img src="https://payloadcms.com/images/og-image.jpg" alt="SafeCircle landing page" />

## 🌟 Key Features

- **Headless CMS**: Full content management powered by Payload CMS with custom collections and flexible content blocks
- **Next.js 15**: Leveraging the latest App Router, Server Components, and React 19
- **TypeScript**: Fully typed codebase for better developer experience and code quality
- **Rich Content Blocks**: Modular content system with 30+ reusable blocks (CallToAction, CardGrid, MediaContent, Pricing, etc.)
- **Documentation System**: Dynamic docs rendering from MDX/Markdown with automatic conversion to Lexical editor format
- **SEO Optimized**: Built-in SEO plugin, sitemap generation, and structured data
- **Form Builder**: Advanced form system with Cloudflare Turnstile verification and HubSpot integration
- **Multi-language Support**: Internationalization ready with English, Spanish, and French locales
- **Partner Management**: Complete partner directory with filterable categories
- **Case Studies**: Showcase customer success stories with rich media and parallax effects
- **Dark/Light Mode**: Sophisticated theme system without first-load flickering
- **Search Integration**: Algolia-powered search with instant results

## 🛠️ Tech Stack

### Core Technologies
- **[Payload CMS](https://github.com/payloadcms/payload)** `3.43.0` - Headless CMS with MongoDB adapter
- **[Next.js](https://nextjs.org/)** `15.3.3` - React framework with App Router
- **[React](https://react.dev/)** `19.1.0` - UI library
- **[TypeScript](https://www.typescriptlang.org/)** `5.7.3` - Type-safe JavaScript
- **[MongoDB](https://www.mongodb.com/)** - Database via Mongoose adapter

### Content & Rich Text
- **Lexical Editor** - Advanced rich text editing with custom features
- **MDX Conversion** - Automatic markdown to Lexical conversion for docs
- **Prism React Renderer** - Syntax highlighting for code blocks
- **React Markdown** - Markdown rendering with GFM support

### UI & Styling
- **SCSS Modules** - Component-scoped styling
- **Framer Motion** `12.0.0-alpha.2` - Advanced animations
- **Radix UI** - Accessible component primitives (Accordion, Tabs, Portal)
- **Faceless UI** - Custom UI components (Grid, Modal, Slider, Collapsibles)
- **Geist Font** - Modern typography

### Search & Discovery
- **Algolia** - Instant search with React InstantSearch
- **@docsearch/react** - Documentation search widget

### Forms & Validation
- **Payload Form Builder Plugin** - Dynamic form generation
- **Cloudflare Turnstile** - Bot protection via @marsidev/react-turnstile
- **React Select** - Enhanced select components

### Integrations
- **Stripe** - Payment processing for SaaS features
- **HubSpot** - Form submission tracking
- **Nodemailer** - Email with SendGrid transport
- **Vercel Blob Storage** - Asset storage
- **Facebook Pixel** - Analytics tracking

### Developer Experience
- **ESLint** - Code linting with Payload ESLint config
- **Prettier** - Code formatting
- **pnpm** - Fast, disk space efficient package manager
- **Sharp** - High-performance image processing
- **Next Bundle Analyzer** - Build size analysis

## 📁 Project Structure

```
landing26/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (frontend)/        # Public-facing pages
│   │   ├── (payload)/         # CMS admin routes
│   │   └── api/               # API endpoints
│   ├── blocks/                # Reusable content blocks
│   │   ├── Banner/
│   │   ├── BlogContent/
│   │   ├── CallToAction/
│   │   ├── CardGrid/
│   │   ├── CaseStudyCards/
│   │   ├── Pricing/
│   │   └── ... (30+ blocks)
│   ├── collections/           # Payload collections
│   │   ├── CaseStudies.ts
│   │   ├── Docs/
│   │   ├── Media.ts
│   │   ├── Pages.ts
│   │   ├── Partners.ts
│   │   ├── Posts.ts
│   │   └── Users.ts
│   ├── components/            # React components
│   ├── fields/               # Custom Payload fields
│   ├── globals/              # Global CMS configs
│   │   ├── Footer.ts
│   │   ├── MainMenu.ts
│   │   └── TopBar.ts
│   ├── hooks/                # React & Payload hooks
│   ├── plugins/              # Custom Payload plugins
│   ├── scripts/              # Utility scripts
│   │   ├── syncDocs.ts       # GitHub docs sync
│   │   └── redeployWebsite.ts
│   └── payload.config.ts     # Payload configuration
├── public/                    # Static assets
│   ├── fonts/
│   ├── images/
│   └── robots.txt
├── media/                     # Uploaded media files
├── next.config.js            # Next.js configuration
├── tsconfig.json             # TypeScript configuration
└── package.json              # Dependencies
```

## ⭐ Content Management System

This project uses **Payload CMS** as a headless CMS, providing:

- **Collections**: Pages, Posts, Case Studies, Partners, Docs, Community Help, Media
- **Global Configs**: Main Menu, Footer, Top Bar, Partner Program, Get Started
- **Custom Blocks**: 30+ reusable content blocks for flexible page building
- **Rich Text Editor**: Lexical-based editor with custom features (labels, large body, tables, uploads)
- **Form Builder**: Dynamic form creation with validation and HubSpot integration
- **Nested Docs**: Hierarchical documentation structure
- **SEO Management**: Built-in SEO fields and metadata generation
- **Redirects**: Automatic redirect management
- **Media Management**: Vercel Blob storage integration with Sharp optimization

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18.x or higher
- **pnpm** (recommended) or npm
- **MongoDB** database (local or cloud instance)
- Optional: **Vercel** account for blob storage

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd landing26
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Fill in your `.env` file with the following required values:
   ```env
   # Database
   DATABASE_URI=mongodb://localhost:27017/safecircle
   
   # Payload
   PAYLOAD_SECRET=your-secret-key-here
   PAYLOAD_PUBLIC_APP_URL=http://localhost:3000
   
   # Email (SMTP)
   SMTP_HOST=smtp.sendgrid.net
   SMTP_USER=apikey
   SMTP_PASS=your-sendgrid-api-key
   
   # Optional: Vercel Blob Storage
   BLOB_STORAGE_ENABLED=false
   BLOB_READ_WRITE_TOKEN=your-token
   BLOB_STORE_ID=your-store-id
   
   # Optional: HubSpot
   NEXT_PRIVATE_HUBSPOT_PORTAL_KEY=your-portal-key
   
   # Optional: Cloudflare Turnstile
   NEXT_PRIVATE_TURNSTILE_SECRET_KEY=your-secret
   
   # Optional: GitHub (for docs sync)
   GITHUB_ACCESS_TOKEN=ghp_your_token
   GITHUB_CLIENT_SECRET=your_secret
   ```

4. **Run database migrations**
   ```bash
   pnpm payload migrate
   ```

5. **Start the development server**
   ```bash
   pnpm dev
   ```

6. **Access the application**
   - Frontend: http://localhost:3000
   - CMS Admin: http://localhost:3000/admin

## 📝 Available Scripts

```bash
# Development
pnpm dev                    # Start Next.js dev server with Payload

# Building
pnpm build                  # Generate types, run migrations, build for production
pnpm build:skipDocs        # Build without docs generation
pnpm start                  # Start production server
pnpm postbuild             # Generate sitemap after build

# Type Generation
pnpm generate:types         # Generate TypeScript types from Payload config
pnpm generate:importmap     # Generate import map for Payload
pnpm generate:llms          # Generate LLM-related content

# Database
pnpm payload migrate        # Run database migrations

# Code Quality
pnpm lint                   # Run ESLint
pnpm prettier:fix          # Format code with Prettier

# Analysis
pnpm analyze               # Analyze bundle size with @next/bundle-analyzer

# Utilities
pnpm caddy                 # Run Caddy server (for local HTTPS)
```

## 🎨 Content Blocks

This project includes 30+ reusable content blocks for flexible page composition:

### Layout Blocks
- **Banner** - Full-width announcement banners
- **BlockSpacing** - Control spacing between sections
- **ExtendedBackground** - Background that extends beyond container

### Content Blocks
- **Content** - Rich text content with media
- **ContentGrid** - Multi-column content layout
- **MediaContent** - Side-by-side media and content
- **MediaContentAccordion** - Expandable content sections
- **Statement** - Large testimonial or statement
- **BlogContent** - Blog post content with formatting
- **BlogMarkdown** - Markdown-based blog content

### Interactive Blocks
- **CallToAction** - Action-oriented sections with buttons
- **Form** - Dynamic forms with validation
- **HoverCards** - Cards with hover effects
- **HoverHighlights** - Content sections that highlight on hover
- **StickyHighlights** - Scroll-based sticky sections
- **Slider** - Image/content carousel
- **Accordion** - Expandable content sections

### Display Blocks
- **CardGrid** - Grid of cards
- **LinkGrid** - Grid of links
- **LogoGrid** - Partner/client logo display
- **Pricing** - Pricing tables
- **Steps** - Step-by-step processes
- **ComparisonTable** - Feature comparison tables

### Code & Technical
- **Code** - Syntax-highlighted code blocks
- **CodeFeature** - Code with feature highlights
- **ExampleTabs** - Tabbed code examples
- **Download** - Download buttons and assets
- **CommandLine** - Terminal command displays

### Case Studies & Portfolio
- **CaseStudyCards** - Showcase case studies
- **CaseStudiesHighlight** - Featured case studies
- **CaseStudyParallax** - Parallax scrolling case studies

### Specialized
- **Media** - Images and videos
- **ReusableContent** - Reusable content snippets
- **Callout** - Important notices or tips

## 📚 Documentation System

The documentation system supports multiple workflows:

### GitHub Sync
1. Docs are pulled from a GitHub repository
2. MDX is automatically converted to Lexical format
3. Stored in the CMS for editing
4. Can be pushed back to GitHub after CMS edits

### Local Development
Set `DOCS_DIR_V3` to your local docs directory:
```env
DOCS_DIR_V3=/path/to/your/docs
```

Access via: http://localhost:3000/docs/local/your-doc-path

### Dynamic Loading
Load docs from any branch without syncing:
```
/docs/dynamic/path?branch=feature-branch
```

## 🔌 API Endpoints

Custom API endpoints are available for various operations:

- `GET /api/sync/docs` - Sync documentation from GitHub
- `POST /api/redeploy/website` - Trigger website redeployment
- `GET /api/refresh/mdx-to-lexical` - Refresh MDX to Lexical conversion

## 🎯 Key Features Explained

### Form Builder with HubSpot Integration
- Custom form builder plugin
- Cloudflare Turnstile bot protection
- Automatic HubSpot submission
- Custom validation and field types

### SEO Optimization
- Automatic sitemap generation via `next-sitemap`
- SEO plugin for all collections
- OpenGraph and Twitter card metadata
- Structured data support

### Multi-language Support
- English, Spanish, and French locales
- Fallback to default locale
- Per-collection localization

### Partner Management
- Filterable partner directory
- Categories: Industries, Specialties, Regions, Budgets
- Rich profiles with case studies

### Media Management
- Vercel Blob storage integration
- Sharp image optimization
- Responsive image serving
- CDN delivery

### Authentication & Access Control
- Custom access control functions
- Admin-only routes
- Published-only content filtering
- Role-based permissions

## 🚀 Deployment

### Vercel (Recommended)

1. **Connect your repository to Vercel**
2. **Configure environment variables** in Vercel dashboard
3. **Deploy** - automatic deployments on push to main

### Environment Variables for Production
```env
NEXT_PUBLIC_IS_LIVE=true
DATABASE_URI=your-production-mongodb-uri
PAYLOAD_SECRET=your-production-secret
BLOB_STORAGE_ENABLED=true
BLOB_READ_WRITE_TOKEN=your-vercel-token
```

### Build Command
```bash
pnpm build
```

### Start Command
```bash
pnpm start
```

## 🧪 Development Tips

### Custom Aliases
The project uses path aliases for cleaner imports:
- `@scss` → `./src/css/`
- `@components` → `./src/components.js`
- `@blocks` → `./src/blocks`
- `@providers` → `./src/providers`
- `@icons` → `./src/icons`
- `@utilities` → `./src/utilities`
- `@types` → `./payload-types.ts`
- `@graphics` → `./src/graphics`

### Bundle Analysis
Run bundle analysis to optimize build size:
```bash
ANALYZE=true pnpm build
```

### Content Security
The site includes security headers:
- `X-Frame-Options: SAMEORIGIN`
- Content Security Policy for object/form restrictions
- X-Robots-Tag for non-production environments

## 📖 Additional Resources

- [Payload CMS Documentation](https://payloadcms.com/docs)
- [Next.js 15 Documentation](https://nextjs.org/docs)
- [Lexical Editor](https://lexical.dev/)
- [Payload Form Builder](https://payloadcms.com/docs/plugins/form-builder)

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is available as open source under the terms of the [MIT license](LICENSE).

## 👥 Support

For issues, questions, or contributions:
- Open an issue in the repository
- Contact: hello@safecircle.tech

---

Built with ❤️ using [Payload CMS](https://payloadcms.com/) and [Next.js](https://nextjs.org/)
