
import React, { useState, useEffect, useCallback } from 'react';
import RegistrationApp from './components/RegistrationApp';
import CardGeneratorApp from './components/CardGeneratorApp';
import { AppView, Member, CentralDatabase } from './types';
import { UserPlus, CreditCard, Database, ShieldCheck, RefreshCw, Sun, Moon } from 'lucide-react';
import { dbService } from './services/db';

const OFFICIAL_LOGO_URL = "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Flag_of_the_Movement_for_the_Liberation_of_the_Congo.svg/1200px-Flag_of_the_Movement_for_the_Liberation_of_the_Congo.svg.png";

const App: React.FC = () => {
  const [view, setView] = useState<AppView>(AppView.REGISTRATION);
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [db, setDb] = useState<CentralDatabase>({
    version: '1.0.0',
    lastUpdated: new Date().toISOString(),
    members: []
  });

  // Gestion du mode sombre
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Chargement initial via le service
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      const data = await dbService.getDatabase();
      setDb(data);
      setIsLoading(false);
    };
    loadData();
  }, []);

  const addMember = useCallback(async (member: Member) => {
    const success = await dbService.saveMember(member);
    if (success) {
      setDb(prev => ({
        ...prev,
        lastUpdated: new Date().toISOString(),
        members: [member, ...prev.members]
      }));
    }
  }, []);

  const handleSync = async () => {
    setIsSyncing(true);
    await dbService.syncWithCloud();
    setIsSyncing(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-4 transition-colors duration-300">
        <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] shadow-2xl flex flex-col items-center gap-6 border border-slate-100 dark:border-slate-800">
          <div className="relative">
            <img src={OFFICIAL_LOGO_URL} alt="MLC" className="w-16 h-16 animate-pulse" />
            <div className="absolute inset-0 border-4 border-blue-700/10 border-t-blue-700 rounded-full animate-spin"></div>
          </div>
          <div className="text-center">
            <h2 className="text-blue-700 dark:text-blue-500 font-black uppercase tracking-tighter">Initialisation</h2>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Connexion MLC Cloud Secure...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 sticky top-0 z-50 no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center gap-4">
              <div className="bg-white dark:bg-slate-800 p-1.5 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 transition-transform hover:scale-105">
                <img src={OFFICIAL_LOGO_URL} alt="MLC Logo" className="w-10 h-10 object-contain" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-lg font-extrabold text-blue-700 dark:text-blue-500 tracking-tighter uppercase leading-none">MLC</h1>
                <p className="text-[10px] font-bold text-yellow-600 uppercase tracking-[0.2em] mt-1">Espace Membres</p>
              </div>
            </div>
            
            <nav className="flex gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl">
              <button
                onClick={() => setView(AppView.REGISTRATION)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all uppercase tracking-tight ${
                  view === AppView.REGISTRATION 
                  ? 'bg-white dark:bg-slate-700 text-blue-700 dark:text-blue-400 shadow-sm ring-1 ring-slate-200 dark:ring-slate-600' 
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                <UserPlus size={16} />
                <span>Adhésion</span>
              </button>
              <button
                onClick={() => setView(AppView.CARD_GENERATOR)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all uppercase tracking-tight ${
                  view === AppView.CARD_GENERATOR 
                  ? 'bg-white dark:bg-slate-700 text-blue-700 dark:text-blue-400 shadow-sm ring-1 ring-slate-200 dark:ring-slate-600' 
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                <CreditCard size={16} />
                <span>Cartes PVC</span>
              </button>
            </nav>

            <div className="flex items-center gap-3 border-l border-slate-100 dark:border-slate-800 pl-4">
              <button
                onClick={() => setIsDarkMode(!isDarkMode)}
                className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-blue-700 dark:hover:text-blue-400 transition-all shadow-sm border border-slate-100 dark:border-slate-700"
                title={isDarkMode ? "Mode Clair" : "Mode Sombre"}
              >
                {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
              </button>

              <button 
                onClick={handleSync}
                disabled={isSyncing}
                className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 px-3 py-2 rounded-xl transition-all disabled:opacity-50 border border-slate-100 dark:border-slate-700"
              >
                <div className="text-right hidden md:block">
                  <p className="text-[9px] font-bold text-slate-400 uppercase">{isSyncing ? 'Synchronisation...' : 'Serveur Cloud'}</p>
                  <p className="text-xs font-extrabold text-slate-900 dark:text-slate-100">{db.members.length} Enrôlés</p>
                </div>
                <div className={`p-2 rounded-full ${isSyncing ? 'bg-blue-50 dark:bg-blue-900/30' : 'bg-yellow-50 dark:bg-yellow-900/30'} border border-slate-100 dark:border-slate-700`}>
                  {isSyncing ? <RefreshCw className="text-blue-600 dark:text-blue-400 w-4 h-4 animate-spin" /> : <Database className="text-yellow-600 dark:text-yellow-400 w-4 h-4" />}
                </div>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-700">
        {view === AppView.REGISTRATION ? (
          <RegistrationApp onAddMember={addMember} />
        ) : (
          <CardGeneratorApp members={db.members} />
        )}
      </main>

      <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 py-6 no-print transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4 text-slate-400 dark:text-slate-500 text-[10px] font-bold uppercase tracking-widest">
          <div className="flex items-center gap-3">
             <ShieldCheck size={14} className="text-blue-700 dark:text-blue-500" />
             <span>© {new Date().getFullYear()} Secrétariat National MLC - Tous droits réservés</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
              Connecté au Cloud
            </span>
            <span className="text-slate-300">|</span>
            <span>v{db.version}</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
