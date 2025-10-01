<template>
  <div class="account-details-container">
<h1>Thông tin cá nhân</h1>

    <!-- PHẦN 1: THÔNG TIN TÓM TẮT -->
    <section class="account-info-summary">
      <div v-if="user">
        <p><strong>Tên khách hàng:</strong> {{ user.tenKhachHang }}</p>
        <p><strong>Số điện thoại</strong> {{ user.soDienThoai }}</p>
        <p><strong>Email:</strong> {{ user.email }}</p>
      </div>
    </section>

    <!-- PHẦN 2: GRID 2 CỘT -->
    <div class="account-main-grid">
      <!-- CỘT TRÁI: THÔNG TIN KH -->
      <form @submit.prevent="updateDetails" class="personal-details">
        <h2>Chi tiết cá nhân</h2>
        <div class="form-group">
          <label for="fullName">Họ và tên <span class="required">*</span></label>
          <input type="text" id="fullName" v-model="form.hoVaTen" :readonly="!isEditing" required />
        </div>
        <div class="form-group">
          <label for="email">Email <span class="required">*</span></label>
          <input type="email" id="email" v-model="form.email" :readonly="!isEditing" required />
        </div>
        <div class="form-group">
          <label for="phoneNumber">Số điện thoại <span class="required">*</span></label>
          <input type="tel" id="phoneNumber" v-model="form.soDienThoai" :readonly="!isEditing" required />
        </div>
        <div class="form-group">
          <label for="dateOfBirth">Ngày sinh</label>
          <input type="date" id="dateOfBirth" v-model="form.ngaySinh" :readonly="!isEditing" />
        </div>
        <div class="form-group">
          <label>Giới tính</label>
          <div class="gender-options">
            <label>
              <input type="radio" value="Nam" v-model="form.gioiTinh" :disabled="!isEditing"> Nam
            </label>
            <label>
              <input type="radio" value="Nữ" v-model="form.gioiTinh" :disabled="!isEditing"> Nữ
            </label>
          </div>
        </div>
        <div class="button-actions">
          <button v-if="!isEditing" type="button" @click="startEditing" class="btn btn-primary">Cập nhật chi
            tiết</button>
          <button v-if="isEditing" type="submit" class="btn btn-success">Lưu thay đổi</button>
          <button v-if="isEditing" type="button" @click="cancelEditing" class="btn btn-secondary">Hủy</button>
        </div>
      </form>

      <!-- CỘT PHẢI: DANH SÁCH ĐỊA CHỈ -->
      <section class="billing-addresses">
        <h2>
          Thông tin địa chỉ
          <button @click="openAddAddressModal" class="btn btn-add" :disabled="user?.diaChis?.length >= 5">
            Thêm địa chỉ
          </button>
        </h2>
        <div v-if="user && user.diaChis && user.diaChis.length > 0" class="address-list">
          <div v-for="(address, index) in user.diaChis" :key="index" class="address-card">
            <p>
              <strong>Địa chỉ:</strong> {{ formatAddress(address) }}
              <span v-if="address.isMacDinh" class="default-label">Mặc định</span>
            </p>
            <div class="address-actions">
              <button v-if="!address.isMacDinh" @click="setAsDefaultAddress(address.id)"
                class="btn btn-icon btn-set-default">
                <i class="fas fa-star"></i>
              </button>
              <button @click="editAddress(address)" class="btn btn-icon btn-edit">
                <i class="fas fa-edit"></i>
              </button>
              <button @click="deleteAddress(address.id)" class="btn btn-icon btn-delete">
                <i class="fas fa-trash"></i>
              </button>
            </div>
          </div>
        </div>
        <p v-else class="no-address-message">Bạn chưa có địa chỉ nào được lưu.</p>
      </section>
    </div>

    <AddressModal :show="showAddressModal" :initialAddress="initialAddressToEdit" :customer-id="user?.id"
      @close="showAddressModal = false" @address-saved="handleAddressSaved" />
  </div>
</template>
<style scoped>
/* Container chính */
.account-details-container {
  padding: 30px;
  max-width: 1400px;
  /* tăng rộng tối đa */
  margin: 30px auto;
  font-family: 'Inter', sans-serif;
}

/* Phần tóm tắt (full width) */
.account-info-summary {
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 30px;
}

/* Grid 2 cột */
.account-main-grid {
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  /* cột trái rộng hơn */
  gap: 40px;
  /* tăng khoảng cách giữa 2 cột */
}

/* Form + địa chỉ */
.personal-details,
.billing-addresses {
  background: #fff;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
}

h1 {
  text-align: center;
  color: #0a2c57;
  margin-bottom: 30px;
  font-size: 2.5em;
  font-weight: 700;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.05);
}

h2 {
  color: #1a3a5f;
  margin-top: 30px;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 1px solid #e0e6ed;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 1.6em;
  font-weight: 600;
}

