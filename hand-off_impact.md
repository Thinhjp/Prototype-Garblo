# IMPLEMENTATION TASK — GARBLO SCREEN 02
## Impact & Selected Outfit

### 1. Mục tiêu

Triển khai hoặc hoàn thiện màn hình kết quả của Garblo sau khi người dùng hoàn tất bước Context Collection.

Màn hình này có hai nhiệm vụ chính:

1. Truyền tải tác động tích cực của việc tận dụng tủ đồ hiện có.
2. Hiển thị outfit đã chọn cho sự kiện Hackathon Pitching Day.

Sử dụng ảnh tham khảo màn hình kết quả đã cung cấp làm chuẩn thiết kế. Đây phải là giao diện React thực sự, có thể cuộn và tương tác, không phải ảnh screenshot tĩnh.

### 2. Quy tắc triển khai

- Toàn bộ nội dung UI bằng tiếng Việt.
- Chỉnh sửa trực tiếp `src/App.tsx` và `src/index.css`.
- Giữ kiến trúc hiện tại: toàn bộ app nằm trong `src/App.tsx`.
- Giữ React 19, Vite 8 và CSS class thông thường.
- Tái sử dụng cơ chế điều hướng, state, dữ liệu outfit và tài nguyên ảnh hiện có.
- Không tạo ứng dụng mới hoặc cấu trúc component riêng.
- Không sửa `.figma/make/`, `vite.config.ts`, `index.html` hoặc dependencies nếu không cần thiết.
- Không khởi động lại dev server.
- Bảo toàn màn hình Context Collection, Gu Match và các luồng hiện có.

### 3. Luồng màn hình

Sau khi người dùng nhấn “Xem 3 outfit gợi ý” trên Màn hình 1, tiếp tục luồng hiện tại để hiển thị màn hình kết quả.

Nếu dự án đã có màn hình kết quả tương ứng, hãy chỉnh sửa màn hình đó thay vì tạo một màn hình trùng lặp.

Nút quay lại ở header phải quay về đúng màn hình trước đó theo cơ chế điều hướng hiện có.

### 4. Header và lời chào

Tạo header theo ảnh tham khảo:

- Thanh trạng thái điện thoại.
- Nút quay lại ở bên trái.
- Logo Garblo ở chính giữa.
- Nút chia sẻ ở bên phải.

Bên dưới header, hiển thị tiêu đề lớn:

**Cảm ơn Tim! 🌱**

Mô tả:

“Bạn đã chọn outfit phù hợp từ tủ đồ hiện có.”

Dòng tiếp theo:

“Mỗi lần mặc thông minh hơn là một bước tiến vì hành tinh xanh hơn.”

Sử dụng chữ xanh lá đậm cho tiêu đề, typography rõ ràng và khoảng trắng thoáng.

Ở vùng nền phía sau, sử dụng hình minh họa thiên nhiên, Trái Đất hoặc rừng xanh nếu dự án đã có tài nguyên phù hợp. Nếu chưa có, dùng hình ảnh có sẵn hoặc CSS nền nhẹ; không thêm phụ thuộc mới chỉ để tạo hình trang trí.

### 5. Impact Dashboard

Tạo một thẻ lớn nền trắng ngà, bo góc lớn, chứa tiêu đề:

**TÁC ĐỘNG TỪ GARBLO CỦA BẠN**

Có icon thông tin ở góc phải. Nếu phù hợp với kiến trúc hiện tại, khi nhấn icon sẽ hiển thị giải thích ngắn về cách tính các chỉ số.

Bên trong thẻ, hiển thị ba ô chỉ số trên cùng một hàng khi chiều rộng cho phép.

#### Chỉ số 1 — Hiệu quả sử dụng tủ đồ

Icon: cúp màu xanh lá.

Giá trị:

**Top 8%**

Mô tả:

“người dùng tận dụng tủ đồ hiệu quả”

#### Chỉ số 2 — CO₂e tránh phát thải

Icon: đám mây có chữ CO₂.

Giá trị:

**6 kg**

Mô tả:

“CO₂e tránh phát thải ước tính”

