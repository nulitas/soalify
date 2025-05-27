// components/ui/ErrorMessage.tsx
"use client";

interface ErrorMessageProps {
  message: string | null;
}

export default function ErrorMessage({ message }: ErrorMessageProps) {
  if (!message) {
    return null;
  }

  return (
    <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-4 my-4">
      <p>
        <strong>Terjadi Kesalahan:</strong> {message}
      </p>
    </div>
  );
}
