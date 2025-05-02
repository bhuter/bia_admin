import axios, { AxiosInstance } from 'axios';

interface Amount {
  amount: string;
  currency: string;
}

interface Payer {
  partyIdType: string; // e.g., "MSISDN"
  partyId: string; // e.g., phone number
}

interface Payee {
  payeeIdType: "MSISDN" | string; // Flexible payee ID type
  payeeId: string; // Payee's phone number
  payeeNote: string;
  payerMessage: string;
  externalId: string; // Unique identifier for this transaction
}

interface PaymentDetails {
  amount: Amount;
  payer: Payer;
  payee: Payee;
}

interface MTNPaymentResponse {
  success: boolean;
  data?: any;
  message?: string;
}

class MTNPayment {
  private clientId: string;
  private clientSecret: string;
  private baseURL: string;
  private accessToken: string | null = null;
  private axiosInstance: AxiosInstance;

  constructor(clientId: string, clientSecret: string) {
    if (!clientId || !clientSecret) {
      throw new Error('Client ID and Client Secret are required');
    }

    this.clientId = clientId;
    this.clientSecret = clientSecret;
    this.baseURL = 'https://api.mtn.com/v1';
    this.axiosInstance = axios.create({ baseURL: this.baseURL });
  }

  // Authenticate and fetch access token
  public async authenticate(): Promise<string> {
    try {
      const response = await this.axiosInstance.post('/oauth/access_token', null, {
        params: { grant_type: 'client_credentials' },
        headers: {
          Authorization: `Basic ${Buffer.from(`${this.clientId}:${this.clientSecret}`).toString('base64')}`,
        },
      });
  
      this.accessToken = response.data.access_token;
  
      if (!this.accessToken) {
        throw new Error('Failed to obtain access token');
      }
  
      return this.accessToken;
    } catch (error: any) {
      const errorMessage = error.response?.data?.error_description || error.message || 'Authentication error';
      console.error('Authentication error:', errorMessage);
      throw new Error(errorMessage);
    }
  }
  
  

  // Initiate payment
  public async initiatePayment(paymentDetails: PaymentDetails): Promise<MTNPaymentResponse> {
    if (!this.accessToken) {
      await this.authenticate();
    }

    try {
      const response = await this.axiosInstance.post('/payment', paymentDetails, {
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      return {
        success: true,
        data: response.data,
      };
    } catch (error: any) {
      console.error('Payment initiation error:', error.response?.data || error.message);
      return {
        success: false,
        message: 'Failed to initiate payment with MTN',
      };
    }
  }
}

export default MTNPayment;
export type { PaymentDetails };
