import Image from "next/image";

interface LoadingScreenProps {
  message?: string;
}

export default function LoadingScreen({ message = "読み込み中..." }: LoadingScreenProps) {
  return (
    <div className="min-h-screen bg-zinc-50 flex items-center justify-center">
      <div className="flex flex-col items-center">
        <Image
          src="/logo.png"
          alt="Janso Logo"
          width={80}
          height={80}
          className="mb-4 animate-pulse"
        />
        <div className="text-zinc-600 font-medium text-sm">{message}</div>
      </div>
    </div>
  );
}
