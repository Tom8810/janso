const admin = require("firebase-admin");

// エミュレータ用に projectId のみ指定して初期化（認証情報は不要）
if (!admin.apps.length) {
  admin.initializeApp({
    projectId: "jansou-3138d",
  });
}

const db = admin.firestore();

const parlors = [
  {
    id: "p-001",
    name: "リーチ麻雀 さくら 新宿店",
    address: "東京都新宿区歌舞伎町1-15-2 第3ビル 4F",
    total_waiting_count: 2,
    rooms: [
      {
        id: "r-101",
        rank_name: "テンピン (1.0) 戦",
        waiting_count: 2,
        table_count: 1,
        status: "active",
      },
      {
        id: "r-102",
        rank_name: "テンゴ (0.5) 戦",
        waiting_count: 0,
        table_count: 4,
        status: "active",
      },
      {
        id: "r-103",
        rank_name: "ノーレート フリー",
        waiting_count: 1,
        table_count: 1,
        status: "active",
      },
      {
        id: "r-104",
        rank_name: "初心者教室",
        waiting_count: 0,
        table_count: 1,
        status: "active",
      },
      {
        id: "r-105",
        rank_name: "ランク 五点零",
        waiting_count: 5,
        table_count: 2,
        status: "active",
      },
    ],
  },
  {
    id: "p-002",
    name: "麻雀クラブ 緑一色",
    address: "東京都豊島区西池袋1-22-5 池袋スクエア 2F",
    total_waiting_count: 0,
  },
  {
    id: "p-003",
    name: "ZOO 渋谷道玄坂店",
    address: "東京都渋谷区道玄坂2-6-11 渋谷プラザ 5F",
    total_waiting_count: 5,
  },
  {
    id: "p-004",
    name: "健康麻雀 ひまわり",
    address: "東京都千代田区神田須田町1-4-1 神田ビル 3F",
    total_waiting_count: 1,
  },
  {
    id: "p-005",
    name: "雀荘 六本木ヒルズ前",
    address: "東京都港区六本木6-2-31 六本木ヒルズノース 1F",
    total_waiting_count: 8,
  },
  {
    id: "p-006",
    name: "まあじゃん ぱいん",
    address: "神奈川県横浜市西区南幸2-12-6 ストークビル 6F",
    total_waiting_count: 0,
  },
];

async function seed() {
  console.log("Seeding parlors and rooms into Firestore emulator...");

  for (const parlor of parlors) {
    const parlorRef = db.collection("parlors").doc(parlor.id);

    const { rooms = [], ...parlorData } = parlor;
    await parlorRef.set(parlorData);

    if (rooms.length > 0) {
      const batch = db.batch();
      for (const room of rooms) {
        const roomRef = parlorRef.collection("rooms").doc(room.id);
        batch.set(roomRef, room);
      }
      await batch.commit();
    }
  }

  console.log("Seeding completed.");
}

seed()
  .then(() => {
    process.exit(0);
  })
  .catch((err) => {
    console.error("Seeding failed:", err);
    process.exit(1);
  });
