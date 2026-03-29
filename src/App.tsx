import { useState } from 'react';
import { Users, Trophy, Users2, Github } from 'lucide-react';
import ListManager from './components/ListManager';
import LuckyDraw from './components/LuckyDraw';
import Grouper from './components/Grouper';
import { cn } from './lib/utils';

type Tab = 'list' | 'draw' | 'group';

export default function App() {
  const [names, setNames] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<Tab>('list');

  const tabs = [
    { id: 'list', label: '名單管理', icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
    { id: 'draw', label: '獎品抽籤', icon: Trophy, color: 'text-yellow-600', bg: 'bg-yellow-50' },
    { id: 'group', label: '自動分組', icon: Users2, color: 'text-green-600', bg: 'bg-green-50' },
  ] as const;

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-blue-100 selection:text-blue-900">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-200">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight">首利抽獎小幫手</h1>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Activity Management</p>
            </div>
          </div>

          <nav className="hidden md:flex bg-slate-100 p-1 rounded-2xl">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex items-center gap-2 px-6 py-2 rounded-xl text-sm font-bold transition-all",
                  activeTab === tab.id 
                    ? "bg-white shadow-sm text-slate-900" 
                    : "text-slate-400 hover:text-slate-600"
                )}
              >
                <tab.icon className={cn("w-4 h-4", activeTab === tab.id && tab.color)} />
                {tab.label}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <a 
              href="https://github.com" 
              target="_blank" 
              rel="noreferrer"
              className="p-2 text-slate-400 hover:text-slate-600 transition-colors"
            >
              <Github className="w-5 h-5" />
            </a>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Mobile Nav */}
        <div className="md:hidden flex gap-2 mb-8 overflow-x-auto pb-2 no-scrollbar">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex items-center gap-2 px-5 py-3 rounded-2xl text-sm font-bold whitespace-nowrap transition-all flex-shrink-0",
                activeTab === tab.id 
                  ? "bg-white shadow-md text-slate-900 border border-slate-100" 
                  : "bg-slate-200/50 text-slate-500"
              )}
            >
              <tab.icon className={cn("w-4 h-4", activeTab === tab.id && tab.color)} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="min-h-[600px]">
          {activeTab === 'list' && <ListManager names={names} setNames={setNames} />}
          {activeTab === 'draw' && <LuckyDraw names={names} />}
          {activeTab === 'group' && <Grouper names={names} />}
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 border-t border-slate-200">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-slate-400 text-sm font-medium">
          <p>© 2026 首利抽獎小幫手. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-slate-600 transition-colors">Privacy</a>
            <a href="#" className="hover:text-slate-600 transition-colors">Terms</a>
            <a href="#" className="hover:text-slate-600 transition-colors">Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
