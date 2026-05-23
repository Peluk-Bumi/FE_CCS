import api from '@/shared/services/api';

const INTELLIGENCE_ENDPOINT = '/intelligence';

export const getSurvivalTrend = async (perencanaanId) => {
  try {
    const response = await api.get(`${INTELLIGENCE_ENDPOINT}/perencanaan/${perencanaanId}/survival-trend`);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching survival trend:', error);
    throw error;
  }
};

export const getESGScore = async (perencanaanId) => {
  try {
    const response = await api.get(`${INTELLIGENCE_ENDPOINT}/perencanaan/${perencanaanId}/esg-score`);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching ESG score:', error);
    throw error;
  }
};

export const getAnomalies = async (perencanaanId) => {
  try {
    const response = await api.get(`${INTELLIGENCE_ENDPOINT}/perencanaan/${perencanaanId}/anomalies`);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching anomalies:', error);
    throw error;
  }
};

export const getIntelligenceReport = async (perencanaanId) => {
  try {
    const response = await api.get(`${INTELLIGENCE_ENDPOINT}/perencanaan/${perencanaanId}/report`);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching intelligence report:', error);
    throw error;
  }
};
