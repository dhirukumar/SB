# StartupDeals - Exclusive Benefits Platform

A modern full-stack web application that connects early-stage startups with exclusive deals and benefits from premium SaaS partners. Built with Next.js 14, TypeScript, MongoDB, and Tailwind CSS.

## Features

- **Deal Discovery**: Browse curated deals from top SaaS providers (AWS, Stripe, Notion, etc.)
- **Advanced Filtering**: Search, filter by category, and sort deals by relevance
- **User Authentication**: Secure JWT-based authentication system
- **Verification System**: Two-tier access with public and verified-only deals
- **Deal Claims**: Track claimed deals with status management
- **Responsive Design**: Fully responsive UI with smooth animations
- **3D Animations**: Interactive Three.js hero section

## Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Framer Motion** - Smooth animations
- **Three.js** - 3D graphics
- **Zustand** - State management
- **Axios** - HTTP client

### Backend
- **Next.js API Routes** - Serverless API endpoints
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM
- **JWT** - Authentication tokens
- **bcrypt** - Password hashing

## Project Structure

```
startup-benefits-platform/
├── app/
│   ├── api/              # API routes
│   │   ├── auth/         # Authentication endpoints
│   │   ├── deals/        # Deal endpoints
│   │   └── claims/       # Claim endpoints
│   ├── deals/            # Deal pages
│   ├── dashboard/        # User dashboard
│   ├── login/            # Login page
│   ├── register/         # Registration page
│   └── page.tsx          # Landing page
├── components/           # React components
├── lib/                  # Utility functions
├── models/               # Mongoose schemas
├── store/                # Zustand stores
├── types/                # TypeScript types
└── scripts/              # Database scripts
```

## Getting Started

### Prerequisites

- Node.js 18+ 
- MongoDB 6+
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd startup-benefits-platform
```

2. Install dependencies
```bash
npm install
```

3. Configure environment variables
```bash
cp .env.local.example .env.local
```

Edit `.env.local`:
```env
MONGODB_URI=mongodb://localhost:27017/startup-benefits
JWT_SECRET=your-secret-key-min-32-characters
JWT_EXPIRE=7d
NODE_ENV=development
```

4. Start MongoDB
```bash
mongod
```

5. Seed the database
```bash
npm run seed
```

6. Run the development server
```bash
npm run dev
```

7. Open [http://localhost:3000](http://localhost:3000)

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run seed` - Seed database with sample deals
- `npm run lint` - Run ESLint

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `POST /api/auth/request-verification` - Request account verification

### Deals
- `GET /api/deals` - Get all deals (with filters)
- `GET /api/deals/:id` - Get single deal

### Claims
- `POST /api/claims` - Claim a deal
- `GET /api/claims` - Get user's claims

## Database Models

### User
- Email, password (hashed)
- Name, company, website
- Verification status
- Role (user/verified/admin)

### Deal
- Title, description
- Partner information
- Category, tags
- Access level (public/locked)
- Benefits, discount value
- Eligibility requirements

### Claim
- User reference
- Deal reference
- Status (pending/approved/rejected)
- Redemption code
- Claim date

## Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Other Platforms

Compatible with any platform supporting Next.js:
- Railway
- Render
- AWS Amplify
- DigitalOcean App Platform

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `MONGODB_URI` | MongoDB connection string | Yes |
| `JWT_SECRET` | Secret key for JWT (min 32 chars) | Yes |
| `JWT_EXPIRE` | JWT expiration time | No (default: 7d) |
| `NODE_ENV` | Environment mode | No (default: development) |

## Security Features

- Password hashing with bcrypt
- JWT token authentication
- Protected API routes
- Input validation
- CORS protection
- Environment variable encryption

## Performance Optimizations

- Server-side rendering (SSR)
- Static generation where applicable
- Image optimization
- Code splitting
- Lazy loading components
- MongoDB indexing

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## License

This project is licensed under the MIT License.

## Contact

For questions or support, please open an issue in the repository.

## Acknowledgments

- Partner logos via [Clearbit Logo API](https://clearbit.com/logo)
- Icons from [Heroicons](https://heroicons.com)
- Fonts from [Google Fonts](https://fonts.google.com)