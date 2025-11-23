import { NextRequest, NextResponse } from 'next/server';
import admin from 'firebase-admin';

// エミュレータ用に projectId のみ指定して初期化（認証情報は不要）
let db: admin.firestore.Firestore;

if (!admin.apps.length) {
  const app = admin.initializeApp({
    projectId: "jansou-3138d",
  });
  
  db = admin.firestore(app);
  
  // Firestore エミュレータ設定 (初期化直後)
  if (process.env.NODE_ENV !== 'production') {
    db.settings({
      host: 'localhost:8080',
      ssl: false
    });
  }
} else {
  db = admin.firestore();
}

interface Room {
  id: string;
  rank_name: string;
  waiting_count: number;
  table_count: number;
  status: "active" | "inactive";
  can_play_immediately: boolean;
}

interface UpdateRequest {
  id: string;
  rooms: Room[];
}

export async function POST(request: NextRequest) {
  try {
    const { id, rooms }: UpdateRequest = await request.json();

    if (!id || !rooms || !Array.isArray(rooms)) {
      return NextResponse.json(
        { error: '無効なリクエストデータです' },
        { status: 400 }
      );
    }

    const parlorRef = db.collection('parlors').doc(id);
    
    // parlorの存在確認
    const parlorDoc = await parlorRef.get();
    if (!parlorDoc.exists) {
      return NextResponse.json(
        { error: '雀荘が見つかりません' },
        { status: 404 }
      );
    }

    // roomsサブコレクションを一括更新
    const batch = db.batch();
    
    for (const room of rooms) {
      const roomRef = parlorRef.collection('rooms').doc(room.id);
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

    // parlor情報を再取得して返す
    const parlorData = parlorDoc.data();
    const updatedRoomsSnapshot = await parlorRef.collection('rooms').get();
    const updatedRooms: Room[] = [];
    
    updatedRoomsSnapshot.forEach((roomDoc) => {
      const roomData = roomDoc.data();
      updatedRooms.push({
        id: roomDoc.id,
        rank_name: roomData.rank_name || '',
        waiting_count: roomData.waiting_count || 0,
        table_count: roomData.table_count || 0,
        status: roomData.status || 'active',
        can_play_immediately: roomData.can_play_immediately ?? false,
      });
    });

    const updatedParlor = {
      id: parlorDoc.id,
      name: parlorData?.name || '',
      address: parlorData?.address || '',
      rooms: updatedRooms
    };

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
    return NextResponse.json(
      { error: 'サーバーエラーが発生しました' },
      { status: 500 }
    );
  }
}