import { useEffect, useMemo, useState, type ReactNode } from "react";
import {
  LayoutDashboard, Users, ArrowLeftRight, FileBarChart, History, UserCircle, LogOut, Search,
  Banknote, ArrowUp, ArrowDown, Plus, Pencil, Trash2, KeyRound, X, ChevronLeft, ChevronRight,
  Lock, User, Eye, EyeOff, Loader2, CheckCircle2, AlertTriangle, Info, XCircle, FileDown,
  FileSpreadsheet, Database, ChevronDown, ChevronsUpDown, Inbox, Wallet, GraduationCap, BookOpen,
  ShieldCheck, PanelLeftClose, PanelLeftOpen, BadgeCheck, CircleAlert,
} from "lucide-react";

/* ───────────────────────── data ───────────────────────── */
type Role = "bendahara" | "anggota";
type Jenis = "Pemasukan" | "Pengeluaran";
type Tx = { id: number; tanggal: string; jenis: Jenis; nama: string; keterangan: string; nominal: number; bulan?: string };
type Member = { nim: string; nama: string; kelas: string; keterangan: string; lunas: boolean };
type Page = "dashboard" | "anggota" | "transaksi" | "laporan" | "riwayat" | "profil";

const rp = (n: number) => "Rp " + n.toLocaleString("id-ID");
const fmtDate = (iso: string) => { const [y, m, d] = iso.split("-"); return `${d}/${m}/${y}`; };
const BULAN_FULL = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
const BULAN = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];

const MEMBERS0: Member[] = [
  { nim: "2310511001", nama: "Budi Utomo", kelas: "TI-3A", keterangan: "Ketua kelas", lunas: true },
  { nim: "2310511002", nama: "Siti Aminah", kelas: "TI-3A", keterangan: "Bendahara", lunas: true },
  { nim: "2310511003", nama: "Rizky Pratama", kelas: "TI-3A", keterangan: "-", lunas: false },
  { nim: "2310511004", nama: "Dewi Lestari", kelas: "TI-3A", keterangan: "-", lunas: true },
  { nim: "2310511005", nama: "Andi Saputra", kelas: "TI-3A", keterangan: "-", lunas: false },
  { nim: "2310511006", nama: "Nur Halimah", kelas: "TI-3A", keterangan: "Sekretaris", lunas: true },
  { nim: "2310511007", nama: "Fajar Nugroho", kelas: "TI-3A", keterangan: "-", lunas: true },
  { nim: "2310511008", nama: "Putri Ayu", kelas: "TI-3A", keterangan: "-", lunas: false },
  { nim: "2310511009", nama: "Yoga Permana", kelas: "TI-3A", keterangan: "-", lunas: true },
];

const RAW_TX: Tx[] = [
  { id: 1, tanggal: "2026-10-12", jenis: "Pemasukan", nama: "Budi Utomo", keterangan: "Iuran Bulanan Okt", nominal: 50000 },
  { id: 2, tanggal: "2026-10-11", jenis: "Pemasukan", nama: "Siti Aminah", keterangan: "Iuran Bulanan Okt", nominal: 50000 },
  { id: 3, tanggal: "2026-10-10", jenis: "Pengeluaran", nama: "-", keterangan: "Beli ATK Kelas", nominal: 150000 },
  { id: 4, tanggal: "2026-10-08", jenis: "Pemasukan", nama: "Dewi Lestari", keterangan: "Iuran Bulanan Okt", nominal: 50000 },
  { id: 5, tanggal: "2026-10-05", jenis: "Pemasukan", nama: "Nur Halimah", keterangan: "Iuran Bulanan Okt", nominal: 50000 },
  { id: 6, tanggal: "2026-09-28", jenis: "Pengeluaran", nama: "-", keterangan: "Cetak Banner Kelas", nominal: 250000 },
  { id: 7, tanggal: "2026-09-20", jenis: "Pemasukan", nama: "Fajar Nugroho", keterangan: "Iuran Bulanan Sep", nominal: 50000 },
  { id: 8, tanggal: "2026-09-15", jenis: "Pengeluaran", nama: "-", keterangan: "Konsumsi Rapat", nominal: 350000 },
  { id: 9, tanggal: "2026-09-10", jenis: "Pemasukan", nama: "Yoga Permana", keterangan: "Iuran Bulanan Sep", nominal: 50000 },
  { id: 10, tanggal: "2026-09-03", jenis: "Pemasukan", nama: "Budi Utomo", keterangan: "Iuran Bulanan Sep", nominal: 50000 },
  { id: 11, tanggal: "2026-08-25", jenis: "Pengeluaran", nama: "-", keterangan: "Kado Dosen Wali", nominal: 400000 },
  { id: 12, tanggal: "2026-08-12", jenis: "Pemasukan", nama: "Siti Aminah", keterangan: "Iuran Bulanan Agu", nominal: 50000 },
  { id: 13, tanggal: "2026-08-05", jenis: "Pemasukan", nama: "Budi Utomo", keterangan: "", nominal: 50000 },
  { id: 14, tanggal: "2026-07-20", jenis: "Pengeluaran", nama: "-", keterangan: "Fotokopi Modul", nominal: 75000 },
  { id: 15, tanggal: "2026-07-08", jenis: "Pemasukan", nama: "Dewi Lestari", keterangan: "", nominal: 50000 },
  { id: 16, tanggal: "2026-07-06", jenis: "Pemasukan", nama: "Budi Utomo", keterangan: "", nominal: 50000 },
  { id: 17, tanggal: "2026-05-14", jenis: "Pengeluaran", nama: "-", keterangan: "Acara Perpisahan Semester", nominal: 300000 },
  { id: 18, tanggal: "2026-04-10", jenis: "Pemasukan", nama: "Siti Aminah", keterangan: "", nominal: 50000 },
  { id: 19, tanggal: "2026-03-09", jenis: "Pemasukan", nama: "Fajar Nugroho", keterangan: "", nominal: 50000 },
  { id: 20, tanggal: "2026-02-11", jenis: "Pemasukan", nama: "Yoga Permana", keterangan: "", nominal: 50000 },
  { id: 21, tanggal: "2026-01-12", jenis: "Pemasukan", nama: "Budi Utomo", keterangan: "", nominal: 50000 },
];
const ketIuran = (ym: string) => `Iuran Bulan ${BULAN_FULL[Number(ym.slice(5, 7)) - 1]} ${ym.slice(0, 4)}`;
// Pemasukan dicatat per bulan iuran agar rekap terbentuk otomatis
const TX0: Tx[] = RAW_TX.map(t => t.jenis === "Pemasukan" ? { ...t, bulan: t.tanggal.slice(0, 7), keterangan: ketIuran(t.tanggal.slice(0, 7)) } : t);
/** Bulan rekap: bulan iuran untuk pemasukan, bulan tanggal untuk pengeluaran */
const bulanOf = (t: Tx) => t.bulan ?? t.tanggal.slice(0, 7);
const months = (y: number, from: number) => Array.from({ length: 6 }, (_, i) => `${y}-${String(from + i).padStart(2, "0")}`);
const SEMESTERS = [
  { id: "ganjil-2026", label: "Semester Ganjil 2026/2027", months: months(2026, 7) },
  { id: "genap-2026", label: "Semester Genap 2025/2026", months: months(2026, 1) },
];
const BULAN_IURAN = [...SEMESTERS[1].months, ...SEMESTERS[0].months];
const labelBulan = (ym: string) => `${BULAN_FULL[Number(ym.slice(5, 7)) - 1]} ${ym.slice(0, 4)}`;
function rekapSemester(txs: Tx[], smt: (typeof SEMESTERS)[number]) {
  const first = smt.months[0];
  const saldoAwal = txs.filter(t => bulanOf(t) < first).reduce((s, t) => s + (t.jenis === "Pemasukan" ? t.nominal : -t.nominal), 0);
  let run = saldoAwal;
  const rows = smt.months.map(ym => {
    const inn = txs.filter(t => t.jenis === "Pemasukan" && bulanOf(t) === ym).reduce((s, t) => s + t.nominal, 0);
    const out = txs.filter(t => t.jenis === "Pengeluaran" && bulanOf(t) === ym).reduce((s, t) => s + t.nominal, 0);
    run += inn - out;
    return { ym, m: BULAN[Number(ym.slice(5, 7)) - 1], in: inn, out, saldo: run };
  });
  const tin = rows.reduce((s, r) => s + r.in, 0), tout = rows.reduce((s, r) => s + r.out, 0);
  return { rows, saldoAwal, tin, tout, saldoAkhir: run };
}


/* ───────────────────────── primitives ───────────────────────── */
const cx = (...c: (string | false | undefined | null)[]) => c.filter(Boolean).join(" ");

type BtnV = "primary" | "secondary" | "danger" | "ghost";
function Button({ v = "primary", icon, children, loading, className, ...p }:
  { v?: BtnV; icon?: ReactNode; loading?: boolean } & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const vs: Record<BtnV, string> = {
    primary: "bg-navy text-white hover:bg-navy-deep active:scale-[.98]",
    secondary: "bg-[#EDF1F7] text-ink hover:bg-[#E2E8F1]",
    danger: "bg-danger text-white hover:bg-[#A82020]",
    ghost: "text-navy hover:bg-navy/5",
  };
  return (
    <button {...p} disabled={p.disabled || loading}
      className={cx("inline-flex items-center justify-center gap-2 h-11 px-4 rounded-lg text-[13px] font-medium transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer whitespace-nowrap focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue", vs[v], className)}>
      {loading ? <Loader2 size={18} className="animate-spin" /> : icon}
      {children}
    </button>
  );
}

