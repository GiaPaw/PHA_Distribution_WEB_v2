import crypto from 'crypto';
import qs from 'qs';
import getConfig from 'next/config';

const { publicRuntimeConfig } = getConfig();

export default function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const vnp_Params = req.query;
    const secureHash = vnp_Params['vnp_SecureHash'];

    delete vnp_Params['vnp_SecureHash'];
    delete vnp_Params['vnp_SecureHashType'];

    const sortedParams = sortObject(vnp_Params);
    const signData = qs.stringify(sortedParams, { encode: false });
    const secretKey = publicRuntimeConfig.vnp_HashSecret;
    const hmac = crypto.createHmac('sha512', secretKey);
    const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');

    if (secureHash === signed) {
      // Kiểm tra và xử lý kết quả giao dịch tại đây
      const rspCode = vnp_Params['vnp_ResponseCode'];
      res.render('success', { code: rspCode });
    } else {
      res.render('success', { code: '97' });
    }
  } catch (error) {
    console.error('Error handling return URL:', error);
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