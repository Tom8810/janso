import { ParlorService, Room } from '@/lib/firebase/parlor';
import { ApiError, createErrorResponse } from '@/lib/utils/errors';
import { NextRequest, NextResponse } from 'next/server';

interface UpdateRequest {
  id: string;
  rooms: Room[];
}

export async function POST(request: NextRequest) {
  try {
    const requestData = await request.json();
    const { id, rooms }: UpdateRequest = requestData;

    // リクエストデータのバリデーション
    if (!id || typeof id !== 'string') {
      throw new ApiError(400, '雀荘IDが必要です', 'invalid-parlor-id');
    }

    if (!rooms || !Array.isArray(rooms)) {
      throw new ApiError(400, 'rooms配列が必要です', 'invalid-rooms-data');
    }

    // roomsデータのバリデーション
    for (const room of rooms) {
      if (!room.id || typeof room.rank_name !== 'string') {
        throw new ApiError(400, '無効なルームデータです', 'invalid-room-data');
      }
    }

    const updatedParlor = await ParlorService.updateParlorRooms(id, rooms);

    console.log('雀荘データが更新されました:', {
      parlorId: id,
      roomsCount: rooms.length,
      rooms: rooms.map(r => ({
        id: r.id,
        name: r.rank_name,
        waiting: r.waiting_count,
        tables: r.table_count,
        canPlay: r.can_play_immediately
      }))
    });

    return NextResponse.json(updatedParlor, { status: 200 });

  } catch (error) {
    console.error('雀荘データ更新エラー:', error);
    const { error: message, statusCode } = createErrorResponse(error, 'データの更新に失敗しました');

    return NextResponse.json(
      { error: message },
      { status: statusCode }
    );
  }
}
