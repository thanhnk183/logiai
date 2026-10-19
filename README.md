# LogiAI Workspace — Frontend

React 18 + TypeScript + Vite. Dựng theo bản thiết kế "Logi Workspace – Trang chủ".

## Chạy

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # type-check + build ra dist/
```

## Cấu trúc

```
src/
  App.tsx                    Ghép route của tất cả module vào AppLayout
  types.ts                   Kiểu dùng chung (Tone, Module, StatItem) + AppModule/MenuItem
  utils/format.ts            Định dạng số tiền (tỷ/tr, USD, k)
  styles/global.css          Design tokens (màu thương hiệu, font) và class dùng chung
  components/
    charts/                  ChartTooltip, HBars (thanh ngang có mục tiêu / ngưỡng)
    layout/                  Sidebar, Topbar, AppLayout
    ui/                      Logo, Badge, ModuleTag, StatCard, Card, PageHeader, Segmented, Avatar,
                             Field, DetailHeader, Timeline, SearchBox, Alert,
                             LifecycleStepper (vòng đời lô hàng), JobLink (mã job mở chi tiết)
  pages/
    index.ts                 Danh sách module đã đăng ký (thứ tự = thứ tự trên sidebar)
    home/                    Module Trang chủ
      index.tsx              Khai báo route + menu của module
      HomePage.tsx
      components/            charts, TaskTable, JobLifecycle, SidePanels
      data.ts  types.ts  home.css
    customers/               Module Khách hàng
      index.tsx              Khai báo route + menu của module
      types.ts               Kiểu dữ liệu chung của module
      list/                  Danh sách khách hàng   (CustomerListPage, data)
      opportunities/         Cơ hội và RFQ          (RfqPage, data, rfq.css)
      contracts/             Hợp đồng và SLA        (ContractsPage, data)
      activities/            Hoạt động chăm sóc     (ActivitiesPage, data, activities.css)
    quotation-booking/       Module Báo giá và Booking (FMS)
      index.tsx              Khai báo route + menu của module
      types.ts  quotation-booking.css
      rates/                 Bảng giá cước
      quotations/            Báo giá
      bookings/              Booking
      shipping-instructions/ Shipping Instruction
      bills/                 Vận đơn (B/L, AWB)
    jobs/                    Module Job / Lô hàng (màn hình trung tâm)
      index.tsx              Khai báo route + menu của module
      data.ts  types.ts  shared.ts  jobs.css
      list/                  Danh sách job
      detail/                Chi tiết job /job/:code, 7 tab (Tổng quan, Vận tải, Kho, Hải quan, Tài chính, Chứng từ, Lịch sử)
      tracking/              Tracking lô hàng
      today/                 Job cần xử lý hôm nay
    transport/               Module Vận tải (TMS)
      index.tsx              Khai báo route + menu của module
      data.ts  types.ts  shared.ts  transport.css
      orders/                Lệnh vận chuyển
      dispatch/              Điều phối xe (lịch xe theo giờ, gán xe, cảnh báo trùng lịch)
      containers/            Container và EIR
      trips/                 Chuyến (Trip)
      pod/                   Duyệt POD
      contractors/           Nhà thầu vận tải
      reports/               Báo cáo vận tải
    warehouse/               Module Kho (WMS)
      index.tsx              Khai báo route + menu của module
      data.ts  types.ts  shared.ts  warehouse.css
      stock/                 Tồn kho (theo mã hàng, vị trí, lô)
      inbound/               Nhập kho (GRN)
      outbound/              Xuất kho
      counts/                Kiểm kê và điều chỉnh
      map/                   Sơ đồ vị trí kho (/so-do-kho?o=A3-04 mở thẳng một vị trí)
      reports/               Báo cáo kho
    customs/                 Module Hải quan (Customs)
      index.tsx              Khai báo route + menu của module
      data.ts  types.ts  shared.tsx  customs.css
      declarations/          Tờ khai
      dossiers/              Hồ sơ khai (bộ chứng từ, đối chiếu chéo)
      permits/               Giấy phép và C/O
      results/               Kết quả thông quan
      taxes/                 Thuế và phí
    finance/                 Module Tài chính (Finance)
      index.tsx              Khai báo route + menu của module
      data.ts  types.ts  shared.ts  finance.css
      receivables/           Công nợ phải thu (theo khách hàng / theo hóa đơn, tuổi nợ)
      payables/              Công nợ phải trả (đối chiếu với chi phí job, duyệt)
      bank/                  Thu chi và ngân hàng (ghép giao dịch với hóa đơn)
      vat/                   Thuế VAT
      reconciliation/        Đối soát công nợ
      job-pnl/               Lãi lỗ theo job (đọc dữ liệu từ module Job)
    documents/               Module Chứng từ (DMS)
      index.tsx              Khai báo route + menu của module
      data.ts  types.ts  shared.tsx  documents.css
      all/                   Tất cả chứng từ (đọc chứng từ từ module Job, lọc theo ?job=)
      upload/                Tải lên (kéo thả, AI phân loại và gắn job)
      ocr/                   Hàng chờ duyệt OCR (sửa / xác nhận trường, duyệt)
      alerts/                Cảnh báo thiếu hoặc lệch (sắp theo hạn bước bị chặn)
      search/                Tìm kiếm nâng cao (toàn văn nội dung OCR, không dấu)
    reports/                 Module Báo cáo (Data)
      index.tsx              Khai báo route + menu của module
      data.ts  reports.css   Chuỗi số liệu tổng hợp (tháng, tuần, dự báo)
      operations/            Dashboard vận hành (đọc số từ Job, Vận tải, Kho, Hải quan, DMS)
      finance/               Dashboard tài chính (công nợ, số dư đọc từ Tài chính)
      sales/                 Dashboard kinh doanh (phễu, TEU, sales, tuyến)
      builder/               Báo cáo tự tạo (nguồn dữ liệu, nhóm theo, chỉ số, lọc)
      forecast/              Dự báo (job, doanh thu, đầu kéo, lấp đầy kho)
    master-data/             Module Danh mục (Master Data)
      index.tsx              Khai báo route + menu của module
      data.ts  types.ts  shared.tsx  master-data.css   (RecordPanel: xem, sửa, duyệt, ngừng dùng bản ghi)
      partners/              Khách hàng, nhà cung cấp (đồng bộ CRM/TMS, kiểm tra trùng MST, gộp bản ghi)
      carriers/              Hãng tàu, hãng bay (SCAC, IATA, tiền tố AWB, kiểu kết nối)
      locations/             Cảng, kho, địa điểm (UN/LOCODE, đếm job theo cảng)
      hs-uom/                Mã HS, đơn vị tính (thuế suất, chính sách, gợi ý mã HS)
      tariff/                Biểu phí chuẩn (giá chuẩn, giá sàn, duyệt đề xuất đổi giá)
    admin/                   Module Quản trị
      index.tsx              Khai báo route + menu của module
      data.ts  types.ts  shared.ts  admin.css
      users/                 Người dùng và vai trò (mời, khóa, gán vai trò, 2 lớp)
      permissions/           Phân quyền (ma trận vai trò × phân hệ × hành động, phạm vi dữ liệu)
      workflows/             Quy trình duyệt (các bước, điều kiện, SLA; số chờ đếm từ các phân hệ)
      integrations/          Cấu hình tích hợp (VNACCS, hóa đơn điện tử, ngân hàng, hãng tàu, OCR, GPS)
      audit/                 Nhật ký hệ thống (lọc theo loại, người; xem giá trị trước và sau)
