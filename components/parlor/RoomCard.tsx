import { Room } from "@/lib/firebase/parlor";
import { FiTrash } from "react-icons/fi";

interface RoomCardProps {
  room: Room;
  onToggleStatus: (id: string) => void;
  onUpdateCount: (id: string, increment: boolean) => void;
  onDelete: (id: string) => void;
}

export default function RoomCard({
  room,
  onToggleStatus,
  onUpdateCount,
  onDelete,
}: RoomCardProps) {
  return (
    <div className="bg-white rounded-2xl p-4 shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-black/5 flex items-center gap-4">
      {/* Main Content */}
      <div className="flex-1 min-w-0">
        <div className="flex flex-col gap-3">
          {/* Row 1: Name & Toggle */}
          <div className="flex items-center justify-between gap-2">
            <h3 className="font-semibold tracking-tight text-zinc-900 text-xs truncate">
              {room.rank_name}
            </h3>

            <div className="flex items-center gap-2">
              <span className="text-[11px] text-zinc-600">すぐに打てる</span>
              <button
                onClick={() => onToggleStatus(room.id)}
                className={`relative inline-flex h-5.5 w-10 items-center rounded-full transition-colors ${room.can_play_immediately ? "bg-green-600" : "bg-zinc-300"
                  }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${room.can_play_immediately ? "translate-x-5" : "translate-x-1"
                    }`}
                />
              </button>
            </div>
          </div>

          {/* Row 2: Stats (Vertical) & Buttons (Right) */}
          <div className="flex items-end justify-between gap-2">
            {/* Left: Stats Column */}
            <div className="flex flex-col gap-1">
              <div className="flex items-baseline gap-2">
                <span className="text-zinc-900 font-medium text-xs">
                  待ち人数
                </span>
                <span className="text-sm font-semibold tracking-tight text-zinc-900">
                  {room.waiting_count}/4人
                </span>
              </div>
              <div className="text-[11px] text-zinc-600">
                残り必要人数 {Math.max(0, 4 - room.waiting_count)}人
              </div>
            </div>

            {/* Right: Buttons */}
            <div className="flex items-center space-x-1.5">
              <button
                onClick={() => onUpdateCount(room.id, false)}
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
                onClick={() => onUpdateCount(room.id, true)}
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

      {/* Right Side: Delete Button */}
      <div className="shrink-0 flex items-center justify-center border-l border-black/5 pl-4 py-2">
        <button
          onClick={() => onDelete(room.id)}
          className="w-8 h-8 flex items-center justify-center text-zinc-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
          aria-label="ルームを削除"
        >
          <FiTrash className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
