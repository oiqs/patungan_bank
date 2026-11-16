import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const INITIAL_TAGIHAN = [
  { id: 't-nov26', bln: 'Nov', thn: '2026', judul: 'Iuran Wajib November 2026', nominal: 10000, jatuhTempo: '20 Nov 2026', status: 'belum', telat: false },
  { id: 't-okt26', bln: 'Okt', thn: '2026', judul: 'Iuran Wajib Oktober 2026', nominal: 10000, jatuhTempo: '20 Okt 2026', status: 'belum', telat: true },
  { id: 't-sep26', bln: 'Sep', thn: '2026', judul: 'Iuran Wajib September 2026', nominal: 10000, jatuhTempo: '20 Sep 2026', status: 'lunas', telat: false },
  { id: 't-agu26', bln: 'Agu', thn: '2026', judul: 'Iuran Wajib Agustus 2026', nominal: 10000, jatuhTempo: '20 Agu 2026', status: 'lunas', telat: false },
  { id: 't-jul26', bln: 'Jul', thn: '2026', judul: 'Iuran Wajib Juli 2026', nominal: 10000, jatuhTempo: '20 Jul 2026', status: 'pending', telat: false },
  { id: 't-jun26', bln: 'Jun', thn: '2026', judul: 'Iuran Wajib Juni 2026', nominal: 10000, jatuhTempo: '20 Jun 2026', status: 'lunas', telat: false },
]

export const PRESET_USERS = {
  anggota: {
    id: 'u1',
    nama: 'Budi Santoso',
    telepon: '+62 812-3456-7890',
    kodeUndangan: 'TRN-RT05-2026',
    alamat: 'RT 05 / RW 02, Desa Tarunesha',
    peran: 'Anggota',
    avatar: '👨‍🌾',
    skor: 82,
    plafonTersedia: 2000000,
    fingerprintAktif: true,
    pin: '111111',
    rekeningBank: 'BCA 8219012389',
    perangkat: 'Samsung Galaxy A54',
  },
  bendahara: {
    id: 'u2',
    nama: 'Siti Rahayu, S.E.',
    telepon: '+62 812-9876-5432',
    kodeUndangan: 'TRN-RT05-BNDH',
    alamat: 'RT 05 / RW 02, Desa Tarunesha',
    peran: 'Bendahara',
    avatar: '👩‍💼',
    skor: 96,
    plafonTersedia: 5000000,
    fingerprintAktif: true,
    pin: '222222',
    rekeningBank: 'Mandiri 13700188992',
    perangkat: 'iPhone 15 Pro',
  },
  sekretaris: {
    id: 'u3',
    nama: 'Hendra Pratama, S.Kom.',
    telepon: '+62 813-4567-8901',
    kodeUndangan: 'TRN-RT05-SKRT',
    alamat: 'RT 05 / RW 02, Desa Tarunesha',
    peran: 'Sekretaris',
    avatar: '👨‍💼',
    skor: 92,
    plafonTersedia: 4000000,
    fingerprintAktif: true,
    pin: '333333',
    rekeningBank: 'BNI 0981248721',
    perangkat: 'Xiaomi 13T',
  },
  ketua: {
    id: 'u4',
    nama: 'H. Bambang Sujatmiko',
    telepon: '+62 811-2233-4455',
    kodeUndangan: 'TRN-RT05-KTUA',
    alamat: 'RT 05 / RW 02, Desa Tarunesha',
    peran: 'Ketua',
    avatar: '👑',
    skor: 99,
    plafonTersedia: 10000000,
    fingerprintAktif: true,
    pin: '444444',
    rekeningBank: 'BRI 0192837465',
    perangkat: 'Samsung Galaxy S24 Ultra',
  },
}

