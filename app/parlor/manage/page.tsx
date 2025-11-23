"use client";

import { useParlorAuth } from "@/hooks/useParlorAuth";
import { signOutParlor } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { FiCopy, FiPlus } from "react-icons/fi";

import { ParlorData, Room } from "@/lib/firebase/parlor";

export default function ParlorManagement() {
  const { user, loading: authLoading, isAuthenticated } = useParlorAuth();
  const [parlor, setParlor] = useState<ParlorData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [showAddRoom, setShowAddRoom] = useState(false);
  const [newRoom, setNewRoom] = useState({
    rank_name: "",
    table_count: 1,
  });
  const [copyMessage, setCopyMessage] = useState<string | null>(null);
  const router = useRouter();

  const fetchParlorData = useCallback(async () => {
    try {
      setIsLoading(true);

      if (!user) return;
      const response = await fetch(`/api/parlor?id=${user.uid}`);
      if (!response.ok) {
        throw new Error("雀荘データの取得に失敗しました");
      }

      const parlorData: ParlorData = await response.json();
      setParlor(parlorData);
    } catch (error) {
      console.error("雀荘データの取得に失敗しました:", error);
      alert("雀荘データの取得に失敗しました。もう一度お試しください。");
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/parlor/login");
      return;
    }

    if (isAuthenticated) {
      fetchParlorData();
    }
  }, [authLoading, isAuthenticated, router, fetchParlorData]);

  const updateWaitingCount = (roomId: string, increment: boolean) => {
    setParlor((prev) => {
      if (!prev) return null;

      return {
        ...prev,
        rooms: prev.rooms.map((room) => {
          if (room.id !== roomId) return room;

          const nextCount = room.waiting_count + (increment ? 1 : -1);
          return {
            ...room,
            waiting_count: Math.max(0, Math.min(4, nextCount)),
          };
        }),
      };
    });
    setHasUnsavedChanges(true);
  };

  const handleLogout = async () => {
    if (!confirm("ログアウトしますか？")) return;

    setIsLoggingOut(true);
    try {
      await signOutParlor();
      localStorage.removeItem("parlor_session");
      router.push("/parlor/login");
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message || "ログアウトに失敗しました");
      } else {
        alert("ログアウトに失敗しました");
      }
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
        status: "active" as const,
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
    } catch {
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

      const updatedData: ParlorData = await response.json();
      setParlor(updatedData);
      setHasUnsavedChanges(false);
      alert("データが正常に更新されました");
    } catch (error) {
      console.error("更新エラー:", error);
      alert("データの更新に失敗しました。もう一度お試しください。");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCopyStatus = async () => {
    if (!parlor) return;

    try {
      const lines: string[] = [];

      const origin =
        typeof window !== "undefined" && window.location
          ? window.location.origin
          : "";
      const parlorUrl = origin
        ? `${origin}/parlors/${parlor.id}`
        : `/parlors/${parlor.id}`;

      lines.push(`【${parlor.name}】テーブル状況`);
      lines.push("");
      lines.push(`住所：${parlor.address}`);
      lines.push(`URL：${parlorUrl}`);
      lines.push("");
      lines.push("▼ルーム一覧");

      parlor.rooms.forEach((room) => {
        const waitingText = `待ち人数：${
          room.waiting_count
        }/4人（残り${Math.max(0, 4 - room.waiting_count)}人）`;
        const canPlayText = room.can_play_immediately
          ? "すぐに打てます"
          : "すぐには打てません";
        const tableText = `卓数：${room.table_count}卓`;

        lines.push(
          `・${room.rank_name}
  - ${waitingText}
  - ${tableText}
  - ${canPlayText}`
        );
      });

      const text = lines.join("\n");

      if (!navigator.clipboard) {
        throw new Error("Clipboard API is not available");
      }

      await navigator.clipboard.writeText(text);

      setCopyMessage("テーブル状況をテキストとしてコピーしました");
      setTimeout(() => {
        setCopyMessage((current) => (current ? null : current));
      }, 3000);
    } catch (error) {
      console.error("テーブル状況のコピーに失敗しました:", error);
      alert(
        "テーブル状況のコピーに失敗しました。ブラウザの設定をご確認のうえ、もう一度お試しください。"
      );
    }
  };

  // 認証チェック中
  if (authLoading) {
    return (
      <div className="min-h-screen bg-zinc-50 flex items-center justify-center">
        <div className="text-zinc-600 font-medium">認証状態を確認中...</div>
      </div>
    );
  }

  // 未認証の場合（リダイレクト処理中）
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-zinc-50 flex items-center justify-center">
        <div className="text-zinc-600 font-medium">
          ログインページにリダイレクト中...
        </div>
      </div>
    );
  }

  // 雀荘データ読み込み中
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
          <h1 className="text-lg font-semibold tracking-tight text-zinc-900 mb-2">
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
        <div className="px-4 py-2.5 max-w-3xl mx-auto">
          <div className="flex items-center justify-between gap-4">
            <div className="min-w-0">
              <h1 className="text-base font-semibold tracking-tight text-zinc-900 truncate">
                {parlor.name}
              </h1>
              <p className="text-zinc-600 font-medium text-[11px] mt-0.5 truncate">
                {parlor.address}
              </p>
            </div>

            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="shrink-0 px-3 py-1 bg-white border border-black/10 rounded-xl font-medium text-[11px] text-zinc-900 hover:bg-zinc-50 hover:border-black/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {isLoggingOut ? "ログアウト中..." : "ログアウト"}
            </button>
          </div>
        </div>
      </div>

      <div className="px-4 pt-4 pb-20 max-w-3xl mx-auto">
        {/* Room Management */}
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-sm font-semibold tracking-tight text-zinc-900">
              ルーム一覧
            </h2>
            <p className="text-[11px] text-zinc-500 mt-0.5">
              各ルームの待ち人数と稼働状況を管理できます
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyStatus}
              className="w-8 h-8 bg-white rounded-full border border-black/10 flex items-center justify-center text-zinc-600 hover:bg-zinc-50 hover:border-black/20 transition-all"
              aria-label="テーブル状況をテキストとしてコピー"
            >
              <FiCopy className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="space-y-3">
          {parlor.rooms.map((room) => (
            <div
              key={room.id}
              className="bg-white rounded-2xl p-4 shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-black/5"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold tracking-tight text-zinc-900 text-xs truncate">
                      {room.rank_name}
                    </h3>
                  </div>
                </div>
                {/* Can Play Immediately Toggle (Header position) */}
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-[11px] text-zinc-600">
                    すぐに打てる
                  </span>
                  <button
                    onClick={() => toggleCanPlayImmediately(room.id)}
                    className={`relative inline-flex h-5.5 w-10 items-center rounded-full transition-colors ${
                      room.can_play_immediately ? "bg-green-600" : "bg-zinc-300"
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        room.can_play_immediately
                          ? "translate-x-5"
                          : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>
              </div>

              {/* Body */}
              <div className="mt-3 flex flex-col gap-2.5">
                {/* Waiting Count */}
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-zinc-900 font-medium text-xs">
                        待ち人数
                      </span>
                      <span className="text-sm font-semibold tracking-tight text-zinc-900">
                        {room.waiting_count}/4人
                      </span>
                    </div>
                    <div className="text-[11px] text-zinc-600 mt-0.5">
                      残り必要人数 {Math.max(0, 4 - room.waiting_count)}人
                    </div>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <button
                      onClick={() => updateWaitingCount(room.id, false)}
                      disabled={room.waiting_count === 0}
                      className="w-8 h-8 bg-white rounded-full border border-black/10 flex items-center justify-center text-zinc-600 hover:bg-zinc-50 hover:border-black/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                      <svg
                        width="13"
                        height="13"
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
                      className="w-8 h-8 bg-zinc-900 text-white rounded-full flex items-center justify-center hover:bg-zinc-800 transition-all"
                    >
                      <svg
                        width="13"
                        height="13"
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

        <div className="mt-4 flex justify-center">
          <button
            onClick={() => setShowAddRoom(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-zinc-900 text-white rounded-2xl font-medium text-xs hover:bg-zinc-800 transition-all shadow-[0_2px_8px_rgba(0,0,0,0.08)]"
          >
            <FiPlus className="w-4 h-4" />
            <span>ルーム追加</span>
          </button>
        </div>
      </div>

      {/* Add Room Modal */}
      {showAddRoom && (
        <div className="fixed inset-0 bg-black/50 flex items-end justify-center z-50">
          <div className="bg-white rounded-t-3xl w-full max-w-md mx-auto p-4 pb-6">
            <div className="w-10 h-1 bg-zinc-300 rounded-full mx-auto mb-4"></div>

            <div className="mb-4">
              <h3 className="text-lg font-semibold tracking-tight text-zinc-900 mb-2">
                新しいルームを追加
              </h3>
            </div>

            <form onSubmit={addRoom} className="space-y-3">
              <div>
                <label
                  htmlFor="rank_name"
                  className="block text-sm font-medium text-zinc-900 mb-2"
                >
                  卓名 *
                </label>
                <input
                  type="text"
                  id="rank_name"
                  required
                  className="w-full px-3.5 py-2.5 border border-black/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent text-sm"
                  placeholder="卓名 1卓目"
                  value={newRoom.rank_name}
                  onChange={(e) =>
                    setNewRoom({ ...newRoom, rank_name: e.target.value })
                  }
                />
              </div>

              <div className="flex space-x-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddRoom(false)}
                  className="flex-1 py-2.5 px-3.5 bg-white border border-black/10 rounded-xl font-medium text-sm text-zinc-900 hover:bg-zinc-50 transition-all"
                >
                  キャンセル
                </button>
                <button
                  type="submit"
                  disabled={!newRoom.rank_name.trim()}
                  className="flex-1 py-2.5 px-3.5 bg-zinc-900 text-white rounded-xl font-medium text-sm hover:bg-zinc-800 disabled:opacity-50 transition-all"
                >
                  追加
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Copy Toast */}
      {copyMessage && (
        <div className="fixed bottom-20 left-0 right-0 flex justify-center px-4 pointer-events-none">
          <div className="inline-flex items-center px-3 py-1.5 rounded-full bg-zinc-900 text-white text-[11px] font-medium shadow-[0_2px_8px_rgba(0,0,0,0.18)]">
            {copyMessage}
          </div>
        </div>
      )}

      {/* Bottom Actions */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/70 backdrop-blur-md border-t border-black/5">
        <div className="grid grid-cols-2 gap-2.5 max-w-3xl mx-auto">
          <button className="py-2.5 px-3.5 bg-white border border-black/10 rounded-2xl font-medium text-sm text-zinc-900 hover:bg-zinc-50 hover:border-black/20 transition-all">
            設定
          </button>
          <button
            onClick={updateParlorData}
            disabled={isUpdating}
            className={`py-2.5 px-3.5 rounded-2xl font-medium text-sm transition-all ${
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
            <span className="text-amber-600 text-[11px] font-medium">
              変更を保存するには「変更を保存」ボタンを押してください
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
