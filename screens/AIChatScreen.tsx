
import React, { useState, useRef, useEffect, useMemo } from 'react';
import { GoogleGenAI } from "@google/genai";
import { ChatMessage } from '../types';

<<<<<<< HEAD
// 오늘의 말씀 리스트 (날짜에 따라 순환)
const DAILY_VERSES = [
  { ref: "시편 23:1", text: "여호와는 나의 목자시니 내게 부족함이 없으리로다" },
  { ref: "빌립보서 4:13", text: "내게 능력 주시는 자 안에서 내가 모든 것을 할 수 있느니라" },
  { ref: "이사야 41:10", text: "두려워하지 말라 내가 너와 함께 함이라 놀라지 말라 나는 네 하나님이 됨이라" },
  { ref: "요한복음 14:27", text: "평안을 너희에게 끼치노니 곧 나의 평안을 너희에게 주노라" },
  { ref: "데살로니가전서 5:16-18", text: "항상 기뻐하라 쉬지 말고 기도하라 범사에 감사하라" },
  { ref: "잠언 3:5", text: "너는 마음을 다하여 여호와를 신뢰하고 네 명철을 의지하지 말라" },
  { ref: "로마서 8:28", text: "우리가 알거니와 하나님을 사랑하는 자 곧 그의 뜻대로 부르심을 입은 자들에게는 모든 것이 합력하여 선을 이루느니라" }
];

=======
>>>>>>> 81d2d6a97778cfb9e23c5eb89e8da9032ded794a
// 진행 상태 애니메이션 컴포넌트
const ThinkingIndicator: React.FC<{ message: string }> = ({ message }) => (
  <div className="flex flex-col items-center gap-4 py-6 px-4 animate-in fade-in zoom-in duration-700">
    <div className="relative size-16 flex items-center justify-center">
      <div className="absolute inset-0 border-2 border-dashed border-primary/30 rounded-full animate-[spin_8s_linear_infinite]"></div>
      <div className="relative size-8 bg-gradient-to-br from-primary to-yellow-600 rounded-full shadow-[0_0_20px_rgba(212,175,55,0.8)] animate-pulse flex items-center justify-center">
        <span className="material-symbols-outlined text-navy-dark text-lg filled">auto_awesome</span>
      </div>
    </div>
    <div className="flex flex-col items-center gap-1">
      <span className="text-xs font-black text-primary tracking-tight">{message}</span>
    </div>
  </div>
);

// 가독성 높은 텍스트 렌더링을 위한 컴포넌트
const FormattedMessage: React.FC<{ text: string; role: 'user' | 'model'; images?: string[] }> = ({ text, role, images }) => {
  if (role === 'user') return <span className="font-bold">{text}</span>;

  const lines = text.split('\n');
  return (
    <div className="space-y-4">
      {lines.map((line, i) => {
        if (line.startsWith('### ') || line.startsWith('#### ')) {
          return <h4 key={i} className="text-navy-dark dark:text-white font-black text-lg mt-6 mb-2 flex items-center gap-2"><span className="w-1 h-5 bg-primary rounded-full inline-block"></span>{line.replace(/#+\s/, '')}</h4>;
        }
        if (line.trim().startsWith('* ') || line.trim().startsWith('- ')) {
          return <div key={i} className="flex gap-2 pl-2"><span className="text-primary font-black mt-1">•</span><p className="flex-1 text-gray-700 dark:text-gray-300 font-medium">{parseBoldText(line.trim().substring(2))}</p></div>;
        }
        if (!line.trim()) return null;
        return <p key={i} className="text-gray-700 dark:text-gray-300 leading-relaxed font-medium">{parseBoldText(line)}</p>;
      })}

<<<<<<< HEAD
      {images && images.length > 0 && (
        <div className={`grid ${images.length > 1 ? 'grid-cols-2' : 'grid-cols-1'} gap-3 mt-4 animate-in zoom-in-95 duration-700`}>
          {images.map((img, idx) => (
            <div key={idx} className="relative aspect-square rounded-2xl overflow-hidden shadow-lg border border-gray-100 dark:border-white/5 bg-gray-100 dark:bg-navy-accent">
              <img src={img} alt="성경 일러스트" className="w-full h-full object-cover" />
            </div>
          ))}
        </div>
=======
      {/* 이미지 렌더링 영역 - 오류 시에도 우아하게 표시 */}
      {images && images.length > 0 ? (
        <div className={`grid ${images.length > 1 ? 'grid-cols-2' : 'grid-cols-1'} gap-3 mt-4 animate-in zoom-in-95 duration-700`}>
          {images.map((img, idx) => (
            <div key={idx} className="relative aspect-square rounded-2xl overflow-hidden shadow-lg border border-gray-100 dark:border-white/5 bg-gray-100 dark:bg-navy-accent">
              <img src={img} alt="Bible Illustration" className="w-full h-full object-cover" />
            </div>
          ))}
        </div>
      ) : role === 'model' && text.length > 0 && (
        <div className="mt-4 p-4 rounded-xl bg-primary/5 border border-primary/10 flex items-center gap-3">
           <span className="material-symbols-outlined text-primary text-sm filled">format_quote</span>
           <p className="text-[10px] text-primary/60 font-black">묵상하신 말씀이 삶의 현장에서 능력으로 나타나길 기도합니다.</p>
        </div>
>>>>>>> 81d2d6a97778cfb9e23c5eb89e8da9032ded794a
      )}
    </div>
  );
};

const parseBoldText = (text: string) => {
  const parts = text.split(/(\*\*.*?\*\*)/);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i} className="text-navy-dark dark:text-white font-black bg-primary/10 px-1 rounded mx-0.5">{part.slice(2, -2)}</strong>;
    }
    return part;
  });
};

