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

// Define the improvements we want to apply
const questionImprovements: QuestionImprovement[] = [
  {
    id: "what-is-the-usememo-hook-and-how-does-it-work",
    improvements: {
      explanation: "useMemo is a React Hook that memoizes the result of a computation. It only recalculates the memoized value when one of its dependencies has changed. This optimization helps to avoid expensive calculations on every render. It's particularly useful for expensive operations like filtering large arrays, complex calculations, or creating objects that are used as dependencies in other hooks.",
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
      explanation: "useCallback is a React Hook that returns a memoized callback function. It only creates a new function when one of its dependencies has changed. This is useful when passing callbacks to optimized child components that rely on reference equality to prevent unnecessary renders. It's particularly beneficial when you have expensive child components that re-render frequently.",
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
      explanation: "React is a JavaScript library for building user interfaces, particularly single-page applications. It's used for handling the view layer and can be used for developing both web and mobile applications. React allows developers to create large web applications that can change data without reloading the page. Its main goal is to be fast, scalable, and simple. React uses a virtual DOM to efficiently update the actual DOM, and follows a component-based architecture that promotes reusability and maintainability.",
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
      explanation: "React offers several key advantages: 1) Virtual DOM for efficient updates and better performance, 2) Component-based architecture for reusability and maintainability, 3) One-way data flow for predictable state management, 4) Rich ecosystem and community support with extensive libraries and tools, 5) Cross-platform development with React Native for mobile apps, 6) Declarative syntax for easier debugging and understanding, 7) Strong developer tools and debugging capabilities, 8) SEO-friendly with server-side rendering support.",
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

async function applyImprovementsViaAPI() {
  try {
    console.log("🔧 Applying content improvements via API...");
    
    let updatedCount = 0;
    
    for (const improvement of questionImprovements) {
      console.log(`\n🔍 Processing: ${improvement.id}`);
      
      try {
        // First, get the current question directly by ID
        const response = await fetch(`http://localhost:3000/api/interview-questions/${improvement.id}`);
        const data = await response.json();
        
        if (!data.success) {
          console.log(`  ❌ Question not found: ${improvement.id}`);
          continue;
        }
        
        const question = data.data;
        console.log(`  📝 Found question: ${question.question.substring(0, 50)}...`);
        
        // Prepare update data
        const updateData: any = {};
        
        if (improvement.improvements.explanation) {
          updateData.explanation = improvement.improvements.explanation;
          console.log(`  ✅ Enhanced explanation`);
        }
        
        if (improvement.improvements.codeExample) {
          updateData.codeExample = improvement.improvements.codeExample;
          console.log(`  ✅ Added code example`);
        }
        
        if (improvement.improvements.difficulty) {
          updateData.difficulty = improvement.improvements.difficulty;
          console.log(`  ✅ Updated difficulty: ${improvement.improvements.difficulty}`);
        }
        
        if (improvement.improvements.tags) {
          updateData.tags = improvement.improvements.tags;
          console.log(`  ✅ Improved tags: ${improvement.improvements.tags.join(", ")}`);
        }
        
        if (improvement.improvements.category) {
          updateData.category = improvement.improvements.category;
          console.log(`  ✅ Updated categories: ${improvement.improvements.category.join(", ")}`);
        }
        
        // Apply the updates using the new PUT endpoint
        if (Object.keys(updateData).length > 0) {
          const updateResponse = await fetch(`http://localhost:3000/api/interview-questions/${improvement.id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(updateData),
          });
          
          const updateResult = await updateResponse.json();
          
          if (updateResult.success) {
            console.log(`  ✅ Successfully updated question`);
            updatedCount++;
          } else {
            console.log(`  ❌ Failed to update question: ${updateResult.error}`);
          }
        } else {
          console.log(`  ℹ️ No improvements needed for this question`);
        }
        
      } catch (error) {
        console.log(`  ❌ Error processing ${improvement.id}:`, error);
      }
    }
    
    console.log(`\n🎉 IMPROVEMENT SUMMARY`);
    console.log("=====================");
    console.log(`✅ Successfully updated ${updatedCount} questions`);
    console.log(`📊 Total questions processed: ${questionImprovements.length}`);
    
    if (updatedCount > 0) {
      console.log("\n💡 Next steps:");
      console.log("1. Review the updated questions");
      console.log("2. Test the improved content");
      console.log("3. Verify all improvements are working");
      console.log("4. Consider merging similar questions");
    }
    
  } catch (error) {
    console.error("❌ Error applying improvements:", error);
  }
}

applyImprovementsViaAPI(); 