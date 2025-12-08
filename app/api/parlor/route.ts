import { ParlorService } from '@/lib/firebase/parlor';
import { createErrorResponse } from '@/lib/utils/errors';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // URLパラメータからparlor IDを取得（デフォルトはp-001）
    const { searchParams } = new URL(request.url);
    const parlorId = searchParams.get('id') || 'p-001';

    const parlor = await ParlorService.getParlor(parlorId);

    console.log('雀荘データを取得しました:', {
      parlorId: parlor.id,
      name: parlor.name,
      roomsCount: parlor.rooms.length
    });

    return NextResponse.json(parlor, { status: 200 });

  } catch (error) {
    console.error('雀荘データ取得エラー:', error);
    const { error: message, statusCode } = createErrorResponse(error, 'データの取得に失敗しました');

    return NextResponse.json(
      { error: message },
      { status: statusCode }
    );
  }
}
