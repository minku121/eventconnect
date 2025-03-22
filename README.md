# EventConnect

EventConnect is a comprehensive event management platform built with modern web technologies, enabling users to create, discover, and participate in events with ease. The platform features a robust event management system with public/private event controls, participant tracking, and real-time updates.

![EventConnect](https://i.sstatic.net/y9DpT.jpg)

## Key Features

- **Event Discovery**: Browse and filter events with paginated listings
- **Event Participation**: Join public events or private events with PIN protection
- **Participant Management**: Track participant counts and seat availability
- **Event Details**: Comprehensive event information including location, time, organizer, and status
- **Responsive UI**: Mobile-friendly interface with smooth animations
- **Real-time Updates**: Instant feedback on event participation status
- **Loading States**: Smooth transitions and loading indicators for better UX

## Core Functionality

### Event Management
- Create and manage events with detailed information
- Set maximum participants for private events
- Track real-time participant counts
- Display event status (Public/Private) with visual indicators

### User Interaction
- Join events with one-click functionality
- Handle concurrent join requests with loading states
- Prevent duplicate participation
- Restrict event creators from joining their own events

### UI Components
- Paginated event listings with navigation controls
- Event cards with:
  - Event name and status badge
  - Location and timing information
  - Organizer details
  - Participant count and seat availability
- Responsive grid layout for event display
- Loading skeletons for smooth content transitions

## Technical Implementation

### Frontend Architecture
- Built with Next.js 15 and React 19
- State management using React hooks (useState, useEffect, useCallback)
- API integration with fetch and error handling
- Session management with NextAuth.js
- Responsive design with TailwindCSS
- Icon integration from Lucide and Radix UI

### Backend Integration
- RESTful API endpoints for:
  - Event listing with pagination
  - Event participation
  - User authentication
- Data fetching with retry mechanism
- Error handling with toast notifications
- Session-based user authentication

### Performance Optimization
- Paginated data loading
- Caching loaded pages
- Loading state management
- Error boundary handling
- Efficient re-rendering with memoization

## Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL database
- NextAuth.js configuration

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

5. Access the application at [http://localhost:3000](http://localhost:3000)

## Usage

### Browsing Events
1. Visit the events page
2. Browse through paginated event listings
3. View event details by clicking on an event card

### Joining Events
1. Click "Join Now" on an available event
2. For private events, enter the required PIN
3. View real-time updates on participation status

### Event Management
1. Create events with detailed information
2. Set participant limits for private events
3. Track event participation in real-time

## Deployment

The application can be deployed using Vercel:

1. Push your code to a GitHub repository
2. Import the project to Vercel
3. Configure environment variables
4. Deploy the application

## Contributing

Contributions are welcome! Please follow these guidelines:
1. Fork the repository
2. Create a new feature branch
3. Submit a pull request with detailed description

## License

This project is licensed under the MIT License - see the LICENSE file for details.
