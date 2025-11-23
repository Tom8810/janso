'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { registerParlor } from '@/lib/firebase';

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
    name: '',
    address: {
      postalCode: '',
      prefecture: '',
      address1: '',
      address2: '',
      building: '',
    },
    phoneNumber: '',
    businessHours: { open: '10:00', close: '23:00' },
    description: '',
    maxCapacity: 24,
    ownerName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('パスワードが一致しません');
      setIsLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('パスワードは6文字以上で入力してください');
      setIsLoading(false);
      return;
    }

    try {
      // Create full address string for display/search purposes
      const fullAddress = [
        formData.address.prefecture,
        formData.address.address1,
        formData.address.address2,
        formData.address.building
      ].filter(Boolean).join(' ');

      const { user, parlor } = await registerParlor(formData.email, formData.password, {
        name: formData.name,
        address: fullAddress,
        addressDetails: formData.address,
        phoneNumber: formData.phoneNumber,
        businessHours: formData.businessHours,
        description: formData.description,
        maxCapacity: formData.maxCapacity,
        ownerName: formData.ownerName,
      });

      // Store user session
      localStorage.setItem('parlor_session', JSON.stringify({ 
        userId: user.uid, 
        parlorId: parlor.id,
        parlorName: parlor.name 
      }));

      // Redirect to management screen
      router.push('/parlor/manage');
    } catch (err: any) {
      setError(err.message || '登録に失敗しました');
    } finally {
      setIsLoading(false);
    }
  };

  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const updateBusinessHours = (field: 'open' | 'close', value: string) => {
    setFormData(prev => ({
      ...prev,
      businessHours: { ...prev.businessHours, [field]: value }
    }));
  };

  const updateAddress = (field: keyof ParlorFormData['address'], value: string) => {
    setFormData(prev => ({
      ...prev,
      address: { ...prev.address, [field]: value }
    }));
  };

  return (
    <div className="min-h-screen bg-zinc-50">
      <div className="sticky top-0 bg-white/70 backdrop-blur-md border-b border-black/5 z-10">
        <div className="px-6 py-4">
          <Link href="/parlor/login" className="text-zinc-600 hover:text-zinc-900 font-medium text-sm">
            ← ログイン画面に戻る
          </Link>
        </div>
      </div>

      <div className="p-6 pb-24">
        <div className="w-full max-w-md mx-auto">
          <div className="bg-white rounded-2xl p-8 shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-black/5">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 mb-2">
                雀荘新規登録
              </h1>
              <p className="text-zinc-600 font-medium text-sm">
                雀荘の管理画面を作成します
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Owner Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold tracking-tight text-zinc-900">
                  オーナー情報
                </h3>
                
                <div>
                  <label htmlFor="ownerName" className="block text-sm font-medium text-zinc-900 mb-2">
                    オーナー名 *
                  </label>
                  <input
                    type="text"
                    id="ownerName"
                    required
                    className="w-full px-4 py-3 border border-black/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent"
                    placeholder="オーナー名を入力"
                    value={formData.ownerName}
                    onChange={(e) => updateFormData('ownerName', e.target.value)}
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-zinc-900 mb-2">
                    メールアドレス *
                  </label>
                  <input
                    type="email"
                    id="email"
                    required
                    className="w-full px-4 py-3 border border-black/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent"
                    placeholder="メールアドレスを入力"
                    value={formData.email}
                    onChange={(e) => updateFormData('email', e.target.value)}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-zinc-900 mb-2">
                      パスワード *
                    </label>
                    <input
                      type="password"
                      id="password"
                      required
                      className="w-full px-4 py-3 border border-black/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent"
                      placeholder="パスワード"
                      value={formData.password}
                      onChange={(e) => updateFormData('password', e.target.value)}
                    />
                  </div>
                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-zinc-900 mb-2">
                      パスワード確認 *
                    </label>
                    <input
                      type="password"
                      id="confirmPassword"
                      required
                      className="w-full px-4 py-3 border border-black/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent"
                      placeholder="再入力"
                      value={formData.confirmPassword}
                      onChange={(e) => updateFormData('confirmPassword', e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Parlor Information */}
              <div className="space-y-4 pt-6 border-t border-black/5">
                <h3 className="text-lg font-semibold tracking-tight text-zinc-900">
                  雀荘情報
                </h3>
                
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-zinc-900 mb-2">
                    雀荘名 *
                  </label>
                  <input
                    type="text"
                    id="name"
                    required
                    className="w-full px-4 py-3 border border-black/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent"
                    placeholder="雀荘名を入力"
                    value={formData.name}
                    onChange={(e) => updateFormData('name', e.target.value)}
                  />
                </div>
                
                <div className="space-y-3">
                  <h4 className="text-sm font-medium text-zinc-900">住所 *</h4>
                  
                  <div>
                    <label htmlFor="postalCode" className="block text-xs font-medium text-zinc-700 mb-1">
                      郵便番号
                    </label>
                    <input
                      type="text"
                      id="postalCode"
                      required
                      className="w-full px-4 py-3 border border-black/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent"
                      placeholder="123-4567"
                      value={formData.address.postalCode}
                      onChange={(e) => updateAddress('postalCode', e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="prefecture" className="block text-xs font-medium text-zinc-700 mb-1">
                      都道府県
                    </label>
                    <select
                      id="prefecture"
                      required
                      className="w-full px-4 py-3 border border-black/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent"
                      value={formData.address.prefecture}
                      onChange={(e) => updateAddress('prefecture', e.target.value)}
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
                    <label htmlFor="address1" className="block text-xs font-medium text-zinc-700 mb-1">
                      市区町村・番地
                    </label>
                    <input
                      type="text"
                      id="address1"
                      required
                      className="w-full px-4 py-3 border border-black/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent"
                      placeholder="新宿区歌舞伎町1-15-2"
                      value={formData.address.address1}
                      onChange={(e) => updateAddress('address1', e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="address2" className="block text-xs font-medium text-zinc-700 mb-1">
                      町名・丁目 (任意)
                    </label>
                    <input
                      type="text"
                      id="address2"
                      className="w-full px-4 py-3 border border-black/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent"
                      placeholder="第3ビル"
                      value={formData.address.address2}
                      onChange={(e) => updateAddress('address2', e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="building" className="block text-xs font-medium text-zinc-700 mb-1">
                      建物名・部屋番号 (任意)
                    </label>
                    <input
                      type="text"
                      id="building"
                      className="w-full px-4 py-3 border border-black/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent"
                      placeholder="4F"
                      value={formData.address.building}
                      onChange={(e) => updateAddress('building', e.target.value)}
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="phoneNumber" className="block text-sm font-medium text-zinc-900 mb-2">
                    電話番号 *
                  </label>
                  <input
                    type="tel"
                    id="phoneNumber"
                    required
                    className="w-full px-4 py-3 border border-black/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent"
                    placeholder="03-1234-5678"
                    value={formData.phoneNumber}
                    onChange={(e) => updateFormData('phoneNumber', e.target.value)}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="openTime" className="block text-sm font-medium text-zinc-900 mb-2">
                      開店時間 *
                    </label>
                    <input
                      type="time"
                      id="openTime"
                      required
                      className="w-full px-4 py-3 border border-black/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent"
                      value={formData.businessHours.open}
                      onChange={(e) => updateBusinessHours('open', e.target.value)}
                    />
                  </div>
                  <div>
                    <label htmlFor="closeTime" className="block text-sm font-medium text-zinc-900 mb-2">
                      閉店時間 *
                    </label>
                    <input
                      type="time"
                      id="closeTime"
                      required
                      className="w-full px-4 py-3 border border-black/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent"
                      value={formData.businessHours.close}
                      onChange={(e) => updateBusinessHours('close', e.target.value)}
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="maxCapacity" className="block text-sm font-medium text-zinc-900 mb-2">
                    最大収容人数 *
                  </label>
                  <input
                    type="number"
                    id="maxCapacity"
                    required
                    min="4"
                    step="4"
                    className="w-full px-4 py-3 border border-black/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent"
                    placeholder="24"
                    value={formData.maxCapacity}
                    onChange={(e) => updateFormData('maxCapacity', parseInt(e.target.value) || 0)}
                  />
                </div>
                
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-zinc-900 mb-2">
                    雀荘の説明 (任意)
                  </label>
                  <textarea
                    id="description"
                    rows={3}
                    className="w-full px-4 py-3 border border-black/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent resize-none"
                    placeholder="雀荘の特徴や雰囲気を入力"
                    value={formData.description}
                    onChange={(e) => updateFormData('description', e.target.value)}
                  />
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                  <div className="text-red-700 text-sm font-medium">{error}</div>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 bg-zinc-900 text-white rounded-xl font-medium hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {isLoading ? '登録中...' : '雀荘を登録'}
              </button>
            </form>

            <div className="mt-8 pt-6 border-t border-black/5 text-center">
              <Link
                href="/parlor/login"
                className="text-zinc-600 hover:text-zinc-900 text-sm"
              >
                既にアカウントをお持ちの方はこちら
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}