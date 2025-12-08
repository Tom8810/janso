"use client";

import AddRoomModal from "@/components/parlor/AddRoomModal";
import RoomCard from "@/components/parlor/RoomCard";
import LoadingScreen from "@/components/ui/LoadingScreen";
import { useParlorAuth } from "@/hooks/useParlorAuth";
import { useParlorManagement } from "@/hooks/useParlorManagement";
import { signOutParlor } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FiCopy, FiPlus } from "react-icons/fi";

export default function ParlorManagement() {
  const { user, loading: authLoading, isAuthenticated } = useParlorAuth();
  const router = useRouter();
  const [showAddRoom, setShowAddRoom] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [copyMessage, setCopyMessage] = useState<string | null>(null);

  const {
    parlor,
    isLoading,
    isUpdating,
    hasUnsavedChanges,
    updateWaitingCount,
    addRoom,
    toggleCanPlayImmediately,
    deleteRoom,
    updateParlorData,
  } = useParlorManagement(user, isAuthenticated);

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
        const waitingText = `待ち人数：${room.waiting_count}/4人（残り${Math.max(
          0,
          4 - room.waiting_count
        )}人）`;
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
    return <LoadingScreen message="認証状態を確認中..." />;
  }

  // 未認証の場合（リダイレクト処理中）
  if (!isAuthenticated) {
    return <LoadingScreen message="ログインページにリダイレクト中..." />;
  }

  // 雀荘データ読み込み中
  if (isLoading) {
    return <LoadingScreen />;
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
            <RoomCard
              key={room.id}
              room={room}
              onToggleStatus={toggleCanPlayImmediately}
              onUpdateCount={updateWaitingCount}
              onDelete={deleteRoom}
            />
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

      <AddRoomModal
        isOpen={showAddRoom}
        onClose={() => setShowAddRoom(false)}
        onAdd={addRoom}
      />

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
            className={`py-2.5 px-3.5 rounded-2xl font-medium text-sm transition-all ${hasUnsavedChanges
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
