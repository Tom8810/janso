import { ParlorData, Room } from "@/lib/firebase/parlor";
import { User } from "firebase/auth";
import { useCallback, useEffect, useState } from "react";

export function useParlorManagement(user: User | null, isAuthenticated: boolean) {
  const [parlor, setParlor] = useState<ParlorData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

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
    if (isAuthenticated) {
      fetchParlorData();
    }
  }, [isAuthenticated, fetchParlorData]);

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

  const addRoom = (rankName: string, tableCount: number) => {
    try {
      const room: Room = {
        id: Date.now().toString(),
        rank_name: rankName.trim(),
        waiting_count: 0,
        table_count: tableCount,
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

  const deleteRoom = (roomId: string) => {
    if (
      !confirm(
        "このルームを削除してもよろしいですか？\n※「変更を保存」を押すまで削除は確定しません"
      )
    )
      return;

    setParlor((prev) => {
      if (!prev) return null;

      return {
        ...prev,
        rooms: prev.rooms.filter((room) => room.id !== roomId),
      };
    });
    setHasUnsavedChanges(true);
  };

  const updateParlorData = async () => {
    if (!parlor) return;

    try {
      setIsUpdating(true);

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

  return {
    parlor,
    isLoading,
    isUpdating,
    hasUnsavedChanges,
    updateWaitingCount,
    addRoom,
    toggleCanPlayImmediately,
    deleteRoom,
    updateParlorData,
  };
}
