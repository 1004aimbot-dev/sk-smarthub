
import React, { useState, useRef, useEffect, useMemo } from 'react';
import { GoogleGenAI } from "@google/genai";
import { ChatMessage } from '../types';

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
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isGeneratingImages, isLoading]);

  const handleSend = async (text: string = input) => {
    if (!text.trim() || isLoading || isGeneratingImages) return;

    setMessages(prev => [...prev, { role: 'user', text }]);
    setInput('');
    setIsLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
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
      setIsLoading(false);
      setMessages(prev => [...prev, { role: 'model', text: "통신 오류가 발생했습니다. 성도님의 넓은 이해를 부탁드립니다." }]);
    }
  };

  const generateBibleIllustrations = async (userPrompt: string, aiResponse: string) => {
    setIsGeneratingImages(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
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

      if (generatedImages.length > 0) {
        setMessages(prev => {
          const newMessages = [...prev];
          const last = newMessages[newMessages.length - 1];
          if (last && last.role === 'model') last.images = generatedImages;
          return newMessages;
        });
      }
    } catch (error) {
      console.error("Image Generation Error:", error);
      // 이미지 생성 실패 시 조용히 넘어감 (FormattedMessage에서 대체 문구 표시)
    } finally {
      setIsGeneratingImages(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#F1F5F9] dark:bg-navy-dark overflow-hidden">
      <div className="bg-white dark:bg-navy-accent p-4 border-b border-gray-200 dark:border-white/10 z-10">
        <div className="flex gap-2">
          <input type="text" value={userName} onChange={(e) => setUserName(e.target.value)} onBlur={saveUserInfo} placeholder="성함" className="flex-1 bg-gray-50 dark:bg-navy-dark border-none rounded-xl p-2.5 text-xs font-bold dark:text-white" />
          <input type="text" value={userPosition} onChange={(e) => setUserPosition(e.target.value)} onBlur={saveUserInfo} placeholder="직분" className="flex-1 bg-gray-50 dark:bg-navy-dark border-none rounded-xl p-2.5 text-xs font-bold dark:text-white" />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-6 no-scrollbar pb-10">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] px-5 py-4 rounded-3xl text-sm ${msg.role === 'user' ? 'bg-primary text-navy-dark font-black rounded-tr-none' : 'bg-white dark:bg-navy-accent text-gray-800 dark:text-gray-200 rounded-tl-none border border-gray-100 dark:border-white/5'}`}>
              {msg.role === 'model' && !msg.text && isLoading ? <ThinkingIndicator message="말씀을 묵상하는 중입니다..." /> : <FormattedMessage text={msg.text} role={msg.role} images={msg.images} />}
            </div>
          </div>
        ))}
        {isGeneratingImages && <ThinkingIndicator message="말씀 이미지를 그리는 중입니다..." />}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 bg-white dark:bg-navy-accent border-t border-gray-200 dark:border-white/10 shrink-0 pb-8">
        <div className="flex items-center gap-2 bg-gray-50 dark:bg-navy-dark rounded-[2rem] px-5 py-1.5 border border-gray-200 dark:border-white/5 shadow-inner">
          <input type="text" placeholder="궁금한 내용을 입력하세요..." value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSend()} disabled={isLoading || isGeneratingImages} className="flex-1 bg-transparent border-none focus:ring-0 text-sm py-4 dark:text-white placeholder-gray-400 font-bold" />
          <button onClick={() => handleSend()} disabled={isLoading || isGeneratingImages || !input.trim()} className="size-11 rounded-full flex items-center justify-center bg-primary text-navy-dark"><span className="material-symbols-outlined filled">send</span></button>
        </div>
      </div>
    </div>
  );
};
