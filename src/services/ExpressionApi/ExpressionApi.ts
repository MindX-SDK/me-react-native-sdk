//@ts-nocheck
import axios, { AxiosInstance, AxiosResponse } from 'axios';
import {
  GatewayRequestBody,
  GatewayRequestHeader,
  GatewayResponse,
} from './ExpressionApi.types';
import ErrorHandler from '../../utils/errors/ErrorHandler';

export class ExpressionApi {
  private axiosInstance: AxiosInstance;
  private host: string;

  /**
   * Create a new Expression Api object
   * @param host API host
   */
  constructor(host: string) {
    this.host = host;
    this.axiosInstance = axios.create({
      baseURL: this.host,
      headers: {
        'Access-Control-Allow-Headers': '*',
      },
    });
  }

  getGateway = async (
    DEVELOPER_ID: string,
    SCOPE_ID: string,
    headers: GatewayRequestHeader,
    params: GatewayRequestBody
  ): Promise<GatewayResponse> => {
    try {
      const response = await this.axiosInstance.post<
        GatewayResponse,
        AxiosResponse<GatewayResponse, any>,
        GatewayRequestBody
      >(`/gateway/default/${DEVELOPER_ID}/${SCOPE_ID}`, params, {
        headers: headers,
      });
      console.log(response);

      return {
        ...response.data,
        'X-Conversation-Id':
          response?.headers?.get('X-Conversation-Id') ??
          response?.data?.['X-Conversation-Id'] ??
          null,
      };
    } catch (error) {
      //In case response have error code
      if (error?.response?.data?.code) {
        return error?.response?.data;
      }

      //In case response have error array
      if (error?.response?.data?.length) {
        return {
          code: ErrorHandler.getErrorCode(error?.message) ?? 1,
          description: error?.response?.data?.join?.(', '),
          lang: 'EN',
        };
      }

      throw error;
    }
  };
}
