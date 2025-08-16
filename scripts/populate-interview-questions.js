const { MongoClient } = require('mongodb');
require('dotenv').config({ path: '.env.local' });

// Manual curation of high-quality React interview questions
const MANUAL_QUESTIONS = [
  // BEGINNER QUESTIONS
  {
    question: "What is React and what are its main features?",
    answer: "React is a JavaScript library for building user interfaces, particularly single-page applications. Its main features include: Virtual DOM for efficient rendering, Component-based architecture, JSX syntax, Unidirectional data flow, and Rich ecosystem.",
    explanation: "React was developed by Facebook and is one of the most popular frontend libraries. The Virtual DOM allows React to efficiently update only the parts of the UI that have changed, making it fast and performant.",
    difficulty: "beginner",
    category: ["React Fundamentals"],
    tags: ["react", "virtual-dom", "components", "jsx"],
    source: "Manual Curation",
    sourceUrl: "",
  },
  {
    question: "What is JSX and how does it work?",
    answer: "JSX (JavaScript XML) is a syntax extension for JavaScript that allows you to write HTML-like code in JavaScript. It gets transformed into regular JavaScript function calls by a transpiler like Babel.",
    explanation: "JSX makes React components more readable and allows you to write HTML-like syntax directly in your JavaScript code. It's not required to use React, but it's the recommended approach.",
    codeExample: `// JSX Example
const element = <h1>Hello, World!</h1>;

// Transpiled to:
const element = React.createElement('h1', null, 'Hello, World!');`,
    difficulty: "beginner",
    category: ["React Fundamentals"],
    tags: ["jsx", "babel", "transpilation"],
    source: "Manual Curation",
    sourceUrl: "",
  },
  {
    question: "What are React components and how do you create them?",
    answer: "React components are reusable UI pieces that can be either function components or class components. Function components are the modern way to write React components using hooks.",
    explanation: "Components are the building blocks of React applications. They can accept props, maintain state, and return JSX to describe what should be rendered.",
    codeExample: `// Function Component
function Welcome(props) {
  return <h1>Hello, {props.name}</h1>;
}

// Class Component
class Welcome extends React.Component {
  render() {
    return <h1>Hello, {this.props.name}</h1>;
  }
}`,
    difficulty: "beginner",
    category: ["React Fundamentals"],
    tags: ["components", "function-components", "class-components"],
    source: "Manual Curation",
    sourceUrl: "",
  },
  {
    question: "What are props in React?",
    answer: "Props (properties) are read-only data passed from parent to child components. They allow components to be reusable and configurable by accepting different data.",
    explanation: "Props are immutable and help maintain the unidirectional data flow in React. They can be any type of data: strings, numbers, objects, functions, etc.",
    codeExample: `// Parent component
function App() {
  return <Welcome name="John" age={25} />;
}

// Child component
function Welcome(props) {
  return <h1>Hello, {props.name}! You are {props.age} years old.</h1>;
}`,
    difficulty: "beginner",
    category: ["React Fundamentals"],
    tags: ["props", "data-flow", "immutable"],
    source: "Manual Curation",
    sourceUrl: "",
  },
  {
    question: "What is state in React and how do you use it?",
    answer: "State is a built-in object that contains data that may change over time. It's managed within the component and can be updated using setState (class components) or useState hook (function components).",
    explanation: "State is what makes React components interactive. When state changes, the component re-renders to reflect the new data.",
    codeExample: `// Using useState hook
import React, { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);
  
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>
        Increment
      </button>
    </div>
  );
}`,
    difficulty: "beginner",
    category: ["React Fundamentals"],
    tags: ["state", "useState", "hooks", "re-rendering"],
    source: "Manual Curation",
    sourceUrl: "",
  },
  {
    question: "What are React hooks and why were they introduced?",
    answer: "React hooks are functions that allow you to use state and other React features in function components. They were introduced to solve problems with class components like complex logic reuse and confusing lifecycle methods.",
    explanation: "Hooks make it easier to share stateful logic between components, avoid complex patterns like render props and HOCs, and make components more readable.",
    codeExample: `// useState hook
const [state, setState] = useState(initialValue);

// useEffect hook
useEffect(() => {
  // Side effect code
  return () => {
    // Cleanup code
  };
}, [dependencies]);`,
    difficulty: "beginner",
    category: ["Hooks"],
    tags: ["hooks", "useState", "useEffect", "function-components"],
    source: "Manual Curation",
    sourceUrl: "",
  },
  {
    question: "What is the useState hook and how do you use it?",
    answer: "useState is a React hook that allows you to add state to function components. It returns an array with the current state value and a function to update it.",
    explanation: "useState is the most basic hook and is used for managing local component state. It can be called multiple times in a single component for different state variables.",
    codeExample: `import React, { useState } from 'react';

function Example() {
  const [count, setCount] = useState(0);
  const [name, setName] = useState('');
  
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>
        Increment
      </button>
      <input 
        value={name} 
        onChange={(e) => setName(e.target.value)} 
      />
    </div>
  );
}`,
    difficulty: "beginner",
    category: ["Hooks"],
    tags: ["useState", "state", "hooks"],
    source: "Manual Curation",
    sourceUrl: "",
  },
  {
    question: "What is the useEffect hook and when do you use it?",
    answer: "useEffect is a React hook that lets you perform side effects in function components. It runs after every render and can be used for data fetching, subscriptions, or manually changing the DOM.",
    explanation: "useEffect replaces componentDidMount, componentDidUpdate, and componentWillUnmount from class components. It's essential for handling side effects in function components.",
    codeExample: `import React, { useState, useEffect } from 'react';

function Example() {
  const [data, setData] = useState(null);
  
  useEffect(() => {
    // Fetch data when component mounts
    fetch('/api/data')
      .then(response => response.json())
      .then(data => setData(data));
      
    // Cleanup function
    return () => {
      // Cleanup code here
    };
  }, []); // Empty dependency array = run only on mount
  
  return <div>{data ? data.title : 'Loading...'}</div>;
}`,
    difficulty: "beginner",
    category: ["Hooks"],
    tags: ["useEffect", "side-effects", "lifecycle", "data-fetching"],
    source: "Manual Curation",
    sourceUrl: "",
  },

  // INTERMEDIATE QUESTIONS
  {
    question: "What is the Virtual DOM and how does it work?",
    answer: "The Virtual DOM is a lightweight copy of the actual DOM that React uses to optimize rendering performance. When state changes, React creates a new Virtual DOM tree, compares it with the previous one, and updates only the differences in the real DOM.",
    explanation: "This diffing process is called reconciliation and is what makes React so efficient. Instead of updating the entire DOM, React only updates what has actually changed.",
    codeExample: `// React's Virtual DOM process:
// 1. State changes
// 2. New Virtual DOM created
// 3. Diff with previous Virtual DOM
// 4. Minimal real DOM updates

// Example of efficient updates
function TodoList({ todos }) {
  return (
    <ul>
      {todos.map(todo => (
        <li key={todo.id}>{todo.text}</li>
      ))}
    </ul>
  );
}`,
    difficulty: "intermediate",
    category: ["Performance"],
    tags: ["virtual-dom", "reconciliation", "performance", "diffing"],
    source: "Manual Curation",
    sourceUrl: "",
  },
  {
    question: "What are React keys and why are they important?",
    answer: "Keys are special string attributes that help React identify which items have changed, been added, or been removed. They should be unique among siblings and stable over time.",
    explanation: "Keys help React's reconciliation algorithm work efficiently by providing a stable identity to each element. Without keys, React might re-render more elements than necessary.",
    codeExample: `// Good: Using unique, stable keys
{todos.map(todo => (
  <li key={todo.id}>{todo.text}</li>
))}

// Bad: Using index as key
{todos.map((todo, index) => (
  <li key={index}>{todo.text}</li>
))}

// Bad: Using random keys
{todos.map(todo => (
  <li key={Math.random()}>{todo.text}</li>
))}`,
    difficulty: "intermediate",
    category: ["React Fundamentals"],
    tags: ["keys", "reconciliation", "performance", "lists"],
    source: "Manual Curation",
    sourceUrl: "",
  },
  {
    question: "What is the Context API and when should you use it?",
    answer: "The Context API is a React feature that allows you to share data between components without having to pass props down manually at every level. It's useful for global state like themes, user authentication, or language preferences.",
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
    difficulty: "intermediate",
    category: ["State Management"],
    tags: ["context", "useContext", "global-state", "prop-drilling"],
    source: "Manual Curation",
    sourceUrl: "",
  },
  {
    question: "What are React refs and when do you use them?",
    answer: "Refs provide a way to access DOM nodes or React elements created in the render method. They're useful for managing focus, text selection, media playback, triggering imperative animations, and integrating with third-party DOM libraries.",
    explanation: "Refs should be used sparingly as they break React's declarative paradigm. They're most commonly used for accessing DOM elements directly.",
    codeExample: `import React, { useRef, useEffect } from 'react';

function TextInputWithFocusButton() {
  const inputRef = useRef(null);
  
  const focusInput = () => {
    inputRef.current.focus();
  };
  
  return (
    <>
      <input ref={inputRef} type="text" />
      <button onClick={focusInput}>Focus Input</button>
    </>
  );
}`,
    difficulty: "intermediate",
    category: ["React Fundamentals"],
    tags: ["refs", "useRef", "dom-access", "imperative"],
    source: "Manual Curation",
    sourceUrl: "",
  },
  {
    question: "What is React.memo and how does it optimize performance?",
    answer: "React.memo is a higher-order component that memoizes your component. It prevents re-rendering if the props haven't changed, which can improve performance for expensive components.",
    explanation: "React.memo does a shallow comparison of props by default. You can provide a custom comparison function as the second argument for more control over when the component should re-render.",
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
    category: ["Performance"],
    tags: ["react.memo", "memoization", "performance", "re-rendering"],
    source: "Manual Curation",
    sourceUrl: "",
  },

  // ADVANCED QUESTIONS
  {
    question: "What are React Error Boundaries and how do you implement them?",
    answer: "Error Boundaries are React components that catch JavaScript errors anywhere in their child component tree and display a fallback UI instead of the component tree that crashed.",
    explanation: "Error Boundaries catch errors during rendering, in lifecycle methods, and in constructors of the whole tree below them. They don't catch errors in event handlers, async code, or server-side rendering.",
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
    difficulty: "advanced",
    category: ["Advanced Patterns"],
    tags: ["error-boundaries", "error-handling", "fallback-ui"],
    source: "Manual Curation",
    sourceUrl: "",
  },
  {
    question: "What are React Portals and when would you use them?",
    answer: "Portals provide a way to render children into a DOM node that exists outside the DOM hierarchy of the parent component. They're commonly used for modals, tooltips, and other overlays.",
    explanation: "Portals are useful when you need to render a component outside its parent's DOM container, such as rendering a modal that should appear on top of everything else.",
    codeExample: `import ReactDOM from 'react-dom';

function Modal({ children }) {
  return ReactDOM.createPortal(
    <div className="modal">
      {children}
    </div>,
    document.getElementById('modal-root')
  );
}

// Usage
function App() {
  return (
    <div>
      <h1>My App</h1>
      <Modal>
        <h2>Modal Content</h2>
      </Modal>
    </div>
  );
}`,
    difficulty: "advanced",
    category: ["Advanced Patterns"],
    tags: ["portals", "reactdom", "modals", "overlays"],
    source: "Manual Curation",
    sourceUrl: "",
  },
  {
    question: "What is the difference between controlled and uncontrolled components?",
    answer: "Controlled components have their state controlled by React, while uncontrolled components store their own state internally. Controlled components use props and callbacks, while uncontrolled components use refs to get form values.",
    explanation: "Controlled components are the recommended approach as they provide better control over form data and validation. Uncontrolled components can be simpler for basic forms but offer less control.",
    codeExample: `// Controlled Component
function ControlledInput() {
  const [value, setValue] = useState('');
  
  return (
    <input
      value={value}
      onChange={(e) => setValue(e.target.value)}
    />
  );
}

// Uncontrolled Component
function UncontrolledInput() {
  const inputRef = useRef();
  
  const handleSubmit = () => {
    console.log(inputRef.current.value);
  };
  
  return (
    <input
      ref={inputRef}
      defaultValue=""
    />
  );
}`,
    difficulty: "advanced",
    category: ["React Fundamentals"],
    tags: ["controlled", "uncontrolled", "forms", "state-management"],
    source: "Manual Curation",
    sourceUrl: "",
  },
  {
    question: "What are React HOCs (Higher-Order Components) and how do you create them?",
    answer: "HOCs are functions that take a component and return a new component with additional props or behavior. They're used for cross-cutting concerns like authentication, logging, or styling.",
    explanation: "HOCs are a pattern for reusing component logic. They're not part of the React API but are a pattern that emerges from React's compositional nature.",
    codeExample: `// HOC for authentication
function withAuth(WrappedComponent) {
  return function AuthenticatedComponent(props) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    
    useEffect(() => {
      // Check authentication status
      checkAuth().then(setIsAuthenticated);
    }, []);
    
    if (!isAuthenticated) {
      return <div>Please log in</div>;
    }
    
    return <WrappedComponent {...props} />;
  };
}

// Usage
const ProtectedComponent = withAuth(MyComponent);`,
    difficulty: "advanced",
    category: ["Advanced Patterns"],
    tags: ["hoc", "higher-order-components", "composition", "cross-cutting"],
    source: "Manual Curation",
    sourceUrl: "",
  },
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
}