export const AIChatScreen: React.FC = () => {
  const [userName, setUserName] = useState('');
  const [userPosition, setUserPosition] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGeneratingImages, setIsGeneratingImages] = useState(false);
<<<<<<< HEAD
  const [dailyReflection, setDailyReflection] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 날짜 기반 구절 선택
  const todayVerse = useMemo(() => {
    const day = new Date().getDate();
    return DAILY_VERSES[day % DAILY_VERSES.length];
  }, []);

  // 컴포넌트 마운트 시 정보 로드 및 오늘의 묵상 생성
  useEffect(() => {
    const savedInfo = localStorage.getItem('shinkwang_user_info');
    let initialName = '';
    let initialPosition = '';
    
    if (savedInfo) {
      try {
        const parsed = JSON.parse(savedInfo);
        initialName = parsed.name || '';
        initialPosition = parsed.position || '';
        setUserName(initialName);
        setUserPosition(initialPosition);
      } catch (e) {
        console.error("사용자 정보 파싱 실패", e);
      }
    }

    const greeting = initialName 
      ? `반갑습니다, ${initialName} ${initialPosition || '성도'}님! 오늘 성경 말씀이나 신앙 생활에 대해 궁금한 점이 있으신가요?` 
      : "안녕하세요 성도님! 저는 성남신광교회 성경 길잡이입니다. 오늘 무엇을 도와드릴까요?";
      
    setMessages([{ role: 'model', text: greeting }]);
    generateDailyReflection();
  }, []);

  const generateDailyReflection = async () => {
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `성경 구절: "${todayVerse.text} (${todayVerse.ref})". 
        이 구절을 바탕으로 성도님에게 전하는 매우 따뜻하고 격려가 되는 짧은 묵상 노트를 작성해줘. 
        최대 2줄로 작성하고, "오늘의 묵상:"으로 시작해. 정중하고 은혜로운 한국어(존댓말)를 사용해.`,
      });
      setDailyReflection(response.text || "주님의 은혜가 오늘 하루 성도님의 삶에 가득하시길 소망합니다.");
    } catch (e) {
      setDailyReflection("오늘 하루도 주님의 사랑 안에서 평안하시길 기도합니다.");
    }
  };

  const saveUserInfo = () => {
    localStorage.setItem('shinkwang_user_info', JSON.stringify({ 
      name: userName, 
      position: userPosition 
    }));
=======
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const savedInfo = localStorage.getItem('shinkwang_user_info');
    if (savedInfo) {
      const parsed = JSON.parse(savedInfo);
      setUserName(parsed.name || '');
      setUserPosition(parsed.position || '');
    }
    setMessages([{ role: 'model', text: "안녕하세요 성도님! 저는 성남신광교회 성경 길잡이입니다. 오늘 무엇을 도와드릴까요?" }]);
  }, []);

  const saveUserInfo = () => {
    localStorage.setItem('shinkwang_user_info', JSON.stringify({ name: userName, position: userPosition }));
>>>>>>> 81d2d6a97778cfb9e23c5eb89e8da9032ded794a
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isGeneratingImages, isLoading]);

  const handleSend = async (text: string = input) => {
<<<<<<< HEAD
    const trimmedText = text.trim();
    if (!trimmedText || isLoading || isGeneratingImages) return;

    setMessages(prev => [...prev, { role: 'user', text: trimmedText }]);
=======
    if (!text.trim() || isLoading || isGeneratingImages) return;

    setMessages(prev => [...prev, { role: 'user', text }]);
>>>>>>> 81d2d6a97778cfb9e23c5eb89e8da9032ded794a
    setInput('');
    setIsLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
<<<<<<< HEAD
        contents: trimmedText,
        config: {
          systemInstruction: `당신은 성남신광교회 성경 길잡이입니다. 
          사용자 정보: 이름(${userName || '성도'}), 직분(${userPosition || '성도'}). 
          상담 목적: 고민 상담, 성경 공부, 신앙 권면.
          사용자의 이름과 직분을 인지하고, 대화 중에 적절히 호칭을 사용하세요.
          답변은 성경 구절을 인용하여 따뜻하고 지혜롭게 하세요. 
          우리 교회의 담임목사님은 이현용 목사님입니다.
          말투는 정중한 기독교적 어조를 사용하세요.`,
        }
      });

      const responseText = response.text || "말씀을 전해드리지 못해 죄송합니다. 잠시 후 다시 시도해 주세요.";
      setMessages(prev => [...prev, { role: 'model', text: responseText }]);
      setIsLoading(false);
      await generateBibleIllustrations(trimmedText, responseText);
    } catch (error) {
      console.error("AI 오류:", error);
=======
        contents: text,
        config: {
          systemInstruction: `당신은 성남신광교회 성경 길잡이입니다. 사용자명: ${userName}, 직분: ${userPosition}. 성경 구절을 인용하여 따뜻하고 지혜롭게 답하세요.`,
        }
      });

      const responseText = response.text || "말씀을 전해드리지 못해 죄송합니다. 다시 시도해 주세요.";
      setMessages(prev => [...prev, { role: 'model', text: responseText }]);
      setIsLoading(false);
      
      // 이미지 생성 시도
      await generateBibleIllustrations(text, responseText);
    } catch (error) {
      console.error("AI Error:", error);
>>>>>>> 81d2d6a97778cfb9e23c5eb89e8da9032ded794a
      setIsLoading(false);
      setMessages(prev => [...prev, { role: 'model', text: "통신 오류가 발생했습니다. 성도님의 넓은 이해를 부탁드립니다." }]);
    }
  };

  const generateBibleIllustrations = async (userPrompt: string, aiResponse: string) => {
    setIsGeneratingImages(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
<<<<<<< HEAD
      const promptOptimizer = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `다음을 바탕으로 성경적인 일러스트를 위한 영어 프롬프트를 하나 만들어줘: "${userPrompt}". 
        부드럽고, 거룩하며, 빛이 가득한 느낌이어야 함. 프롬프트 텍스트만 출력해.`,
      });
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: { parts: [{ text: promptOptimizer.text?.trim() || "Biblical illustration, soft sacred light" }] },
        config: { imageConfig: { aspectRatio: "1:1" } }
      });
      const generatedImages: string[] = [];
      if (response.candidates?.[0]?.content?.parts) {
        for (const part of response.candidates[0].content.parts) {
          if (part.inlineData) generatedImages.push(`data:image/png;base64,${part.inlineData.data}`);
        }
      }
