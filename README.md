# EventConnect

EventConnect is a modern, full-stack web application for creating, managing, and participating in events, with integrated video conferencing capabilities. Built with Next.js, Prisma, and PostgreSQL, it offers a seamless experience for event organizers and participants.

![EventConnect](https://i.sstatic.net/y9DpT.jpg)

## Features

- **User Authentication**: Secure login and registration system
- **Event Management**: Create, edit, and manage public or private events
- **Video Conferencing**: Integrated real-time video meetings using ZegoCloud
- **Event Analytics**: Track participation, engagement, and other metrics
- **Certificate Generation**: Generate and download certificates for event participation
- **Responsive Design**: Beautiful UI that works on all devices
- **Real-time Notifications**: Stay updated with event changes and activities

## Application Structure

### App Directory (`/app`)
- **API Routes** (`/app/api`): RESTful endpoints for events, authentication, certificates, and ZegoCloud integration
- **Authentication** (`/app/auth`): NextAuth.js implementation for secure user authentication
- **Account Management** (`/app/account`): User dashboard, event management, notifications, and settings
- **Video Conferencing** (`/app/video-call`): ZegoCloud integration for real-time video meetings
- **Cron Jobs** (`/app/cron`): Scheduled tasks for event reminders and cleanup

### Components (`/components`)
- **UI Components** (`/components/ui`): Extensive library of 35+ reusable UI components including:
  - Interactive elements (Button, Dialog, Dropdown)
  - Layout components (Card, BentoGrid, Table)
  - Animated components (TextAnimate, BorderBeam, HoverBorderGradient)
  - Data visualization (Chart)
- **Dashboard Components** (`/components/dashboard`): Overview, recent activities, and event listings
- **Event Management** (`/components/event-tab`, `/components/joined-tab`): Components for creating and participating in events
- **Landing Page** (`Hero.tsx`, `FeatureCard.tsx`, etc.): Modern, animated landing page components
- **Notifications** (`/components/notification`): Real-time notification system

### Hooks (`/hooks`)
- **Responsive Design** (`use-mobile.tsx`): Custom hook for responsive layouts across devices
- **Toast Notifications** (`use-toast.ts`): Toast notification system for user feedback

## Tech Stack

- **Frontend**: Next.js 15, React 19, TailwindCSS, Radix UI
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: PostgreSQL
- **Authentication**: NextAuth.js
- **Video Conferencing**: ZegoCloud
- **Styling**: TailwindCSS, Framer Motion
- **Analytics**: Vercel Analytics, Speed Insights

## Getting Started

### Prerequisites

- Node.js 18+ 
- PostgreSQL database
- Zego Cloud account (for video conferencing)

### Environment Setup

Create a `.env` file in the root directory and content to .env.example file. 
```bash
    cp .env.example .env
```

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/eventconnect.git
   cd eventconnect
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up the database:
   ```bash
   npx prisma migrate dev
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

### Creating an Event

1. Log in to your account
2. Navigate to the dashboard
3. Click "Create Event"
4. Fill in event details including name, description, date/time, and whether it's online
5. For online events, a meeting ID will be automatically generated

### Joining an Event

1. Browse available events on the homepage
2. Click on an event to view details
3. Click "Join Event" to participate
4. For online events, you'll be redirected to the video conference room

### Video Conferencing

- Online events use ZegoCloud for high-quality video conferencing
- Features include screen sharing, chat, and participant management
- Meeting hosts can control participant access and end meetings

### User Dashboard

- **Overview**: See your participation statistics and upcoming events
- **Event Management**: Create, edit, and manage your events
- **Notifications**: View and manage your notifications
- **Reports**: Access analytics for your events
- **Settings**: Update your profile and preferences

## Deployment

The easiest way to deploy EventConnect is using the [Vercel Platform](https://vercel.com):

1. Push your code to a GitHub repository
2. Import the project to Vercel
3. Add the required environment variables
4. Deploy

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