// With multiple components
function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LazyComponent1 />
      <LazyComponent2 />
    </Suspense>
  );
}`,
    difficulty: "advanced",
    category: ["Performance"],
    tags: ["suspense", "lazy-loading", "code-splitting", "loading-states"],
    source: "Manual Curation",
    sourceUrl: "",
  },
];

// Question categories
const QUESTION_CATEGORIES = [
  {
    id: "react-fundamentals",
    name: "React Fundamentals",
    description: "Core React concepts including components, JSX, props, and state",
    icon: "⚛️",
    questionCount: 0,
  },
  {
    id: "hooks",
    name: "Hooks",
    description: "React hooks including useState, useEffect, and custom hooks",
    icon: "🎣",
    questionCount: 0,
  },
  {
    id: "performance",
    name: "Performance",
    description: "Performance optimization techniques and best practices",
    icon: "⚡",
    questionCount: 0,
  },
  {
    id: "state-management",
    name: "State Management",
    description: "State management patterns including Context API and Redux",
    icon: "📊",
    questionCount: 0,
  },
  {
    id: "advanced-patterns",
    name: "Advanced Patterns",
    description: "Advanced React patterns and techniques",
    icon: "🔧",
    questionCount: 0,
  },
  {
    id: "routing",
    name: "Routing",
    description: "Client-side routing with React Router",
    icon: "🛣️",
    questionCount: 0,
  },
  {
    id: "testing",
    name: "Testing",
    description: "Testing React components and applications",
    icon: "🧪",
    questionCount: 0,
  },
  {
    id: "deployment",
    name: "Deployment",
    description: "Building and deploying React applications",
    icon: "🚀",
    questionCount: 0,
  },
];

// Generate unique ID for questions
function generateQuestionId(question) {
  return question
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .replace(/\s+/g, "-")
    .substring(0, 50);
}

// Process and prepare questions for database
function processQuestionsForDatabase(questions) {
  return questions.map(question => {
    const cleanedQuestion = {
      ...question,
      question: question.question.trim(),
      answer: question.answer.trim(),
      explanation: question.explanation?.trim() || question.answer.trim(),
      difficulty: question.difficulty.toLowerCase(),
      category: question.category.map(cat => cat.trim()),
      tags: question.tags?.map(tag => tag.trim()) || [],
      source: question.source.trim(),
      sourceUrl: question.sourceUrl?.trim() || "",
    };
    
    return {
      ...cleanedQuestion,
      id: generateQuestionId(cleanedQuestion.question),
      createdAt: new Date(),
      updatedAt: new Date(),
      viewCount: 0,
      helpfulCount: 0,
      notHelpfulCount: 0,
    };
  });
}

// Update category question counts
function updateCategoryCounts(questions, categories) {
  const categoryCounts = {};
  
  questions.forEach(question => {
    question.category.forEach(cat => {
      categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
    });
  });
  
  return categories.map(category => ({
    ...category,
    questionCount: categoryCounts[category.name] || 0,
  }));
}

async function populateInterviewQuestions() {
  const uri = process.env.MONGODB_URI || "mongodb://localhost:27017";
  const dbName = process.env.MONGODB_DB_NAME || "job-board";
  
  const client = new MongoClient(uri);
  
  try {
    console.log("🔌 Connecting to MongoDB...");
    await client.connect();
    console.log("✅ Connected to MongoDB");
    
    const db = client.db(dbName);
    
    // Process questions
    const processedQuestions = processQuestionsForDatabase(MANUAL_QUESTIONS);
    const updatedCategories = updateCategoryCounts(processedQuestions, QUESTION_CATEGORIES);
    
    // Get collections
    const questionsCollection = db.collection("interview-questions");
    const categoriesCollection = db.collection("question-categories");
    
    // Clear existing data
    console.log("🧹 Clearing existing interview questions data...");
    await questionsCollection.deleteMany({});
    await categoriesCollection.deleteMany({});
    
    // Insert questions
    console.log(`📝 Inserting ${processedQuestions.length} interview questions...`);
    const questionsResult = await questionsCollection.insertMany(processedQuestions);
    console.log(`✅ Inserted ${questionsResult.insertedCount} questions`);
    
    // Insert categories
    console.log(`📝 Inserting ${updatedCategories.length} question categories...`);
    const categoriesResult = await categoriesCollection.insertMany(updatedCategories);
    console.log(`✅ Inserted ${categoriesResult.insertedCount} categories`);
    
    // Create indexes for performance
    console.log("🔍 Creating database indexes...");
    await questionsCollection.createIndex({ difficulty: 1 });
    await questionsCollection.createIndex({ category: 1 });
    await questionsCollection.createIndex({ tags: 1 });
    await questionsCollection.createIndex({ viewCount: -1 });
    await questionsCollection.createIndex({ createdAt: -1 });
    console.log("✅ Created database indexes");
    
    // Get statistics
    const totalQuestions = await questionsCollection.countDocuments();
    const beginnerCount = await questionsCollection.countDocuments({ difficulty: "beginner" });
    const intermediateCount = await questionsCollection.countDocuments({ difficulty: "intermediate" });
    const advancedCount = await questionsCollection.countDocuments({ difficulty: "advanced" });
    
    console.log("\n📊 Interview Questions Database Statistics:");
    console.log(`Total Questions: ${totalQuestions}`);
    console.log(`Beginner: ${beginnerCount}`);
    console.log(`Intermediate: ${intermediateCount}`);
    console.log(`Advanced: ${advancedCount}`);
    
    console.log("\n🎉 Interview questions database populated successfully!");
    
  } catch (error) {
    console.error("❌ Error populating interview questions:", error);
    process.exit(1);
  } finally {
    await client.close();
    console.log("🔌 Disconnected from MongoDB");
  }
}

// Run the script
if (require.main === module) {
  populateInterviewQuestions()
    .then(() => {
      console.log("✅ Script completed successfully");
      process.exit(0);
    })
    .catch((error) => {
      console.error("❌ Script failed:", error);
      process.exit(1);
    });
}

module.exports = { populateInterviewQuestions }; 