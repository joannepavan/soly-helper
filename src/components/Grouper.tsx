import { useState } from 'react';
import { motion } from 'motion/react';
import { Users2, Shuffle, LayoutGrid, List, AlertCircle, Download } from 'lucide-react';
import Papa from 'papaparse';
import { cn } from '@/src/lib/utils';

interface GrouperProps {
  names: string[];
}

export default function Grouper({ names }: GrouperProps) {
  const [groupSize, setGroupSize] = useState(2);
  const [groups, setGroups] = useState<string[][]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const shuffleAndGroup = () => {
    if (names.length === 0) return;

    const shuffled = [...names].sort(() => Math.random() - 0.5);
    const result: string[][] = [];
    
    for (let i = 0; i < shuffled.length; i += groupSize) {
      result.push(shuffled.slice(i, i + groupSize));
    }
    
    setGroups(result);
  };

  const downloadCSV = () => {
    if (groups.length === 0) return;

    // Prepare data for CSV
    // Format: Group Name, Member Name
    const csvData: { Group: string; Name: string }[] = [];
    groups.forEach((group, index) => {
      group.forEach(name => {
        csvData.push({
          Group: `Group ${index + 1}`,
          Name: name
        });
      });
    });

    const csv = Papa.unparse(csvData);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `grouping_results_${new Date().getTime()}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (names.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-slate-400 gap-4">
        <AlertCircle className="w-12 h-12" />
        <p className="text-lg">請先在「名單管理」中加入姓名</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Controls */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-6">
        <div className="flex items-center gap-8">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">每組人數</label>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min="2"
                max={Math.max(2, names.length)}
                value={groupSize}
                onChange={(e) => setGroupSize(parseInt(e.target.value))}
                className="w-32 h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <span className="text-xl font-black text-blue-600 w-8">{groupSize}</span>
            </div>
          </div>

          <div className="h-10 w-px bg-slate-100 hidden sm:block" />

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">預計組數</label>
            <p className="text-lg font-semibold text-slate-700">
              {Math.ceil(names.length / groupSize)} <span className="text-sm font-normal text-slate-400">組</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => setViewMode('grid')}
              className={cn(
                "p-2 rounded-lg transition-all",
                viewMode === 'grid' ? "bg-white shadow-sm text-blue-600" : "text-slate-400 hover:text-slate-600"
              )}
            >
              <LayoutGrid className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={cn(
                "p-2 rounded-lg transition-all",
                viewMode === 'list' ? "bg-white shadow-sm text-blue-600" : "text-slate-400 hover:text-slate-600"
              )}
            >
              <List className="w-5 h-5" />
            </button>
          </div>

          <div className="flex items-center gap-2">
            {groups.length > 0 && (
              <button
                onClick={downloadCSV}
                className="flex items-center gap-2 px-4 py-3 bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-xl font-bold transition-all active:scale-95"
                title="下載分組結果"
              >
                <Download className="w-5 h-5" />
              </button>
            )}
            <button
              onClick={shuffleAndGroup}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-lg shadow-blue-200 transition-all active:scale-95"
            >
              <Shuffle className="w-5 h-5" />
              開始分組
            </button>
          </div>
        </div>
      </div>

      {/* Results */}
      {groups.length > 0 ? (
        <div className={cn(
          "grid gap-6",
          viewMode === 'grid' ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" : "grid-cols-1"
        )}>
          {groups.map((group, i) => (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              key={i}
              className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden group hover:border-blue-200 transition-colors"
            >
              <div className="bg-slate-50 px-4 py-3 border-bottom border-slate-100 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">第 {i + 1} 組</span>
                <Users2 className="w-4 h-4 text-slate-300" />
              </div>
              <div className="p-4 space-y-2">
                {group.map((name, j) => (
                  <div key={j} className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                    <span className="text-slate-700 font-medium">{name}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-64 bg-slate-50 rounded-[2rem] border-2 border-dashed border-slate-200 text-slate-400 gap-4">
          <Users2 className="w-12 h-12 opacity-20" />
          <p className="text-lg">點擊「開始分組」生成結果</p>
        </div>
      )}
    </div>
  );
}
