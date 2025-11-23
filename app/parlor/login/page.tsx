'use client';

import { useState } from 'react';
import { ParlorLoginRequest } from '@/types';

export default function ParlorLogin() {
  const [loginData, setLoginData] = useState<ParlorLoginRequest>({
    parlorId: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      console.log('Login attempt:', loginData);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
    } catch (err) {
      setError('ログインに失敗しました');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-md">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            雀荘管理ログイン
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            雀荘の管理画面にアクセスするためにログインしてください
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="parlorId" className="sr-only">
                雀荘ID
              </label>
              <input
                id="parlorId"
                name="parlorId"
                type="text"
                required
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="雀荘ID"
                value={loginData.parlorId}
                onChange={(e) => setLoginData({ ...loginData, parlorId: e.target.value })}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                パスワード
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="パスワード"
                value={loginData.password}
                onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
              />
            </div>
          </div>

          {error && (
            <div className="rounded-md bg-red-50 p-4">
              <div className="text-sm text-red-700">{error}</div>
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {isLoading ? 'ログイン中...' : 'ログイン'}
            </button>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between text-sm">
              <a
                href="/parlor/register"
                className="text-indigo-600 hover:text-indigo-500 font-medium"
              >
                新規登録はこちら
              </a>
              <a
                href="/parlor/forgot-password"
                className="text-gray-600 hover:text-gray-500"
              >
                パスワードを忘れた方
              </a>
            </div>
            <div className="text-center">
              <a
                href="/"
                className="text-sm text-indigo-600 hover:text-indigo-500"
              >
                雀荘一覧に戻る
              </a>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}