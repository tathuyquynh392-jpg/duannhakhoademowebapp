// Full 36 Vietnam Administrative Divisions Data (Tỉnh/Thành -> Quận/Huyện -> Xã/Phường -> Tổ/Xóm)

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
  },
  {
    name: "Thành phố Hải Phòng",
    districts: [
      {
        name: "Quận Hồng Bàng",
        wards: [
          { name: "Phường Hoàng Văn Thụ", groups: ["Tổ 1", "Tổ 2", "Tổ 3"] },
          { name: "Phường Minh Khai", groups: ["Tổ 1", "Tổ 2"] }
        ]
      },
      {
        name: "Quận Ngô Quyền",
        wards: [
          { name: "Phường Máy Tơ", groups: ["Tổ 1", "Tổ 2"] },
          { name: "Phường Cầu Đất", groups: ["Tổ 1", "Tổ 2"] }
        ]
      }
    ]
  },
  {
    name: "Thành phố Cần Thơ",
    districts: [
      {
        name: "Quận Ninh Kiều",
        wards: [
          { name: "Phường Tân An", groups: ["Khu vực 1", "Khu vực 2"] },
          { name: "Phường An Khánh", groups: ["Khu vực 1", "Khu vực 2"] }
        ]
      },
      {
        name: "Quận Bình Thủy",
        wards: [
          { name: "Phường Bình Thủy", groups: ["Khu vực 1", "Khu vực 2"] }
        ]
      }
    ]
  },
  {
    name: "Quảng Ninh",
    districts: [
      {
        name: "Thành phố Hạ Long",
        wards: [
          { name: "Phường Bãi Cháy", groups: ["Tổ 1", "Tổ 2", "Tổ 3"] },
          { name: "Phường Hòn Gai", groups: ["Tổ 1", "Tổ 2"] }
        ]
      },
      {
        name: "Thành phố Cẩm Phả",
        wards: [
          { name: "Phường Cẩm Bình", groups: ["Tổ 1", "Tổ 2"] }
        ]
      }
    ]
  },
  {
    name: "Bắc Ninh",
    districts: [
      {
        name: "Thành phố Bắc Ninh",
        wards: [
          { name: "Phường Suối Hoa", groups: ["Khu 1", "Khu 2"] },
          { name: "Phường Ninh Xá", groups: ["Khu 1", "Khu 2"] }
        ]
      },
      {
        name: "Thị xã Từ Sơn",
        wards: [
          { name: "Phường Đông Ngàn", groups: ["Khu 1", "Khu 2"] }
        ]
      }
    ]
  },
  {
    name: "Hải Dương",
    districts: [
      {
        name: "Thành phố Hải Dương",
        wards: [
          { name: "Phường Trần Phú", groups: ["Tổ 1", "Tổ 2"] },
          { name: "Phường Lê Thanh Nghị", groups: ["Tổ 1", "Tổ 2"] }
        ]
      }
    ]
  },
  {
    name: "Hưng Yên",
    districts: [
      {
        name: "Thành phố Hưng Yên",
        wards: [
          { name: "Phường Hiến Nam", groups: ["Tổ 1", "Tổ 2"] }
        ]
      },
      {
        name: "Huyện Mỹ Hào",
        wards: [
          { name: "Phường Bần Yên Nhân", groups: ["Tổ 1", "Tổ 2"] }
        ]
      }
    ]
  },
  {
    name: "Vĩnh Phúc",
    districts: [
      {
        name: "Thành phố Vĩnh Yên",
        wards: [
          { name: "Phường Tích Sơn", groups: ["Tổ 1", "Tổ 2"] },
          { name: "Phường Đống Đa", groups: ["Tổ 1", "Tổ 2"] }
        ]
      }
    ]
  },
  {
    name: "Nam Định",
    districts: [
      {
        name: "Thành phố Nam Định",
        wards: [
          { name: "Phường Trần Hưng Đạo", groups: ["Tổ 1", "Tổ 2"] },
          { name: "Phường Vị Xuyên", groups: ["Tổ 1", "Tổ 2"] }
        ]
      }
    ]
  },
  {
    name: "Ninh Bình",
    districts: [
      {
        name: "Thành phố Ninh Bình",
        wards: [
          { name: "Phường Vân Giang", groups: ["Tổ 1", "Tổ 2"] }
        ]
      }
    ]
  },
  {
    name: "Thái Bình",
    districts: [
      {
        name: "Thành phố Thái Bình",
        wards: [
          { name: "Phường Lê Hồng Phong", groups: ["Tổ 1", "Tổ 2"] }
        ]
      }
    ]
  },
  {
    name: "Hà Nam",
    districts: [
      {
        name: "Thành phố Phủ Lý",
        wards: [
          { name: "Phường Minh Khai", groups: ["Tổ 1", "Tổ 2"] }
        ]
      }
    ]
  },
  {
    name: "Phú Thọ",
    districts: [
      {
        name: "Thành phố Việt Trì",
        wards: [
          { name: "Phường Gia Cẩm", groups: ["Tổ 1", "Tổ 2"] }
        ]
      }
    ]
  },
  {
    name: "Bắc Giang",
    districts: [
      {
        name: "Thành phố Bắc Giang",
        wards: [
          { name: "Phường Ngô Quyền", groups: ["Tổ 1", "Tổ 2"] }
        ]
      }
    ]
  },
  {
    name: "Lạng Sơn",
    districts: [
      {
        name: "Thành phố Lạng Sơn",
        wards: [
          { name: "Phường Vĩnh Trại", groups: ["Tổ 1", "Tổ 2"] }
        ]
      }
    ]
  },
  {
    name: "Lào Cai",
    districts: [
      {
        name: "Thành phố Lào Cai",
        wards: [
          { name: "Phường Kim Tân", groups: ["Tổ 1", "Tổ 2"] }
        ]
      }
    ]
  },
  {
    name: "Yên Bái",
    districts: [
      {
        name: "Thành phố Yên Bái",
        wards: [
          { name: "Phường Đồng Tâm", groups: ["Tổ 1", "Tổ 2"] }
        ]
      }
    ]
  },
  {
    name: "Tuyên Quang",
    districts: [
      {
        name: "Thành phố Tuyên Quang",
        wards: [
          { name: "Phường Tân Quang", groups: ["Tổ 1", "Tổ 2"] }
        ]
      }
    ]
  },
  {
    name: "Thanh Hóa",
    districts: [
      {
        name: "Thành phố Thanh Hóa",
        wards: [
          { name: "Phường Ba Đình", groups: ["Tổ 1", "Tổ 2"] },
          { name: "Phường Đông Thọ", groups: ["Tổ 1", "Tổ 2"] }
        ]
      }
    ]
  },
  {
    name: "Nghệ An",
    districts: [
      {
        name: "Thành phố Vinh",
        wards: [
          { name: "Phường Hưng Dũng", groups: ["Khối 1", "Khối 2"] },
          { name: "Phường Bến Thủy", groups: ["Khối 1", "Khối 2"] }
        ]
      }
    ]
  },
  {
    name: "Hà Tĩnh",
    districts: [
      {
        name: "Thành phố Hà Tĩnh",
        wards: [
          { name: "Phường Bắc Hà", groups: ["Tổ 1", "Tổ 2"] }
        ]
      }
    ]
  },
  {
    name: "Quảng Bình",
    districts: [
      {
        name: "Thành phố Đồng Hới",
        wards: [
          { name: "Phường Đồng Phú", groups: ["Tổ 1", "Tổ 2"] }
        ]
      }
    ]
  },
  {
    name: "Thừa Thiên Huế",
    districts: [
      {
        name: "Thành phố Huế",
        wards: [
          { name: "Phường Vĩnh Ninh", groups: ["Tổ 1", "Tổ 2"] },
          { name: "Phường Phú Hội", groups: ["Tổ 1", "Tổ 2"] }
        ]
      }
    ]
  },
  {
    name: "Quảng Nam",
    districts: [
      {
        name: "Thành phố Tam Kỳ",
        wards: [
          { name: "Phường An Xuân", groups: ["Khối 1", "Khối 2"] }
        ]
      },
      {
        name: "Thành phố Hội An",
        wards: [
          { name: "Phường Minh An", groups: ["Khối 1", "Khối 2"] }
        ]
      }
    ]
  },
  {
    name: "Bình Định",
    districts: [
      {
        name: "Thành phố Quy Nhơn",
        wards: [
          { name: "Phường Lê Lợi", groups: ["Tổ 1", "Tổ 2"] }
        ]
      }
    ]
  },
  {
    name: "Khánh Hòa",
    districts: [
      {
        name: "Thành phố Nha Trang",
        wards: [
          { name: "Phường Lộc Thọ", groups: ["Tổ 1", "Tổ 2"] },
          { name: "Phường Vĩnh Hải", groups: ["Tổ 1", "Tổ 2"] }
        ]
      }
    ]
  },
  {
    name: "Lâm Đồng",
    districts: [
      {
        name: "Thành phố Đà Lạt",
        wards: [
          { name: "Phường 1", groups: ["Tổ 1", "Tổ 2"] },
          { name: "Phường 2", groups: ["Tổ 1", "Tổ 2"] }
        ]
      }
    ]
  },
  {
    name: "Đắk Lắk",
    districts: [
      {
        name: "Thành phố Buôn Ma Thuột",
        wards: [
          { name: "Phường Tân Lợi", groups: ["Tổ 1", "Tổ 2"] }
        ]
      }
    ]
  },
  {
    name: "Đồng Nai",
    districts: [
      {
        name: "Thành phố Biên Hòa",
        wards: [
          { name: "Phường Tân Phong", groups: ["Khu phố 1", "Khu phố 2"] },
          { name: "Phường Quyết Thắng", groups: ["Khu phố 1", "Khu phố 2"] }
        ]
      }
    ]
  },
  {
    name: "Bình Dương",
    districts: [
      {
        name: "Thành phố Thủ Dầu Một",
        wards: [
          { name: "Phường Phú Cường", groups: ["Khu phố 1", "Khu phố 2"] }
        ]
      },
      {
        name: "Thành phố Thuận An",
        wards: [
          { name: "Phường Lái Thiêu", groups: ["Khu phố 1", "Khu phố 2"] }
        ]
      }
    ]
  },
  {
    name: "Bà Rịa - Vũng Tàu",
    districts: [
      {
        name: "Thành phố Vũng Tàu",
        wards: [
          { name: "Phường 1", groups: ["Khu phố 1", "Khu phố 2"] }
        ]
      }
    ]
  },
  {
    name: "Long An",
    districts: [
      {
        name: "Thành phố Tân An",
        wards: [
          { name: "Phường 1", groups: ["Khu phố 1", "Khu phố 2"] }
        ]
      }
    ]
  },
  {
    name: "Tiền Giang",
    districts: [
      {
        name: "Thành phố Mỹ Tho",
        wards: [
          { name: "Phường 1", groups: ["Khu phố 1", "Khu phố 2"] }
        ]
      }
    ]
  }
];

export const getProvinces = () => VIETNAM_LOCATIONS.map(p => p.name);

export const getDistricts = (provinceName) => {
  if (!provinceName) return [];
  const p = VIETNAM_LOCATIONS.find(item => item.name === provinceName);
  return p ? p.districts.map(d => d.name) : [];
};

export const getWards = (provinceName, districtName) => {
  if (!provinceName || !districtName) return [];
  const p = VIETNAM_LOCATIONS.find(item => item.name === provinceName);
  if (!p) return [];
  const d = p.districts.find(item => item.name === districtName);
  return d ? d.wards.map(w => w.name) : [];
};

export const getGroups = (provinceName, districtName, wardName) => {
  if (!provinceName || !districtName || !wardName) return [];
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
  return { province: '', district: '', ward: '', group: '' };
};

export const formatAddressString = (group, ward, district, province) => {
  if (!province || !district || !ward || !group) return '';
  return `${group}, ${ward}, ${district}, ${province}`;
};
