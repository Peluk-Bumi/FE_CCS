export const resolveProjectDisplay = (record = {}) => {
  const companyCandidates = [
    record?.nama_perusahaan,
    record?.nama_perusahaan_sesuai,
    record?.perencanaan?.nama_perusahaan,
    record?.implementasi?.nama_perusahaan,
    record?.implementasi?.perencanaan?.nama_perusahaan,
  ];

  const locationCandidates = [
    record?.lokasi,
    record?.lokasi_sesuai,
    record?.perencanaan?.lokasi,
    record?.implementasi?.lokasi,
    record?.implementasi?.perencanaan?.lokasi,
  ];

  const statusCandidates = [
    record?.status,
    record?.perencanaan?.status,
    record?.implementasi?.status,
  ];

  const company = companyCandidates.find((value) => typeof value === 'string' && value.trim()) || 'Perusahaan tanpa nama';
  const location = locationCandidates.find((value) => typeof value === 'string' && value.trim()) || '-';
  const status = statusCandidates.find((value) => typeof value === 'string' && value.trim()) || 'planning';

  return {
    company,
    location,
    status,
  };
};
