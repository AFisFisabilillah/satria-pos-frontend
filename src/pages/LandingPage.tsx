import {
    AppstoreOutlined,
    ArrowRightOutlined,
    AuditOutlined,
    BarChartOutlined,
    CheckCircleOutlined,
    CloudSyncOutlined,
    DashboardOutlined,
    DatabaseOutlined,
    LoginOutlined,
    SafetyCertificateOutlined,
    ShoppingCartOutlined,
    StockOutlined,
    TeamOutlined,
} from "@ant-design/icons";
import {Button, Card, Layout, Space, Statistic, Tag, Typography} from "antd";
import { Link } from "react-router";

const {Header, Content, Footer} = Layout;
const {Title, Paragraph, Text} = Typography;

const metrics = [
    {title: "Transaksi diproses", value: 1280, suffix: "+ / hari"},
    {title: "SKU terpantau", value: 3400, suffix: "+"},
    {title: "Role operasional", value: 3, suffix: " akses"},
];

const features = [
    {
        icon: <ShoppingCartOutlined/>,
        title: "Sales & POS",
        description: "Proses transaksi, pembayaran, dan ringkasan penjualan dari satu alur yang cepat.",
    },
    {
        icon: <DatabaseOutlined/>,
        title: "Inventory control",
        description: "Pantau produk, stok masuk, stok keluar, dan ketersediaan barang secara terpusat.",
    },
    {
        icon: <BarChartOutlined/>,
        title: "Executive reports",
        description: "Baca performa kasir, margin, produk bergerak, dan tren penjualan tanpa rekap manual.",
    },
    {
        icon: <TeamOutlined/>,
        title: "Role based access",
        description: "Akses super admin, kasir, dan admin gudang dipisah sesuai tanggung jawab kerja.",
    },
];

const workflow = [
    "Data produk dan stok dibuat sebagai sumber utama",
    "Kasir memproses penjualan dari dashboard POS",
    "Gudang memantau pergerakan dan ketersediaan stok",
    "Owner membaca performa dari laporan real time",
];

const roleHighlights = [
    {
        icon: <SafetyCertificateOutlined/>,
        role: "Super Admin",
        title: "Kontrol strategis untuk owner dan manajemen",
        items: ["Pantau revenue", "Kelola akses user", "Analisis performa cabang"],
    },
    {
        icon: <ShoppingCartOutlined/>,
        role: "Kasir",
        title: "Transaksi cepat untuk meja penjualan",
        items: ["Input pesanan", "Hitung pembayaran", "Rekap shift harian"],
    },
    {
        icon: <DatabaseOutlined/>,
        role: "Admin Gudang",
        title: "Kontrol stok untuk gudang dan operasional",
        items: ["Kelola produk", "Catat stok masuk", "Pantau ketersediaan"],
    },
];

const modules = [
    {icon: <DashboardOutlined/>, label: "Command dashboard", description: "Ringkasan performa harian"},
    {icon: <ShoppingCartOutlined/>, label: "POS transaction", description: "Penjualan dan pembayaran"},
    {icon: <DatabaseOutlined/>, label: "Inventory ledger", description: "Produk, SKU, dan stok"},
    {icon: <BarChartOutlined/>, label: "Management report", description: "Penjualan dan tren operasional"},
    {icon: <TeamOutlined/>, label: "User access", description: "Hak akses berdasarkan role"},
    {icon: <AuditOutlined/>, label: "Activity audit", description: "Riwayat aktivitas sistem"},
];

const dashboardRows = [
    {name: "Minyak Goreng 1L", stock: "428", status: "Ready"},
    {name: "Beras Premium 5kg", stock: "186", status: "Restock"},
    {name: "Gula Pasir 1kg", stock: "512", status: "Ready"},
];

