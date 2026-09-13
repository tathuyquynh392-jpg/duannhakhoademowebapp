// Structured Vietnam Administrative Divisions Data (Tỉnh/Thành -> Quận/Huyện -> Xã/Phường -> Tổ/Xóm)

export const VIETNAM_LOCATIONS = [
  {
    name: "Thái Nguyên",
    districts: [
      {
        name: "Thành phố Thái Nguyên",
        wards: [
          { name: "Phường Hoàng Văn Thụ", groups: ["Tổ 1", "Tổ 2", "Tổ 3", "Tổ 4", "Tổ 5", "Tổ 6", "Tổ 7", "Tổ 8"] },
          { name: "Phường Phan Đình Phùng", groups: ["Tổ 1", "Tổ 2", "Tổ 3", "Tổ 4", "Tổ 5"] },
          { name: "Phường Quang Trung", groups: ["Tổ 1", "Tổ 2", "Tổ 3", "Tổ 4", "Tổ 5", "Tổ 6"] },
          { name: "Phường Đồng Bẩm", groups: ["Tổ 1", "Tổ 2", "Tổ 3", "Xóm Xương Rồng"] },
          { name: "Phường Tân Lập", groups: ["Tổ 1", "Tổ 2", "Tổ 3", "Tổ 4"] },
          { name: "Phường Túc Duyên", groups: ["Tổ 1", "Tổ 2", "Tổ 3", "Tổ 4", "Tổ 5"] },
        ]
      },
      {
        name: "Thành phố Sông Công",
        wards: [
          { name: "Phường Thắng Lợi", groups: ["Tổ 1", "Tổ 2", "Tổ 3", "Tổ 4"] },
          { name: "Phường Mỏ Chè", groups: ["Tổ 1", "Tổ 2", "Tổ 3"] },
          { name: "Phường Cải Đan", groups: ["Tổ 1", "Tổ 2", "Tổ 3"] },
        ]
      },
      {
        name: "Thị xã Phổ Yên",
        wards: [
          { name: "Phường Ba Hàng", groups: ["Tổ 1", "Tổ 2", "Tổ 3"] },
          { name: "Phường Đồng Tiến", groups: ["Tổ 1", "Tổ 2", "Tổ 3"] },
        ]
      },
      {
        name: "Huyện Đại Từ",
        wards: [
          { name: "Thị trấn Hùng Sơn", groups: ["Tổ 1", "Tổ 2", "Xóm Chùa"] },
          { name: "Xã An Khánh", groups: ["Xóm 1", "Xóm 2", "Xóm 3"] },
        ]
      }
    ]
  },
  {
    name: "Thành phố Hà Nội",
    districts: [
      {
        name: "Quận Ba Đình",
        wards: [
          { name: "Phường Kim Mã", groups: ["Tổ 1", "Tổ 2", "Tổ 3", "Tổ 4", "Tổ 5"] },
          { name: "Phường Đội Cấn", groups: ["Tổ 1", "Tổ 2", "Tổ 3", "Tổ 4"] },
          { name: "Phường Điện Biên", groups: ["Tổ 1", "Tổ 2", "Tổ 3"] },
        ]
      },
      {
        name: "Quận Hoàn Kiếm",
        wards: [
          { name: "Phường Tràng Tiền", groups: ["Tổ 1", "Tổ 2", "Tổ 3"] },
          { name: "Phường Hàng Bạc", groups: ["Tổ 1", "Tổ 2", "Tổ 3"] },
          { name: "Phường Lý Thái Tổ", groups: ["Tổ 1", "Tổ 2", "Tổ 3"] },
        ]
      },
      {
        name: "Quận Đống Đa",
        wards: [
          { name: "Phường Cát Linh", groups: ["Tổ 1", "Tổ 2", "Tổ 3", "Tổ 4"] },
          { name: "Phường Láng Hạ", groups: ["Tổ 1", "Tổ 2", "Tổ 3", "Tổ 4", "Tổ 5"] },
          { name: "Phường Ô Chợ Dừa", groups: ["Tổ 1", "Tổ 2", "Tổ 3"] },
        ]
      },
      {
        name: "Quận Cầu Giấy",
        wards: [
          { name: "Phường Dịch Vọng", groups: ["Tổ 1", "Tổ 2", "Tổ 3", "Tổ 4"] },
          { name: "Phường Dịch Vọng Hậu", groups: ["Tổ 1", "Tổ 2", "Tổ 3"] },
          { name: "Phường Nghĩa Tân", groups: ["Tổ 1", "Tổ 2", "Tổ 3"] },
        ]
      }
    ]
  },
  {
    name: "Thành phố Hồ Chí Minh",
    districts: [
      {
        name: "Quận 1",
        wards: [
          { name: "Phường Bến Nghé", groups: ["Khu phố 1", "Khu phố 2", "Khu phố 3"] },
          { name: "Phường Bến Thành", groups: ["Khu phố 1", "Khu phố 2", "Khu phố 3"] },
          { name: "Phường Tân Định", groups: ["Khu phố 1", "Khu phố 2", "Khu phố 3"] },
        ]
      },
      {
        name: "Quận 3",
        wards: [
          { name: "Phường Võ Thị Sáu", groups: ["Khu phố 1", "Khu phố 2", "Khu phố 3"] },
          { name: "Phường 1", groups: ["Khu phố 1", "Khu phố 2"] },
          { name: "Phường 2", groups: ["Khu phố 1", "Khu phố 2"] },
        ]
      },
      {
        name: "Thành phố Thủ Đức",
        wards: [
          { name: "Phường Thảo Điền", groups: ["Khu phố 1", "Khu phố 2", "Khu phố 3"] },
          { name: "Phường An Phú", groups: ["Khu phố 1", "Khu phố 2", "Khu phố 3"] },
          { name: "Phường Hiệp Bình Chánh", groups: ["Khu phố 1", "Khu phố 2", "Khu phố 3"] },
        ]
      },
      {
        name: "Quận Bình Thạnh",
        wards: [
          { name: "Phường 25", groups: ["Khu phố 1", "Khu phố 2", "Khu phố 3"] },
          { name: "Phường 26", groups: ["Khu phố 1", "Khu phố 2"] },
        ]
      }
    ]
  },
  {
    name: "Thành phố Đà Nẵng",
    districts: [
      {
        name: "Quận Hải Châu",
        wards: [
          { name: "Phường Hải Châu I", groups: ["Tổ 1", "Tổ 2", "Tổ 3"] },
          { name: "Phường Phước Ninh", groups: ["Tổ 1", "Tổ 2"] },
        ]
      },
      {
        name: "Quận Thanh Khê",
        wards: [
          { name: "Phường Vĩnh Trung", groups: ["Tổ 1", "Tổ 2"] },
          { name: "Phường Tân Chính", groups: ["Tổ 1", "Tổ 2"] },
        ]
      }
    ]
  }
];

