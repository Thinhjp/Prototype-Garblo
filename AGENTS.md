# Garblo Lookbook App Prototype

Nguyên mẫu (prototype) ứng dụng AI thời trang "garblo" — giao diện tiếng Việt — chạy trong Figma Make trên nền React 19 + Vite 8 + Tailwind CSS v4.

> **Quy tắc ngôn ngữ:** Luôn trả lời bằng tiếng Việt khi làm việc trong repo này. Toàn bộ text UI cũng bằng tiếng Việt — giữ nguyên ngôn ngữ khi thêm/sửa nội dung.

## Dev server

- Vite dev server **đã chạy sẵn** ở cổng `$PORT` (mặc định 8443) — không tự khởi động. Thay đổi file được hot-reload ngay; xem kết quả qua preview panel của Figma Make.

## Lệnh

- `pnpm install` — cài dependencies (pnpm là package manager chuẩn; node 22 + pnpm 10.34.3 theo `.mise.toml`)
- `pnpm dev` — chạy dev server
- `pnpm build` — build production
- `pnpm format` — format bằng oxfmt
- Không có script lint/test/typecheck. `pnpm build` chỉ chạy `vite build` (không chạy `tsc`), nên lỗi type không làm hỏng build.
- Alias `@` → `src/` (cấu hình trong `vite.config.ts` và `tsconfig.json`).

## Kiến trúc

- Toàn bộ app nằm trong **một file duy nhất**: `src/App.tsx` (~430 dòng) — mọi màn hình, component, icon SVG và dữ liệu mock đều ở đây, không có thư mục `components/`. Muốn sửa giao diện, bắt đầu từ file này.
- Mọi styling là **CSS class thường trong `src/index.css`** (98 dòng), không dùng utility class của Tailwind dù Tailwind v4 đã được import. Thêm style = thêm class vào `index.css`.
- App là khung điện thoại cố định: `.app-frame` rộng `min(390px, 100vw)`, cao `min(844px, 100vh)`.
- Dữ liệu đều mock/hardcode: mảng `wardrobe`, map `outfitPhotos` (ID ảnh Unsplash ghép thành URL `https://images.unsplash.com/<id>?...`), luồng AI giả bằng `setTimeout` (vd `finishCapture` chờ 1500ms).
- Màn hình quẹt "Gu Match" dùng pointer events (`MatchCards`), vòng qua 8 look (`(look + 1) % 8`).

## Hạ tầng Figma Make (đừng đụng vào)

- `.figma/make/` là cấu hình nền tảng — không sửa. `dev.json` giải thích khi nào dev server tự restart (chỉ khi `package.json` / `pnpm-lock.yaml` đổi).
- `vite.config.ts` chứa các plugin Figma Make (site config, error overlay replay, refresh boundary fallback, make kit) — coi là hạ tầng, đừng gỡ.
- `index.html` dùng các slot comment `<!-- figma:... -->` do plugin site config điền nội dung.
- File `*.stories.{ts,tsx}` (nếu có) được plugin make kit tự phát hiện để hiển thị trong design surface.

