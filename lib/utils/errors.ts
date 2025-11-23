import { FirebaseError } from "firebase-admin";

export function handleFirebaseError(error: unknown): string {
  if (error instanceof FirebaseError) {
    switch (error.code) {
      case "not-found":
        return "データが見つかりません";
      case "permission-denied":
        return "このアクションを実行する権限がありません";
      case "unavailable":
        return "サービスが一時的に利用できません";
      case "deadline-exceeded":
        return "処理がタイムアウトしました";
      case "invalid-argument":
        return "無効なデータが送信されました";
      default:
        console.error("Firebase Error:", error);
        return "予期しないエラーが発生しました";
    }
  }

  if (error instanceof Error) {
    console.error("General Error:", error);
    return error.message;
  }

  console.error("Unknown Error:", error);
  return "予期しないエラーが発生しました";
}

export class ApiError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public code?: string
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export function createErrorResponse(error: unknown, defaultMessage = "内部サーバーエラー") {
  const message = handleFirebaseError(error);
  const statusCode = error instanceof ApiError ? error.statusCode : 500;
  
  return {
    error: message || defaultMessage,
    statusCode
  };
}