export const getProvinces = () => VIETNAM_LOCATIONS.map(p => p.name);

export const getDistricts = (provinceName) => {
  const p = VIETNAM_LOCATIONS.find(item => item.name === provinceName);
  return p ? p.districts.map(d => d.name) : [];
};

export const getWards = (provinceName, districtName) => {
  const p = VIETNAM_LOCATIONS.find(item => item.name === provinceName);
  if (!p) return [];
  const d = p.districts.find(item => item.name === districtName);
  return d ? d.wards.map(w => w.name) : [];
};

export const getGroups = (provinceName, districtName, wardName) => {
  const p = VIETNAM_LOCATIONS.find(item => item.name === provinceName);
  if (!p) return [];
  const d = p.districts.find(item => item.name === districtName);
  if (!d) return [];
  const w = d.wards.find(item => item.name === wardName);
  return w ? w.groups : ["Tổ 1", "Tổ 2", "Tổ 3", "Tổ 4"];
};

// Helper: Parse combined string into parts or format parts into combined string
export const parseAddressString = (fullStr) => {
  if (!fullStr) return { province: '', district: '', ward: '', group: '' };
  const parts = fullStr.split(',').map(s => s.trim());
  if (parts.length >= 4) {
    return {
      group: parts[0],
      ward: parts[1],
      district: parts[2],
      province: parts[3]
    };
  }
  return { province: 'Thái Nguyên', district: 'Thành phố Thái Nguyên', ward: 'Phường Hoàng Văn Thụ', group: parts[0] || 'Tổ 5' };
};

export const formatAddressString = (group, ward, district, province) => {
  if (!province) return '';
  const list = [group, ward, district, province].filter(Boolean);
  return list.join(', ');
};