=======
      
      // 프롬프트 최적화 시도
      const promptOptimizer = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Create a short English image prompt for: ${userPrompt}. Focus on biblical art style. Output ONLY the prompt text.`,
      });

      const imagePrompt = promptOptimizer.text?.trim() || `Biblical illustration of ${userPrompt}`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image', // 오류 수정을 위한 모델명 확정
        contents: { parts: [{ text: imagePrompt }] },
        config: { imageConfig: { aspectRatio: "1:1" } }
      });

      const generatedImages: string[] = [];
      if (response.candidates?.[0]?.content?.parts) {
        for (const part of response.candidates[0].content.parts) {
          if (part.inlineData) {
            generatedImages.push(`data:image/png;base64,${part.inlineData.data}`);
          }
        }
      }

>>>>>>> 81d2d6a97778cfb9e23c5eb89e8da9032ded794a
      if (generatedImages.length > 0) {
        setMessages(prev => {
          const newMessages = [...prev];
          const last = newMessages[newMessages.length - 1];
          if (last && last.role === 'model') last.images = generatedImages;
          return newMessages;
        });
      }
    } catch (error) {
<<<<<<< HEAD
      console.error("이미지 생성 오류:", error);
=======
      console.error("Image Generation Error:", error);
      // 이미지 생성 실패 시 조용히 넘어감 (FormattedMessage에서 대체 문구 표시)
>>>>>>> 81d2d6a97778cfb9e23c5eb89e8da9032ded794a
    } finally {
      setIsGeneratingImages(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#F1F5F9] dark:bg-navy-dark overflow-hidden">
<<<<<<< HEAD
      {/* 개인 프로필 입력 영역 */}
      <div className="bg-white dark:bg-navy-accent p-4 border-b border-gray-200 dark:border-white/10 z-10 shadow-sm">
        <div className="flex flex-col gap-2">
          <p className="text-[10px] font-black text-primary uppercase tracking-widest ml-1">나의 프로필</p>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[16px] text-primary">person</span>
              <input type="text" value={userName} onChange={(e) => setUserName(e.target.value)} onBlur={saveUserInfo} placeholder="이름 입력" className="w-full bg-gray-50 dark:bg-navy-dark border-none rounded-xl py-2.5 pl-9 pr-3 text-xs font-bold dark:text-white focus:ring-1 focus:ring-primary shadow-inner" />
            </div>
            <div className="relative flex-1">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[16px] text-primary">military_tech</span>
              <input type="text" value={userPosition} onChange={(e) => setUserPosition(e.target.value)} onBlur={saveUserInfo} placeholder="직분 (예: 집사)" className="w-full bg-gray-50 dark:bg-navy-dark border-none rounded-xl py-2.5 pl-9 pr-3 text-xs font-bold dark:text-white focus:ring-1 focus:ring-primary shadow-inner" />
            </div>
          </div>
=======
      <div className="bg-white dark:bg-navy-accent p-4 border-b border-gray-200 dark:border-white/10 z-10">
        <div className="flex gap-2">
          <input type="text" value={userName} onChange={(e) => setUserName(e.target.value)} onBlur={saveUserInfo} placeholder="성함" className="flex-1 bg-gray-50 dark:bg-navy-dark border-none rounded-xl p-2.5 text-xs font-bold dark:text-white" />
          <input type="text" value={userPosition} onChange={(e) => setUserPosition(e.target.value)} onBlur={saveUserInfo} placeholder="직분" className="flex-1 bg-gray-50 dark:bg-navy-dark border-none rounded-xl p-2.5 text-xs font-bold dark:text-white" />
>>>>>>> 81d2d6a97778cfb9e23c5eb89e8da9032ded794a
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-6 no-scrollbar pb-10">
<<<<<<< HEAD
        {/* 오늘의 말씀 카드 */}
        <div className="bg-gradient-to-br from-navy-dark to-navy-accent p-6 rounded-[2.5rem] shadow-xl border border-primary/20 relative overflow-hidden animate-in fade-in slide-in-from-top-4 duration-1000">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <span className="material-symbols-outlined text-7xl text-primary">auto_stories</span>
          </div>
          <div className="relative z-10">
            <span className="bg-primary/20 text-primary text-[10px] font-black px-3 py-1 rounded-full border border-primary/30 uppercase tracking-widest">오늘의 말씀</span>
            <p className="text-white text-base font-black italic leading-tight mt-4 mb-2">"{todayVerse.text}"</p>
            <p className="text-primary text-xs font-bold">{todayVerse.ref}</p>
            <div className="mt-4 pt-4 border-t border-white/10">
              {dailyReflection ? (
                <p className="text-gray-300 text-[11px] font-medium leading-relaxed italic animate-in fade-in duration-700">{dailyReflection}</p>
              ) : (
                <div className="h-4 w-2/3 bg-white/5 animate-pulse rounded"></div>
              )}
            </div>
          </div>
        </div>

        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] px-5 py-4 rounded-3xl text-sm ${
              msg.role === 'user' ? 'bg-primary text-navy-dark font-black rounded-tr-none shadow-md' : 'bg-white dark:bg-navy-accent text-gray-800 dark:text-gray-200 rounded-tl-none border border-gray-100 dark:border-white/5 shadow-sm'
            }`}>
              {msg.role === 'model' && !msg.text && isLoading ? <ThinkingIndicator message="말씀을 묵상하며 응답을 준비 중입니다..." /> : <FormattedMessage text={msg.text} role={msg.role} images={msg.images} />}
