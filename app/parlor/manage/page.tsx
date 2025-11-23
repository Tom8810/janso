"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { signOutParlor } from "@/lib/firebase";

interface Room {
  id: string;
  rank_name: string;
  waiting_count: number;
  table_count: number;
  status: "active" | "inactive";
  can_play_immediately: boolean;
}

interface ParlorData {
  id: string;
  name: string;
  address: string;
  rooms: Room[];
}

export default function ParlorManagement() {
  const [parlor, setParlor] = useState<ParlorData | null>(null);
  const [originalRoomIds, setOriginalRoomIds] = useState<Set<string>>(
    new Set()
  );
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [showAddRoom, setShowAddRoom] = useState(false);
  const [newRoom, setNewRoom] = useState({
    rank_name: "",
    table_count: 1,
  });
  const router = useRouter();

  useEffect(() => {
    fetchParlorData();
  }, []);

  const fetchParlorData = async () => {
    try {
      setIsLoading(true);

      const response = await fetch("/api/parlor");
      if (!response.ok) {
        throw new Error("雀荘データの取得に失敗しました");
      }

      const parlorData: ParlorData = await response.json();
      setParlor(parlorData);
      setOriginalRoomIds(new Set(parlorData.rooms.map((room) => room.id)));
    } catch (error) {
      console.error("雀荘データの取得に失敗しました:", error);
      alert("雀荘データの取得に失敗しました。もう一度お試しください。");
    } finally {
      setIsLoading(false);
    }
  };

  const updateWaitingCount = (roomId: string, increment: boolean) => {
    setParlor((prev) => {
      if (!prev) return null;

      return {
        ...prev,
        rooms: prev.rooms.map((room) =>
          room.id === roomId
            ? {
                ...room,
                waiting_count: Math.max(
                  0,
                  room.waiting_count + (increment ? 1 : -1)
                ),
              }
            : room
        ),
      };
    });
    setHasUnsavedChanges(true);
  };

  const getTotalWaiting = () => {
    return (
      parlor?.rooms.reduce((total, room) => total + room.waiting_count, 0) || 0
    );
  };

  const getTotalTables = () => {
    return (
      parlor?.rooms.reduce((total, room) => total + room.table_count, 0) || 0
    );
  };

  const handleLogout = async () => {
    if (!confirm("ログアウトしますか？")) return;

    setIsLoggingOut(true);
    try {
      await signOutParlor();
      localStorage.removeItem("parlor_session");
      router.push("/parlor/login");
    } catch (error: any) {
      alert(error.message || "ログアウトに失敗しました");
      setIsLoggingOut(false);
    }
  };

  const addRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!parlor || !newRoom.rank_name.trim()) return;

    try {
      const room: Room = {
        id: Date.now().toString(),
        rank_name: newRoom.rank_name.trim(),
        waiting_count: 0,
        table_count: newRoom.table_count,
        status: "active",
        can_play_immediately: true,
      };

      setParlor((prev) =>
        prev
          ? {
              ...prev,
              rooms: [...prev.rooms, room],
            }
          : null
      );

      setNewRoom({ rank_name: "", table_count: 1 });
      setShowAddRoom(false);
      setHasUnsavedChanges(true);
      alert(
        "ルームが一時的に追加されました。\n「データ更新」ボタンを押して保存してください。"
      );
    } catch (error) {
      alert("ルームの追加に失敗しました");
    }
  };

  const toggleCanPlayImmediately = (roomId: string) => {
    setParlor((prev) => {
      if (!prev) return null;

      return {
        ...prev,
        rooms: prev.rooms.map((room) =>
          room.id === roomId
            ? { ...room, can_play_immediately: !room.can_play_immediately }
            : room
        ),
      };
    });
    setHasUnsavedChanges(true);
  };

  const updateParlorData = async () => {
    if (!parlor) return;

    try {
      setIsUpdating(true);

      // APIエンドポイントに現在のrooms情報を送信
      const response = await fetch("/api/parlor/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: parlor.id,
          rooms: parlor.rooms,
        }),
      });

      if (!response.ok) {
        throw new Error("更新に失敗しました");
      }

      const updatedData = await response.json();
      setParlor(updatedData);
      setOriginalRoomIds(new Set(updatedData.rooms.map((room) => room.id)));
      setHasUnsavedChanges(false);
      alert("データが正常に更新されました");
    } catch (error) {
      console.error("更新エラー:", error);
      alert("データの更新に失敗しました。もう一度お試しください。");
    } finally {
      setIsUpdating(false);
    }
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
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold tracking-tight text-zinc-900">
                {parlor.name}
              </h1>
              <p className="text-zinc-600 font-medium text-sm mt-1">
                {parlor.address}
              </p>
            </div>

            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="px-4 py-2 bg-white border border-black/10 rounded-xl font-medium text-zinc-900 hover:bg-zinc-50 hover:border-black/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-sm"
            >
              {isLoggingOut ? "ログアウト中..." : "ログアウト"}
            </button>
          </div>
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
            <div className="text-zinc-600 font-medium text-sm mt-1">総卓数</div>
          </div>
        </div>

        {/* Room Management - Bento Grid */}
        <div className="space-y-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold tracking-tight text-zinc-900">
              ルーム管理
            </h2>
            <button
              onClick={() => setShowAddRoom(true)}
              className="px-4 py-2 bg-zinc-900 text-white rounded-xl font-medium text-sm hover:bg-zinc-800 transition-all"
            >
              ルーム追加
            </button>
          </div>

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
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          room.status === "active"
                            ? "bg-green-100 text-green-800 border border-green-200"
                            : "bg-gray-100 text-gray-600 border border-gray-200"
                        }`}
                      >
                        {room.status === "active"
                          ? "アクティブ"
                          : "非アクティブ"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Can Play Immediately Toggle */}
                <div className="mb-4 p-3 bg-zinc-50 rounded-xl border border-black/5">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-zinc-900 font-medium text-sm">
                        すぐ打てる状態
                      </div>
                      <div className="text-zinc-600 text-xs mt-1">
                        {room.can_play_immediately
                          ? "現在すぐに参加可能です"
                          : "現在参加できません"}
                      </div>
                    </div>
                    <button
                      onClick={() => toggleCanPlayImmediately(room.id)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        room.can_play_immediately
                          ? "bg-green-600"
                          : "bg-zinc-300"
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          room.can_play_immediately
                            ? "translate-x-6"
                            : "translate-x-1"
                        }`}
                      />
                    </button>
                  </div>
                </div>

                {/* Waiting Count Management */}
                <div className="bg-zinc-50 rounded-xl p-4 border border-black/5">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-zinc-900 font-medium text-sm">
                        待ち人数
                      </div>
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
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <line x1="5" y1="12" x2="19" y2="12"></line>
                        </svg>
                      </button>

                      <button
                        onClick={() => updateWaitingCount(room.id, true)}
                        className="w-10 h-10 bg-zinc-900 text-white rounded-full flex items-center justify-center hover:bg-zinc-800 transition-all"
                      >
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
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

      {/* Add Room Modal */}
      {showAddRoom && (
        <div className="fixed inset-0 bg-black/50 flex items-end justify-center z-50">
          <div className="bg-white rounded-t-3xl w-full max-w-md mx-auto p-6 pb-8">
            <div className="w-12 h-1 bg-zinc-300 rounded-full mx-auto mb-6"></div>

            <div className="mb-6">
              <h3 className="text-xl font-semibold tracking-tight text-zinc-900 mb-2">
                新しいルームを追加
              </h3>
            </div>

            <form onSubmit={addRoom} className="space-y-4">
              <div>
                <label
                  htmlFor="rank_name"
                  className="block text-sm font-medium text-zinc-900 mb-2"
                >
                  ランク名 *
                </label>
                <input
                  type="text"
                  id="rank_name"
                  required
                  className="w-full px-4 py-3 border border-black/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent"
                  placeholder="ランク 二点零"
                  value={newRoom.rank_name}
                  onChange={(e) =>
                    setNewRoom({ ...newRoom, rank_name: e.target.value })
                  }
                />
              </div>

              <div>
                <label
                  htmlFor="table_count"
                  className="block text-sm font-medium text-zinc-900 mb-2"
                >
                  卓数 *
                </label>
                <input
                  type="number"
                  id="table_count"
                  required
                  min="1"
                  className="w-full px-4 py-3 border border-black/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent"
                  placeholder="1"
                  value={newRoom.table_count}
                  onChange={(e) =>
                    setNewRoom({
                      ...newRoom,
                      table_count: parseInt(e.target.value) || 1,
                    })
                  }
                />
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddRoom(false)}
                  className="flex-1 py-3 px-4 bg-white border border-black/10 rounded-xl font-medium text-zinc-900 hover:bg-zinc-50 transition-all"
                >
                  キャンセル
                </button>
                <button
                  type="submit"
                  disabled={!newRoom.rank_name.trim()}
                  className="flex-1 py-3 px-4 bg-zinc-900 text-white rounded-xl font-medium hover:bg-zinc-800 disabled:opacity-50 transition-all"
                >
                  追加
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Bottom Actions */}
      <div className="fixed bottom-0 left-0 right-0 p-6 bg-white/70 backdrop-blur-md border-t border-black/5">
        <div className="grid grid-cols-2 gap-3">
          <button className="py-3 px-4 bg-white border border-black/10 rounded-2xl font-medium text-zinc-900 hover:bg-zinc-50 hover:border-black/20 transition-all">
            設定
          </button>
          <button
            onClick={updateParlorData}
            disabled={isUpdating}
            className={`py-3 px-4 rounded-2xl font-medium transition-all ${
              hasUnsavedChanges
                ? "bg-amber-500 text-white hover:bg-amber-600 shadow-lg"
                : "bg-zinc-900 text-white hover:bg-zinc-800"
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {isUpdating
              ? "更新中..."
              : hasUnsavedChanges
              ? "変更を保存"
              : "データ更新"}
          </button>
        </div>
        {hasUnsavedChanges && (
          <div className="text-center mt-2">
            <span className="text-amber-600 text-xs font-medium">
              変更を保存するには「変更を保存」ボタンを押してください
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
