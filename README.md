# App nhập chỉ số sức khỏe — lưu online bằng Netlify Blobs

## Cấu trúc project
```
public/index.html          -> giao diện app
netlify/functions/entries.js -> function xử lý lưu/đọc/xóa dữ liệu (Netlify Blobs)
netlify.toml                -> cấu hình build cho Netlify
package.json                 -> khai báo thư viện @netlify/blobs
```

Vì cần chạy Function (code server) nên **không thể chỉ kéo-thả 1 file HTML** như trước — Netlify cần build project này để cài thư viện và bật Function. Có 2 cách deploy dễ nhất:

## Cách 1 — Qua GitHub (khuyên dùng, tự động cập nhật sau này)
1. Đưa toàn bộ thư mục này lên một repo GitHub mới.
2. Vào https://app.netlify.com → **Add new site → Import an existing project** → chọn repo vừa tạo.
3. Build settings Netlify sẽ tự nhận từ `netlify.toml` (publish = `public`, functions = `netlify/functions`) — không cần sửa gì thêm.
4. Bấm **Deploy**. Sau khi build xong, mở link `xxxx.netlify.app` là dùng được ngay, dữ liệu lưu chung cho mọi người truy cập.

## Cách 2 — Qua Netlify CLI (không cần GitHub)
```bash
npm install -g netlify-cli
cd netlify-project
npm install
netlify login
netlify deploy --prod
```
Khi được hỏi publish directory, chọn `public`. CLI sẽ tự đóng gói function cùng thư viện `@netlify/blobs`.

## Lưu ý
- Netlify Blobs là kho lưu trữ gắn theo từng site — không cần tạo database riêng, không tốn thêm chi phí ở gói miễn phí cho lượng dữ liệu nhỏ như form này.
- Vì dữ liệu dùng chung (shared) cho mọi người mở trang, **ai cũng xem và xóa được** toàn bộ danh sách — không có đăng nhập/phân quyền. Nếu cần giới hạn người dùng, cần thêm xác thực (ngoài phạm vi bản này).
- Nút "Xuất Excel" vẫn hoạt động như cũ, xuất toàn bộ dữ liệu đang có trên server ra file `.xlsx`.
