import { Table, Tag, Dropdown, Button } from 'antd';
import { MoreOutlined, EyeOutlined, EditOutlined, RetweetOutlined, DeleteOutlined } from '@ant-design/icons';
import type { TablePaginationConfig } from 'antd/es/table';
import type { MenuProps } from 'antd';
import type { PaginatedResponse } from '../../types/api';
import type { Member } from '../../types/member';

interface MemberTableProps {
  data?: PaginatedResponse<Member>;
  isLoading: boolean;
  page: number;
  size: number;
  onTableChange: (page: number, size: number) => void;
  onAction?: (action: 'detail' | 'edit' | 'toggle_status' | 'delete', record: Member) => void;
}

export const MemberTable = ({
  data,
  isLoading,
  page,
  size,
  onTableChange,
  onAction,
}: MemberTableProps) => {

  const handleTableChange = (pagination: TablePaginationConfig) => {
    onTableChange(pagination.current || 1, pagination.pageSize || 10);
  };

  const columns = [
    {
      title: 'No',
      width: 60,
      render: (_: unknown, __: unknown, index: number) => (page - 1) * size + index + 1,
    },
    {
      title: 'Kode Member',
      dataIndex: 'member_code',
      render: (text: string) => <span className="font-mono bg-slate-100 dark:bg-[#202020] px-2 py-1 rounded">{text}</span>
    },
    {
      title: 'Nama Member',
      dataIndex: 'name',
    },
    {
      title: 'Kontak',
      render: (_: unknown, record: Member) => (
        <div className="flex flex-col text-sm">
          {record.phone && <span>{record.phone}</span>}
          {record.email && <span className="text-slate-500">{record.email}</span>}
        </div>
      ),
    },
    {
      title: 'Total Belanja',
      dataIndex: 'total_spent',
      render: (value: number) => `Rp ${value.toLocaleString('id-ID')}`
    },
    {
      title: 'Status',
      dataIndex: 'active',
      render: (active: boolean) => (
        <Tag color={active ? 'green' : 'red'}>
          {active ? 'Aktif' : 'Nonaktif'}
        </Tag>
      )
    },
    {
      title: 'Aksi',
      width: 80,
      render: (_: unknown, record: Member) => {
        const items: MenuProps['items'] = [
          {
            key: 'detail',
            icon: <EyeOutlined />,
            label: 'Detail',
          },
          {
            key: 'edit',
            icon: <EditOutlined />,
            label: 'Edit',
          },
          {
            key: 'toggle_status',
            icon: <RetweetOutlined />,
            label: 'Ubah Status',
          },
          {
            type: 'divider',
          },
          {
            key: 'delete',
            icon: <DeleteOutlined />,
            danger: true,
            label: 'Hapus',
          },
        ];

        return (
          <Dropdown
            menu={{
              items,
              onClick: ({ key }) => onAction?.(key as any, record)
            }}
            trigger={['click']}
            placement="bottomRight"
          >
            <Button type="text" icon={<MoreOutlined />} />
          </Dropdown>
        );
      },
    },
  ];

  return (
    <Table
      rowKey="id"
      columns={columns}
      dataSource={data?.data || []}
      loading={isLoading}
      onChange={handleTableChange}
      scroll={{ x: 800 }}
      pagination={{
        current: page,
        pageSize: size,
        total: data?.meta?.total || 0,
        showSizeChanger: true,
        showTotal: (total) => `Total ${total} data`,
      }}
    />
  );
};