=======
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] px-5 py-4 rounded-3xl text-sm ${msg.role === 'user' ? 'bg-primary text-navy-dark font-black rounded-tr-none' : 'bg-white dark:bg-navy-accent text-gray-800 dark:text-gray-200 rounded-tl-none border border-gray-100 dark:border-white/5'}`}>
              {msg.role === 'model' && !msg.text && isLoading ? <ThinkingIndicator message="말씀을 묵상하는 중입니다..." /> : <FormattedMessage text={msg.text} role={msg.role} images={msg.images} />}
>>>>>>> 81d2d6a97778cfb9e23c5eb89e8da9032ded794a
            </div>
          </div>
        ))}
        {isGeneratingImages && <ThinkingIndicator message="말씀 이미지를 그리는 중입니다..." />}
        <div ref={messagesEndRef} />
      </div>

<<<<<<< HEAD
      <div className="p-4 bg-white dark:bg-navy-accent border-t border-gray-200 dark:border-white/10 shrink-0 pb-6 flex flex-col gap-4">
        {/* 샘플 대화 칩 */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar px-1">
          <button onClick={() => handleSend("마음이 힘들어요")} className="shrink-0 bg-gray-50 dark:bg-navy-dark border border-gray-100 dark:border-white/5 px-4 py-2 rounded-full text-[11px] font-black text-gray-500 dark:text-gray-400 hover:border-primary/50 hover:text-primary transition-all active:scale-95 shadow-sm">😢 힘들어요</button>
          <button onClick={() => handleSend("은혜로운 말씀을 들려주세요")} className="shrink-0 bg-gray-50 dark:bg-navy-dark border border-gray-100 dark:border-white/5 px-4 py-2 rounded-full text-[11px] font-black text-gray-500 dark:text-gray-400 hover:border-primary/50 hover:text-primary transition-all active:scale-95 shadow-sm">🙏 은혜를 구합니다</button>
          <button onClick={() => handleSend("오늘의 말씀 묵상해줘")} className="shrink-0 bg-gray-50 dark:bg-navy-dark border border-gray-100 dark:border-white/5 px-4 py-2 rounded-full text-[11px] font-black text-gray-500 dark:text-gray-400 hover:border-primary/50 hover:text-primary transition-all active:scale-95 shadow-sm">📖 말씀 묵상</button>
        </div>

        <div className="flex items-center gap-2 bg-gray-50 dark:bg-navy-dark rounded-[2rem] px-5 py-1 border border-gray-200 dark:border-white/5 shadow-inner">
          <input type="text" placeholder="질문을 입력하세요..." value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSend()} disabled={isLoading || isGeneratingImages} className="flex-1 bg-transparent border-none focus:ring-0 text-sm py-4 dark:text-white placeholder-gray-400 font-bold" />
          <button onClick={() => handleSend()} disabled={isLoading || isGeneratingImages || !input.trim()} className="size-11 rounded-full flex items-center justify-center bg-primary text-navy-dark transition-all active:scale-90 disabled:opacity-30">
            <span className="material-symbols-outlined filled">send</span>
          </button>
=======
      <div className="p-4 bg-white dark:bg-navy-accent border-t border-gray-200 dark:border-white/10 shrink-0 pb-8">
        <div className="flex items-center gap-2 bg-gray-50 dark:bg-navy-dark rounded-[2rem] px-5 py-1.5 border border-gray-200 dark:border-white/5 shadow-inner">
          <input type="text" placeholder="궁금한 내용을 입력하세요..." value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSend()} disabled={isLoading || isGeneratingImages} className="flex-1 bg-transparent border-none focus:ring-0 text-sm py-4 dark:text-white placeholder-gray-400 font-bold" />
          <button onClick={() => handleSend()} disabled={isLoading || isGeneratingImages || !input.trim()} className="size-11 rounded-full flex items-center justify-center bg-primary text-navy-dark"><span className="material-symbols-outlined filled">send</span></button>
>>>>>>> 81d2d6a97778cfb9e23c5eb89e8da9032ded794a
        </div>
      </div>
    </div>
  );
};
