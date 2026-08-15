import { useEffect, useState } from 'react';
import { Select } from 'antd';
import axios from 'axios';

interface Province {
  id: string;
  name: string;
}

interface SelectProvinceProps {
  value?: string;
  onChange?: (value: string, option?: { label: string; value: string; id: string }) => void;
  placeholder?: string;
  className?: string;
}

export const SelectProvince = ({ value, onChange, placeholder = 'Pilih Provinsi', className }: SelectProvinceProps) => {
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchProvinces = async () => {
      setIsLoading(true);
      try {
        const { data } = await axios.get<Province[]>('https://www.emsifa.com/api-wilayah-indonesia/api/provinces.json');
        setProvinces(data);
      } catch (error) {
        console.error('Failed to fetch provinces', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProvinces();
  }, []);

  const options = provinces.map((p) => ({
    label: p.name,
    value: p.name,
    id: p.id,
  }));

  return (
    <Select
      showSearch
      allowClear
      loading={isLoading}
      value={value}
      onChange={(val, opt) => onChange?.(val, opt as any)}
      placeholder={placeholder}
      className={className}
      options={options}
    />
  );
};
