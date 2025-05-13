import {
    Users,
    Calendar,
    MessageCircle,
    Trophy,
    Target,
    Bell,
    Code2,
    GitBranch,
    Lightbulb,
    Rocket,
    BookOpen,
    Sparkles,
  } from "lucide-react";
  
  const features = [
    {
      Icon: Users,
      name: "Team Collaboration",
      description: "Create and join teams to work on projects together. Share resources, track progress, and achieve goals as a team.",
      href: "/teams",
      cta: "Join Teams",
      color: 'purple',
      background: (
        <svg
          className="absolute -right-20 -top-20 opacity-10"
          width="200"
          height="200"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="100" cy="100" r="80" stroke="currentColor" fill="none" />
          <circle cx="100" cy="100" r="40" stroke="currentColor" fill="none" />
        </svg>
      ),
      className: "lg:col-start-1 lg:col-end-2 lg:row-start-1 lg:row-end-3",
    },
    {
      Icon: Code2,
      name: "Project Management",
      description: "Organize your development workflow with integrated project management tools and version control.",
      href: "/projects",
      cta: "Start Project",
      color: 'violet',
      background: (
        <svg
          className="absolute -right-20 -top-20 opacity-10"
          width="200"
          height="200"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M50,150 L150,50" stroke="currentColor" strokeWidth="2" />
          <path d="M50,50 L150,150" stroke="currentColor" strokeWidth="2" />
        </svg>
      ),
      className: "lg:row-start-1 lg:row-end-4 lg:col-start-2 lg:col-end-3",
    },
    {
      Icon: GitBranch,
      name: "Code Collaboration",
      description: "Seamlessly collaborate on code with integrated Git features, code reviews, and real-time pair programming.",
      href: "/code",
      cta: "Start Coding",
      color: 'blue',
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
          <polyline
            points="50,50 100,150 150,50"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          />
        </svg>
      ),
      className: "lg:col-start-1 lg:col-end-2 lg:row-start-3 lg:row-end-4",
    },
    {
      Icon: Lightbulb,
      name: "Learning Hub",
      description: "Access curated resources, tutorials, and documentation to enhance your development skills.",
      href: "/learn",
      cta: "Start Learning",
      color: 'amber',
      background: (
        <svg
          className="absolute -right-20 -top-20 opacity-10"
          width="200"
          height="200"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect x="50" y="50" width="100" height="100" stroke="currentColor" fill="none" />
          <circle cx="100" cy="100" r="30" stroke="currentColor" fill="none" />
        </svg>
      ),
      className: "lg:col-start-3 lg:col-end-3 lg:row-start-1 lg:row-end-2",
    },
    {
      Icon: Rocket,
      name: "Hackathons",
      description: "Participate in exciting hackathons, showcase your skills, and win amazing prizes.",
      href: "/hackathons",
      cta: "Join Hackathon",
      color: 'emerald',
      background: (
        <svg
          className="absolute -right-20 -top-20 opacity-10"
          width="200"
          height="200"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M50,150 L100,50 L150,150" stroke="currentColor" fill="none" />
          <path d="M75,100 L125,100" stroke="currentColor" fill="none" />
        </svg>
      ),
      className: "lg:col-start-3 lg:col-end-3 lg:row-start-2 lg:row-end-4",
    },
    {
      Icon: Sparkles,
      name: "Community Events",
      description: "Join workshops, meetups, and networking events to connect with fellow developers.",
      href: "/events",
      cta: "View Events",
      color: 'rose',
      background: (
        <svg
          className="absolute -right-20 -top-20 opacity-10"
          width="200"
          height="200"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="100" cy="100" r="60" stroke="currentColor" fill="none" />
          <circle cx="100" cy="100" r="30" stroke="currentColor" fill="none" />
          <circle cx="100" cy="100" r="10" stroke="currentColor" fill="none" />
        </svg>
      ),
      className: "lg:col-start-4 lg:col-end-4 lg:row-start-1 lg:row-end-3",
    },
  ];
  
  export default features;
  