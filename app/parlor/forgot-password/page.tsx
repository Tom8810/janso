"use client";

import { resetPassword } from "@/lib/firebase";
import Link from "next/link";
import { useState } from "react";
import { FiMail } from "react-icons/fi";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      await resetPassword(email);
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || "パスワードリセットに失敗しました");
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-zinc-50">
        <main className="mx-auto flex min-h-screen max-w-3xl items-center px-4 py-10 sm:px-6 lg:px-8 lg:py-16">
          <div className="w-full">
            <div className="space-y-10 max-w-md">
              <div className="space-y-3">
                <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 sm:text-3xl">
                  メールを送信しました
                </h1>
                <p className="text-sm font-medium text-zinc-500">
                  {email} にパスワードリセット用のメールを送信しました。
                  <span className="whitespace-nowrap">
                    メール内のリンクから新しいパスワードを設定してください。
                  </span>
                </p>
              </div>

              <div className="space-y-3">
                <button
                  type="button"
                  onClick={() => {
                    setSuccess(false);
                    setEmail("");
                  }}
                  className="inline-flex w-full items-center justify-center rounded-xl border border-black/10 bg-white px-4 py-2.5 text-sm font-medium text-zinc-700 hover:border-black/20 hover:text-zinc-900"
                >
                  別のメールアドレスで再送
                </button>

                <Link
                  href="/parlor/login"
                  className="inline-flex w-full items-center justify-center rounded-xl bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-zinc-800"
                >
                  ログイン画面に戻る
                </Link>
              </div>

              <div className="pt-4 text-xs text-zinc-400">
                <Link href="/" className="hover:text-zinc-700">
                  雀荘一覧に戻る
                </Link>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50">
      <main className="mx-auto flex min-h-screen max-w-3xl items-center px-4 py-10 sm:px-6 lg:px-8 lg:py-16">
        <div className="w-full">
          <div className="space-y-10 max-w-md">
            <div className="space-y-3">
              <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 sm:text-3xl">
                パスワードリセット
              </h1>
              <p className="text-sm font-medium text-zinc-500">
                登録時のメールアドレスを入力すると、
                <span className="whitespace-nowrap">
                  パスワード再設定用のリンクをお送りします。
                </span>
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
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

              {error && (
                <p className="text-sm font-medium text-red-600">{error}</p>
              )}

              <button
                type="submit"
                disabled={isLoading || !email}
                className="inline-flex w-full items-center justify-center rounded-xl bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isLoading ? "メール送信中..." : "リセットメールを送信"}
              </button>
            </form>

            <div className="space-y-4 pt-4 text-sm text-zinc-500">
              <div>
                <Link
                  href="/parlor/login"
                  className="font-medium text-zinc-700 hover:text-zinc-900"
                >
                  ログイン画面に戻る
                </Link>
              </div>

              <div className="pt-2 text-xs text-zinc-400">
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
