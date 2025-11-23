'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { signInParlor } from '@/lib/firebase';

export default function ParlorLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const { user, parlor } = await signInParlor(email, password);
      
      // Store user session (you might want to use a context or state management)
      localStorage.setItem('parlor_session', JSON.stringify({ 
        userId: user.uid, 
        parlorId: parlor.id,
        parlorName: parlor.name 
      }));
      
      // Redirect to management screen
      router.push('/parlor/manage');
    } catch (err: any) {
      setError(err.message || 'ログインに失敗しました');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50">
      <div className="sticky top-0 bg-white/70 backdrop-blur-md border-b border-black/5 z-10">
        <div className="px-6 py-4">
          <Link href="/" className="text-zinc-600 hover:text-zinc-900 font-medium text-sm">
            ← 雀荘一覧に戻る
          </Link>
        </div>
      </div>

      <div className="p-6 flex items-center justify-center min-h-[calc(100vh-80px)]">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl p-8 shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-black/5">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 mb-2">
                雀荘管理ログイン
              </h1>
              <p className="text-zinc-600 font-medium text-sm">
                管理画面にアクセスしてください
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
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
                
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-zinc-900 mb-2">
                    パスワード
                  </label>
                  <input
                    type="password"
                    id="password"
                    required
                    className="w-full px-4 py-3 border border-black/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent"
                    placeholder="パスワードを入力"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                  <div className="text-red-700 text-sm font-medium">{error}</div>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 bg-zinc-900 text-white rounded-xl font-medium hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {isLoading ? 'ログイン中...' : 'ログイン'}
              </button>
            </form>

            <div className="mt-8 space-y-4">
              <div className="flex items-center justify-between text-sm">
                <Link
                  href="/parlor/register"
                  className="text-zinc-900 hover:text-zinc-700 font-medium"
                >
                  新規登録
                </Link>
                <Link
                  href="/parlor/forgot-password"
                  className="text-zinc-600 hover:text-zinc-900"
                >
                  パスワードを忘れた方
                </Link>
              </div>
              
              <div className="pt-4 border-t border-black/5">
                <Link
                  href="/"
                  className="block text-center text-zinc-600 hover:text-zinc-900 text-sm"
                >
                  雀荘一覧に戻る
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}