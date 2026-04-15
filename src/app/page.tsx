"use client";

import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [formData, setFormData] = useState({
    lokasi: '',
    tanggal: '',
    penginspeksi: '',
    kategori: '',
    deskripsi: '',
  });
  const [fotos, setFotos] = useState<File[]>([]);
  const [fotoPreview, setFotoPreview] = useState<string[]>([]);

  // Redirect ke login jika user belum login
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-700 mx-auto mb-4"></div>
          <p className="text-gray-700 dark:text-gray-300">Loading...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newFiles = Array.from(files);
      setFotos(prev => [...prev, ...newFiles]);

      // Create preview URLs
      newFiles.forEach(file => {
        const reader = new FileReader();
        reader.onload = () => {
          setFotoPreview(prev => [...prev, reader.result as string]);
        };
        reader.readAsDataURL(file);
      });

      // Reset input
      e.target.value = '';
    }
  };

  const removeFoto = (index: number) => {
    setFotos(prev => prev.filter((_, i) => i !== index));
    setFotoPreview(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('lokasi', formData.lokasi);
      formDataToSend.append('tanggal', formData.tanggal);
      formDataToSend.append('penginspeksi', formData.penginspeksi);
      formDataToSend.append('kategori', formData.kategori);
      formDataToSend.append('deskripsi', formData.deskripsi);
      formDataToSend.append('userEmail', session.user?.email || '');
      formDataToSend.append('userName', session.user?.name || '');

      // Add all photos
      fotos.forEach(foto => {
        formDataToSend.append('fotos', foto);
      });

      const response = await fetch('/api/inspeksi', {
        method: 'POST',
        body: formDataToSend,
      });

      const data = await response.json();

      if (response.ok) {
        const message = `Data inspeksi berhasil disimpan! ${data.fotosInserted > 0 ? `${data.fotosInserted} foto berhasil diunggah.` : 'Tidak ada foto yang diunggah.'}`;
        setMessage({ type: 'success', text: message });
        setFormData({ lokasi: '', tanggal: '', penginspeksi: '', kategori: '', deskripsi: '' });
        setFotos([]);
        setFotoPreview([]);
        setTimeout(() => setShowForm(false), 2000);
      } else {
        setMessage({ type: 'error', text: data.error || 'Gagal menyimpan data' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Terjadi kesalahan: ' + (error instanceof Error ? error.message : 'Unknown error') });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-slate-800 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-700 dark:text-gray-300">
              🏭 Inspeksi Lapangan v0
            </h1>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-1">
              Aplikasi inspeksi lapangan responsif untuk HP dan laptop
            </p>
          </div>
          
          {/* User Info & Logout */}
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-semibold text-gray-900 dark:text-white">
                {session.user?.name}
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                {session.user?.email}
              </p>
            </div>
            <button
              onClick={() => signOut()}
              className="px-4 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600 transition-colors text-sm"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {!showForm ? (
          // Landing Page
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            {/* Left side - Content */}
            <div className="space-y-6">
              <div className="space-y-4">
                <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
                  Inspeksi Lapangan Made Easy
                </h2>
                <p className="text-lg text-gray-600 dark:text-gray-300">
                  Aplikasi web responsif untuk melakukan inspeksi lapangan dengan mudah.
                  Akses dari perangkat apa pun, kapan pun, di mana pun.
                </p>
              </div>

              {/* Features */}
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-gray-300 dark:bg-gray-700 flex items-center justify-center text-gray-700 dark:text-gray-300 font-bold">
                    ⚙️
                  </span>
                  <span className="text-gray-700 dark:text-gray-300">
                    Responsif untuk semua perangkat (mobile, tablet, desktop)
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-gray-300 dark:bg-gray-700 flex items-center justify-center text-gray-700 dark:text-gray-300 font-bold">
                    🔧
                  </span>
                  <span className="text-gray-700 dark:text-gray-300">
                    Antarmuka yang intuitif dan mudah digunakan
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-gray-300 dark:bg-gray-700 flex items-center justify-center text-gray-700 dark:text-gray-300 font-bold">
                    📊
                  </span>
                  <span className="text-gray-700 dark:text-gray-300">
                    Dibangun dengan Next.js dan Tailwind CSS
                  </span>
                </div>
              </div>

              {/* CTA Button */}
              <div className="pt-4">
                <button
                  onClick={() => setShowForm(true)}
                  className="w-full sm:w-auto px-8 py-3 bg-gray-700 text-white font-semibold rounded-lg hover:bg-gray-800 dark:bg-gray-600 dark:hover:bg-gray-700 transition-colors shadow-md hover:shadow-lg"
                >
                  Mulai Inspeksi
                </button>
              </div>
            </div>

            {/* Right side - Illustration */}
            <div className="hidden md:flex items-center justify-center">
              <div className="w-full max-w-sm">
                <div className="bg-white dark:bg-slate-700 rounded-2xl shadow-xl overflow-hidden">
                  <div className="bg-gradient-to-br from-gray-500 to-gray-600 h-48 sm:h-56 flex items-center justify-center">
                    <div className="text-6xl">🏗️⚡</div>
                  </div>
                  <div className="p-6">
                    <p className="text-center text-gray-700 dark:text-gray-300 font-semibold">
                      Akses dimana saja
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          // Form Page
          <div className="max-w-2xl mx-auto">
            <button
              onClick={() => setShowForm(false)}
              className="mb-6 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 font-semibold flex items-center gap-2"
            >
              ← Kembali
            </button>

            <div className="bg-white dark:bg-slate-700 rounded-xl shadow-lg p-6 sm:p-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-6">
                Form Inspeksi Lapangan
              </h2>

              {/* Status Message */}
              {message && (
                <div className={`mb-6 p-4 rounded-lg ${message.type === 'success' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'}`}>
                  {message.text}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Lokasi */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Lokasi Inspeksi *
                  </label>
                  <input
                    type="text"
                    name="lokasi"
                    value={formData.lokasi}
                    onChange={handleInputChange}
                    placeholder="Masukkan lokasi"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent dark:bg-slate-600 dark:text-white outline-none transition"
                    required
                  />
                </div>

                {/* Tanggal */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Tanggal Inspeksi *
                  </label>
                  <input
                    type="date"
                    name="tanggal"
                    value={formData.tanggal}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent dark:bg-slate-600 dark:text-white outline-none transition"
                    required
                  />
                </div>

                {/* Penginspeksi */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Nama Penginspeksi *
                  </label>
                  <input
                    type="text"
                    name="penginspeksi"
                    value={formData.penginspeksi}
                    onChange={handleInputChange}
                    placeholder="Masukkan nama Anda"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent dark:bg-slate-600 dark:text-white outline-none transition"
                    required
                  />
                </div>

                {/* Kategori */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Kategori Inspeksi *
                  </label>
                  <select
                    name="kategori"
                    value={formData.kategori}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent dark:bg-slate-600 dark:text-white outline-none transition"
                    required
                  >
                    <option value="">Pilih kategori</option>
                    <option value="infrastruktur">Infrastruktur</option>
                    <option value="lingkungan">Lingkungan</option>
                    <option value="keselamatan">Keselamatan</option>
                    <option value="kualitas">Kualitas</option>
                  </select>
                </div>

                {/* Deskripsi */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Deskripsi Temuan
                  </label>
                  <textarea
                    name="deskripsi"
                    value={formData.deskripsi}
                    onChange={handleInputChange}
                    placeholder="Tuliskan deskripsi temuan inspeksi"
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent dark:bg-slate-600 dark:text-white outline-none transition resize-none"
                  />
                </div>

                {/* Upload Fotos */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    📸 Ambil Foto (Opsional - Bisa lebih dari 1)
                  </label>
                  <div className="flex flex-col gap-3">
                    <div className="flex gap-2">
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        capture="environment"
                        onChange={handleFileChange}
                        className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent dark:bg-slate-600 dark:text-white outline-none transition"
                      />
                    </div>

                    {/* Foto Preview */}
                    {fotoPreview.length > 0 && (
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                        {fotoPreview.map((preview, index) => (
                          <div key={index} className="relative group">
                            <img
                              src={preview}
                              alt={`Foto ${index + 1}`}
                              className="w-full h-24 object-cover rounded-lg border border-gray-300 dark:border-gray-600"
                            />
                            <button
                              type="button"
                              onClick={() => removeFoto(index)}
                              className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              ✕
                            </button>
                            <p className="text-xs text-center text-gray-600 dark:text-gray-400 mt-1">
                              {fotos[index]?.name || 'Foto'}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}

                    {fotoPreview.length > 0 && (
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Total {fotos.length} foto dipilih
                      </p>
                    )}
                  </div>
                </div>

                {/* Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 px-6 py-3 bg-gray-700 text-white font-semibold rounded-lg hover:bg-gray-800 dark:bg-gray-600 dark:hover:bg-gray-700 transition-colors shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Menyimpan...' : 'Simpan Inspeksi'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowForm(false);
                      setMessage(null);
                      setFotos([]);
                      setFotoPreview([]);
                    }}
                    disabled={loading}
                    className="flex-1 px-6 py-3 bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300 dark:bg-slate-600 dark:text-gray-300 dark:hover:bg-slate-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Batal
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-slate-800 border-t border-gray-200 dark:border-gray-700 mt-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p className="text-center text-gray-600 dark:text-gray-400 text-sm">
            © 2026 Inspeksi Lapangan v0. Built with Next.js & Tailwind CSS
          </p>
        </div>
      </footer>
    </div>
  );
}