.account-info-summary {
  background-color: #eaf1f9;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 30px;
  border: 1px solid #d4e0ee;
}

.account-info-summary p {
  margin: 8px 0;
  font-size: 1.1em;
  line-height: 1.5;
}

.required {
  color: #e74c3c;
  margin-left: 4px;
}

/* FORM ELEMENTS */
.form-group {
  margin-bottom: 25px;
}

label {
  display: block;
  margin-bottom: 10px;
  font-weight: 600;
  color: #555;
  font-size: 1em;
}

input[type="text"],
input[type="email"],
input[type="tel"],
input[type="date"],
select {
  width: 100%;
  padding: 14px;
  border: 1px solid #ccd1d8;
  border-radius: 8px;
  font-size: 1em;
  transition: border-color 0.3s, box-shadow 0.3s;
  box-sizing: border-box;
}

input:read-only,
input:disabled {
  background-color: #e9ecef;
  cursor: not-allowed;
  color: #888;
}

input:focus,
select:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
}

.gender-options {
  display: flex;
  gap: 30px;
  align-items: center;
}

.gender-options label {
  font-weight: normal;
  display: flex;
  align-items: center;
  cursor: pointer;
}

.gender-options input[type="radio"] {
  width: auto;
  margin-right: 10px;
}

/* BUTTONS */
.button-actions {
  display: flex;
  gap: 15px;
  margin-top: 30px;
}

.btn {
  padding: 12px 25px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1em;
  transition: transform 0.2s, background-color 0.3s, box-shadow 0.3s;
  font-weight: 600;
}

.btn-primary {
  background-color: #3b82f6;
  color: white;
}

.btn-success {
  background-color: #22c55e;
  color: white;
}

.btn-secondary {
  background-color: #6b7280;
  color: white;
}

.btn-add {
  background-color: #0ea5e9;
  color: white;
}

.btn-primary:hover {
  background-color: #2563eb;
  transform: translateY(-2px);
  box-shadow: 0 4px 10px rgba(59, 130, 246, 0.3);
}

.btn-success:hover {
  background-color: #16a34a;
  transform: translateY(-2px);
  box-shadow: 0 4px 10px rgba(34, 197, 94, 0.3);
}

.btn-secondary:hover {
  background-color: #4b5563;
  transform: translateY(-2px);
  box-shadow: 0 4px 10px rgba(107, 114, 128, 0.3);
}

.btn-add:hover {
  background-color: #0284c7;
  transform: translateY(-2px);
  box-shadow: 0 4px 10px rgba(14, 165, 233, 0.3);
}

/* ADDRESS SECTION */
.address-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.address-card {
  border: 1px solid #e5e7eb;
  padding: 20px;
  border-radius: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #ffffff;
  transition: transform 0.2s, box-shadow 0.2s;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.address-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.08);
}

.address-actions {
  display: flex;
  gap: 10px;
}

.btn-edit,
.btn-delete,
.btn-set-default {
  padding: 8px 16px;
  font-size: 0.9em;
  font-weight: 500;
}

.btn-edit {
  background-color: #fcd34d;
  color: #333;
}

.btn-delete {
  background-color: #ef4444;
  color: white;
}

.btn-set-default {
  background-color: #3b82f6;
  color: white;
}

.btn-edit:hover {
  background-color: #fbbd24;
}

.btn-delete:hover {
  background-color: #dc2626;
}

.btn-set-default:hover {
  background-color: #2563eb;
}

.no-address-message {
  text-align: center;
  color: #888;
  font-style: italic;
  padding: 30px;
  background-color: #e9ecef;
  border-radius: 12px;
}

.default-label {
  background-color: #22c55e;
  color: white;
  padding: 5px 10px;
  border-radius: 9999px;
  /* Tạo hình viên thuốc */
  font-size: 0.8em;
  font-weight: 600;
  margin-left: 15px;
  vertical-align: middle;
}

@media (min-width: 1600px) {
  .account-details-container {
    max-width: 1600px;
  }
}

.address-actions {
  display: flex;
  gap: 8px;
}

.btn-icon {
  width: 36px;
  height: 36px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s, background-color 0.3s;
  color: #fff;
  font-size: 16px;
}

.btn-icon:hover {
  transform: translateY(-2px);
}

