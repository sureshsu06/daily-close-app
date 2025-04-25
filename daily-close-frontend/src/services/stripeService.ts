import { parse } from 'papaparse';

export interface StripePayment {
  Payment_ID: string;
  Order_ID: string;
  Payment_Date: string;
  Amount: number;
  Currency: string;
  Payment_Method: string;
  Stripe_Fee: number;
  Net_Amount: number;
  Status: string;
  Refunded: string;
  Refund_Amount: number;
  Refund_Date: string;
}

export const getMockStripePayments = (): StripePayment[] => {
  return [
    {
      Payment_ID: 'pi_txofkmvx8ksrpp52mw4y1w',
      Order_ID: 'SHF1000112',
      Payment_Date: '2024-03-15 00:55:00',
      Amount: 244.37,
      Currency: 'USD',
      Payment_Method: 'Credit Card',
      Stripe_Fee: 7.39,
      Net_Amount: 236.98,
      Status: 'succeeded',
      Refunded: 'No',
      Refund_Amount: 0.00,
      Refund_Date: '',
    },
    {
      Payment_ID: 'pi_yxftimqfcnfyxktxz0tjhc',
      Order_ID: 'SHF1000119',
      Payment_Date: '2024-03-15 00:48:00',
      Amount: 524.56,
      Currency: 'USD',
      Payment_Method: 'Credit Card',
      Stripe_Fee: 15.51,
      Net_Amount: 509.05,
      Status: 'succeeded',
      Refunded: 'Yes',
      Refund_Amount: 262.28,
      Refund_Date: '2024-03-21 00:48:00',
    },
    {
      Payment_ID: 'pi_69k70gzqgwdxh7vf12iueo',
      Order_ID: 'SHF1000040',
      Payment_Date: '2024-03-15 00:47:00',
      Amount: 1202.15,
      Currency: 'USD',
      Payment_Method: 'Shop Pay',
      Stripe_Fee: 35.16,
      Net_Amount: 1166.99,
      Status: 'succeeded',
      Refunded: 'No',
      Refund_Amount: 0.00,
      Refund_Date: '',
    }
  ];
}; 