function IconBtn({ label, tone = "navy", children, onClick }: { label: string; tone?: "navy" | "danger" | "muted"; children: ReactNode; onClick?: () => void }) {
  const t = { navy: "text-navy hover:bg-navy/8", danger: "text-danger hover:bg-danger/8", muted: "text-muted hover:bg-ink/5" }[tone];
  return <button aria-label={label} title={label} onClick={onClick} className={cx("size-9 grid place-items-center rounded-lg transition cursor-pointer", t)}>{children}</button>;
}

function Field({ label, error, children, hint }: { label: string; error?: string; hint?: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="block text-[13px] font-medium text-ink mb-1.5">{label}</span>
      {children}
      {error ? <span className="flex items-center gap-1 mt-1.5 text-xs text-danger"><CircleAlert size={13} />{error}</span>
        : hint ? <span className="block mt-1.5 text-xs text-muted">{hint}</span> : null}
    </label>
  );
}
const inputCls = (err?: boolean) => cx("w-full h-11 rounded-lg border bg-white px-3 text-sm text-ink placeholder:text-muted/70 outline-none transition focus:border-navy focus:ring-3 focus:ring-navy/10 disabled:bg-app disabled:text-muted", err ? "border-danger" : "border-line");

function Badge({ kind }: { kind: "Lunas" | "Belum Bayar" | Jenis }) {
  const map = {
    "Lunas": ["bg-success/10 text-success", <BadgeCheck size={13} />],
    "Belum Bayar": ["bg-danger/10 text-danger", <CircleAlert size={13} />],
    "Pemasukan": ["bg-income-accent/12 text-[#1F6FAE]", <ArrowUp size={13} />],
    "Pengeluaran": ["bg-expense-accent/12 text-[#B2511F]", <ArrowDown size={13} />],
  } as const;
  const [c, i] = map[kind];
  return <span className={cx("inline-flex items-center gap-1 h-6 px-2.5 rounded-full text-xs font-medium", c)}>{i}{kind}</span>;
}

function Card({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cx("bg-white rounded-2xl shadow-soft", className)}>{children}</div>;
}

/* summary card */
function Summary({ variant, label, value, sub }: { variant: "saldo" | "in" | "out" | "status"; label: string; value: ReactNode; sub?: string }) {
  const s = {
    saldo: { bg: "bg-success text-white", ic: <Banknote size={24} />, icw: "bg-white/18 text-white", lab: "text-white/85" },
    in: { bg: "bg-income text-ink", ic: <ArrowUp size={22} />, icw: "bg-income-accent text-white", lab: "text-[#1F5E92]" },
    out: { bg: "bg-expense text-ink", ic: <ArrowDown size={22} />, icw: "bg-expense-accent text-white", lab: "text-[#9A4416]" },
    status: { bg: "bg-white text-ink", ic: <ShieldCheck size={22} />, icw: "bg-navy text-white", lab: "text-muted" },
  }[variant];
  return (
    <div className={cx("relative overflow-hidden rounded-2xl p-5 md:p-6 shadow-soft rise", s.bg)}>
      <div className="absolute -right-8 -bottom-10 size-36 rounded-full bg-white/15" />
      <div className="relative flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className={cx("text-xs font-medium tracking-[.08em] uppercase", s.lab)}>{label}</p>
          <div className="mt-3 text-[26px] md:text-[28px] leading-9 font-bold num">{value}</div>
          {sub && <p className={cx("mt-1 text-xs", s.lab)}>{sub}</p>}
        </div>
        <span className={cx("size-12 shrink-0 grid place-items-center rounded-full", s.icw)}>{s.ic}</span>
      </div>
    </div>
  );
}

/* modal */
function Modal({ title, open, onClose, children, footer, width = "max-w-lg" }: { title: string; open: boolean; onClose: () => void; children: ReactNode; footer?: ReactNode; width?: string }) {
  useEffect(() => {
    if (!open) return;
    const h = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", h); return () => window.removeEventListener("keydown", h);
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 grid place-items-end sm:place-items-center p-0 sm:p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div role="dialog" aria-modal aria-label={title} className={cx("relative w-full bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl rise overflow-hidden", width)}>
        <div className="flex items-center justify-between px-6 h-16 bg-[#F1F4F9] border-b border-line">
          <h3 className="text-lg font-medium text-ink">{title}</h3>
          <IconBtn label="Tutup" tone="muted" onClick={onClose}><X size={20} /></IconBtn>
        </div>
        <div className="p-6 max-h-[65vh] overflow-y-auto">{children}</div>
        {footer && <div className="flex justify-end gap-3 px-6 py-4 border-t border-line">{footer}</div>}
      </div>
    </div>
  );
}

function Confirm({ open, onClose, onConfirm, what }: { open: boolean; onClose: () => void; onConfirm: () => void; what: string }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 grid place-items-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div role="alertdialog" className="relative w-full max-w-sm bg-white rounded-2xl p-6 shadow-2xl rise text-center">
        <span className="mx-auto size-14 grid place-items-center rounded-full bg-danger/10 text-danger"><Trash2 size={24} /></span>
        <h3 className="mt-4 text-lg font-bold">Yakin ingin menghapus?</h3>
        <p className="mt-1 text-sm text-muted">{what} akan dihapus permanen dan tidak dapat dikembalikan.</p>
        <div className="mt-6 grid grid-cols-2 gap-3">
          <Button v="secondary" onClick={onClose}>Batal</Button>
          <Button v="danger" onClick={onConfirm}>Hapus</Button>
        </div>
      </div>
    </div>
  );
}

/* toast */
type ToastT = { id: number; kind: "sukses" | "error" | "peringatan" | "info"; msg: string };
function Toasts({ items, dismiss }: { items: ToastT[]; dismiss: (id: number) => void }) {
  const st = {
    sukses: ["border-success", "text-success", <CheckCircle2 size={20} />],
    error: ["border-danger", "text-danger", <XCircle size={20} />],
    peringatan: ["border-warning", "text-[#A77800]", <AlertTriangle size={20} />],
    info: ["border-blue", "text-navy", <Info size={20} />],
  } as const;
  return (
    <div className="fixed z-[60] top-4 right-4 left-4 sm:left-auto sm:w-96 space-y-2">
      {items.map(t => {
        const [b, c, i] = st[t.kind];
        return (
          <div key={t.id} className={cx("rise flex items-start gap-3 bg-white rounded-xl shadow-soft border-l-4 p-4", b)}>
            <span className={c}>{i}</span>
            <div className="flex-1"><p className={cx("text-[13px] font-medium capitalize", c)}>{t.kind}</p><p className="text-sm text-ink">{t.msg}</p></div>
            <button aria-label="Tutup" onClick={() => dismiss(t.id)} className="text-muted hover:text-ink cursor-pointer"><X size={16} /></button>
          </div>
        );
      })}
    </div>
  );
}

