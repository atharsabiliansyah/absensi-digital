import React, { useState } from 'react';
import {
  Search,
  ChevronDown,
  Plus,
  Pencil,
  Trash2,
  ChevronLeft,
  ChevronRight,
  X,
  Check,
  CreditCard,
  Radio,
  Wifi,
} from 'lucide-react';

export interface SiswaRFIDItem {
  no: number;
  uid: string;
  nama: string;
  nis: string;
  kelas: string;
  jurusan: string;
  status: 'Aktif' | 'Nonaktif';
}

const INITIAL_SISWA_LIST: SiswaRFIDItem[] = [
  { no: 1, uid: 'A3 : 7F : 21 : 9B', nama: 'Isa', nis: '001234', kelas: 'XI TKJ', jurusan: 'TKJ', status: 'Aktif' },
  { no: 2, uid: 'B8 : 42 : 91 : CD', nama: 'Bador', nis: '001235', kelas: 'X AKL', jurusan: 'AKL', status: 'Aktif' },
  { no: 3, uid: 'C1 : 55 : 73 : AE', nama: 'Citra', nis: '001236', kelas: 'XI OTPK', jurusan: 'OTPK', status: 'Aktif' },
  { no: 4, uid: 'D4 : 92 : 11 : EF', nama: 'Dimas', nis: '001237', kelas: 'X BDP', jurusan: 'BDP', status: 'Aktif' },
  { no: 5, uid: '9A : 33 : 10 : BC', nama: 'Andi', nis: '001238', kelas: 'XI TKJ', jurusan: 'TKJ', status: 'Aktif' },
  { no: 6, uid: 'E2 : 18 : 44 : A9', nama: 'Raka', nis: '001239', kelas: 'X OTPK', jurusan: 'OTPK', status: 'Aktif' },
];

