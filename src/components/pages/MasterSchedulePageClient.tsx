"use client";

export default function MasterSchedulePageClient() {
  return (
    <div className="master-schedule-container">
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&family=Oswald:wght@500&display=swap');

        .master-schedule-container {
          font-family: 'Roboto', sans-serif;
          background-color: #eaeff2;
          margin: 0;
          padding: 20px;
          color: #333;
        }

        .master-schedule-container .container {
          background-color: white;
          width: 100%;
          max-width: 1000px;
          margin: 0 auto;
          padding: 40px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
          border-radius: 15px;
          border-left: 8px solid #2c3e50;
        }

        .master-schedule-container h1 {
          text-align: center;
          font-family: 'Oswald', sans-serif;
          color: #2c3e50;
          text-transform: uppercase;
          font-size: 28px;
          letter-spacing: 1.5px;
          margin-bottom: 5px;
        }

        .master-schedule-container .subtitle {
          text-align: center;
          color: #7f8c8d;
          margin-bottom: 35px;
          font-size: 15px;
        }

        .master-schedule-container .timeline-block {
          border-left: 3px solid #bdc3c7;
          padding-left: 20px;
          margin-bottom: 0;
          position: relative;
          padding-bottom: 25px;
        }

        .master-schedule-container .timeline-block::before {
          content: '';
          width: 12px;
          height: 12px;
          background: #2c3e50;
          border-radius: 50%;
          position: absolute;
          left: -7.5px;
          top: 5px;
          border: 2px solid white;
        }

        .master-schedule-container .time-label {
          font-weight: 800;
          color: #e74c3c;
          font-size: 16px;
          display: inline-block;
          min-width: 110px;
        }

        .master-schedule-container .activity-title {
          font-weight: 700;
          font-size: 16px;
          color: #2c3e50;
          text-transform: uppercase;
        }

        .master-schedule-container .detail-box {
          background-color: #f8f9fa;
          border-radius: 6px;
          padding: 12px;
          margin-top: 8px;
          border-left: 4px solid #3498db;
        }

        .master-schedule-container .detail-row {
          display: flex;
          margin-bottom: 6px;
          align-items: baseline;
        }

        .master-schedule-container .icon {
          width: 20px;
          margin-right: 8px;
          text-align: center;
        }

        .master-schedule-container .label {
          font-weight: 600;
          font-size: 13px;
          color: #555;
          width: 80px;
          flex-shrink: 0;
        }

        .master-schedule-container .content {
          font-size: 14px;
          color: #333;
          line-height: 1.4;
        }

        .master-schedule-container .tag {
          font-size: 10px;
          padding: 2px 6px;
          border-radius: 3px;
          font-weight: bold;
          text-transform: uppercase;
          margin-left: 5px;
          vertical-align: middle;
        }

        .master-schedule-container .tag-bio {
          background: #e1f5fe;
          color: #0288d1;
          border: 1px solid #b3e5fc;
        }

        .master-schedule-container .tag-tech {
          background: #fff3e0;
          color: #ef6c00;
          border: 1px solid #ffe0b2;
        }

        .master-schedule-container .tag-prep {
          background: #f1f8e9;
          color: #33691e;
          border: 1px solid #dcedc8;
        }

        .master-schedule-container .phase-header {
          background-color: #2c3e50;
          color: white;
          padding: 8px 15px;
          border-radius: 5px;
          font-family: 'Oswald', sans-serif;
          letter-spacing: 1px;
          margin: 20px 0 15px -35px;
          width: fit-content;
          box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.2);
          position: relative;
          z-index: 2;
        }

        .master-schedule-container .print-btn {
          display: block;
          width: 100%;
          padding: 15px;
          background-color: #27ae60;
          color: white;
          border: none;
          border-radius: 5px;
          font-size: 16px;
          font-weight: bold;
          cursor: pointer;
          margin-top: 30px;
          text-transform: uppercase;
        }

        @media print {
          .master-schedule-container {
            background: white;
            padding: 0;
          }

          .master-schedule-container .container {
            box-shadow: none;
            border: none;
            padding: 0;
          }

          .master-schedule-container .print-btn {
            display: none;
          }

          .master-schedule-container .timeline-block {
            page-break-inside: avoid;
          }

          .master-schedule-container .phase-header {
            background-color: #eee !important;
            color: black !important;
            margin-left: 0;
            -webkit-print-color-adjust: exact;
          }

          .master-schedule-container .detail-box {
            border: 1px solid #ccc;
          }
        }
      `}</style>

      <div className="container">
        <h1>Master Schedule: Tối Ưu Hóa Từng Phút</h1>

        <div className="phase-header">
          GIAI ĐOẠN 1: BUỔI SÁNG TỐC ĐỘ (06:00 - 07:00)
        </div>

        <div className="timeline-block">
          <span className="time-label">06:00 - 06:05</span>
          <span className="activity-title">Thức dậy &amp; Hydrat hóa</span>
          <div className="detail-box">
            <div className="detail-row">
              <span className="icon">💧</span>
              <span className="label">Kỹ thuật:</span>
              <span className="content">
                Uống ngay <b>300ml nước lọc</b> từng ngụm nhỏ.
                <span className="tag tag-bio">Thải muối</span>
              </span>
            </div>
            <div className="detail-row">
              <span className="icon">🙆</span>
              <span className="label">Khởi động:</span>
              <span className="content">
                Vươn vai hết cỡ trên giường để kéo giãn xương sống sau đêm dài.
              </span>
            </div>
          </div>
        </div>

        <div className="timeline-block">
          <span className="time-label">06:05 - 06:20</span>
          <span className="activity-title">Vệ sinh &amp; Face Gym (Nhanh gọn)</span>
          <div className="detail-box">
            <div className="detail-row">
              <span className="icon">💆</span>
              <span className="label">Kết hợp:</span>
              <span className="content">
                Massage nâng cơ mặt + Rửa mặt cùng lúc trong 10-15 phút.
              </span>
            </div>
          </div>
        </div>

        <div className="timeline-block">
          <span className="time-label">06:20 - 06:40</span>
          <span className="activity-title">Bữa sáng Tăng trưởng</span>
          <div className="detail-box">
            <div className="detail-row">
              <span className="icon">🍳</span>
              <span className="label">Thực đơn:</span>
              <span className="content">
                2 Trứng luộc/ốp la + <b>Sữa tươi không đường</b>.
              </span>
            </div>
            <div className="detail-row">
              <span className="icon">💊</span>
              <span className="label">Quan trọng:</span>
              <span className="content">
                D3K2 ngay sau ăn (để dầu mỡ hòa tan Vitamin).
              </span>
            </div>
          </div>
        </div>

        <div className="timeline-block">
          <span className="time-label">06:55 - 07:00</span>
          <span className="activity-title">Di chuyển (Siêu tốc)</span>
          <div className="detail-box">
            <div className="detail-row">
              <span className="icon">🛵</span>
              <span className="label">Lưu ý:</span>
              <span className="content">
                Chỉ mất 3 phút đi lại. Tới nơi kiểm tra lại tư thế, thẳng lưng bước vào chỗ làm.
              </span>
            </div>
          </div>
        </div>

        <div className="phase-header" style={{ backgroundColor: '#3498db' }}>
          GIAI ĐOẠN 2: LÀM VIỆC &amp; NGHỈ TRƯA DÀI (07:00 - 13:30)
        </div>

        <div className="timeline-block">
          <span className="time-label">07:00 - 11:15</span>
          <span className="activity-title">Làm việc Ca Sáng</span>
          <div className="detail-box">
            <div className="detail-row">
              <span className="icon">⚡</span>
              <span className="label">Deep Work:</span>
              <span className="content">
                Tập trung làm việc liên tục. Mỗi 45p đứng dậy vươn vai 1 lần.
              </span>
            </div>
            <div className="detail-row">
              <span className="icon">☀️</span>
              <span className="label">Tranh thủ:</span>
              <span className="content">
                Nếu có giải lao, hãy ra đứng chỗ có nắng 5-10p (vì sáng đi làm quá sớm chưa có nắng).
              </span>
            </div>
          </div>
        </div>

        <div className="timeline-block">
          <span className="time-label">11:15 - 11:45</span>
          <span className="activity-title">Ăn trưa (Sớm &amp; Thảnh thơi)</span>
          <div className="detail-box">
            <div className="detail-row">
              <span className="icon">🥗</span>
              <span className="label">Lợi thế:</span>
              <span className="content">
                Ăn giờ này vắng người. Hãy ăn chậm, nhai kỹ (tốt cho mặt V-line).
              </span>
            </div>
            <div className="detail-row">
              <span className="icon">🚫</span>
              <span className="label">Lưu ý:</span>
              <span className="content">Không chan nước kho mặn. Ưu tiên ăn rau trước.</span>
            </div>
          </div>
        </div>

        <div className="timeline-block">
          <span className="time-label">11:45 - 12:30</span>
          <span className="activity-title">Ngủ trưa (Chất lượng cao)</span>
          <div className="detail-box">
            <div className="detail-row">
              <span className="icon">🛌</span>
              <span className="label">Thời điểm:</span>
              <span className="content">
                Ngủ lúc này cực tốt vì đã tiêu hóa sơ thức ăn (tránh béo bụng).
              </span>
            </div>
            <div className="detail-row">
              <span className="icon">💤</span>
              <span className="label">Thời lượng:</span>
              <span className="content">Ngủ 45 phút. Kê gối cổ chữ U, không gục đầu lên tay.</span>
            </div>
          </div>
        </div>

        <div className="timeline-block">
          <span className="time-label">12:30 - 13:30</span>
          <span className="activity-title">Thư giãn / Tự học / Hydrat hóa</span>
          <div className="detail-box">
            <div className="detail-row">
              <span className="icon">📚</span>
              <span className="label">Bonus Time:</span>
              <span className="content">
                Bạn có 1 tiếng rảnh rỗi quý giá! Hãy đọc sách, nghe nhạc hoặc xem video kiến thức.
              </span>
            </div>
            <div className="detail-row">
              <span className="icon">💧</span>
              <span className="label">Nước:</span>
              <span className="content">Uống thêm 1 cốc nước lớn sau khi ngủ dậy để tỉnh táo.</span>
            </div>
          </div>
        </div>

        <div className="phase-header" style={{ backgroundColor: '#e74c3c' }}>
          GIAI ĐOẠN 3: TỐI ƯU HÓA THỂ CHẤT (13:30 - 22:00)
        </div>

        <div className="timeline-block">
          <span className="time-label">13:30 - 18:00</span>
          <span className="activity-title">Làm việc Ca Chiều</span>
          <div className="detail-box">
            <div className="detail-row">
              <span className="icon">👅</span>
              <span className="label">Mewing:</span>
              <span className="content">
                Nhớ kiểm tra lưỡi: Đặt toàn bộ lưỡi lên vòm miệng trong giờ làm.
              </span>
            </div>
          </div>
        </div>

        <div className="timeline-block">
          <span className="time-label">18:00 - 18:05</span>
          <span className="activity-title">Về nhà (3 phút)</span>
          <div className="detail-box">
            <div className="detail-row">
              <span className="icon">🏠</span>
              <span className="label">Tốc độ:</span>
              <span className="content">Về nhà ngay. Thay đồ tập luôn không chần chừ.</span>
            </div>
          </div>
        </div>

        <div className="timeline-block">
          <span className="time-label">18:30 - 19:15</span>
          <span className="activity-title">Tập luyện cường độ cao (HIIT)</span>
          <div className="detail-box">
            <div className="detail-row">
              <span className="icon">🔥</span>
              <span className="label">Bài tập:</span>
              <span className="content">
                <b>Nhảy dây:</b> 500 cái (tốc độ cao). Kích thích xương phát triển.
              </span>
            </div>
            <div className="detail-row">
              <span className="icon">🐒</span>
              <span className="label">Kết thúc:</span>
              <span className="content">
                <b>Đu xà đơn:</b> 3 hiệp x 30s. Giãn cột sống tối đa.
              </span>
            </div>
          </div>
        </div>

        <div className="timeline-block">
          <span className="time-label">19:15 - 19:45</span>
          <span className="activity-title">Tắm &amp; Phục hồi</span>
          <div className="detail-box">
            <div className="detail-row">
              <span className="icon">🚿</span>
              <span className="label">Kỹ thuật:</span>
              <span className="content">Tắm nước ấm để cơ bắp thả lỏng.</span>
            </div>
          </div>
        </div>

        <div className="timeline-block">
          <span className="time-label">19:45 - 20:15</span>
          <span className="activity-title">Ăn tối (Ăn Nhạt - No Salt)</span>
          <div className="detail-box">
            <div className="detail-row">
              <span className="icon">🥦</span>
              <span className="label">Thực đơn:</span>
              <span className="content">Natto / Phô mai cứng + Rau luộc + Thịt nạc.</span>
            </div>
            <div className="detail-row">
              <span className="icon">⛔</span>
              <span className="label">Tuyệt đối:</span>
              <span className="content">
                <b>KHÔNG ĂN MẶN</b>. Ăn nhạt để sáng mai mặt không sưng.
              </span>
            </div>
          </div>
        </div>

        <div className="timeline-block">
          <span className="time-label">21:30 - 21:45</span>
          <span className="activity-title">Chuẩn bị ngủ</span>
          <div className="detail-box">
            <div className="detail-row">
              <span className="icon">💆</span>
              <span className="label">Face Gym:</span>
              <span className="content">Massage nhẹ 2 bên quai hàm.</span>
            </div>
            <div className="detail-row">
              <span className="icon">🥛</span>
              <span className="label">Dinh dưỡng:</span>
              <span className="content">
                Hâm <b>Sữa không đường</b> (45 độ). Uống ấm giúp ngủ ngon.
              </span>
            </div>
          </div>
        </div>

        <div className="timeline-block">
          <span className="time-label">22:00</span>
          <span className="activity-title">Ngủ sâu (Deep Sleep)</span>
          <div className="detail-box">
            <div className="detail-row">
              <span className="icon">🌑</span>
              <span className="label">Phòng ngủ:</span>
              <span className="content">Tắt đèn tối om. Nằm ngửa thẳng chân tay.</span>
            </div>
          </div>
        </div>

        <button
          className="print-btn"
          type="button"
          onClick={() => window.print()}
        >
          🖨️ In Master Schedule
        </button>
      </div>
    </div>
  );
}

