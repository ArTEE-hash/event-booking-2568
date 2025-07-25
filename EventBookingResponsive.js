
import React, { useEffect, useState } from 'react';
import { addBooking, getAllBookings, cancelBooking as cancelBookingFirebase } from './firebaseConfig';

const EventBookingResponsive = () => {
  const [bookings, setBookings] = useState({});
  const [selectedSeat, setSelectedSeat] = useState(null);
  const [userInfo, setUserInfo] = useState({ name: '', organization: '', phone: '' });
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getAllBookings();
      setBookings(data);
    };
    fetchData();
  }, []);

  const handleBook = async () => {
    if (!userInfo.name || !userInfo.organization || !userInfo.phone) {
      alert('กรุณากรอกข้อมูลให้ครบ');
      return;
    }
    await addBooking(selectedSeat, userInfo);
    const updated = await getAllBookings();
    setBookings(updated);
    setSelectedSeat(null);
    setUserInfo({ name: '', organization: '', phone: '' });
    setShowForm(false);
    alert('จองที่นั่งเรียบร้อย');
  };

  const handleCancel = async (seatId) => {
    if (!window.confirm('ต้องการยกเลิกการจองหรือไม่?')) return;
    await cancelBookingFirebase(seatId);
    const updated = await getAllBookings();
    setBookings(updated);
  };

  const renderSeat = (seatId) => {
    const isBooked = bookings[seatId];
    return (
      <button
        key={seatId}
        className={\`w-8 h-8 m-1 rounded-full text-white text-xs font-bold \${isBooked ? 'bg-red-500' : 'bg-green-500'}\`}
        onClick={() => isBooked ? handleCancel(seatId) : (setSelectedSeat(seatId), setShowForm(true))}
        title={isBooked ? \`\${bookings[seatId].name} (\${bookings[seatId].organization})\` : 'คลิกเพื่อจอง'}
      >
        {seatId.split('-').pop()}
      </button>
    );
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">ระบบจองที่นั่ง (Firebase)</h1>
      <div className="flex flex-wrap">
        {Array.from({ length: 10 }, (_, i) => renderSeat(\`VIP-\${i + 1}\`))}
      </div>

      {showForm && (
        <div className="mt-6 border p-4 rounded bg-white shadow max-w-sm">
          <h2 className="font-semibold mb-2">จองที่นั่ง {selectedSeat}</h2>
          <input type="text" className="border p-2 w-full mb-2" placeholder="ชื่อ-นามสกุล"
            value={userInfo.name} onChange={e => setUserInfo({ ...userInfo, name: e.target.value })} />
          <input type="text" className="border p-2 w-full mb-2" placeholder="หน่วยงาน"
            value={userInfo.organization} onChange={e => setUserInfo({ ...userInfo, organization: e.target.value })} />
          <input type="text" className="border p-2 w-full mb-2" placeholder="เบอร์โทรศัพท์"
            value={userInfo.phone} onChange={e => setUserInfo({ ...userInfo, phone: e.target.value })} />
          <div className="flex space-x-2 mt-3">
            <button onClick={handleBook} className="bg-green-600 text-white px-4 py-2 rounded">ยืนยัน</button>
            <button onClick={() => setShowForm(false)} className="bg-gray-500 text-white px-4 py-2 rounded">ยกเลิก</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventBookingResponsive;
