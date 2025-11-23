'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface ParlorData {
  id: string;
  name: string;
  address: string;
  total_waiting_count: number;
}

interface APIResponse {
  data: ParlorData[];
  meta: {
    total_count: number;
    current_page: number;
    total_pages: number;
    per_page: number;
  };
}

export default function Home() {
  const [parlors, setParlors] = useState<ParlorData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchParlors();
  }, []);

  const fetchParlors = async () => {
    try {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const mockResponse: APIResponse = {
        data: [
          {
            id: "p-001",
            name: "リーチ麻雀 さくら 新宿店",
            address: "東京都新宿区歌舞伎町1-15-2 第3ビル 4F",
            total_waiting_count: 2
          },
          {
            id: "p-002",
            name: "麻雀クラブ 緑一色",
            address: "東京都豊島区西池袋1-22-5 池袋スクエア 2F",
            total_waiting_count: 0
          },
          {
            id: "p-003",
            name: "ZOO 渋谷道玄坂店",
            address: "東京都渋谷区道玄坂2-6-11 渋谷プラザ 5F",
            total_waiting_count: 5
          },
          {
            id: "p-004",
            name: "健康麻雀 ひまわり",
            address: "東京都千代田区神田須田町1-4-1 神田ビル 3F",
            total_waiting_count: 1
          },
          {
            id: "p-005",
            name: "雀荘 六本木ヒルズ前",
            address: "東京都港区六本木6-2-31 六本木ヒルズノース 1F",
            total_waiting_count: 8
          },
          {
            id: "p-006",
            name: "まあじゃん ぱいん",
            address: "神奈川県横浜市西区南幸2-12-6 ストークビル 6F",
            total_waiting_count: 0
          }
        ],
        meta: {
          total_count: 124,
          current_page: 1,
          total_pages: 21,
          per_page: 6
        }
      };
      
      setParlors(mockResponse.data);
    } catch (error) {
      console.error('雀荘一覧の取得に失敗しました:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getWaitingStatus = (waitingCount: number) => {
    if (waitingCount === 0) {
      return { 
        text: 'すぐ打てます', 
        color: 'bg-zinc-900 text-white', 
        available: true 
      };
    } else if (waitingCount <= 3) {
      return { 
        text: `待ち${waitingCount}人`, 
        color: 'bg-amber-100 text-amber-800 border border-amber-200', 
        available: false 
      };
    } else {
      return { 
        text: `待ち${waitingCount}人`, 
        color: 'bg-red-50 text-red-700 border border-red-200', 
        available: false 
      };
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-zinc-50 flex items-center justify-center">
        <div className="text-zinc-600 font-medium">読み込み中...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50">
      <div className="sticky top-0 bg-white/70 backdrop-blur-md border-b border-black/5 z-10">
        <div className="px-6 py-4">
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">雀荘一覧</h1>
          <p className="text-zinc-600 font-medium text-sm mt-1">
            すぐに打てる雀荘を見つけましょう
          </p>
        </div>
      </div>

      <div className="p-6 pb-24">
        <div className="grid gap-4">
          {parlors.map((parlor) => {
            const status = getWaitingStatus(parlor.total_waiting_count);
            
            return (
              <Link key={parlor.id} href={`/parlors/${parlor.id}`}>
                <div className="bg-white rounded-2xl p-6 shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-black/5 hover:scale-[1.01] hover:border-black/10 transition-all duration-200">
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-lg font-semibold tracking-tight text-zinc-900 flex-1 mr-3 leading-tight">
                      {parlor.name}
                    </h3>
                    <span className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap ${status.color}`}>
                      {status.text}
                    </span>
                  </div>
                  
                  <p className="text-zinc-600 font-medium text-sm leading-relaxed mb-4">
                    {parlor.address}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-400 font-medium text-sm">詳細を見る</span>
                    {status.available && (
                      <div className="flex items-center space-x-1">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-green-700 text-xs font-medium">
                          すぐ参加可能
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-6 bg-white/70 backdrop-blur-md border-t border-black/5">
        <Link
          href="/parlor/login"
          className="block w-full bg-zinc-900 text-white text-center py-4 rounded-2xl font-medium tracking-tight hover:bg-zinc-800 transition-colors shadow-[0_2px_8px_rgba(0,0,0,0.1)]"
        >
          雀荘管理者ログイン
        </Link>
      </div>
    </div>
  );
}
