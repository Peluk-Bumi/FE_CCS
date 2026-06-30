const fs = require('fs');
const path = 'D:/98. Others/LANGIT/CCS-2205-1700/FE_CCS/src/features/verification/components/LaporanDetailModal.jsx';
let content = fs.readFileSync(path, 'utf8');

// 1. Add useState
content = content.replace('import { Accordion }', 'import { useState } from \"react\";\nimport { Accordion }');

// 2. Add activeTab state
content = content.replace('const currentStageLabel = currentStage?.label || \"Perencanaan\";', 'const currentStageLabel = currentStage?.label || \"Perencanaan\";\n  const [activeTab, setActiveTab] = useState(\"lembaga\");');

// 3. Remove getPublicFields definition
content = content.replace(/const getPublicFields = \(report\) => \[[\s\S]*?\];/, '');
content = content.replace('const publicFields = getPublicFields(report);', '');

// 4. Update Footer prop
content = content.replace(/footer=\{[\s\S]*?Tutup\s*<\/FormButton>\s*\}/, 
\ooter={
        <div className="flex flex-col sm:flex-row justify-end w-full gap-3">
          <FormButton
            onClick={onReset}
            variant="primary"
            className="w-full sm:w-auto px-4 py-2 h-auto"
            icon={<FiRefreshCw />}
          >
            Scan QR Lain
          </FormButton>
          <FormButton
            variant="outline"
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-2 h-auto"
          >
            Tutup
          </FormButton>
        </div>
      }\);

// 5. Replace Grid Layout with Tabs
const oldGridLayout = /<div className=\"grid gap-6 lg:grid-cols-\[1\.2fr_0\.8fr\] items-start\">[\s\S]*?(?=<\div className=\"grid gap-4 sm:grid-cols-2 lg:grid-cols-4\">)/;

