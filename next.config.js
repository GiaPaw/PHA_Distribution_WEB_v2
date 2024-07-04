/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: [
      "res.cloudinary.com", 
      "cdn-icons-png.freepik.com", 
      "cdn.haitrieu.com", 
      "t4.ftcdn.net"
    ],
  },
  publicRuntimeConfig: {
    vnp_TmnCode: "GUPKYIQ8",
    vnp_HashSecret: "EO12YIS8EMYB7RD85QGRLY40IP59ELGO",
    vnp_Url: "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html",
    vnp_ReturnUrl: "https://phadistributionwebv2-production.up.railway.app/api/payments/vnpay_return"  // Đảm bảo URL này đúng
  }
};

module.exports = nextConfig;
