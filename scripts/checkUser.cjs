const admin = require("firebase-admin");

if (!admin.apps.length) {
    admin.initializeApp({
        projectId: "jansou-3138d",
    });
}

async function checkUser() {
    try {
        const userRecord = await admin.auth().getUserByEmail("test@example.com");
        console.log("User found:", userRecord.uid);

        await admin.auth().updateUser(userRecord.uid, {
            password: "password123"
        });
        console.log("Password updated to 'password123'");
        console.log("Password Hash:", userRecord.passwordHash);
        console.log("Salt:", userRecord.passwordSalt);
    } catch (error) {
        console.error("Error fetching/updating user:", error);
    }
}

checkUser();
