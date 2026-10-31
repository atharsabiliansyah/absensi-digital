import React, { useState, useEffect } from "react";
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
    Radio,
} from "lucide-react";

export const DataSiswaPageView: React.FC = () => {
    const [siswaList, setSiswaList] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    const [searchTerm, setSearchTerm] = useState<string>("");
    const [selectedJurusan, setSelectedJurusan] =
        useState<string>("Semua Jurusan");
    const [selectedStatus, setSelectedStatus] =
        useState<string>("Semua Status");

    const [currentPage, setCurrentPage] = useState<number>(1);
    const itemsPerPage = 5;

    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [deletingItem, setDeletingItem] = useState<any | null>(null);

    const [formNis, setFormNis] = useState<string>("");
    const [formNama, setFormNama] = useState<string>("");
    const [formKelas, setFormKelas] = useState<string>("X");
    const [formJurusan, setFormJurusan] = useState<string>("TKJ");
    const [formUid, setFormUid] = useState<string>("");
    const [formStatus, setFormStatus] = useState<"Aktif" | "Nonaktif">("Aktif");
    const [isReadingRfid, setIsReadingRfid] = useState<boolean>(false);

    const [toastMsg, setToastMsg] = useState<string | null>(null);
    const triggerToast = (msg: string) => {
        setToastMsg(msg);
        setTimeout(() => setToastMsg(null), 4000);
    };

    const formatUidDisplay = (uid: string) => {
        if (!uid) return "-";
        const clean = uid.replace(/[^a-fA-F0-9]/g, "").toUpperCase();
        return clean.match(/.{1,2}/g)?.join(" : ") || uid;
    };

    const fetchSiswa = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams({
                search: searchTerm,
                jurusan: selectedJurusan,
                status: selectedStatus,
            });

            const res = await fetch(`/api/siswa-list?${params.toString()}`);
            if (res.ok) {
                const result = await res.json();
                setSiswaList(result.data || []);
            }
        } catch (err) {
            console.error("Gagal mengambil data siswa:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSiswa();
        setCurrentPage(1);
    }, [searchTerm, selectedJurusan, selectedStatus]);

    const totalSiswa = siswaList.length;
    const totalPages = Math.ceil(totalSiswa / itemsPerPage) || 1;
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentSiswaData = siswaList.slice(startIndex, endIndex);

    const handleOpenAdd = () => {
        setEditingId(null);
        setFormNis("");
        setFormNama("");
        setFormKelas("X");
        setFormJurusan("TKJ");
        setFormUid("");
        setFormStatus("Aktif");
        setIsModalOpen(true);
    };

    const handleOpenEdit = (item: any) => {
        setEditingId(item.id);
        setFormNis(item.nisn || "");
        setFormNama(item.nama_siswa || "");
        const parts = (item.kelas?.nama_kelas || "").split(" ");
        setFormKelas(parts[0] || "X");
        setFormJurusan(item.kelas?.jurusan || "TKJ");
        setFormUid(formatUidDisplay(item.rfid_uid));
        setFormStatus(item.status || "Aktif");
        setIsModalOpen(true);
    };

    const handleReadRfid = async () => {
        setIsReadingRfid(true);
        try {
            const res = await fetch("/api/get-last-rfid");
            if (res.ok) {
                const data = await res.json();
                if (data.rfid_uid) {
                    setFormUid(formatUidDisplay(data.rfid_uid));
                    triggerToast(`UID RFID ${data.rfid_uid} Berhasil Dibaca`);
                } else {
                    alert(
                        "Belum ada kartu di tap ke alat ESP! Tempelkan kartu fisik ke alat terlebih dahulu",
                    );
                }
            }
        } catch (err) {
            console.error("Gagal membaca RFID:", err);
        } finally {
            setIsReadingRfid(false);
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formNama || !formNis || !formUid) {
            alert("Harap lengkapi NIS, Nama Siswa, dan UID RFID!");
            return;
        }

        try {
            const url = editingId
            ? `/api/siswa-update/${editingId}` 
            : "/api/siswa-store";

            const method = editingId ? "PUT" : "POST";

            const res = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                    "X-CSRF-TOKEN":
                        (
                            document.querySelector(
                                'meta[name="csrf-token"]'
                            ) as HTMLMetaElement
                        )?.content || "",
                },
                body: JSON.stringify({
                    nisn: formNis,
                    nama_siswa: formNama,
                    kelas: formKelas,
                    jurusan: formJurusan,
                    rfid_uid: formUid, 
                    status: formStatus,
                }),
            });
            

            const resData = await res.json();

            if (res.ok) {
                setIsModalOpen(false);
                fetchSiswa();
                triggerToast(
                    editingId
                        ? `Data ${formNama} Berhasil Diperbarui`
                        : `Siswa ${formNama} Berhasil Ditambahkan`,
                );
            } else {
                alert(resData.message || "Gagal menyimpan data siswa!");
            }
        } catch (err) {
            console.error("Error saving student:", err);
        }
    };

    const handleConfirmDelete = async () => {
        if (!deletingItem) return;

        try {
            const res = await fetch(`/api/siswa-delete/${deletingItem.id}`, {
                method: "DELETE",
                headers: {
                    "X-CSRF-TOKEN":
                        (
                            document.querySelector(
                                'meta[name="csrf-token"]',
                            ) as any
                        )?.content || "",
                },
            });

            if (res.ok) {
                fetchSiswa();
                triggerToast(
                    `Data ${deletingItem.nama_siswa} Berhasil Dihapus`,
                );
                setDeletingItem(null);
            } else {
                alert("Gagal menghapus data siswa!");
            }
        } catch (err) {
            console.error("Gagal menghapus siswa:", err);
        }
    };

    return (
        <div className="w-full space-y-6">
            {toastMsg && (
                <div className="fixed bottom-24 sm:bottom-6 right-3 sm:right-6 z-[80] animate-in slide-in-from-bottom-3 fade-in duration-200 select-none">
                    <div className="bg-white rounded-2xl shadow-2xl border border-slate-100 flex items-center gap-3.5 pl-4 pr-5 py-3.5 min-w-[290px] sm:min-w-[320px] max-w-[420px] relative overflow-hidden">
                        <div className="w-1.5 h-8 bg-[#10b981] rounded-full shrink-0" />
                        <div className="w-8 h-8 rounded-full bg-[#10b981]/15 flex items-center justify-center shrink-0">
                            <div className="w-5 h-5 rounded-full bg-[#10b981] text-white flex items-center justify-center shadow-xs">
                                <Check className="w-3.5 h-3.5 stroke-[3]" />
                            </div>
                        </div>
                        <div className="flex-1 text-[13px] font-medium text-slate-700 font-sans">
                            {toastMsg}
                        </div>
                        <button
                            type="button"
                            onClick={() => setToastMsg(null)}
                            className="text-slate-400 hover:text-slate-600 p-1 rounded-lg transition-colors cursor-pointer"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            )}

            <div className="bg-white rounded-[24px] shadow-xs border border-slate-200/80 overflow-hidden">
                <div className="p-5 sm:p-6 border-b border-slate-100/90 flex flex-wrap items-center justify-between gap-4">
                    <div className="flex-1 min-w-[240px] max-w-md relative">
                        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Cari nama, NIS, atau UID..."
                            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-[13px] placeholder:text-slate-400 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-sans"
                        />
                    </div>

                    <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 w-full sm:w-auto">
                        <div className="relative flex-1 sm:flex-initial min-w-[130px]">
                            <select
                                value={selectedJurusan}
                                onChange={(e) =>
                                    setSelectedJurusan(e.target.value)
                                }
                                className="w-full appearance-none bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 pr-8 text-xs sm:text-[13px] text-slate-700 font-medium focus:outline-none cursor-pointer shadow-xs"
                            >
                                <option value="Semua Jurusan">
                                    Semua Jurusan
                                </option>
                                <option value="TKJ">TKJ</option>
                                <option value="AKL">AKL</option>
                                <option value="OTPK">OTPK</option>
                                <option value="BDP">BDP</option>
                            </select>
                            <ChevronDown className="w-4 h-4 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                        </div>

                        <div className="relative flex-1 sm:flex-initial min-w-[130px]">
                            <select
                                value={selectedStatus}
                                onChange={(e) =>
                                    setSelectedStatus(e.target.value)
                                }
                                className="w-full appearance-none bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 pr-8 text-xs sm:text-[13px] text-slate-700 font-medium focus:outline-none cursor-pointer shadow-xs"
                            >
                                <option value="Semua Status">
                                    Semua Status
                                </option>
                                <option value="Aktif">Aktif</option>
                                <option value="Nonaktif">Nonaktif</option>
                            </select>
                            <ChevronDown className="w-4 h-4 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                        </div>

                        <button
                            type="button"
                            onClick={handleOpenAdd}
                            className="w-full sm:w-auto bg-[#2563eb] hover:bg-[#1d4ed8] text-white px-5 py-2.5 rounded-xl text-xs sm:text-[13px] font-semibold flex items-center justify-center gap-2 transition-all shadow-sm cursor-pointer hover:shadow-md shrink-0"
                        >
                            <Plus className="w-4 h-4 stroke-[2.5] shrink-0" />
                            <span className="whitespace-nowrap">
                                Daftarkan RFID{" "}
                            </span>
                        </button>
                    </div>
                </div>

                <div className="w-full overflow-x-auto scrollbar-thin">
                    <table className="w-full text-left border-collapse min-w-[760px]">
                        <thead>
                            <tr className="border-b border-slate-100 text-[11px] sm:text-[11.5px] font-bold text-slate-600 tracking-wider">
                                <th className="py-4 px-4 sm:px-6 w-14 font-bold whitespace-nowrap">
                                    NO
                                </th>
                                <th className="py-4 px-4 sm:px-6 font-bold whitespace-nowrap min-w-[170px]">
                                    UID RFID
                                </th>
                                <th className="py-4 px-4 sm:px-6 font-bold whitespace-nowrap min-w-[140px]">
                                    NAMA SISWA
                                </th>
                                <th className="py-4 px-4 sm:px-6 font-bold whitespace-nowrap min-w-[90px]">
                                    NIS
                                </th>
                                <th className="py-4 px-4 sm:px-6 font-bold whitespace-nowrap min-w-[100px]">
                                    KELAS
                                </th>
                                <th className="py-4 px-4 sm:px-6 font-bold whitespace-nowrap min-w-[90px]">
                                    JURUSAN
                                </th>
                                <th className="py-4 px-4 sm:px-6 font-bold text-center whitespace-nowrap min-w-[90px]">
                                    STATUS
                                </th>
                                <th className="py-4 px-4 sm:px-6 font-bold text-center whitespace-nowrap min-w-[80px]">
                                    AKSI
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100/80 text-[13px] sm:text-[13.5px]">
                            {loading ? (
                                <tr>
                                    <td
                                        colSpan={8}
                                        className="py-8 text-center text-slate-400 font-medium"
                                    >
                                        Memuat data siswa...
                                    </td>
                                </tr>
                            ) : currentSiswaData.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan={8}
                                        className="py-12 text-center text-slate-400 font-medium"
                                    >
                                        Belum ada data siswa
                                    </td>
                                </tr>
                            ) : (
                                currentSiswaData.map((row, idx) => (
                                    <tr
                                        key={row.id}
                                        className="hover:bg-slate-50/60 transition-colors"
                                    >
                                        <td className="py-4 px-4 sm:px-6 text-slate-600 font-medium whitespace-nowrap">
                                            {startIndex + idx + 1}
                                        </td>
                                        <td className="py-4 px-4 sm:px-6 font-mono font-bold text-slate-800 tracking-wider whitespace-nowrap">
                                            {formatUidDisplay(row.rfid_uid)}
                                        </td>
                                        <td className="py-4 px-4 sm:px-6 font-medium text-slate-900 whitespace-nowrap">
                                            {row.nama_siswa}
                                        </td>
                                        <td className="py-4 px-4 sm:px-6 text-slate-600 font-mono whitespace-nowrap">
                                            {row.nisn}
                                        </td>
                                        <td className="py-4 px-4 sm:px-6 text-slate-700 font-medium whitespace-nowrap">
                                            {row.kelas?.nama_kelas || "-"}
                                        </td>
                                        <td className="py-4 px-4 sm:px-6 text-slate-700 font-medium whitespace-nowrap">
                                            {row.kelas?.jurusan || "-"}
                                        </td>
                                        <td className="py-4 px-4 sm:px-6 text-center whitespace-nowrap">
                                            {row.status === "Nonaktif" ? (
                                                <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full bg-rose-50 text-rose-600 border border-rose-200/80 shadow-2xs">
                                                    <span>Nonaktif</span>
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200/80 shadow-2xs">
                                                    <span>Aktif</span>
                                                </span>
                                            )}
                                        </td>
                                        <td className="py-4 px-4 sm:px-6 text-center whitespace-nowrap">
                                            <div className="flex items-center justify-center gap-3">
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        handleOpenEdit(row)
                                                    }
                                                    className="text-blue-500 hover:text-blue-700 p-1.5 rounded-lg hover:bg-blue-50 transition-colors cursor-pointer"
                                                    title={`Edit ${row.nama_siswa}`}
                                                >
                                                    <Pencil className="w-4 h-4" />
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        setDeletingItem(row)
                                                    }
                                                    className="text-rose-400 hover:text-rose-600 p-1.5 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
                                                    title={`Hapus ${row.nama_siswa}`}
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="p-4 sm:px-6 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
                    <div className="text-slate-500 font-medium">
                        Menampilkan{" "}
                        <span className="font-bold text-slate-800">
                            {totalSiswa === 0 ? 0 : startIndex + 1} -{" "}
                            {Math.min(endIndex, totalSiswa)}
                        </span>{" "}
                        dari{" "}
                        <span className="font-bold text-slate-800">
                            {totalSiswa}
                        </span>{" "}
                        kartu RFID
                    </div>

                    <div className="flex items-center gap-1.5 self-end sm:self-auto">
                        <button
                            type="button"
                            disabled={currentPage === 1}
                            onClick={() =>
                                setCurrentPage((p) => Math.max(1, p - 1))
                            }
                            className="w-8 h-8 flex items-center justify-center bg-white border border-slate-200 text-slate-600 rounded-lg text-xs disabled:opacity-40 cursor-pointer hover:bg-slate-50"
                        >
                            <ChevronLeft className="w-4 h-4" />
                        </button>

                        {Array.from(
                            { length: totalPages },
                            (_, i) => i + 1,
                        ).map((page) => (
                            <button
                                key={page}
                                type="button"
                                onClick={() => setCurrentPage(page)}
                                className={`w-8 h-8 rounded-lg text-xs font-bold cursor-pointer transition-colors ${
                                    currentPage === page
                                        ? "bg-[#2563eb] text-white shadow-xs"
                                        : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50"
                                }`}
                            >
                                {page}
                            </button>
                        ))}

                        <button
                            type="button"
                            disabled={
                                currentPage === totalPages || totalPages === 0
                            }
                            onClick={() =>
                                setCurrentPage((p) =>
                                    Math.min(totalPages, p + 1),
                                )
                            }
                            className="w-8 h-8 flex items-center justify-center bg-white border border-slate-200 text-slate-600 rounded-lg text-xs disabled:opacity-40 cursor-pointer hover:bg-slate-50"
                        >
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 z-[70] flex items-center justify-center p-3 sm:p-5 bg-slate-950/65 backdrop-blur-xs animate-in fade-in duration-150 overflow-y-auto">
                    <div className="bg-white rounded-2xl sm:rounded-3xl max-w-2xl w-full max-h-[88vh] sm:max-h-[90vh] shadow-2xl border border-slate-100 flex flex-col overflow-hidden my-auto animate-in zoom-in-95 duration-200">
                        <form
                            onSubmit={handleSave}
                            className="flex flex-col h-full overflow-hidden"
                        >
                            <div className="flex items-start justify-between px-5 py-4 sm:px-7 sm:py-5 border-b border-slate-100 shrink-0 bg-white">
                                <div>
                                    <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-tight">
                                        {editingId
                                            ? "Edit Data Siswa"
                                            : "Tambah Data Siswa"}
                                    </h3>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg transition-colors cursor-pointer"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="overflow-y-auto p-5 sm:p-7 flex-1">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
                                    <div className="space-y-3.5 sm:space-y-4">
                                        <div>
                                            <label className="text-xs font-semibold text-slate-700 block mb-1.5">
                                                NIS
                                            </label>
                                            <input
                                                type="text"
                                                required
                                                value={formNis}
                                                onChange={(e) =>
                                                    setFormNis(e.target.value)
                                                }
                                                placeholder="Masukkan NIS/NISN"
                                                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-[13px] text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-sans"
                                            />
                                        </div>

                                        <div>
                                            <label className="text-xs font-semibold text-slate-700 block mb-1.5">
                                                Nama Lengkap
                                            </label>
                                            <input
                                                type="text"
                                                required
                                                value={formNama}
                                                onChange={(e) =>
                                                    setFormNama(e.target.value)
                                                }
                                                placeholder="Masukkan nama lengkap"
                                                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-[13px] text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-sans"
                                            />
                                        </div>

                                        <div className="grid grid-cols-2 gap-3">
                                            <div>
                                                <label className="text-xs font-semibold text-slate-700 block mb-1.5">
                                                    Kelas
                                                </label>
                                                <div className="relative">
                                                    <select
                                                        value={formKelas}
                                                        onChange={(e) =>
                                                            setFormKelas(
                                                                e.target.value,
                                                            )
                                                        }
                                                        className="w-full appearance-none px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-[13px] text-slate-700 font-medium focus:outline-none cursor-pointer pr-8"
                                                    >
                                                        <option value="X">
                                                            X
                                                        </option>
                                                        <option value="XI">
                                                            XI
                                                        </option>
                                                        <option value="XII">
                                                            XII
                                                        </option>
                                                    </select>
                                                    <ChevronDown className="w-4 h-4 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                                                </div>
                                            </div>

                                            <div>
                                                <label className="text-xs font-semibold text-slate-700 block mb-1.5">
                                                    Jurusan
                                                </label>
                                                <div className="relative">
                                                    <select
                                                        value={formJurusan}
                                                        onChange={(e) =>
                                                            setFormJurusan(
                                                                e.target.value,
                                                            )
                                                        }
                                                        className="w-full appearance-none px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-[13px] text-slate-700 font-medium focus:outline-none cursor-pointer pr-8"
                                                    >
                                                        <option value="TKJ">
                                                            TKJ
                                                        </option>
                                                        <option value="AKL">
                                                            AKL
                                                        </option>
                                                        <option value="OTPK">
                                                            OTPK
                                                        </option>
                                                        <option value="BDP">
                                                            BDP
                                                        </option>
                                                    </select>
                                                    <ChevronDown className="w-4 h-4 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                                                </div>
                                            </div>
                                        </div>

                                        <div>
                                            <label className="text-xs font-semibold text-slate-700 block mb-1.5">
                                                UID RFID
                                            </label>
                                            <div className="flex gap-2 items-center">
                                                <input
                                                    type="text"
                                                    required
                                                    value={formUid}
                                                    onChange={(e) =>
                                                        setFormUid(
                                                            e.target.value,
                                                        )
                                                    }
                                                    className="min-w-0 flex-1 px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-mono font-bold tracking-wider text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={handleReadRfid}
                                                    disabled={isReadingRfid}
                                                    className="bg-[#2563eb] hover:bg-[#1d4ed8] text-white px-3 sm:px-3.5 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer hover:shadow-md shrink-0 whitespace-nowrap disabled:opacity-75"
                                                >
                                                    <span>
                                                        {isReadingRfid
                                                            ? "Membaca..."
                                                            : "Baca RFID"}
                                                    </span>
                                                </button>
                                            </div>
                                        </div>

                                        <div>
                                            <label className="text-xs font-semibold text-slate-700 block mb-1.5">
                                                Status
                                            </label>
                                            <div className="relative">
                                                <select
                                                    value={formStatus}
                                                    onChange={(e) =>
                                                        setFormStatus(
                                                            e.target.value as
                                                                | "Aktif"
                                                                | "Nonaktif",
                                                        )
                                                    }
                                                    className="w-full appearance-none px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-[13px] text-slate-700 font-medium focus:outline-none cursor-pointer pr-8"
                                                >
                                                    <option value="Aktif">
                                                        Aktif
                                                    </option>
                                                    <option value="Nonaktif">
                                                        Nonaktif
                                                    </option>
                                                </select>
                                                <ChevronDown className="w-4 h-4 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="border border-slate-200/80 rounded-2xl p-4 sm:p-4.5 bg-white flex flex-col justify-between">
                                        <div>
                                            <div className="flex items-center gap-1.5 mb-1.5 text-[#2563eb]">
                                                <span className="text-[11px] font-bold tracking-wider text-slate-900 uppercase">
                                                    INFORMASI
                                                </span>
                                            </div>
                                            <p className="text-xs text-slate-500 leading-relaxed">
                                                Tempelkan kartu RFID pada reader
                                            </p>

                                            <div className="mt-3 sm:mt-4 p-4 sm:p-5 bg-[#f8fafc] border border-slate-100 rounded-2xl flex items-center justify-center relative min-h-[150px] sm:min-h-[170px] overflow-hidden select-none">
                                                <div className="w-22 sm:w-24 h-28 sm:h-32 bg-[#1e293b] rounded-xl flex flex-col items-center justify-between p-3 sm:p-3.5 shadow-lg relative border border-slate-700/80 z-10">
                                                    <div
                                                        className={`w-2.5 h-2.5 rounded-full ${
                                                            isReadingRfid
                                                                ? "bg-amber-400 shadow-[0_0_12px_#fbbf24] animate-ping"
                                                                : "bg-blue-500 shadow-[0_0_8px_#3b82f6] animate-pulse"
                                                        }`}
                                                    />
                                                    <div className="w-7 h-1 bg-slate-700 rounded-full" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

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
                                    className="px-6 py-2.5 bg-[#2563eb] hover:bg-blue-700 text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer shadow-xs hover:shadow-md"
                                >
                                    Simpan
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {deletingItem && (
                <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-slate-950/65 backdrop-blur-xs animate-in fade-in duration-150">
                    <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-100 text-center">
                        <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-3">
                            <Trash2 className="w-6 h-6" />
                        </div>
                        <h3 className="text-base font-bold text-slate-900">
                            Hapus Kartu RFID?
                        </h3>
                        <p className="text-xs text-slate-500 mt-1">
                            Apakah Anda yakin ingin menghapus data siswa{" "}
                            <span className="font-bold text-slate-800">
                                {deletingItem.nama_siswa}
                            </span>{" "}
                            dengan UID:{" "}
                            {formatUidDisplay(deletingItem.rfid_uid)}?
                        </p>
                        <div className="flex gap-2.5 mt-5">
                            <button
                                type="button"
                                onClick={() => setDeletingItem(null)}
                                className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition-colors cursor-pointer"
                            >
                                Batal
                            </button>
                            <button
                                type="button"
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
