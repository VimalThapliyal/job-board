import { ScrapingResult, InterviewQuestion } from "@/types/interview-question";
import { ADDITIONAL_QUESTIONS } from "./additional-questions";

// Manual questions - high quality, curated content
export const MANUAL_QUESTIONS: ScrapingResult[] = [
  // BEGINNER QUESTIONS
  {
    question: "What is React and what are its key features?",
    answer:
      "React is a JavaScript library for building user interfaces, particularly single-page applications. Key features include: Virtual DOM for efficient rendering, Component-based architecture for reusability, JSX for declarative UI, Unidirectional data flow, and Rich ecosystem with extensive tooling.",
    explanation:
      "React's component-based architecture makes it easy to build complex UIs from simple, reusable pieces. The Virtual DOM ensures efficient updates by minimizing actual DOM manipulations.",
    difficulty: "beginner",
    category: ["React Fundamentals"],
    tags: ["react", "components", "virtual-dom", "jsx"],
    source: "Manual Curation",
    sourceUrl: "",
  },
  {
    question: "What is the difference between state and props in React?",
    answer:
      "Props are read-only data passed from parent to child components, while state is mutable data managed within a component. Props are used for configuration and data flow, while state is used for component-specific data that can change over time.",
    explanation:
      "Understanding the difference between state and props is fundamental to React development. Props create a unidirectional data flow, while state enables components to be interactive and dynamic.",
    difficulty: "beginner",
    category: ["React Fundamentals"],
    tags: ["state", "props", "data-flow", "components"],
    source: "Manual Curation",
    sourceUrl: "",
  },
  {
    question: "What are React hooks and why were they introduced?",
    answer:
      "React hooks are functions that allow you to use state and other React features in functional components. They were introduced to solve problems with class components like complex logic reuse, wrapper hell, and hard-to-understand components.",
    explanation:
      "Hooks like useState, useEffect, useContext, and custom hooks provide a more direct way to use React features without classes, making code more readable and reusable.",
    difficulty: "beginner",
    category: ["React Hooks"],
    tags: ["hooks", "useState", "useEffect", "functional-components"],
    source: "Manual Curation",
    sourceUrl: "",
  },
  {
    question: "How do you use the useState hook?",
    answer:
      "useState is a hook that returns an array with two elements: the current state value and a function to update it. You can use it like: const [state, setState] = useState(initialValue). The setState function can accept a new value or a function that receives the previous state.",
    explanation:
      "useState is the most basic hook for managing local state in functional components. It's essential for making components interactive and dynamic.",
    difficulty: "beginner",
    category: ["React Hooks"],
    tags: ["useState", "state", "hooks", "functional-components"],
    source: "Manual Curation",
    sourceUrl: "",
  },
  {
    question: "What is the useEffect hook used for?",
    answer:
      "useEffect is used for side effects in functional components, such as data fetching, subscriptions, or manually changing the DOM. It runs after every render by default, but you can control when it runs by providing a dependency array.",
    explanation:
      "useEffect replaces componentDidMount, componentDidUpdate, and componentWillUnmount from class components, providing a unified way to handle side effects.",
    difficulty: "beginner",
    category: ["React Hooks"],
    tags: ["useEffect", "side-effects", "lifecycle", "hooks"],
    source: "Manual Curation",
    sourceUrl: "",
  },
  {
    question: "What are React keys and why are they important?",
    answer:
      "Keys are special string attributes that help React identify which items have changed, been added, or been removed in lists. They should be unique among siblings and stable across re-renders to help React efficiently update the DOM.",
    explanation:
      "Using keys properly is crucial for performance and preventing bugs when rendering lists of elements. Without keys, React may incorrectly update components or lose component state.",
    difficulty: "beginner",
    category: ["React Fundamentals"],
    tags: ["keys", "lists", "performance", "rendering"],
    source: "Manual Curation",
    sourceUrl: "",
  },
  {
    question: "What is JSX and how does it work?",
    answer:
      "JSX is a syntax extension for JavaScript that allows you to write HTML-like code in JavaScript. It gets transformed into React.createElement() calls during compilation, making it easier to write and understand React components.",
    explanation:
      "JSX combines the power of JavaScript with the familiarity of HTML, making React components more readable and maintainable.",
    difficulty: "beginner",
    category: ["React Fundamentals"],
    tags: ["jsx", "syntax", "components", "html"],
    source: "Manual Curation",
    sourceUrl: "",
  },
  {
    question: "What is the Virtual DOM and how does it work?",
    answer:
      "The Virtual DOM is a lightweight copy of the actual DOM that React uses to optimize rendering performance. When state changes, React creates a new Virtual DOM tree, compares it with the previous one (diffing), and updates only the necessary parts of the actual DOM.",
    explanation:
      "The Virtual DOM is React's secret weapon for performance. It minimizes expensive DOM operations by batching updates and only changing what's necessary.",
    difficulty: "beginner",
    category: ["React Fundamentals"],
    tags: ["virtual-dom", "performance", "rendering", "optimization"],
    source: "Manual Curation",
    sourceUrl: "",
  },
  {
    question:
      "What is the difference between controlled and uncontrolled components?",
    answer:
      "Controlled components have their form data handled by React state, while uncontrolled components let the DOM handle the form data internally. Controlled components provide more control but require more code.",
    explanation:
      "Controlled components are generally preferred as they provide better control over form data and validation, making them more predictable and easier to test.",
    difficulty: "beginner",
    category: ["React Fundamentals"],
    tags: [
      "controlled-components",
      "uncontrolled-components",
      "forms",
      "state",
    ],
    source: "Manual Curation",
    sourceUrl: "",
  },
  {
    question: "What is the Context API and when should you use it?",
    answer:
      "The Context API allows you to share data between components without explicitly passing props through every level. It's useful for global state like themes, user authentication, or language preferences. However, it should be used sparingly as it can make component reuse more difficult.",
    explanation:
      "Context is great for sharing data that is considered 'global' for a tree of React components, but overusing it can lead to complex component trees and make testing more difficult.",
    difficulty: "beginner",
    category: ["React Fundamentals"],
    tags: ["context", "global-state", "props-drilling", "data-sharing"],
    source: "Manual Curation",
    sourceUrl: "",
  },

  // INTERMEDIATE QUESTIONS
  {
    question: "What are React refs and when should you use them?",
    answer:
      "Refs provide a way to access DOM nodes or React elements created in the render method. They should be used sparingly for cases like managing focus, text selection, media playback, or integrating with third-party DOM libraries. Avoid using refs for anything that can be done declaratively.",
    explanation:
      "Refs are an escape hatch for imperative code in React's declarative world. They're powerful but should be used carefully to maintain React's declarative nature.",
    difficulty: "intermediate",
    category: ["React Fundamentals"],
    tags: ["refs", "dom-access", "imperative", "focus"],
    source: "Manual Curation",
    sourceUrl: "",
  },
  {
    question: "How do you optimize React component performance?",
    answer:
      "Several techniques include: using React.memo for component memoization, useMemo for expensive calculations, useCallback for function memoization, avoiding inline objects and functions in render, using proper keys in lists, and implementing shouldComponentUpdate or PureComponent for class components.",
    explanation:
      "Performance optimization in React is about preventing unnecessary re-renders and expensive calculations. The key is to identify bottlenecks and apply the right optimization technique.",
    difficulty: "intermediate",
    category: ["React Performance"],
    tags: ["performance", "memoization", "optimization", "re-renders"],
    source: "Manual Curation",
    sourceUrl: "",
  },
  {
    question: "What is the difference between useCallback and useMemo?",
    answer:
      "useCallback memoizes functions, preventing them from being recreated on every render unless dependencies change. useMemo memoizes values, preventing expensive calculations from running on every render. Use useCallback for functions passed as props to child components, and useMemo for expensive calculations.",
    explanation:
      "Both hooks help with performance optimization, but they serve different purposes. useCallback is for functions, useMemo is for values.",
    difficulty: "intermediate",
    category: ["React Hooks"],
    tags: ["useCallback", "useMemo", "memoization", "performance"],
    source: "Manual Curation",
    sourceUrl: "",
  },
  {
    question: "How do you handle errors in React components?",
    answer:
      "React provides Error Boundaries, which are class components that catch JavaScript errors anywhere in their child component tree and display a fallback UI. You can also use try-catch blocks in event handlers and async operations. For functional components, you can create custom error handling hooks.",
    explanation:
      "Error boundaries are React's way of handling errors gracefully without crashing the entire application. They're essential for production applications.",
    difficulty: "intermediate",
    category: ["React Fundamentals"],
    tags: ["error-boundaries", "error-handling", "fallback-ui", "try-catch"],
    source: "Manual Curation",
    sourceUrl: "",
  },
  {
    question: "What is React Router and how do you use it?",
    answer:
      "React Router is a library for handling routing in React applications. It provides components like BrowserRouter, Route, Switch, and Link for creating single-page applications with multiple views. You can use hooks like useParams, useNavigate, and useLocation for programmatic navigation.",
    explanation:
      "React Router enables client-side routing, allowing users to navigate between different views without full page reloads, creating a smooth user experience.",
    difficulty: "intermediate",
    category: ["React Routing"],
    tags: ["react-router", "routing", "navigation", "spa"],
    source: "Manual Curation",
    sourceUrl: "",
  },
  {
    question: "How do you test React components?",
    answer:
      "Common testing approaches include: Jest for test running and assertions, React Testing Library for component testing with user-centric queries, Enzyme for component manipulation, and Cypress for end-to-end testing. Focus on testing behavior rather than implementation details.",
    explanation:
      "Testing React components ensures your application works correctly and prevents regressions. The key is to test what users see and do, not internal implementation details.",
    difficulty: "intermediate",
    category: ["React Testing"],
    tags: ["testing", "jest", "react-testing-library", "cypress"],
    source: "Manual Curation",
    sourceUrl: "",
  },
  {
    question: "What are custom hooks and how do you create them?",
    answer:
      "Custom hooks are functions that use React hooks and follow the 'use' naming convention. They allow you to extract component logic into reusable functions. Custom hooks can use any React hooks and can accept parameters and return values.",
    explanation:
      "Custom hooks are a powerful way to share stateful logic between components without changing their hierarchy. They're essential for building reusable React logic.",
    difficulty: "intermediate",
    category: ["React Hooks"],
    tags: ["custom-hooks", "reusability", "logic-extraction", "hooks"],
    source: "Manual Curation",
    sourceUrl: "",
  },
  {
    question: "How do you handle forms in React?",
    answer:
      "React forms can be handled using controlled components with state management, form libraries like Formik or React Hook Form for complex forms, and HTML5 validation or custom validation logic. Controlled components provide the most control but require more code.",
    explanation:
      "Form handling in React requires careful state management and validation. The choice between controlled components and form libraries depends on complexity and requirements.",
    difficulty: "intermediate",
    category: ["React Fundamentals"],
    tags: ["forms", "controlled-components", "validation", "formik"],
    source: "Manual Curation",
    sourceUrl: "",
  },
  {
    question:
      "What is the difference between shallow and deep comparison in React?",
    answer:
      "Shallow comparison checks if two values are the same reference (===), while deep comparison checks if two objects have the same content regardless of reference. React uses shallow comparison by default, which is why you need to be careful with objects and arrays in state.",
    explanation:
      "Understanding shallow vs deep comparison is crucial for avoiding bugs in React. Shallow comparison is fast but can miss changes in nested objects.",
    difficulty: "intermediate",
    category: ["React Fundamentals"],
    tags: ["comparison", "shallow", "deep", "objects", "arrays"],
    source: "Manual Curation",
    sourceUrl: "",
  },
  {
    question: "How do you implement authentication in React?",
    answer:
      "Authentication can be implemented using JWT tokens stored in localStorage or cookies, OAuth providers like Google or GitHub, authentication services like Auth0 or Firebase Auth, or custom backend authentication. You'll need to manage authentication state and protect routes.",
    explanation:
      "Authentication is a complex topic that involves state management, route protection, and security considerations. The approach depends on your backend and security requirements.",
    difficulty: "intermediate",
    category: ["React Security"],
    tags: ["authentication", "jwt", "oauth", "auth0", "security"],
    source: "Manual Curation",
    sourceUrl: "",
  },

  // ADVANCED QUESTIONS
  {
    question: "What is React Suspense and how does it work?",
    answer:
      "React Suspense is a component that lets you wrap components that might not be ready to render and display a fallback UI. It's primarily used for code splitting with React.lazy() and will be used for data fetching in future versions. Suspense enables better loading states and error boundaries.",
    explanation:
      "Suspense is React's solution for handling asynchronous operations in a declarative way. It's part of React's concurrent features and enables better user experiences.",
    difficulty: "advanced",
    category: ["React Advanced"],
    tags: ["suspense", "code-splitting", "lazy-loading", "concurrent"],
    source: "Manual Curation",
    sourceUrl: "",
  },
  {
    question: "How do you implement server-side rendering (SSR) in React?",
    answer:
      "SSR can be implemented using Next.js, Gatsby, or custom solutions with Express and ReactDOMServer. SSR improves SEO, initial page load performance, and user experience. You need to handle hydration, data fetching, and ensure components work in both server and client environments.",
    explanation:
      "SSR is complex but provides significant benefits for SEO and performance. Next.js provides the easiest implementation with built-in SSR support.",
    difficulty: "advanced",
    category: ["React Advanced"],
    tags: ["ssr", "nextjs", "seo", "performance", "hydration"],
    source: "Manual Curation",
    sourceUrl: "",
  },
  {
    question: "What are React Portals and when should you use them?",
    answer:
      "React Portals allow you to render children into a DOM node that exists outside the parent component's DOM hierarchy. They're useful for modals, tooltips, and other overlays that need to break out of container CSS (like overflow: hidden or z-index).",
    explanation:
      "Portals are essential for UI components that need to render outside their parent container. They're commonly used for modals and overlays.",
    difficulty: "advanced",
    category: ["React Advanced"],
    tags: ["portals", "modals", "overlays", "dom-manipulation"],
    source: "Manual Curation",
    sourceUrl: "",
  },
  {
    question: "How do you implement code splitting in React?",
    answer:
      "Code splitting can be implemented using React.lazy() with Suspense, dynamic imports with webpack, or route-based splitting. It reduces initial bundle size by splitting code into smaller chunks that are loaded on demand. This improves initial page load performance.",
    explanation:
      "Code splitting is crucial for large applications to maintain good performance. React.lazy() provides a simple way to implement it.",
    difficulty: "advanced",
    category: ["React Performance"],
    tags: ["code-splitting", "lazy-loading", "performance", "webpack"],
    source: "Manual Curation",
    sourceUrl: "",
  },
  {
    question: "What is the React Context API and how does it work internally?",
    answer:
      "The Context API uses a Provider-Consumer pattern where the Provider component supplies data to all Consumer components in its tree. Internally, it uses a subscription model where components subscribe to context changes. Context is designed for data that is considered 'global' for a tree of components.",
    explanation:
      "Understanding Context's internal workings helps you use it effectively and avoid common pitfalls like unnecessary re-renders.",
    difficulty: "advanced",
    category: ["React Advanced"],
    tags: ["context", "provider", "consumer", "subscription"],
    source: "Manual Curation",
    sourceUrl: "",
  },
  {
    question: "How do you implement infinite scrolling in React?",
    answer:
      "Infinite scrolling can be implemented using Intersection Observer API, scroll event listeners, or libraries like react-infinite-scroll-component. You need to detect when the user reaches the bottom, fetch more data, and append it to the existing list while maintaining scroll position.",
    explanation:
      "Infinite scrolling provides a smooth user experience for large datasets. The key is efficient data fetching and maintaining scroll position.",
    difficulty: "advanced",
    category: ["React Advanced"],
    tags: [
      "infinite-scroll",
      "intersection-observer",
      "pagination",
      "performance",
    ],
    source: "Manual Curation",
    sourceUrl: "",
  },
  {
    question: "What are React Concurrent Features and how do they work?",
    answer:
      "Concurrent Features include features like Suspense, useTransition, useDeferredValue, and automatic batching. They allow React to interrupt, pause, and resume work as needed, enabling better user experiences with non-blocking updates and improved loading states.",
    explanation:
      "Concurrent Features represent React's evolution toward better user experiences. They enable more responsive applications by making updates non-blocking.",
    difficulty: "advanced",
    category: ["React Advanced"],
    tags: ["concurrent", "suspense", "useTransition", "batching"],
    source: "Manual Curation",
    sourceUrl: "",
  },
  {
    question: "How do you implement real-time updates in React?",
    answer:
      "Real-time updates can be implemented using WebSockets, Server-Sent Events (SSE), or polling. You'll need to manage connection state, handle reconnection logic, and update the UI efficiently. Libraries like Socket.io or native WebSocket API can be used.",
    explanation:
      "Real-time updates require careful state management and connection handling. The choice of technology depends on your backend and requirements.",
    difficulty: "advanced",
    category: ["React Advanced"],
    tags: ["websockets", "real-time", "sse", "polling"],
    source: "Manual Curation",
    sourceUrl: "",
  },
  {
    question: "What is React's reconciliation algorithm and how does it work?",
    answer:
      "Reconciliation is React's algorithm for determining what has changed in the Virtual DOM. It uses a diffing algorithm that compares the previous Virtual DOM tree with the new one and determines the minimal set of changes needed to update the actual DOM. It uses heuristics to optimize the comparison process.",
    explanation:
      "Understanding reconciliation helps you write more efficient React code and avoid common performance pitfalls.",
    difficulty: "advanced",
    category: ["React Advanced"],
    tags: ["reconciliation", "virtual-dom", "diffing", "algorithm"],
    source: "Manual Curation",
    sourceUrl: "",
  },
  {
    question:
      "How do you implement state management in large React applications?",
    answer:
      "For large applications, consider Redux, Zustand, or React Query for global state management. Use Context API sparingly for truly global state. Implement proper state architecture with clear data flow, avoid prop drilling, and consider using state machines for complex state logic.",
    explanation:
      "State management in large applications requires careful architecture. The choice depends on complexity, team size, and specific requirements.",
    difficulty: "advanced",
    category: ["React Advanced"],
    tags: ["state-management", "redux", "zustand", "architecture"],
    source: "Manual Curation",
    sourceUrl: "",
  },

  // 🆕 NEW QUESTION EXAMPLE - Copy this structure for your questions
  {
    question: "What is React.memo and when should you use it?",
    answer:
      "React.memo is a higher-order component that memoizes your component. It prevents re-rendering if the props haven't changed, which can improve performance for expensive components.",
    explanation:
      "React.memo does a shallow comparison of props by default. You can provide a custom comparison function as the second argument for more control over when the component should re-render.",
    codeExample: `// Basic usage
const MyComponent = React.memo(function MyComponent(props) {
  return <div>{props.name}</div>;
});

// With custom comparison
const MyComponent = React.memo(function MyComponent(props) {
  return <div>{props.name}</div>;
}, (prevProps, nextProps) => {
  // Return true if you don't want the component to update
  return prevProps.name === nextProps.name;
});`,
    difficulty: "intermediate",
    category: ["React Performance"],
    tags: ["react.memo", "memoization", "performance", "re-rendering"],
    source: "Manual Curation",
    sourceUrl: "",
  },
];

