interface ErrorDisplayProps {
  message: string;
}

export function ErrorDisplay({ message }: ErrorDisplayProps) {
  return (
    <div className="flex items-center justify-center p-4 text-red-500">
      <p>{message}</p>
    </div>
  );
} 