'use client';

import { useState, useEffect } from 'react';

interface Room {
  id: string;
  rank_name: string;
  waiting_count: number;
  table_count: number;
  status: 'active' | 'inactive';
}

interface ParlorData {
  id: string;
  name: string;
  address: string;
  rooms: Room[];
}

export default function ParlorManagement() {
  const [parlor, setParlor] = useState<ParlorData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchParlorData();
  }, []);

  const fetchParlorData = async () => {
    try {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const mockParlor: ParlorData = {
        id: "p-001",
        name: "リーチ麻雀 さくら 新宿店",
        address: "東京都新宿区歌舞伎町1-15-2 第3ビル 4F",
        rooms: [
          {
            id: "r-101",
            rank_name: "ランク 零点五",
            waiting_count: 2,
            table_count: 1,
            status: "active"
          },
          {
            id: "r-102",
            rank_name: "ランク 一点零",
            waiting_count: 0,
            table_count: 4,
            status: "active"
          },
          {
            id: "r-105",
            rank_name: "ランク 五点零",
            waiting_count: 5,
            table_count: 2,
            status: "active"
          }
        ]
      };
      
      setParlor(mockParlor);
    } catch (error) {
      console.error('雀荘データの取得に失敗しました:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateWaitingCount = (roomId: string, increment: boolean) => {
    setParlor(prev => {
      if (!prev) return null;
      
      return {
        ...prev,
        rooms: prev.rooms.map(room =>
          room.id === roomId
            ? {
                ...room,
                waiting_count: Math.max(0, room.waiting_count + (increment ? 1 : -1))
              }
            : room
        )
      };
    });
  };

  const getTotalWaiting = () => {
    return parlor?.rooms.reduce((total, room) => total + room.waiting_count, 0) || 0;
  };

  const getTotalTables = () => {
    return parlor?.rooms.reduce((total, room) => total + room.table_count, 0) || 0;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-zinc-50 flex items-center justify-center">
        <div className="text-zinc-600 font-medium">読み込み中...</div>
      </div>
    );
  }

  if (!parlor) {
    return (
      <div className="min-h-screen bg-zinc-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-xl font-semibold tracking-tight text-zinc-900 mb-2">
            雀荘データが見つかりません
          </h1>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50">
      {/* Header */}
      <div className="sticky top-0 bg-white/70 backdrop-blur-md border-b border-black/5 z-10">
        <div className="px-6 py-4">
          <h1 className="text-xl font-semibold tracking-tight text-zinc-900">
            {parlor.name}
          </h1>
          <p className="text-zinc-600 font-medium text-sm mt-1">
            {parlor.address}
          </p>
        </div>
      </div>

      <div className="p-6 pb-24">
        {/* Overview Cards - Bento Grid */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-white rounded-2xl p-6 shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-black/5">
            <div className="text-2xl font-semibold tracking-tight text-zinc-900">
              {getTotalWaiting()}
            </div>
            <div className="text-zinc-600 font-medium text-sm mt-1">
              総待ち人数
            </div>
          </div>
          
          <div className="bg-white rounded-2xl p-6 shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-black/5">
            <div className="text-2xl font-semibold tracking-tight text-zinc-900">
              {getTotalTables()}
            </div>
            <div className="text-zinc-600 font-medium text-sm mt-1">
              総卓数
            </div>
          </div>
        </div>

        {/* Room Management - Bento Grid */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold tracking-tight text-zinc-900 mb-4">
            ルーム管理
          </h2>
          
          <div className="grid gap-4">
            {parlor.rooms.map((room) => (
              <div 
                key={room.id} 
                className="bg-white rounded-2xl p-6 shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-black/5"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="font-semibold tracking-tight text-zinc-900 text-lg">
                      {room.rank_name}
                    </h3>
                    <div className="flex items-center space-x-4 mt-2 text-sm">
                      <span className="text-zinc-600 font-medium">
                        卓数: {room.table_count}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        room.status === 'active' 
                          ? 'bg-green-100 text-green-800 border border-green-200'
                          : 'bg-gray-100 text-gray-600 border border-gray-200'
                      }`}>
                        {room.status === 'active' ? 'アクティブ' : '非アクティブ'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Waiting Count Management */}
                <div className="bg-zinc-50 rounded-xl p-4 border border-black/5">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-zinc-900 font-medium text-sm">待ち人数</div>
                      <div className="text-2xl font-semibold tracking-tight text-zinc-900 mt-1">
                        {room.waiting_count}人
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => updateWaitingCount(room.id, false)}
                        disabled={room.waiting_count === 0}
                        className="w-10 h-10 bg-white rounded-full border border-black/10 flex items-center justify-center text-zinc-600 hover:bg-zinc-50 hover:border-black/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <line x1="5" y1="12" x2="19" y2="12"></line>
                        </svg>
                      </button>
                      
                      <button
                        onClick={() => updateWaitingCount(room.id, true)}
                        className="w-10 h-10 bg-zinc-900 text-white rounded-full flex items-center justify-center hover:bg-zinc-800 transition-all"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <line x1="12" y1="5" x2="12" y2="19"></line>
                          <line x1="5" y1="12" x2="19" y2="12"></line>
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="fixed bottom-0 left-0 right-0 p-6 bg-white/70 backdrop-blur-md border-t border-black/5">
        <div className="grid grid-cols-2 gap-3">
          <button className="py-3 px-4 bg-white border border-black/10 rounded-2xl font-medium text-zinc-900 hover:bg-zinc-50 hover:border-black/20 transition-all">
            設定
          </button>
          <button className="py-3 px-4 bg-zinc-900 text-white rounded-2xl font-medium hover:bg-zinc-800 transition-all">
            データ更新
          </button>
        </div>
      </div>
    </div>
  );
}