// Combined manual questions (original + additional)
export const ALL_MANUAL_QUESTIONS: ScrapingResult[] = [
  ...MANUAL_QUESTIONS,
  ...ADDITIONAL_QUESTIONS,
];

// Simplified function that only returns manual questions
export async function scrapeInterviewQuestions(): Promise<ScrapingResult[]> {
  console.log("📚 Using manually curated interview questions...");
  console.log(`📊 Total questions available: ${ALL_MANUAL_QUESTIONS.length}`);
  return ALL_MANUAL_QUESTIONS;
}

// Helper function to process questions for database
export function processQuestionsForDatabase(
  questions: ScrapingResult[]
): InterviewQuestion[] {
  return questions.map((question) => ({
    id: generateQuestionId(question.question),
    question: question.question,
    answer: question.answer,
    explanation: question.explanation || question.answer,
    codeExample: question.codeExample || "",
    difficulty: question.difficulty as "beginner" | "intermediate" | "advanced",
    category: question.category,
    tags: question.tags || [],
    source: question.source,
    sourceUrl: question.sourceUrl || "",
    createdAt: new Date(),
    updatedAt: new Date(),
    viewCount: 0,
    helpfulCount: 0,
    notHelpfulCount: 0,
  }));
}

// Helper function to generate question ID
function generateQuestionId(question: string): string {
  return question
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .replace(/\s+/g, "-")
    .substring(0, 50);
}