#### Chỉ số 3 — Tác động tương đương

Icon: cây xanh.

Giá trị:

**3 tháng**

Mô tả:

“hấp thụ CO₂ của một cây trưởng thành”

Yêu cầu hiển thị:

- Ba ô có chiều cao tương đương.
- Nền xanh lá rất nhạt.
- Giá trị chính có cỡ chữ lớn, đậm.
- Mô tả căn giữa, xuống dòng tự nhiên.
- Icon đặt phía trên giá trị.
- Không để chữ hoặc số tràn khỏi ô trên điện thoại nhỏ.

Các số liệu trên là dữ liệu demo đã được cung cấp. Không tự khẳng định đây là số liệu đo lường thực tế hoặc đã được xác minh khoa học.

### 6. Environmental Storytelling

Bên dưới Impact Dashboard, tạo một vùng minh họa thiên nhiên với thông điệp:

**Mặc thông minh hơn  
vì một hành tinh xanh hơn. 🌱**

Phong cách:

- Ảnh rừng, núi hoặc cây xanh.
- Ánh sáng tự nhiên, tông xanh lá và vàng ấm.
- Chữ nghiêng mang tính truyền cảm hứng.
- Không che khuất nội dung hoặc làm giảm độ tương phản.

Trên màn hình nhỏ, vùng này có thể thấp hơn ảnh tham khảo để người dùng dễ dàng tiếp cận phần outfit bên dưới.

### 7. Selected Outfit Card

Tạo thẻ trắng lớn với tiêu đề:

**Outfit đã chọn**

Ở bên phải hoặc phía dưới tiêu đề, hiển thị:

“Hôm nay · Hackathon Pitching Day”

Thông tin outfit:

- Nhãn: `OUTFIT 03`
- Tên: `CONFIDENT & ELEGANT`
- Icon ngôi sao màu vàng để đánh dấu outfit được chọn.

#### Ảnh outfit

Sử dụng ảnh outfit thực tế nếu đã có trong dự án. Ưu tiên tài nguyên tương ứng với Outfit 03 từ dữ liệu `outfitPhotos` hoặc dữ liệu outfit hiện tại.

Không tự tạo URL ảnh sai định dạng. Kiểm tra cách map ID ảnh sang URL Unsplash đang được sử dụng trong dự án trước khi thay đổi.

Nếu chưa có ảnh phù hợp, sử dụng placeholder có thiết kế đẹp và dễ thay thế sau này.

#### Danh sách trang phục

Hiển thị năm dòng, mỗi dòng có icon hoặc hình minh họa trang phục ở bên trái và tên ở bên phải:

1. Áo sơ mi trắng
2. Blazer đen
3. Quần tây đen
4. Giày da đen
5. Cà vạt đen sọc chéo xám

Đây là outfit cuối cùng đã chọn. Không đổi màu blazer, quần hoặc cà vạt sang phiên bản outfit cũ.

Bố cục desktop có thể đặt ảnh bên trái và danh sách trang phục bên phải. Trên điện thoại, tối ưu kích thước để ảnh và nội dung vẫn dễ đọc trong khung 390 px.

### 8. Hai nút hành động

Đặt hai nút ở cuối thẻ outfit.

#### Nút 1 — Xem lại outfit

Nhãn:

**Xem lại outfit**

Icon: móc treo quần áo.

Hành vi:

- Quay lại luồng chọn hoặc xem outfit hiện có.
- Tái sử dụng màn hình và state hiện tại.
- Không tạo trang lựa chọn giả nếu app đã có chức năng tương ứng.

#### Nút 2 — Lưu vào lịch

Nhãn:

**Lưu vào lịch**

Icon: lịch.

Hành vi:

- Nếu đã có chức năng lưu lịch, hãy sử dụng lại.
- Nếu chưa có, triển khai trạng thái demo phù hợp, ví dụ hiển thị thông báo “Đã lưu outfit vào lịch của bạn”.
- Không tuyên bố đã lưu vào Google Calendar hoặc lịch thiết bị nếu chưa tích hợp thực tế.
- Tránh lưu trùng lặp khi người dùng nhấn nhiều lần.

