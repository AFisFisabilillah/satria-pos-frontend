import { Typography } from 'antd';

const { Title, Text } = Typography;

export default function AdminPage() {
  return (
    <div className="p-8">
      <Title level={2}>Admin Area</Title>
      <Text>Halaman ini hanya bisa dilihat oleh Super Admin.</Text>
    </div>
  );
}