```

### Thêm module mới

1. Tạo `src/pages/<ten-module>/index.tsx` export một `AppModule` (`title`, `menu`, `routes`).
2. Đăng ký vào mảng `appModules` trong `src/pages/index.ts`.

Sidebar và router tự đọc từ đó, không cần sửa `App.tsx` hay `Sidebar.tsx`.

## Route

| Đường dẫn       | Trang                 |
| --------------- | --------------------- |
| `/`             | Trang chủ             |
| `/khach-hang`   | Danh sách khách hàng  |
| `/co-hoi-rfq`   | Cơ hội và RFQ         |
| `/hop-dong-sla` | Hợp đồng và SLA       |
| `/hoat-dong`    | Hoạt động chăm sóc    |
| `/bang-gia-cuoc` | Bảng giá cước        |
| `/bao-gia`      | Báo giá               |
| `/booking`      | Booking               |
| `/shipping-instruction` | Shipping Instruction |
| `/van-don`      | Vận đơn (B/L, AWB)    |
| `/job`          | Danh sách job         |
| `/job/:code`    | Chi tiết job (`?tab=van-tai`, `kho`, `hai-quan`, `tai-chinh`, `chung-tu`, `lich-su`) |
| `/tracking`     | Tracking lô hàng      |
| `/job-hom-nay`  | Job cần xử lý hôm nay |
| `/lenh-van-chuyen` | Lệnh vận chuyển    |
| `/dieu-phoi-xe` | Điều phối xe          |
| `/container-eir` | Container và EIR     |
| `/chuyen`       | Chuyến (Trip)         |
| `/duyet-pod`    | Duyệt POD             |
| `/nha-thau-van-tai` | Nhà thầu vận tải  |
| `/bao-cao-van-tai` | Báo cáo vận tải    |
| `/ton-kho`      | Tồn kho               |
| `/nhap-kho`     | Nhập kho (GRN)        |
| `/xuat-kho`     | Xuất kho              |
| `/kiem-ke`      | Kiểm kê và điều chỉnh |
| `/so-do-kho`    | Sơ đồ vị trí kho      |
| `/bao-cao-kho`  | Báo cáo kho           |
| `/to-khai`      | Tờ khai               |
| `/ho-so-khai`   | Hồ sơ khai            |
| `/giay-phep-co` | Giấy phép và C/O      |
| `/ket-qua-thong-quan` | Kết quả thông quan |
| `/thue-phi`     | Thuế và phí           |
| `/cong-no-phai-thu` | Công nợ phải thu  |
| `/cong-no-phai-tra` | Công nợ phải trả  |
| `/thu-chi-ngan-hang` | Thu chi và ngân hàng |
| `/thue-vat`     | Thuế VAT              |
| `/doi-soat-cong-no` | Đối soát công nợ  |
| `/lai-lo-theo-job` | Lãi lỗ theo job    |
| `/chung-tu`     | Tất cả chứng từ       |
| `/tai-len`      | Tải lên chứng từ      |
| `/duyet-ocr`    | Hàng chờ duyệt OCR    |
| `/canh-bao-chung-tu` | Cảnh báo thiếu hoặc lệch |
| `/tim-kiem-chung-tu` | Tìm kiếm nâng cao |
| `/dashboard-van-hanh` | Dashboard vận hành |
| `/dashboard-tai-chinh` | Dashboard tài chính |
| `/dashboard-kinh-doanh` | Dashboard kinh doanh |
| `/bao-cao-tu-tao` | Báo cáo tự tạo     |
| `/du-bao`       | Dự báo                |
| `/doi-tac`      | Khách hàng, nhà cung cấp |
| `/hang-tau-hang-bay` | Hãng tàu, hãng bay |
| `/dia-diem`     | Cảng, kho, địa điểm   |
| `/ma-hs-don-vi` | Mã HS, đơn vị tính    |
| `/bieu-phi-chuan` | Biểu phí chuẩn      |
| `/nguoi-dung`   | Người dùng và vai trò |
| `/phan-quyen`   | Phân quyền            |
| `/quy-trinh-duyet` | Quy trình duyệt    |
| `/tich-hop`     | Cấu hình tích hợp     |
| `/nhat-ky`      | Nhật ký hệ thống      |
