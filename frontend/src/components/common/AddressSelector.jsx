import React, { useState, useEffect } from 'react';
import { VIETNAM_LOCATIONS, getProvinces, getDistricts, getWards, getGroups, parseAddressString, formatAddressString } from '../../services/vietnamLocations';
import { MapPin, Loader2 } from 'lucide-react';

const AddressSelector = ({ value, onChange, required = false, label = "Địa Chỉ Thường Trú" }) => {
  const [province, setProvince] = useState('');
  const [district, setDistrict] = useState('');
  const [ward, setWard] = useState('');
  const [group, setGroup] = useState('');

  const [districtsList, setDistrictsList] = useState([]);
  const [wardsList, setWardsList] = useState([]);
  const [groupsList, setGroupsList] = useState([]);
  const [loading, setLoading] = useState(false);

  // Initialize from value string prop (e.g. when editing existing patient)
  useEffect(() => {
    if (value) {
      const parsed = parseAddressString(value);
      setProvince(parsed.province || '');
      setDistrict(parsed.district || '');
      setWard(parsed.ward || '');
      setGroup(parsed.group || '');
    } else {
      setProvince('');
      setDistrict('');
      setWard('');
      setGroup('');
    }
  }, [value]);

  // Update District list when Province changes
  useEffect(() => {
    if (province) {
      const dists = getDistricts(province);
      setDistrictsList(dists);
      if (!dists.includes(district)) {
        setDistrict('');
        setWard('');
        setGroup('');
      }
    } else {
      setDistrictsList([]);
      setDistrict('');
      setWard('');
      setGroup('');
    }
  }, [province]);

  // Update Ward list when District changes
  useEffect(() => {
    if (province && district) {
      const wrds = getWards(province, district);
      setWardsList(wrds);
      if (!wrds.includes(ward)) {
        setWard('');
        setGroup('');
      }
    } else {
      setWardsList([]);
      setWard('');
      setGroup('');
    }
  }, [district]);

  // Update Group list when Ward changes
  useEffect(() => {
    if (province && district && ward) {
      const grps = getGroups(province, district, ward);
      setGroupsList(grps);
      if (!grps.includes(group)) {
        setGroup('');
      }
    } else {
      setGroupsList([]);
      setGroup('');
    }
  }, [ward]);

  // Trigger onChange with formatted combined string when full 4 levels are selected or reset to empty
  useEffect(() => {
    const formatted = formatAddressString(group, ward, district, province);
    if (onChange && formatted !== value) {
      onChange(formatted);
    }
  }, [province, district, ward, group]);

  const handleProvinceChange = (e) => {
    const val = e.target.value;
    setLoading(true);
    setProvince(val);
    setDistrict('');
    setWard('');
    setGroup('');
    setTimeout(() => setLoading(false), 100);
  };

  const handleDistrictChange = (e) => {
    const val = e.target.value;
    setLoading(true);
    setDistrict(val);
    setWard('');
    setGroup('');
    setTimeout(() => setLoading(false), 100);
  };

  const handleWardChange = (e) => {
    const val = e.target.value;
    setLoading(true);
    setWard(val);
    setGroup('');
    setTimeout(() => setLoading(false), 100);
  };

  const handleGroupChange = (e) => {
    setGroup(e.target.value);
  };

  return (
    <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs font-medium">
      <div className="flex justify-between items-center text-slate-800 font-bold">
        <span className="flex items-center gap-1.5 text-sky-800">
          <MapPin className="w-4 h-4 text-sky-600" />
          {label} {required && <span className="text-rose-500">*</span>}
        </span>
        {loading && (
          <span className="text-[11px] text-sky-600 flex items-center gap-1">
            <Loader2 className="w-3 h-3 animate-spin" /> Đang cập nhật địa giới...
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {/* 1. Tỉnh / Thành phố */}
        <div>
          <label className="block text-slate-600 mb-1 font-semibold">Tỉnh/Thành phố *</label>
          <select
            value={province}
            onChange={handleProvinceChange}
            className="w-full p-2.5 bg-white border border-slate-200 rounded-xl focus:border-sky-500 focus:outline-none font-bold text-slate-800"
            required={required}
          >
            <option value="">[ Chọn tỉnh/thành phố ▼ ]</option>
            {getProvinces().map((p, idx) => (
              <option key={idx} value={p}>{p}</option>
            ))}
          </select>
        </div>

        {/* 2. Quận / Huyện */}
        <div>
          <label className="block text-slate-600 mb-1 font-semibold">Quận/Huyện/Thị xã *</label>
          <select
            value={district}
            onChange={handleDistrictChange}
            disabled={!province}
            className="w-full p-2.5 bg-white border border-slate-200 rounded-xl focus:border-sky-500 focus:outline-none font-bold text-slate-800 disabled:opacity-50 disabled:bg-slate-100 disabled:cursor-not-allowed"
            required={required}
          >
            <option value="">
              {!province ? "[ Vui lòng chọn tỉnh trước ▼ ]" : "[ Chọn quận/huyện/thị xã ▼ ]"}
            </option>
            {districtsList.map((d, idx) => (
              <option key={idx} value={d}>{d}</option>
            ))}
          </select>
        </div>

        {/* 3. Xã / Phường */}
        <div>
          <label className="block text-slate-600 mb-1 font-semibold">Xã/Phường/Thị trấn *</label>
          <select
            value={ward}
            onChange={handleWardChange}
            disabled={!district}
            className="w-full p-2.5 bg-white border border-slate-200 rounded-xl focus:border-sky-500 focus:outline-none font-bold text-slate-800 disabled:opacity-50 disabled:bg-slate-100 disabled:cursor-not-allowed"
            required={required}
          >
            <option value="">
              {!district ? "[ Vui lòng chọn huyện trước ▼ ]" : "[ Chọn xã/phường/thị trấn ▼ ]"}
            </option>
            {wardsList.map((w, idx) => (
              <option key={idx} value={w}>{w}</option>
            ))}
          </select>
        </div>

        {/* 4. Tổ dân phố / Xóm */}
        <div>
          <label className="block text-slate-600 mb-1 font-semibold">Tổ dân phố/Xóm/Thôn *</label>
          <select
            value={group}
            onChange={handleGroupChange}
            disabled={!ward}
            className="w-full p-2.5 bg-white border border-slate-200 rounded-xl focus:border-sky-500 focus:outline-none font-bold text-slate-800 disabled:opacity-50 disabled:bg-slate-100 disabled:cursor-not-allowed"
            required={required}
          >
            <option value="">
              {!ward ? "[ Vui lòng chọn xã/phường trước ▼ ]" : "[ Chọn tổ dân phố/xóm/thôn ▼ ]"}
            </option>
            {groupsList.map((g, idx) => (
              <option key={idx} value={g}>{g}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="pt-2 text-[11px] text-slate-500 flex items-center justify-between border-t border-slate-200/60">
        <span>Địa chỉ đã chọn:</span>
        <strong className="text-sky-800 font-extrabold">
          {formatAddressString(group, ward, district, province) || 'Chưa chọn đầy đủ 4 cấp địa chỉ'}
        </strong>
      </div>
    </div>
  );
};

export default AddressSelector;
