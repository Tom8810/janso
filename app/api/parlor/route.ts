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
  can_play_immediately?: boolean;
}

interface ParlorData {
  id: string;
  name: string;
  address: string;
  rooms: Room[];
}

export async function GET(request: NextRequest) {
  try {
    // URLパラメータからparlor IDを取得（デフォルトはp-001）
    const { searchParams } = new URL(request.url);
    const parlorId = searchParams.get('id') || 'p-001';

    // Firestoreからparlor情報を取得
    const parlorRef = db.collection('parlors').doc(parlorId);
    const parlorDoc = await parlorRef.get();

    if (!parlorDoc.exists) {
      return NextResponse.json(
        { error: '雀荘が見つかりません' },
        { status: 404 }
      );
    }

    const parlorData = parlorDoc.data();
    
    // roomsサブコレクションを取得
    const roomsSnapshot = await parlorRef.collection('rooms').get();
    const rooms: Room[] = [];
    
    roomsSnapshot.forEach((roomDoc) => {
      const roomData = roomDoc.data();
      rooms.push({
        id: roomDoc.id,
        rank_name: roomData.rank_name || '',
        waiting_count: roomData.waiting_count || 0,
        table_count: roomData.table_count || 0,
        status: roomData.status || 'active',
        can_play_immediately: roomData.can_play_immediately ?? (roomData.waiting_count === 0)
      });
    });

    const result: ParlorData = {
      id: parlorDoc.id,
      name: parlorData?.name || '',
      address: parlorData?.address || '',
      rooms: rooms
    };

    console.log('雀荘データを取得しました:', {
      parlorId: result.id,
      name: result.name,
      roomsCount: result.rooms.length
    });

    return NextResponse.json(result, { status: 200 });
    
  } catch (error) {
    console.error('雀荘データ取得エラー:', error);
    return NextResponse.json(
      { error: 'データの取得に失敗しました' },
      { status: 500 }
    );
  }
}