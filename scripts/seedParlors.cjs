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
    address: "東京都 新宿区歌舞伎町1-15-2 第3ビル 4F",
    addressDetails: {
      postalCode: "160-0021",
      prefecture: "東京都",
      address1: "新宿区歌舞伎町1-15-2",
      address2: "第3ビル",
      building: "4F",
    },
    phoneNumber: "03-1234-5678",
    businessHours: { open: "10:00", close: "23:00" },
    description: "新宿駅から徒歩5分。初心者から上級者まで楽しめるアットホームな雀荘です。",
    maxCapacity: 24,
    ownerName: "田中太郎",
    ownerEmail: "test@example.com",
    total_waiting_count: 2,
    rooms: [
      {
        id: "r-101",
        rank_name: "テンピン (1.0) 戦",
        waiting_count: 2,
        table_count: 1,
        status: "active",
        can_play_immediately: false,
      },
      {
        id: "r-102",
        rank_name: "テンゴ (0.5) 戦",
        waiting_count: 0,
        table_count: 4,
        status: "active",
        can_play_immediately: true,
      },
      {
        id: "r-103",
        rank_name: "ノーレート フリー",
        waiting_count: 1,
        table_count: 1,
        status: "active",
        can_play_immediately: false,
      },
      {
        id: "r-104",
        rank_name: "初心者教室",
        waiting_count: 0,
        table_count: 1,
        status: "active",
        can_play_immediately: true,
      },
      {
        id: "r-105",
        rank_name: "ランク 五点零",
        waiting_count: 5,
        table_count: 2,
        status: "active",
        can_play_immediately: false,
      },
    ],
  },
  {
    id: "p-002",
    name: "麻雀クラブ 緑一色",
    address: "東京都 豊島区西池袋1-22-5 池袋スクエア 2F",
    addressDetails: {
      postalCode: "171-0021",
      prefecture: "東京都",
      address1: "豊島区西池袋1-22-5",
      address2: "池袋スクエア",
      building: "2F",
    },
    phoneNumber: "03-2345-6789",
    businessHours: { open: "11:00", close: "24:00" },
    description: "池袋駅西口から徒歩3分。清潔で快適な空間で麻雀をお楽しみいただけます。",
    maxCapacity: 32,
    ownerName: "佐藤花子",
    ownerEmail: "midori@example.com",
    total_waiting_count: 0,
  },
  {
    id: "p-003",
    name: "ZOO 渋谷道玄坂店",
    address: "東京都 渋谷区道玄坂2-6-11 渋谷プラザ 5F",
    addressDetails: {
      postalCode: "150-0043",
      prefecture: "東京都",
      address1: "渋谷区道玄坂2-6-11",
      address2: "渋谷プラザ",
      building: "5F",
    },
    phoneNumber: "03-3456-7890",
    businessHours: { open: "12:00", close: "翌5:00" },
    description: "渋谷の中心地で24時間営業。若者に人気の活気ある雀荘です。",
    maxCapacity: 40,
    ownerName: "鈴木一郎",
    ownerEmail: "zoo@example.com",
    total_waiting_count: 5,
  },
  {
    id: "p-004",
    name: "健康麻雀 ひまわり",
    address: "東京都 千代田区神田須田町1-4-1 神田ビル 3F",
    addressDetails: {
      postalCode: "101-0041",
      prefecture: "東京都",
      address1: "千代田区神田須田町1-4-1",
      address2: "神田ビル",
      building: "3F",
    },
    phoneNumber: "03-4567-8901",
    businessHours: { open: "09:00", close: "18:00" },
    description: "賭けない、飲まない、吸わない健康麻雀。シニアの方も安心してお楽しみいただけます。",
    maxCapacity: 16,
    ownerName: "高橋美咲",
    ownerEmail: "himawari@example.com",
    total_waiting_count: 1,
  },
  {
    id: "p-005",
    name: "雀荘 六本木ヒルズ前",
    address: "東京都 港区六本木6-2-31 六本木ヒルズノース 1F",
    addressDetails: {
      postalCode: "106-0032",
      prefecture: "東京都",
      address1: "港区六本木6-2-31",
      address2: "六本木ヒルズノース",
      building: "1F",
    },
    phoneNumber: "03-5678-9012",
    businessHours: { open: "13:00", close: "翌3:00" },
    description: "六本木ヒルズ至近の高級雀荘。落ち着いた雰囲気で本格的な麻雀をお楽しみください。",
    maxCapacity: 28,
    ownerName: "山田健太",
    ownerEmail: "roppongi@example.com",
    total_waiting_count: 8,
  },
  {
    id: "p-006",
    name: "まあじゃん ぱいん",
    address: "神奈川県 横浜市西区南幸2-12-6 ストークビル 6F",
    addressDetails: {
      postalCode: "220-0005",
      prefecture: "神奈川県",
      address1: "横浜市西区南幸2-12-6",
      address2: "ストークビル",
      building: "6F",
    },
    phoneNumber: "045-123-4567",
    businessHours: { open: "10:30", close: "22:30" },
    description: "横浜駅西口から徒歩2分。女性も気軽に入れるカジュアルな雀荘です。",
    maxCapacity: 20,
    ownerName: "伊藤さくら",
    ownerEmail: "pine@example.com",
    total_waiting_count: 0,
  },
];

async function seed() {
  console.log("Seeding parlors and rooms into Firestore emulator...");

  // 1. Create a test user
  const email = "test@example.com";
  const password = "password123";
  let userId;

  try {
    const userRecord = await admin.auth().createUser({
      email: email,
      password: password,
      displayName: "Test User",
    });
    userId = userRecord.uid;
    console.log(`Successfully created new user: ${userId}`);
  } catch (error) {
    if (error.code === 'auth/email-already-exists') {
      console.log('User already exists, fetching user...');
      const userRecord = await admin.auth().getUserByEmail(email);
      userId = userRecord.uid;

      // Ensure password is correct
      await admin.auth().updateUser(userId, {
        password: password
      });
      console.log(`Fetched existing user and updated password: ${userId}`);
    } else {
      console.error('Error creating new user:', error);
      throw error;
    }
  }

  // 2. Update the first parlor's ID to match the user's UID
  // We clone the parlors array to avoid mutating the original if we were to re-run logic (though script exits)
  const parlorsToSeed = [...parlors];
  if (parlorsToSeed.length > 0) {
    parlorsToSeed[0] = { ...parlorsToSeed[0], id: userId };
  }

  for (const parlor of parlorsToSeed) {
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
