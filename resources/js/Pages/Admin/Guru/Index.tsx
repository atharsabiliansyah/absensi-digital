
import { FormEvent, useState } from 'react';
import { Head, useForm } from '@inertiajs/react';

type Kelas = {
    id: number;
    nama_kelas: string;
    jurusan: string;
    tipe_kelas: number | null;
};

type Guru = {
    id: number;
    name: string;
    username: string;
    email: string;
    kelas_diampu: Kelas[];
};

type Props = {
    guru: Guru[];
    kelas: Kelas[];
};

export default function Index({ guru, kelas }: Props) {
    const form = useForm({
        name: '',
        username: '',
        email: '',
        password: '',
        password_confirmation: '',
        kelas_ids: [] as number[],
    });

    const [penugasan, setPenugasan] = useState<Record<number, number[]>>(
        Object.fromEntries(
            guru.map((g) => [
                g.id,
                g.kelas_diampu.map((k) => k.id),
            ]),
        ),
    );

    const namaKelas = (k: Kelas) =>
        `${k.nama_kelas} ${k.jurusan}${k.tipe_kelas ? ` ${k.tipe_kelas}` : ''}`;

    const toggle = (
        ids: number[],
        id: number,
        checked: boolean,
    ) => checked
        ? [...ids, id]
        : ids.filter((value) => value !== id);

    const submit = (e: FormEvent) => {
        e.preventDefault();

        form.post('/admin/guru', {
            onSuccess: () => form.reset(),
        });
    };

    return (
        <>
            <Head title="Kelola Akun Guru" />

            <main className="mx-auto max-w-6xl space-y-8 p-6">
                <header>
                    <h1 className="text-2xl font-bold">
                        Kelola Akun Guru
                    </h1>
                    <p className="mt-1 text-gray-600">
                        Buat akun guru dan tentukan kelas yang boleh diakses.
                    </p>
                </header>

                <section className="rounded-xl border bg-white p-6">
                    <h2 className="mb-5 text-lg font-semibold">
                        Tambah Akun Guru
                    </h2>

                    <form onSubmit={submit} className="space-y-4">
                        {([
                            ['name', 'Nama Guru', 'text'],
                            ['username', 'Username', 'text'],
                            ['email', 'Email', 'email'],
                            ['password', 'Password', 'password'],
                            [
                                'password_confirmation',
                                'Konfirmasi Password',
                                'password',
                            ],
                        ] as const).map(([field, label, type]) => (
                            <div key={field}>
                                <label className="mb-1 block text-sm font-medium">
                                    {label}
                                </label>
                                <input
                                    type={type}
                                    className="w-full rounded-lg border p-2"
                                    value={form.data[field]}
                                    onChange={(e) =>
                                        form.setData(field, e.target.value)
                                    }
                                    required
                                />
                                {form.errors[field] && (
                                    <p className="text-sm text-red-600">
                                        {form.errors[field]}
                                    </p>
                                )}
                            </div>
                        ))}

                        <fieldset>
                            <legend className="mb-2 font-medium">
                                Kelas yang Diampu
                            </legend>

                            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                                {kelas.map((k) => (
                                    <label
                                        key={k.id}
                                        className="flex items-center gap-2 rounded-lg border p-3"
                                    >
                                        <input
                                            type="checkbox"
                                            checked={form.data.kelas_ids.includes(k.id)}
                                            onChange={(e) =>
                                                form.setData(
                                                    'kelas_ids',
                                                    toggle(
                                                        form.data.kelas_ids,
                                                        k.id,
                                                        e.target.checked,
                                                    ),
                                                )
                                            }
                                        />
                                        {namaKelas(k)}
                                    </label>
                                ))}
                            </div>

                            {form.errors.kelas_ids && (
                                <p className="mt-2 text-sm text-red-600">
                                    {form.errors.kelas_ids}
                                </p>
                            )}
                        </fieldset>

                        <button
                            type="submit"
                            disabled={form.processing}
                            className="rounded-lg bg-blue-600 px-5 py-2 font-medium text-white disabled:opacity-50"
                        >
                            {form.processing ? 'Menyimpan...' : 'Buat Akun Guru'}
                        </button>
                    </form>
                </section>

                <section className="rounded-xl border bg-white p-6">
                    <h2 className="mb-4 text-lg font-semibold">
                        Daftar Guru dan Penugasan
                    </h2>

                    <div className="space-y-5">
                        {guru.map((g) => (
                            <div key={g.id} className="rounded-lg border p-4">
                                <h3 className="font-semibold">{g.name}</h3>
                                <p className="text-sm text-gray-600">
                                    @{g.username} · {g.email}
                                </p>

                                <form
                                    className="mt-4 space-y-3"
                                    onSubmit={(e) => {
                                        e.preventDefault();
                                        form.transform((data) => ({
                                            ...data,
                                            kelas_ids: penugasan[g.id] ?? [],
                                        }));
                                        form.put(`/admin/guru/${g.id}`, {
                                            preserveScroll: true,
                                            onFinish: () => form.transform((data) => data),
                                        });
                                    }}
                                >
                                    <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                                        {kelas.map((k) => (
                                            <label
                                                key={k.id}
                                                className="flex items-center gap-2 rounded border p-2"
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={(penugasan[g.id] ?? []).includes(k.id)}
                                                    onChange={(e) =>
                                                        setPenugasan((old) => ({
                                                            ...old,
                                                            [g.id]: toggle(
                                                                old[g.id] ?? [],
                                                                k.id,
                                                                e.target.checked,
                                                            ),
                                                        }))
                                                    }
                                                />
                                                {namaKelas(k)}
                                            </label>
                                        ))}
                                    </div>

                                    <button
                                        type="submit"
                                        className="rounded-lg border px-4 py-2"
                                    >
                                        Simpan Penugasan
                                    </button>
                                </form>

                                <button
                                    type="button"
                                    className="mt-3 text-sm text-red-600"
                                    onClick={() => {
                                        if (confirm(`Hapus akun guru ${g.name}?`)) {
                                            form.delete(`/admin/guru/${g.id}`);
                                        }
                                    }}
                                >
                                    Hapus akun guru
                                </button>
                            </div>
                        ))}

                        {guru.length === 0 && (
                            <p className="text-gray-500">
                                Belum ada akun guru.
                            </p>
                        )}
                    </div>
                </section>
            </main>
        </>
    );
}
