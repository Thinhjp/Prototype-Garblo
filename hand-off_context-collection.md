# IMPLEMENTATION TASK — GARBLO CONTEXT COLLECTION SCREEN

## 1. Mục tiêu

Triển khai và hoàn thiện **Màn hình 1 — Context Collection** của Garblo dựa trên ảnh tham khảo đã cung cấp.

Đây là một ứng dụng AI thời trang với giao diện tiếng Việt. Màn hình cho biết Garblo đã thu thập và phân tích ngữ cảnh của người dùng trước khi gợi ý 3 outfit phù hợp.

## 2. Quy tắc bắt buộc

- Luôn sử dụng tiếng Việt cho mọi nội dung UI mới hoặc được chỉnh sửa.
- Đọc và hiểu code hiện tại trước khi thay đổi.
- Chỉnh trực tiếp `src/App.tsx` và `src/index.css`.
- Giữ kiến trúc một file `App.tsx` cho toàn bộ app, không tự ý tạo thư mục component mới.
- Giữ nguyên React 19, Vite 8, Tailwind CSS v4 và các dependencies hiện có.
- Styling phải sử dụng CSS class thông thường trong `src/index.css`, theo quy ước hiện tại.
- Không thay đổi `.figma/make/`, `vite.config.ts`, `index.html`, `package.json` hoặc `pnpm-lock.yaml` nếu không thực sự cần thiết.
- Không khởi động lại dev server. Server đang chạy và hỗ trợ hot reload.
- Không thay thế giao diện bằng một ảnh screenshot tĩnh.
- Không xóa hoặc làm hỏng các màn hình, dữ liệu tủ đồ, luồng Gu Match hay các chức năng hiện có.

## 3. Xác định luồng hiện tại

Trước khi sửa code:

1. Đọc `src/App.tsx` để xác định cách quản lý màn hình, state và điều hướng.
2. Tìm màn hình Context Collection hiện có, nếu đã được triển khai.
3. Xác định hàm `finishCapture` và luồng chuyển tiếp sang màn hình gợi ý outfit.
4. Tái sử dụng state, component và dữ liệu hiện có khi phù hợp.

Ưu tiên sửa màn hình hiện có thay vì tạo một luồng điều hướng song song.

## 4. Nội dung giao diện

### Header

- Thanh trạng thái mô phỏng điện thoại: 07:30, sóng di động, Wi-Fi và pin 100%.
- Nút quay lại bên trái.
- Logo Garblo ở chính giữa.
- Icon lấp lánh bên phải.

### AI status message

Hiển thị icon trợ lý AI cùng bong bóng hội thoại:

“Mình đang thu thập thông tin để gợi ý outfit phù hợp nhất cho bạn...”

### Context summary

Tiêu đề:

“Đã phân tích ngữ cảnh của bạn”

Mô tả:

“Dựa trên lịch trình, thời tiết, vị trí và thói quen di chuyển”

Hiển thị 5 thẻ thông tin theo đúng thứ tự:

**1. Sự kiện hôm nay**
- Hackathon Pitching Day
- 09:00 – 18:00
- Tokyo, Nhật Bản

**2. Thời tiết**
- 16 – 19°C
- Nhiều mây, có lúc hửng nắng
- 10:00: nhiều mây, 17°
- 13:00: mưa, xác suất 80%
- 16:00: có mây, 16°

**3. Khả năng mưa**
- 80%
- vào khoảng 13:00

**4. Di chuyển**
- Đi bộ kết hợp tàu điện
- Dự kiến di chuyển giữa các ga và đi bộ đến địa điểm sự kiện

**5. Phong cách ưu tiên**
- Formal, thanh lịch, thoải mái
- Phù hợp cho pitching và networking

Sử dụng icon phù hợp và màu nền pastel nhẹ cho từng thẻ: đỏ nhạt, xanh dương nhạt, tím nhạt, xanh lá nhạt và be.

### AI readiness card

Tiêu đề:

“Đã sẵn sàng gợi ý outfit!”

Mô tả:

“Dựa trên các thông tin trên và tủ đồ hiện có của bạn, mình đã chuẩn bị 3 outfit phù hợp nhất.”

Nút chính:

“Xem 3 outfit gợi ý →”

## 5. Yêu cầu thiết kế

Bám sát ảnh tham khảo đã cung cấp:

- Phong cách tối giản, cao cấp, thân thiện với môi trường.
- Nền trắng ngà, thẻ trắng, viền nhẹ và bo góc lớn.
- Màu xanh lá đậm làm màu nhận diện.
- Typography dễ đọc, phân cấp rõ ràng.
- Icon đồng nhất về kích thước và phong cách.
- Bố cục mobile-first, không tràn ngang.
- Nội dung dài phải tự xuống dòng.
- Có thể cuộn dọc khi chiều cao màn hình không đủ.
- Giữ các thẻ thời tiết gọn gàng, không làm vỡ bố cục ở chiều rộng 320–390 px.

Tiếp tục sử dụng khung điện thoại hiện tại:

`.app-frame`

Không thay đổi kích thước hoặc kiến trúc khung ứng dụng nếu không cần thiết.

## 6. Tương tác

- Nút quay lại sử dụng cơ chế điều hướng hiện có.
- Nút “Xem 3 outfit gợi ý” phải gọi đúng luồng chuyển sang màn hình kết quả outfit hiện tại.
- Không tạo màn hình kết quả mới nếu app đã có.
- Nếu `finishCapture` đang được sử dụng trong luồng này, kiểm tra và tái sử dụng hợp lý; không thêm `setTimeout` trùng lặp.
- Các thẻ thông tin chỉ cần tương tác nếu phù hợp với kiến trúc hiện có. Không tạo thêm trang giả.
- Các dữ liệu thời tiết, lịch trình và xác suất mưa vẫn là mock data; không giả vờ đã kết nối API thực tế.

## 7. Tiêu chí nghiệm thu

Sau khi hoàn thành:

1. Màn hình Context Collection có đầy đủ 5 thẻ thông tin và nội dung chính xác.
2. Giao diện gần với ảnh tham khảo về màu sắc, bố cục, khoảng cách và kích thước.
3. CTA hoạt động đúng và dẫn tới luồng gợi ý outfit hiện có.
4. Các màn hình và chức năng khác vẫn hoạt động như trước.
5. Không có lỗi console mới, ảnh hỏng hoặc cuộn ngang ngoài ý muốn.
6. Giao diện thích ứng với chiều rộng 320, 360 và 390 px.
7. Chạy `pnpm build` để kiểm tra build production.
8. Không khởi động lại dev server hoặc thay đổi cấu hình nền tảng Figma Make.

## 8. Cách thực hiện

Hãy trực tiếp đọc, sửa và kiểm tra code trong repository.

Không chỉ đưa ra hướng dẫn hoặc ví dụ code trong câu trả lời. Hãy thực hiện các thay đổi thực tế, kiểm tra preview sau khi hot reload và sửa tiếp những lỗi hiển thị có thể xác định.

Khi hoàn thành, báo cáo ngắn gọn:
- Những file đã sửa.
- Những thay đổi chính.
- Kết quả `pnpm build`.
- Những điểm còn chưa hoàn thiện.

**Ưu tiên cao nhất:** bảo toàn ứng dụng hiện tại, hoàn thiện màn hình Context Collection và đảm bảo luồng chuyển sang màn hình outfit vẫn hoạt động.