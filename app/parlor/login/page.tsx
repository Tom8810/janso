"use client";

import { signInParlor } from "@/lib/firebase";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FiLock, FiMail } from "react-icons/fi";

export default function ParlorLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const { user, parlor } = await signInParlor(email, password);

      // Store user session (you might want to use a context or state management)
      localStorage.setItem(
        "parlor_session",
        JSON.stringify({
          userId: user.uid,
          parlorId: parlor.id,
          parlorName: parlor.name,
        })
      );

      // Redirect to management screen
      router.push("/parlor/manage");
    } catch (err: any) {
      setError(err.message || "ログインに失敗しました");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50">
      <main className="mx-auto flex min-h-screen max-w-3xl items-center px-4 py-10 sm:px-6 lg:px-8 lg:py-16">
        <div className="w-full">
          <div className="space-y-10">
            <div className="space-y-3">
              <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 sm:text-3xl">
                雀荘管理ログイン
              </h1>
              <p className="text-sm font-medium text-zinc-500">
                登録済みのメールアドレスとパスワードで、
                <span className="whitespace-nowrap">
                  管理画面にサインインしてください。
                </span>
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 max-w-md">
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-zinc-800"
                  >
                    メールアドレス
                  </label>
                  <div className="relative">
                    <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-zinc-400">
                      <FiMail className="h-4 w-4" />
                    </span>
                    <input
                      type="email"
                      id="email"
                      required
                      className="w-full rounded-xl border border-black/10 bg-white px-3 py-2 pl-9 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-900 focus:outline-none focus:ring-0"
                      placeholder="example@mahjong.jp"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-zinc-800"
                  >
                    パスワード
                  </label>
                  <div className="relative">
                    <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-zinc-400">
                      <FiLock className="h-4 w-4" />
                    </span>
                    <input
                      type="password"
                      id="password"
                      required
                      className="w-full rounded-xl border border-black/10 bg-white px-3 py-2 pl-9 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-900 focus:outline-none focus:ring-0"
                      placeholder="パスワードを入力"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {error && (
                <p className="text-sm font-medium text-red-600">{error}</p>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="inline-flex items-center justify-center rounded-xl bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isLoading ? "ログイン中…" : "ログイン"}
              </button>
            </form>

            <div className="space-y-6 pt-4 text-sm text-zinc-500">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
                <Link
                  href="/parlor/register"
                  className="font-medium text-zinc-700 hover:text-zinc-900"
                >
                  新規登録はこちら
                </Link>
                <Link
                  href="/parlor/forgot-password"
                  className="hover:text-zinc-900"
                >
                  パスワードをお忘れの方
                </Link>
              </div>

              <div className="pt-4 text-xs text-zinc-400">
                <Link href="/" className="hover:text-zinc-700">
                  雀荘一覧に戻る
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
