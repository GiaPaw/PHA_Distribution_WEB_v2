import { format } from 'date-fns';
import getConfig from 'next/config';
import crypto from 'crypto';
import qs from 'qs';
import { sortObject } from '../../../utils/sortObject';

const { publicRuntimeConfig } = getConfig();


export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const ipAddr = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    const tmnCode = publicRuntimeConfig.vnp_TmnCode;
    const secretKey = publicRuntimeConfig.vnp_HashSecret;
    const vnpUrl = publicRuntimeConfig.vnp_Url;
    const returnUrl = publicRuntimeConfig.vnp_ReturnUrl;

    const date = new Date();
    const createDate = format(date, 'yyyyMMddHHmmss');
    const { amount, orderId: txnRef } = req.body;

    if (!amount || !txnRef) {
      return res.status(400).json({ message: 'Missing required parameters' });
    }

    const locale = 'vn';
    const currCode = 'VND';

    let vnp_Params = {
      'vnp_Version': '2.1.0',
      'vnp_Command': 'pay',
      'vnp_TmnCode': tmnCode,
      'vnp_Locale': locale,
      'vnp_CurrCode': currCode,
      'vnp_TxnRef': txnRef,
      'vnp_OrderInfo': `Thanh toan don hang ${txnRef}`,
      'vnp_OrderType': 'other',
      'vnp_Amount': amount * 100,
      'vnp_ReturnUrl': returnUrl,
      'vnp_IpAddr': ipAddr,
      'vnp_CreateDate': createDate,
    };

    vnp_Params = sortObject(vnp_Params);

    const signData = qs.stringify(vnp_Params, { encode: false });
    const hmac = crypto.createHmac('sha512', secretKey);
    const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');
    vnp_Params['vnp_SecureHash'] = signed;

    const paymentUrl = `${vnpUrl}?${qs.stringify(vnp_Params, { encode: false })}`;
    res.status(200).json({ paymentUrl });
  } catch (error) {
    console.error('Error creating payment URL:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}

function sortObject(obj) {
  const sorted = {};
  const keys = Object.keys(obj).sort();
  keys.forEach((key) => {
    sorted[key] = obj[key];
  });
  return sorted;
}
