import { AxiosError } from "axios";
import { api, unwrapData } from "../shared/client";

const ppdbEndpoint = "/api/ppdb";

export const createPpdbRegistration = async (
  payload: Record<string, unknown>,
) => {
  const response = await api.post(ppdbEndpoint, payload);
  return unwrapData<Record<string, unknown>>(response.data);
};

export const notifyPpdbAdmin = async (payload: Record<string, unknown>) => {
  const candidateEndpoints = [
    `${ppdbEndpoint}/notify`,
    `${ppdbEndpoint}/notifications`,
    `${ppdbEndpoint}/send-notification`,
  ];

  for (const endpoint of candidateEndpoints) {
    try {
      const response = await api.post(endpoint, payload);
      return unwrapData<Record<string, unknown>>(response.data);
    } catch (error) {
      if (error instanceof AxiosError && error.response?.status !== 404) {
        throw error;
      }
    }
  }

  return null;
};
