const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/startup-benefits';

const dealSchema = new mongoose.Schema({
  title: String,
  description: String,
  shortDescription: String,
  partner: {
    name: String,
    logo: String,
    website: String
  },
  category: String,
  accessLevel: String,
  eligibilityConditions: {
    requiresVerification: Boolean,
    requirements: [String]
  },
  benefits: [String],
  discountValue: String,
  validUntil: Date,
  claimLimit: Number,
  claimCount: Number,
  isActive: Boolean,
  tags: [String],
  redemptionInstructions: String
}, { timestamps: true });

const Deal = mongoose.models.Deal || mongoose.model('Deal', dealSchema);

const deals = [
  {
    title: "AWS Activate Credits - $100,000",
    shortDescription: "Get up to $100,000 in AWS credits for your startup infrastructure",
    description: "AWS Activate provides startups with the resources needed to get started on AWS. Receive AWS credits, technical support, and training to help accelerate your growth on the world's leading cloud platform.",
    partner: {
      name: "Amazon Web Services",
      logo: "https://logo.clearbit.com/aws.amazon.com",
      website: "https://aws.amazon.com/activate"
    },
    category: "cloud",
    accessLevel: "locked",
    eligibilityConditions: {
      requiresVerification: true,
      requirements: [
        "Must be an early-stage startup (less than 2 years old)",
        "Associated with a participating accelerator or VC",
        "Have a valid business entity"
      ]
    },
    benefits: [
      "$100,000 in AWS credits",
      "Technical support from AWS experts",
      "Access to AWS training and resources",
      "Valid for 2 years"
    ],
    discountValue: "$100,000 in credits",
    tags: ["cloud", "infrastructure", "hosting"],
    redemptionInstructions: "Apply through the AWS Activate portal with your verification code",
    claimCount: 0,
    isActive: true
  },
  {
    title: "Notion Team Plan - Free for 6 Months",
    shortDescription: "Premium workspace for your entire team at no cost",
    description: "Notion's all-in-one workspace helps you write, plan, collaborate, and get organized. Access unlimited blocks, file uploads, and team collaboration features completely free for 6 months.",
    partner: {
      name: "Notion",
      logo: "https://logo.clearbit.com/notion.so",
      website: "https://notion.so"
    },
    category: "productivity",
    accessLevel: "public",
    eligibilityConditions: {
      requiresVerification: false,
      requirements: ["Valid startup email address"]
    },
    benefits: [
      "Unlimited team members",
      "Unlimited blocks and file uploads",
      "Advanced permissions",
      "Version history",
      "Priority support"
    ],
    discountValue: "6 months free",
    tags: ["productivity", "collaboration", "documentation"],
    redemptionInstructions: "Sign up with the provided code on Notion's startup page",
    claimCount: 0,
    isActive: true
  },
  {
    title: "HubSpot for Startups - 90% Off",
    shortDescription: "Complete CRM and marketing platform at massive discount",
    description: "HubSpot's powerful CRM, marketing, sales, and service tools designed to help startups grow better. Get 90% off for your first year on eligible plans.",
    partner: {
      name: "HubSpot",
      logo: "https://logo.clearbit.com/hubspot.com",
      website: "https://hubspot.com/startups"
    },
    category: "marketing",
    accessLevel: "locked",
    eligibilityConditions: {
      requiresVerification: true,
      requirements: [
        "Series B or earlier",
        "Less than $2M in annual revenue",
        "Associated with a partner organization"
      ]
    },
    benefits: [
      "90% off CRM Suite for 1 year",
      "Access to all hubs (Marketing, Sales, Service)",
      "Dedicated startup support",
      "Training and onboarding resources"
    ],
    discountValue: "90% off year 1",
    tags: ["marketing", "crm", "sales"],
    redemptionInstructions: "Apply through HubSpot for Startups program",
    claimCount: 0,
    isActive: true
  },
  {
    title: "Stripe Atlas - $100 Credit",
    shortDescription: "Form your company and get banking set up with Stripe",
    description: "Stripe Atlas helps you incorporate your startup, get a US bank account, and start accepting payments in just a few clicks. Includes free tax consultation.",
    partner: {
      name: "Stripe",
      logo: "https://logo.clearbit.com/stripe.com",
      website: "https://stripe.com/atlas"
    },
    category: "finance",
    accessLevel: "public",
    eligibilityConditions: {
      requiresVerification: false,
      requirements: ["New company formation"]
    },
    benefits: [
      "$100 credit toward incorporation",
      "US bank account setup",
      "Stripe account with waived fees",
      "Free tax consultation",
      "Legal templates and guides"
    ],
    discountValue: "$100 credit",
    tags: ["legal", "finance", "incorporation"],
    redemptionInstructions: "Use promo code during Stripe Atlas signup",
    claimCount: 0,
    isActive: true
  },
  {
    title: "Segment - Free for 1 Year",
    shortDescription: "Customer data platform free for early-stage startups",
    description: "Segment is a customer data platform that helps you collect, clean, and control your customer data. Get the Team plan free for your first year as a startup.",
    partner: {
      name: "Segment",
      logo: "https://logo.clearbit.com/segment.com",
      website: "https://segment.com"
    },
    category: "analytics",
    accessLevel: "locked",
    eligibilityConditions: {
      requiresVerification: true,
      requirements: [
        "Raised less than $5M",
        "Company less than 2 years old"
      ]
    },
    benefits: [
      "Team plan free for 12 months",
      "Unlimited data sources",
      "200+ integrations",
      "Priority support"
    ],
    discountValue: "$120/year value",
    tags: ["analytics", "data", "integration"],
    redemptionInstructions: "Apply through Segment Startup Program",
    claimCount: 0,
    isActive: true
  },
  {
    title: "Figma Professional - 50% Off",
    shortDescription: "Design collaboration tool with startup discount",
    description: "Figma is the leading collaborative design tool for building meaningful products. Get 50% off Figma Professional for one year.",
    partner: {
      name: "Figma",
      logo: "https://logo.clearbit.com/figma.com",
      website: "https://figma.com"
    },
    category: "design",
    accessLevel: "public",
    eligibilityConditions: {
      requiresVerification: false,
      requirements: ["Startup with less than 50 employees"]
    },
    benefits: [
      "50% off Professional plan",
      "Unlimited files and projects",
      "Advanced prototyping",
      "Team libraries",
      "Version history"
    ],
    discountValue: "50% off for 1 year",
    tags: ["design", "collaboration", "prototyping"],
    redemptionInstructions: "Apply discount code at checkout",
    claimCount: 0,
    isActive: true
  },
  {
    title: "MongoDB Atlas - $500 Credits",
    shortDescription: "Cloud database platform with free credits",
    description: "MongoDB Atlas is a fully-managed cloud database service. Get $500 in credits to build faster with the developer data platform.",
    partner: {
      name: "MongoDB",
      logo: "https://logo.clearbit.com/mongodb.com",
      website: "https://mongodb.com/atlas"
    },
    category: "development",
    accessLevel: "public",
    eligibilityConditions: {
      requiresVerification: false,
      requirements: ["New Atlas account"]
    },
    benefits: [
      "$500 in Atlas credits",
      "Automated backups",
      "Global clusters",
      "Built-in security",
      "Technical support"
    ],
    discountValue: "$500 credits",
    tags: ["database", "cloud", "development"],
    redemptionInstructions: "Create account and apply promo code",
    claimCount: 0,
    isActive: true
  },
  {
    title: "Slack Standard Plan - Free for 3 Months",
    shortDescription: "Team communication platform for startups",
    description: "Slack brings team communication and collaboration into one place. Get the Standard plan free for 3 months to keep your team connected.",
    partner: {
      name: "Slack",
      logo: "https://logo.clearbit.com/slack.com",
      website: "https://slack.com"
    },
    category: "communication",
    accessLevel: "public",
    eligibilityConditions: {
      requiresVerification: false,
      requirements: ["New Slack workspace"]
    },
    benefits: [
      "Unlimited message history",
      "10+ app integrations per workspace",
      "Voice and video calls",
      "Screen sharing",
      "Two-factor authentication"
    ],
    discountValue: "3 months free",
    tags: ["communication", "collaboration", "messaging"],
    redemptionInstructions: "Upgrade workspace with promo code",
    claimCount: 0,
    isActive: true
  },
  {
    title: "Mailchimp - 12 Months Free",
    shortDescription: "Email marketing platform with extended free trial",
    description: "Mailchimp helps you design email marketing campaigns, automate messages, and track results. Perfect for startups building their audience.",
    partner: {
      name: "Mailchimp",
      logo: "https://logo.clearbit.com/mailchimp.com",
      website: "https://mailchimp.com"
    },
    category: "marketing",
    accessLevel: "public",
    eligibilityConditions: {
      requiresVerification: false,
      requirements: ["New account"]
    },
    benefits: [
      "Essentials plan free for 12 months",
      "Unlimited emails",
      "A/B testing",
      "Custom branding",
      "24/7 support"
    ],
    discountValue: "$299 value",
    tags: ["marketing", "email", "automation"],
    redemptionInstructions: "Sign up and apply startup code",
    claimCount: 0,
    isActive: true
  },
  {
    title: "Google Cloud Platform - $200,000 Credits",
    shortDescription: "Massive cloud credits for qualified startups",
    description: "Google Cloud offers startups cloud credits, technical training, and business support. Build on the same infrastructure that powers Google's products.",
    partner: {
      name: "Google Cloud",
      logo: "https://logo.clearbit.com/cloud.google.com",
      website: "https://cloud.google.com/startup"
    },
    category: "cloud",
    accessLevel: "locked",
    eligibilityConditions: {
      requiresVerification: true,
      requirements: [
        "Part of a qualifying accelerator or VC portfolio",
        "Series A or earlier",
        "First-time Google Cloud customer"
      ]
    },
    benefits: [
      "Up to $200,000 in cloud credits",
      "Technical training workshops",
      "1:1 architecture consultations",
      "24/7 technical support",
      "Startup community access"
    ],
    discountValue: "$200,000 credits",
    tags: ["cloud", "infrastructure", "machine-learning"],
    redemptionInstructions: "Apply through Google for Startups Cloud Program",
    claimCount: 0,
    isActive: true
  }
];

async function seedDatabase() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing deals
    await Deal.deleteMany();
    console.log('Cleared existing deals');

    // Insert new deals
    await Deal.insertMany(deals);
    console.log(`Inserted ${deals.length} deals successfully!`);

    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();