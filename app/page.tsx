"use client";

import { getAllParlorsWithRoomsCount } from "@/lib/firebase";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  HiLocationMarker,
  HiOfficeBuilding,
  HiOutlineDotsHorizontal,
} from "react-icons/hi";

interface ParlorData {
  id: string;
  name: string;
  address: string;
  roomsCount: number;
  hasAvailableRooms: boolean;
}

type FirestoreParlor = {
  id: string;
  name?: string;
  address?: string;
  roomsCount?: number;
  hasAvailableRooms?: boolean;
};

export default function Home() {
  const [parlors, setParlors] = useState<ParlorData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdminMenuOpen, setIsAdminMenuOpen] = useState(false);

  useEffect(() => {
    fetchParlors();
  }, []);

  const fetchParlors = async () => {
    try {
      setIsLoading(true);
      const allParlors = await getAllParlorsWithRoomsCount();

      const formattedParlors: ParlorData[] = (
        allParlors as FirestoreParlor[]
      ).map((parlor) => ({
        id: parlor.id,
        name: parlor.name ?? "名称未設定の雀荘",
        address: parlor.address ?? "住所未登録",
        roomsCount:
          typeof parlor.roomsCount === "number" ? parlor.roomsCount : 0,
        hasAvailableRooms: parlor.hasAvailableRooms ?? false,
      }));

      setParlors(formattedParlors);
    } catch (error) {
      console.error("雀荘一覧の取得に失敗しました:", error);
    } finally {
      setIsLoading(false);
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
        <div className="px-6 py-3 flex items-center justify-between gap-4 relative">
          <div className="flex items-center">
            <h1 className="text-lg font-semibold tracking-tight text-zinc-900">
              janso
            </h1>
          </div>
          <button
            type="button"
            onClick={() => setIsAdminMenuOpen((open: boolean) => !open)}
            className="flex items-center justify-center rounded-full p-1.5 text-zinc-500 hover:text-zinc-800 hover:bg-zinc-50 border border-transparent hover:border-zinc-200 transition-colors"
            aria-label="管理者メニューを開く"
          >
            <HiOutlineDotsHorizontal className="h-5 w-5" />
          </button>

          {isAdminMenuOpen && (
            <div className="absolute right-4 top-14 w-52 rounded-2xl border border-black/5 bg-white shadow-[0_10px_30px_rgba(15,23,42,0.12)] p-2 z-20">
              <Link
                href="/parlor/login"
                className="flex items-center justify-center rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2 text-[12px] font-medium text-zinc-700 hover:bg-zinc-100 hover:border-zinc-300 transition-colors"
              >
                雀荘の管理者ですか？
              </Link>
            </div>
          )}
        </div>
      </div>

      <div className="p-6 pb-10">
        <div className="grid gap-4">
          {parlors.map((parlor) => (
            <Link key={parlor.id} href={`/parlors/${parlor.id}`}>
              <div className="bg-white rounded-2xl p-5 shadow-[0_10px_30px_rgba(15,23,42,0.04)] border border-black/5 hover:border-black/10 hover:shadow-[0_14px_40px_rgba(15,23,42,0.08)] hover:-translate-y-0.5 transition-all duration-200 relative overflow-hidden">
                {parlor.hasAvailableRooms && (
                  <div className="absolute top-0 right-0 bg-green-600 text-white text-[10px] font-bold px-3 py-1.5 rounded-bl-xl shadow-sm z-10">
                    すぐ打てます
                  </div>
                )}
                <div className="flex items-start gap-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-[15px] font-semibold tracking-tight text-zinc-900 leading-snug line-clamp-2 pr-20">
                      {parlor.name}
                    </h3>
                    <div className="mt-2 flex items-start gap-1.5 text-[12px] text-zinc-500 leading-relaxed">
                      <HiLocationMarker className="mt-[2px] h-3.5 w-3.5 flex-shrink-0 text-zinc-400" />
                      <p className="line-clamp-2">{parlor.address}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between text-[12px] text-zinc-500">
                  <span className="font-medium">詳細を見る</span>
                  <span className="flex items-center gap-1 font-medium">
                    <HiOfficeBuilding className="h-3.5 w-3.5 text-zinc-400" />
                    <span>登録部屋数 {parlor.roomsCount} 部屋</span>
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
