"use client";

import { getParlorDetailWithRooms } from "@/lib/firebase";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { HiArrowLeft, HiLocationMarker, HiPhone, HiClock, HiInformationCircle } from "react-icons/hi";

interface Room {
  id: string;
  rank_name: string;
  waiting_count: number;
}

interface ParlorDetailData {
  id: string;
  name: string;
  address: string;
  phoneNumber?: string;
  businessHours?: { open: string; close: string };
  description?: string;
  maxCapacity?: number;
  rooms: Room[];
}

export default function ParlorDetail() {
  const params = useParams<{ id: string }>();
  const [parlor, setParlor] = useState<ParlorDetailData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!params?.id) return;
    fetchParlorDetail(params.id);
  }, [params?.id]);

  const fetchParlorDetail = async (id: string) => {
    try {
      setIsLoading(true);
      const parlorData = await getParlorDetailWithRooms(id);

      const formattedRooms: Room[] = (parlorData.rooms as any[]).map(
        (room) => ({
          id: room.id,
          rank_name: room.rank_name ?? "名称未設定のルーム",
          waiting_count:
            typeof room.waiting_count === "number" ? room.waiting_count : 0,
        })
      );

      setParlor({
        id: parlorData.id as string,
        name: (parlorData as any).name ?? "名称未設定の雀荘",
        address: (parlorData as any).address ?? "住所未登録",
        phoneNumber: (parlorData as any).phoneNumber,
        businessHours: (parlorData as any).businessHours,
        description: (parlorData as any).description,
        maxCapacity: (parlorData as any).maxCapacity,
        rooms: formattedRooms,
      });
    } catch (error) {
      console.error("雀荘詳細の取得に失敗しました:", error);
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

  if (!parlor) {
    return (
      <div className="min-h-screen bg-zinc-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-xl font-semibold tracking-tight text-zinc-900 mb-4">
            雀荘が見つかりません
          </h1>
          <Link
            href="/"
            className="inline-flex items-center gap-1 text-zinc-600 hover:text-zinc-900 font-medium text-sm"
          >
            <HiArrowLeft className="h-4 w-4" />
            雀荘一覧に戻る
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50">
      {/* Header */}
      <div className="sticky top-0 bg-white/70 backdrop-blur-md border-b border-black/5 z-10">
        <div className="px-6 py-3">
          <Link
            href="/"
            className="inline-flex items-center gap-1 text-sm font-medium text-zinc-600 hover:text-zinc-900"
          >
            <HiArrowLeft className="h-4 w-4" />
            雀荘一覧に戻る
          </Link>
        </div>
      </div>

      <div className="p-6 pb-10">
        {/* Parlor Info */}
        <div className="mb-6 bg-white rounded-2xl p-5 shadow-[0_10px_30px_rgba(15,23,42,0.04)] border border-black/5">
          <h1 className="text-lg font-semibold tracking-tight text-zinc-900 leading-snug mb-4">
            {parlor.name}
          </h1>
          
          {/* Address */}
          <div className="flex items-start gap-2 text-[13px] text-zinc-600 mb-3">
            <HiLocationMarker className="mt-[2px] h-4 w-4 flex-shrink-0 text-zinc-400" />
            <p className="leading-relaxed">{parlor.address}</p>
          </div>

          {/* Phone */}
          {parlor.phoneNumber && (
            <div className="flex items-center gap-2 text-[13px] text-zinc-600 mb-3">
              <HiPhone className="h-4 w-4 flex-shrink-0 text-zinc-400" />
              <a href={`tel:${parlor.phoneNumber}`} className="hover:text-zinc-900 transition-colors">
                {parlor.phoneNumber}
              </a>
            </div>
          )}

          {/* Business Hours */}
          {parlor.businessHours && (
            <div className="flex items-center gap-2 text-[13px] text-zinc-600 mb-3">
              <HiClock className="h-4 w-4 flex-shrink-0 text-zinc-400" />
              <p>
                {parlor.businessHours.open} - {parlor.businessHours.close}
              </p>
            </div>
          )}

          {/* Description */}
          {parlor.description && (
            <div className="mt-4 pt-4 border-t border-black/5">
              <div className="flex items-start gap-2 text-[13px] text-zinc-600">
                <HiInformationCircle className="mt-[2px] h-4 w-4 flex-shrink-0 text-zinc-400" />
                <p className="leading-relaxed">{parlor.description}</p>
              </div>
            </div>
          )}

          {/* Max Capacity */}
          {parlor.maxCapacity && (
            <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 bg-zinc-50 rounded-lg border border-black/5">
              <span className="text-[12px] text-zinc-500 font-medium">最大収容人数</span>
              <span className="text-[13px] text-zinc-900 font-semibold">{parlor.maxCapacity}名</span>
            </div>
          )}
        </div>

        {/* Rooms Status */}
        <div className="space-y-4 mb-6">
          <h2 className="text-sm font-semibold tracking-tight text-zinc-900">
            ルーム状況
          </h2>

          {parlor.rooms.length === 0 ? (
            <p className="mt-2 text-[12px] text-zinc-500 font-medium">
              まだ部屋が登録されていません
            </p>
          ) : (
            <div className="grid gap-4">
              {parlor.rooms.map((room) => (
                <div
                  key={room.id}
                  className="bg-white rounded-2xl p-5 shadow-[0_10px_30px_rgba(15,23,42,0.04)] border border-black/5 hover:border-black/10 hover:shadow-[0_14px_40px_rgba(15,23,42,0.08)] hover:-translate-y-0.5 transition-all duration-200"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-[15px] font-semibold tracking-tight text-zinc-900 leading-snug line-clamp-2">
                        {room.rank_name}
                      </h3>
                      <p className="mt-2 text-[12px] text-zinc-500 font-medium">
                        現在の状況: {room.waiting_count}/4 人
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