/* Màu riêng cho từng loại nút */
.btn-set-default { background-color: #3b82f6; }
.btn-edit { background-color: #facc15; color: #333; }
.btn-delete { background-color: #ef4444; }

/* Hover */
.btn-set-default:hover { background-color: #2563eb; }
.btn-edit:hover { background-color: #eab308; }
.btn-delete:hover { background-color: #dc2626; }

</style>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import AddressModal from '../client/ClientAddressModel.vue';
import { useToast } from 'vue-toastification';

const user = ref(null);
const isEditing = ref(false);
const showAddressModal = ref(false);
const initialAddressToEdit = ref(null);
const toast = useToast();

const form = ref({
  hoVaTen: '',
  email: '',
  soDienThoai: '',
  ngaySinh: '',
  gioiTinh: '',
  trangThai: '',
});

const apiClient = axios.create({
  baseURL: 'http://localhost:8080/client',
  headers: {
    'Content-Type': 'application/json',
  },
});

const loadUserFromStorage = () => {
  const storedUser = localStorage.getItem('loggedInUser');
  if (storedUser) {
    user.value = JSON.parse(storedUser);
    fillFormWithUserData();
    console.log('User data loaded in MyAccount:', user.value);
  } else {
    console.warn('No user data found in localStorage.');
  }
};

const fillFormWithUserData = () => {
  if (user.value) {
    form.value.hoVaTen = user.value.hoTen || user.value.tenKhachHang;
    form.value.email = user.value.email;
    form.value.soDienThoai = user.value.soDienThoai;
    form.value.ngaySinh = user.value.ngaySinh;
    form.value.gioiTinh = user.value.gioiTinh;
    form.value.trangThai = user.value.trangThai;
  }
};

const startEditing = () => {
  isEditing.value = true;
};

const cancelEditing = () => {
  isEditing.value = false;
  fillFormWithUserData();
};

const updateDetails = async () => {
  try {
    const response = await apiClient.put(`/information/${user.value.id}`, {
      hoTen: form.value.hoVaTen,
      soDienThoai: form.value.soDienThoai,
      ngaySinh: form.value.ngaySinh,
      gioiTinh: form.value.gioiTinh,
    }, {
      headers: {
        'X-User-ID': user.value.id,
      },
    });
    user.value = { ...user.value, ...form.value };
    localStorage.setItem('loggedInUser', JSON.stringify(user.value));
    isEditing.value = false;
    toast.success('Cập nhật thông tin thành công!');
    console.log('Update successful:', response.data);
  } catch (error) {
    console.error('Lỗi khi cập nhật thông tin:', error.response?.data || error.message);
    toast.error('Đã xảy ra lỗi. Vui lòng thử lại.');
  }
};

const formatAddress = (address) => {
  if (!address) return 'Chưa có địa chỉ';
  return `${address.diaChiChiTiet}, ${address.xaPhuong}, ${address.quanHuyen}, ${address.tinhThanhPho}`;
};

const openAddAddressModal = () => {
  if (user.value?.diaChis?.length >= 5) {
    toast.error('Bạn đã đạt giới hạn tối đa 5 địa chỉ.');
    return;
  }
  initialAddressToEdit.value = null;
  showAddressModal.value = true;
};

const editAddress = (address) => {
  initialAddressToEdit.value = address;
  showAddressModal.value = true;
};

const deleteAddress = async (addressId) => {
  if (confirm('Bạn có chắc chắn muốn xóa địa chỉ này?')) {
    try {
      await apiClient.delete(`/addresses/${addressId}`, {
        headers: {
          'X-User-ID': user.value.id,
        },
      });
      user.value.diaChis = user.value.diaChis.filter(addr => addr.id !== addressId);
      localStorage.setItem('loggedInUser', JSON.stringify(user.value));
      toast.success('Xóa địa chỉ thành công!');
    } catch (error) {
      console.error('Lỗi khi xóa địa chỉ:', error.response?.data || error.message);
      toast.error('Đã xảy ra lỗi khi xóa địa chỉ. Vui lòng thử lại.');
    }
  }
};

const setAsDefaultAddress = async (addressId) => {
  if (confirm('Bạn có chắc chắn muốn đặt địa chỉ này làm địa chỉ mặc định?')) {
    try {
      // GIẢ ĐỊNH MỘT API ĐỂ ĐẶT MẶC ĐỊNH ĐỊA CHỈ
      // Bạn cần triển khai API này trên backend
      await apiClient.put(`/addresses/${addressId}/set-default`, {}, {
        headers: {
          'X-User-ID': user.value.id,
        },
      });
      toast.success('Thiết lập địa chỉ mặc định thành công!');
      await reloadUserData(); // Tải lại dữ liệu để cập nhật hiển thị
    } catch (error) {
      console.error('Lỗi khi thiết lập mặc định:', error.response?.data || error.message);
      toast.error('Đã xảy ra lỗi khi thiết lập địa chỉ mặc định. Vui lòng thử lại.');
    }
  }
};

const reloadUserData = async () => {
  try {
    const response = await apiClient.get(`/information/${user.value.id}`, {
      headers: {
        'X-User-ID': user.value.id,
      },
    });
    if (response.data) {
      user.value = response.data;
      localStorage.setItem('loggedInUser', JSON.stringify(user.value));
      fillFormWithUserData();
    }
  } catch (error) {
    console.error('Failed to reload user data:', error);
  }
};

const handleAddressSaved = async () => {
  await reloadUserData();
};

onMounted(() => {
  loadUserFromStorage();
});
</script>