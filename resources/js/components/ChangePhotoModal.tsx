import React, { useState, useRef } from 'react';
import {
  Upload,
  Camera,
  Check,
  X,
  RotateCcw,
  AlertCircle,
  Image as ImageIcon,
} from 'lucide-react';
import {
  DEFAULT_PROFILE_PHOTO,
  useProfilePhoto,
} from '../utils/profilePhotoState';

interface ChangePhotoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ChangePhotoModal: React.FC<ChangePhotoModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { photo, updatePhoto, resetToDefault } = useProfilePhoto();
  const [selectedPhoto, setSelectedPhoto] = useState<string>(photo);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [successToast, setSuccessToast] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setUploadError('Harap pilih file gambar (JPG, PNG, atau WebP).');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setUploadError('Ukuran file maksimal 5MB.');
      return;
    }

    setUploadError(null);
    const reader = new FileReader();
    reader.onload = (event) => {
      if (typeof event.target?.result === 'string') {
        setSelectedPhoto(event.target.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    updatePhoto(selectedPhoto);
    setSuccessToast(true);
    setTimeout(() => {
      setSuccessToast(false);
      onClose();
    }, 600);
  };

  const handleReset = () => {
    setSelectedPhoto(DEFAULT_PROFILE_PHOTO);
    setUploadError(null);
  };

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-3 sm:p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="bg-white rounded-3xl w-full max-w-sm sm:max-w-md shadow-2xl border border-slate-100 overflow-hidden flex flex-col animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 sm:px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#1d6ee5] flex items-center justify-center shrink-0">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-[15px] font-bold text-slate-900 leading-tight">
                Ganti Foto Profil
              </h3>
              <p className="text-[11.5px] text-slate-400 mt-0.5">
                Unggah foto profil baru dari galeri perangkat
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors cursor-pointer shrink-0"
            aria-label="Tutup"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 space-y-4">
          {/* Main Avatar Preview */}
          <div className="flex flex-col items-center justify-center text-center">
            <div
              style={{ width: '100px', height: '100px' }}
              className="w-[100px] h-[100px] min-w-[100px] min-h-[100px] max-w-[100px] max-h-[100px] rounded-full ring-4 ring-blue-500/20 shadow-md overflow-hidden bg-slate-100 shrink-0 relative"
            >
              <img
                src={selectedPhoto}
                alt="Preview Foto Profil"
                width={100}
                height={100}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                className="w-full h-full object-cover block"
              />
            </div>

            <p className="text-xs font-semibold text-slate-700 mt-2.5">
              Foto Profil Baru
            </p>
            <p className="text-[11px] text-slate-400">
              Foto akan ditampilkan pada identitas akun
            </p>
          </div>

          {/* Hidden Native File Input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />

          {/* Upload Dropzone / Button Area */}
          <div
            onClick={() => fileInputRef.current?.click()}
            className="w-full border-2 border-dashed border-blue-200 hover:border-blue-400 bg-blue-50/40 hover:bg-blue-50/70 rounded-2xl p-4 text-center cursor-pointer transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-white shadow-2xs border border-blue-100 flex items-center justify-center text-[#1d6ee5] mx-auto mb-2 group-hover:scale-105 transition-transform">
              <Upload className="w-5 h-5" />
            </div>
            <p className="text-xs font-bold text-slate-800">
              Pilih Foto 
            </p>
            <p className="text-[11px] text-slate-400 mt-1">
              Maks. 5 MB
            </p>
          </div>

          {/* Error Message */}
          {uploadError && (
            <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-100 text-rose-600 text-xs flex items-center gap-2 font-medium">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{uploadError}</span>
            </div>
          )}

          {/* Reset Action */}
          {selectedPhoto !== DEFAULT_PROFILE_PHOTO && (
            <div className="flex justify-center pt-1">
              <button
                type="button"
                onClick={handleReset}
                className="text-xs font-semibold text-slate-400 hover:text-slate-600 flex items-center gap-1.5 cursor-pointer transition-colors">
              </button>
            </div>
          )}
        </div>

        {/* Footer with Balanced 2-Column Buttons */}
        <div className="px-5 sm:px-6 py-3.5 bg-slate-50 border-t border-slate-100 grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={onClose}
            className="w-full py-2.5 bg-white hover:bg-slate-100 active:scale-[0.99] text-slate-700 text-xs font-semibold rounded-xl border border-slate-200 transition-all cursor-pointer text-center"
          >
            Batal
          </button>

          <button
            type="button"
            onClick={handleSave}
            className="w-full py-2.5 bg-[#1d6ee5] hover:bg-[#1a5fca] active:scale-[0.99] text-white text-xs font-semibold rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer text-center"
          >
            
            <span>{successToast ? 'Tersimpan!' : 'Gunakan Foto Ini'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
