"use client";

import { registerParlor } from "@/lib/firebase";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import YubinBangoCore from "yubinbango-core";

interface ParlorFormData {
  name: string;
  address: {
    postalCode: string;
    prefecture: string;
    address1: string;
    address2: string;
    building: string;
  };
  phoneNumber: string;
  businessHours: { open: string; close: string };
  description: string;
  maxCapacity: number;
  ownerName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export default function ParlorRegister() {
  const [formData, setFormData] = useState<ParlorFormData>({
    name: "",
    address: {
      postalCode: "",
      prefecture: "",
      address1: "",
      address2: "",
      building: "",
    },
    phoneNumber: "",
    businessHours: { open: "10:00", close: "23:00" },
    description: "",
    maxCapacity: 24,
    ownerName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [step, setStep] = useState<1 | 2>(1);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // STEP 1: オーナー情報のバリデーションのみ行い、次のステップへ進む
    if (step === 1) {
      if (formData.password !== formData.confirmPassword) {
        setError("パスワードが一致しません");
        return;
      }

      if (formData.password.length < 6) {
        setError("パスワードは6文字以上で入力してください");
        return;
      }

      setStep(2);
      return;
    }

    // STEP 2: すべての情報を使って登録処理を実行
    setIsLoading(true);

    try {
      const fullAddress = [
        formData.address.prefecture,
        formData.address.address1,
        formData.address.address2,
        formData.address.building,
      ]
        .filter(Boolean)
        .join(" ");

      const { user, parlor } = await registerParlor(
        formData.email,
        formData.password,
        {
          name: formData.name,
          address: fullAddress,
          addressDetails: formData.address,
          phoneNumber: formData.phoneNumber,
          businessHours: formData.businessHours,
          description: formData.description,
          maxCapacity: formData.maxCapacity,
          ownerName: formData.ownerName,
        }
      );

      localStorage.setItem(
        "parlor_session",
        JSON.stringify({
          userId: user.uid,
          parlorId: parlor.id,
          parlorName: parlor.name,
        })
      );

      router.push("/parlor/manage");
    } catch (err: any) {
      setError(err.message || "登録に失敗しました");
    } finally {
      setIsLoading(false);
    }
  };

  const updateFormData = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const updateBusinessHours = (field: "open" | "close", value: string) => {
    setFormData((prev) => ({
      ...prev,
      businessHours: { ...prev.businessHours, [field]: value },
    }));
  };

  const updateAddress = (
    field: keyof ParlorFormData["address"],
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      address: { ...prev.address, [field]: value },
    }));
  };

  const handlePostalBlur = (raw: string) => {
    const postal = raw.replace(/[^0-9]/g, "");
    if (postal.length !== 7) return;

    // yubinbango-core は関数として呼び出す実装になっているため new は不要
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (YubinBangoCore as any)(postal, (data: any) => {
      if (!data) return;

      const prefecture = data.region || "";
      const address1 = [data.locality, data.street].filter(Boolean).join("");

      setFormData((prev) => ({
        ...prev,
        address: {
          ...prev.address,
          prefecture: prefecture || prev.address.prefecture,
          address1: address1 || prev.address.address1,
        },
      }));
    });
  };

  return (
    <div className="min-h-screen bg-zinc-50">
      <main className="mx-auto flex min-h-screen max-w-3xl items-center px-4 py-10 sm:px-6 lg:px-8 lg:py-16">
        <div className="w-full">
          <div className="space-y-10">
            <div className="inline-flex items-center gap-2 rounded-full border border-black/5 bg-white/80 px-3 py-1 text-xs font-medium text-zinc-500">
              <span className="h-1.5 w-1.5 rounded-full bg-zinc-900" />
              <span>STEP {step} / 2</span>
            </div>

            <div className="space-y-3">
              <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 sm:text-3xl">
                雀荘新規登録
              </h1>
              <p className="text-sm font-medium text-zinc-500">
                オーナー情報と雀荘の基本情報を入力して、
                <span className="whitespace-nowrap">
                  管理画面を作成してください。
                </span>
              </p>
            </div>

            <form onSubmit={handleSubmit} className="max-w-xl space-y-8">
              {step === 1 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold tracking-tight text-zinc-900">
                    オーナー情報
                  </h3>

                  <div>
                    <label
                      htmlFor="ownerName"
                      className="mb-2 block text-sm font-medium text-zinc-900"
                    >
                      オーナー名 *
                    </label>
                    <input
                      type="text"
                      id="ownerName"
                      required
                      className="w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-900 focus:outline-none focus:ring-0"
                      placeholder="オーナー名を入力"
                      value={formData.ownerName}
                      onChange={(e) =>
                        updateFormData("ownerName", e.target.value)
                      }
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="mb-2 block text-sm font-medium text-zinc-900"
                    >
                      メールアドレス *
                    </label>
                    <input
                      type="email"
                      id="email"
                      required
                      className="w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-900 focus:outline-none focus:ring-0"
                      placeholder="メールアドレスを入力"
                      value={formData.email}
                      onChange={(e) => updateFormData("email", e.target.value)}
                    />
                  </div>

                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div>
                      <label
                        htmlFor="password"
                        className="mb-2 block text-sm font-medium text-zinc-900"
                      >
                        パスワード *
                      </label>
                      <input
                        type="password"
                        id="password"
                        required
                        className="w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-900 focus:outline-none focus:ring-0"
                        placeholder="パスワード"
                        value={formData.password}
                        onChange={(e) =>
                          updateFormData("password", e.target.value)
                        }
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="confirmPassword"
                        className="mb-2 block text-sm font-medium text-zinc-900"
                      >
                        パスワード確認 *
                      </label>
                      <input
                        type="password"
                        id="confirmPassword"
                        required
                        className="w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-900 focus:outline-none focus:ring-0"
                        placeholder="再入力"
                        value={formData.confirmPassword}
                        onChange={(e) =>
                          updateFormData("confirmPassword", e.target.value)
                        }
                      />
                    </div>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-4 border-t border-black/5 pt-6">
                  <h3 className="text-lg font-semibold tracking-tight text-zinc-900">
                    雀荘情報
                  </h3>

                  <div>
                    <label
                      htmlFor="name"
                      className="mb-2 block text-sm font-medium text-zinc-900"
                    >
                      雀荘名 *
                    </label>
                    <input
                      type="text"
                      id="name"
                      required
                      className="w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-900 focus:outline-none focus:ring-0"
                      placeholder="雀荘名を入力"
                      value={formData.name}
                      onChange={(e) => updateFormData("name", e.target.value)}
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="postalCode"
                      className="mb-2 block text-sm font-medium text-zinc-900"
                    >
                      郵便番号 *
                    </label>
                    <input
                      type="text"
                      id="postalCode"
                      required
                      className="w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-900 focus:outline-none focus:ring-0"
                      placeholder="123-4567"
                      value={formData.address.postalCode}
                      onChange={(e) =>
                        updateAddress("postalCode", e.target.value)
                      }
                      onBlur={(e) => handlePostalBlur(e.target.value)}
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="prefecture"
                      className="mb-2 block text-sm font-medium text-zinc-900"
                    >
                      都道府県 *
                    </label>
                    <select
                      id="prefecture"
                      required
                      className="w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-zinc-900 focus:outline-none focus:ring-0"
                      value={formData.address.prefecture}
                      onChange={(e) =>
                        updateAddress("prefecture", e.target.value)
                      }
                    >
                      <option value="">都道府県を選択</option>
                      <option value="東京都">東京都</option>
                      <option value="神奈川県">神奈川県</option>
                      <option value="千葉県">千葉県</option>
                      <option value="埼玉県">埼玉県</option>
                      <option value="大阪府">大阪府</option>
                      <option value="愛知県">愛知県</option>
                      <option value="兵庫県">兵庫県</option>
                      <option value="福岡県">福岡県</option>
                      <option value="北海道">北海道</option>
                      <option value="宮城県">宮城県</option>
                      <option value="静岡県">静岡県</option>
                      <option value="広島県">広島県</option>
                      <option value="京都府">京都府</option>
                      <option value="その他">その他</option>
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="address1"
                      className="mb-2 block text-sm font-medium text-zinc-900"
                    >
                      市区町村・番地 *
                    </label>
                    <input
                      type="text"
                      id="address1"
                      required
                      className="w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-900 focus:outline-none focus:ring-0"
                      placeholder="新宿区歌舞伎町1-15-2"
                      value={formData.address.address1}
                      onChange={(e) =>
                        updateAddress("address1", e.target.value)
                      }
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="address2"
                      className="mb-2 block text-sm font-medium text-zinc-900"
                    >
                      町名・丁目 (任意)
                    </label>
                    <input
                      type="text"
                      id="address2"
                      className="w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-900 focus:outline-none focus:ring-0"
                      placeholder="第3ビル"
                      value={formData.address.address2}
                      onChange={(e) =>
                        updateAddress("address2", e.target.value)
                      }
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="building"
                      className="mb-2 block text-sm font-medium text-zinc-900"
                    >
                      建物名・部屋番号 (任意)
                    </label>
                    <input
                      type="text"
                      id="building"
                      className="w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-900 focus:outline-none focus:ring-0"
                      placeholder="4F"
                      value={formData.address.building}
                      onChange={(e) =>
                        updateAddress("building", e.target.value)
                      }
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="phoneNumber"
                      className="mb-2 block text-sm font-medium text-zinc-900"
                    >
                      電話番号 *
                    </label>
                    <input
                      type="tel"
                      id="phoneNumber"
                      required
                      className="w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-900 focus:outline-none focus:ring-0"
                      placeholder="03-1234-5678"
                      value={formData.phoneNumber}
                      onChange={(e) =>
                        updateFormData("phoneNumber", e.target.value)
                      }
                    />
                  </div>

                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div>
                      <label
                        htmlFor="openTime"
                        className="mb-2 block text-sm font-medium text-zinc-900"
                      >
                        開店時間 *
                      </label>
                      <input
                        type="time"
                        id="openTime"
                        required
                        className="w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-zinc-900 focus:outline-none focus:ring-0"
                        value={formData.businessHours.open}
                        onChange={(e) =>
                          updateBusinessHours("open", e.target.value)
                        }
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="closeTime"
                        className="mb-2 block text-sm font-medium text-zinc-900"
                      >
                        閉店時間 *
                      </label>
                      <input
                        type="time"
                        id="closeTime"
                        required
                        className="w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-zinc-900 focus:outline-none focus:ring-0"
                        value={formData.businessHours.close}
                        onChange={(e) =>
                          updateBusinessHours("close", e.target.value)
                        }
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="maxCapacity"
                      className="mb-2 block text-sm font-medium text-zinc-900"
                    >
                      最大収容人数 *
                    </label>
                    <input
                      type="number"
                      id="maxCapacity"
                      required
                      min={4}
                      step={4}
                      className="w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-900 focus:outline-none focus:ring-0"
                      placeholder="24"
                      value={formData.maxCapacity}
                      onChange={(e) =>
                        updateFormData(
                          "maxCapacity",
                          parseInt(e.target.value, 10) || 0
                        )
                      }
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="description"
                      className="mb-2 block text-sm font-medium text-zinc-900"
                    >
                      雀荘の説明 (任意)
                    </label>
                    <textarea
                      id="description"
                      rows={3}
                      className="w-full resize-none rounded-xl border border-black/10 bg-white px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-900 focus:outline-none focus:ring-0"
                      placeholder="雀荘の特徴や雰囲気を入力"
                      value={formData.description}
                      onChange={(e) =>
                        updateFormData("description", e.target.value)
                      }
                    />
                  </div>
                </div>
              )}

              {error && (
                <p className="text-sm font-medium text-red-600">{error}</p>
              )}

              <div className="flex items-center gap-3">
                {step === 2 && (
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="inline-flex items-center justify-center rounded-xl border border-black/10 bg-white px-4 py-2.5 text-sm font-medium text-zinc-700 hover:border-black/20 hover:text-zinc-900"
                  >
                    戻る
                  </button>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="inline-flex items-center justify-center rounded-xl bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {step === 1 ? "次へ" : isLoading ? "登録中..." : "雀荘を登録"}
                </button>
              </div>
            </form>

            <div className="space-y-6 pt-4 text-sm text-zinc-500">
              <div>
                <Link
                  href="/parlor/login"
                  className="font-medium text-zinc-700 hover:text-zinc-900"
                >
                  既にアカウントをお持ちの方はこちら
                </Link>
              </div>

              <div className="pt-2 text-xs text-zinc-400">
                <Link href="/" className="hover:text-zinc-700">
                  雀荘一覧に戻る
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
