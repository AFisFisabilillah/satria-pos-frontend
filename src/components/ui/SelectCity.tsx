import { useEffect, useState } from 'react';
import { Select } from 'antd';
import axios from 'axios';

interface City {
  id: string;
  province_id: string;
  name: string;
}

interface SelectCityProps {
  provinceId?: string;
  value?: string;
  onChange?: (value: string, option?: { label: string; value: string; id: string }) => void;
  placeholder?: string;
  className?: string;
}

export const SelectCity = ({ provinceId, value, onChange, placeholder = 'Pilih Kota/Kabupaten', className }: SelectCityProps) => {
  const [cities, setCities] = useState<City[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Kosongkan list jika provinceId kosong
    if (!provinceId) {
      setCities([]);
      // Hanya reset value jika value saat ini bukan string kosong/undefined, dan memang province kosong
      if (value) {
        onChange?.('');
      }
      return;
    }

    const fetchCities = async () => {
      setIsLoading(true);
      try {
        const { data } = await axios.get<City[]>(`https://www.emsifa.com/api-wilayah-indonesia/api/regencies/${provinceId}.json`);
        setCities(data);
      } catch (error) {
        console.error('Failed to fetch cities', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCities();
  }, [provinceId]);

  const options = cities.map((c) => ({
    label: c.name,
    value: c.name,
    id: c.id,
  }));

  return (
    <Select
      showSearch
      allowClear
      disabled={!provinceId}
      loading={isLoading}
      value={value}
      onChange={(val, opt) => onChange?.(val, opt as any)}
      placeholder={provinceId ? placeholder : 'Pilih Provinsi terlebih dahulu'}
      className={className}
      options={options}
    />
  );
};
