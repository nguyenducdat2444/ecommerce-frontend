<template>
    <div class="order-lookup-container">
        <div class="content-wrapper">
            <h2>Tra cứu đơn hàng</h2>
            <p class="note">Vui lòng nhập mã hóa đơn và số điện thoại đã dùng khi đặt hàng.</p>


            <form @submit.prevent="lookupOrder">
                <div class="form-group">
                    <label for="maHoaDon">Mã hóa đơn:</label>
                    <input type="text" id="maHoaDon" v-model="maHoaDon" required>
                </div>


                <div class="form-group">
                    <label for="soDienThoai">Số điện thoại:</label>
                    <input type="tel" id="soDienThoai" v-model="soDienThoai" required>
                </div>


                <button type="submit" class="btn-lookup">Tra cứu</button>
            </form>


            <div v-if="loading" class="loading-spinner">Đang tra cứu...</div>


            <div v-if="errorMessage" class="error-message">
                {{ errorMessage }}
            </div>


            <div v-if="orderFound" class="order-result">
    <h3>Thông tin đơn hàng #{{ orderData.maHoaDon }}</h3>
    <div class="info-section-grid">
        <div class="info-item">
            <strong>Ngày đặt:</strong>
            <p>{{ formatDate(orderData.ngayDat) }}</p>
        </div>
        <div class="info-item">
            <strong>Trạng thái:</strong>
            <p><span :class="getStatusClass(orderData.trangThai)">{{ orderData.trangThaiText }}</span></p>
        </div>
        <div class="info-item">
            <strong>Tổng tiền:</strong>
            <p>{{ formatCurrency(orderData.tongTien) }}</p>
        </div>
        <div class="info-item">
            <strong>Phí vận chuyển:</strong>
            <p>{{ formatCurrency(orderData.phiVanChuyen) }}</p>
        </div>
    </div>


    <hr>


    <h4>Thông tin người nhận</h4>
    <div class="info-section-grid">
        <div class="info-item">
            <strong>Tên:</strong>
            <p>{{ orderData.tenNguoiNhan }}</p>
        </div>
        <div class="info-item">
            <strong>Số điện thoại:</strong>
            <p>{{ orderData.sdtNguoiNhan }}</p>
        </div>
        <div class="info-item">
            <strong>Địa chỉ:</strong>
            <p>{{ orderData.diaChiNguoiNhan }}</p>
        </div>
        <div v-if="orderData.ghiChu" class="info-item">
            <strong>Ghi chú:</strong>
            <p>{{ orderData.ghiChu }}</p>
        </div>
    </div>


    <hr>


    <h4>Thông tin khách hàng</h4>
    <div class="info-section-grid">
        <div v-if="orderData.maKhachHang" class="info-item">
            <strong>Mã khách hàng:</strong>
            <p>{{ orderData.maKhachHang }}</p>
        </div>
        <div v-if="orderData.tenKhachHang" class="info-item">
            <strong>Tên khách hàng:</strong>
            <p>{{ orderData.tenKhachHang }}</p>
        </div>
        <div v-if="orderData.soDienThoai" class="info-item">
            <strong>Số điện thoại:</strong>
            <p>{{ orderData.soDienThoai }}</p>
        </div>
    </div>


    <hr>


    <h4>Danh sách sản phẩm</h4>
    <div class="product-list-item" v-for="item in orderData.danhSachSanPham" :key="item.idHoaDonChiTiet">
        <img :src="item.duongDanAnh" alt="Product Image" class="product-image">
        <div class="product-info">
            <p><strong>{{ item.tenSanPham }}</strong></p>
            <p>Màu: {{ item.tenMau }}, Kích cỡ: {{ item.tenKichCo }}</p>
            <p>Số lượng: {{ item.soLuong }}</p>
            <p>Giá: {{ formatCurrency(item.giaBanTaiThoiDiem) }}</p>
            <p>Thành tiền: {{ formatCurrency(item.thanhTien) }}</p>
        </div>
    </div>


    <!-- <a :href="`/coolmen/order/${orderData.id}`" class="btn-view-detail">Xem chi tiết hóa đơn</a> -->
</div>
        </div>
    </div>
</template>
<script>
import axios from 'axios';


export default {
    data() {
        return {
            maHoaDon: '',
            soDienThoai: '',
            orderData: null,
            orderFound: false,
            loading: false,
            errorMessage: ''
        };
    },
    methods: {
        async lookupOrder() {
            this.loading = true;
            this.errorMessage = '';
            this.orderFound = false;


            try {
                const response = await axios.get('http://localhost:8080/client/orders/lookup', {
                    params: {
                        maHoaDon: this.maHoaDon,
                        soDienThoai: this.soDienThoai
                    }
                });


                this.orderData = response.data;
                this.orderFound = true;


            } catch (error) {
                this.orderFound = false;
                if (error.response && error.response.status === 404) {
                    this.errorMessage = 'Không tìm thấy đơn hàng. Vui lòng kiểm tra lại mã hóa đơn và số điện thoại.';
                } else {
                    this.errorMessage = 'Đã xảy ra lỗi khi tra cứu. Vui lòng thử lại sau.';
                    console.error('Lỗi API:', error);
                }
            } finally {
                this.loading = false;
            }
        },
        formatDate(isoDate) {
            if (!isoDate) return 'N/A';
            const date = new Date(isoDate);
            return date.toLocaleDateString('vi-VN');
        },
        formatCurrency(amount) {
            return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
        },
        getStatusClass(trangThai) {
            switch (trangThai) {
                case 0: return 'status-pending';
                case 1: return 'status-confirmed';
                case 2: return 'status-shipping';
                case 3: return 'status-delivered';
                case 4: return 'status-completed';
                case 5: return 'status-cancelled';
                default: return '';
            }
        }
    }
};
</script>




