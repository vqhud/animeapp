import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

// 1. Khai báo lại cái khuôn đúc y hệt bên server
const newsSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    tag: { type: String, default: 'Tin Tức' },
    time: { type: String, default: 'Vừa xong' },
    views: { type: String, default: '0 lượt xem' },
    img: { type: String, default: '' }
  },
  { timestamps: true }
);

const News = mongoose.model('News', newsSchema);

// 2. Chẩn bị các bài báo nóng hổi
const sampleNews = [
  {
    title: 'Mùa 2 của bộ anime chuyển sinh đình đám chính thức ấn định ngày ra mắt!',
    content: 'Sau bao ngày mòn mỏi chờ đợi, cuối cùng studio sản xuất cũng đã tung ra trailer chính thức cho mùa 2. Đoạn video nhá hàng dài 2 phút đã phô diễn những pha hành động mãn nhãn.\n\nNgười hâm mộ đang đếm ngược từng ngày để được gặp lại dàn nhân vật yêu thích. Dự kiến phim sẽ lên sóng vào đầu tháng tới và có mặt trên các nền tảng trực tuyến lớn.',
    tag: 'Tin Anime',
    time: '1 giờ trước',
    views: '54K lượt xem',
    img: '/assets/anime-04.jpg'
  },
  {
    title: 'Đạo diễn huyền thoại tái xuất với siêu phẩm điện ảnh viễn tưởng kinh phí khủng',
    content: 'Giới mộ điệu điện ảnh đang đứng ngồi không yên trước thông tin vị đạo diễn từng đạt giải Oscar sẽ quay lại ghế nóng. Lần này ông mang đến một thế giới tương lai đầy bí ẩn và u ám.\n\nKỹ xảo hình ảnh được đánh giá là vượt thời đại, hứa hẹn một trải nghiệm thị giác chưa từng có. Phim đang trong giai đoạn hậu kỳ và sẽ ra rạp vào đúng dịp Giáng Sinh năm nay.',
    tag: 'Tin Phim',
    time: '4 giờ trước',
    views: '112K lượt xem',
    img: '/assets/anime-06.jpg'
  },
  {
    title: 'Đội tuyển quốc gia làm nên lịch sử với chiến thắng nghẹt thở ở phút bù giờ!',
    content: 'Cả sân vận động dường như vỡ òa khi tiền đạo mang áo số 10 ghi bàn thắng vàng ở giây cuối cùng. Trận đấu diễn ra vô cùng kịch tính với màn rượt đuổi tỷ số ngoạn mục nghẹt thở.\n\nĐây là lần đầu tiên trong lịch sử, đội tuyển của chúng ta xuất sắc lọt vào vòng bán kết của giải đấu danh giá này. Hàng triệu người hâm mộ đã đổ ra đường để ăn mừng chiến thắng vang dội.',
    tag: 'Thể Thao',
    time: 'Hôm qua',
    views: '450K lượt xem',
    img: '/assets/anime-09.jpg'
  },
  {
    title: 'Khám phá hòn đảo hoang sơ được mệnh danh là thiên đường bị lãng quên',
    content: 'Nằm ẩn mình giữa đại dương bao la, hòn đảo này vẫn giữ được vẻ đẹp nguyên sơ với những bãi cát trắng mịn và nước biển trong vắt. Rất ít du khách biết đến tọa độ bí mật tuyệt đẹp này.\n\nĐến đây, bạn sẽ được trải nghiệm cuộc sống chậm rãi, tách biệt hoàn toàn với sự ồn ào và khói bụi của phố thị. Một chuyến đi chữa lành lý tưởng cho những ai đang tìm kiếm sự bình yên.',
    tag: 'Du Lịch',
    time: '2 ngày trước',
    views: '32K lượt xem',
    img: '/assets/anime-11.jpg'
  },
  {
    title: 'Chuyên gia dinh dưỡng tiết lộ 5 siêu thực phẩm giúp bạn tăng cường hệ miễn dịch',
    content: 'Trong thời điểm giao mùa ẩm ương, việc chủ động bảo vệ sức khỏe là ưu tiên hàng đầu của mọi gia đình. Các bác sĩ khuyên chúng ta nên bổ sung ngay những thực phẩm giàu vitamin C và chất chống oxy hóa.\n\nKhông cần tìm kiếm đâu xa xôi, những nguyên liệu thần kỳ này có mặt ngay trong căn bếp nhà bạn. Cùng điểm qua danh sách chi tiết và lên thực đơn ăn uống khoa học ngay từ hôm nay nhé!',
    tag: 'Sức Khỏe',
    time: '3 ngày trước',
    views: '88K lượt xem',
    img: '/assets/anime-03.jpg'
  },
  {
    title: 'Phát hiện chấn động: Các nhà khoa học tìm thấy dấu vết sự sống trên hành tinh mới',
    content: 'Kính viễn vọng không gian thế hệ mới vừa gửi về những dữ liệu làm thay đổi hoàn toàn nhận thức của nhân loại. Dấu vết của nước và các hợp chất hữu cơ đã được xác nhận vô cùng rõ ràng.\n\nHành tinh này nằm trong vùng có thể sống được, cách Trái Đất của chúng ta khoảng 40 năm ánh sáng. Cộng đồng thiên văn học quốc tế đang dốc toàn lực để nghiên cứu sâu hơn về phát hiện lịch sử này.',
    tag: 'Thế Giới',
    time: '1 tuần trước',
    views: '520K lượt xem',
    img: '/assets/anime-07.jpg'
  }
];
// 3. Mở ống nước và bơm dữ liệu vào kho
const runSeed = async () => {
  try {
    const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/hhtq_anime';
    await mongoose.connect(MONGODB_URI);
    console.log('🔌 Đã kết nối với MongoDB...');

    await News.deleteMany({});
    console.log('🧹 Đã quét sạch các bài báo cũ.');

    await News.insertMany(sampleNews);
    console.log(`✅ Bơm thành công ${sampleNews.length} bài báo mới!`);

    process.exit(0); // Tự động ngắt kết nối và tắt script
  } catch (error) {
    console.error('❌ Lỗi mất tiêu rồi:', error.message);
    process.exit(1);
  }
};

runSeed();