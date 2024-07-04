import axios from 'axios';
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleCheck } from '@fortawesome/free-solid-svg-icons';
import Image from 'next/image';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Payment = ({ order, onClose, onPaymentSuccess }) => {
  const [selectedPayment, setSelectedPayment] = useState(null);

  const handlePaymentSelect = (method) => {
    setSelectedPayment(method);
  };

  const handlePaymentClick = async () => {
    if (!selectedPayment) {
      alert("Vui lòng chọn phương thức thanh toán.");
      return;
    }

    try {
      if (selectedPayment === 'VNPay') {
        const amount = order.total; // Ensure this value is set correctly
        const orderId = order._id; // Ensure this value is set correctly

        console.log('Amount:', amount, 'OrderId:', orderId);

        const response = await axios.post('/api/payments/create_payment_url', { amount, orderId });
        const { paymentUrl } = response.data;

        console.log('Payment URL:', paymentUrl);

        if (paymentUrl) {
          window.location.href = paymentUrl;
        } else {
          throw new Error('Payment URL is undefined');
        }
      } else {
        // Update the payment status of the order
        await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/orders/${order._id}`, {
          paymentstatus: 'Đang chờ xác nhận',
        });

        // Hiển thị thông báo thanh toán thành công
        toast.success("Đang chờ xác nhận!");
        // Sau 2 giây, gọi hàm onPaymentSuccess
        setTimeout(() => {
          location.reload();
        }, 2000); // 2 giây
      }
    } catch (error) {
      console.error('Error updating payment status:', error);
      toast.error("Có lỗi xảy ra khi thanh toán. Vui lòng thử lại.");
    }
  };

  return (
    <div className="payment-modal">
      <div className="payment-container">
        <div className="payment-title">
          <h4>Vui lòng chọn phương thức <span style={{ color: '#6064b6' }}>thanh toán</span></h4>
        </div>
        <form className="payment-form">
          <input type="radio" name="payment" id="tienmat" onChange={() => handlePaymentSelect('tienmat')} />
          <input type="radio" name="payment" id="VNPay" onChange={() => handlePaymentSelect('VNPay')} />
          <input type="radio" name="payment" id="NFC" onChange={() => handlePaymentSelect('NFC')} />

          <div className="payment-category">
            <label htmlFor="tienmat" className={`payment-label tienmatMethod ${selectedPayment === 'tienmat' ? 'selected' : ''}`}>
              <div className="imgContainer tienmat">
                <Image src="https://cdn-icons-png.freepik.com/512/5132/5132194.png" alt="cash" width={50} height={50} />
              </div>
              <div className="imgName">
                <span>Tiền mặt</span>
                <div className="check"><FontAwesomeIcon icon={faCircleCheck} /></div>
              </div>
            </label>
            <label htmlFor="VNPay" className={`payment-label VNPayMethod ${selectedPayment === 'VNPay' ? 'selected' : ''}`}>
              <div className="imgContainer VNPay">
                <Image src="https://cdn.haitrieu.com/wp-content/uploads/2022/10/Icon-VNPAY-QR.png" alt="VNPay" width={50} height={50} />
              </div>
              <div className="imgName">
                <span>VNPay</span>
                <div className="check"><FontAwesomeIcon icon={faCircleCheck} /></div>
              </div>
            </label>
            <label htmlFor="NFC" className={`payment-label NFCMethod ${selectedPayment === 'NFC' ? 'selected' : ''}`}>
              <div className="imgContainer NFC">
                <Image src="https://t4.ftcdn.net/jpg/02/07/03/21/360_F_207032162_N7N5f1fJiadnStSrW8AyEOyDaesmdJQr.jpg" alt="NFC" width={50} height={50} />
              </div>
              <div className="imgName">
                <span>NFC</span>
                <div className="check"><FontAwesomeIcon icon={faCircleCheck} /></div>
              </div>
            </label>
          </div>
        </form>
        <div className="mt-6 flex justify-center gap-4">
          <button className="bg-yellow-500 text-white py-2 px-4 rounded-md hover:bg-yellow-600" onClick={handlePaymentClick}>Thanh toán</button>
          <button onClick={onClose} className="bg-yellow-500 text-white py-2 px-4 rounded-md hover:bg-yellow-600">Đóng</button>
        </div>
        <ToastContainer />
      </div>
    </div>
  );
};

export default Payment;
