'use client';

import { useState } from 'react';
import Link from 'next/link';
import { resetPassword } from '@/lib/firebase';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await resetPassword(email);
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || 'パスワードリセットに失敗しました');
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-zinc-50">
        <div className="sticky top-0 bg-white/70 backdrop-blur-md border-b border-black/5 z-10">
          <div className="px-6 py-4">
            <Link href="/parlor/login" className="text-zinc-600 hover:text-zinc-900 font-medium text-sm">
              ← ログイン画面に戻る
            </Link>
          </div>
        </div>

        <div className="p-6 flex items-center justify-center min-h-[calc(100vh-80px)]">
          <div className="w-full max-w-md">
            <div className="bg-white rounded-2xl p-8 shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-black/5 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-green-600">
                  <path d="M22 12c0 5.523-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2s10 4.477 10 10z"/>
                  <path d="m9 12 2 2 4-4"/>
                </svg>
              </div>
              
              <h1 className="text-xl font-semibold tracking-tight text-zinc-900 mb-2">
                メールを送信しました
              </h1>
              
              <p className="text-zinc-600 font-medium text-sm mb-6">
                {email} にパスワードリセットのメールを送信しました。<br/>
                メール内のリンクをクリックして、新しいパスワードを設定してください。
              </p>
              
              <div className="space-y-3">
                <Link
                  href="/parlor/login"
                  className="block w-full py-3 px-4 bg-zinc-900 text-white rounded-xl font-medium hover:bg-zinc-800 transition-all text-center"
                >
                  ログイン画面に戻る
                </Link>
                
                <button
                  onClick={() => {
                    setSuccess(false);
                    setEmail('');
                  }}
                  className="block w-full py-3 px-4 bg-white border border-black/10 rounded-xl font-medium text-zinc-900 hover:bg-zinc-50 transition-all"
                >
                  別のメールアドレスで再送
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50">
      <div className="sticky top-0 bg-white/70 backdrop-blur-md border-b border-black/5 z-10">
        <div className="px-6 py-4">
          <Link href="/parlor/login" className="text-zinc-600 hover:text-zinc-900 font-medium text-sm">
            ← ログイン画面に戻る
          </Link>
        </div>
      </div>

      <div className="p-6 flex items-center justify-center min-h-[calc(100vh-80px)]">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl p-8 shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-black/5">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 mb-2">
                パスワードリセット
              </h1>
              <p className="text-zinc-600 font-medium text-sm">
                登録時のメールアドレスを入力してください。<br/>
                パスワードリセット用のメールを送信します。
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-zinc-900 mb-2">
                  メールアドレス
                </label>
                <input
                  type="email"
                  id="email"
                  required
                  className="w-full px-4 py-3 border border-black/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent"
                  placeholder="メールアドレスを入力"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                  <div className="text-red-700 text-sm font-medium">{error}</div>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading || !email}
                className="w-full py-3 px-4 bg-zinc-900 text-white rounded-xl font-medium hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {isLoading ? 'メール送信中...' : 'リセットメールを送信'}
              </button>
            </form>

            <div className="mt-8 pt-6 border-t border-black/5 text-center">
              <Link
                href="/parlor/login"
                className="text-zinc-600 hover:text-zinc-900 text-sm"
              >
                ログイン画面に戻る
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}