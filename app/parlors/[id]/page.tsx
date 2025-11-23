'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Room {
  id: string;
  rank_name: string;
  waiting_count: number;
}

interface ParlorDetailData {
  id: string;
  name: string;
  address: string;
  rooms: Room[];
}

interface ParlorDetailProps {
  params: Promise<{ id: string }>;
}

export default function ParlorDetail({ params }: ParlorDetailProps) {
  const [parlor, setParlor] = useState<ParlorDetailData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [playerName, setPlayerName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isJoining, setIsJoining] = useState(false);
  const [parlorId, setParlorId] = useState<string>('');

  useEffect(() => {
    const getParams = async () => {
      const resolvedParams = await params;
      setParlorId(resolvedParams.id);
      fetchParlorDetail(resolvedParams.id);
    };
    getParams();
  }, [params]);

  const fetchParlorDetail = async (id: string) => {
    try {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const mockParlor: ParlorDetailData = {
        id: "p-001",
        name: "リーチ麻雀 さくら 新宿店",
        address: "東京都新宿区歌舞伎町1-15-2 第3ビル 4F",
        rooms: [
          {
            id: "r-101",
            rank_name: "テンピン (1.0) 戦",
            waiting_count: 2
          },
          {
            id: "r-102",
            rank_name: "テンゴ (0.5) 戦",
            waiting_count: 0
          },
          {
            id: "r-103",
            rank_name: "ノーレート フリー",
            waiting_count: 1
          },
          {
            id: "r-104",
            rank_name: "初心者教室",
            waiting_count: 0
          }
        ]
      };
      
      setParlor(mockParlor);
    } catch (error) {
      console.error('雀荘詳細の取得に失敗しました:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const joinWaitlist = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRoom || !playerName.trim()) return;

    setIsJoining(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update room waiting count
      setParlor(prev => {
        if (!prev) return null;
        return {
          ...prev,
          rooms: prev.rooms.map(room =>
            room.id === selectedRoom.id
              ? { ...room, waiting_count: room.waiting_count + 1 }
              : room
          )
        };
      });
      
      setPlayerName('');
      setPhoneNumber('');
      setSelectedRoom(null);
      alert('ウェイトリストに追加されました');
    } catch (error) {
      alert('ウェイトリストへの追加に失敗しました');
    } finally {
      setIsJoining(false);
    }
  };

  const getTotalWaiting = () => {
    return parlor?.rooms.reduce((total, room) => total + room.waiting_count, 0) || 0;
  };

  const getAvailableRooms = () => {
    return parlor?.rooms.filter(room => room.waiting_count === 0) || [];
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
          <h1 className="text-xl font-semibold tracking-tight text-zinc-900 mb-4">
            雀荘が見つかりません
          </h1>
          <Link href="/" className="text-zinc-600 hover:text-zinc-900 font-medium">
            雀荘一覧に戻る
          </Link>
        </div>
      </div>
    );
  }

  const availableRooms = getAvailableRooms();

  return (
    <div className="min-h-screen bg-zinc-50">
      {/* Header */}
      <div className="sticky top-0 bg-white/70 backdrop-blur-md border-b border-black/5 z-10">
        <div className="px-6 py-4">
          <Link href="/" className="text-zinc-600 hover:text-zinc-900 font-medium text-sm mb-2 inline-block">
            ← 雀荘一覧に戻る
          </Link>
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
              {availableRooms.length}
            </div>
            <div className="text-zinc-600 font-medium text-sm mt-1">
              すぐ打てるルーム
            </div>
          </div>
        </div>

        {/* Rooms Status */}
        <div className="space-y-4 mb-6">
          <h2 className="text-lg font-semibold tracking-tight text-zinc-900">
            ルーム状況
          </h2>
          
          <div className="grid gap-4">
            {parlor.rooms.map((room) => (
              <div 
                key={room.id} 
                className="bg-white rounded-2xl p-6 shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-black/5"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold tracking-tight text-zinc-900 text-lg">
                      {room.rank_name}
                    </h3>
                    <div className="flex items-center space-x-2 mt-2">
                      {room.waiting_count === 0 ? (
                        <div className="flex items-center space-x-1">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span className="text-green-700 text-sm font-medium">
                            すぐ打てます
                          </span>
                        </div>
                      ) : (
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800 border border-amber-200">
                          待ち{room.waiting_count}人
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <button
                    onClick={() => setSelectedRoom(room)}
                    className="px-4 py-2 bg-zinc-900 text-white rounded-xl font-medium text-sm hover:bg-zinc-800 transition-all"
                  >
                    参加
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recommended Rooms */}
        {availableRooms.length > 0 && (
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200 mb-6">
            <div className="flex items-center space-x-2 mb-3">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <h3 className="font-semibold tracking-tight text-green-900">
                今すぐ参加できるルーム
              </h3>
            </div>
            <div className="space-y-2">
              {availableRooms.map((room) => (
                <div key={room.id} className="flex items-center justify-between">
                  <span className="text-green-800 font-medium text-sm">
                    {room.rank_name}
                  </span>
                  <button
                    onClick={() => setSelectedRoom(room)}
                    className="px-3 py-1 bg-green-600 text-white rounded-lg font-medium text-xs hover:bg-green-700 transition-all"
                  >
                    参加
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Join Modal */}
      {selectedRoom && (
        <div className="fixed inset-0 bg-black/50 flex items-end justify-center z-50">
          <div className="bg-white rounded-t-3xl w-full max-w-md mx-auto p-6 pb-8">
            <div className="w-12 h-1 bg-zinc-300 rounded-full mx-auto mb-6"></div>
            
            <div className="mb-6">
              <h3 className="text-xl font-semibold tracking-tight text-zinc-900 mb-2">
                ウェイトリストに参加
              </h3>
              <div className="bg-zinc-50 rounded-xl p-4 border border-black/5">
                <div className="text-zinc-900 font-medium text-sm">選択ルーム</div>
                <div className="text-lg font-semibold tracking-tight text-zinc-900 mt-1">
                  {selectedRoom.rank_name}
                </div>
                {selectedRoom.waiting_count > 0 && (
                  <div className="text-zinc-600 text-sm mt-1">
                    現在{selectedRoom.waiting_count}人待ち
                  </div>
                )}
              </div>
            </div>

            <form onSubmit={joinWaitlist} className="space-y-4">
              <div>
                <label htmlFor="playerName" className="block text-sm font-medium text-zinc-900 mb-2">
                  お名前 *
                </label>
                <input
                  type="text"
                  id="playerName"
                  required
                  className="w-full px-4 py-3 border border-black/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent"
                  placeholder="お名前を入力"
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                />
              </div>
              
              <div>
                <label htmlFor="phoneNumber" className="block text-sm font-medium text-zinc-900 mb-2">
                  電話番号 (任意)
                </label>
                <input
                  type="tel"
                  id="phoneNumber"
                  className="w-full px-4 py-3 border border-black/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent"
                  placeholder="電話番号を入力"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                />
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setSelectedRoom(null)}
                  className="flex-1 py-3 px-4 bg-white border border-black/10 rounded-xl font-medium text-zinc-900 hover:bg-zinc-50 transition-all"
                >
                  キャンセル
                </button>
                <button
                  type="submit"
                  disabled={isJoining || !playerName.trim()}
                  className="flex-1 py-3 px-4 bg-zinc-900 text-white rounded-xl font-medium hover:bg-zinc-800 disabled:opacity-50 transition-all"
                >
                  {isJoining ? '追加中...' : '参加'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}