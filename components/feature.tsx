import {
    Users,
    Calendar,
    MessageCircle,
    Trophy,
    Target,
    Bell,
  } from "lucide-react";
  
  const features = [
    {
      Icon: Users,
      name: "Connect with Teams",
      description: "Find and join teams that match your interests and skills.",
      href: "/teams",
      cta: "Explore Teams",
      color:'purple',
      background: (
        <svg
          className="absolute -right-20 -top-20 opacity-10"
          width="200"
          height="200"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="100" cy="100" r="80" stroke="currentColor" fill="none" />
        </svg>
      ),
      className: "lg:col-start-1 lg:col-end-2 lg:row-start-1 lg:row-end-3",
    },
    {
      Icon: Calendar,
      name: "Discover Events",
      description: "Explore a wide range of events like hackathons and workshops.",
      href: "/events",
      cta: "View Events",
      color:'violet',
      background: (
        <svg
          className="absolute -right-20 -top-20 opacity-10"
          width="200"
          height="200"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M50,150 L150,50" stroke="currentColor" strokeWidth="2" />
        </svg>
      ),
      className: "lg:row-start-1 lg:row-end-4 lg:col-start-2 lg:col-end-3",
    },
    {
      Icon: MessageCircle,
      name: "Community Forums",
      description:
        "Engage in discussions, share knowledge, and get help from peers.",
      href: "/forums",
      cta: "Join Discussions",
      color:'blue',
      background: (
        <svg
          className="absolute -right-20 -top-20 opacity-10"
          width="200"
          height="200"
          xmlns="http://www.w3.org/2000/svg"
        >
          <polyline
            points="50,150 100,50 150,150"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          />
        </svg>
      ),
      className: "lg:col-start-1 lg:col-end-2 lg:row-start-3 lg:row-end-4",
    },
    {
      Icon: Trophy,
      name: "Participate in Challenges",
      description: "Showcase your skills and win prizes in exciting challenges.",
      href: "/challenges",
      cta: "Take Challenges",
      color:'blue',
      background: (
        <svg
          className="absolute -right-20 -top-20 opacity-10"
          width="200"
          height="200"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect x="50" y="50" width="100" height="100" stroke="currentColor" fill="none" />
        </svg>
      ),
      className: "lg:col-start-3 lg:col-end-3 lg:row-start-1 lg:row-end-2",
    },
    {
      Icon: Target,
      name: "Set Goals",
      description: "Define and track your professional goals effectively.",
      href: "/goals",
      cta: "Start Planning",
      color:'blue',
      background: (
        <svg
          className="absolute -right-20 -top-20 opacity-10"
          width="200"
          height="200"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="100" cy="100" r="60" stroke="currentColor" fill="none" />
          <circle cx="100" cy="100" r="30" stroke="currentColor" fill="none" />
        </svg>
      ),
      className: "lg:col-start-3 lg:col-end-3 lg:row-start-2 lg:row-end-4",
    },
  ];
  
  export default features;
  