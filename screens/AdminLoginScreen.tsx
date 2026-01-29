import React, { useState } from 'react';
import { ViewType } from '../types';

interface AdminLoginScreenProps {
  setView: (view: ViewType) => void;
  onLoginSuccess: () => void;
}

export const AdminLoginScreen: React.FC<AdminLoginScreenProps> = ({ setView, onLoginSuccess }) => {
  const [adminId, setAdminId] = useState('');
  const [adminPw, setAdminPw] = useState('');

  const handleLogin = () => {
    // 데모용 자격 증명: admin / admin
    if (adminId === 'admin' && adminPw === 'admin') {
      onLoginSuccess();
    } else {
      alert('아이디 또는 비밀번호가 올바르지 않습니다.');
    }
  };

  return (
    <div className="flex flex-col gap-8 p-8 pt-12 bg-[#F8FAFC] dark:bg-navy-dark min-h-full">
      {/* 로그인 폼 영역 */}
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <label className="text-[12px] font-black text-navy-dark dark:text-gray-400 uppercase tracking-widest ml-1">ADMIN ID</label>
          <input
            type="text"
            placeholder="관리자 아이디"
            value={adminId}
            onChange={(e) => setAdminId(e.target.value)}
            className="w-full bg-white dark:bg-navy-accent border-2 border-primary/30 rounded-2xl p-4 text-[16px] font-bold shadow-sm focus:border-primary focus:ring-0 text-navy-dark dark:text-white"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-[12px] font-black text-navy-dark dark:text-gray-400 uppercase tracking-widest ml-1">PASSWORD</label>
          <input
            type="password"
            placeholder="비밀번호"
            value={adminPw}
            onChange={(e) => setAdminPw(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
            className="w-full bg-white dark:bg-navy-accent border-2 border-gray-100 dark:border-white/10 rounded-2xl p-4 text-[16px] font-bold shadow-sm focus:border-primary focus:ring-0 text-navy-dark dark:text-white"
          />
        </div>

        <button
          onClick={handleLogin}
          className="w-full bg-primary py-5 rounded-[2.5rem] text-navy-dark font-black text-lg shadow-lg shadow-primary/20 active:scale-[0.97] transition-all mt-4 border-b-4 border-yellow-600"
        >
          로그인
        </button>
      </div>

      {/* 관리 전용 섹션 */}
      <div className="flex flex-col gap-3 mt-4">
        <h3 className="text-sm font-black text-navy-dark dark:text-gray-400 ml-1">관리 전용</h3>
        <div
          className="bg-white dark:bg-navy-accent rounded-[2rem] p-5 flex items-center justify-between shadow-md border-2 border-primary/10"
        >
          <div className="size-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
            <span className="material-symbols-outlined filled text-2xl">admin_panel_settings</span>
          </div>
          <div className="flex-1 px-4">
            <p className="text-xs font-black text-gray-400 uppercase tracking-tighter">Admin Access Only</p>
            <p className="text-sm font-bold text-navy-dark dark:text-white">보안 접속 모드 활성화</p>
          </div>
          <span className="material-symbols-outlined text-primary text-xl font-black">chevron_right</span>
        </div>
      </div>

      {/* 하단 카피라이트 */}
      <div className="text-center py-6 text-[11px] text-gray-400 font-black leading-relaxed">
        © 2026 성남신광교회. 모든 권리 보유.<br />
        <span className="text-primary/50 font-bold">버전 1.2.5</span>
      </div>
    </div>
  );
};
