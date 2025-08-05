interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  color?: "blue" | "white" | "gray";
  className?: string;
}

export default function LoadingSpinner({ 
  size = "md", 
  color = "blue",
  className = "" 
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-8 h-8", 
    lg: "w-12 h-12"
  };

  const colorClasses = {
    blue: "text-blue-600",
    white: "text-white",
    gray: "text-gray-600"
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className={`animate-spin rounded-full border-2 border-gray-300 border-t-current ${sizeClasses[size]} ${colorClasses[color]}`}></div>
    </div>
  );
} 