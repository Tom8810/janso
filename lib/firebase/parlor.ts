import { adminDb } from "./admin";
import { ApiError } from "../utils/errors";

export interface Room {
  id: string;
  rank_name: string;
  waiting_count: number;
  table_count: number;
  status: "active" | "inactive";
  can_play_immediately?: boolean;
}

export interface ParlorData {
  id: string;
  name: string;
  address: string;
  rooms: Room[];
}

export class ParlorService {
  private static readonly COLLECTION_NAME = "parlors";

  /**
   * 雀荘データを取得
   */
  static async getParlor(parlorId: string): Promise<ParlorData> {
    try {
      const parlorRef = adminDb.collection(this.COLLECTION_NAME).doc(parlorId);
      const parlorDoc = await parlorRef.get();

      if (!parlorDoc.exists) {
        throw new ApiError(404, "雀荘が見つかりません", "parlor-not-found");
      }

      const parlorData = parlorDoc.data();
      
      // roomsサブコレクションを取得
      const roomsSnapshot = await parlorRef.collection("rooms").get();
      const rooms: Room[] = [];
      
      roomsSnapshot.forEach((roomDoc) => {
        const roomData = roomDoc.data();
        rooms.push({
          id: roomDoc.id,
          rank_name: roomData.rank_name || "",
          waiting_count: roomData.waiting_count || 0,
          table_count: roomData.table_count || 0,
          status: roomData.status || "active",
          can_play_immediately: roomData.can_play_immediately ?? (roomData.waiting_count === 0)
        });
      });

      const result: ParlorData = {
        id: parlorDoc.id,
        name: parlorData?.name || "",
        address: parlorData?.address || "",
        rooms: rooms
      };

      return result;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      console.error("Error fetching parlor:", error);
      throw new ApiError(500, "雀荘データの取得に失敗しました");
    }
  }

  /**
   * 雀荘のroomsを更新
   */
  static async updateParlorRooms(parlorId: string, rooms: Room[]): Promise<ParlorData> {
    try {
      const parlorRef = adminDb.collection(this.COLLECTION_NAME).doc(parlorId);
      
      // parlorの存在確認
      const parlorDoc = await parlorRef.get();
      if (!parlorDoc.exists) {
        throw new ApiError(404, "雀荘が見つかりません", "parlor-not-found");
      }

      // roomsサブコレクションを一括更新
      const batch = adminDb.batch();
      
      for (const room of rooms) {
        const roomRef = parlorRef.collection("rooms").doc(room.id);
        batch.set(roomRef, {
          rank_name: room.rank_name,
          waiting_count: room.waiting_count,
          table_count: room.table_count,
          status: room.status,
          can_play_immediately: room.can_play_immediately,
        }, { merge: true });
      }

      // バッチコミット
      await batch.commit();

      // 更新後のデータを取得して返す
      return await this.getParlor(parlorId);
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      console.error("Error updating parlor rooms:", error);
      throw new ApiError(500, "雀荘データの更新に失敗しました");
    }
  }

  /**
   * 新しいルームを追加
   */
  static async addRoom(parlorId: string, room: Omit<Room, "id">): Promise<ParlorData> {
    try {
      const parlorRef = adminDb.collection(this.COLLECTION_NAME).doc(parlorId);
      
      // parlorの存在確認
      const parlorDoc = await parlorRef.get();
      if (!parlorDoc.exists) {
        throw new ApiError(404, "雀荘が見つかりません", "parlor-not-found");
      }

      // 新しいルームを追加
      const newRoomRef = parlorRef.collection("rooms").doc();
      await newRoomRef.set({
        rank_name: room.rank_name,
        waiting_count: room.waiting_count,
        table_count: room.table_count,
        status: room.status,
        can_play_immediately: room.can_play_immediately,
      });

      // 更新後のデータを取得して返す
      return await this.getParlor(parlorId);
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      console.error("Error adding room:", error);
      throw new ApiError(500, "ルームの追加に失敗しました");
    }
  }
}