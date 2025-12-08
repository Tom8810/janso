"use client";

import { useState } from "react";

interface AddRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (rankName: string, tableCount: number) => void;
}

export default function AddRoomModal({
  isOpen,
  onClose,
  onAdd,
}: AddRoomModalProps) {
  const [newRoom, setNewRoom] = useState({
    rank_name: "",
    table_count: 1,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoom.rank_name.trim()) return;

    onAdd(newRoom.rank_name, newRoom.table_count);
    setNewRoom({ rank_name: "", table_count: 1 });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl w-full max-w-sm mx-auto p-6">
        <div className="mb-4">
          <h3 className="text-lg font-semibold tracking-tight text-zinc-900 mb-2">
            新しいルームを追加
          </h3>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
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
              className="w-full px-3.5 py-2.5 border border-black/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent text-sm text-zinc-900"
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
              onClick={onClose}
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
  );
}
