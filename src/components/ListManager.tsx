import React, { useState, useRef, useMemo } from 'react';
import Papa from 'papaparse';
import { Upload, Trash2, Users, FileText, Sparkles, UserMinus, AlertTriangle } from 'lucide-react';
import { cn } from '@/src/lib/utils';

interface ListManagerProps {
  names: string[];
  setNames: (names: string[]) => void;
}

const MOCK_NAMES = [
  '陳小明', '林美玲', '張志豪', '李淑芬', '王大同', 
  '劉芳妤', '吳建宏', '蔡宜君', '楊雅婷', '許志強',
  '鄭曉萍', '謝承恩', '郭子豪', '洪詩涵', '邱冠宇',
  '曾郁婷', '廖家豪', '賴雅雯', '徐子軒', '周佩珊'
];

export default function ListManager({ names, setNames }: ListManagerProps) {
  const [inputText, setInputText] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Find duplicates
  const duplicates = useMemo(() => {
    const counts = new Map<string, number>();
    names.forEach(name => {
      counts.set(name, (counts.get(name) || 0) + 1);
    });
    return new Set(
      Array.from(counts.entries())
        .filter(([_, count]) => count > 1)
        .map(([name]) => name)
    );
  }, [names]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    Papa.parse(file, {
      complete: (results) => {
        const parsedNames = results.data
          .flat()
          .map((n: any) => String(n).trim())
          .filter((n) => n.length > 0);
        
        setNames([...names, ...parsedNames]);
      },
      header: false,
    });
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleAddFromText = () => {
    const lines = inputText.split('\n').map(l => l.trim()).filter(l => l.length > 0);
    setNames([...names, ...lines]);
    setInputText('');
  };

  const generateMockData = () => {
    setNames([...names, ...MOCK_NAMES]);
  };

  const removeDuplicates = () => {
    const uniqueNames = Array.from(new Set(names));
    setNames(uniqueNames);
  };

  const clearList = () => {
    if (confirm('確定要清空名單嗎？')) {
      setNames([]);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Input Section */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-500" />
              輸入名單
            </h3>
            <div className="flex items-center gap-2">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="text-xs flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors font-bold"
              >
                <Upload className="w-3.5 h-3.5" />
                上傳 CSV
              </button>
              <button
                onClick={generateMockData}
                className="text-xs flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-colors font-bold"
              >
                <Sparkles className="w-3.5 h-3.5" />
                生成模擬名單
              </button>
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-600">貼上姓名 (每行一個)</label>
            <textarea
              className="w-full h-40 p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none"
              placeholder="例如：&#10;王小明&#10;李小華..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
            />
            <button
              onClick={handleAddFromText}
              disabled={!inputText.trim()}
              className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors disabled:opacity-50"
            >
              加入名單
            </button>
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept=".csv" 
              onChange={handleFileUpload} 
            />
          </div>
        </div>

        {/* List Preview */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col h-[500px]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Users className="w-5 h-5 text-green-500" />
              目前名單 ({names.length})
            </h3>
            <div className="flex items-center gap-2">
              {duplicates.size > 0 && (
                <button
                  onClick={removeDuplicates}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-50 text-orange-600 rounded-lg hover:bg-orange-100 transition-colors text-xs font-bold"
                  title="移除所有重複姓名"
                >
                  <UserMinus className="w-3.5 h-3.5" />
                  移除重複 ({duplicates.size})
                </button>
              )}
              {names.length > 0 && (
                <button 
                  onClick={clearList}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  title="清空名單"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto pr-2 space-y-1 custom-scrollbar">
            {names.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-slate-400 gap-2">
                <Users className="w-12 h-12 opacity-20" />
                <p>尚無名單</p>
              </div>
            ) : (
              names.map((name, i) => {
                const isDuplicate = duplicates.has(name);
                return (
                  <div 
                    key={i} 
                    className={cn(
                      "flex items-center justify-between p-2 rounded-lg group border transition-all",
                      isDuplicate 
                        ? "bg-orange-50 border-orange-100 hover:bg-orange-100" 
                        : "bg-transparent border-transparent hover:bg-slate-50 hover:border-slate-100"
                    )}
                  >
                    <div className="flex items-center gap-2">
                      <span className={cn("font-medium", isDuplicate ? "text-orange-700" : "text-slate-700")}>
                        {name}
                      </span>
                      {isDuplicate && (
                        <AlertTriangle className="w-3.5 h-3.5 text-orange-500" title="重複姓名" />
                      )}
                    </div>
                    <button 
                      onClick={() => setNames(names.filter((_, idx) => idx !== i))}
                      className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-red-500 transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
