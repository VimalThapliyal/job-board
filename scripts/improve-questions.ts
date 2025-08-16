import { InterviewQuestion } from "../src/types/interview-question";

interface QuestionImprovement {
  id: string;
  improvements: {
    explanation?: string;
    codeExample?: string;
    difficulty?: "beginner" | "intermediate" | "advanced";
    tags?: string[];
    category?: string[];
  };
}

// Define improvements for similar questions
const questionImprovements: QuestionImprovement[] = [
  {
    id: "what-is-the-usememo-hook-and-how-does-it-work",
    improvements: {
      explanation: "useMemo is a React Hook that memoizes the result of a computation. It only recalculates the memoized value when one of its dependencies has changed. This optimization helps to avoid expensive calculations on every render.",
      codeExample: `import React, { useMemo, useState } from 'react';

function ExpensiveComponent({ items }) {
  const [filter, setFilter] = useState('');
  
  // This expensive calculation only runs when 'items' or 'filter' changes
  const filteredItems = useMemo(() => {
    console.log('Filtering items...'); // This will only log when dependencies change
    return items.filter(item => item.name.includes(filter));
  }, [items, filter]);
  
  return (
    <div>
      <input 
        value={filter} 
        onChange={(e) => setFilter(e.target.value)} 
        placeholder="Filter items..."
      />
      <ul>
        {filteredItems.map(item => (
          <li key={item.id}>{item.name}</li>
        ))}
      </ul>
    </div>
  );
}`,
      difficulty: "intermediate",
      tags: ["usememo", "performance", "memoization", "optimization", "hooks", "react"],
      category: ["Hooks", "Performance"]
    }
  },
  {
    id: "what-is-the-usecallback-hook-and-when-should-you-u",
    improvements: {
      explanation: "useCallback is a React Hook that returns a memoized callback function. It only creates a new function when one of its dependencies has changed. This is useful when passing callbacks to optimized child components that rely on reference equality to prevent unnecessary renders.",
      codeExample: `import React, { useCallback, useState } from 'react';

function ParentComponent() {
  const [count, setCount] = useState(0);
  const [text, setText] = useState('');
  
  // This callback only changes when 'count' changes
  const handleIncrement = useCallback(() => {
    setCount(c => c + 1);
  }, [count]);
  
  // This callback only changes when 'text' changes
  const handleTextChange = useCallback((newText: string) => {
    setText(newText);
  }, [text]);
  
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={handleIncrement}>Increment</button>
      <input 
        value={text} 
        onChange={(e) => handleTextChange(e.target.value)} 
        placeholder="Enter text..."
      />
      <ChildComponent onIncrement={handleIncrement} />
    </div>
  );
}

// This component will only re-render when its props actually change
const ChildComponent = React.memo(({ onIncrement }) => {
  console.log('ChildComponent rendered');
  return <button onClick={onIncrement}>Increment from Child</button>;
});`,
      difficulty: "intermediate",
      tags: ["usecallback", "performance", "memoization", "optimization", "hooks", "react"],
      category: ["Hooks", "Performance"]
    }
  },
  {
    id: "what-is-react",
    improvements: {
      explanation: "React is a JavaScript library for building user interfaces, particularly single-page applications. It's used for handling the view layer and can be used for developing both web and mobile applications. React allows developers to create large web applications that can change data without reloading the page. Its main goal is to be fast, scalable, and simple.",
      codeExample: `import React from 'react';

// Simple functional component
function Welcome({ name }) {
  return <h1>Hello, {name}!</h1>;
}

// Component with state using hooks
function Counter() {
  const [count, setCount] = React.useState(0);
  
  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  );
}

// App component
function App() {
  return (
    <div>
      <Welcome name="React Developer" />
      <Counter />
    </div>
  );
}

export default App;`,
      difficulty: "beginner",
      tags: ["react", "component", "virtual-dom", "javascript", "library", "ui"],
      category: ["React Components", "Fundamentals"]
    }
  },
  {
    id: "what-are-the-advantages-of-using-react",
    improvements: {
      explanation: "React offers several key advantages: 1) Virtual DOM for efficient updates, 2) Component-based architecture for reusability, 3) One-way data flow for predictable state management, 4) Rich ecosystem and community support, 5) Cross-platform development with React Native, 6) Declarative syntax for easier debugging, 7) Strong developer tools and debugging capabilities.",
      codeExample: `// Virtual DOM example - React efficiently updates only what changed
function TodoList({ todos }) {
  return (
    <ul>
      {todos.map(todo => (
        <li key={todo.id} className={todo.completed ? 'completed' : ''}>
          {todo.text}
        </li>
      ))}
    </ul>
  );
}

// Component reusability example
function Button({ children, onClick, variant = 'primary' }) {
  return (
    <button 
      className={\`btn btn-\${variant}\`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

// Usage of reusable component
function App() {
  return (
    <div>
      <Button onClick={() => alert('Primary clicked')}>
        Primary Button
      </Button>
      <Button variant="secondary" onClick={() => alert('Secondary clicked')}>
        Secondary Button
      </Button>
    </div>
  );
}`,
      difficulty: "beginner",
      tags: ["react", "advantages", "virtual-dom", "components", "ecosystem", "performance"],
      category: ["React Components", "Fundamentals"]
    }
  }
];

async function improveQuestions() {
  try {
    console.log("🔧 Starting question improvements...");
    
    // For now, let's create a comprehensive improvement plan
    console.log("\n📋 IMPROVEMENT PLAN");
    console.log("==================");
    
    for (const improvement of questionImprovements) {
      console.log(`\n🔍 Question ID: ${improvement.id}`);
      console.log("Improvements to be made:");
      
      if (improvement.improvements.explanation) {
        console.log(`  ✅ Enhanced explanation (${improvement.improvements.explanation.length} chars)`);
      }
      
      if (improvement.improvements.codeExample) {
        console.log(`  ✅ Added code example (${improvement.improvements.codeExample.length} chars)`);
      }
      
      if (improvement.improvements.difficulty) {
        console.log(`  ✅ Updated difficulty: ${improvement.improvements.difficulty}`);
      }
      
      if (improvement.improvements.tags) {
        console.log(`  ✅ Improved tags: ${improvement.improvements.tags.join(", ")}`);
      }
      
      if (improvement.improvements.category) {
        console.log(`  ✅ Updated categories: ${improvement.improvements.category.join(", ")}`);
      }
    }
    
    console.log("\n💡 NEXT STEPS");
    console.log("=============");
    console.log("1. Review and merge similar questions (useMemo/useCallback)");
    console.log("2. Enhance explanations with more detailed examples");
    console.log("3. Add missing code examples to questions");
    console.log("4. Standardize difficulty levels");
    console.log("5. Improve tag organization");
    console.log("6. Ensure consistent categorization");
    
    console.log("\n✅ Improvement plan generated!");
    
  } catch (error) {
    console.error("❌ Error improving questions:", error);
  }
}

improveQuestions(); 