const footerGroups = [
    {
        title: "Produk",
        links: [
            {label: "Fitur", href: "#fitur"},
            {label: "Solusi", href: "#solusi"},
            {label: "Modul", href: "#modul"},
        ],
    },
    {
        title: "Operasional",
        links: [
            {label: "Alur kerja", href: "#alur"},
            {label: "Keamanan", href: "#keamanan"},
            {label: "Login dashboard", href: "/login"},
        ],
    },
    {
        title: "Kontak",
        links: [
            {label: "SatriaCorp", href: "#"},
            {label: "Point of Sale", href: "#"},
            {label: "Koperasi dan toko", href: "#"},
        ],
    },
];

export  function LandingPage() {
    return (
        <>

            <Layout className="landing-page font-sans">
                <Header className="landing-header flex items-center justify-between">
                    <Link className="landing-brand" to="/" aria-label="SatriaPOS">
                        <img src="/image/logo-satria.png" alt="SatriaPOS"/>
                        <span>Satria<span>POS ERP</span></span>
                    </Link>

                    <nav className="landing-nav items-center" aria-label="Navigasi landing page">
                        <a href="#solusi">Solusi</a>
                        <a href="#fitur">Fitur</a>
                        <a href="#modul">Modul</a>
                        <a href="#alur">Alur</a>
                    </nav>

                    <Link to="/login">
                        <Button type="primary" icon={<LoginOutlined/>} className="landing-header-action shadow-app-sm">
                            Masuk
                        </Button>
                    </Link>
                </Header>

                <Content>
                    <section className="landing-hero">
                        <div className="landing-hero-scene" aria-hidden="true">
                            <div className="landing-dashboard">
                                <div className="landing-dashboard-bar">
                                    <div>
                                        <span/>
                                        <span/>
                                        <span/>
                                    </div>
                                    <strong>ERP Command Center</strong>
                                </div>

                                <div className="landing-dashboard-shell">
                                    <aside className="landing-dashboard-sidebar">
                                        <span className="is-active"><DashboardOutlined/> Overview</span>
                                        <span><ShoppingCartOutlined/> Sales</span>
                                        <span><DatabaseOutlined/> Stock</span>
                                        <span><BarChartOutlined/> Reports</span>
                                    </aside>

                                    <div className="landing-dashboard-main">
                                        <div className="landing-dashboard-summary">
                                            <div className="landing-sale-panel">
                                                <div className="landing-panel-heading">
                                                    <ShoppingCartOutlined/>
                                                    <span>Revenue today</span>
                                                </div>
                                                <strong>Rp 8.420.000</strong>
                                                <div className="landing-progress">
                                                    <span style={{width: "72%"}}/>
                                                </div>
                                            </div>

                                            <div className="landing-stock-panel">
                                                <div className="landing-panel-heading">
                                                    <StockOutlined/>
                                                    <span>Stock health</span>
                                                </div>
                                                <div className="landing-stock-bars">
                                                    <span style={{height: "62%"}}/>
                                                    <span style={{height: "84%"}}/>
                                                    <span style={{height: "48%"}}/>
                                                    <span style={{height: "76%"}}/>
                                                    <span style={{height: "58%"}}/>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="landing-dashboard-table">
                                            <div className="landing-table-head">
                                                <span>Produk</span>
                                                <span>Stok</span>
                                                <span>Status</span>
                                            </div>
                                            {dashboardRows.map((row) => (
                                                <div className="landing-table-row" key={row.name}>
                                                    <span>{row.name}</span>
                                                    <strong>{row.stock}</strong>
                                                    <em>{row.status}</em>
                                                </div>
                                            ))}
                                        </div>

                                        <div className="landing-role-panel">
                                            <div className="landing-role-chip">
                                                <SafetyCertificateOutlined/>
                                                Super Admin
                                            </div>
                                            <div className="landing-role-chip">
                                                <ShoppingCartOutlined/>
                                                Kasir
                                            </div>
                                            <div className="landing-role-chip">
                                                <DatabaseOutlined/>
                                                Gudang
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="landing-container landing-hero-content grid">
                            <div className="landing-hero-copy">
                                <Space size={[10, 10]} wrap>
                                    <Tag color="success" variant="outlined" icon={<CheckCircleOutlined/>}>
                                        ERP retail dan koperasi
                                    </Tag>
                                    <Tag color="processing" variant="outlined" icon={<CloudSyncOutlined/>}>
                                        Operasional terpusat
                                    </Tag>
                                </Space>

                                <Title level={1}>
                                    SatriaPOS ERP untuk operasional yang lebih rapi dan terkendali.
                                </Title>

                                <Paragraph>
                                    Kenalkan sistem ERP yang menyatukan kasir, gudang, laporan,
                                    dan akses tim dalam satu dashboard modern untuk toko, koperasi,
                                    dan unit usaha yang ingin bekerja lebih efisien.
                                </Paragraph>

                                <div className="landing-hero-actions flex flex-wrap">
                                    <Link to="/login">
                                        <Button
                                            type="primary"
                                            size="large"
                                            icon={<LoginOutlined/>}
                                            className="landing-action-button"
                                        >
                                            Masuk dashboard
                                        </Button>
                                    </Link>
                                    <Button
                                        href="#fitur"
                                        size="large"
                                        icon={<ArrowRightOutlined/>}
                                        iconPlacement="end"
                                        className="landing-action-button"
                                    >
                                        Jelajahi ERP
                                    </Button>
                                </div>

                                <div className="landing-hero-checks">
                                    <span><CheckCircleOutlined/> Data operasional terpadu</span>
                                    <span><CheckCircleOutlined/> Role akses aman</span>
                                    <span><CheckCircleOutlined/> Siap dikembangkan multi-cabang</span>
                                </div>
                            </div>

                            <div className="landing-metrics grid">
                                {metrics.map((metric) => (
                                    <Statistic
                                        key={metric.title}
                                        className="landing-statistic"
                                        title={metric.title}
                                        value={metric.value}
                                        suffix={metric.suffix}
                                        styles={{content: {color: "#ffffff"}}}
                                    />
                                ))}
                            </div>
                        </div>
                    </section>

                    <section id="solusi" className="landing-section landing-section-alt">
                        <div className="landing-container">
                            <div className="landing-section-heading">
                                <Tag color="cyan" variant="outlined" icon={<TeamOutlined/>}>
                                    Solusi ERP per role
                                </Tag>
                                <Title level={2}>Setiap tim bekerja dari informasi yang relevan.</Title>
                                <Paragraph>
                                    SatriaPOS ERP memisahkan tanggung jawab operasional agar kasir,
                                    gudang, dan manajemen dapat bergerak cepat tanpa saling bercampur.
                                </Paragraph>
                            </div>

                            <div className="landing-role-grid grid">
                                {roleHighlights.map((role) => (
                                    <Card
                                        key={role.role}
                                        className="landing-role-card"
                                        variant="outlined"
                                        hoverable
                                    >
                                        <div className="landing-role-card-top">
                                            <div className="landing-feature-icon">{role.icon}</div>
                                            <Tag color="orange" variant="outlined">{role.role}</Tag>
                                        </div>
                                        <Title level={3}>{role.title}</Title>
                                        <div className="landing-role-list">
                                            {role.items.map((item) => (
                                                <Text key={item} className="landing-role-list-text">
                                                    <CheckCircleOutlined/>
                                                    {item}
                                                </Text>
                                            ))}
                                        </div>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    </section>

                    <section id="fitur" className="landing-section">
                        <div className="landing-container">
                            <div className="landing-section-heading">
                                <Tag color="orange" variant="outlined" icon={<DashboardOutlined/>}>
                                    Fitur ERP inti
                                </Tag>
                                <Title level={2}>Dibuat untuk alur kerja harian yang butuh data akurat.</Title>
                                <Paragraph>
                                    Modul utama dirancang agar transaksi, stok, akses pengguna,
                                    dan laporan saling tersambung sejak hari pertama digunakan.
                                </Paragraph>
                            </div>

                            <div className="landing-feature-grid grid">
                                {features.map((feature) => (
                                    <Card
                                        key={feature.title}
                                        className="landing-feature-card"
                                        variant="outlined"
                                        hoverable
                                    >
                                        <div className="landing-feature-icon">{feature.icon}</div>
                                        <Title level={3}>{feature.title}</Title>
                                        <Paragraph>{feature.description}</Paragraph>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    </section>

                    <section id="modul" className="landing-section landing-module-section">
                        <div className="landing-container landing-modules">
                            <div className="landing-section-heading is-left">
                                <Tag color="purple" variant="outlined" icon={<AppstoreOutlined/>}>
                                    Modul sistem
                                </Tag>
                                <Title level={2}>Fondasi ERP yang siap berkembang bersama bisnis.</Title>
                                <Paragraph>
                                    Struktur modul dibuat ringkas, namun tetap siap diperluas ke purchasing,
                                    membership, produksi, approval, atau multi-cabang saat bisnis bertumbuh.
                                </Paragraph>
                            </div>

                            <div className="landing-module-grid grid">
                                {modules.map((module) => (
                                    <div className="landing-module-item" key={module.label}>
                                        {module.icon}
                                        <div>
                                            <Text className="landing-module-label">{module.label}</Text>
                                            <Text className="landing-module-description">{module.description}</Text>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    <section id="alur" className="landing-section landing-section-alt">
                        <div className="landing-container landing-workflow grid">
                            <div className="landing-section-heading is-left">
                                <Tag color="cyan" variant="outlined" icon={<CloudSyncOutlined/>}>
                                    Alur operasional
                                </Tag>
                                <Title level={2}>Dari data produk sampai keputusan manajemen.</Title>
                                <Paragraph>
                                    Setiap aktivitas masuk ke alur data yang sama, sehingga laporan
                                    dan keputusan harian tidak lagi bergantung pada catatan terpisah.
                                </Paragraph>
                            </div>

                            <div className="landing-timeline grid">
                                {workflow.map((item, index) => (
                                    <div className="landing-timeline-item" key={item}>
                                        <span>{String(index + 1).padStart(2, "0")}</span>
                                        <Text className="landing-timeline-text">{item}</Text>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    <section id="keamanan" className="landing-section">
                        <div className="landing-container">
                            <Card className="landing-cta" variant="outlined">
                                <div className="landing-cta-inner">
                                    <div>
                                        <Tag color="green" variant="outlined" icon={<SafetyCertificateOutlined/>}>
                                            Role based access
                                        </Tag>
                                        <Title level={2}>Bangun ERP internal dengan akses yang terkontrol.</Title>
                                        <Paragraph>
                                            Pisahkan hak akses super admin, kasir, dan admin gudang agar
                                            pekerjaan harian lebih aman, rapi, dan siap diaudit.
                                        </Paragraph>
                                    </div>

                                    <Link to="/login">
                                        <Button
                                            type="primary"
                                            size="large"
                                            icon={<LoginOutlined/>}
                                            className="landing-action-button"
                                        >
                                            Masuk dashboard
                                        </Button>
                                    </Link>
                                </div>
                            </Card>
                        </div>
                    </section>
                </Content>

                <Footer className="landing-footer">
                    <div className="landing-container landing-footer-grid grid">
                        <div className="landing-footer-brand">
                            <Link className="landing-brand" to="/" aria-label="SatriaPOS">
                                <img src="/image/logo-satria.png" alt="SatriaPOS"/>
                                <span>Satria<span>POS ERP</span></span>
                            </Link>
                            <Paragraph>
                                ERP modern untuk koperasi, toko, dan unit usaha yang butuh
                                transaksi cepat, stok akurat, dan laporan yang mudah dibaca.
                            </Paragraph>
                        </div>

                        {footerGroups.map((group) => (
                            <div className="landing-footer-group" key={group.title}>
                                <strong>{group.title}</strong>
                                {group.links.map((link) => (
                                    <a href={link.href} key={link.label}>{link.label}</a>
                                ))}
                            </div>
                        ))}
                    </div>

                    <div className="landing-container landing-footer-bottom">
                        <Text>SatriaPOS by SatriaCorp</Text>
                        <Text>Designed for ERP operations</Text>
                    </div>
                </Footer>
            </Layout>
        </>
    );
}