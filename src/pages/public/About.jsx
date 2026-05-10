import React from "react";
import { FaTree, FaWater, FaChartLine, FaUsers, FaCalendarAlt, FaRuler, FaClipboardCheck, FaLeaf } from "react-icons/fa";
import { GiGrowth } from "react-icons/gi";
import { RiHealthBookFill } from "react-icons/ri";
import Footer from "@/layouts/partials/Footer"; // Import Footer
import { useTheme } from "@/app/context/ThemeContext";

const About = () => {
  const { theme } = useTheme();
  // Sample monitoring data
  const monitoringData = {
    survivalRate: 85,
    initialPlants: 20,
    survivingPlants: 17,
    averageHeight: "65.2 cm",
    heightIncrease: "15.2 cm dari penanaman",
    averageDiameter: "1.8 cm",
    diameterIncrease: "0.6 cm dari penanaman",
    healthCondition: "Baik",
    healthDetails: "85% daun sehat, 15% menunjukkan sedikit kerusakan tepi daun"
  };

  return (
    <>
      <div className={`pt-20 min-h-screen transition-colors duration-300 ${
        theme === 'dark' 
          ? 'bg-gradient-to-br from-green-950 via-gray-950 to-green-950' 
          : 'bg-white'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 md:py-8">
          {/* Hero Section */}
          <div className="text-center mb-16 max-w-2xl mx-auto">
            <h1 className={`text-4xl md:text-5xl font-bold mb-4 transition-colors ${
              theme === 'dark' ? 'text-white' : 'text-primary'
            }`}>
              Platform Pemantauan Restorasi Lingkungan
            </h1>
            <div className="w-32 h-1.5 bg-gradient-to-r from-primary to-primary-dark mx-auto rounded-full mb-6"></div>
            <p className={`text-lg max-w-3xl mx-auto transition-colors ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
            }`}>
              Sistem terpadu untuk memantau dan mengevaluasi proyek restorasi ekosistem melalui pengumpulan data terstruktur dan analisis berkala
            </p>
          </div>

          {/* Background Section */}
          <div className="grid md:grid-cols-2 gap-12 mb-20">
            <div className="space-y-6">
              <h2 className={`text-3xl font-semibold transition-colors ${
                theme === 'dark' ? 'text-primary-light' : 'text-primary'
              }`}>
                Latar Belakang
              </h2>
              <div className={`space-y-4 transition-colors ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}>
                <p>
                  Degradasi ekosistem menjadi tantangan lingkungan global yang signifikan akibat urbanisasi cepat, aktivitas industri, dan pertumbuhan populasi tak terkendali. Kerusakan habitat alami mengancam keanekaragaman hayati dan mengganggu fungsi-fungsi ekosistem yang vital bagi kehidupan manusia.
                </p>
                <p>
                  Rusaknya ekosistem alami dipicu oleh kebutuhan ekonomi, pencemaran, dan konversi lahan tanpa pertimbangan lingkungan yang matang. Melalui inisiatif restorasi yang terkoordinasi dan didukung oleh data yang akurat, kita dapat memulihkan ekosistem yang rusak dan menciptakan dampak positif jangka panjang bagi lingkungan dan masyarakat.
                </p>
              </div>
            </div>

            <div className={`p-8 rounded-xl border transition-colors ${
              theme === 'dark'
                ? 'bg-primary/25 border-primary/10 backdrop-blur'
                : 'bg-gradient-to-br from-primary/10 to-primary-dark/10 border-primary/20'
            }`}>
              <div className="flex items-center mb-6">
                <div className={`p-3 rounded-lg mr-4 transition-colors ${
                  theme === 'dark'
                    ? 'bg-primary/40'
                    : 'bg-primary/20'
                }`}>
                  <FaTree className={`text-2xl transition-colors ${
                    theme === 'dark' ? 'text-primary-light' : 'text-primary'
                  }`} />
                </div>
                <h3 className={`text-2xl font-semibold transition-colors ${
                  theme === 'dark' ? 'text-primary' : 'text-primary'
                }`}>
                  Manfaat Restorasi Ekosistem
                </h3>
              </div>
              <ul className="space-y-4">
                {[
                  "Memulihkan keanekaragaman hayati dan habitat alami",
                  "Meningkatkan stabilitas lingkungan dan ketahanan iklim",
                  "Menyerap dan menyimpan karbon dalam jangka panjang",
                  "Meningkatkan kualitas air dan tanah",
                  "Memberikan manfaat ekonomi dan sosial bagi komunitas lokal"
                ].map((item, index) => (
                  <li key={index} className="flex items-start">
                    <div className={`p-1 rounded-full mr-3 mt-0.5 transition-colors ${
                      theme === 'dark'
                        ? 'bg-primary/40'
                        : 'bg-primary/20'
                    }`}>
                      <div className={`h-2 w-2 rounded-full transition-colors ${
                        theme === 'dark' ? 'text-primary' : 'text-primary-dark'
                      }`}></div>
                    </div>
                    <span className={`transition-colors ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                    }`}>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Restoration Initiative Section */}
          <div className="mb-20">
            <h2 className={`text-3xl font-semibold mb-8 text-center transition-colors ${
              theme === 'dark' ? 'text-primary' : 'text-primary'
            }`}>
              Kerangka Kerja Program Restorasi
            </h2>
            
            <div className={`rounded-xl overflow-hidden transition-colors ${
              theme === 'dark'
                ? 'bg-primary/25 backdrop-blur border border-primary/10'
                : 'bg-white shadow-xl'
            }`}>
              <div className="md:flex">
                <div className={`md:w-1/3 p-8 flex items-center transition-colors ${
                  theme === 'dark'
                    ? 'bg-gradient-to-b from-primary/40 to-primary-dark/30 border-r border-primary/10'
                    : 'bg-gradient-to-b from-primary to-primary-dark'
                }`}>
                  <div>
                    <div className={`backdrop-blur-sm p-4 rounded-lg inline-block mb-4 transition-colors ${
                      theme === 'dark'
                        ? 'bg-white/10'
                        : 'bg-white/10'
                    }`}>
                      <FaLeaf className={`text-3xl transition-colors ${
                        theme === 'dark' ? 'text-primary-light' : 'text-white'
                      }`} />
                    </div>
                    <h3 className={`text-2xl font-bold mb-3 transition-colors ${
                      theme === 'dark' ? 'text-primary-light' : 'text-primary-foreground'
                    }`}>Pendekatan Terintegrasi</h3>
                    <p className={`transition-colors ${
                      theme === 'dark' ? 'text-primary-light' : 'text-primary-foreground/70'
                    }`}>
                      Kolaborasi multistakeholder untuk restorasi ekosistem melalui pendekatan berbasis sains, data, dan keterlibatan komunitas.
                    </p>
                  </div>
                </div>
                
                <div className={`md:w-2/3 p-8 transition-colors ${
                  theme === 'dark' ? 'bg-primary/20' : 'bg-white'
                }`}>
                  <div className="grid md:grid-cols-2 gap-6">
                    {[
                      {
                        icon: <FaCalendarAlt className={`text-xl transition-colors ${
                          theme === 'dark' ? 'text-primary-light' : 'text-primary'
                        }`} />,
                        title: "Pelaksanaan",
                        desc: "Implementasi proyek restorasi sesuai dengan perencanaan dan timeline yang telah disepakati"
                      },
                      {
                        icon: <FaUsers className={`text-xl transition-colors ${
                          theme === 'dark' ? 'text-primary-light' : 'text-primary'
                        }`} />,
                        title: "Partisipasi Stakeholder",
                        desc: "Melibatkan berbagai pihak termasuk pemerintah, komunitas, dan sektor swasta"
                      },
                      {
                        icon: <GiGrowth className={`text-xl transition-colors ${
                          theme === 'dark' ? 'text-primary-light' : 'text-primary'
                        }`} />,
                        title: "Biodiversitas Target",
                        desc: "Fokus pada pemulihan spesies dan habitat yang sesuai dengan kondisi lingkungan lokal"
                      },
                      {
                        icon: <FaChartLine className={`text-xl transition-colors ${
                          theme === 'dark' ? 'text-primary-light' : 'text-primary'
                        }`} />,
                        title: "Monitoring Sistematis",
                        desc: "Pengukuran parameter kesehatan ekosistem secara berkala dan terstruktur"
                      }
                    ].map((item, index) => (
                      <div key={index} className="flex items-start">
                        <div className={`p-3 rounded-lg mr-4 transition-colors ${
                          theme === 'dark'
                            ? 'bg-primary/40'
                            : 'bg-primary/20'
                        }`}>
                          {item.icon}
                        </div>
                        <div>
                          <h4 className={`font-semibold transition-colors ${
                            theme === 'dark' ? 'text-primary-light' : 'text-gray-800'
                          }`}>{item.title}</h4>
                          <p className={`transition-colors ${
                            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                          }`}>{item.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Monitoring Method Section */}
          <div className="mb-20">
            <h2 className={`text-3xl font-semibold mb-8 transition-colors ${
              theme === 'dark' ? 'text-primary-light' : 'text-primary'
            }`}>
              Standar & Metode Monitoring
            </h2>
            
            <div className={`p-8 rounded-xl transition-colors ${
              theme === 'dark'
                ? 'bg-primary/25 backdrop-blur border border-primary/10'
                : 'bg-gradient-to-br from-gray-50 to-white border border-gray-200'
            }`}>
              <div className="grid md:grid-cols-3 gap-6">
                <div className={`p-6 rounded-lg transition-colors ${
                  theme === 'dark'
                    ? 'bg-primary/30 border border-primary/10'
                    : 'bg-white border border-gray-100'
                }`}>
                  <div className="flex items-center mb-4">
                    <div className={`p-2 rounded-lg mr-3 transition-colors ${
                      theme === 'dark'
                        ? 'bg-primary/40'
                        : 'bg-primary/20'
                    }`}>
                      <FaCalendarAlt className={`text-lg transition-colors ${
                        theme === 'dark' ? 'text-primary-light' : 'text-primary'
                      }`} />
                    </div>
                    <h3 className={`font-medium transition-colors ${
                      theme === 'dark' ? 'text-primary-light' : 'text-gray-800'
                    }`}>Jadwal Monitoring</h3>
                  </div>
                  <p className={`font-medium transition-colors ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  }`}>Berkala & Sistematis</p>
                  <p className={`text-sm mt-1 transition-colors ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                  }`}>Dilakukan sesuai protokol dan timeline yang telah ditetapkan</p>
                </div>
                
                <div className={`p-6 rounded-lg transition-colors ${
                  theme === 'dark'
                    ? 'bg-primary/30 border border-primary/10'
                    : 'bg-white border border-gray-100'
                }`}>
                  <div className="flex items-center mb-4">
                    <div className={`p-2 rounded-lg mr-3 transition-colors ${
                      theme === 'dark'
                        ? 'bg-primary/40'
                        : 'bg-primary/20'
                    }`}>
                      <FaWater className={`text-lg transition-colors ${
                        theme === 'dark' ? 'text-primary-light' : 'text-primary'
                      }`} />
                    </div>
                    <h3 className={`font-medium transition-colors ${
                      theme === 'dark' ? 'text-primary-light' : 'text-gray-800'
                    }`}>Jenis Data</h3>
                  </div>
                  <p className={`font-medium transition-colors ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  }`}>Kuantitatif & Kualitatif</p>
                  <p className={`text-sm mt-1 transition-colors ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                  }`}>Mencakup pengukuran fisik dan penilaian kondisi lingkungan</p>
                </div>
                
                <div className={`p-6 rounded-lg transition-colors ${
                  theme === 'dark'
                    ? 'bg-primary/30 border border-primary/10'
                    : 'bg-white border border-gray-100'
                }`}>
                  <div className="flex items-center mb-4">
                    <div className={`p-2 rounded-lg mr-3 transition-colors ${
                      theme === 'dark'
                        ? 'bg-primary/40'
                        : 'bg-primary/20'
                    }`}>
                      <FaRuler className={`text-lg transition-colors ${
                        theme === 'dark' ? 'text-primary-light' : 'text-primary'
                      }`} />
                    </div>
                    <h3 className={`font-medium transition-colors ${
                      theme === 'dark' ? 'text-primary-light' : 'text-gray-800'
                    }`}>Indikator Kunci</h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {["Survival rate", "Pertumbuhan", "Kesehatan", "Biodiversitas"].map((item, index) => (
                      <span key={index} className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                        theme === 'dark'
                          ? 'bg-primary/40 text-primary-light'
                          : 'bg-primary/20 text-primary'
                      }`}>
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className={`mt-8 p-6 rounded-lg transition-colors ${
                theme === 'dark'
                  ? 'bg-primary/30 border border-primary/10'
                  : 'bg-white border border-gray-100'
              }`}>
                <h4 className={`font-medium mb-3 transition-colors ${
                  theme === 'dark' ? 'text-primary-light' : 'text-gray-800'
                }`}>Instrumen & Metodologi</h4>
                <div className="flex flex-wrap gap-3">
                  {[
                    { name: "Alat Pengukur Fisik", color: "primary" },
                    { name: "Dokumentasi Visual", color: "primary" },
                    { name: "Sampling Lapangan", color: "primary" },
                    { name: "Form Pengumpul Data", color: "primary" },
                    { name: "Teknologi GIS/GPS", color: "primary" },
                    { name: "Analisis Laboratorium", color: "primary" }
                  ].map((tool, index) => {
                    const colorMap = {
                      primary: theme === 'dark' 
                        ? 'bg-primary/40 text-primary-light' 
                        : 'bg-primary/20 text-primary'
                    };
                    return (
                      <div key={index} className={`px-4 py-2 rounded-lg flex items-center transition-colors ${colorMap[tool.color]}`}>
                        <div className={`h-2 w-2 rounded-full mr-2 transition-colors ${
                          theme === 'dark' 
                            ? 'bg-current'
                            : `bg-${tool.color}-600`
                        }`}></div>
                        {tool.name}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Results & Discussion Section */}
          <div className="mb-16">
            <h2 className={`text-3xl font-semibold mb-8 flex items-center transition-colors ${
              theme === 'dark' ? 'text-primary-light' : 'text-primary'
            }`}>
              <FaClipboardCheck className="mr-3" />
              Hasil & Pembahasan Monitoring
            </h2>
            
            <div className={`rounded-xl overflow-hidden transition-colors ${
              theme === 'dark'
                ? 'bg-primary/25 backdrop-blur border border-primary/10'
                : 'bg-white shadow-xl'
            }`}>
              <div className="grid md:grid-cols-2">
                {/* Left Column - Metrics */}
                <div className={`p-8 md:p-10 transition-colors ${
                  theme === 'dark'
                    ? 'bg-primary/20'
                    : 'bg-gradient-to-br from-gray-50 to-white'
                }`}>
                  <div className="space-y-8">
                    {/* Success Rate */}
                    <div>
                      <h3 className={`text-xl font-medium mb-4 flex items-center transition-colors ${
                        theme === 'dark' ? 'text-primary-light' : 'text-gray-800'
                      }`}>
                        <div className={`p-2 rounded-lg mr-3 transition-colors ${
                          theme === 'dark'
                            ? 'bg-primary/40'
                            : 'bg-primary/20'
                        }`}>
                          <FaChartLine className={`transition-colors ${
                            theme === 'dark' ? 'text-primary-light' : 'text-primary'
                          }`} />
                        </div>
                        Tingkat Keberhasilan
                      </h3>
                      <div className="pl-11">
                        <div className="flex items-end mb-2">
                          <span className={`text-4xl font-bold mr-2 transition-colors ${
                            theme === 'dark' ? 'text-primary-light' : 'text-primary'
                          }`}>
                            {monitoringData.survivalRate}%
                          </span>
                          <span className={`mb-1 transition-colors ${
                            theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                          }`}>
                            ({monitoringData.survivingPlants}/{monitoringData.initialPlants} unit)
                          </span>
                        </div>
                        <div className={`w-full rounded-full h-3 transition-colors ${
                          theme === 'dark' ? 'bg-primary/30' : 'bg-gray-200'
                        }`}>
                          <div 
                            className="bg-gradient-to-r from-primary to-primary-dark h-3 rounded-full" 
                            style={{ width: `${monitoringData.survivalRate}%` }}
                          ></div>
                        </div>
                        <p className={`text-sm mt-3 transition-colors ${
                          theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                        }`}>
                          Pencapaian di atas target baseline menunjukkan efektivitas pendekatan restorasi yang diterapkan.
                        </p>
                      </div>
                    </div>
                    
                    {/* Growth Metrics */}
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <h4 className={`font-medium mb-2 transition-colors ${
                          theme === 'dark' ? 'text-primary-light' : 'text-gray-700'
                        }`}>Pertumbuhan Dimensi</h4>
                        <div className={`p-4 rounded-lg transition-colors ${
                          theme === 'dark'
                            ? 'bg-primary/30 border border-primary/10'
                            : 'bg-primary/20'
                        }`}>
                          <p className={`text-2xl font-bold transition-colors ${
                            theme === 'dark' ? 'text-primary-light' : 'text-primary'
                          }`}>
                            {monitoringData.averageHeight}
                          </p>
                          <p className={`text-xs mt-1 transition-colors ${
                            theme === 'dark' ? 'text-primary-light' : 'text-primary'
                          }`}>
                            +{monitoringData.heightIncrease}
                          </p>
                        </div>
                      </div>
                      <div>
                        <h4 className={`font-medium mb-2 transition-colors ${
                          theme === 'dark' ? 'text-primary-light' : 'text-gray-700'
                        }`}>Penambahan Biomassa</h4>
                        <div className={`p-4 rounded-lg transition-colors ${
                          theme === 'dark'
                            ? 'bg-primary/30 border border-primary/10'
                            : 'bg-primary/20'
                        }`}>
                          <p className={`text-2xl font-bold transition-colors ${
                            theme === 'dark' ? 'text-primary-light' : 'text-primary'
                          }`}>
                            {monitoringData.averageDiameter}
                          </p>
                          <p className={`text-xs mt-1 transition-colors ${
                            theme === 'dark' ? 'text-primary-light' : 'text-primary'
                          }`}>
                            +{monitoringData.diameterIncrease}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Right Column - Health & Discussion */}
                <div className={`p-8 md:p-10 transition-colors ${
                  theme === 'dark'
                    ? 'bg-primary/15 border-t md:border-t-0 md:border-l border-primary/10'
                    : 'border-t md:border-t-0 md:border-l border-gray-200'
                }`}>
                  <div className="space-y-8">
                    {/* Health Condition */}
                    <div>
                      <h3 className={`text-xl font-medium mb-4 flex items-center transition-colors ${
                        theme === 'dark' ? 'text-primary-light' : 'text-gray-800'
                      }`}>
                        <div className={`p-2 rounded-lg mr-3 transition-colors ${
                          theme === 'dark'
                            ? 'bg-primary/40'
                            : 'bg-primary/20'
                        }`}>
                          <RiHealthBookFill className={`transition-colors ${
                            theme === 'dark' ? 'text-primary-light' : 'text-primary'
                          }`} />
                        </div>
                        Status Ekosistem
                      </h3>
                      <div className="pl-11">
                        <div className={`inline-block px-4 py-2 rounded-full font-medium mb-3 transition-colors ${
                          theme === 'dark'
                            ? 'bg-green-950/40 text-green-300 border border-green-300/20'
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {monitoringData.healthCondition}
                        </div>
                        <p className={`mb-4 transition-colors ${
                          theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                        }`}>
                          {monitoringData.healthDetails.replace(/daun/g, "komponen biota").replace(/kerusakan tepi daun/g, "stress minor")}
                        </p>
                        <div className="flex space-x-3">
                          {["Stabilitas tinggi", "Tekanan minimal", "Regenerasi aktif"].map((item, index) => (
                            <div key={index} className="flex items-center">
                              <div className={`h-2 w-2 rounded-full mr-2 transition-colors ${
                                theme === 'dark' ? 'bg-green-400' : 'bg-green-500'
                              }`}></div>
                              <span className={`text-sm transition-colors ${
                                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                              }`}>{item}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    {/* Discussion */}
                    <div>
                      <h3 className={`text-xl font-medium mb-4 transition-colors ${
                        theme === 'dark' ? 'text-emerald-200' : 'text-gray-800'
                      }`}>Pembahasan & Analisis</h3>
                      <div className={`space-y-3 transition-colors ${
                        theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        <p>
                          Hasil monitoring menunjukkan progres positif dengan tingkat keberhasilan mencapai {monitoringData.survivalRate}%, mengindikasikan adaptasi yang efektif terhadap kondisi lingkungan. Pertumbuhan yang konsisten menunjukkan bahwa ekosistem yang dipulihkan mulai mencapai stabilitas dan ketahanan terhadap tekanan eksternal.
                        </p>
                        <p>
                          Faktor-faktor yang mendukung keberhasilan mencakup: perencanaan yang matang, pemilihan spesies yang tepat sasaran, timing implementasi yang optimal, dan dukungan berkelanjutan dari berbagai stakeholder. Tantangan yang dihadapi telah diminimalisir melalui intervensi adaptif dan manajemen berkelanjutan.
                        </p>
                        <p>
                          Langkah berikutnya meliputi: monitoring jangka panjang untuk memastikan keberlanjutan, pengukuran parameter ekosistem tambahan, diversifikasi spesies untuk meningkatkan resiliensi, dan ekspansi program ke area lain yang memerlukan restorasi.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ✅ Footer Component */}
      <Footer />
    </>
  );
};

export default About;