const newTabsLayout = \
                  <div className="flex border-b border-gray-200 dark:border-gray-700 overflow-x-auto">
                    {[
                      { id: 'lembaga', label: 'Lembaga' },
                      { id: 'perencanaan', label: 'Perencanaan' },
                      { id: 'implementasi', label: 'Implementasi' },
                      { id: 'evaluasi', label: 'Evaluasi & Monitoring' },
                    ].map(tab => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={\\\px-4 py-3 text-sm font-semibold whitespace-nowrap \\\\\\}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>

                  <div className="py-4 space-y-6">
                    {activeTab === 'lembaga' && (
                      <section className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-5">
                        <div className="flex items-center gap-2 mb-4">
                          <FiClipboard className="w-5 h-5 text-primary" />
                          <h4 className="font-bold text-gray-900 dark:text-gray-100">Informasi Lembaga</h4>
                        </div>
                        <div className="grid gap-4 sm:grid-cols-2">
                          <InfoCard label="Nama Lembaga" value={pickValue(report?.nama_perusahaan, report?.perusahaan, report?.perencanaan?.nama_perusahaan)} />
                          <InfoCard label="Nama PIC" value={pickValue(report?.nama_pic, report?.perencanaan?.nama_pic)} />
                          <InfoCard label="Narahubung" value={pickValue(report?.narahubung, report?.perencanaan?.narahubung)} />
                        </div>
                      </section>
                    )}

                    {activeTab === 'perencanaan' && (
                      <section className="space-y-4">
                        <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-5">
                          <div className="flex items-center gap-2 mb-4">
                            <FiActivity className="w-5 h-5 text-primary" />
                            <h4 className="font-bold text-gray-900 dark:text-gray-100">Informasi Perencanaan</h4>
                          </div>
                          <div className="grid gap-4 sm:grid-cols-2">
                            <InfoCard label="Jenis Kegiatan" value={pickValue(report?.jenis_kegiatan, report?.perencanaan?.jenis_kegiatan)} />
                            <InfoCard label="Lokasi" value={pickValue(report?.lokasi, report?.perencanaan?.lokasi)} mono />
                            <InfoCard label="Tanggal Direncanakan" value={formatDateId(pickValue(report?.tanggal_pelaksanaan, report?.perencanaan?.tanggal_pelaksanaan))} />
                            <InfoCard label="Jumlah Bibit" value={pickValue(report?.jumlah_bibit, report?.perencanaan?.jumlah_bibit)} />
                            <InfoCard label="Jenis Bibit" value={pickValue(report?.jenis_bibit, report?.perencanaan?.jenis_bibit)} />
                          </div>
                        </div>
                        {(report?.perencanaan?.blockchain_tx_hash || txHash) && (
                          <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-5">
                            <div className="flex items-center gap-2 mb-4">
                              <FiShield className="w-5 h-5 text-primary" />
                              <h4 className="font-bold text-gray-900 dark:text-gray-100">TX Hash Perencanaan</h4>
                            </div>
                            <a href={\\\\/tx/\\\\} target="_blank" rel="noopener noreferrer" className="text-sm font-mono text-primary break-all flex items-center gap-2">
                              {report?.perencanaan?.blockchain_tx_hash || txHash} <FiExternalLink className="w-3.5 h-3.5 flex-shrink-0" />
                            </a>
                          </div>
                        )}
                      </section>
                    )}

                    {activeTab === 'implementasi' && (
                      <section className="space-y-4">
                        <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-5">
                          <div className="flex items-center gap-2 mb-4">
                            <FiLayers className="w-5 h-5 text-primary" />
                            <h4 className="font-bold text-gray-900 dark:text-gray-100">Informasi Implementasi</h4>
                          </div>
                          <div className="grid gap-4 sm:grid-cols-2">
                            <InfoCard label="Tanggal Diimplementasikan" value={formatDateId(report?.implementasi?.tanggal_pelaksanaan || report?.tanggal_implementasi)} />
                            <InfoCard label="Jumlah Bibit Ditanam" value={report?.implementasi?.jumlah_bibit || report?.jumlah_bibit_ditanam} />
                            <InfoCard label="Status Implementasi" value={report?.is_implemented || report?.implementasi ? "Sudah Diimplementasikan" : "Belum Diimplementasikan"} />
                          </div>
                        </div>
                        {report?.implementasi?.blockchain_tx_hash && (
                          <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-5">
                            <div className="flex items-center gap-2 mb-4">
                              <FiShield className="w-5 h-5 text-primary" />
                              <h4 className="font-bold text-gray-900 dark:text-gray-100">TX Hash Implementasi</h4>
                            </div>
                            <a href={\\\\/tx/\\\\} target="_blank" rel="noopener noreferrer" className="text-sm font-mono text-primary break-all flex items-center gap-2">
                              {report?.implementasi?.blockchain_tx_hash} <FiExternalLink className="w-3.5 h-3.5 flex-shrink-0" />
                            </a>
                          </div>
                        )}
                      </section>
                    )}

                    {activeTab === 'evaluasi' && (
                      <section className="space-y-4">
                        <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-5">
                          <div className="flex items-center gap-2 mb-4">
                            <FiBarChart2 className="w-5 h-5 text-primary" />
                            <h4 className="font-bold text-gray-900 dark:text-gray-100">Evaluasi & Monitoring</h4>
                          </div>
                          <div className="grid gap-4 sm:grid-cols-2">
                            {evaluationSummary.map((item) => (
                              <InfoCard
                                key={item.label}
                                label={item.label}
                                value={item.label === "Monitoring Tersedia" ? Number(item.value) : item.value}
                                accent={item.label === "Status Kesehatan" ? "green" : item.label === "Survival Rate" ? "blue" : "default"}
                              />
                            ))}
                          </div>
                        </div>
                        {(report?.monitoring?.blockchain_tx_hash || report?.evaluasi?.blockchain_tx_hash) && (
                          <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-5">
                            <div className="flex items-center gap-2 mb-4">
                              <FiShield className="w-5 h-5 text-primary" />
                              <h4 className="font-bold text-gray-900 dark:text-gray-100">TX Hash Evaluasi/Monitoring</h4>
                            </div>
                            <a href={\\\\/tx/\\\\} target="_blank" rel="noopener noreferrer" className="text-sm font-mono text-primary break-all flex items-center gap-2">
                              {report?.evaluasi?.blockchain_tx_hash || report?.monitoring?.blockchain_tx_hash} <FiExternalLink className="w-3.5 h-3.5 flex-shrink-0" />
                            </a>
                          </div>
                        )}
                      </section>
                    )}
                  </div>
\n;

content = content.replace(oldGridLayout, newTabsLayout);

// 6. Remove the old footer section in the body
const oldFooterSection = /<div className=\"border-t border-gray-200 dark:border-gray-700 pt-5 flex flex-col sm:flex-row justify-between gap-3\">[\s\S]*?<\/div>\s*<\/>/;
content = content.replace(oldFooterSection, '</>');

fs.writeFileSync(path, content);
console.log('Done!');
