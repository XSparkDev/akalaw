# AKA LAW - Anchané Kriek Attorneys Website

## Project Overview

This is a professional law firm website for AKA LAW (Anchané Kriek Attorneys), a dynamic South African law firm based in Pretoria. The website showcases the firm's expertise, team, and services with a modern, animated single-page design.

## Design System

### Brand Identity
- **Firm Name**: AKA LAW - Anchané Kriek Attorneys
- **Tagline**: "Recognised for delivering exceptional legal services with precision, integrity, and strategic insight"
- **Established**: Since 2002
- **Location**: Pretoria, South Africa

### Color Palette
- **Primary Color**: `#2A482A` (Dark Green)
- **Primary Variants**: 
  - 50: `#E8EEE8`
  - 100: `#D1DDD1`
  - 200: `#A3BBA3`
  - 300: `#769976`
  - 400: `#4A774A`
  - 500: `#2A482A` (Base)
  - 600: `#223A22`
  - 700: `#1A2D1A`
  - 800: `#121F12`
  - 900: `#0A110A`
  - 950: `#050805`
- **Background**: `#F9FAFB` (Gray-50)
- **Text Colors**: Gray-900, Gray-700, Gray-600

### Typography
- **Headings**: Bold, large scale (text-4xl to text-6xl)
- **Body Text**: text-lg with relaxed leading
- **Accent Text**: Uppercase, tracked, small font-weight-semibold

## Website Structure

### Navigation Menu (Fixed Header)
1. Home
2. About
3. Expertise
4. Team
5. News
6. Contact

### Page Sections

#### 1. Hero Section
- **Content**: Main headline with brand message
- **Statistics**: 456K Case Wins, 253K Clients, 368K Coffees
- **CTA Buttons**: "Get Free Quote" (primary), "Explore More" (outline)
- **Image**: Modern office building interior with glass ceiling

#### 2. About Us Section
- **Background**: Primary color with circular design element
- **Content**: Company overview and values
- **Layout**: Two-column with decorative circle element

#### 3. Expertise Section
- **Background**: Gray-50
- **Services**:
  1. **Real Estate and Property** (Home icon)
     - Conveyancing, property disputes, lease agreements
     - International purchaser services
  2. **Corporate Law** (Building icon)
     - Company formation, governance, M&A
     - Shareholders agreements, company secretarial services
  3. **Deceased Estate** (Users icon)
     - Estate administration, wills and testaments
     - Asset distribution, dispute resolution
  4. **Trust Registration (Asset Management)** (FileText icon)
     - Trust setup and compliance
     - Asset management and distribution

#### 4. Team Section
- **Background**: White
- **Team Members**:
  1. **Anchané Kriek** - Founding Attorney
     - Specialties: Corporate Law, Property Law
     - Contact: anchane@akalaw.co.za, +27 12 345 6789
  2. **Michael Ndlovu** - Senior Associate
     - Specialties: Real Estate Law, Trust Registration
     - Contact: michael@akalaw.co.za, +27 12 345 6780
  3. **Sarah van der Merwe** - Associate Attorney
     - Specialties: Deceased Estates, Asset Management
     - Contact: sarah@akalaw.co.za, +27 12 345 6781
  4. **Thabo Molefe** - Associate Attorney
     - Specialties: Corporate Law, Mergers & Acquisitions
     - Contact: thabo@akalaw.co.za, +27 12 345 6782

## Technical Implementation

### Framework & Libraries
- **Next.js** (App Router)
- **React** with TypeScript
- **Tailwind CSS** for styling
- **Shadcn/UI** components
- **Lucide React** for icons

### Key Features
- **Fixed Header**: Transparent on scroll with backdrop blur
- **Smooth Scrolling**: Navigation links scroll to sections
- **Animations**: 
  - Intersection Observer for scroll-triggered animations
  - Staggered loading animations
  - Hover effects and transitions
- **Responsive Design**: Mobile-first approach
- **Performance Optimized**: Hardware-accelerated animations

### Animation System
- **Loading Animations**: Staggered fade-in effects with delays
- **Scroll Animations**: Elements animate when entering viewport
- **Hover Effects**: Scale, color, and shadow transitions
- **Keyframes**:
  - `fadeInUp`: Opacity 0→1, translateY 2rem→0
  - `fadeInRight`: Opacity 0→1, translateX 2rem→0
  - `fadeInLeft`: Opacity 0→1, translateX 1rem→0
  - `scaleX`: Scale from 0 to 1 on X-axis

### File Structure
\`\`\`
app/
├── page.tsx (Main homepage)
├── globals.css
└── layout.tsx
components/
└── ui/ (Shadcn components)
public/
└── images/
    ├── aka-law-logo.png
    └── modern-office-hero.png
tailwind.config.ts
\`\`\`

### Assets
- **Logo**: AKA LAW logo with gavel icon
- **Hero Image**: Modern office interior with glass architecture
- **Team Images**: Professional headshots (placeholder URLs)

## Content Guidelines

### Tone of Voice
- Professional and authoritative
- Approachable and trustworthy
- Clear and concise
- Empathetic (especially for deceased estates)

### Key Messages
- Precision, integrity, and strategic insight
- Simplifying complex legal matters
- Empowering informed decisions
- Long-term partnerships
- Innovation and efficiency

## Development Notes

### State Management
- `isScrolled`: Controls header transparency
- `visibleElements`: Tracks animated elements in viewport

### Performance Considerations
- Intersection Observer for efficient scroll detection
- CSS transforms for hardware acceleration
- Optimized images with Next.js Image component
- Minimal JavaScript for animations

### Browser Support
- Modern browsers with CSS Grid and Flexbox support
- Backdrop-filter support for header blur effect
- Intersection Observer API support

## Maintenance Guidelines

### Content Updates
- Team member information in `teamMembers` array
- Expertise areas in `expertiseAreas` array
- Statistics in hero section
- Contact information and social media links

### Design Consistency
- Always use defined color palette
- Maintain animation timing consistency
- Follow established spacing patterns
- Use consistent hover effects

### Performance Monitoring
- Monitor animation performance on mobile devices
- Ensure smooth scrolling on all devices
- Optimize images for web delivery

---

**Important**: This README file should not be modified unless explicitly requested. It serves as the definitive reference for the AKA LAW website project specifications and implementation details.
