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
    vnp_TmnCode: "QE4E4CTA",
    vnp_HashSecret: "DXITNG30RXFI5GLRLCTVI63JORTWL42L",
    vnp_Url: "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html",
    vnp_ReturnUrl: "https://phadistributionwebv2-production-7c4f.up.railway.app/api/payments/vnpay_return"  // Đảm bảo URL này đúng
  }
};

module.exports = nextConfig;