export const useBankStore = create(
  persist(
    (set, get) => ({
      // --- USER & AUTH ---
      currentUser: PRESET_USERS.anggota,

      loginUserByPin: (enteredPin) => {
        // Cek PIN khusus masing-masing peran
        const matched = Object.values(PRESET_USERS).find(u => u.pin === enteredPin)
        if (matched) {
          set({ currentUser: { ...matched } })
          return { success: true, user: matched }
        }
        // Kompatibilitas PIN default 123456 -> masuk sebagai Anggota
        if (enteredPin === '123456') {
          const user = PRESET_USERS.anggota
          set({ currentUser: { ...user } })
          return { success: true, user }
        }
        return { success: false, message: 'PIN salah! Silakan coba lagi.' }
      },

      loginAsPreset: (roleKey) => {
        const user = PRESET_USERS[roleKey]
        if (user) {
          set({ currentUser: { ...user } })
          return user
        }
        return null
      },

      setPeran: (peran) => set((state) => ({
        currentUser: { ...state.currentUser, peran }
      })),

      updateProfil: (data) => set((state) => ({
        currentUser: { ...state.currentUser, ...data }
      })),

      setPin: (newPin) => set((state) => ({
        currentUser: { ...state.currentUser, pin: newPin }
      })),

      toggleFingerprint: () => set((state) => ({
        currentUser: { ...state.currentUser, fingerprintAktif: !state.currentUser.fingerprintAktif }
      })),

      // --- KEUANGAN UTAMA ---
      dompetSaldo: 125000,
      kasSaldo: 4820000,
      kasBulanIniMasuk: 650000,
      kasBulanIniKeluar: 320000,

      // --- TAGIHAN IURAN ---
      tagihanIuran: INITIAL_TAGIHAN,

      // --- RIWAYAT DOMPET ---
      transaksi: [
        { id: 'trx-1', icon: '⬆️', bg: 'bg-[#E6F4EE]', judul: 'Top-Up Transfer Bank', sub: '14 Nov 2026 · BCA Virtual Account', amount: 200000, type: 'in', date: '2026-11-14' },
        { id: 'trx-2', icon: '💳', bg: 'bg-[#FAEAEA]', judul: 'Bayar Iuran Wajib Okt', sub: '14 Nov 2026 · QRIS', amount: -10000, type: 'out', date: '2026-11-14' },
        { id: 'trx-3', icon: '❤️', bg: 'bg-[#FAEAEA]', judul: 'Donasi Jenguk Pak Hasan', sub: '10 Nov 2026 · Dana Sosial', amount: -20000, type: 'out', date: '2026-11-10' },
        { id: 'trx-4', icon: '🎲', bg: 'bg-[#FEF3DC]', judul: 'Setoran Arisan November', sub: '8 Nov 2026 · Pot Arisan', amount: -50000, type: 'out', date: '2026-11-08' },
      ],

      // --- KAS TRANSAKSI (PEMBUKUAN RESMI TARUNESHA) ---
      kasTransaksi: [
        { id: 'kt-1', tgl: '14 Nov 2026', jenis: 'masuk', judul: 'Iuran Wajib Budi Santoso', kategori: 'Iuran Wajib', nominal: 10000, oleh: 'Budi Santoso' },
        { id: 'kt-2', tgl: '12 Nov 2026', jenis: 'masuk', judul: 'Iuran Wajib Siti Rahayu', kategori: 'Iuran Wajib', nominal: 10000, oleh: 'Siti Rahayu' },
        { id: 'kt-3', tgl: '10 Nov 2026', jenis: 'keluar', judul: 'Beli ATK & Konsumsi Rapat', kategori: 'Operasional', nominal: 85000, oleh: 'Bendahara', nota: 'Nota-ATK-Nov.jpg', disetujui: true },
        { id: 'kt-4', tgl: '08 Nov 2026', jenis: 'masuk', judul: 'Setoran Kas Arisan', kategori: 'Arisan', nominal: 50000, oleh: 'Siti' },
        { id: 'kt-5', tgl: '05 Nov 2026', jenis: 'keluar', judul: 'Hiasan & Konsumsi Kerja Bakti', kategori: 'Kegiatan', nominal: 235000, oleh: 'Bendahara', nota: 'Nota-Bakti.jpg', disetujui: true },
      ],

      // --- ARISAN ---
      arisan: {
        judul: 'Arisan Bulanan RT 05',
        periode: 'November 2026',
        pot: 500000,
        nominalSetoran: 50000,
        peserta: [
          { id: 'p1', nama: 'Budi Santoso', lunas: true, avatar: '👤' },
          { id: 'p2', nama: 'Siti Rahayu', lunas: true, avatar: '👩' },
          { id: 'p3', nama: 'Ahmad Fauzi', lunas: false, avatar: '👨' },
          { id: 'p4', nama: 'Dewi Lestari', lunas: true, avatar: '👩' },
          { id: 'p5', nama: 'Roni Wijaya', lunas: false, avatar: '👨' },
          { id: 'p6', nama: 'Yuni Astuti', lunas: true, avatar: '👩' },
          { id: 'p7', nama: 'Hasan Basri', lunas: false, avatar: '👨' },
          { id: 'p8', nama: 'Lina Marlina', lunas: true, avatar: '👩' },
        ],
        riwayatPemenang: [
          { nama: 'Dewi Lestari', bulan: 'Oktober 2026', jumlah: 500000 },
          { nama: 'Budi Santoso', bulan: 'September 2026', jumlah: 500000 },
          { nama: 'Yuni Astuti', bulan: 'Agustus 2026', jumlah: 500000 },
        ],
      },

      // --- KEGIATAN & SOSIAL ---
      kegiatanList: [
        { id: 'kg-1', nama: 'Peringatan 17-an Tarunesha', target: 500000, terkumpul: 320000, emoji: '🇮🇩', rab: 500000, realisasi: 180000, panitia: 'Seksi Pemuda RT 05' },
        { id: 'kg-2', nama: 'Semarak Tahun Baru 2027', target: 1000000, terkumpul: 150000, emoji: '🎆', rab: 1000000, realisasi: 0, panitia: 'Remaja Tarunesha' },
      ],

      sosialList: [
        { id: 'ds-1', nama: 'Penjengukan Pak Hasan (Sakit)', target: 200000, terkumpul: 145000, emoji: '🏥', alasan: 'Dirawat di RS karena tipes', penerima: 'Keluarga Pak Hasan' },
      ],

      // --- PINJAMAN ---
      pinjamanList: [
        {
          id: 'pj-1',
          jenis: 'Pertanian',
          emoji: '🌾',
          judul: 'Pinjaman Modal Tani Padi',
          nominal: 1200000,
          tenorBulan: 6,
          cicilanPerBulan: 218000,
          terbayar: 480000,
          sisaPokok: 720000,
          cicilanKe: 2,
          totalCicilan: 6,
          status: 'Aktif',
          tglPencairan: '1 Sep 2026',
          jatuhTempoBerikut: '25 Nov 2026',
        }
      ],

      pengajuanPinjamanPending: [
        { id: 'pp-1', nama: 'Dewi Lestari', jenis: 'Pinjaman Darurat', nominal: 500000, tenor: '3 bln', tujuan: 'Kebutuhan berobat keluarga', status: 'pending', tgl: '15 Nov 2026', fotoLahan: 'nota_medis.jpg' },
        { id: 'pp-2', nama: 'Roni Wijaya', jenis: 'Modal Usaha Perikanan', nominal: 1000000, tenor: '6 bln', tujuan: 'Beli bibit & pakan lele kolam terpal', status: 'review', tgl: '14 Nov 2026', fotoLahan: 'kolam_lele.jpg' },
      ],

      verifikasiPembayaranPending: [
        { id: 'vp-1', nama: 'Ahmad Fauzi', jenis: 'Iuran Wajib Nov', jumlah: 10000, waktu: '16 Nov 10:15', via: 'QRIS' },
        { id: 'vp-2', nama: 'Roni Wijaya', jenis: 'Iuran Wajib Okt', jumlah: 10000, waktu: '16 Nov 11:30', via: 'Transfer VA' },
        { id: 'vp-3', nama: 'Hasan Basri', jenis: 'Iuran Sukarela Sosial', jumlah: 50000, waktu: '15 Nov 16:45', via: 'QRIS' },
      ],

      kasKeluarPending: [
        { id: 'kkp-1', keperluan: 'Perlengkapan Kebersihan Pos Ronda', nominal: 85000, diajukanOleh: 'Bendahara', nota: 'Nota-PosRonda.jpg', tgl: '16 Nov 2026' },
      ],

      // --- ANGGOTA LIST ---
      anggotaList: [
        { id: 'u1', nama: 'Budi Santoso', peran: 'Anggota', noHp: '+62 812-3456-7890', aktif: true, statusIuran: 'belum' },
        { id: 'u2', nama: 'Siti Rahayu', peran: 'Bendahara', noHp: '+62 813-1122-3344', aktif: true, statusIuran: 'lunas' },
        { id: 'u3', nama: 'Ahmad Fauzi', peran: 'Anggota', noHp: '+62 815-5566-7788', aktif: true, statusIuran: 'pending' },
        { id: 'u4', nama: 'Dewi Lestari', peran: 'Sekretaris', noHp: '+62 817-9988-1122', aktif: true, statusIuran: 'lunas' },
        { id: 'u5', nama: 'Roni Wijaya', peran: 'Anggota', noHp: '+62 818-4433-2211', aktif: true, statusIuran: 'belum' },
        { id: 'u6', nama: 'Pak Mulyono', peran: 'Ketua', noHp: '+62 811-0099-8877', aktif: true, statusIuran: 'lunas' },
        { id: 'u7', nama: 'Yuni Astuti', peran: 'Anggota', noHp: '+62 819-2233-4455', aktif: true, statusIuran: 'lunas' },
        { id: 'u8', nama: 'Hasan Basri', peran: 'Anggota', noHp: '+62 816-7788-9900', aktif: false, statusIuran: 'belum' },
      ],

      // --- NOTIFIKASI ---
      notifikasi: [
        { id: 'n1', judul: 'Pengingat Tagihan Iuran', pesan: 'Iuran wajib November sebesar Rp 10.000 jatuh tempo pada 20 Nov 2026.', tgl: '16 Nov 2026, 08:00', dibaca: false, link: '/kas' },
        { id: 'n2', judul: 'Undangan Rapat Tarunesha', pesan: 'Rapat koordinasi bulanan akan diadakan pada Jumat, 20 Nov di Balai RW 05 pukul 19:00.', tgl: '15 Nov 2026, 14:00', dibaca: false, link: '/' },
        { id: 'n3', judul: 'Hasil Arisan Oktober', pesan: 'Selamat kepada Dewi Lestari yang memenangkan arisan periode Oktober 2026 sebesar Rp 500.000.', tgl: '1 Nov 2026, 20:00', dibaca: true, link: '/layanan/arisan' },
        { id: 'n4', judul: 'Verifikasi Pembayaran Berhasil', pesan: 'Pembayaran iuran September Anda telah diverifikasi oleh Bendahara.', tgl: '12 Sep 2026, 10:15', dibaca: true, link: '/kas' },
      ],

      // --- AI ASSISTANT MODAL STATE ---
      isAiModalOpen: false,
      openAiModal: () => set({ isAiModalOpen: true }),
      closeAiModal: () => set({ isAiModalOpen: false }),

      // --- ACTIONS ---

      // TOP-UP DOMPET
      topupDompet: (nominal, metode = 'Transfer Bank') => set((state) => {
        const newSaldo = state.dompetSaldo + Number(nominal)
        const newTrx = {
          id: `trx-${Date.now()}`,
          icon: '⬆️',
          bg: 'bg-[#E6F4EE]',
          judul: `Top-Up via ${metode}`,
          sub: `${new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })} · Berhasil`,
          amount: Number(nominal),
          type: 'in',
          date: new Date().toISOString().split('T')[0],
        }
        const notif = {
          id: `n-${Date.now()}`,
          judul: 'Top-Up Berhasil',
          pesan: `Saldo dompet Anda bertambah Rp ${Number(nominal).toLocaleString('id-ID')} via ${metode}.`,
          tgl: 'Baru saja',
          dibaca: false,
          link: '/dompet',
        }
        return {
          dompetSaldo: newSaldo,
          transaksi: [newTrx, ...state.transaksi],
          notifikasi: [notif, ...state.notifikasi],
        }
      }),

      // BAYAR IURAN WAJIB (via dompet atau QRIS)
      bayarIuranWajib: (tagihanId, sumber = 'dompet') => {
        const state = get()
        const target = state.tagihanIuran.find(t => t.id === tagihanId)
        if (!target) return false

        const nominal = target.nominal

        // Jika bayar via dompet, kurangi saldo dompet
        let newDompetSaldo = state.dompetSaldo
        if (sumber === 'dompet') {
          if (newDompetSaldo < nominal) return false // saldo kurang
          newDompetSaldo -= nominal
        }

        const updatedTagihan = state.tagihanIuran.map(t =>
          t.id === tagihanId ? { ...t, status: 'lunas', telat: false } : t
        )

        const newKasSaldo = state.kasSaldo + nominal
        const newKasMasuk = state.kasBulanIniMasuk + nominal

        const newTrx = {
          id: `trx-${Date.now()}`,
          icon: '💳',
          bg: 'bg-[#FAEAEA]',
          judul: `Bayar ${target.judul}`,
          sub: `${new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })} · ${sumber === 'dompet' ? 'Dompet' : 'QRIS'}`,
          amount: -nominal,
          type: 'out',
          date: new Date().toISOString().split('T')[0],
        }

        const newKasTrx = {
          id: `kt-${Date.now()}`,
          tgl: 'Hari ini',
          jenis: 'masuk',
          judul: `${target.judul} (${state.currentUser.nama})`,
          kategori: 'Iuran Wajib',
          nominal: nominal,
          oleh: state.currentUser.nama,
        }

        const notif = {
          id: `n-${Date.now()}`,
          judul: 'Iuran Berhasil Dibayar',
          pesan: `${target.judul} sebesar Rp ${nominal.toLocaleString('id-ID')} berhasil lunas!`,
          tgl: 'Baru saja',
          dibaca: false,
          link: '/kas',
        }

        set({
          dompetSaldo: newDompetSaldo,
          kasSaldo: newKasSaldo,
          kasBulanIniMasuk: newKasMasuk,
          tagihanIuran: updatedTagihan,
          transaksi: [newTrx, ...state.transaksi],
          kasTransaksi: [newKasTrx, ...state.kasTransaksi],
          notifikasi: [notif, ...state.notifikasi],
        })

        return true
      },

      // BAYAR IURAN SUKARELA
      bayarIuranSukarela: (nominal, tujuan = 'Kas Umum', catatan = '') => {
        const state = get()
        const nom = Number(nominal)
        if (nom <= 0) return

        const newKasSaldo = state.kasSaldo + nom
        const newKasMasuk = state.kasBulanIniMasuk + nom

        const newKasTrx = {
          id: `kt-${Date.now()}`,
          tgl: 'Hari ini',
          jenis: 'masuk',
          judul: `Iuran Sukarela: ${tujuan}${catatan ? ' (' + catatan + ')' : ''}`,
          kategori: 'Iuran Sukarela',
          nominal: nom,
          oleh: state.currentUser.nama,
        }

        set({
          kasSaldo: newKasSaldo,
          kasBulanIniMasuk: newKasMasuk,
          kasTransaksi: [newKasTrx, ...state.kasTransaksi],
        })
      },

      // IKUT PATUNGAN KEGIATAN
      ikutPatunganKegiatan: (kegiatanId, nominal, sumber = 'dompet') => {
        const state = get()
        const nom = Number(nominal)
        if (nom <= 0) return false

        let newDompetSaldo = state.dompetSaldo
        if (sumber === 'dompet') {
          if (newDompetSaldo < nom) return false
          newDompetSaldo -= nom
        }

        const updatedKegiatan = state.kegiatanList.map(k =>
          k.id === kegiatanId ? { ...k, terkumpul: k.terkumpul + nom } : k
        )

        const targetKegiatan = state.kegiatanList.find(k => k.id === kegiatanId)

        const newTrx = {
          id: `trx-${Date.now()}`,
          icon: '🎉',
          bg: 'bg-[#E6F4EE]',
          judul: `Patungan ${targetKegiatan ? targetKegiatan.nama : 'Kegiatan'}`,
          sub: `${new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })} · Berhasil`,
          amount: -nom,
          type: 'out',
          date: new Date().toISOString().split('T')[0],
        }

        const newKasTrx = {
          id: `kt-${Date.now()}`,
          tgl: 'Hari ini',
          jenis: 'masuk',
          judul: `Patungan ${targetKegiatan?.nama} oleh ${state.currentUser.nama}`,
          kategori: 'Kegiatan',
          nominal: nom,
          oleh: state.currentUser.nama,
        }

        set({
          dompetSaldo: newDompetSaldo,
          kasSaldo: state.kasSaldo + nom,
          kegiatanList: updatedKegiatan,
          transaksi: [newTrx, ...state.transaksi],
          kasTransaksi: [newKasTrx, ...state.kasTransaksi],
        })
        return true
      },

      // DONASI DANA SOSIAL
      donasiSosial: (sosialId, nominal, sumber = 'dompet') => {
        const state = get()
        const nom = Number(nominal)
        if (nom <= 0) return false

        let newDompetSaldo = state.dompetSaldo
        if (sumber === 'dompet') {
          if (newDompetSaldo < nom) return false
          newDompetSaldo -= nom
        }

        const updatedSosial = state.sosialList.map(s =>
          s.id === sosialId ? { ...s, terkumpul: s.terkumpul + nom } : s
        )

        const targetSosial = state.sosialList.find(s => s.id === sosialId)

        const newTrx = {
          id: `trx-${Date.now()}`,
          icon: '❤️',
          bg: 'bg-[#FAEAEA]',
          judul: `Donasi: ${targetSosial ? targetSosial.nama : 'Dana Sosial'}`,
          sub: `${new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })} · Berhasil`,
          amount: -nom,
          type: 'out',
          date: new Date().toISOString().split('T')[0],
        }

        set({
          dompetSaldo: newDompetSaldo,
          kasSaldo: state.kasSaldo + nom,
          sosialList: updatedSosial,
          transaksi: [newTrx, ...state.transaksi],
        })
        return true
      },

      // BAYAR CICILAN PINJAMAN
      bayarCicilanPinjaman: (pinjamanId, nominal) => {
        const state = get()
        const nom = Number(nominal)
        if (state.dompetSaldo < nom) return false

        const updatedPinjaman = state.pinjamanList.map(p => {
          if (p.id === pinjamanId) {
            const newTerbayar = p.terbayar + nom
            const newSisa = Math.max(0, p.sisaPokok - nom)
            const nextCicilan = p.cicilanKe + 1
            return {
              ...p,
              terbayar: newTerbayar,
              sisaPokok: newSisa,
              cicilanKe: Math.min(nextCicilan, p.totalCicilan),
              status: newSisa === 0 ? 'Lunas' : 'Aktif',
            }
          }
          return p
        })

        const newTrx = {
          id: `trx-${Date.now()}`,
          icon: '🏦',
          bg: 'bg-[#E8EEF9]',
          judul: 'Bayar Cicilan Pinjaman Tani',
          sub: `${new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })} · Potong Dompet`,
          amount: -nom,
          type: 'out',
          date: new Date().toISOString().split('T')[0],
        }

        set({
          dompetSaldo: state.dompetSaldo - nom,
          kasSaldo: state.kasSaldo + nom,
          pinjamanList: updatedPinjaman,
          transaksi: [newTrx, ...state.transaksi],
        })
        return true
      },

      // AJUKAN PINJAMAN BARU
      ajukanPinjaman: (data) => set((state) => {
        const newItem = {
          id: `pp-${Date.now()}`,
          nama: state.currentUser.nama,
          jenis: data.jenis || 'Pertanian',
          nominal: Number(data.nominal),
          tenor: `${data.tenor} bln`,
          tujuan: data.tujuan || 'Modal Kerja',
          status: 'pending',
          tgl: 'Hari ini',
          fotoLahan: data.fotoLahan || 'lampiran_lahan.jpg',
          penjamin: data.penjamin || 'Belum diisi',
        }
        const notif = {
          id: `n-${Date.now()}`,
          judul: 'Pengajuan Pinjaman Terkirim',
          pesan: `Pengajuan pinjaman Rp ${Number(data.nominal).toLocaleString('id-ID')} sedang diverifikasi Bendahara.`,
          tgl: 'Baru saja',
          dibaca: false,
          link: '/layanan',
        }
        return {
          pengajuanPinjamanPending: [newItem, ...state.pengajuanPinjamanPending],
          notifikasi: [notif, ...state.notifikasi],
        }
      }),

      // BAYAR SETORAN ARISAN
      bayarArisan: (pesertaNama) => set((state) => {
        const potTambah = state.arisan.nominalSetoran
        const updatedPeserta = state.arisan.peserta.map(p =>
          p.nama === pesertaNama ? { ...p, lunas: true } : p
        )
        const isMe = pesertaNama === state.currentUser.nama
        let newDompet = state.dompetSaldo
        let newTrx = state.transaksi

        if (isMe && newDompet >= potTambah) {
          newDompet -= potTambah
          newTrx = [{
            id: `trx-${Date.now()}`,
            icon: '🎲',
            bg: 'bg-[#FEF3DC]',
            judul: `Setoran ${state.arisan.judul}`,
            sub: 'Nov 2026 · Arisan Digital',
            amount: -potTambah,
            type: 'out',
            date: new Date().toISOString().split('T')[0],
          }, ...state.transaksi]
        }

        return {
          dompetSaldo: newDompet,
          transaksi: newTrx,
          arisan: {
            ...state.arisan,
            pot: state.arisan.pot + potTambah,
            peserta: updatedPeserta,
          }
        }
      }),

      // KOCONG UNDIAN ARISAN & SIMPAN PEMENANG
      simpanPemenangArisan: (pemenangNama, jumlah) => set((state) => {
        const newWinner = {
          nama: pemenangNama,
          bulan: 'November 2026',
          jumlah: jumlah || state.arisan.pot,
        }
        const notif = {
          id: `n-${Date.now()}`,
          judul: 'Pemenang Arisan Terpilih!',
          pesan: `Selamat kepada ${pemenangNama} yang memenangkan pot arisan sebesar Rp ${(jumlah || state.arisan.pot).toLocaleString('id-ID')}.`,
          tgl: 'Baru saja',
          dibaca: false,
          link: '/layanan/arisan',
        }
        return {
          arisan: {
            ...state.arisan,
            riwayatPemenang: [newWinner, ...state.arisan.riwayatPemenang],
          },
          notifikasi: [notif, ...state.notifikasi],
        }
      }),

      // PENGURUS: VERIFIKASI PEMBAYARAN
      verifikasiPembayaranAction: (id, setujui = true) => set((state) => {
        const item = state.verifikasiPembayaranPending.find(v => v.id === id)
        const filtered = state.verifikasiPembayaranPending.filter(v => v.id !== id)
        if (!item || !setujui) {
          return { verifikasiPembayaranPending: filtered }
        }
        // Tambahkan ke kas saldo jika disetujui
        return {
          verifikasiPembayaranPending: filtered,
          kasSaldo: state.kasSaldo + item.jumlah,
          kasBulanIniMasuk: state.kasBulanIniMasuk + item.jumlah,
          kasTransaksi: [{
            id: `kt-${Date.now()}`,
            tgl: 'Hari ini',
            jenis: 'masuk',
            judul: `Verifikasi Lunas: ${item.jenis} (${item.nama})`,
            kategori: 'Iuran Wajib',
            nominal: item.jumlah,
            oleh: item.nama,
          }, ...state.kasTransaksi],
        }
      }),

      // PENGURUS: PERSETUJUAN PINJAMAN (Ketua menyetujui -> cairkan ke peminjam)
      persetujuanPinjamanAction: (id, disetujui = true) => set((state) => {
        const item = state.pengajuanPinjamanPending.find(p => p.id === id)
        const filtered = state.pengajuanPinjamanPending.filter(p => p.id !== id)
        if (!item) return { pengajuanPinjamanPending: filtered }

        if (!disetujui) {
          return { pengajuanPinjamanPending: filtered }
        }

        // Jika disetujui & dicairkan:
        const pinjamanBaru = {
          id: `pj-${Date.now()}`,
          jenis: item.jenis,
          emoji: item.jenis.includes('Tani') ? '🌾' : item.jenis.includes('Ikan') ? '🐟' : '💼',
          judul: `${item.jenis} - ${item.tujuan}`,
          nominal: item.nominal,
          tenorBulan: parseInt(item.tenor) || 6,
          cicilanPerBulan: Math.round((item.nominal * 1.05) / (parseInt(item.tenor) || 6)),
          terbayar: 0,
          sisaPokok: item.nominal,
          cicilanKe: 1,
          totalCicilan: parseInt(item.tenor) || 6,
          status: 'Aktif',
          tglPencairan: 'Hari ini',
          jatuhTempoBerikut: '25 Des 2026',
        }

        // Saldo kas keluar untuk pembiayaan, atau dana masuk ke dompet user jika peminjam adalah user saat ini
        const isCurrentUser = item.nama === state.currentUser.nama

        return {
          pengajuanPinjamanPending: filtered,
          kasSaldo: Math.max(0, state.kasSaldo - item.nominal),
          dompetSaldo: isCurrentUser ? state.dompetSaldo + item.nominal : state.dompetSaldo,
          pinjamanList: isCurrentUser ? [pinjamanBaru, ...state.pinjamanList] : state.pinjamanList,
          kasTransaksi: [{
            id: `kt-${Date.now()}`,
            tgl: 'Hari ini',
            jenis: 'keluar',
            judul: `Pencairan ${item.jenis} ke ${item.nama}`,
            kategori: 'Pembiayaan',
            nominal: item.nominal,
            oleh: 'Ketua Tarunesha',
            disetujui: true,
          }, ...state.kasTransaksi],
        }
      }),

      // PENGURUS: INPUT KAS KELUAR
      inputKasKeluar: (data) => set((state) => {
        const nom = Number(data.nominal)
        const itemBaru = {
          id: `kt-${Date.now()}`,
          tgl: 'Hari ini',
          jenis: 'keluar',
          judul: data.keperluan,
          kategori: data.kategori || 'Operasional',
          nominal: nom,
          oleh: state.currentUser.nama,
          nota: data.nota || 'Nota-Pengeluaran.jpg',
          disetujui: true,
        }
        return {
          kasSaldo: Math.max(0, state.kasSaldo - nom),
          kasBulanIniKeluar: state.kasBulanIniKeluar + nom,
          kasTransaksi: [itemBaru, ...state.kasTransaksi],
        }
      }),

      // PENGURUS: MODE BANTUAN TUNAI (Bendahara input kas tunai anggota manual)
      catatBantuanTunai: (anggotaId, nominal, jenis = 'Iuran Wajib') => set((state) => {
        const nom = Number(nominal)
        const updatedAnggota = state.anggotaList.map(a =>
          a.id === anggotaId ? { ...a, statusIuran: 'lunas' } : a
        )
        const targetAnggota = state.anggotaList.find(a => a.id === anggotaId)
        const nama = targetAnggota ? targetAnggota.nama : 'Anggota'

        const newKasTrx = {
          id: `kt-${Date.now()}`,
          tgl: 'Hari ini',
          jenis: 'masuk',
          judul: `[Tunai] ${jenis} - ${nama}`,
          kategori: jenis,
          nominal: nom,
          oleh: `Bendahara (${nama})`,
        }

        return {
          kasSaldo: state.kasSaldo + nom,
          kasBulanIniMasuk: state.kasBulanIniMasuk + nom,
          anggotaList: updatedAnggota,
          kasTransaksi: [newKasTrx, ...state.kasTransaksi],
        }
      }),

      // PENGURUS: KELOLA ANGGOTA
      toggleAnggotaAktif: (anggotaId) => set((state) => ({
        anggotaList: state.anggotaList.map(a =>
          a.id === anggotaId ? { ...a, aktif: !a.aktif } : a
        )
      })),

      tambahAnggota: (anggotaBaru) => set((state) => ({
        anggotaList: [
          ...state.anggotaList,
          {
            id: `u-${Date.now()}`,
            nama: anggotaBaru.nama,
            peran: anggotaBaru.peran || 'Anggota',
            noHp: anggotaBaru.noHp,
            aktif: true,
            statusIuran: 'belum',
          }
        ]
      })),

      // NOTIFIKASI
      markAllNotifAsRead: () => set((state) => ({
        notifikasi: state.notifikasi.map(n => ({ ...n, dibaca: true }))
      })),

      resetStateKeAwal: () => {
        localStorage.removeItem('patungan-bank-storage')
        window.location.reload()
      }
    }),
    {
      name: 'patungan-bank-storage',
    }
  )
)
