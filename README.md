# 0p5.dev Web Application

**The deployment platform for developers by developers**

A modern, full-stack web application built with Nuxt 4, Vue 3, and Supabase. This project powers the [0p5.dev](https://0p5.dev) platform, providing an intuitive interface for managing deployments with scale-to-zero capabilities and one-command deployment workflows.

## 🚀 Tech Stack

- **Framework:** [Nuxt 4](https://nuxt.com/) with Server-Side Rendering (SSR)
- **Runtime:** [Node.js](https://nodejs.org/) (JavaScript runtime)
- **Frontend:** Vue 3 with TypeScript
- **UI Library:** [@nuxt/ui](https://ui.nuxt.com/) (Tailwind CSS-based component library)
- **Authentication:** Supabase Auth (OAuth with GitHub & Google)
- **Backend Proxy:** Server API routes for backend communication
- **Validation:** Zod
- **JWT Handling:** Jose
- **Containerization:** Docker (optimized multi-stage builds)
- **CI/CD:** Google Cloud Build with Buildah
- **Deployment:** Google Cloud Run

## 📋 Prerequisites

- [Node.js](https://nodejs.org/) >= 18.0.0
- [npm](https://www.npmjs.com/) (comes with Node.js)
- [Docker](https://www.docker.com/) (for containerized deployment)
- [Git](https://git-scm.com/)
- [Supabase](https://supabase.com/) project (for authentication)

## 🛠️ Installation

### 1. Clone the repository

```bash
git clone https://github.com/digizyne/lfcloud.git
cd lfcloud
```

### 2. Install dependencies

```bash
npm install
```

### 3. Environment Configuration

Create a `.env` file in the project root:

```bash
# Supabase Configuration
NUXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NUXT_PUBLIC_SUPABASE_API_KEY=your-anon-key
NUXT_SUPABASE_DB_PASSWORD=your-db-password

# GitHub API (for additional integrations)
NUXT_PUBLIC_GITHUB_API_TOKEN=your-github-token

# Backend Controller (API proxy target)
NUXT_CONTROLLER_BASE_URL=http://your-backend-api/api/v1
```

### 4. Generate TypeScript types from Supabase

```bash
npx supabase gen types typescript --project-id your-project-id > app/types/database.types.ts
```

## 🏃 Development

Start the development server using Docker Compose:

```bash
npm run up
```

This command starts the application in a Docker container with:
- **Node.js runtime** for dependency installation and hot reloading
- **Volume mounting** for live code changes without rebuilding
- **Port 3000 exposed** to your host machine
- **Environment variables** loaded from `.env` file

The application will be available at [http://localhost:3000](http://localhost:3000)

To stop the development server:

```bash
npm run down
```

### Development Features

- 🔥 Hot Module Replacement (HMR)
- 🎨 Tailwind CSS with custom configuration
- 🔍 Vue DevTools enabled
- 📊 Nuxt DevTools enabled

## 🏗️ Building for Production

### Local Build

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

### Docker Build

Build the Docker image:

```bash
docker build -t 0p5dev/webapp:latest .
```

Run the container:

```bash
docker run -p 3000:3000 \
  -e NUXT_PUBLIC_SUPABASE_URL=your-url \
  -e NUXT_PUBLIC_SUPABASE_API_KEY=your-key \
  0p5dev/webapp:latest
```

### Cloud Build & Deployment

This project uses Google Cloud Build with Buildah for container builds and Cloud Run for deployment.

**Trigger a build:**

```bash
gcloud builds submit --config=cloudbuild.yaml
```

The pipeline:
1. Builds the container image with Buildah
2. Pushes to Google Artifact Registry
3. Deploys to Cloud Run with automatic rollout

## 📁 Project Structure

```
webapp/
├── app/
│   ├── assets/
│   │   └── css/           # Global styles & Tailwind
│   ├── components/        # Vue components
│   ├── composables/       # Composable functions (useAuth, etc.)
│   ├── layouts/           # Layout components (default, dashboard)
│   ├── middleware/        # Route middleware (auth)
│   ├── pages/             # File-based routing
│   │   ├── index.vue      # Landing page
│   │   ├── login.vue      # Authentication page
│   │   ├── dashboard.vue  # Main dashboard
│   │   └── deployment/    # Deployment-related pages
│   ├── plugins/           # Nuxt plugins
│   └── types/             # TypeScript types (including Supabase DB types)
├── server/
│   └── api/               # Server API routes
│       ├── [...].ts       # Backend proxy (catch-all)
│       └── auth/          # Authentication endpoints
├── public/                # Static assets
├── cloudbuild.yaml        # Google Cloud Build configuration
├── Dockerfile             # Multi-stage production build
├── docker-compose.yml     # Local development with Docker
├── nuxt.config.ts         # Nuxt configuration
└── package.json           # Dependencies & scripts
```

## 🔐 Authentication

The app uses Supabase Auth with OAuth providers:

- **GitHub OAuth** - Primary authentication method
- **Google OAuth** - Alternative authentication method

Authentication flow:
1. User clicks provider button on `/login`
2. Redirects to OAuth provider
3. Provider redirects back to application
4. Supabase session stored in chunked cookies (`0p5dev.0`, `0p5dev.1`, etc.)
5. Server middleware validates session and proxies authenticated requests

### Custom Auth Middleware

Located at `app/middleware/01.auth.global.ts`:
- Validates JWT tokens on protected routes
- Manages user session state
- Redirects unauthenticated users to login

## 🌐 API Proxy

The `server/api/[...].ts` catch-all route proxies requests to the backend controller:

```typescript
// Example: /api/deployments → http://backend-api/api/v1/deployments
```

Features:
- Automatic token extraction from Supabase cookies
- Bearer token injection in Authorization header
- Request/response proxying with proper error handling

## 🎨 UI Components

Built with `@nuxt/ui` (powered by Tailwind CSS & Headless UI):

- `UAuthForm` - OAuth provider buttons & form handling
- `UCard` - Card containers
- `UButton` - Customizable buttons with variants
- `UCarousel` - Feature showcase carousel
- `UPageCard` - Page layout wrapper

Custom color scheme:
- **Primary:** Custom brand color
- **Secondary:** Accent color
- Chakra Petch font for branding

## 📦 Scripts

| Command | Description |
|---------|-------------|
| `npm run up` | Start development server in Docker container |
| `npm run down` | Stop and remove Docker containers |
| `npm run dev` | Start local development server (without Docker) |
| `npm run build` | Build for production |
| `npm run generate` | Generate static site |
| `npm run preview` | Preview production build |
| `npm install` | Install dependencies |

## 🐛 Debugging

### Common Issues

**1. Cookie size limit exceeded**
- Supabase sessions can exceed 4KB
- Solution: Module uses chunked cookies automatically
- Verify `cookiePrefix: "0p5dev"` in `nuxt.config.ts`

**2. OAuth redirect not working**
- Ensure `redirectTo` uses full URLs: `${window.location.origin}/dashboard`
- Configure redirect URLs in Supabase dashboard

**3. Module export errors (cookie package)**
- Package override forces `cookie@0.6.0` for ES module compatibility
- Check `overrides` section in `package.json`

## 🚢 Deployment

### Environment Variables (Production)

Set these in your Cloud Run service:

```bash
NUXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NUXT_PUBLIC_SUPABASE_API_KEY=your-anon-key
NUXT_CONTROLLER_BASE_URL=https://your-backend-api/api/v1
```

### Cloud Run Configuration

- **Concurrency:** 80 requests per container
- **Memory:** 512Mi
- **CPU:** 1
- **Min instances:** 0 (scale to zero)
- **Max instances:** 10

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

### Development Guidelines

- Follow Vue 3 Composition API patterns
- Use TypeScript for type safety
- Prefer composables over mixins
- Keep components single-responsibility
- Write semantic commit messages

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Links

- **Platform:** [0p5.dev](https://0p5.dev)
- **Documentation:** [0p5.dev/docs](https://0p5.dev/docs)
- **CLI Tool:** [github.com/0p5dev/ops](https://github.com/0p5dev/ops)

---

Built with ❤️ by the 0p5.dev team
