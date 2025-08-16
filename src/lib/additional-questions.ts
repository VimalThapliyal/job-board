import { ScrapingResult } from "@/types/interview-question";

// Additional manual questions to expand the database
export const ADDITIONAL_QUESTIONS: ScrapingResult[] = [
  // BEGINNER QUESTIONS
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
    question: "What are React lifecycle methods?",
    answer:
      "Lifecycle methods are special methods in class components that are called at different stages of a component's life. They include componentDidMount, componentDidUpdate, componentWillUnmount, and others.",
    explanation:
      "Lifecycle methods allow you to perform actions at specific times in a component's lifecycle, such as setting up subscriptions, updating the DOM, or cleaning up resources.",
    codeExample:
      "class MyComponent extends React.Component {\n  componentDidMount() {\n    // Called after component is mounted\n    console.log('Component mounted');\n  }\n  \n  componentDidUpdate(prevProps, prevState) {\n    // Called after component updates\n    console.log('Component updated');\n  }\n  \n  componentWillUnmount() {\n    // Called before component unmounts\n    console.log('Component will unmount');\n  }\n}",
    difficulty: "beginner",
    category: ["React Fundamentals"],
    tags: ["lifecycle", "class-components", "mounting", "updating"],
    source: "Manual Curation",
    sourceUrl: "",
  },
  {
    question: "What is event handling in React?",
    answer:
      "Event handling in React is similar to handling events in regular HTML, but with some differences. React events are camelCased, and you pass functions as event handlers rather than strings.",
    explanation:
      "React uses synthetic events that wrap the native browser events, providing a consistent API across different browsers and better performance.",
    codeExample:
      "function Button() {\n  const handleClick = (event) => {\n    console.log('Button clicked!');\n    event.preventDefault(); // Prevent default behavior\n  };\n  \n  return (\n    <button onClick={handleClick}>\n      Click me\n    </button>\n  );\n}",
    difficulty: "beginner",
    category: ["React Fundamentals"],
    tags: ["events", "event-handling", "synthetic-events"],
    source: "Manual Curation",
    sourceUrl: "",
  },
  {
    question: "What is conditional rendering in React?",
    answer:
      "Conditional rendering is a technique that allows you to render different components or content based on certain conditions. You can use if statements, ternary operators, or logical && operators.",
    explanation:
      "Conditional rendering is essential for creating dynamic user interfaces that respond to user input, application state, or other conditions.",
    codeExample:
      "function Greeting({ isLoggedIn }) {\n  if (isLoggedIn) {\n    return <h1>Welcome back!</h1>;\n  }\n  return <h1>Please sign in.</h1>;\n}\n\n// Using ternary operator\nfunction Greeting({ isLoggedIn }) {\n  return (\n    <div>\n      {isLoggedIn ? <h1>Welcome back!</h1> : <h1>Please sign in.</h1>}\n    </div>\n  );\n}",
    difficulty: "beginner",
    category: ["React Fundamentals"],
    tags: ["conditional-rendering", "if-statements", "ternary-operator"],
    source: "Manual Curation",
    sourceUrl: "",
  },
  {
    question: "What are React lists and keys?",
    answer:
      "React lists are used to render multiple components from an array. Keys are special attributes that help React identify which items have changed, been added, or been removed.",
    explanation:
      "Keys help React's reconciliation algorithm work efficiently by providing a stable identity to each element. Without keys, React might re-render more elements than necessary.",
    codeExample:
      "function TodoList({ todos }) {\n  return (\n    <ul>\n      {todos.map(todo => (\n        <li key={todo.id}>\n          {todo.text}\n        </li>\n      ))}\n    </ul>\n  );\n}",
    difficulty: "beginner",
    category: ["React Fundamentals"],
    tags: ["lists", "keys", "mapping", "arrays"],
    source: "Manual Curation",
    sourceUrl: "",
  },
  // INTERMEDIATE QUESTIONS
  {
    question: "What is the useCallback hook and when should you use it?",
    answer:
      "useCallback is a React hook that returns a memoized callback function. It's useful for optimizing performance by preventing unnecessary re-renders of child components that depend on the callback.",
    explanation:
      "useCallback is particularly useful when passing callbacks to optimized child components that rely on reference equality to prevent unnecessary renders.",
    codeExample:
      "import React, { useState, useCallback } from 'react';\n\nfunction ParentComponent() {\n  const [count, setCount] = useState(0);\n  \n  const handleClick = useCallback(() => {\n    setCount(c => c + 1);\n  }, []); // Empty dependency array means this callback never changes\n  \n  return (\n    <div>\n      <p>Count: {count}</p>\n      <ChildComponent onButtonClick={handleClick} />\n    </div>\n  );\n}",
    difficulty: "intermediate",
    category: ["Hooks"],
    tags: ["usecallback", "performance", "memoization", "optimization"],
    source: "Manual Curation",
    sourceUrl: "",
  },
  {
    question: "What is the useMemo hook and how does it work?",
    answer:
      "useMemo is a React hook that memoizes the result of a computation. It only recalculates the value when one of its dependencies changes, which can improve performance for expensive calculations.",
    explanation:
      "useMemo is useful when you have expensive calculations that don't need to be recalculated on every render, or when you want to prevent unnecessary re-renders of child components.",
    codeExample:
      "import React, { useState, useMemo } from 'react';\n\nfunction ExpensiveComponent({ items }) {\n  const [filter, setFilter] = useState('');\n  \n  const filteredItems = useMemo(() => {\n    return items.filter(item => \n      item.name.toLowerCase().includes(filter.toLowerCase())\n    );\n  }, [items, filter]); // Only recalculate when items or filter changes\n  \n  return (\n    <div>\n      <input \n        value={filter} \n        onChange={(e) => setFilter(e.target.value)} \n      />\n      <ul>\n        {filteredItems.map(item => (\n          <li key={item.id}>{item.name}</li>\n        ))}\n      </ul>\n    </div>\n  );\n}",
    difficulty: "intermediate",
    category: ["Hooks"],
    tags: ["usememo", "performance", "memoization", "optimization"],
    source: "Manual Curation",
    sourceUrl: "",
  },
  {
    question: "What is React Context and when should you use it?",
    answer:
      "React Context is a feature that allows you to share data between components without having to pass props down manually at every level. It's useful for global state like themes, user authentication, or language preferences.",
    explanation:
      "Context is designed to share data that can be considered 'global' for a tree of React components. It's an alternative to prop drilling and can be used with or without Redux.",
    codeExample:
      "// Create a context\nconst ThemeContext = React.createContext('light');\n\n// Provider component\nfunction App() {\n  const [theme, setTheme] = useState('light');\n  \n  return (\n    <ThemeContext.Provider value={theme}>\n      <div className={`App ${theme}`}>\n        <Header />\n        <Main />\n        <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>\n          Toggle Theme\n        </button>\n      </div>\n    </ThemeContext.Provider>\n  );\n}\n\n// Consumer component\nfunction Header() {\n  const theme = useContext(ThemeContext);\n  return <header className={theme}>Header</header>;\n}",
    difficulty: "intermediate",
    category: ["State Management"],
    tags: ["context", "global-state", "prop-drilling", "themes"],
    source: "Manual Curation",
    sourceUrl: "",
  },
  {
    question: "What are React Error Boundaries and how do you implement them?",
    answer:
      "Error Boundaries are React components that catch JavaScript errors anywhere in their child component tree and display a fallback UI instead of the component tree that crashed.",
    explanation:
      "Error Boundaries catch errors during rendering, in lifecycle methods, and in constructors of the whole tree below them. They don't catch errors in event handlers, async code, or server-side rendering.",
    codeExample:
      "class ErrorBoundary extends React.Component {\n  constructor(props) {\n    super(props);\n    this.state = { hasError: false };\n  }\n  \n  static getDerivedStateFromError(error) {\n    return { hasError: true };\n  }\n  \n  componentDidCatch(error, errorInfo) {\n    console.log('Error caught:', error, errorInfo);\n  }\n  \n  render() {\n    if (this.state.hasError) {\n      return <h1>Something went wrong.</h1>;\n    }\n    \n    return this.props.children;\n  }\n}",
    difficulty: "intermediate",
    category: ["Error Handling"],
    tags: ["error-boundaries", "error-handling", "fallback-ui"],
    source: "Manual Curation",
    sourceUrl: "",
  },
  {
    question: "What is React.memo and how does it optimize performance?",
    answer:
      "React.memo is a higher-order component that memoizes your component. It prevents re-rendering if the props haven't changed, which can improve performance for expensive components.",
    explanation:
      "React.memo does a shallow comparison of props by default. You can provide a custom comparison function as the second argument for more control over when the component should re-render.",
    codeExample:
      "// Basic usage\nconst MyComponent = React.memo(function MyComponent(props) {\n  return <div>{props.name}</div>;\n});\n\n// With custom comparison\nconst MyComponent = React.memo(function MyComponent(props) {\n  return <div>{props.user.name}</div>;\n}, (prevProps, nextProps) => {\n  return prevProps.user.id === nextProps.user.id;\n});",
    difficulty: "intermediate",
    category: ["Performance"],
    tags: ["react-memo", "performance", "memoization", "optimization"],
    source: "Manual Curation",
    sourceUrl: "",
  },
  // ADVANCED QUESTIONS
  {
    question: "What is React Suspense and how does it work?",
    answer:
      "React Suspense is a component that lets you wrap components that might not be ready to render and display a fallback while they're loading. It's primarily used for code splitting and data fetching.",
    explanation:
      "Suspense allows you to handle loading states declaratively and provides a better user experience by showing loading indicators while components are being prepared.",
    codeExample:
      "import React, { Suspense } from 'react';\n\n// Lazy loaded component\nconst LazyComponent = React.lazy(() => import('./LazyComponent'));\n\nfunction App() {\n  return (\n    <Suspense fallback={<div>Loading...</div>}>\n      <LazyComponent />\n    </Suspense>\n  );\n}\n\n// With multiple components\nfunction App() {\n  return (\n    <Suspense fallback={<div>Loading...</div>}>\n      <LazyComponent1 />\n      <LazyComponent2 />\n    </Suspense>\n  );\n}",
    difficulty: "advanced",
    category: ["Performance"],
    tags: ["suspense", "lazy-loading", "code-splitting", "loading-states"],
    source: "Manual Curation",
    sourceUrl: "",
  },
  {
    question: "What are React Portals and when would you use them?",
    answer:
      "Portals provide a way to render children into a DOM node that exists outside the DOM hierarchy of the parent component. They're commonly used for modals, tooltips, and other overlays.",
    explanation:
      "Portals are useful when you need to render a component outside its parent's DOM container, such as rendering a modal that should appear on top of everything else.",
    codeExample:
      'import ReactDOM from \'react-dom\';\n\nfunction Modal({ children, isOpen }) {\n  if (!isOpen) return null;\n  \n  return ReactDOM.createPortal(\n    <div className="modal">\n      <div className="modal-content">\n        {children}\n      </div>\n    </div>,\n    document.body\n  );\n}\n\n// Usage\nfunction App() {\n  const [isModalOpen, setIsModalOpen] = useState(false);\n  \n  return (\n    <div>\n      <button onClick={() => setIsModalOpen(true)}>\n        Open Modal\n      </button>\n      <Modal isOpen={isModalOpen}>\n        <h2>Modal Content</h2>\n        <p>This is rendered in a portal!</p>\n        <button onClick={() => setIsModalOpen(false)}>\n          Close\n        </button>\n      </Modal>\n    </div>\n  );\n}',
    difficulty: "advanced",
    category: ["Advanced Patterns"],
    tags: ["portals", "modals", "overlays", "dom-manipulation"],
    source: "Manual Curation",
    sourceUrl: "",
  },
  {
    question: "What is React Concurrent Mode and how does it work?",
    answer:
      "React Concurrent Mode is a set of new features that help React apps stay responsive and gracefully adjust to the user's device capabilities and network speed. It includes features like time slicing and suspense for data fetching.",
    explanation:
      "Concurrent Mode allows React to interrupt, pause, and resume work as needed, making the UI more responsive and providing better user experience.",
    codeExample:
      "// Concurrent Mode is enabled by default in React 18+\nimport { createRoot } from 'react-dom/client';\n\nconst container = document.getElementById('root');\nconst root = createRoot(container);\n\nroot.render(\n  <React.StrictMode>\n    <App />\n  </React.StrictMode>\n);\n\n// With Suspense for data fetching\nfunction UserProfile({ userId }) {\n  const user = use(fetchUser(userId));\n  return <h1>{user.name}</h1>;\n}",
    difficulty: "advanced",
    category: ["Performance"],
    tags: ["concurrent-mode", "time-slicing", "suspense", "react-18"],
    source: "Manual Curation",
    sourceUrl: "",
  },
  {
    question: "What are React Server Components and how do they work?",
    answer:
      "React Server Components are a new paradigm that allows you to write UI that can be rendered and cached on the server, reducing the JavaScript bundle size sent to the client and improving performance.",
    explanation:
      "Server Components can access backend resources directly, run on the server, and be rendered to HTML. They can be mixed with Client Components for a hybrid approach.",
    codeExample:
      "// Server Component (runs on server)\nasync function UserProfile({ userId }) {\n  const user = await fetchUser(userId);\n  const posts = await fetchUserPosts(userId);\n  \n  return (\n    <div>\n      <h1>{user.name}</h1>\n      <UserPosts posts={posts} />\n    </div>\n  );\n}\n\n// Client Component (runs in browser)\n'use client';\nfunction UserPosts({ posts }) {\n  const [likedPosts, setLikedPosts] = useState(new Set());\n  \n  return (\n    <div>\n      {posts.map(post => (\n        <Post \n          key={post.id} \n          post={post}\n          isLiked={likedPosts.has(post.id)}\n          onLike={() => setLikedPosts(prev => new Set([...prev, post.id]))}\n        />\n      ))}\n    </div>\n  );\n}",
    difficulty: "advanced",
    category: ["Performance"],
    tags: ["server-components", "rsc", "next-13", "performance"],
    source: "Manual Curation",
    sourceUrl: "",
  },
  {
    question: "What is React Query and how does it improve data fetching?",
    answer:
      "React Query is a library that provides powerful data synchronization for React applications. It offers caching, background updates, error handling, and optimistic updates out of the box.",
    explanation:
      "React Query simplifies data fetching by providing a declarative API that handles caching, background updates, and error states automatically.",
    codeExample:
      "import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';\n\nfunction UserProfile({ userId }) {\n  const { data: user, isLoading, error } = useQuery({\n    queryKey: ['user', userId],\n    queryFn: () => fetchUser(userId),\n  });\n  \n  const queryClient = useQueryClient();\n  const updateUser = useMutation({\n    mutationFn: updateUser,\n    onSuccess: () => {\n      queryClient.invalidateQueries({ queryKey: ['user', userId] });\n    },\n  });\n  \n  if (isLoading) return <div>Loading...</div>;\n  if (error) return <div>Error: {error.message}</div>;\n  \n  return (\n    <div>\n      <h1>{user.name}</h1>\n      <button onClick={() => updateUser.mutate({ id: userId, name: 'New Name' })}>\n        Update Name\n      </button>\n    </div>\n  );\n}",
    difficulty: "advanced",
    category: ["Data Fetching"],
    tags: ["react-query", "data-fetching", "caching", "mutations"],
    source: "Manual Curation",
    sourceUrl: "",
  },
];
