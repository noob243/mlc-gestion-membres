
import React, { useState } from 'react';
import { Member } from '../types';
import { Search, QrCode, CreditCard, Printer, UserCircle, X, ShieldCheck, MapPin, Phone, Loader2, Download, Lock, CalendarCheck, AlertTriangle } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

interface CardGeneratorAppProps {
  members: Member[];
}

const CardGeneratorApp: React.FC<CardGeneratorAppProps> = ({ members }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [showScanner, setShowScanner] = useState(false);
  const [printingStatus, setPrintingStatus] = useState<string | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState<{ show: boolean, type: 'print' | 'download' }>({ show: false, type: 'print' });

  const officialLogoUrl = "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Flag_of_the_Movement_for_the_Liberation_of_the_Congo.svg/1200px-Flag_of_the_Movement_for_the_Liberation_of_the_Congo.svg.png";

  const filteredMembers = members.filter(m =>
    m.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    `${m.firstName} ${m.lastName} ${m.postName}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelect = (member: Member) => {
    setSelectedMember(member);
    setSearchTerm('');
  };

  const executePrint = () => {
    setShowConfirmModal({ ...showConfirmModal, show: false });
    window.print();
    setPrintingStatus("Préparation de l'impression PVC...");
    setTimeout(() => setPrintingStatus(null), 6000);
  };

  const executeDownload = () => {
    setShowConfirmModal({ ...showConfirmModal, show: false });
    setPrintingStatus("Génération du fichier de la carte...");
    window.print();
    setTimeout(() => setPrintingStatus(null), 4000);
  };

  const formatDate = (dateString: string) => {
    try {
      if (!dateString) return "N/A";
      return new Date(dateString).toLocaleDateString('fr-FR');
    } catch (e) {
      return dateString;
    }
  };

  return (
    <div className="max-w-6xl mx-auto relative">
      {printingStatus && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[200] no-print w-full max-w-sm px-4">
          <div className="bg-slate-900 text-white p-5 rounded-3xl shadow-2xl flex items-center gap-4 animate-in fade-in slide-in-from-top-8 duration-500 border border-slate-700">
            <div className="bg-blue-700 p-2 rounded-2xl">
              <Loader2 size={24} className="text-white animate-spin" />
            </div>
            <div className="flex-1">
              <p className="font-black uppercase tracking-tighter text-sm">{printingStatus}</p>
              <p className="text-[10px] font-bold text-slate-400 uppercase mt-1 tracking-widest">Ne fermez pas cette fenêtre</p>
            </div>
          </div>
        </div>
      )}

      {/* MODAL DE CONFIRMATION */}
      {showConfirmModal.show && (
        <div className="fixed inset-0 z-[250] flex items-center justify-center bg-slate-900/80 dark:bg-black/80 backdrop-blur-md p-4 no-print animate-in fade-in duration-300">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-[2.5rem] overflow-hidden shadow-2xl border border-white/20 dark:border-slate-800 scale-110">
            <div className="p-8 text-center">
              <div className="w-20 h-20 bg-amber-50 dark:bg-amber-900/20 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-amber-100 dark:border-amber-900/30">
                <AlertTriangle size={40} className="text-amber-500" />
              </div>
              <h3 className="text-xl font-black text-slate-800 dark:text-slate-100 uppercase tracking-tighter mb-2">Confirmation Requise</h3>
              <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest leading-relaxed px-4">
                Êtes-vous sûr de vouloir {showConfirmModal.type === 'print' ? "lancer l'impression" : "télécharger le fichier"} pour ce membre ?
              </p>
              <p className="mt-2 text-[10px] text-blue-700 dark:text-blue-400 font-black uppercase tracking-widest">Cette action utilise les ressources du système</p>
            </div>
            <div className="grid grid-cols-2 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => setShowConfirmModal({ ...showConfirmModal, show: false })}
                className="py-6 font-black text-[10px] uppercase tracking-widest text-slate-400 dark:text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors border-r border-slate-100 dark:border-slate-800"
              >
                Annuler
              </button>
              <button
                onClick={showConfirmModal.type === 'print' ? executePrint : executeDownload}
                className="py-6 font-black text-[10px] uppercase tracking-widest text-blue-700 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-800 transition-colors"
              >
                Confirmer
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6 no-print">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 transition-colors">
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-4 flex items-center gap-2">
              <Search size={20} className="text-blue-700 dark:text-blue-500" /> Identification
            </h3>
            <div className="space-y-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="ID, Nom, Postnom..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-700 dark:focus:ring-blue-500 outline-none font-bold transition-colors"
                />
                <Search className="absolute left-3 top-2.5 text-slate-400 dark:text-slate-500" size={18} />
              </div>
              <button onClick={() => setShowScanner(true)} className="w-full flex items-center justify-center gap-2 bg-slate-800 dark:bg-slate-700 hover:bg-slate-900 dark:hover:bg-slate-600 text-white py-3 rounded-xl font-black uppercase text-[10px] tracking-widest transition-all">
                <QrCode size={18} /> Scanner QR Code
              </button>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden transition-colors">
            <div className="p-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex justify-between items-center">
              <h4 className="font-black text-slate-700 dark:text-slate-300 text-[10px] uppercase tracking-wider">Membres Disponibles</h4>
              <span className="bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400 px-2 py-0.5 rounded text-[9px] font-bold">{filteredMembers.length}</span>
            </div>
            <div className="max-h-[400px] overflow-y-auto">
              {filteredMembers.map(m => (
                <button key={m.id} onClick={() => handleSelect(m)} className={`w-full text-left p-4 flex items-center gap-3 border-b border-slate-50 dark:border-slate-800 transition-colors ${selectedMember?.id === m.id ? 'bg-blue-50 dark:bg-blue-900/20' : 'hover:bg-slate-50 dark:hover:bg-slate-800'}`}>
                  <div className="bg-slate-200 dark:bg-slate-700 w-10 h-10 rounded-full overflow-hidden border border-slate-300 dark:border-slate-600">
                    {m.photoUrl ? <img src={m.photoUrl} alt="Portrait" className="w-full h-full object-cover" /> : <UserCircle className="text-slate-400" />}
                  </div>
                  <div>
                    <p className="font-black text-slate-800 dark:text-slate-200 text-xs uppercase">{m.lastName} {m.postName} {m.firstName}</p>
                    <p className="text-[10px] text-slate-500 dark:text-slate-500 font-mono">{m.id}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 flex flex-col items-center">
          {selectedMember ? (
            <div className="w-full flex flex-col items-center gap-8">
              <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-xl flex items-center gap-3 no-print">
                <ShieldCheck className="text-emerald-600" size={20} />
                <p className="text-[10px] text-emerald-800 font-black uppercase tracking-widest">Identité Officielle & Sécurisée</p>
              </div>

              <div className="flex flex-col gap-12 items-center print-container">
                {/* RECTO */}
                <div className="pvc-card-wrapper border border-slate-200 shadow-2xl">
                  <div className="pvc-card-content bg-white relative">
                    <div className="absolute inset-0 opacity-[0.04] pointer-events-none overflow-hidden flex items-center justify-center">
                      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" className="absolute">
                        <defs>
                          <pattern id="guilloche" x="0" y="0" width="30" height="30" patternUnits="userSpaceOnUse">
                            <path d="M0 15 Q7.5 0 15 15 T30 15" fill="none" stroke="#003399" strokeWidth="0.3" />
                          </pattern>
                        </defs>
                        <rect width="100%" height="100%" fill="url(#guilloche)" />
                      </svg>
                      <img src={officialLogoUrl} alt="Logo Watermark" className="w-[180px] grayscale opacity-50 rotate-[-15deg]" />
                    </div>

                    <div className="relative z-10 h-full flex flex-col">
                      <div className="flex justify-between items-start mb-3 border-b border-slate-100 pb-2">
                        <div className="flex items-center gap-2">
                          <img src={officialLogoUrl} alt="Logo" className="h-8 w-auto object-contain" />
                          <div className="border-l border-slate-200 pl-2">
                            <h1 className="text-[10px] font-black tracking-tighter text-blue-700 leading-none">MOUVEMENT DE LIBÉRATION</h1>
                            <p className="text-[8px] font-black text-yellow-600 uppercase leading-none mt-0.5">DU CONGO (MLC)</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="text-[5px] font-black bg-blue-700 text-white px-1.5 py-0.5 rounded uppercase tracking-widest">MEMBRE OFFICIEL</span>
                        </div>
                      </div>

                      <div className="flex flex-1 gap-4 items-center">
                        <div className="relative">
                          <div className="w-[70px] h-[88px] rounded-lg overflow-hidden border border-slate-200 shadow-md relative z-10 bg-white">
                            <img src={selectedMember.photoUrl} alt="Portrait" className="w-full h-full object-cover" />
                          </div>
                          <div className="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 border-yellow-500 z-20"></div>
                          <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 border-blue-700 z-20"></div>
                        </div>

                        <div className="flex-1 space-y-1.5">
                          <div className="border-b border-slate-50 pb-1">
                            <p className="text-[4px] font-black text-slate-400 uppercase tracking-widest mb-0.5">NOM & POSTNOM</p>
                            <h2 className="text-[11px] font-black text-slate-900 uppercase leading-tight truncate">{selectedMember.lastName} {selectedMember.postName}</h2>
                          </div>
                          <div>
                            <p className="text-[4px] font-black text-slate-400 uppercase tracking-widest mb-0.5">PRÉNOM</p>
                            <h3 className="text-[10px] font-bold text-blue-800 uppercase leading-tight truncate">{selectedMember.firstName}</h3>
                          </div>

                          <div className="grid grid-cols-2 gap-x-2 gap-y-1 pt-1">
                            <div>
                              <p className="text-[3.5px] font-black text-slate-300 uppercase">ID MATRICULE</p>
                              <p className="text-[7px] font-mono font-bold text-slate-800">{selectedMember.id}</p>
                            </div>
                            <div>
                              <p className="text-[3.5px] font-black text-slate-300 uppercase">CATÉGORIE</p>
                              <p className="text-[7px] font-black text-blue-700 uppercase">{selectedMember.category}</p>
                            </div>
                            <div className="col-span-2">
                              <p className="text-[3.5px] font-black text-slate-300 uppercase">FÉDÉRATION</p>
                              <p className="text-[7px] font-bold text-slate-800 uppercase truncate">{selectedMember.federation}</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="mt-auto flex justify-between items-center border-t border-slate-100 pt-1.5">
                        <div className="flex gap-1.5 items-center">
                          <div className="flex">
                            <div className="w-2 h-1 bg-blue-700"></div>
                            <div className="w-2 h-1 bg-yellow-400"></div>
                          </div>
                          <p className="text-[4.5px] font-black text-slate-400 uppercase tracking-widest italic">Avec le MLC, pour un Congo nouveau</p>
                        </div>
                        <div className="text-[4.5px] font-black text-slate-800 uppercase">SYSTÈME BIOMÉTRIE MLC 2026</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* VERSO */}
                <div className="pvc-card-wrapper border border-blue-900 shadow-2xl">
                  <div className="pvc-card-content bg-gradient-to-br from-blue-600 via-blue-800 to-slate-900 relative overflow-hidden">
                    {/* Effet de brillance moderne */}
                    <div className="absolute -top-24 -left-24 w-64 h-64 bg-blue-400/10 rounded-full blur-3xl pointer-events-none"></div>

                    <div className="absolute inset-0 opacity-[0.08] flex items-center justify-center pointer-events-none">
                      <img src={officialLogoUrl} alt="Watermark Back" className="w-[200px] brightness-0 invert rotate-[-15deg]" />
                    </div>

                    <div className="relative z-10 h-full flex flex-col">
                      <div className="flex justify-between items-center mb-3 border-b border-blue-600/50 pb-1">
                        <h4 className="text-[7px] font-black uppercase text-yellow-400 tracking-widest">INFOS COMPLÉMENTAIRES</h4>
                        <img src={officialLogoUrl} alt="Mini Logo" className="h-3 w-auto brightness-0 invert opacity-50" />
                      </div>

                      <div className="flex gap-4 items-center flex-1 px-1 overflow-hidden">
                        <div className="flex flex-col items-center gap-1 flex-shrink-0">
                          <div className="bg-white p-1.5 rounded-lg shadow-sm border border-blue-500">
                            <QRCodeSVG value={selectedMember.id} size={54} level="H" />
                          </div>
                          <div className="flex items-center gap-1 opacity-90">
                            <Lock size={4} className="text-yellow-400" />
                            <p className="text-[3.5px] font-black text-yellow-400 uppercase tracking-tighter">QR SÉCURISÉ - ID UNIQUE</p>
                          </div>
                        </div>
                        <div className="space-y-2 py-0.5 min-w-0 flex-1">
                          <div>
                            <p className="text-[3.5px] font-black text-blue-200 uppercase tracking-widest mb-0.5">NÉ(E) LE</p>
                            <p className="text-[7.5px] font-bold text-white">{formatDate(selectedMember.birthDate)}</p>
                          </div>
                          <div className="flex items-start gap-1.5">
                            <MapPin size={6} className="text-yellow-400 mt-0.5 flex-shrink-0" />
                            <div className="min-w-0">
                              <p className="text-[3.5px] font-black text-blue-200 uppercase tracking-widest mb-0.5">RÉSIDENCE</p>
                              <p className="text-[7.5px] font-bold text-white leading-tight truncate">{selectedMember.cityProvince}, {selectedMember.country}</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-1.5">
                            <Phone size={6} className="text-yellow-400 mt-0.5 flex-shrink-0" />
                            <div className="min-w-0">
                              <p className="text-[3.5px] font-black text-blue-200 uppercase tracking-widest mb-0.5">CONTACT</p>
                              <p className="text-[7.5px] font-black text-white">{selectedMember.phone}</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-1.5">
                            <CalendarCheck size={6} className="text-emerald-400 mt-0.5 flex-shrink-0" />
                            <div className="min-w-0">
                              <p className="text-[3.5px] font-black text-blue-200 uppercase tracking-widest mb-0.5">DATE D'ENRÔLEMENT</p>
                              <p className="text-[7.5px] font-bold text-emerald-300 uppercase truncate">Enrôlé le {formatDate(selectedMember.registrationDate)}</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="mt-auto bg-blue-800/40 backdrop-blur-sm p-1.5 rounded-lg border border-blue-600/30 shadow-sm text-center">
                        <p className="text-[3.8px] leading-tight text-blue-100 font-bold uppercase tracking-tighter">
                          Cette carte est strictement personnelle. Elle reste la propriété exclusive du MLC.
                          Toute falsification sera punie conformément aux lois de la République.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap justify-center gap-4 no-print mt-8 mb-12">
                <button
                  onClick={() => setShowConfirmModal({ show: true, type: 'print' })}
                  className="bg-blue-700 hover:bg-blue-800 text-white font-black py-4 px-8 rounded-2xl shadow-xl transition-all flex items-center gap-3 uppercase text-[10px] tracking-widest active:scale-95"
                >
                  <Printer size={18} /> Imprimer PVC
                </button>
                <button
                  onClick={() => setShowConfirmModal({ show: true, type: 'download' })}
                  className="bg-slate-900 hover:bg-black text-white font-black py-4 px-8 rounded-2xl shadow-xl transition-all flex items-center gap-3 uppercase text-[10px] tracking-widest active:scale-95"
                >
                  <Download size={18} /> Télécharger Carte
                </button>
                <button onClick={() => setSelectedMember(null)} className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 font-black py-4 px-8 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-700 uppercase text-[10px] tracking-widest transition-all">
                  Changer
                </button>
              </div>
            </div>
          ) : (
            <div className="h-[400px] w-full bg-slate-50 dark:bg-slate-900/50 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-[2.5rem] flex flex-col items-center justify-center text-slate-400 dark:text-slate-600 p-12 text-center no-print transition-colors">
              <div className="w-20 h-20 bg-white dark:bg-slate-800 rounded-3xl flex items-center justify-center shadow-sm mb-6 border border-slate-100 dark:border-slate-700">
                <img src={officialLogoUrl} alt="Placeholder Logo" className="w-12 h-12 grayscale opacity-20 dark:opacity-10" />
              </div>
              <h3 className="text-xl font-black text-slate-600 dark:text-slate-500 uppercase tracking-tighter">Sélectionnez un membre</h3>
              <p className="text-[10px] font-bold uppercase tracking-widest mt-4">Prêt pour l'édition de carte officielle</p>
            </div>
          )}
        </div>
      </div>

      {showScanner && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/95 dark:bg-black/95 backdrop-blur-xl p-4 no-print transition-colors">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-[2.5rem] overflow-hidden shadow-2xl border border-white/10 dark:border-slate-800">
            <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-800/50">
              <h3 className="font-black text-blue-700 dark:text-blue-400 uppercase tracking-tighter flex items-center gap-2">
                <QrCode size={24} /> Scanner MLC
              </h3>
              <button onClick={() => setShowScanner(false)} className="bg-white dark:bg-slate-800 p-2 rounded-full shadow-sm text-slate-400 hover:text-blue-700 dark:hover:text-blue-400 transition-colors">
                <X size={20} />
              </button>
            </div>
            <div className="p-12 flex flex-col items-center text-center">
              <div className="relative w-64 h-64 border-4 border-blue-100 dark:border-blue-900/30 rounded-[2rem] flex items-center justify-center overflow-hidden bg-slate-50 dark:bg-slate-800/50 mb-8 shadow-inner">
                <QrCode size={100} className="text-blue-50 dark:text-blue-900/20" />
                <div className="absolute w-full h-1.5 bg-blue-700 dark:bg-blue-500 shadow-[0_0_30px_rgba(29,78,216,1)] animate-[scan_2.5s_ease-in-out_infinite]"></div>
              </div>
              <p className="text-[11px] text-slate-400 dark:text-slate-500 font-black uppercase tracking-widest mb-10 leading-relaxed">
                Positionnez le code QR face à l'objectif
              </p>
              <button
                onClick={() => {
                  if (members.length > 0) handleSelect(members[0]);
                  setShowScanner(false);
                }}
                className="w-full bg-blue-700 hover:bg-blue-800 text-white py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] shadow-2xl shadow-blue-200 dark:shadow-blue-900/20 active:scale-95 transition-all"
              >
                Déclencher Détection
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .pvc-card-wrapper {
          width: 85.6mm;
          height: 53.98mm;
          background: white;
          border-radius: 3.18mm;
          overflow: hidden;
          flex-shrink: 0;
          user-select: none;
        }

        .pvc-card-content {
          width: 100%;
          height: 100%;
          position: relative;
          padding: 3.5mm 4.5mm;
          box-sizing: border-box;
        }

        @keyframes scan {
          0%, 100% { top: 5%; }
          50% { top: 95%; }
        }

        @media print {
          @page {
            size: 85.6mm 53.98mm;
            margin: 0;
          }
          
          body {
            background: white !important;
            margin: 0 !important;
          }

          .no-print {
            display: none !important;
          }

          .print-container {
            display: block !important;
            margin: 0 !important;
            padding: 0 !important;
          }

          .pvc-card-wrapper {
            box-shadow: none !important;
            border: none !important;
            page-break-after: always;
            margin: 0 !important;
            display: block !important;
          }
        }
      `}</style>
    </div>
  );
};

export default CardGeneratorApp;