/* table */
type Col<T> = { key: string; label: string; right?: boolean; sort?: (a: T, b: T) => number; render: (r: T) => ReactNode; mobileHide?: boolean };
function DataTable<T>({ rows, cols, pageSize = 6, loading, empty = "Belum ada data", mobileCard }: { rows: T[]; cols: Col<T>[]; pageSize?: number; loading?: boolean; empty?: string; mobileCard?: (r: T) => ReactNode }) {
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState<{ k: string; d: 1 | -1 } | null>(null);
  const sorted = useMemo(() => {
    if (!sort) return rows;
    const c = cols.find(c => c.key === sort.k); if (!c?.sort) return rows;
    return [...rows].sort((a, b) => c.sort!(a, b) * sort.d);
  }, [rows, sort, cols]);
  const pages = Math.max(1, Math.ceil(sorted.length / pageSize));
  useEffect(() => { if (page > pages) setPage(pages); }, [pages, page]);
  const slice = sorted.slice((page - 1) * pageSize, page * pageSize);
  const from = sorted.length ? (page - 1) * pageSize + 1 : 0;

  return (
    <div className="rounded-xl border border-line overflow-hidden bg-white">
      {/* desktop table */}
      <div className={cx("overflow-x-auto", mobileCard && "hidden sm:block")}>
        <table className="w-full text-sm min-w-[640px]">
          <thead>
            <tr className="bg-navy text-white">
              {cols.map(c => (
                <th key={c.key} className={cx("h-12 px-4 font-medium text-[13px]", c.right ? "text-right" : "text-left")}>
                  {c.sort ? (
                    <button onClick={() => setSort(s => s?.k === c.key ? { k: c.key, d: s.d === 1 ? -1 : 1 } : { k: c.key, d: 1 })}
                      className={cx("inline-flex items-center gap-1 cursor-pointer hover:text-blue-light", c.right && "flex-row-reverse")}>
                      {c.label}
                      {sort?.k === c.key ? (sort.d === 1 ? <ArrowUp size={13} /> : <ArrowDown size={13} />) : <ChevronsUpDown size={13} className="opacity-60" />}
                    </button>
                  ) : c.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? Array.from({ length: 4 }).map((_, i) => (
              <tr key={i} className="border-t border-line">{cols.map(c => <td key={c.key} className="px-4 h-14"><div className="h-3 rounded bg-line animate-pulse" style={{ width: `${50 + ((i * 17 + c.key.length * 9) % 40)}%` }} /></td>)}</tr>
            )) : slice.length === 0 ? (
              <tr><td colSpan={cols.length}><EmptyState text={empty} /></td></tr>
            ) : slice.map((r, i) => (
              <tr key={i} className="border-t border-line even:bg-[#F8FAFD] hover:bg-income/30 transition-colors">
                {cols.map(c => <td key={c.key} className={cx("px-4 h-14", c.right && "text-right num")}>{c.render(r)}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* mobile card list */}
      {mobileCard && (
        <div className="sm:hidden divide-y divide-line">
          {loading ? <div className="p-4 space-y-3">{[1, 2, 3].map(i => <div key={i} className="h-14 rounded-lg bg-line animate-pulse" />)}</div>
            : slice.length === 0 ? <EmptyState text={empty} /> : slice.map((r, i) => <div key={i} className="p-4">{mobileCard(r)}</div>)}
        </div>
      )}
      {/* pagination */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-3 border-t border-line bg-white">
        <p className="text-xs text-muted">Menampilkan <b className="text-ink num">{from}–{Math.min(page * pageSize, sorted.length)}</b> dari <b className="text-ink num">{sorted.length}</b> data</p>
        <div className="flex items-center gap-1">
          <IconBtn label="Sebelumnya" tone="muted" onClick={() => setPage(p => Math.max(1, p - 1))}><ChevronLeft size={18} /></IconBtn>
          {Array.from({ length: pages }).map((_, i) => (
            <button key={i} onClick={() => setPage(i + 1)} aria-current={page === i + 1}
              className={cx("size-9 rounded-lg text-[13px] font-medium num cursor-pointer transition", page === i + 1 ? "bg-navy text-white" : "text-ink hover:bg-app")}>{i + 1}</button>
          ))}
          <IconBtn label="Berikutnya" tone="muted" onClick={() => setPage(p => Math.min(pages, p + 1))}><ChevronRight size={18} /></IconBtn>
        </div>
      </div>
    </div>
  );
}
function EmptyState({ text }: { text: string }) {
  return (
    <div className="py-14 text-center">
      <span className="mx-auto size-14 grid place-items-center rounded-full bg-app text-muted"><Inbox size={26} /></span>
      <p className="mt-3 text-sm font-medium text-ink">{text}</p>
      <p className="text-xs text-muted">Coba ubah filter atau tambahkan data baru.</p>
    </div>
  );
}

/* ───────────────────────── auth ───────────────────────── */
function AuthShell({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[#0B3A75] via-[#2C6FC4] to-[#5FA6F7] grid place-items-center p-4 sm:p-8">
      {/* decoration */}
      <div className="absolute -top-32 -left-24 size-[480px] rounded-full bg-blue-light/25 blur-3xl" />
      <div className="absolute -bottom-40 -right-20 size-[520px] rounded-full bg-[#0B3A75]/50 blur-3xl" />
      <div aria-hidden className="hidden md:block">
        <div className="floaty absolute left-[8%] top-[16%] [--r:-12deg]"><div className="size-24 rounded-2xl bg-white/15 border border-white/30 backdrop-blur grid place-items-center text-white"><BookOpen size={44} strokeWidth={1.5} /></div></div>
        <div className="floaty absolute left-[12%] bottom-[14%] [--r:8deg] [animation-delay:-2s]"><div className="size-28 rounded-full bg-gradient-to-br from-[#FFE08A] to-warning border-4 border-[#FFF2C4] shadow-xl grid place-items-center text-[#7A5300] text-2xl font-bold">Rp</div></div>
        <div className="floaty absolute right-[9%] top-[14%] [--r:14deg] [animation-delay:-4s]"><div className="size-28 rounded-2xl bg-white/15 border border-white/30 backdrop-blur grid place-items-center text-white"><GraduationCap size={56} strokeWidth={1.5} /></div></div>
        <div className="floaty absolute right-[13%] bottom-[18%] [--r:-6deg] [animation-delay:-1s]"><div className="size-16 rounded-full bg-gradient-to-br from-[#FFE08A] to-warning border-4 border-[#FFF2C4] shadow-xl grid place-items-center text-[#7A5300] text-sm font-bold">Rp</div></div>
      </div>
      <div className="relative w-full max-w-[560px] rise">
        <div className="flex items-center justify-center gap-2.5 mb-6 text-white">
          <span className="size-10 rounded-xl bg-white text-navy grid place-items-center"><Wallet size={22} /></span>
          <span className="text-2xl font-bold tracking-tight">Payclass</span>
        </div>
        {/* glass card — darkened tint guarantees ≥4.5:1 for white text */}
        <div className="rounded-2xl border border-white/35 bg-[#0B3A75]/35 backdrop-blur-xl shadow-[0_20px_60px_rgba(4,25,55,.35)] px-6 py-8 sm:px-12 sm:py-10 text-white">
          {children}
        </div>
      </div>
    </div>
  );
}
function PillInput({ icon, label, type = "text", value, onChange, error, placeholder }: { icon: ReactNode; label: string; type?: string; value: string; onChange: (v: string) => void; error?: boolean; placeholder?: string }) {
  const [show, setShow] = useState(false);
  const isPw = type === "password";
  return (
    <label className="block">
      <span className="block text-[13px] font-medium mb-1.5 text-white">{label}</span>
      <span className={cx("flex items-center gap-3 h-12 rounded-full border bg-white/10 px-5 transition focus-within:bg-white/20 focus-within:border-white", error ? "border-[#FFB4B4]" : "border-white/50")}>
        <span className="text-white/90">{icon}</span>
        <input type={isPw && !show ? "password" : "text"} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
          className="flex-1 bg-transparent outline-none text-sm text-white placeholder:text-white/70 min-w-0" />
        {isPw && <button type="button" aria-label={show ? "Sembunyikan kata sandi" : "Lihat kata sandi"} onClick={() => setShow(s => !s)} className="text-white/90 cursor-pointer">{show ? <EyeOff size={18} /> : <Eye size={18} />}</button>}
      </span>
    </label>
  );
}
const WhiteBtn = ({ loading, children }: { loading?: boolean; children: ReactNode }) => (
  <button type="submit" disabled={loading} className="w-full h-12 rounded-full bg-white text-navy font-bold text-[15px] hover:bg-[#EAF3FF] active:scale-[.99] transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-80">
    {loading && <Loader2 size={18} className="animate-spin" />}{children}
  </button>
);
const AuthErr = ({ msg }: { msg: string }) => (
  <div role="alert" className="flex items-center gap-2 rounded-xl bg-[#C62828]/85 border border-[#FFB4B4]/60 px-4 py-3 text-sm"><XCircle size={18} />{msg}</div>
);

function Login({ onLogin, go }: { onLogin: (r: Role) => void; go: (v: "register" | "forgot") => void }) {
  const [nim, setNim] = useState(""); const [pw, setPw] = useState("");
  const [err, setErr] = useState(""); const [loading, setLoading] = useState(false);
  const submit = (e: React.FormEvent) => {
    e.preventDefault(); setErr("");
    if (!nim || !pw) return setErr("NIM dan kata sandi wajib diisi.");
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      if (pw.length < 4) return setErr("NIM atau kata sandi salah. Silakan coba lagi.");
      onLogin(nim === "bendahara" || nim === "2310511002" ? "bendahara" : "anggota");
    }, 900);
  };
  return (
    <AuthShell>
      <h1 className="text-[32px] leading-10 font-bold text-center">Masuk</h1>
      <p className="text-center text-sm text-white/90 mt-1 mb-7">Masuk untuk mengelola kas kelas</p>
      <form onSubmit={submit} className="space-y-4">
        {err && <AuthErr msg={err} />}
        <PillInput icon={<User size={18} />} label="NIM" value={nim} onChange={setNim} placeholder="Masukkan NIM" error={!!err} />
        <PillInput icon={<Lock size={18} />} label="Kata Sandi" type="password" value={pw} onChange={setPw} placeholder="Masukkan kata sandi" error={!!err} />
        <div className="flex items-center justify-between text-[13px] pt-1">
          <label className="flex items-center gap-2 cursor-pointer min-h-11"><input type="checkbox" className="size-4 accent-white" defaultChecked /> Ingat Saya</label>
          <button type="button" onClick={() => go("forgot")} className="font-medium underline underline-offset-4 cursor-pointer min-h-11">Lupa Kata Sandi?</button>
        </div>
        <WhiteBtn loading={loading}>{loading ? "Memproses…" : "Masuk"}</WhiteBtn>
      </form>
      <p className="text-center text-sm mt-6">Belum punya akun? <button onClick={() => go("register")} className="font-bold underline underline-offset-4 cursor-pointer">Daftar</button></p>
      <div className="mt-6 grid grid-cols-2 gap-2 text-xs">
        <button onClick={() => onLogin("bendahara")} className="h-11 rounded-full border border-white/40 hover:bg-white/10 cursor-pointer">Coba sebagai Bendahara</button>
        <button onClick={() => onLogin("anggota")} className="h-11 rounded-full border border-white/40 hover:bg-white/10 cursor-pointer">Coba sebagai Anggota</button>
      </div>
    </AuthShell>
  );
}
function Register({ back, toast }: { back: () => void; toast: (k: ToastT["kind"], m: string) => void }) {
  const [f, setF] = useState({ nim: "", nama: "", pw: "", pw2: "" }); const [err, setErr] = useState(""); const [loading, setL] = useState(false);
  const set = (k: keyof typeof f) => (v: string) => setF({ ...f, [k]: v });
  const submit = (e: React.FormEvent) => {
    e.preventDefault(); setErr("");
    if (!f.nim || !f.nama || !f.pw) return setErr("Semua kolom wajib diisi.");
    if (f.pw !== f.pw2) return setErr("Konfirmasi kata sandi tidak cocok.");
    setL(true); setTimeout(() => { setL(false); toast("sukses", "Akun berhasil diaktivasi. Silakan login."); back(); }, 900);
  };
  return (
    <AuthShell>
      <h1 className="text-[32px] leading-10 font-bold text-center">Aktivasi Akun</h1>
      <p className="text-center text-sm text-white/90 mt-1 mb-7">Daftarkan NIM yang sudah terdata oleh bendahara</p>
      <form onSubmit={submit} className="space-y-4">
        {err && <AuthErr msg={err} />}
        <PillInput icon={<User size={18} />} label="NIM" value={f.nim} onChange={set("nim")} placeholder="Nomor Induk Mahasiswa" />
        <PillInput icon={<UserCircle size={18} />} label="Nama Lengkap" value={f.nama} onChange={set("nama")} placeholder="Sesuai KTM" />
        <div className="grid sm:grid-cols-2 gap-4">
          <PillInput icon={<Lock size={18} />} label="Kata Sandi" type="password" value={f.pw} onChange={set("pw")} placeholder="Min. 8 karakter" />
          <PillInput icon={<Lock size={18} />} label="Konfirmasi Kata Sandi" type="password" value={f.pw2} onChange={set("pw2")} placeholder="Ulangi kata sandi" error={!!f.pw2 && f.pw !== f.pw2} />
        </div>
        <div className="pt-2"><WhiteBtn loading={loading}>Daftar</WhiteBtn></div>
      </form>
      <p className="text-center text-sm mt-6">Sudah punya akun? <button onClick={back} className="font-bold underline underline-offset-4 cursor-pointer">Kembali ke Halaman Masuk</button></p>
    </AuthShell>
  );
}
function Forgot({ back }: { back: () => void }) {
  const [nim, setNim] = useState(""); const [sent, setSent] = useState(false); const [loading, setL] = useState(false);
  return (
    <AuthShell>
      <h1 className="text-[32px] leading-10 font-bold text-center">Lupa Kata Sandi</h1>
      <p className="text-center text-sm text-white/90 mt-1 mb-7">Masukkan NIM, permintaan reset akan dikirim ke bendahara kelas</p>
      {sent ? (
        <div className="text-center space-y-4">
          <span className="mx-auto size-16 grid place-items-center rounded-full bg-white text-success"><CheckCircle2 size={32} /></span>
          <p className="text-sm">Permintaan atur ulang untuk NIM <b className="num">{nim}</b> telah dikirim. Bendahara akan memberikan kata sandi sementara.</p>
        </div>
      ) : (
        <form onSubmit={e => { e.preventDefault(); if (!nim) return; setL(true); setTimeout(() => { setL(false); setSent(true); }, 900); }} className="space-y-5">
          <PillInput icon={<User size={18} />} label="NIM" value={nim} onChange={setNim} placeholder="Masukkan NIM" />
          <WhiteBtn loading={loading}>Kirim Permintaan Atur Ulang</WhiteBtn>
        </form>
      )}
      <p className="text-center text-sm mt-6"><button onClick={back} className="font-bold underline underline-offset-4 cursor-pointer inline-flex items-center gap-1 min-h-11"><ChevronLeft size={16} />Kembali ke Halaman Masuk</button></p>
    </AuthShell>
  );
}

/* ───────────────────────── shell ───────────────────────── */
type NavItem = { id: Page; label: string; icon: ReactNode; group?: string };
const NAV_B: NavItem[] = [
  { id: "dashboard", label: "Dasbor", icon: <LayoutDashboard size={20} /> },
  { id: "anggota", label: "Anggota", icon: <Users size={20} />, group: "master" },
  { id: "transaksi", label: "Transaksi", icon: <ArrowLeftRight size={20} />, group: "master" },
  { id: "laporan", label: "Laporan", icon: <FileBarChart size={20} /> },
];
const NAV_A: NavItem[] = [
  { id: "dashboard", label: "Dasbor", icon: <LayoutDashboard size={20} /> },
  { id: "riwayat", label: "Riwayat Iuran", icon: <History size={20} /> },
];
const TITLES: Record<Page, [string, string]> = {
  dashboard: ["Ringkasan", "Dasbor"], anggota: ["Data Master", "Data Anggota"], transaksi: ["Data Master", "Data Transaksi"],
  laporan: ["Rekapitulasi", "Laporan Kas"], riwayat: ["Iuran Saya", "Riwayat Iuran"], profil: ["Akun", "Profil Saya"],
};

function Avatar({ name, size = "size-10" }: { name: string; size?: string }) {
  const ini = name.split(" ").map(w => w[0]).slice(0, 2).join("");
  return <span className={cx("shrink-0 rounded-full bg-gradient-to-br from-blue-light to-blue text-white grid place-items-center font-bold text-sm", size)}>{ini}</span>;
}

function Sidebar({ role, page, setPage, user, collapsed, toggle }: { role: Role; page: Page; setPage: (p: Page) => void; user: { nama: string }; collapsed: boolean; toggle: () => void }) {
  const items = role === "bendahara" ? NAV_B : NAV_A;
  const [open, setOpen] = useState(true);
  const Item = ({ it, sub }: { it: NavItem; sub?: boolean }) => (
    <button onClick={() => setPage(it.id)} title={collapsed ? it.label : undefined} aria-current={page === it.id ? "page" : undefined}
      className={cx("relative w-full flex items-center gap-3 h-11 rounded-lg text-sm transition cursor-pointer",
        collapsed ? "justify-center" : "px-3", sub && !collapsed && "pl-4",
        page === it.id ? "bg-white/15 text-white font-medium" : "text-white/80 hover:bg-white/8 hover:text-white")}>
      {page === it.id && <span className="absolute left-0 top-2 bottom-2 w-1 rounded-r bg-blue-light" />}
      {it.icon}{!collapsed && it.label}
    </button>
  );
  const top = items.filter(i => !i.group), master = items.filter(i => i.group === "master");
  return (
    <aside className={cx("hidden md:flex flex-col shrink-0 bg-navy text-white h-screen sticky top-0 transition-[width] duration-300", collapsed ? "w-[84px]" : "w-[260px]")}>
      <div className={cx("flex items-center h-24 gap-3", collapsed ? "justify-center" : "px-6")}>
        <span className="size-10 rounded-xl bg-white text-navy grid place-items-center"><Wallet size={22} /></span>
        {!collapsed && <div><p className="text-xl font-bold leading-tight">Payclass</p><p className="text-[11px] text-white/70 uppercase tracking-wider">{role === "bendahara" ? "Bendahara" : "Anggota"} · TI-3A</p></div>}
      </div>
      <nav className={cx("flex-1 space-y-1", collapsed ? "px-3" : "px-4")}>
        {!collapsed && <p className="px-3 pt-2 pb-2 text-[11px] uppercase tracking-wider text-white/55">Menu</p>}
        {top.slice(0, 1).map(it => <Item key={it.id} it={it} />)}
        {master.length > 0 && (collapsed ? master.map(it => <Item key={it.id} it={it} />) : (
          <div>
            <button onClick={() => setOpen(o => !o)} className="w-full flex items-center gap-3 h-11 px-3 rounded-lg text-sm text-white/80 hover:bg-white/8 cursor-pointer">
              <Database size={20} /> Data Master <ChevronDown size={16} className={cx("ml-auto transition", !open && "-rotate-90")} />
            </button>
            {open && <div className="ml-[22px] pl-2 border-l border-white/20 space-y-1 mt-1">{master.map(it => <Item key={it.id} it={it} sub />)}</div>}
          </div>
        ))}
        {top.slice(1).map(it => <Item key={it.id} it={it} />)}
      </nav>
      <div className={cx("p-4 border-t border-white/10 space-y-2", collapsed && "px-3")}>
        <button onClick={toggle} className={cx("hidden md:flex lg:hidden xl:flex w-full items-center gap-3 h-11 rounded-lg text-sm text-white/70 hover:bg-white/8 cursor-pointer", collapsed ? "justify-center" : "px-3")}>
          {collapsed ? <PanelLeftOpen size={20} /> : <><PanelLeftClose size={20} />Ciutkan</>}
        </button>
        <button onClick={() => setPage("profil")} className={cx("w-full flex items-center gap-3 rounded-lg p-2 hover:bg-white/8 cursor-pointer text-left", page === "profil" && "bg-white/15", collapsed && "justify-center")}>
          <Avatar name={user.nama} />
          {!collapsed && <div className="min-w-0"><p className="text-sm font-medium truncate">{user.nama}</p><p className="text-xs text-white/65 capitalize">{role}</p></div>}
        </button>
      </div>
    </aside>
  );
}

function Header({ page, user, setPage, search, setSearch }: { page: Page; user: { nama: string }; setPage: (p: Page) => void; search: string; setSearch: (s: string) => void }) {
  const [k, t] = TITLES[page];
  return (
    <header className="bg-navy text-white h-20 md:h-24 flex items-center gap-4 px-4 md:px-8 sticky top-0 z-30">
      <span className="md:hidden size-10 rounded-xl bg-white text-navy grid place-items-center"><Wallet size={20} /></span>
      <div className="min-w-0">
        <p className="text-[11px] md:text-xs uppercase tracking-[.14em] text-blue-light font-medium">{k}</p>
        <h1 className="text-xl md:text-[28px] md:leading-9 font-bold truncate">{t}</h1>
      </div>
      <div className="ml-auto flex items-center gap-3">
        <label className="hidden lg:flex items-center gap-2 h-11 w-72 rounded-full bg-white/10 border border-white/20 px-4 focus-within:bg-white/15 focus-within:border-white/50">
          <Search size={18} className="text-white/75" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Cari transaksi atau anggota…" aria-label="Pencarian" className="bg-transparent outline-none text-sm flex-1 placeholder:text-white/65" />
        </label>
        <button onClick={() => setPage("profil")} className="flex items-center gap-3 rounded-full pl-1 pr-1 md:pr-4 h-11 hover:bg-white/10 cursor-pointer" aria-label="Profil">
          <Avatar name={user.nama} />
          <span className="hidden md:block text-sm font-medium">{user.nama.split(" ")[0]}</span>
          <ChevronDown size={16} className="hidden md:block text-white/70" />
        </button>
      </div>
    </header>
  );
}

function BottomNav({ role, page, setPage }: { role: Role; page: Page; setPage: (p: Page) => void }) {
  const items = [...(role === "bendahara" ? NAV_B : NAV_A), { id: "profil" as Page, label: "Profil", icon: <UserCircle size={20} /> }];
  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-white border-t border-line grid pb-[env(safe-area-inset-bottom)]" style={{ gridTemplateColumns: `repeat(${items.length}, 1fr)` }}>
      {items.map(it => (
        <button key={it.id} onClick={() => setPage(it.id)} className={cx("h-16 flex flex-col items-center justify-center gap-1 text-[11px] font-medium cursor-pointer", page === it.id ? "text-navy" : "text-muted")}>
          <span className={cx("px-4 py-1 rounded-full", page === it.id && "bg-income")}>{it.icon}</span>{it.label.split(" ")[0]}
        </button>
      ))}
    </nav>
  );
}

/* ───────────────────────── chart ───────────────────────── */
function BarChart({ txs }: { txs: Tx[] }) {
  const MONTHLY = rekapSemester(txs, SEMESTERS[0]).rows;
  const max = Math.max(1, ...MONTHLY.flatMap(m => [m.in, m.out]));
  return (
    <Card className="p-6">
      <div className="flex items-start justify-between gap-4 mb-6">
        <div><h3 className="text-lg font-medium">Pemasukan vs Pengeluaran</h3><p className="text-xs text-muted">{SEMESTERS[0].label}</p></div>
        <div className="flex gap-4 text-xs text-muted">
          <span className="flex items-center gap-1.5"><i className="size-2.5 rounded-sm bg-income-accent" />Pemasukan</span>
          <span className="flex items-center gap-1.5"><i className="size-2.5 rounded-sm bg-expense-accent" />Pengeluaran</span>
        </div>
      </div>
      <div className="relative h-52 flex items-end gap-3 sm:gap-6 border-b border-line">
        {[0.25, 0.5, 0.75, 1].map(g => <div key={g} className="absolute inset-x-0 border-t border-dashed border-line" style={{ bottom: `${g * 100}%` }} />)}
        {MONTHLY.map(m => (
          <div key={m.m} className="relative flex-1 h-full flex items-end justify-center gap-1 group">
            <div className="w-1/3 max-w-5 rounded-t bg-income-accent transition-all group-hover:brightness-110" style={{ height: `${(m.in / max) * 100}%` }} />
            <div className="w-1/3 max-w-5 rounded-t bg-expense-accent transition-all group-hover:brightness-110" style={{ height: `${(m.out / max) * 100}%` }} />
            <div className="absolute bottom-full mb-2 hidden group-hover:block z-10 whitespace-nowrap rounded-lg bg-ink text-white text-xs px-3 py-2 shadow-lg num">
              <p className="font-medium mb-0.5">{m.m} 2026</p><p>Masuk {rp(m.in)}</p><p>Keluar {rp(m.out)}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="flex gap-3 sm:gap-6 mt-2">{MONTHLY.map(m => <p key={m.m} className="flex-1 text-center text-xs text-muted">{m.m}</p>)}</div>
    </Card>
  );
}

/* ───────────────────────── pages ───────────────────────── */
function txCols(onEdit?: (t: Tx) => void, onDel?: (t: Tx) => void): Col<Tx>[] {
  const c: Col<Tx>[] = [
    { key: "tanggal", label: "Tanggal", sort: (a, b) => a.tanggal.localeCompare(b.tanggal), render: r => <span className="num text-ink">{fmtDate(r.tanggal)}</span> },
    { key: "jenis", label: "Jenis", render: r => <Badge kind={r.jenis} /> },
    { key: "nama", label: "Nama Anggota", sort: (a, b) => a.nama.localeCompare(b.nama), render: r => r.nama === "-" ? <span className="text-muted">—</span> : <span className="font-medium">{r.nama}</span> },
    { key: "ket", label: "Keterangan", render: r => <span className="text-muted">{r.keterangan}</span> },
    { key: "nominal", label: "Nominal", right: true, sort: (a, b) => a.nominal - b.nominal, render: r => <span className={cx("font-medium", r.jenis === "Pemasukan" ? "text-success" : "text-[#B2511F]")}>{r.jenis === "Pemasukan" ? "+" : "−"} {rp(r.nominal)}</span> },
  ];
  if (onEdit && onDel) c.push({ key: "aksi", label: "Aksi", right: true, render: r => <div className="inline-flex gap-1"><IconBtn label="Ubah" onClick={() => onEdit(r)}><Pencil size={18} /></IconBtn><IconBtn label="Hapus" tone="danger" onClick={() => onDel(r)}><Trash2 size={18} /></IconBtn></div> });
  return c;
}
const txMobile = (onEdit?: (t: Tx) => void, onDel?: (t: Tx) => void) => (r: Tx) => (
  <div className="flex items-start gap-3">
    <span className={cx("size-10 shrink-0 grid place-items-center rounded-full", r.jenis === "Pemasukan" ? "bg-income text-income-accent" : "bg-expense text-expense-accent")}>{r.jenis === "Pemasukan" ? <ArrowUp size={18} /> : <ArrowDown size={18} />}</span>
    <div className="flex-1 min-w-0">
      <p className="text-sm font-medium truncate">{r.nama === "-" ? r.keterangan : r.nama}</p>
      <p className="text-xs text-muted truncate"><span className="num">{fmtDate(r.tanggal)}</span> · {r.nama === "-" ? r.jenis : r.keterangan}</p>
    </div>
    <div className="text-right">
      <p className={cx("text-sm font-bold num", r.jenis === "Pemasukan" ? "text-success" : "text-[#B2511F]")}>{r.jenis === "Pemasukan" ? "+" : "−"}{rp(r.nominal)}</p>
      {onEdit && onDel && <div className="flex justify-end -mr-2"><IconBtn label="Ubah" onClick={() => onEdit(r)}><Pencil size={16} /></IconBtn><IconBtn label="Hapus" tone="danger" onClick={() => onDel(r)}><Trash2 size={16} /></IconBtn></div>}
    </div>
  </div>
);

function Select({ value, onChange, children, label }: { value: string; onChange: (v: string) => void; children: ReactNode; label: string }) {
  return (
    <span className="relative">
      <select aria-label={label} value={value} onChange={e => onChange(e.target.value)} className={cx(inputCls(), "appearance-none pr-9 cursor-pointer")}>{children}</select>
      <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted pointer-events-none" />
    </span>
  );
}

function SectionHead({ title, sub, children }: { title: string; sub?: string; children?: ReactNode }) {
  return (
    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-5">
      <div><h2 className="text-xl md:text-2xl font-bold">{title}</h2>{sub && <p className="text-sm text-muted mt-0.5">{sub}</p>}</div>
      {children && <div className="flex flex-wrap gap-3">{children}</div>}
    </div>
  );
}

function Totals({ txs }: { txs: Tx[] }) {
  const tin = txs.filter(t => t.jenis === "Pemasukan").reduce((s, t) => s + t.nominal, 0);
  const tout = txs.filter(t => t.jenis === "Pengeluaran").reduce((s, t) => s + t.nominal, 0);
  return { tin, tout, saldo: tin - tout };
}

function DashboardB({ txs, members, openTx, onEdit, onDel, loading }: { txs: Tx[]; members: Member[]; openTx: (j: Jenis) => void; onEdit: (t: Tx) => void; onDel: (t: Tx) => void; loading: boolean }) {
  const { saldo } = Totals({ txs });
  const { tin, tout } = rekapSemester(txs, SEMESTERS[0]);
  const [per, setPer] = useState("all"); const [ang, setAng] = useState("all");
  const rows = txs.filter(t => (per === "all" || bulanOf(t) === per) && (ang === "all" || t.nama === ang));
  return (
    <div className="space-y-8">
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        <div className="sm:col-span-2 lg:col-span-1"><Summary variant="saldo" label="Saldo Kas Saat Ini" value={rp(saldo)} sub="Diperbarui otomatis" /></div>
        <Summary variant="in" label="Total Pemasukan" value={rp(tin)} sub={SEMESTERS[0].label} />
        <Summary variant="out" label="Total Pengeluaran" value={rp(tout)} sub={SEMESTERS[0].label} />
      </div>
      <div className="grid xl:grid-cols-[1fr_380px] gap-6">
        <BarChart txs={txs} />
        <Card className="p-6">
          <h3 className="text-lg font-medium">Status Iuran Oktober</h3>
          <p className="text-xs text-muted mb-5">{members.filter(m => m.lunas).length} dari {members.length} anggota lunas</p>
          <div className="h-3 rounded-full bg-danger/15 overflow-hidden mb-5"><div className="h-full bg-success rounded-full" style={{ width: `${(members.filter(m => m.lunas).length / members.length) * 100}%` }} /></div>
          <ul className="space-y-1">
            {members.filter(m => !m.lunas).map(m => (
              <li key={m.nim} className="flex items-center gap-3 py-2"><Avatar name={m.nama} size="size-8" /><span className="text-sm flex-1">{m.nama}</span><Badge kind="Belum Bayar" /></li>
            ))}
          </ul>
        </Card>
      </div>
      <section>
        <SectionHead title="Ringkasan Transaksi Terbaru" sub="Catatan pemasukan & pengeluaran kas kelas">
          <Button icon={<Plus size={18} />} onClick={() => openTx("Pemasukan")}>Catat Pemasukan</Button>
          <Button v="secondary" icon={<Plus size={18} />} onClick={() => openTx("Pengeluaran")}>Catat Pengeluaran</Button>
        </SectionHead>
        <div className="flex flex-wrap gap-3 mb-4">
          <div className="w-44"><Select label="Filter periode" value={per} onChange={setPer}><option value="all">Semua periode</option>{[...SEMESTERS[0].months].reverse().map(ym => <option key={ym} value={ym}>{labelBulan(ym)}</option>)}</Select></div>
          <div className="w-52"><Select label="Filter anggota" value={ang} onChange={setAng}><option value="all">Semua anggota</option>{members.map(m => <option key={m.nim}>{m.nama}</option>)}</Select></div>
        </div>
        <DataTable rows={rows} cols={txCols(onEdit, onDel)} loading={loading} mobileCard={txMobile(onEdit, onDel)} />
      </section>
    </div>
  );
}

function AnggotaPage({ members, setMembers, toast, search }: { members: Member[]; setMembers: (m: Member[]) => void; toast: (k: ToastT["kind"], m: string) => void; search: string }) {
  const [q, setQ] = useState(""); const [modal, setModal] = useState<null | { edit?: Member }>(null);
  const [del, setDel] = useState<Member | null>(null); const [reset, setReset] = useState<Member | null>(null);
  const term = (q || search).toLowerCase();
  const rows = members.filter(m => m.nama.toLowerCase().includes(term) || m.nim.includes(term));
  const cols: Col<Member>[] = [
    { key: "nim", label: "NIM", sort: (a, b) => a.nim.localeCompare(b.nim), render: r => <span className="font-mono text-[13px]">{r.nim}</span> },
    { key: "nama", label: "Nama Lengkap", sort: (a, b) => a.nama.localeCompare(b.nama), render: r => <span className="flex items-center gap-3"><Avatar name={r.nama} size="size-8" /><span className="font-medium">{r.nama}</span></span> },
    { key: "kelas", label: "Kelas", render: r => r.kelas },
    { key: "ket", label: "Keterangan", render: r => <span className="text-muted">{r.keterangan}</span> },
    { key: "aksi", label: "Aksi", right: true, render: r => <div className="inline-flex gap-1"><IconBtn label="Ubah" onClick={() => setModal({ edit: r })}><Pencil size={18} /></IconBtn><IconBtn label="Atur Ulang Kata Sandi" tone="muted" onClick={() => setReset(r)}><KeyRound size={18} /></IconBtn><IconBtn label="Hapus" tone="danger" onClick={() => setDel(r)}><Trash2 size={18} /></IconBtn></div> },
  ];
  return (
    <div>
      <SectionHead title="Daftar Anggota Kelas" sub={`${members.length} mahasiswa terdaftar`}>
        <label className="relative w-full sm:w-72"><Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" /><input value={q} onChange={e => setQ(e.target.value)} placeholder="Cari NIM atau nama…" aria-label="Cari anggota" className={cx(inputCls(), "pl-10")} /></label>
        <Button icon={<Plus size={18} />} onClick={() => setModal({})}>Tambah Anggota</Button>
      </SectionHead>
      <DataTable rows={rows} cols={cols} pageSize={7} empty="Anggota tidak ditemukan" mobileCard={r => (
        <div className="flex items-center gap-3"><Avatar name={r.nama} /><div className="flex-1 min-w-0"><p className="text-sm font-medium">{r.nama}</p><p className="text-xs text-muted font-mono">{r.nim} · {r.kelas}</p></div>
          <div className="flex -mr-2"><IconBtn label="Ubah" onClick={() => setModal({ edit: r })}><Pencil size={16} /></IconBtn><IconBtn label="Hapus" tone="danger" onClick={() => setDel(r)}><Trash2 size={16} /></IconBtn></div></div>
      )} />
      {modal && <MemberModal edit={modal.edit} onClose={() => setModal(null)} onSave={m => {
        if (modal.edit) setMembers(members.map(x => x.nim === modal.edit!.nim ? m : x)); else setMembers([m, ...members]);
        toast("sukses", modal.edit ? "Data anggota berhasil diperbarui." : `${m.nama} berhasil ditambahkan.`); setModal(null);
      }} existing={members} />}
      <Confirm open={!!del} what={`Anggota ${del?.nama}`} onClose={() => setDel(null)} onConfirm={() => { setMembers(members.filter(m => m.nim !== del!.nim)); toast("sukses", "Anggota berhasil dihapus."); setDel(null); }} />
      <Modal title="Atur Ulang Kata Sandi" open={!!reset} onClose={() => setReset(null)} width="max-w-md"
        footer={<><Button v="secondary" onClick={() => setReset(null)}>Batal</Button><Button onClick={() => { toast("info", `Kata sandi ${reset?.nama} diatur ulang ke NIM.`); setReset(null); }}>Atur Ulang Kata Sandi</Button></>}>
        <div className="flex gap-3 rounded-xl bg-[#FFF6DB] border border-warning/40 p-4 text-sm"><AlertTriangle size={20} className="text-[#A77800] shrink-0" /><p>Kata sandi <b>{reset?.nama}</b> akan diatur ulang menjadi NIM (<span className="font-mono">{reset?.nim}</span>). Anggota wajib menggantinya setelah masuk.</p></div>
      </Modal>
    </div>
  );
}
function MemberModal({ edit, onClose, onSave, existing }: { edit?: Member; onClose: () => void; onSave: (m: Member) => void; existing: Member[] }) {
  const [f, setF] = useState<Member>(edit ?? { nim: "", nama: "", kelas: "TI-3A", keterangan: "", lunas: false });
  const [err, setErr] = useState<Record<string, string>>({}); const [loading, setL] = useState(false);
  const save = () => {
    const e: Record<string, string> = {};
    if (!/^\d{10}$/.test(f.nim)) e.nim = "NIM harus 10 digit angka.";
    else if (!edit && existing.some(m => m.nim === f.nim)) e.nim = "NIM sudah terdaftar.";
    if (!f.nama.trim()) e.nama = "Nama lengkap wajib diisi.";
    setErr(e); if (Object.keys(e).length) return;
    setL(true); setTimeout(() => onSave({ ...f, keterangan: f.keterangan || "-" }), 600);
  };
  return (
    <Modal title={edit ? "Edit Data Anggota" : "Tambah Data Anggota"} open onClose={onClose}
      footer={<><Button v="secondary" onClick={onClose}>Batal</Button><Button loading={loading} onClick={save}>Simpan Data</Button></>}>
      <div className="space-y-4">
        <Field label="NIM (Nomor Induk Mahasiswa)" error={err.nim}><input inputMode="numeric" disabled={!!edit} value={f.nim} onChange={e => setF({ ...f, nim: e.target.value })} placeholder="cth. 2310511010" className={cx(inputCls(!!err.nim), "font-mono")} /></Field>
        <Field label="Nama Lengkap" error={err.nama}><input value={f.nama} onChange={e => setF({ ...f, nama: e.target.value })} placeholder="Nama sesuai KTM" className={inputCls(!!err.nama)} /></Field>
        <Field label="Kelas"><Select label="Kelas" value={f.kelas} onChange={v => setF({ ...f, kelas: v })}>{["TI-3A", "TI-3B", "TI-3C"].map(k => <option key={k}>{k}</option>)}</Select></Field>
        <Field label="Keterangan" hint="Opsional, cth. jabatan di kelas"><textarea rows={3} value={f.keterangan === "-" ? "" : f.keterangan} onChange={e => setF({ ...f, keterangan: e.target.value })} className={cx(inputCls(), "h-auto py-2.5 resize-none")} /></Field>
      </div>
    </Modal>
  );
}

function TxModal({ jenis, edit, members, onClose, onSave }: { jenis: Jenis; edit?: Tx; members: Member[]; onClose: () => void; onSave: (t: Omit<Tx, "id">) => void }) {
  const inc = jenis === "Pemasukan";
  const [f, setF] = useState({ nama: edit?.nama ?? "", tanggal: edit?.tanggal ?? "2026-10-06", nominal: edit ? String(edit.nominal) : inc ? "50000" : "", keperluan: !inc ? edit?.keterangan ?? "" : "", ket: "", bulan: edit?.bulan ?? "2026-10" });
  const [err, setErr] = useState<Record<string, string>>({}); const [loading, setL] = useState(false);
  const save = () => {
    const e: Record<string, string> = {};
    if (inc && !f.nama) e.nama = "Pilih anggota yang membayar.";
    if (!inc && !f.keperluan.trim()) e.keperluan = "Keperluan wajib diisi.";
    if (!Number(f.nominal)) e.nominal = "Nominal harus lebih dari 0.";
    setErr(e); if (Object.keys(e).length) return;
    setL(true);
    setTimeout(() => onSave({ jenis, tanggal: f.tanggal, nama: inc ? f.nama : "-", keterangan: inc ? ketIuran(f.bulan) : f.keperluan + (f.ket ? ` — ${f.ket}` : ""), nominal: Number(f.nominal), ...(inc ? { bulan: f.bulan } : {}) }), 600);
  };
  return (
    <Modal title={(edit ? "Ubah " : "Catat ") + jenis} open onClose={onClose}
      footer={<><Button v="secondary" onClick={onClose}>Batal</Button><Button loading={loading} onClick={save}>Simpan Data</Button></>}>
      <div className="space-y-4">
        {inc ? (
          <Field label="Nama Anggota" error={err.nama}><Select label="Nama Anggota" value={f.nama} onChange={v => setF({ ...f, nama: v })}><option value="">Pilih anggota…</option>{members.map(m => <option key={m.nim} value={m.nama}>{m.nama} — {m.nim}</option>)}</Select></Field>
        ) : (
          <Field label="Keperluan" error={err.keperluan}><input value={f.keperluan} onChange={e => setF({ ...f, keperluan: e.target.value })} placeholder="cth. Beli ATK Kelas" className={inputCls(!!err.keperluan)} /></Field>
        )}
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label={inc ? "Tanggal Pembayaran" : "Tanggal"}><input type="date" value={f.tanggal} onChange={e => setF({ ...f, tanggal: e.target.value })} className={inputCls()} /></Field>
          <Field label="Nominal" error={err.nominal}>
            <span className={cx(inputCls(!!err.nominal), "flex items-center gap-2 focus-within:border-navy focus-within:ring-3 focus-within:ring-navy/10")}>
              <span className="text-muted font-medium">Rp</span>
              <input inputMode="numeric" value={f.nominal ? Number(f.nominal).toLocaleString("id-ID") : ""} onChange={e => setF({ ...f, nominal: e.target.value.replace(/\D/g, "") })} placeholder="0" className="flex-1 min-w-0 outline-none bg-transparent num font-medium" />
            </span>
          </Field>
        </div>
        {inc ? (
          <Field label="Iuran Bulan" hint="Pembayaran otomatis masuk ke rekap bulan & semester terkait"><Select label="Iuran Bulan" value={f.bulan} onChange={v => setF({ ...f, bulan: v })}>{BULAN_IURAN.map(ym => <option key={ym} value={ym}>{labelBulan(ym)}</option>)}</Select></Field>
        ) : <Field label="Keterangan" hint="Opsional"><textarea rows={2} value={f.ket} onChange={e => setF({ ...f, ket: e.target.value })} className={cx(inputCls(), "h-auto py-2.5 resize-none")} /></Field>}
      </div>
    </Modal>
  );
}

function TransaksiPage({ txs, members, openTx, onEdit, onDel, search }: { txs: Tx[]; members: Member[]; openTx: (j: Jenis) => void; onEdit: (t: Tx) => void; onDel: (t: Tx) => void; search: string }) {
  const [tab, setTab] = useState<"Semua" | Jenis>("Semua");
  const [from, setFrom] = useState("2026-08-01"); const [to, setTo] = useState("2026-10-31"); const [ang, setAng] = useState("all");
  const rows = txs.filter(t => (tab === "Semua" || t.jenis === tab) && t.tanggal >= from && t.tanggal <= to && (ang === "all" || t.nama === ang)
    && (!search || (t.nama + t.keterangan).toLowerCase().includes(search.toLowerCase())));
  const count = (j: "Semua" | Jenis) => txs.filter(t => j === "Semua" || t.jenis === j).length;
  return (
    <div>
      <SectionHead title="Semua Transaksi" sub="Kelola catatan kas masuk dan keluar">
        <Button icon={<Plus size={18} />} onClick={() => openTx("Pemasukan")}>Catat Pemasukan</Button>
        <Button v="secondary" icon={<Plus size={18} />} onClick={() => openTx("Pengeluaran")}>Catat Pengeluaran</Button>
      </SectionHead>
      <Card className="p-4 md:p-5 mb-5">
        <div className="flex flex-col xl:flex-row xl:items-end gap-4">
          <div role="tablist" className="inline-flex p-1 rounded-xl bg-app self-start">
            {(["Semua", "Pemasukan", "Pengeluaran"] as const).map(t => (
              <button key={t} role="tab" aria-selected={tab === t} onClick={() => setTab(t)}
                className={cx("h-10 px-4 rounded-lg text-[13px] font-medium transition cursor-pointer flex items-center gap-2", tab === t ? "bg-white text-navy shadow-sm" : "text-muted hover:text-ink")}>
                {t}<span className={cx("text-[11px] px-1.5 rounded-full num", tab === t ? "bg-navy text-white" : "bg-line")}>{count(t)}</span>
              </button>
            ))}
          </div>
          <div className="grid grid-cols-2 sm:flex gap-3 xl:ml-auto">
            <Field label="Dari"><input type="date" value={from} onChange={e => setFrom(e.target.value)} className={inputCls()} /></Field>
            <Field label="Sampai"><input type="date" value={to} onChange={e => setTo(e.target.value)} className={inputCls()} /></Field>
            <div className="col-span-2 sm:w-52"><Field label="Anggota"><Select label="Anggota" value={ang} onChange={setAng}><option value="all">Semua anggota</option>{members.map(m => <option key={m.nim}>{m.nama}</option>)}</Select></Field></div>
          </div>
        </div>
      </Card>
      <DataTable rows={rows} cols={txCols(onEdit, onDel)} pageSize={8} empty="Tidak ada transaksi pada filter ini" mobileCard={txMobile(onEdit, onDel)} />
    </div>
  );
}

function LaporanPage({ txs, members, toast }: { txs: Tx[]; members: Member[]; toast: (k: ToastT["kind"], m: string) => void }) {
  const [per, setPer] = useState(SEMESTERS[0].id); const [exp, setExp] = useState<string | null>(null);
  const smt = SEMESTERS.find(x => x.id === per) ?? SEMESTERS[0];
  const { rows: rekap, saldoAwal, tin, tout, saldoAkhir } = rekapSemester(txs, smt);
  const paid = (nama: string) => new Set(txs.filter(t => t.jenis === "Pemasukan" && t.nama === nama && smt.months.includes(bulanOf(t))).map(bulanOf)).size;
  const doExp = (k: string) => { setExp(k); setTimeout(() => { setExp(null); toast("sukses", `Laporan berhasil diekspor ke ${k}.`); }, 1100); };
  return (
    <div className="space-y-8">
      <SectionHead title="Rekap Kas Kelas" sub={`${smt.label} · ${labelBulan(smt.months[0])} – ${labelBulan(smt.months[5])}`}>
        <div className="w-60"><Select label="Semester" value={per} onChange={setPer}>{SEMESTERS.map(x => <option key={x.id} value={x.id}>{x.label}</option>)}</Select></div>
        <Button v="danger" icon={<FileDown size={18} />} loading={exp === "PDF"} onClick={() => doExp("PDF")}>Ekspor PDF</Button>
        <Button className="bg-success text-white hover:bg-[#25834B]" icon={<FileSpreadsheet size={18} />} loading={exp === "Excel"} onClick={() => doExp("Excel")}>Ekspor Excel</Button>
      </SectionHead>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <Summary variant="status" label="Saldo Awal Semester" value={rp(saldoAwal)} />
        <Summary variant="in" label="Pemasukan Semester" value={rp(tin)} />
        <Summary variant="out" label="Pengeluaran Semester" value={rp(tout)} />
        <Summary variant="saldo" label="Saldo Akhir Semester" value={rp(saldoAkhir)} />
      </div>
      <div className="grid xl:grid-cols-[1.4fr_1fr] gap-6">
        <section>
          <h3 className="text-lg font-medium mb-3">Rekap per Bulan</h3>
          <DataTable rows={rekap} pageSize={6} cols={[
            { key: "m", label: "Bulan", render: r => <span className="font-medium">{labelBulan(r.ym)}</span> },
            { key: "in", label: "Pemasukan", right: true, render: r => <span className="text-success">{rp(r.in)}</span> },
            { key: "out", label: "Pengeluaran", right: true, render: r => <span className="text-[#B2511F]">{rp(r.out)}</span> },
            { key: "s", label: "Saldo", right: true, render: r => <span className={cx("font-bold", r.saldo < 0 ? "text-danger" : "text-ink")}>{r.saldo < 0 ? "−" : ""}{rp(Math.abs(r.saldo))}</span> },
          ]} />
          <div className="mt-3 flex justify-between rounded-xl bg-app px-4 py-3 text-sm font-medium"><span>Total semester</span><span className="num">Masuk {rp(tin)} · Keluar {rp(tout)}</span></div>
        </section>
        <section>
          <h3 className="text-lg font-medium mb-3">Iuran Anggota per Semester</h3>
          <DataTable rows={members} pageSize={6} cols={[
            { key: "n", label: "Nama", sort: (a, b) => a.nama.localeCompare(b.nama), render: r => <span className="font-medium">{r.nama}</span> },
            { key: "b", label: "Bulan Dibayar", right: true, sort: (a, b) => paid(a.nama) - paid(b.nama), render: r => <span className="num">{paid(r.nama)} / 6</span> },
            { key: "t", label: "Total", right: true, render: r => <span className="num font-medium">{rp(txs.filter(t => t.jenis === "Pemasukan" && t.nama === r.nama && smt.months.includes(bulanOf(t))).reduce((s, t) => s + t.nominal, 0))}</span> },
          ]} />
        </section>
      </div>
    </div>
  );
}

function DashboardA({ txs, members, user }: { txs: Tx[]; members: Member[]; user: { nama: string; nim: string } }) {
  const { saldo } = Totals({ txs });
  const me = members.find(m => m.nim === user.nim);
  const mine = txs.filter(t => t.nama === user.nama);
  return (
    <div className="space-y-8">
      <div className="rounded-2xl bg-gradient-to-r from-navy to-[#2C6FC4] text-white p-6 flex items-center gap-4 shadow-soft rise">
        <Avatar name={user.nama} size="size-14" />
        <div><p className="text-sm text-white/80">Selamat datang kembali,</p><p className="text-xl font-bold">{user.nama}</p></div>
        <span className="ml-auto hidden sm:inline-flex items-center gap-2 text-xs bg-white/15 rounded-full px-3 h-8"><Eye size={14} />Mode lihat saja</span>
      </div>
      <div className="grid sm:grid-cols-2 gap-4 md:gap-6">
        <Summary variant="saldo" label="Saldo Kas Kelas" value={rp(saldo)} sub="Per 6 Oktober 2026" />
        <Summary variant="status" label="Status Iuran Saya · Oktober" value={<span className="flex items-center gap-3">{me?.lunas ? "Lunas" : "Belum Bayar"}<Badge kind={me?.lunas ? "Lunas" : "Belum Bayar"} /></span>} sub="Iuran bulanan Rp 50.000" />
      </div>
      <div className="grid xl:grid-cols-[1.3fr_1fr] gap-6">
        <section>
          <h3 className="text-lg font-medium mb-3">Riwayat Pembayaran Saya</h3>
          <DataTable rows={mine} pageSize={5} empty="Belum ada pembayaran" cols={[
            { key: "t", label: "Tanggal Pembayaran", sort: (a, b) => a.tanggal.localeCompare(b.tanggal), render: r => <span className="num">{fmtDate(r.tanggal)}</span> },
            { key: "k", label: "Keterangan", render: r => r.keterangan },
            { key: "n", label: "Nominal", right: true, render: r => <span className="font-medium">{rp(r.nominal)}</span> },
          ]} />
        </section>
        <section>
          <h3 className="text-lg font-medium">Transparansi Pengeluaran Kas</h3>
          <p className="text-xs text-muted mb-3">Data pemasukan anggota lain tidak ditampilkan demi privasi</p>
          <DataTable rows={txs.filter(t => t.jenis === "Pengeluaran")} pageSize={5} empty="Belum ada pengeluaran" cols={[
            { key: "t", label: "Tanggal", sort: (a, b) => a.tanggal.localeCompare(b.tanggal), render: r => <span className="num">{fmtDate(r.tanggal)}</span> },
            { key: "k", label: "Keperluan", render: r => <span className="font-medium">{r.keterangan}</span> },
            { key: "n", label: "Nominal", right: true, render: r => <span className="font-medium text-[#B2511F]">{rp(r.nominal)}</span> },
          ]} />
        </section>
      </div>
    </div>
  );
}

function RiwayatPage({ txs, user }: { txs: Tx[]; user: { nama: string } }) {
  const mine = txs.filter(t => t.nama === user.nama);
  return (
    <div>
      <SectionHead title="Riwayat Iuran" sub={`Total dibayarkan ${rp(mine.reduce((s, t) => s + t.nominal, 0))}`} />
      <DataTable rows={mine} empty="Belum ada pembayaran" cols={[
        { key: "t", label: "Tanggal Pembayaran", sort: (a, b) => a.tanggal.localeCompare(b.tanggal), render: r => <span className="num">{fmtDate(r.tanggal)}</span> },
        { key: "k", label: "Keterangan", render: r => r.keterangan },
        { key: "s", label: "Status", render: () => <Badge kind="Lunas" /> },
        { key: "n", label: "Nominal", right: true, render: r => <span className="font-medium">{rp(r.nominal)}</span> },
      ]} />
    </div>
  );
}

function ProfilPage({ user, role, logout, toast }: { user: { nama: string; nim: string }; role: Role; logout: () => void; toast: (k: ToastT["kind"], m: string) => void }) {
  const [f, setF] = useState({ old: "", nw: "", cf: "" }); const [err, setErr] = useState<Record<string, string>>({}); const [l, setL] = useState(false);
  const save = () => {
    const e: Record<string, string> = {};
    if (!f.old) e.old = "Masukkan kata sandi lama.";
    if (f.nw.length < 8) e.nw = "Minimal 8 karakter.";
    if (f.nw !== f.cf) e.cf = "Konfirmasi tidak cocok.";
    setErr(e); if (Object.keys(e).length) return;
    setL(true); setTimeout(() => { setL(false); setF({ old: "", nw: "", cf: "" }); toast("sukses", "Kata sandi berhasil diperbarui."); }, 800);
  };
  return (
    <div className="grid lg:grid-cols-[340px_1fr] gap-6 max-w-5xl">
      <Card className="overflow-hidden">
        <div className="h-24 bg-gradient-to-r from-navy to-blue" />
        <div className="px-6 pb-6 -mt-12 text-center">
          <div className="inline-block rounded-full ring-4 ring-white"><Avatar name={user.nama} size="size-24 text-2xl" /></div>
          <p className="mt-3 text-xl font-bold">{user.nama}</p>
          <p className="text-sm text-muted capitalize">{role} · TI-3A</p>
          <div className="mt-6 space-y-4 text-left">
            <Field label="NIM"><input disabled value={user.nim} className={cx(inputCls(), "font-mono")} /></Field>
            <Field label="Nama Lengkap"><input disabled value={user.nama} className={inputCls()} /></Field>
          </div>
          <Button v="ghost" className="w-full mt-6 text-danger hover:bg-danger/8 border border-danger/30" icon={<LogOut size={18} />} onClick={logout}>Keluar</Button>
        </div>
      </Card>
      <Card className="p-6 md:p-8">
        <h3 className="text-lg font-medium">Ganti Kata Sandi</h3>
        <p className="text-sm text-muted mb-6">Gunakan kombinasi huruf dan angka minimal 8 karakter.</p>
        <div className="space-y-4 max-w-md">
          <Field label="Kata Sandi Lama" error={err.old}><input type="password" value={f.old} onChange={e => setF({ ...f, old: e.target.value })} className={inputCls(!!err.old)} /></Field>
          <Field label="Kata Sandi Baru" error={err.nw}><input type="password" value={f.nw} onChange={e => setF({ ...f, nw: e.target.value })} className={inputCls(!!err.nw)} /></Field>
          <Field label="Konfirmasi Kata Sandi Baru" error={err.cf}><input type="password" value={f.cf} onChange={e => setF({ ...f, cf: e.target.value })} className={inputCls(!!err.cf)} /></Field>
          <div className="pt-2"><Button loading={l} onClick={save}>Simpan Kata Sandi</Button></div>
        </div>
      </Card>
    </div>
  );
}

/* ───────────────────────── app ───────────────────────── */
export default function App() {
  const [auth, setAuth] = useState<"login" | "register" | "forgot" | Role>("login");
  const [page, setPage] = useState<Page>("dashboard");
  const [txs, setTxs] = useState(TX0); const [members, setMembers] = useState(MEMBERS0);
  const [toasts, setToasts] = useState<ToastT[]>([]);
  const [txModal, setTxModal] = useState<null | { jenis: Jenis; edit?: Tx }>(null);
  const [delTx, setDelTx] = useState<Tx | null>(null);
  const [collapsed, setCollapsed] = useState(false);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  const toast = (kind: ToastT["kind"], msg: string) => {
    const id = Date.now() + Math.random();
    setToasts(t => [...t, { id, kind, msg }]); setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 3800);
  };
  useEffect(() => { // auto-collapse sidebar on tablet
    const f = () => setCollapsed(window.innerWidth < 1100); f(); window.addEventListener("resize", f); return () => window.removeEventListener("resize", f);
  }, []);

  const tw = <Toasts items={toasts} dismiss={id => setToasts(t => t.filter(x => x.id !== id))} />;
  if (auth === "login") return <>{tw}<Login go={setAuth} onLogin={r => { setAuth(r); setPage("dashboard"); setLoading(true); setTimeout(() => setLoading(false), 900); toast("sukses", `Berhasil masuk sebagai ${r}.`); }} /></>;
  if (auth === "register") return <>{tw}<Register back={() => setAuth("login")} toast={toast} /></>;
  if (auth === "forgot") return <>{tw}<Forgot back={() => setAuth("login")} /></>;

  const role = auth;
  const user = role === "bendahara" ? { nama: "Siti Aminah", nim: "2310511002" } : { nama: "Budi Utomo", nim: "2310511001" };
  const openTx = (jenis: Jenis) => setTxModal({ jenis });
  const onEdit = (t: Tx) => setTxModal({ jenis: t.jenis, edit: t });
  const logout = () => { setAuth("login"); toast("info", "Anda telah keluar."); };

  return (
    <div className="flex min-h-screen bg-app">
      {tw}
      <Sidebar role={role} page={page} setPage={setPage} user={user} collapsed={collapsed} toggle={() => setCollapsed(c => !c)} />
      <div className="flex-1 min-w-0">
        <Header page={page} user={user} setPage={setPage} search={search} setSearch={setSearch} />
        <main key={page} className="rise px-4 md:px-8 py-6 md:py-8 pb-28 md:pb-12 max-w-[1400px]">
          {role === "bendahara" ? (
            page === "dashboard" ? <DashboardB txs={txs} members={members} openTx={openTx} onEdit={onEdit} onDel={setDelTx} loading={loading} />
              : page === "anggota" ? <AnggotaPage members={members} setMembers={setMembers} toast={toast} search={search} />
                : page === "transaksi" ? <TransaksiPage txs={txs} members={members} openTx={openTx} onEdit={onEdit} onDel={setDelTx} search={search} />
                  : page === "laporan" ? <LaporanPage txs={txs} members={members} toast={toast} />
                    : <ProfilPage user={user} role={role} logout={logout} toast={toast} />
          ) : (
            page === "riwayat" ? <RiwayatPage txs={txs} user={user} />
              : page === "profil" ? <ProfilPage user={user} role={role} logout={logout} toast={toast} />
                : <DashboardA txs={txs} members={members} user={user} />
          )}
        </main>
      </div>
      <BottomNav role={role} page={page} setPage={setPage} />

      {txModal && <TxModal {...txModal} members={members} onClose={() => setTxModal(null)} onSave={t => {
        if (txModal.edit) { setTxs(txs.map(x => x.id === txModal.edit!.id ? { ...t, id: x.id } : x)); toast("sukses", "Transaksi berhasil diperbarui."); }
        else {
          setTxs([{ ...t, id: Date.now() }, ...txs].sort((a, b) => b.tanggal.localeCompare(a.tanggal)));
          if (t.jenis === "Pemasukan") setMembers(ms => ms.map(m => m.nama === t.nama ? { ...m, lunas: true } : m));
          toast("sukses", `${t.jenis} ${rp(t.nominal)} berhasil dicatat. Saldo diperbarui.`);
        }
        setTxModal(null);
      }} />}
      <Confirm open={!!delTx} what={`Transaksi "${delTx?.keterangan}"`} onClose={() => setDelTx(null)} onConfirm={() => { setTxs(txs.filter(t => t.id !== delTx!.id)); toast("sukses", "Transaksi berhasil dihapus."); setDelTx(null); }} />
    </div>
  );
}
