# HAND-OFF — GARBLO FE HAPPY PATH (20/80)

## 1. Nhiệm vụ

Đọc **`Báo-cáo-điều-tra-AS-IS-UX-(FE-only).txt`** làm source of truth duy nhất. Điều tra code hiện tại và trực tiếp sửa FE để hoàn thiện Happy Path.

**Nguyên tắc:** Tận dụng UI hiện có, sửa tối thiểu, ưu tiên dữ liệu xuyên màn hình. Không redesign hoặc mở rộng scope.

## 2. Happy Path cần giữ

`Upload → Capture → AI Review → Wardrobe → Context → Outfit Cards → Result`

| Screen | Yêu cầu |
|---|---|
| `SCR-ADD` + `SHEET-CAPTURE` | Upload ảnh thật, giữ ảnh đã chọn |
| `SCR-ITEM-AI` | Review/chỉnh thông tin component trước khi lưu |
| `SCR-WARDROBE` | Hiển thị đúng các món đã lưu |
| `SCR-MATCH-CONTEXT` | Context nhất quán giữa các màn hình |
| `SCR-MATCH-CARDS` | Hiển thị 3 outfit, lưu Like/Dislike |
| `SCR-MATCH-RESULT` | Hiển thị đúng outfit đã chọn |

**Ngoài scope:** TryOn, EditLook, Impact Dashboard, Community, Notifications, Settings, Sharing.

## 3. Sáu vấn đề ưu tiên sửa

1. **G01:** Upload đang tạo ID mock → chọn và truyền ảnh thật.
2. **G02:** Capture bỏ qua review → nối `Capture → ItemDetail → Wardrobe`, lưu component đã xác nhận.
3. **G03:** Wardrobe hardcode 12/15 món, filter không hoạt động → render theo dữ liệu và filter thực.
4. **G04:** Context tĩnh, Cards bắt đầu 3/8 → truyền context nhất quán, hiển thị từ 1/3.
5. **G05:** Like/Dislike không giữ lựa chọn → lưu selected outfit xuyên màn hình.
6. **G05/G06:** Result luôn outfit 03, các action lưu chỉ hiện toast → hiển thị lựa chọn thật, không báo thành công giả.

## 4. Quy tắc triển khai

- Inspect source trước khi sửa.
- Giữ identity và state xuyên suốt Happy Path.
- Không tự giả định backend/API. Nếu chưa có integration, sử dụng fixture được đánh dấu rõ là demo.
- Không xóa source ngoài scope; chỉ ẩn hoặc vô hiệu hóa entry point khi cần.
- Bổ sung loading/error/empty cơ bản cho luồng chính.
- Không commit/push.

## 5. Definition of Done

- Chạy xuyên suốt Happy Path không bị đứt navigation hoặc mất dữ liệu.
- Upload, component, wardrobe và selected outfit liên kết đúng.
- Result không hardcode outfit 03.
- Không có false-success ở các action P0.
- Build/test thành công hoặc báo rõ blocker.

**Deliverables:** Code FE đã sửa, danh sách file thay đổi, kết quả kiểm thử và các phần còn mock/chờ backend.

**Thực hiện sửa code, không chỉ lập kế hoạch.**