Nút chính có nền xanh lá đậm, chữ trắng và icon rõ ràng. Nút phụ có nền xanh lá nhạt, viền nhẹ và chữ xanh đậm.

### 9. Design System

Sử dụng các token gần với giao diện tham khảo:

- Xanh lá đậm: `#123D32`
- Xanh lá chính: `#1C6048`
- Nền ứng dụng: `#F8F7F3`
- Nền thẻ: `#FFFFFF`
- Nền ô chỉ số: `#F0F7EA`
- Chữ chính: `#18352F`
- Chữ phụ: `#657572`
- Viền: `#E8EAE2`
- Vàng nhấn: `#F4BE32`

Phong cách tổng thể:

- Tối giản, cao cấp, thân thiện với môi trường.
- Bo góc lớn, đường viền mảnh, bóng nhẹ.
- Tiêu đề có độ tương phản cao.
- Không lạm dụng hiệu ứng chuyển màu hoặc animation.
- Giữ khoảng cách đồng nhất giữa các khu vực.
- Tôn trọng màu sắc và phong cách của Màn hình 1 để hai màn hình tạo thành một trải nghiệm thống nhất.

### 10. Responsive và Accessibility

- Giữ khung `.app-frame` hiện tại.
- Không thay đổi kiến trúc khung điện thoại.
- Cho phép cuộn dọc tự nhiên.
- Không có cuộn ngang ngoài ý muốn ở chiều rộng 320–390 px.
- Ba ô Impact Dashboard phải co giãn hoặc chuyển bố cục phù hợp khi màn hình quá hẹp.
- Các nút có vùng chạm phù hợp.
- Icon trang trí cần được đánh dấu đúng; nút tương tác cần có nhãn dễ hiểu.
- Đảm bảo chữ tiếng Việt hiển thị đúng dấu và không bị cắt.

### 11. Data và State

Tái sử dụng dữ liệu outfit và state hiện có trong `src/App.tsx`.

Nếu cần, tạo một đối tượng dữ liệu có cấu trúc cho:

- Thông tin outfit đã chọn.
- Danh sách năm món trang phục.
- Các chỉ số tác động.
- Trạng thái lưu lịch.

Không sao chép toàn bộ dữ liệu tủ đồ hoặc tạo một state song song nếu dự án đã có nguồn dữ liệu tương ứng.

Không cần thêm API, backend hoặc thư viện mới cho nhiệm vụ này.

### 12. Acceptance Criteria

Hoàn thành khi:

1. Màn hình có đủ lời chào, Impact Dashboard, vùng thông điệp xanh và Selected Outfit Card.
2. Ba chỉ số hiển thị đúng: Top 8%, 6 kg và 3 tháng.
3. Outfit 03 hiển thị đúng năm món trang phục, bao gồm cà vạt đen sọc chéo xám.
4. Ảnh outfit sử dụng đúng dữ liệu hoặc tài nguyên hiện có.
5. Hai nút hành động hoạt động theo khả năng hiện tại của prototype.
6. Luồng từ Context Collection sang màn hình kết quả không bị hỏng.
7. Các màn hình và chức năng hiện có khác vẫn hoạt động.
8. Không có lỗi console mới, ảnh hỏng hoặc lỗi bố cục rõ ràng.
9. Chạy `pnpm build` thành công.

### 13. Execution Instructions

Hãy thực hiện trực tiếp trong repository đang mở:

1. Kiểm tra `src/App.tsx` và `src/index.css`.
2. Xác định màn hình kết quả và cơ chế điều hướng hiện tại.
3. Triển khai hoặc chỉnh sửa màn hình theo đặc tả trên.
4. Kiểm tra preview sau hot reload.
5. Điều chỉnh bố cục ở kích thước điện thoại.
6. Chạy `pnpm build`.
7. Báo cáo file đã sửa, chức năng đã hoàn thành và các giới hạn còn lại.

**Deliverable:** Một màn hình Impact & Selected Outfit hoàn chỉnh, tích hợp trực tiếp vào Garblo prototype hiện có, sẵn sàng trình diễn và review.