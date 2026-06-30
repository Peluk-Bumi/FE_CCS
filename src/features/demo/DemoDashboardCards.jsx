import React, { useState } from "react"
import {
  FieldDashboardCard,
  LocationStatusCard,
  TreeProgressCard,
  ActivityStatusCard,
  ProgressCard,
} from "@/shared/components/ui/card/FieldDashboardCard"
import {
  FiUser, FiUsers, FiFileText, FiCheckCircle, FiActivity,
  FiMonitor, FiMapPin, FiBarChart2, FiTrendingUp, FiHash,
  FiClock, FiAlertCircle, FiShield,
} from "react-icons/fi"

const DashboardCardDemo = () => {
  const [lastClicked, setLastClicked] = useState(null)
  const click = (label) => setLastClicked(label)

  return (
    <div className="p-8 space-y-14 max-w-5xl mx-auto">

      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold">Dashboard Card Playground</h1>
        <p className="text-sm text-gray-500 mt-2">
          Semua variant <code className="bg-gray-100 dark:bg-gray-800 px-1 rounded">FieldDashboardCard</code> — unified styling, group-hover icon, clickable/non-clickable, trend states, dan card dari setiap halaman.
        </p>
        {lastClicked && (
          <p className="mt-2 text-sm text-primary font-medium">
            Terakhir diklik: <strong>{lastClicked}</strong>
          </p>
        )}
      </div>

      {/* DESIGN RULES */}
      <div className="p-6 rounded-xl bg-gray-100 dark:bg-gray-800 space-y-2">
        <h2 className="text-xl font-semibold">Design System Rules</h2>
        <ul className="text-sm space-y-1 text-gray-600 dark:text-gray-300">
          <li>• Semua card pakai styling yang sama — tidak ada per-type color variants</li>
          <li>• Icon mendapat group-hover: bg darkens, icon scales up, shadow muncul</li>
          <li>• <code>onClick</code> mengaktifkan hover lift + "Tap untuk detail →" hint</li>
          <li>• <code>trend</code> + <code>trendUp</code> menampilkan badge di footer</li>
          <li>• <code>type</code> prop masih diterima tapi tidak mengubah warna</li>
        </ul>
      </div>

      {/* SECTION 1 — CLICKABLE VS NON-CLICKABLE */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Clickable vs Non-Clickable</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Dengan onClick — hover lift + hint</p>
            <FieldDashboardCard
              title="Aktivitas Direncanakan"
              value="12"
              subtitle="Klik untuk ke halaman perencanaan"
              icon={<FiFileText />}
              trend="+3 bulan ini"
              trendUp={true}
              onClick={() => click("Aktivitas Direncanakan")}
            />
          </div>
          <div className="space-y-2">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Tanpa onClick — display only</p>
            <FieldDashboardCard
              title="Aktivitas Direncanakan"
              value="12"
              subtitle="Hanya display, tidak bisa diklik"
              icon={<FiFileText />}
              trend="+3 bulan ini"
              trendUp={true}
            />
          </div>
        </div>
      </div>

      {/* SECTION 2 — TREND STATES */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Trend States</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">trendUp=true</p>
            <FieldDashboardCard title="Survival Rate" value="92%" icon={<FiTrendingUp />} trend="+2% dari bulan lalu" trendUp={true} />
          </div>
          <div className="space-y-2">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">trendUp=false</p>
            <FieldDashboardCard title="Tingkat Kematian" value="8%" icon={<FiActivity />} trend="-3% dari target" trendUp={false} />
          </div>
          <div className="space-y-2">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Tanpa trend</p>
            <FieldDashboardCard title="Total Monitoring" value="48" subtitle="Tidak ada trend data" icon={<FiMonitor />} />
          </div>
        </div>
      </div>

      {/* SECTION 3 — SPECIALIZED CARDS */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Specialized Cards</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="space-y-1">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">LocationStatusCard</p>
            <LocationStatusCard location="Pantai Marunda" area="2.5" status="Aktif" onClick={() => click("LocationStatusCard")} />
          </div>
          <div className="space-y-1">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">TreeProgressCard</p>
            <TreeProgressCard planted="840" target="1000" percentage={84} onClick={() => click("TreeProgressCard")} />
          </div>
          <div className="space-y-1">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">ActivityStatusCard</p>
            <ActivityStatusCard completed={12} total={15} activeToday={3} onClick={() => click("ActivityStatusCard")} />
          </div>
          <div className="space-y-1">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">ProgressCard</p>
            <ProgressCard percentage={78} label="Fase 4 dari 6" subtitle="Monitoring bulan ke-4" onClick={() => click("ProgressCard")} />
          </div>
        </div>
      </div>

      {/* SECTION 4 — ADMIN DASHBOARD */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Admin Dashboard Cards</h2>
        <p className="text-sm text-gray-500">Seperti yang dipakai di <code>/admin/dashboard</code></p>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <FieldDashboardCard title="Kolaborator Terdaftar" value="5"   icon={<FiUser />}         trend="+0%"  trendUp={true}  subtitle="Bergabung dalam proses"       onClick={() => click("→ /admin/users")} />
          <FieldDashboardCard title="Aktivitas Direncanakan" value="12" icon={<FiFileText />}     trend="+100%" trendUp={true} subtitle="Proses konservasi"            onClick={() => click("→ /admin/perencanaan")} />
          <FieldDashboardCard title="Tingkat Pelaksanaan"   value="75%" icon={<FiCheckCircle />}  trend="+0%"  trendUp={true}  subtitle="Dari rencana"                 onClick={() => click("→ /admin/implementasi")} />
          <FieldDashboardCard title="Tingkat Keberhasilan"  value="88%" icon={<FiActivity />}     trend="+1%"  trendUp={true}  subtitle="Hasil monitoring"             onClick={() => click("→ /admin/monitoring")} />
        </div>
      </div>

      {/* SECTION 5 — USER DASHBOARD */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">User Dashboard Cards</h2>
        <p className="text-sm text-gray-500">Seperti yang dipakai di <code>/user/dashboard</code></p>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <FieldDashboardCard title="Aktivitas Direncanakan" value="3" icon={<FiFileText />}    trend="+12%" trendUp={true} subtitle="Proses konservasi"  onClick={() => click("→ /user/perencanaan")} />
          <FieldDashboardCard title="Aktivitas Dilaksanakan" value="2" icon={<FiCheckCircle />} trend="+8%"  trendUp={true} subtitle="Dari rencana"        onClick={() => click("→ /user/implementasi")} />
          <FieldDashboardCard title="Monitoring Berjalan"    value="3" icon={<FiMonitor />}     trend="+5%"  trendUp={true} subtitle="Proses evaluasi"     onClick={() => click("→ /user/monitoring")} />
          <FieldDashboardCard title="Proses Selesai"         value="1" icon={<FiCheckCircle />} trend="+3"   trendUp={true} subtitle="Dokumentasi lengkap" onClick={() => click("→ /user/evaluasi")} />
        </div>
      </div>

      {/* SECTION 6 — PERENCANAAN PAGE */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Perencanaan Page Cards</h2>
        <p className="text-sm text-gray-500">Card untuk summary di halaman <code>/perencanaan</code></p>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <FieldDashboardCard title="Total Perencanaan"  value="12" icon={<FiFileText />}    trend="+2"   trendUp={true}  subtitle="Semua status"         onClick={() => click("Total Perencanaan")} />
          <FieldDashboardCard title="Menunggu Approval"  value="3"  icon={<FiClock />}       trend="Baru" trendUp={true}  subtitle="Status: planning"     onClick={() => click("Menunggu Approval")} />
          <FieldDashboardCard title="Sedang Berjalan"    value="7"  icon={<FiActivity />}    trend="+1"   trendUp={true}  subtitle="Implementasi aktif"   onClick={() => click("Sedang Berjalan")} />
          <FieldDashboardCard title="Selesai"            value="2"  icon={<FiCheckCircle />} trend="100%" trendUp={true}  subtitle="Completed"            onClick={() => click("Selesai")} />
        </div>
      </div>

      {/* SECTION 7 — IMPLEMENTASI PAGE */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Implementasi Page Cards</h2>
        <p className="text-sm text-gray-500">Card untuk summary di halaman <code>/implementasi</code></p>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <FieldDashboardCard title="Total Implementasi" value="9"    icon={<FiCheckCircle />} trend="+1"   trendUp={true}  subtitle="Terdokumentasi"       onClick={() => click("Total Implementasi")} />
          <FieldDashboardCard title="Total Bibit"        value="8.4K" icon={<FiMapPin />}      trend="+500" trendUp={true}  subtitle="Unit tertanam"        onClick={() => click("Total Bibit")} />
          <FieldDashboardCard title="Lokasi Aktif"       value="5"    icon={<FiMapPin />}      trend="Aktif" trendUp={true} subtitle="Titik implementasi"   onClick={() => click("Lokasi Aktif")} />
          <FieldDashboardCard title="Kesesuaian"         value="94%"  icon={<FiCheckCircle />} trend="+2%"  trendUp={true}  subtitle="Vs perencanaan"       onClick={() => click("Kesesuaian")} />
        </div>
      </div>

      {/* SECTION 8 — MONITORING PAGE */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Monitoring Page Cards</h2>
        <p className="text-sm text-gray-500">Card untuk summary di halaman <code>/monitoring</code></p>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <FieldDashboardCard title="Total Monitoring"   value="28"  icon={<FiActivity />}    trend="+6"   trendUp={true}  subtitle="Semua bulan"          onClick={() => click("Total Monitoring")} />
          <FieldDashboardCard title="Survival Rate"      value="91%" icon={<FiTrendingUp />}  trend="+1%"  trendUp={true}  subtitle="Rata-rata semua lokasi" onClick={() => click("Survival Rate")} />
          <FieldDashboardCard title="Bulan Terisi"       value="4.7" icon={<FiBarChart2 />}   trend="avg"  trendUp={true}  subtitle="Dari 6 bulan target"  onClick={() => click("Bulan Terisi")} />
          <FieldDashboardCard title="Perlu Perhatian"    value="2"   icon={<FiAlertCircle />} trend="-1"   trendUp={false} subtitle="Survival < 70%"        onClick={() => click("Perlu Perhatian")} />
        </div>
      </div>

      {/* SECTION 9 — EVALUASI PAGE */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Evaluasi Page Cards</h2>
        <p className="text-sm text-gray-500">Card untuk summary di halaman <code>/evaluasi</code></p>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <FieldDashboardCard title="Siap Evaluasi"      value="3"   icon={<FiBarChart2 />}   trend="Baru" trendUp={true}  subtitle="Monitoring 6 bulan selesai" onClick={() => click("Siap Evaluasi")} />
          <FieldDashboardCard title="Sudah Dievaluasi"   value="2"   icon={<FiCheckCircle />} trend="+1"   trendUp={true}  subtitle="Laporan tersedia"      onClick={() => click("Sudah Dievaluasi")} />
          <FieldDashboardCard title="Skor Rata-rata"     value="89%" icon={<FiTrendingUp />}  trend="+3%"  trendUp={true}  subtitle="Semua proyek"          onClick={() => click("Skor Rata-rata")} />
          <FieldDashboardCard title="Excellent"          value="1"   icon={<FiCheckCircle />} trend="≥90%" trendUp={true}  subtitle="Health status"         onClick={() => click("Excellent")} />
        </div>
      </div>

      {/* SECTION 10 — USERS PAGE */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Users Page Cards</h2>
        <p className="text-sm text-gray-500">Card untuk summary di halaman <code>/admin/users</code></p>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <FieldDashboardCard title="Total Pengguna"     value="5"   icon={<FiUsers />}       trend="+1"   trendUp={true}  subtitle="Terdaftar"             onClick={() => click("Total Pengguna")} />
          <FieldDashboardCard title="Admin"              value="1"   icon={<FiShield />}      trend="Aktif" trendUp={true} subtitle="Role admin"            onClick={() => click("Admin")} />
          <FieldDashboardCard title="User Aktif"         value="4"   icon={<FiUser />}        trend="+1"   trendUp={true}  subtitle="Role user"             onClick={() => click("User Aktif")} />
          <FieldDashboardCard title="Proyek per User"    value="2.4" icon={<FiFileText />}    trend="avg"  trendUp={true}  subtitle="Rata-rata proyek"      onClick={() => click("Proyek per User")} />
        </div>
      </div>

      {/* SECTION 11 — LOG HISTORY PAGE */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Log History Cards</h2>
        <p className="text-sm text-gray-500">Card untuk summary di halaman <code>/log-history</code></p>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <FieldDashboardCard title="Total Log"          value="48"  icon={<FiHash />}        trend="+6"   trendUp={true}  subtitle="Semua aktivitas"       onClick={() => click("Total Log")} />
          <FieldDashboardCard title="Confirmed"          value="40"  icon={<FiCheckCircle />} trend="83%"  trendUp={true}  subtitle="On-chain verified"     onClick={() => click("Confirmed")} />
          <FieldDashboardCard title="Pending"            value="5"   icon={<FiClock />}       trend="10%"  trendUp={false} subtitle="Menunggu konfirmasi"   onClick={() => click("Pending")} />
          <FieldDashboardCard title="Failed"             value="3"   icon={<FiAlertCircle />} trend="7%"   trendUp={false} subtitle="Perlu retry"           onClick={() => click("Failed")} />
        </div>
      </div>

    </div>
  )
}

export default DashboardCardDemo