<style scoped>
/* =============================== */
/* TOÀN TRANG TRA CỨU ĐƠN HÀNG */
/* =============================== */
.order-lookup-container {
    width: 100%;
    min-height: 100vh;
    background: linear-gradient(135deg, #e6f0ff, #f9fbff);
    display: flex;
    justify-content: center;
    padding: 3rem 1rem;
    font-family: "Inter", "Roboto", sans-serif;
}


/* KHUNG CHÍNH */
.content-wrapper {
    width: 100%;
    max-width: 1900px;
    background: #fff;
    padding: 2.5rem 3rem;
    border-radius: 20px;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.08);
    animation: fadeIn 0.5s ease-in-out;
   
}


/* Hiệu ứng vào trang */
@keyframes fadeIn {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
}


/* =============================== */
/* TIÊU ĐỀ TRANG */
/* =============================== */
h2 {
    font-size: 2rem;
    font-weight: 700;
    color: #0a2c57;
    text-align: center;
    margin-bottom: 1rem;
    position: relative;
}


h2::after {
    content: "";
    display: block;
    width: 70px;
    height: 4px;
    background: #0a2c57;
    border-radius: 2px;
    margin: 0.8rem auto;
}


/* =============================== */
/* FORM TRA CỨU */
/* =============================== */
form {
    display: flex;
    justify-content: center;
    align-items: flex-end;
    gap: 1rem;
    flex-wrap: wrap;
    margin-bottom: 2.5rem;
}


.form-group {
    display: flex;
    flex-direction: column;
}


.form-group label {
    font-size: 0.95rem;
    font-weight: 600;
    margin-bottom: 0.4rem;
    color: #0a2c57;
}


.form-group input {
    width: 250px;
    padding: 0.7rem 1rem;
    border: 1px solid #dcdcdc;
    border-radius: 10px;
    font-size: 1rem;
    transition: all 0.3s ease;
}


.form-group input:focus {
    border-color: #0a2c57;
    box-shadow: 0 0 0 3px rgba(10, 44, 87, 0.2);
    outline: none;
}


/* Nút tra cứu */
.btn-lookup {
    padding: 0.85rem 1.8rem;
    background: linear-gradient(135deg, #0a2c57, #1e4a80);
    color: #fff;
    font-size: 1rem;
    font-weight: bold;
    border: none;
    border-radius: 12px;
    cursor: pointer;
    transition: all 0.3s ease;
}


.btn-lookup:hover {
    background: linear-gradient(135deg, #082245, #123a66);
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(10, 44, 87, 0.3);
}


/* =============================== */
/* THÔNG TIN ĐƠN HÀNG */
/* =============================== */
.order-result {
    margin-top: 2.5rem;
    display: flex;
    flex-direction: column;
    gap: 2rem;
}


.card-section {
    background: #fff;
    border-radius: 16px;
    padding: 1.8rem 2rem;
    box-shadow: 0 5px 20px rgba(0,0,0,0.06);
    transition: all 0.3s ease;
}


.card-section:hover {
    transform: translateY(-2px);
}


/* Tiêu đề */
.order-result h3,
.order-result h4 {
    font-size: 1.4rem;
    color: #0a2c57;
    font-weight: 700;
    margin-bottom: 1.2rem;
}


/* Grid 2-3 cột */
.info-section-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
    gap: 1rem 2rem;
}


.info-item strong {
    display: block;
    font-size: 0.9rem;
    font-weight: 600;
    color: #34495e;
    margin-bottom: 0.25rem;
}


.info-item p {
    font-size: 1rem;
    margin: 0;
    color: #555;
}


/* =============================== */
/* DANH SÁCH SẢN PHẨM */
/* =============================== */
.product-list-item {
    display: flex;
    align-items: center;
    padding: 1rem;
    border-radius: 12px;
    background-color: #f9fbff;
    box-shadow: 0 4px 12px rgba(0,0,0,0.04);
    gap: 1rem;
}


.product-image {
    width: 90px;
    height: 90px;
    border-radius: 10px;
    object-fit: cover;
    border: 1px solid #eee;
}


.product-info p {
    margin: 0.3rem 0;
    font-size: 0.9rem;
    color: #333;
}


.product-info p strong {
    font-size: 1rem;
    color: #0a2c57;
}


/* =============================== */
/* NÚT XEM CHI TIẾT */
/* =============================== */
.btn-view-detail {
    display: inline-block;
    margin-top: 1.5rem;
    padding: 0.9rem 1.6rem;
    background: #0a2c57;
    color: #fff;
    font-size: 1rem;
    font-weight: bold;
    border-radius: 12px;
    text-decoration: none;
    text-align: center;
    transition: all 0.3s ease;
}


.btn-view-detail:hover {
    background: #082245;
    transform: scale(1.05);
}


.note {
    text-align: center;
    font-size: 0.95rem;
    color: #555;
    margin-bottom: 1.5rem;
}


.error-container {
  display: flex;
  justify-content: center; /* căn ngang */
  align-items: center;     /* căn dọc */
  height: 100%; /* hoặc height: 100vh nếu muốn full màn hình */
}


.error-message {
  text-align: center;
  color: red;
  font-weight: bold;
}


</style>



