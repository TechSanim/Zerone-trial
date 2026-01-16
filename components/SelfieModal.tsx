
import React, { useState, useRef, useEffect } from 'react';
import { BingoCell, User } from '../types';
import { Camera, X, Scan, CheckCircle, AlertCircle, Upload, Zap } from 'lucide-react';
import { StorageService } from '../services/storage';

interface SelfieModalProps {
  cell: BingoCell;
  currentUser: User;
  onClose: () => void;
  onComplete: (partnerId: string, selfieUrl: string) => void;
}

const SelfieModal: React.FC<SelfieModalProps> = ({ cell, currentUser, onClose, onComplete }) => {
  const [partnerId, setPartnerId] = useState('');
  const [selfie, setSelfie] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [isCapturing, setIsCapturing] = useState(false);
  const [isScanningQR, setIsScanningQR] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const startCamera = async (forScan = false) => {
    try {
      setError('');
      if (forScan) setIsScanningQR(true);
      else setIsCapturing(true);
      
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: forScan ? 'environment' : 'user' } 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      setError('Could not access camera. Please check permissions.');
      setIsCapturing(false);
      setIsScanningQR(false);
    }
  };

  const takePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const data = canvas.toDataURL('image/jpeg');
        setSelfie(data);
        stopCamera();
      }
    }
  };

  const simulateQRScan = () => {
    // In a real production app, we would use a library like jsQR or html5-qrcode
    // to detect a QR code in the video stream. For this demo, we simulate
    // finding a random registered user after a short delay.
    setTimeout(() => {
      const users = StorageService.getUsers().filter(u => u.id !== currentUser.id && u.role === 'participant');
      if (users.length > 0) {
        const randomUser = users[Math.floor(Math.random() * users.length)];
        setPartnerId(randomUser.id);
        setIsScanningQR(false);
        stopCamera();
      } else {
        setError('No other participants found to simulate a scan.');
        setIsScanningQR(false);
        stopCamera();
      }
    }, 2000);
  };

  useEffect(() => {
    if (isScanningQR) {
      simulateQRScan();
    }
  }, [isScanningQR]);

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
    }
    setIsCapturing(false);
    setIsScanningQR(false);
  };

  const validateAndSubmit = () => {
    setError('');
    const users = StorageService.getUsers();
    const cleanId = partnerId.trim().toUpperCase();
    const partner = users.find(u => u.id === cleanId);

    if (!partner) {
      setError('Invalid participant code. Ask them for their unique ID!');
      return;
    }

    if (partner.id === currentUser.id) {
      setError("You can't snap a selfie with yourself!");
      return;
    }

    if (!selfie) {
      setError('Please take or upload a selfie first.');
      return;
    }

    onComplete(cleanId, selfie);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelfie(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-3xl w-full max-w-md relative my-8 shadow-2xl animate-in slide-in-from-bottom-4 duration-300">
        <button onClick={() => { stopCamera(); onClose(); }} className="absolute right-4 top-4 p-2 text-slate-400 hover:text-slate-600 z-10">
          <X className="w-6 h-6" />
        </button>

        <div className="p-6 sm:p-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white text-2xl font-black shadow-lg shadow-indigo-100">
              {cell.letter}
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-800">Challenge: {cell.letter}</h3>
              <p className="text-slate-500 text-sm">Upload proof of meeting a partner</p>
            </div>
          </div>

          <div className="space-y-6">
            {/* Camera Area */}
            <div className="aspect-[4/3] bg-slate-100 rounded-2xl overflow-hidden relative border-2 border-dashed border-slate-200 group">
              {selfie ? (
                <img src={selfie} className="w-full h-full object-cover" alt="Selfie" />
              ) : (isCapturing || isScanningQR) ? (
                <div className="relative w-full h-full bg-black">
                  <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
                  {isScanningQR && (
                    <>
                      <div className="scan-line" />
                      <div className="absolute inset-0 border-[40px] border-black/40 pointer-events-none" />
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white text-xs font-bold uppercase tracking-widest bg-indigo-600 px-3 py-1 rounded-full animate-pulse">
                        Scanning...
                      </div>
                    </>
                  )}
                  {isCapturing && (
                    <button 
                      onClick={takePhoto}
                      className="absolute bottom-6 left-1/2 -translate-x-1/2 w-16 h-16 bg-white rounded-full border-4 border-indigo-600 shadow-2xl flex items-center justify-center active:scale-90 transition-transform z-20"
                    >
                      <div className="w-12 h-12 bg-indigo-600 rounded-full" />
                    </button>
                  )}
                  <button 
                    onClick={stopCamera}
                    className="absolute top-4 left-4 bg-white/20 hover:bg-white/40 text-white p-2 rounded-full backdrop-blur-md transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-slate-400 gap-4 p-6">
                  <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center text-indigo-600">
                    <Camera className="w-8 h-8" />
                  </div>
                  <div className="flex flex-col gap-3 w-full">
                    <button onClick={() => startCamera(false)} className="w-full bg-white text-slate-700 font-bold py-3 rounded-xl shadow-sm border border-slate-200 hover:bg-slate-50 transition-colors">
                      Take Selfie
                    </button>
                    <label className="w-full bg-indigo-50 text-indigo-700 font-bold py-3 rounded-xl shadow-sm text-center cursor-pointer hover:bg-indigo-100 transition-colors">
                      Upload from Gallery
                      <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                    </label>
                  </div>
                </div>
              )}
              {selfie && (
                <button 
                  onClick={() => setSelfie(null)}
                  className="absolute top-4 right-4 bg-black/60 text-white p-2 rounded-full hover:bg-black transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Partner Info */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Partner's Code</label>
                <div className="flex gap-2">
                  <div className="relative flex-grow">
                    <input
                      type="text"
                      value={partnerId}
                      onChange={e => setPartnerId(e.target.value)}
                      className="w-full pl-4 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none uppercase font-mono font-bold text-indigo-700"
                      placeholder="USER-XXXXX"
                    />
                  </div>
                  <button 
                    onClick={() => startCamera(true)}
                    className="p-3 bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-colors shadow-lg shadow-slate-200 flex items-center justify-center"
                    title="Scan QR Code"
                  >
                    <Scan className="w-6 h-6" />
                  </button>
                </div>
              </div>

              {error && (
                <div className="flex items-center gap-3 text-red-600 bg-red-50 p-4 rounded-xl text-sm border border-red-100 animate-in fade-in slide-in-from-top-1">
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  <p className="font-semibold">{error}</p>
                </div>
              )}

              <button
                onClick={validateAndSubmit}
                disabled={!selfie || !partnerId}
                className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl shadow-xl shadow-indigo-100 transition-all flex items-center justify-center gap-2 transform active:scale-95"
              >
                Complete Challenge
                <CheckCircle className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};

export default SelfieModal;
