import { Button, Checkbox, Form, Input, Typography, App, type FormRule } from 'antd';
import { useLogin } from '../../hooks/useLogin.ts';
import type { LoginRequest } from '../../types/auth';
import type { AxiosError } from 'axios';

const { Title, Text } = Typography;

const validationRules: Record<string, FormRule[]> = {
  email: [
    { required: true, message: 'Email wajib diisi.' },
    { type: 'email', message: 'Format email tidak valid.' },
  ],
  password: [{ required: true, message: 'Password wajib diisi.' }],
};

export default function LoginPage() {
  const { message } = App.useApp();
  const { mutate: login, isPending, error } = useLogin({
    onSuccess: () => {
      message.success('Login berhasil!');
    },
    onError: (err: AxiosError<{ message?: string }>) => {
      message.error(err.response?.data?.message || 'Login gagal.');
    }
  });

  const serverErrors = (error as AxiosError<{ errors?: Record<string, string[]> }>)
    ?.response?.data?.errors;

  const handleSubmit = (values: LoginRequest) => {
    login(values);
  };

  return (
    <main className="login-page bg-slate-50 dark:bg-[#141414] min-h-screen flex flex-col md:flex-row">
      <section className="hidden md:flex flex-col justify-between w-full md:w-[45%] lg:w-1/2 p-5" aria-label="SatriaPOS">
        <div className="w-full h-full bg-[#ff6a00] rounded-3xl p-10 flex flex-col justify-between relative overflow-hidden">

          <div className="w-12 h-12 flex items-center justify-center rounded-2xl bg-white/15 backdrop-blur-sm">
             <img src="/image/logo-satria.png" alt="SatriaPOS Logo" className="w-8 h-8 object-contain" />
          </div>

          <div className="max-w-[320px] relative z-10">
            <p className="text-xs font-semibold tracking-widest uppercase text-white/70 mb-3">SatriaPOS</p>
            <h1 className="text-3xl font-semibold text-white leading-tight mb-3">Point of Sale Koperasi</h1>
            <p className="text-sm text-white/55 leading-relaxed m-0">Transaksi, inventori, dan operasional kasir dalam satu dashboard.</p>
          </div>

          <div className="bg-white/10 rounded-2xl overflow-hidden backdrop-blur-md relative z-10" aria-hidden="true">
            <div className="flex gap-1.5 p-3 px-4 border-b border-white/10">
              <span className="w-2.5 h-2.5 rounded-full bg-white/25" />
              <span className="w-2.5 h-2.5 rounded-full bg-white/25" />
              <span className="w-2.5 h-2.5 rounded-full bg-white/25" />
            </div>
            <div className="p-4 flex flex-col gap-2.5">
              <div className="h-2.5 rounded-md bg-white/25" />
              <div className="h-2.5 rounded-md bg-white/10" />
              <div className="h-2.5 rounded-md bg-white/10 w-[60%]" />
              <div className="flex items-center justify-between mt-1 pt-2.5 border-t border-white/10 text-white/60">
                 <img src="/image/logo-satria.png" alt="SatriaPOS Logo" className="w-4 h-4 object-contain opacity-60" />
                <span className="w-15 h-2.5 rounded-md bg-white/20" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="flex-1 flex items-center justify-center p-8 md:p-10 w-full md:w-[55%] lg:w-1/2" aria-label="Form login">
        <div className="w-full max-w-90">
          {/* Mobile logo */}
          <div className="flex md:hidden items-center gap-2 mb-8 font-semibold text-sm tracking-widest uppercase text-[#ff6a00]">
             <img src="/image/logo-satria.png" alt="SatriaPOS Logo" className="w-5 h-5 object-contain" />
            <span>SatriaPOS</span>
          </div>

          <div className="mb-8">
            <Text className="text-[13px] text-slate-500 dark:text-slate-400 m-0 block mb-1">Selamat datang kembali</Text>
            <Title level={2} className="m-0 text-2xl! font-semibold dark:text-white/90">Masuk ke akun Anda</Title>
          </div>

          <Form<LoginRequest>
            layout="vertical"
            requiredMark={false}
            size="large"
            onFinish={handleSubmit}
            initialValues={{ email: '', password: '', remember_me: false }}
            autoComplete="off"
            className="flex flex-col gap-1"
          >
            <Form.Item
              label={<span className="text-sm font-medium text-slate-700 dark:text-white/85">Email</span>}
              name="email"
              rules={validationRules.email}
              validateStatus={serverErrors?.email ? 'error' : undefined}
              help={serverErrors?.email?.[0]}
              className="mb-4"
            >
              <Input
                placeholder="Contoh: kasir@satriapos.com"
                autoComplete="email"
                inputMode="email"
                className="dark:bg-[#1f1f1f] dark:border-[#424242] dark:text-white/85 px-4 py-2.5 rounded-lg"
              />
            </Form.Item>

            <Form.Item
              label={<span className="text-sm font-medium text-slate-700 dark:text-white/85">Password</span>}
              name="password"
              rules={validationRules.password}
              validateStatus={serverErrors?.password ? 'error' : undefined}
              help={serverErrors?.password?.[0]}
              className="mb-4"
            >
              <Input.Password
                placeholder="Masukkan password Anda"
                autoComplete="current-password"
                className="dark:bg-[#1f1f1f] dark:border-[#424242] dark:text-white/85 px-4 py-2.5 rounded-lg"
              />
            </Form.Item>

            <div className="flex items-center justify-between mb-6">
              <Form.Item
                name="remember_me"
                valuePropName="checked"
                className="mb-0"
              >
                <Checkbox className="text-sm text-slate-600 dark:text-white/70">Ingat saya</Checkbox>
              </Form.Item>
              <a href="#" className="text-sm font-medium text-[#ff6a00] hover:text-[#e55e00] transition-colors">Lupa password?</a>
            </div>

            <Button
              type="primary"
              htmlType="submit"
              loading={isPending}
              block
              className="h-12 rounded-lg text-base font-medium bg-[#ff6a00] hover:bg-[#e55e00] border-none shadow-sm shadow-[#ff6a00]/20"
            >
              Masuk
            </Button>
          </Form>
        </div>
      </section>
    </main>
  );
}
