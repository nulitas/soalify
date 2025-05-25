interface LoadingSpinnerProps {
  message?: string;
}

export default function LoadingSpinner({
  message = "Memuat data...",
}: LoadingSpinnerProps) {
  return (
    <div className="text-center py-8">
      <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-middle"></div>
      {message && <p className="mt-2">{message}</p>}
    </div>
  );
}
