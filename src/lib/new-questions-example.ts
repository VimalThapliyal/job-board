import { ScrapingResult } from "@/types/interview-question";

// 🆕 EXAMPLE: How to add new interview questions
// Copy this structure and add your questions to src/lib/interview-scraper.ts

export const NEW_QUESTIONS_EXAMPLE: ScrapingResult[] = [
  // BEGINNER QUESTION EXAMPLE
  {
    question: "What is React Context and when should you use it?",
    answer: "React Context is a feature that allows you to share data between components without having to pass props down manually at every level. It's useful for global state like themes, user authentication, or language preferences.",
    explanation: "Context is designed to share data that can be considered 'global' for a tree of React components. It's an alternative to prop drilling and can be used with or without Redux.",
    codeExample: `// Create a context
const ThemeContext = React.createContext('light');

// Provider component
function App() {
  const [theme, setTheme] = useState('light');
  
  return (
    <ThemeContext.Provider value={theme}>
      <MainApp />
    </ThemeContext.Provider>
  );
}

// Consumer component
function ThemedButton() {
  const theme = useContext(ThemeContext);
  return <button className={theme}>Themed Button</button>;
}`,
    difficulty: "beginner",
    category: ["React Fundamentals"],
    tags: ["context", "useContext", "global-state", "prop-drilling"],
    source: "Manual Curation",
    sourceUrl: "",
  },

  // INTERMEDIATE QUESTION EXAMPLE
  {
    question: "How do you implement error boundaries in React?",
    answer: "Error boundaries are React components that catch JavaScript errors anywhere in their child component tree and display a fallback UI instead of the component tree that crashed.",
    explanation: "Error boundaries catch errors during rendering, in lifecycle methods, and in constructors of the whole tree below them. They don't catch errors in event handlers, async code, or server-side rendering.",
    codeExample: `class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.log('Error:', error);
    console.log('Error Info:', errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <h1>Something went wrong.</h1>;
    }

    return this.props.children;
  }
}

// Usage
<ErrorBoundary>
  <MyComponent />
</ErrorBoundary>`,
    difficulty: "intermediate",
    category: ["React Fundamentals"],
    tags: ["error-boundaries", "error-handling", "fallback-ui"],
    source: "Manual Curation",
    sourceUrl: "",
  },

  // ADVANCED QUESTION EXAMPLE
  {
    question: "What is React Suspense and how does it work?",
    answer: "React Suspense is a component that lets you wrap components that might not be ready to render and display a fallback while they're loading. It's primarily used for code splitting and data fetching.",
    explanation: "Suspense allows you to handle loading states declaratively and provides a better user experience by showing loading indicators while components are being prepared.",
    codeExample: `import React, { Suspense } from 'react';

// Lazy loaded component
const LazyComponent = React.lazy(() => import('./LazyComponent'));

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LazyComponent />
    </Suspense>
  );
}`,
    difficulty: "advanced",
    category: ["React Advanced"],
    tags: ["suspense", "lazy-loading", "code-splitting", "loading-states"],
    source: "Manual Curation",
    sourceUrl: "",
  },
];

// 📝 INSTRUCTIONS:
// 1. Copy the question structure above
// 2. Add your questions to src/lib/interview-scraper.ts in the MANUAL_QUESTIONS array
// 3. Follow the existing format and structure
// 4. Choose appropriate difficulty: "beginner", "intermediate", or "advanced"
// 5. Select relevant categories from: ["React Fundamentals", "React Hooks", "React Performance", "React Testing", "React Routing", "React Security", "React Advanced"]
// 6. Add relevant tags for better searchability
// 7. Run the application to test your new questions 