import axiosInstance from '../utils/axiosInstance';

export const chatbotService = {
  getGreeting: () => axiosInstance.get('greeting/').then(res => res.data),
  ask: (data) => {
    const payload = typeof data === 'string' ? { message: data } : data;
    return axiosInstance.post('icampus-bot/', payload).then(res => res.data);
  },
};