export const DataSiswaPageView: React.FC = () => {
  const [siswaList, setSiswaList] = useState<SiswaRFIDItem[]>(INITIAL_SISWA_LIST);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedJurusan, setSelectedJurusan] = useState<string>('Semua Jurusan');
  const [selectedStatus, setSelectedStatus] = useState<string>('Semua Status');
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Modals
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingItem, setEditingItem] = useState<SiswaRFIDItem | null>(null);
  const [deletingItem, setDeletingItem] = useState<SiswaRFIDItem | null>(null);

  // Form Fields
  const [formNis, setFormNis] = useState<string>('001239');
  const [formNama, setFormNama] = useState<string>('Raka');
  const [formKelas, setFormKelas] = useState<string>('X');
  const [formJurusan, setFormJurusan] = useState<string>('OTPK');
  const [formUid, setFormUid] = useState<string>('');
  const [formStatus, setFormStatus] = useState<'Aktif' | 'Nonaktif'>('Aktif');
  const [isReadingRfid, setIsReadingRfid] = useState<boolean>(false);

  // Notification Toast (Fixed Bottom Right matching Image 2)
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const triggerToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 4000);
  };

  // Filter Logic
  const filteredList = siswaList.filter((item) => {
    const matchSearch =
      item.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.nis.includes(searchTerm) ||
      item.uid.toLowerCase().includes(searchTerm.toLowerCase());
    const matchJurusan = selectedJurusan === 'Semua Jurusan' || item.jurusan === selectedJurusan;
    const matchStatus = selectedStatus === 'Semua Status' || item.status === selectedStatus;
    return matchSearch && matchJurusan && matchStatus;
  });

  // Open Add Modal
  const handleOpenAdd = () => {
    setEditingItem(null);
    setFormNis('001239');
    setFormNama('Raka');
    setFormKelas('X');
    setFormJurusan('OTPK');
    setFormUid('');
    setFormStatus('Aktif');
    setIsModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEdit = (item: SiswaRFIDItem) => {
    setEditingItem(item);
    setFormNis(item.nis);
    setFormNama(item.nama);
    // Parse 'X OTPK' into 'X' and 'OTPK'
    const parts = item.kelas.split(' ');
    setFormKelas(parts[0] || 'X');
    setFormJurusan(item.jurusan || 'OTPK');
    setFormUid(item.uid);
    setFormStatus(item.status);
    setIsModalOpen(true);
  };

  // Simulate RFID Reading
  const handleReadRfid = () => {
    setIsReadingRfid(true);
    setTimeout(() => {
      const hex = '0123456789ABCDEF';
      const seg = () => hex[Math.floor(Math.random() * 16)] + hex[Math.floor(Math.random() * 16)];
      const generated = `${seg()} : ${seg()} : ${seg()} : ${seg()}`;
      setFormUid(generated);
      setIsReadingRfid(false);
    }, 600);
  };

  // Save Add or Edit
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formNama || !formNis) return;

    const fullKelas = `${formKelas} ${formJurusan}`;
    const uidValue = formUid || 'E2 : 18 : 44 : A9';

    if (editingItem) {
      // Update existing item
      setSiswaList((prev) =>
        prev.map((s) =>
          s.no === editingItem.no
            ? {
                ...s,
                nis: formNis,
                nama: formNama,
                kelas: fullKelas,
                jurusan: formJurusan,
                uid: uidValue,
                status: formStatus,
              }
            : s
        )
      );
      setIsModalOpen(false);
      triggerToast(`Kelas ${formNama} Berhasil Diperbarui`);
    } else {
      // Add new item
      const newItem: SiswaRFIDItem = {
        no: siswaList.length + 1,
        uid: uidValue,
        nama: formNama,
        nis: formNis,
        kelas: fullKelas,
        jurusan: formJurusan,
        status: formStatus,
      };
      setSiswaList((prev) => [newItem, ...prev]);
      setIsModalOpen(false);
      triggerToast(`Kelas ${formNama} Berhasil Diperbarui`);
    }
  };

  // Confirm Delete
  const handleConfirmDelete = () => {
    if (!deletingItem) return;
    setSiswaList((prev) => prev.filter((s) => s.no !== deletingItem.no));
    triggerToast(`Data ${deletingItem.nama} Berhasil Dihapus`);
    setDeletingItem(null);
  };

  return (
    <div className="w-full space-y-6">
      {/* Toast Notification (Bottom-Right matching Image 2, above mobile navbar) */}
      {toastMsg && (
        <div className="fixed bottom-24 sm:bottom-6 right-3 sm:right-6 z-[80] animate-in slide-in-from-bottom-3 fade-in duration-200 select-none">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-100 flex items-center gap-3.5 pl-4 pr-5 py-3.5 min-w-[290px] sm:min-w-[320px] max-w-[420px] relative overflow-hidden">
            {/* Green Left Accent Pill */}
            <div className="w-1.5 h-8 bg-[#10b981] rounded-full shrink-0" />

            {/* Circular Green Checkmark Icon */}
            <div className="w-8 h-8 rounded-full bg-[#10b981]/15 flex items-center justify-center shrink-0">
              <div className="w-5 h-5 rounded-full bg-[#10b981] text-white flex items-center justify-center shadow-xs">
                <Check className="w-3.5 h-3.5 stroke-[3]" />
              </div>
            </div>

            {/* Notification Text */}
            <div className="flex-1 text-[13px] font-medium text-slate-700 font-sans">
              {toastMsg}
            </div>

            {/* Close Button */}
            <button
              onClick={() => setToastMsg(null)}
              className="text-slate-400 hover:text-slate-600 p-1 rounded-lg transition-colors cursor-pointer"
              aria-label="Tutup notifikasi"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Main Container Card (Matching screenshot styling exactly) */}
      <div className="bg-white rounded-[24px] shadow-xs border border-slate-200/80 overflow-hidden">
        {/* 1. Header Toolbar Filters */}
        <div className="p-5 sm:p-6 border-b border-slate-100/90 flex flex-wrap items-center justify-between gap-4">
          {/* Left: Search input */}
          <div className="flex-1 min-w-[240px] max-w-md relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Cari nama, NIS, atau UID..."
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-[13px] placeholder:text-slate-400 text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-sans"
            />
          </div>

          {/* Middle & Right Filters */}
          <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 w-full sm:w-auto">
            {/* Dropdown: Semua Jurusan */}
            <div className="relative flex-1 sm:flex-initial min-w-[130px]">
              <select
                value={selectedJurusan}
                onChange={(e) => setSelectedJurusan(e.target.value)}
                className="w-full appearance-none bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 pr-8 text-xs sm:text-[13px] text-slate-700 font-medium focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 cursor-pointer shadow-xs"
              >
                <option value="Semua Jurusan">Semua Jurusan</option>
                <option value="TKJ">TKJ</option>
                <option value="AKL">AKL</option>
                <option value="OTPK">OTPK</option>
                <option value="BDP">BDP</option>
              </select>
              <ChevronDown className="w-4 h-4 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* Dropdown: Semua Status */}
            <div className="relative flex-1 sm:flex-initial min-w-[130px]">
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full appearance-none bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 pr-8 text-xs sm:text-[13px] text-slate-700 font-medium focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 cursor-pointer shadow-xs"
              >
                <option value="Semua Status">Semua Status</option>
                <option value="Aktif">Aktif</option>
                <option value="Nonaktif">Nonaktif</option>
              </select>
              <ChevronDown className="w-4 h-4 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* Blue Button: Daftarkan RFID Baru */}
            <button
              onClick={handleOpenAdd}
              className="w-full sm:w-auto bg-[#2563eb] hover:bg-[#1d4ed8] text-white px-4.5 py-2.5 rounded-xl text-xs sm:text-[13px] font-semibold flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer hover:shadow-md shrink-0"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Daftarkan RFID Baru</span>
            </button>
          </div>
        </div>

        {/* 2. Main Data Table with Horizontal Scroll */}
        <div className="w-full overflow-x-auto scrollbar-thin">
          <table className="w-full text-left border-collapse min-w-[760px]">
            <thead>
              <tr className="border-b border-slate-100 text-[11px] sm:text-[11.5px] font-bold text-slate-600 tracking-wider">
                <th className="py-4 px-4 sm:px-6 w-14 font-bold whitespace-nowrap">NO</th>
                <th className="py-4 px-4 sm:px-6 font-bold whitespace-nowrap min-w-[170px]">UID RFID</th>
                <th className="py-4 px-4 sm:px-6 font-bold whitespace-nowrap min-w-[140px]">NAMA SISWA</th>
                <th className="py-4 px-4 sm:px-6 font-bold whitespace-nowrap min-w-[90px]">NIS</th>
                <th className="py-4 px-4 sm:px-6 font-bold whitespace-nowrap min-w-[100px]">KELAS</th>
                <th className="py-4 px-4 sm:px-6 font-bold whitespace-nowrap min-w-[90px]">JURUSAN</th>
                <th className="py-4 px-4 sm:px-6 font-bold text-center whitespace-nowrap min-w-[90px]">STATUS</th>
                <th className="py-4 px-4 sm:px-6 font-bold text-center whitespace-nowrap min-w-[80px]">AKSI</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100/80 text-[13px] sm:text-[13.5px]">
              {filteredList.slice(0, 5).map((row, idx) => (
                <tr key={row.no} className="hover:bg-slate-50/60 transition-colors">
                  {/* NO */}
                  <td className="py-4 px-4 sm:px-6 text-slate-600 font-medium whitespace-nowrap">
                    {idx + 1}
                  </td>

                  {/* UID RFID - whitespace-nowrap ensures hex bytes never wrap vertically */}
                  <td className="py-4 px-4 sm:px-6 font-mono font-bold text-slate-800 tracking-wider whitespace-nowrap">
                    {row.uid}
                  </td>

                  {/* NAMA SISWA */}
                  <td className="py-4 px-4 sm:px-6 font-medium text-slate-900 whitespace-nowrap">
                    {row.nama}
                  </td>

                  {/* NIS */}
                  <td className="py-4 px-4 sm:px-6 text-slate-600 font-mono whitespace-nowrap">
                    {row.nis}
                  </td>

                  {/* KELAS */}
                  <td className="py-4 px-4 sm:px-6 text-slate-700 font-medium whitespace-nowrap">
                    {row.kelas}
                  </td>

                  {/* JURUSAN */}
                  <td className="py-4 px-4 sm:px-6 text-slate-700 font-medium whitespace-nowrap">
                    {row.jurusan}
                  </td>

                  {/* STATUS */}
                  <td className="py-4 px-4 sm:px-6 text-center whitespace-nowrap">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200/80 shadow-2xs">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      <span>{row.status}</span>
                    </span>
                  </td>

                  {/* AKSI */}
                  <td className="py-4 px-4 sm:px-6 text-center whitespace-nowrap">
                    <div className="flex items-center justify-center gap-3">
                      {/* Edit Pencil Button */}
                      <button
                        onClick={() => handleOpenEdit(row)}
                        className="text-blue-500 hover:text-blue-700 p-1.5 rounded-lg hover:bg-blue-50 transition-colors cursor-pointer"
                        title={`Edit ${row.nama}`}
                      >
                        <Pencil className="w-4 h-4" />
                      </button>

                      {/* Delete Trash Button */}
                      <button
                        onClick={() => setDeletingItem(row)}
                        className="text-rose-400 hover:text-rose-600 p-1.5 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
                        title={`Hapus ${row.nama}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 3. Pagination Footer (Matching screenshot) */}
        <div className="p-4 sm:px-6 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
          {/* Left Text */}
          <div className="text-slate-500 font-medium">
            Menampilkan <span className="font-bold text-slate-800">1 - 5</span> dari <span className="font-bold text-slate-800">148</span> kartu RFID
          </div>

          {/* Right Pagination Controls */}
          <div className="flex items-center gap-1.5 self-end sm:self-auto">
            {/* Prev Button */}
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="w-8 h-8 flex items-center justify-center bg-white border border-slate-200 text-slate-400 rounded-lg text-xs hover:bg-slate-50 disabled:opacity-40 cursor-pointer"
              aria-label="Halaman Sebelumnya"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {/* Page 1 (Active) */}
            <button
              onClick={() => setCurrentPage(1)}
              className={`w-8 h-8 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                currentPage === 1
                  ? 'bg-[#2563eb] text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              1
            </button>

            {/* Page 2 */}
            <button
              onClick={() => setCurrentPage(2)}
              className={`w-8 h-8 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                currentPage === 2
                  ? 'bg-[#2563eb] text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              2
            </button>

            {/* Page 3 */}
            <button
              onClick={() => setCurrentPage(3)}
              className={`w-8 h-8 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                currentPage === 3
                  ? 'bg-[#2563eb] text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              3
            </button>

            {/* Ellipsis */}
            <span className="px-1 text-slate-400">...</span>

            {/* Page 30 */}
            <button
              onClick={() => setCurrentPage(30)}
              className={`w-8 h-8 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                currentPage === 30
                  ? 'bg-[#2563eb] text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              30
            </button>

            {/* Next Button */}
            <button
              disabled={currentPage === 30}
              onClick={() => setCurrentPage((p) => Math.min(30, p + 1))}
              className="w-8 h-8 flex items-center justify-center bg-white border border-slate-200 text-slate-400 rounded-lg text-xs hover:bg-slate-50 disabled:opacity-40 cursor-pointer"
              aria-label="Halaman Berikutnya"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* UNIFIED MODAL: TAMBAH & EDIT DATA SISWA (Matches Image 1 & Image 3) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-3 sm:p-5 bg-slate-950/65 backdrop-blur-xs animate-in fade-in duration-150 overflow-y-auto">
          <div className="bg-white rounded-2xl sm:rounded-3xl max-w-2xl w-full max-h-[88vh] sm:max-h-[90vh] shadow-2xl border border-slate-100 flex flex-col overflow-hidden my-auto animate-in zoom-in-95 duration-200">
            {/* Modal Header (Sticky at top) */}
            <div className="flex items-start justify-between px-5 py-4 sm:px-7 sm:py-5 border-b border-slate-100 shrink-0 bg-white">
              <div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-tight">
                  {editingItem ? 'Edit Data Siswa' : 'Tambah Data Siswa'}
                </h3>
                <p className="text-[11px] sm:text-xs text-slate-400 mt-0.5">
                  <span>Data &gt; </span>
                  <span className="text-[#2563eb] font-semibold">
                    {editingItem ? 'Edit Siswa' : 'Tambah Siswa'}
                  </span>
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg transition-colors cursor-pointer"
                aria-label="Tutup modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Scrollable Body */}
            <div className="overflow-y-auto p-5 sm:p-7 flex-1">
              <form id="student-form" onSubmit={handleSave}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
                  {/* Left Column: Form Inputs */}
                  <div className="space-y-3.5 sm:space-y-4">
                    {/* NIS */}
                    <div>
                      <label className="text-xs font-semibold text-slate-700 block mb-1.5">
                        NIS
                      </label>
                      <input
                        type="text"
                        required
                        value={formNis}
                        onChange={(e) => setFormNis(e.target.value)}
                        placeholder="001239"
                        className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-[13px] text-slate-800 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-sans"
                      />
                    </div>

                    {/* Nama Lengkap */}
                    <div>
                      <label className="text-xs font-semibold text-slate-700 block mb-1.5">
                        Nama Lengkap
                      </label>
                      <input
                        type="text"
                        required
                        value={formNama}
                        onChange={(e) => setFormNama(e.target.value)}
                        placeholder="Raka"
                        className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-[13px] text-slate-800 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-sans"
                      />
                    </div>

                    {/* Kelas & Jurusan Row */}
                    <div className="grid grid-cols-2 gap-3">
                      {/* Kelas */}
                      <div>
                        <label className="text-xs font-semibold text-slate-700 block mb-1.5">
                          Kelas
                        </label>
                        <div className="relative">
                          <select
                            value={formKelas}
                            onChange={(e) => setFormKelas(e.target.value)}
                            className="w-full appearance-none px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-[13px] text-slate-700 font-medium focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 cursor-pointer pr-8"
                          >
                            <option value="X">X</option>
                            <option value="XI">XI</option>
                            <option value="XII">XII</option>
                          </select>
                          <ChevronDown className="w-4 h-4 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                        </div>
                      </div>

                      {/* Jurusan */}
                      <div>
                        <label className="text-xs font-semibold text-slate-700 block mb-1.5">
                          Jurusan
                        </label>
                        <div className="relative">
                          <select
                            value={formJurusan}
                            onChange={(e) => setFormJurusan(e.target.value)}
                            className="w-full appearance-none px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-[13px] text-slate-700 font-medium focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 cursor-pointer pr-8"
                          >
                            <option value="OTPK">OTPK</option>
                            <option value="TKJ">TKJ</option>
                            <option value="AKL">AKL</option>
                            <option value="BDP">BDP</option>
                          </select>
                          <ChevronDown className="w-4 h-4 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                        </div>
                      </div>
                    </div>

                    {/* UID RFID */}
                    <div>
                      <label className="text-xs font-semibold text-slate-700 block mb-1.5">
                        UID RFID
                      </label>
                      <div className="flex gap-2 items-center">
                        <input
                          type="text"
                          value={formUid}
                          onChange={(e) => setFormUid(e.target.value)}
                          placeholder="Tap kartu atau masukkan UID"
                          className="min-w-0 flex-1 px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-mono font-bold tracking-wider text-slate-800 placeholder:text-slate-400 placeholder:font-normal placeholder:font-sans focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                        />
                        <button
                          type="button"
                          onClick={handleReadRfid}
                          disabled={isReadingRfid}
                          className="bg-[#2563eb] hover:bg-[#1d4ed8] text-white px-3 sm:px-3.5 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer hover:shadow-md shrink-0 whitespace-nowrap disabled:opacity-75"
                        >
                          <Radio className={`w-3.5 h-3.5 shrink-0 ${isReadingRfid ? 'animate-pulse text-amber-300' : ''}`} />
                          <span>{isReadingRfid ? 'Membaca...' : 'Baca RFID'}</span>
                        </button>
                      </div>
                    </div>

                    {/* Status */}
                    <div>
                      <label className="text-xs font-semibold text-slate-700 block mb-1.5">
                        Status
                      </label>
                      <div className="relative">
                        <select
                          value={formStatus}
                          onChange={(e) => setFormStatus(e.target.value as 'Aktif' | 'Nonaktif')}
                          className="w-full appearance-none px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-[13px] text-slate-700 font-medium focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 cursor-pointer pr-8"
                        >
                          <option value="Aktif">Aktif</option>
                          <option value="Nonaktif">Nonaktif</option>
                        </select>
                        <ChevronDown className="w-4 h-4 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      </div>
                    </div>
                  </div>

                  {/* Right Column: INFORMASI & Visual RFID Illustration (Image 3) */}
                  <div className="border border-slate-200/80 rounded-2xl p-4 sm:p-4.5 bg-white flex flex-col justify-between">
                    <div>
                      {/* Header with signal waves icon */}
                      <div className="flex items-center gap-1.5 mb-1.5 text-[#2563eb]">
                        <Radio className="w-4 h-4" />
                        <span className="text-[11px] font-bold tracking-wider text-slate-900 uppercase">
                          INFORMASI
                        </span>
                      </div>

                      <p className="text-xs text-slate-500 leading-relaxed">
                        Tempelkan kartu RFID pada reader untuk membaca UID secara otomatis.
                      </p>

                      {/* Illustration Container */}
                      <div className="mt-3 sm:mt-4 p-4 sm:p-5 bg-[#f8fafc] border border-slate-100 rounded-2xl flex items-center justify-center relative min-h-[150px] sm:min-h-[170px] overflow-hidden select-none">
                        {/* Dark RFID Reader Unit */}
                        <div className="w-22 sm:w-24 h-28 sm:h-32 bg-[#1e293b] rounded-xl flex flex-col items-center justify-between p-3 sm:p-3.5 shadow-lg relative border border-slate-700/80 z-10">
                          {/* Glowing Blue LED Sensor */}
                          <div
                            className={`w-2.5 h-2.5 rounded-full ${
                              isReadingRfid
                                ? 'bg-amber-400 shadow-[0_0_12px_#fbbf24] animate-ping'
                                : 'bg-blue-500 shadow-[0_0_8px_#3b82f6] animate-pulse'
                            }`}
                          />

                          {/* Reader Icon and Label */}
                          <div className="text-slate-400 flex flex-col items-center gap-1.5">
                            <CreditCard className="w-5 sm:w-6 h-5 sm:h-6 stroke-[1.8]" />
                            <span className="text-[7.5px] font-bold text-slate-400 tracking-wider">
                              RFID READER
                            </span>
                          </div>

                          {/* Bottom line */}
                          <div className="w-7 h-1 bg-slate-700 rounded-full" />
                        </div>

                        {/* Blue Student Card (KARTU SISWA) */}
                        <div
                          onClick={handleReadRfid}
                          title="Klik untuk simulasi tempel kartu"
                          className={`absolute z-20 cursor-pointer transform -rotate-12 translate-x-8 translate-y-3 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-lg shadow-xl px-2.5 sm:px-3 py-1.5 sm:py-2 flex items-center gap-1.5 border border-white/20 transition-all duration-300 ${
                            isReadingRfid ? 'scale-110 -translate-x-2' : 'hover:scale-105'
                          }`}
                        >
                          <Wifi className="w-3.5 h-3.5 rotate-90" />
                          <span className="text-[9px] sm:text-[9.5px] font-bold tracking-wider whitespace-nowrap">
                            KARTU SISWA
                          </span>
                        </div>

                        {/* Ripple waves when tapping */}
                        {isReadingRfid && (
                          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <div className="w-32 h-32 rounded-full border-2 border-blue-400/40 animate-ping" />
                          </div>
                        )}
                      </div>
                    </div>

                    <p className="text-[11px] text-slate-400 text-center mt-3">
                      {isReadingRfid
                        ? '⚡ Membaca data UID kartu...'
                        : formUid
                        ? `UID Terdeteksi: ${formUid}`
                        : 'Menunggu kartu ditempelkan...'}
                    </p>
                  </div>
                </div>
              </form>
            </div>

            {/* Modal Footer (Sticky at bottom) */}
            <div className="flex items-center justify-end gap-3 px-5 py-3.5 sm:px-7 sm:py-4 border-t border-slate-100 shrink-0 bg-slate-50/80">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-5 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
              >
                Batal
              </button>
              <button
                type="submit"
                form="student-form"
                className="px-6 py-2.5 bg-[#2563eb] hover:bg-blue-700 text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer shadow-xs hover:shadow-md"
              >
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: DELETE CONFIRMATION */}
      {deletingItem && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-slate-950/65 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-100 text-center">
            <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-3">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Hapus Kartu RFID?</h3>
            <p className="text-xs text-slate-500 mt-1">
              Apakah Anda yakin ingin menghapus data siswa <span className="font-bold text-slate-800">{deletingItem.nama}</span> (UID: {deletingItem.uid})?
            </p>
            <div className="flex gap-2.5 mt-5">
              <button
                onClick={() => setDeletingItem(null)}
                className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition-colors cursor-pointer"
              >
                Batal
              </button>
              <button
                onClick={handleConfirmDelete}
                className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs rounded-xl transition-colors cursor-pointer shadow-xs"
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
