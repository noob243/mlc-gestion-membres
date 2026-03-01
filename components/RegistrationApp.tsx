
import React, { useState, useRef, useEffect } from 'react';
import { Member } from '../types';
import { QRCodeSVG } from 'qrcode.react';
import { UserPlus, Download, User, RotateCcw, ShieldCheck, Copy, ScanLine, IdCard } from 'lucide-react';

interface RegistrationAppProps {
  onAddMember: (member: Member) => void;
}

const RegistrationApp: React.FC<RegistrationAppProps> = ({ onAddMember }) => {
  const [formData, setFormData] = useState({
    lastName: '',
    postName: '',
    firstName: '',
    sexe: 'M',
    birthDate: '',
    country: 'RD Congo',
    cityProvince: '',
    category: 'Combattant',
    federation: '',
    phone: '',
    email: '',
  });

  const [photo, setPhoto] = useState<string | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [lastRegistered, setLastRegistered] = useState<Member | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pendingId, setPendingId] = useState('');

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const qrRef = useRef<HTMLDivElement>(null);

  // Génération sécurisée de l'ID au montage et après chaque succès
  const generateNewId = () => {
    const year = new Date().getFullYear();
    const random = Math.floor(100000 + Math.random() * 899999);
    return `MLC-${year}-${random}`;
  };

  useEffect(() => {
    setPendingId(generateNewId());
  }, []);

  const downloadQRCode = () => {
    const wrapper = qrRef.current;
    if (!wrapper) return;
    const svg = wrapper.querySelector('svg');
    if (!svg) return;
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx?.drawImage(img, 0, 0);
      const pngFile = canvas.toDataURL("image/png");
      const downloadLink = document.createElement("a");
      downloadLink.download = `QR_${lastRegistered?.id}.png`;
      downloadLink.href = pngFile;
      downloadLink.click();
    };
    img.src = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgData)));
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 720 } }
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsCameraActive(true);
      }
    } catch (err) {
      alert("Impossible d'accéder à la caméra.");
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
      setIsCameraActive(false);
    }
  };

  const processImage = (imageElement: HTMLImageElement | HTMLVideoElement) => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      if (context) {
        canvas.width = 600;
        canvas.height = 800;
        let sw, sh, sx, sy;
        if (imageElement instanceof HTMLVideoElement) {
          sw = imageElement.videoWidth; sh = imageElement.videoHeight;
        } else {
          sw = imageElement.width; sh = imageElement.height;
        }
        const aspect = canvas.width / canvas.height;
        if (sw / sh > aspect) {
          const nsw = sh * aspect; sx = (sw - nsw) / 2; sw = nsw; sy = 0;
        } else {
          const nsh = sw / aspect; sy = (sh - nsh) / 2; sh = nsh; sx = 0;
        }
        context.clearRect(0, 0, canvas.width, canvas.height);
        if (imageElement instanceof HTMLVideoElement) {
          context.translate(canvas.width, 0); context.scale(-1, 1);
        }
        context.drawImage(imageElement, sx, sy, sw, sh, 0, 0, canvas.width, canvas.height);
        if (imageElement instanceof HTMLVideoElement) context.setTransform(1, 0, 0, 1, 0, 0);
        setPhoto(canvas.toDataURL('image/jpeg', 0.9));
        if (imageElement instanceof HTMLVideoElement) stopCamera();
      }
    }
  };

  const takePhoto = () => videoRef.current && processImage(videoRef.current);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const img = new Image();
        img.onload = () => processImage(img);
        img.src = ev.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!photo) { alert("Photo requise."); return; }

    setIsSubmitting(true);

    // On crée l'objet membre immédiatement
    const memberData: Member = {
      ...formData,
      id: pendingId,
      registrationDate: new Date().toISOString(),
      photoUrl: photo
    };

    // Délai artificiel pour le feedback visuel (UX)
    setTimeout(() => {
      try {
        onAddMember(memberData);
        setLastRegistered(memberData);

        // Reset propre du formulaire
        setFormData({
          lastName: '', postName: '', firstName: '', sexe: 'M', birthDate: '',
          country: 'RD Congo', cityProvince: '', category: 'Combattant',
          federation: '', phone: '', email: ''
        });
        setPhoto(null);
        setPendingId(generateNewId());
      } catch (error) {
        console.error("Erreur lors de l'enregistrement:", error);
      } finally {
        setIsSubmitting(false);
      }
    }, 600);
  };

  return (
    <div className="max-w-6xl mx-auto pb-12">
      <div className="grid lg:grid-cols-2 gap-10">
        <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] shadow-xl border border-slate-100 dark:border-slate-800 transition-colors duration-300">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="bg-blue-700 p-3 rounded-2xl text-white shadow-lg"><UserPlus size={28} /></div>
              <div>
                <h2 className="text-2xl font-black text-slate-800 dark:text-slate-100 uppercase tracking-tighter">Enrôlement</h2>
                <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">MLC Biométrie</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">ID Prévu</p>
              <div className="bg-slate-900 dark:bg-slate-800 text-white px-3 py-1 rounded-lg font-mono text-xs font-bold">
                {pendingId || "CHARGEMENT..."}
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative group mb-8">
              <div className="relative aspect-[3/4] max-w-[180px] mx-auto">
                <div className="w-full h-full bg-slate-50 dark:bg-slate-800 rounded-[2rem] overflow-hidden border-4 border-white dark:border-slate-700 shadow-2xl flex items-center justify-center relative transition-colors">
                  {photo ? (
                    <div className="w-full h-full animate-in fade-in">
                      <img src={photo} className="w-full h-full object-cover" alt="Portrait" />
                      <button
                        type="button"
                        onClick={() => { setPhoto(null); startCamera(); }}
                        className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white dark:bg-slate-700 text-blue-700 dark:text-blue-400 px-4 py-2 rounded-xl shadow-xl transition-all hover:scale-105 active:scale-95 flex items-center gap-2 border border-blue-100 dark:border-blue-900/30 z-30"
                      >
                        <RotateCcw size={14} />
                        <span className="text-[10px] font-black uppercase tracking-widest">Recommencer</span>
                      </button>
                    </div>
                  ) : isCameraActive ? (
                    <div className="w-full h-full bg-black relative">
                      <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover scale-x-[-1]" />
                      <button type="button" onClick={takePhoto} className="absolute bottom-4 left-1/2 -translate-x-1/2 w-12 h-12 bg-white dark:bg-slate-200 rounded-full p-1 border-4 border-white dark:border-slate-700 shadow-2xl transition-transform active:scale-90"><div className="w-full h-full bg-blue-700 rounded-full" /></button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-3">
                      <User size={40} className="text-slate-200 dark:text-slate-700" />
                      <div className="flex flex-col gap-2">
                        <button type="button" onClick={startCamera} className="bg-blue-700 text-white px-4 py-2 rounded-xl font-bold text-[10px] uppercase tracking-wider transition-all hover:bg-blue-800">Caméra</button>
                        <button type="button" onClick={() => fileInputRef.current?.click()} className="bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-600 px-4 py-2 rounded-xl font-bold text-[10px] uppercase tracking-wider hover:bg-slate-50 dark:hover:bg-slate-600">Importer</button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept="image/*" className="hidden" />
              <canvas ref={canvasRef} className="hidden" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Nom</label>
                <input required type="text" value={formData.lastName} onChange={e => setFormData({ ...formData, lastName: e.target.value.toUpperCase() })} className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none font-bold text-slate-900 dark:text-slate-100 focus:border-blue-700 dark:focus:border-blue-500 transition-colors" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Postnom</label>
                <input required type="text" value={formData.postName} onChange={e => setFormData({ ...formData, postName: e.target.value.toUpperCase() })} className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none font-bold text-slate-900 dark:text-slate-100 focus:border-blue-700 dark:focus:border-blue-500 transition-colors" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Prénom</label>
                <input required type="text" value={formData.firstName} onChange={e => setFormData({ ...formData, firstName: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none font-bold text-slate-900 dark:text-slate-100 focus:border-blue-700 dark:focus:border-blue-500 transition-colors" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Sexe</label>
                <select value={formData.sexe} onChange={e => setFormData({ ...formData, sexe: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none font-bold text-slate-900 dark:text-slate-100 focus:border-blue-700 dark:focus:border-blue-500 transition-colors">
                  <option value="M">Masculin (M)</option>
                  <option value="F">Féminin (F)</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Date de Naissance</label>
                <input required type="date" value={formData.birthDate} onChange={e => setFormData({ ...formData, birthDate: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none font-bold text-slate-900 dark:text-slate-100 focus:border-blue-700 dark:focus:border-blue-500 transition-colors" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Catégorie</label>
                <select value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none font-bold text-slate-900 dark:text-slate-100 focus:border-blue-700 dark:focus:border-blue-500 transition-colors">
                  <option value="Combattant">Combattant</option>
                  <option value="Cadre">Cadre</option>
                  <option value="Sympathisant">Sympathisant</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Pays de Résidence</label>
                <input required type="text" value={formData.country} onChange={e => setFormData({ ...formData, country: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none font-bold text-slate-900 dark:text-slate-100 focus:border-blue-700 dark:focus:border-blue-500 transition-colors" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Ville ou Province</label>
                <input required type="text" value={formData.cityProvince} onChange={e => setFormData({ ...formData, cityProvince: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none font-bold text-slate-900 dark:text-slate-100 focus:border-blue-700 dark:focus:border-blue-500 transition-colors" />
              </div>
              <div className="space-y-1 md:col-span-2">
                <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Fédération</label>
                <input required placeholder="Ex: Kinshasa / Mont-Amba" type="text" value={formData.federation} onChange={e => setFormData({ ...formData, federation: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none font-bold text-slate-900 dark:text-slate-100 focus:border-blue-700 dark:focus:border-blue-500 transition-colors" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Téléphone</label>
                <input required type="tel" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none font-bold text-slate-900 dark:text-slate-100 focus:border-blue-700 dark:focus:border-blue-500 transition-colors" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">E-mail</label>
                <input type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none font-bold text-slate-900 dark:text-slate-100 focus:border-blue-700 dark:focus:border-blue-500 transition-colors" />
              </div>
            </div>

            <button disabled={isSubmitting || !photo} type="submit" className="w-full bg-blue-700 hover:bg-blue-800 disabled:bg-slate-100 dark:disabled:bg-slate-800 text-white font-black py-4 rounded-2xl shadow-xl transition-all uppercase tracking-[0.2em] text-xs flex items-center justify-center gap-3 active:scale-[0.98]">
              {isSubmitting ? <RotateCcw className="animate-spin" /> : 'Valider l\'enrôlement'}
            </button>
          </form>
        </div>

        <div className="space-y-6">
          {lastRegistered ? (
            <div className="animate-in slide-in-from-right duration-500">
              <div className="bg-slate-900 dark:bg-black rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden mb-6 border-b-4 border-yellow-500">
                <div className="relative z-10 flex flex-col items-center">
                  <div className="bg-yellow-500/20 text-yellow-400 px-4 py-1.5 rounded-full flex items-center gap-2 mb-6">
                    <ScanLine size={16} className="animate-pulse" />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em]">Scanner pour carte PVC</span>
                  </div>

                  <div className="bg-white p-6 rounded-[2rem] shadow-[0_0_50px_rgba(255,255,255,0.1)]" ref={qrRef}>
                    <QRCodeSVG
                      value={lastRegistered.id}
                      size={200}
                      level="H"
                      includeMargin={false}
                    />
                  </div>

                  <div className="mt-8 text-center">
                    <p className="text-white font-black text-xl tracking-widest font-mono mb-2">{lastRegistered.id}</p>
                    <div className="flex flex-wrap items-center justify-center gap-3">
                      <button onClick={() => navigator.clipboard.writeText(lastRegistered.id)} className="bg-white/10 hover:bg-white/20 text-white/70 px-4 py-2 rounded-xl text-[10px] font-bold uppercase flex items-center gap-2 transition-all"><Copy size={12} /> Copier</button>
                      <button onClick={downloadQRCode} className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl text-[10px] font-bold uppercase flex items-center gap-2 transition-all shadow-lg"><Download size={12} /> Télécharger QR</button>
                      <button onClick={() => window.print()} className="bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded-xl text-[10px] font-bold uppercase flex items-center gap-2 transition-all shadow-lg"><IdCard size={12} /> Reçu</button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] shadow-lg border border-slate-100 dark:border-slate-800 flex items-center gap-5 transition-colors">
                <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-slate-100 dark:border-slate-800 flex-shrink-0">
                  <img src={lastRegistered.photoUrl} className="w-full h-full object-cover" alt="Portrait" />
                </div>
                <div className="flex-1">
                  <h4 className="font-black text-slate-800 dark:text-slate-100 uppercase text-sm leading-tight">{lastRegistered.firstName} {lastRegistered.lastName}</h4>
                  <p className="text-xs text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider mt-1">{lastRegistered.federation}</p>
                </div>
                <button onClick={() => setLastRegistered(null)} className="p-3 bg-slate-50 dark:bg-slate-800 text-slate-400 dark:text-slate-500 hover:text-blue-700 dark:hover:text-blue-400 rounded-2xl transition-all"><RotateCcw size={20} /></button>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center p-12 bg-white/50 dark:bg-slate-900/50 rounded-[2.5rem] border-2 border-dashed border-slate-200 dark:border-slate-800 min-h-[400px] transition-colors">
              <ShieldCheck size={40} className="text-slate-100 dark:text-slate-800 mb-6" />
              <h3 className="text-lg font-black text-slate-400 dark:text-slate-600 uppercase tracking-tighter">En attente de capture</h3>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RegistrationApp;
