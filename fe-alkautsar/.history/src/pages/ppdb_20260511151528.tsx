import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import Swal from "sweetalert2";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import {
  createPpdbRegistration,
  notifyPpdbAdmin,
} from "../services/ppdb/registrations";
import "../styles/ppdb.css";

type PpdbForm = {
  namaSiswa: string;
  jenisKelamin: string;
  tempatLahir: string;
  tanggalLahir: string;
  unitTujuan: string;
  asalSekolah: string;
  namaOrangTua: string;
  nomorWhatsapp: string;
  email: string;
  alamat: string;
  catatan: string;
};

const initialForm: PpdbForm = {
  namaSiswa: "",
  jenisKelamin: "",
  tempatLahir: "",
  tanggalLahir: "",
  unitTujuan: "",
  asalSekolah: "",
  namaOrangTua: "",
  nomorWhatsapp: "",
  email: "",
  alamat: "",
  catatan: "",
};

const PpdbPage = () => {
  const [form, setForm] = useState<PpdbForm>(initialForm);

  const handleChange = (
    event:
      | ChangeEvent<HTMLInputElement>
      | ChangeEvent<HTMLSelectElement>
      | ChangeEvent<HTMLTextAreaElement>,
  ) => {
    const { name, value } = event.target;
    setForm((currentForm) => ({
      ...currentForm,
      [name]: value,
    }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const registrationCode = `PPDB-${Date.now().toString().slice(-6)}`;

    const payload = {
      ...form,
      registrationCode,
    };

    try {
      await createPpdbRegistration(payload);

      try {
        await notifyPpdbAdmin(payload);
      } catch (notificationError) {
        console.warn("Notifikasi admin PPDB belum terkirim:", notificationError);
      }

      await Swal.fire({
        title: "Pendaftaran berhasil dikirim",
        html: `Kode pendaftaran kamu:<br><strong>${registrationCode}</strong>`,
        icon: "success",
        confirmButtonColor: "#1f8f5f",
      });

      setForm(initialForm);
    } catch (error: unknown) {
      console.error("ERROR:", error);

      Swal.fire({
        title: "Gagal kirim data",
        text: error instanceof Error ? error.message : "Server error",
        icon: "error",
      });
    }
  };
  return (
    <>
      <Navbar />

      <main className="ppdb-page">
        <section className="ppdb-hero">
          <div className="container">
            <div className="row align-items-center g-4">
              <div className="col-lg-7">
                <span className="ppdb-badge">
                  <i className="bi bi-mortarboard-fill"></i>
                  PPDB Al-Kautsar
                </span>
                <h1>Penerimaan Peserta Didik Baru</h1>
                <p>
                  Lengkapi formulir pendaftaran awal. Tim sekolah akan
                  menghubungi orang tua atau wali melalui WhatsApp untuk
                  konfirmasi data dan jadwal kunjungan.
                </p>
              </div>

              <div className="col-lg-5">
                <div className="ppdb-info-panel">
                  <div>
                    <i className="bi bi-calendar-check"></i>
                    <span>Tahun Ajaran 2026/2027</span>
                  </div>
                  <div>
                    <i className="bi bi-whatsapp"></i>
                    <span>Konfirmasi melalui WhatsApp</span>
                  </div>
                  <div>
                    <i className="bi bi-file-earmark-text"></i>
                    <span>Formulir pendaftaran awal</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="ppdb-content">
          <div className="container">
            <div className="row g-4">
              <div className="col-lg-4">
                <aside className="ppdb-sidebar">
                  <h2>Alur PPDB</h2>
                  <ol>
                    <li>Isi formulir pendaftaran calon siswa.</li>
                    <li>Simpan kode pendaftaran yang muncul.</li>
                    <li>Admin menghubungi wali melalui WhatsApp.</li>
                    <li>Lengkapi berkas dan lakukan daftar ulang.</li>
                  </ol>

                  <div className="ppdb-contact">
                    <span>Butuh bantuan?</span>
                    <a href="https://wa.me/628123456789" target="_blank">
                      <i className="bi bi-whatsapp"></i>
                      Chat Admin PPDB
                    </a>
                  </div>
                </aside>
              </div>

              <div className="col-lg-8">
                <form className="ppdb-form" onSubmit={handleSubmit}>
                  <div className="ppdb-form-header">
                    <h2>Formulir Pendaftaran</h2>
                    <p>Data bertanda bintang wajib diisi.</p>
                  </div>

                  <div className="row g-3">
                    <div className="col-md-6">
                      <label htmlFor="namaSiswa">Nama lengkap siswa *</label>
                      <input
                        id="namaSiswa"
                        name="namaSiswa"
                        type="text"
                        value={form.namaSiswa}
                        onChange={handleChange}
                        placeholder="Nama sesuai akta"
                        required
                      />
                    </div>

                    <div className="col-md-6">
                      <label htmlFor="jenisKelamin">Jenis kelamin *</label>
                      <select
                        id="jenisKelamin"
                        name="jenisKelamin"
                        value={form.jenisKelamin}
                        onChange={handleChange}
                        required
                      >
                        <option value="">Pilih jenis kelamin</option>
                        <option value="Laki-laki">Laki-laki</option>
                        <option value="Perempuan">Perempuan</option>
                      </select>
                    </div>

                    <div className="col-md-6">
                      <label htmlFor="tempatLahir">Tempat lahir *</label>
                      <input
                        id="tempatLahir"
                        name="tempatLahir"
                        type="text"
                        value={form.tempatLahir}
                        onChange={handleChange}
                        placeholder="Contoh: Bekasi"
                        required
                      />
                    </div>

                    <div className="col-md-6">
                      <label htmlFor="tanggalLahir">Tanggal lahir *</label>
                      <input
                        id="tanggalLahir"
                        name="tanggalLahir"
                        type="date"
                        value={form.tanggalLahir}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="col-md-6">
                      <label htmlFor="unitTujuan">Unit tujuan *</label>
                      <select
                        id="unitTujuan"
                        name="unitTujuan"
                        value={form.unitTujuan}
                        onChange={handleChange}
                        required
                      >
                        <option value="">Pilih unit pendidikan</option>
                        <option value="PAUD/TK">PAUD/TK</option>
                        <option value="SD/MI">SD/MI</option>
                        <option value="SMP/MTs">SMP/MTs</option>
                        <option value="SMA/MA">SMA/MA</option>
                      </select>
                    </div>

                    <div className="col-md-6">
                      <label htmlFor="asalSekolah">Asal sekolah</label>
                      <input
                        id="asalSekolah"
                        name="asalSekolah"
                        type="text"
                        value={form.asalSekolah}
                        onChange={handleChange}
                        placeholder="Isi jika sudah pernah sekolah"
                      />
                    </div>

                    <div className="col-md-6">
                      <label htmlFor="namaOrangTua">
                        Nama orang tua/wali *
                      </label>
                      <input
                        id="namaOrangTua"
                        name="namaOrangTua"
                        type="text"
                        value={form.namaOrangTua}
                        onChange={handleChange}
                        placeholder="Nama penanggung jawab"
                        required
                      />
                    </div>

                    <div className="col-md-6">
                      <label htmlFor="nomorWhatsapp">Nomor WhatsApp *</label>
                      <input
                        id="nomorWhatsapp"
                        name="nomorWhatsapp"
                        type="number/api/ppdb/send-notification/api/ppdb/send-notification"
                        value={form.nomorWhatsapp}
                        onChange={handleChange}
                        placeholder="08xxxxxxxxxx"
                        required
                      />
                    </div>

                    <div className="col-md-6">
                      <label htmlFor="email">Email</label>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        value={form.email}
                        onChange={handleChange}
                        placeholder="nama@email.com"
                      />
                    </div>

                    <div className="col-12">
                      <label htmlFor="alamat">Alamat lengkap *</label>
                      <textarea
                        id="alamat"
                        name="alamat"
                        value={form.alamat}
                        onChange={handleChange}
                        placeholder="Alamat domisili calon siswa"
                        rows={3}
                        required
                      ></textarea>
                    </div>

                    <div className="col-12">
                      <label htmlFor="catatan">Catatan tambahan</label>
                      <textarea
                        id="catatan"
                        name="catatan"
                        value={form.catatan}
                        onChange={handleChange}
                        placeholder="Contoh: ingin survei sekolah hari Sabtu"
                        rows={3}
                      ></textarea>
                    </div>
                  </div>

                  <button className="ppdb-submit" type="submit">
                    <i className="bi bi-send-fill"></i>
                    Kirim Pendaftaran
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
};

export default PpdbPage;
