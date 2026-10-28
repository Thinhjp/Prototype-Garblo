import { useRef, useState, type PointerEvent, type ReactNode } from 'react'

type Tab = 'add' | 'wardrobe' | 'match' | 'impact' | 'community'
type Overlay = 'none' | 'notifications' | 'settings' | 'delete' | 'item' | 'tryon' | 'edit' | 'shareImpact' | 'shareCommunity'

const tabs: { id: Tab; label: string; icon: string }[] = [
  { id: 'add', label: 'Thêm', icon: 'plus' },
  { id: 'wardrobe', label: 'Tủ đồ', icon: 'wardrobe' },
  { id: 'match', label: 'Gu Match', icon: 'sparkle' },
  { id: 'impact', label: 'Tác động', icon: 'chart' },
  { id: 'community', label: 'Cộng đồng', icon: 'people' },
]

function Icon({ name, size = 20 }: { name: string; size?: number }) {
  const paths: Record<string, ReactNode> = {
    plus: <><path d="M12 5v14M5 12h14" /></>,
    wardrobe: <><path d="M5 4h14v16H5zM12 4v16M8 8h1M15 8h1" /></>,
    sparkle: <><path d="m12 3 1.5 4.2L18 9l-4.5 1.8L12 15l-1.5-4.2L6 9l4.5-1.8L12 3Z" /><path d="m18.5 15 .7 2.1 2.3.9-2.3.9-.7 2.1-.8-2.1-2.2-.9 2.2-.9.8-2.1Z" /></>,
    chart: <><path d="M5 20V10M12 20V4M19 20v-7" /></>,
    people: <><circle cx="9" cy="8" r="3" /><circle cx="17" cy="9" r="2.5" /><path d="M3.5 19c.3-4 2-6 5.5-6s5.2 2 5.5 6M14 14c3.6-.6 5.8 1 6.5 4" /></>,
    bell: <><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9ZM10 21h4" /></>,
    flash: <path d="m13 2-8 12h7l-1 8 8-12h-7l1-8Z" />,
    image: <><rect x="3" y="4" width="18" height="16" rx="3" /><circle cx="9" cy="10" r="2" /><path d="m21 15-5-4L5 20" /></>,
    camera: <><path d="M9 5 10.5 3h3L15 5h3a3 3 0 0 1 3 3v9a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3V8a3 3 0 0 1 3-3h3Z" /><circle cx="12" cy="12" r="4" /></>,
    x: <path d="m6 6 12 12M18 6 6 18" />,
    heart: <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.5 1.1-1.1a5.5 5.5 0 0 0-.1-7.8Z" />,
    sliders: <><path d="M4 7h10M18 7h2M4 17h2M10 17h10" /><circle cx="16" cy="7" r="2" /><circle cx="8" cy="17" r="2" /></>,
    shirt: <path d="m8 4-5 3 2 5 3-1v9h8v-9l3 1 2-5-5-3c-1.5 2-6.5 2-8 0Z" />,
    back: <path d="m15 18-6-6 6-6" />,
    share: <><circle cx="18" cy="5" r="2" /><circle cx="6" cy="12" r="2" /><circle cx="18" cy="19" r="2" /><path d="m8 11 8-5M8 13l8 5" /></>,
    bookmark: <path d="M6 3h12v18l-6-4-6 4V3Z" />,
    lock: <><rect x="5" y="10" width="14" height="11" rx="3" /><path d="M8 10V7a4 4 0 0 1 8 0v3" /></>,
    gear: <><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-2.8 2.8-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.6v.2h-4V21a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1L4.2 17l.1-.1a1.7 1.7 0 0 0 .3-1.9A1.7 1.7 0 0 0 3 14H2.8v-4H3a1.7 1.7 0 0 0 1.6-1 1.7 1.7 0 0 0-.3-1.9L4.2 7 7 4.2l.1.1a1.7 1.7 0 0 0 1.9.3A1.7 1.7 0 0 0 10 3V2.8h4V3a1.7 1.7 0 0 0 1 1.6 1.7 1.7 0 0 0 1.9-.3l.1-.1L19.8 7l-.1.1a1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0 1.6 1h.2v4H21a1.7 1.7 0 0 0-1.6 1Z" /></>,
    check: <path d="m5 12 4 4L19 6" />,
    chevron: <path d="m9 18 6-6-6-6" />,
    download: <><path d="M12 3v12m0 0 4-4m-4 4-4-4M5 21h14" /></>,
    link: <><path d="M10 13a5 5 0 0 0 7.5.5l2-2a5 5 0 0 0-7-7l-1.2 1.2" /><path d="M14 11a5 5 0 0 0-7.5-.5l-2 2a5 5 0 0 0 7 7l1.2-1.2" /></>,
    calendar: <><rect x="4" y="6" width="16" height="14" rx="2" /><path d="M4 10h16M8 3v4M16 3v4" /></>,
    'sun-cloud': <><circle cx="8.5" cy="9" r="3.5" /><path d="M8.5 2.5V4M3.8 4.3l1.1 1.1M13.2 4.3l-1.1 1.1M2.5 9H4M3.8 13.7l1.1-1.1" /><path d="M12.5 14.5H16a3.5 3.5 0 0 1 0 7H9.5a4 4 0 0 1-.4-8h1" /></>,
    droplet: <path d="M12 3c3.2 4.2 5.5 7 5.5 10.2a5.5 5.5 0 0 1-11 0C6.5 10 8.8 7.2 12 3Z" />,
    train: <><rect x="5" y="4" width="14" height="12" rx="3" /><path d="M5 11h14M9.5 4 8 1.5M14.5 4 16 1.5M8.5 16l-1.5 4m9.5-4 1.5 4" /><circle cx="9.5" cy="14" r=".7" /><circle cx="14.5" cy="14" r=".7" /></>,
    pin: <><path d="M12 21s-6-5.1-6-10a6 6 0 0 1 12 0c0 4.9-6 10-6 10Z" /><circle cx="12" cy="10.5" r="2.2" /></>,
    signal: <path d="M5 18v-4M10 18V9M15 18V5M20 18V2" />,
    wifi: <path d="M3 9.5a13 13 0 0 1 18 0M6 13a8.5 8.5 0 0 1 12 0M9.5 16.5a4 4 0 0 1 5 0M12 20h.01" />,
    battery: <><rect x="3" y="8" width="17" height="8" rx="2" /><path d="M21 11v2" /><path d="M5 10h9v4H5Z" /></>,
  }
  return <svg className="icon" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>
}

function Logo({ inverse = false }: { inverse?: boolean }) {
  return <div className={`logo ${inverse ? 'inverse' : ''}`}><span>G</span><b>garblo</b></div>
}

function Button({ children, className = '', onClick, disabled = false }: { children: ReactNode; className?: string; onClick?: () => void; disabled?: boolean }) {
  return <button className={`button ${className}`} onClick={onClick} disabled={disabled}>{children}</button>
}

function Header({ dark = false, onBell, title, onBack, gear }: { dark?: boolean; onBell?: () => void; title?: string; onBack?: () => void; gear?: () => void }) {
  return <div className={`header ${dark ? 'header-dark' : ''}`}>
    {onBack ? <Button className="icon-button ghost" onClick={onBack}><Icon name="back" /></Button> : <Logo inverse={dark} />}
    {title && <div className="header-title">{title}</div>}
    <div className="header-actions">
      {!title && <div className="weather">29°</div>}
      {gear ? <Button className="icon-button ghost muted" onClick={gear}><Icon name="gear" /></Button> :
        <Button className="icon-button ghost bell" onClick={onBell}><Icon name="bell" /><i /></Button>}
    </div>
  </div>
}

function BottomNav({ active, onChange, floating = false }: { active: Tab; onChange: (tab: Tab) => void; floating?: boolean }) {
  return <div className={`bottom-nav ${floating ? 'floating-nav' : ''}`}>
    {tabs.map(tab => <Button key={tab.id} className={`nav-item ${active === tab.id ? 'active' : ''}`} onClick={() => onChange(tab.id)}>
      <Icon name={tab.icon} /><span>{tab.label}</span>
    </Button>)}
  </div>
}

function Garment({ type, color = '#6D4AFF', accent = '#C6F432' }: { type: string; color?: string; accent?: string }) {
  return <svg className="garment" viewBox="0 0 180 170" aria-label={`Minh họa ${type}`}>
    <ellipse cx="90" cy="151" rx="53" ry="8" fill="#1B1530" opacity=".08" />
    {type === 'shirt' && <><path d="M59 38 32 51l12 34 16-7v62h60V78l16 7 12-34-27-13c-5 12-18 17-31 17S64 50 59 38Z" fill={color} /><path d="M69 38c2 13 40 13 42 0" fill="none" stroke="#fff" strokeOpacity=".55" strokeWidth="4" /><path d="M65 91h50" stroke={accent} strokeWidth="5" /></>}
    {type === 'pants' && <><path d="M57 28h67l-5 112H92L88 75l-4 65H55Z" fill={color} /><path d="M58 43h64M89 30v43" stroke="#fff" strokeOpacity=".5" strokeWidth="3" /><circle cx="100" cy="36" r="2.5" fill={accent} /></>}
    {type === 'shoe' && <><path d="M32 107c22-4 36-18 45-43l30 14c8 16 19 26 39 31 10 3 12 21 0 25H42c-16 0-24-24-10-27Z" fill={color} /><path d="M56 104c18 8 43 9 71 2M88 76l-11 27m23-21-10 23" stroke="#fff" strokeOpacity=".65" strokeWidth="4" /></>}
    {type === 'bag' && <><rect x="38" y="60" width="104" height="77" rx="18" fill={color} /><path d="M65 63V51c0-15 11-25 25-25s25 10 25 25v12" fill="none" stroke={color} strokeWidth="10" /><circle cx="90" cy="97" r="9" fill={accent} /></>}
    {type === 'hat' && <><path d="M53 96c0-38 15-60 37-60s37 22 37 60" fill={color} /><ellipse cx="90" cy="104" rx="69" ry="18" fill={color} /><path d="M55 86h70" stroke={accent} strokeWidth="8" /></>}
    {type === 'jacket' && <><path d="m65 36-34 24 13 30 15-9-7 60h76l-7-60 15 9 13-30-34-24-21 15Z" fill={color} /><path d="M90 51v90M66 78h13m22 0h13" stroke="#fff" strokeOpacity=".65" strokeWidth="4" /></>}
  </svg>
}

function Mannequin({ look = 0, compact = false, match = false }: { look?: number; compact?: boolean; match?: boolean }) {
  const palettes = [
    ['#DCD5FF', '#2D2450', '#6D4AFF'],
    ['#C6F432', '#553FD0', '#1B1530'],
    ['#FF8DA2', '#F2EAFE', '#2A2350'],
  ][look % 3]
  return <svg className={`mannequin ${compact ? 'compact' : ''} ${match ? 'match-mannequin' : ''}`} viewBox="0 0 260 430" aria-label="Mô hình ảo không khuôn mặt">
    <defs><linearGradient id={`bg${look}`} x1="0" y1="0" x2="1" y2="1"><stop stopColor={palettes[0]} /><stop offset="1" stopColor="#F7F4FF" /></linearGradient></defs>
    {!match && <rect width="260" height="430" fill={`url(#bg${look})`} />}
    <circle cx="130" cy="72" r="34" fill="#CBB99F" />
    <path d="M103 62c7-27 51-29 58 2-13-8-43-8-58-2Z" fill="#1B1530" />
    <path d="M112 101h36l5 35-23 21-23-21Z" fill="#CBB99F" />
    <path d="m82 128 29-15c10 12 29 12 38 0l29 15 22 112-40 10-5-71 3 95H102l3-95-5 71-40-10Z" fill={palettes[2]} />
    <path d="M102 251h56l20 142h-39l-9-89-9 89H82Z" fill={palettes[1]} />
    <path d="M74 387h48v21H63c0-9 3-16 11-21Zm64 0h48c8 5 11 12 11 21h-59Z" fill="#F8F5FF" />
    {!match && <path d="M70 178h120M130 137v112" stroke="#fff" strokeOpacity=".45" strokeWidth="3" />}
    <rect x={match ? 207 : 173} y={match ? 218 : 190} width={match ? 39 : 45} height={match ? 50 : 58} rx="12" fill={look % 2 ? '#FF5C7A' : '#C6F432'} />
    <path d={match ? 'M214 221c0-17 25-17 25 0' : 'M182 194c0-19 27-19 27 0'} fill="none" stroke="#1B1530" strokeWidth="5" />
  </svg>
}

const wardrobe = [
  { name: 'Áo thun trắng', type: 'shirt', color: '#F7F4FF', tag: 'Áo · Cơ bản', rare: '41 ngày chưa mặc', image: '' },
  { name: 'Áo sơ mi tay ngắn', type: 'shirt', color: '#6D4AFF', tag: 'Áo · Hằng ngày', rare: '', image: 'https://images.unsplash.com/photo-1621773881532-fe65715b5137?auto=format&fit=crop&w=700&q=82' },
  { name: 'Áo khoác denim', type: 'jacket', color: '#6279B8', tag: 'Áo · Layering', rare: '', image: '' },
  { name: 'Blazer be', type: 'jacket', color: '#D8CDB8', tag: 'Áo · Thanh lịch', rare: 'ít mặc', image: '' },
  { name: 'Quần jeans', type: 'pants', color: '#6279B8', tag: 'Quần · Hằng ngày', rare: '', image: 'https://images.unsplash.com/photo-1714143136367-7bb68f3f0669?auto=format&fit=crop&w=700&q=82' },
  { name: 'Quần ống rộng', type: 'pants', color: '#26203A', tag: 'Quần · Tối giản', rare: '35 ngày chưa mặc', image: '' },
  { name: 'Chân váy đen', type: 'pants', color: '#1B1530', tag: 'Váy · Thanh lịch', rare: '', image: '' },
  { name: 'Sneaker kem', type: 'shoe', color: '#D8CDB8', tag: 'Giày · Hằng ngày', rare: 'ít mặc', image: 'https://images.unsplash.com/photo-1750929471162-c8b9a7e3613b?auto=format&fit=crop&w=700&q=82' },
  { name: 'Giày da nâu', type: 'shoe', color: '#70452D', tag: 'Giày · Thanh lịch', rare: '', image: 'https://images.unsplash.com/photo-1603191659812-ee978eeeef76?auto=format&fit=crop&w=700&q=82' },
  { name: 'Túi mini', type: 'bag', color: '#FF5C7A', tag: 'Túi · Năng động', rare: '', image: 'https://images.unsplash.com/photo-1605733513597-a8f8341084e6?auto=format&fit=crop&w=700&q=82' },
  { name: 'Túi tote nâu', type: 'bag', color: '#8B6248', tag: 'Túi · Hằng ngày', rare: '28 ngày chưa mặc', image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=700&q=82' },
  { name: 'Mũ bucket', type: 'hat', color: '#C6F432', tag: 'Mũ · Street', rare: '', image: 'https://images.unsplash.com/photo-1789925941317-23b34b25c86f?auto=format&fit=crop&w=700&q=82' },
]

function ProductPhoto({ item }: { item: typeof wardrobe[number] }) {
  return item.image
    ? <img className="product-photo" src={item.image} alt={item.name} />
    : <div className="product-placeholder" aria-label={`Chưa có ảnh cho ${item.name}`}><Icon name="image" size={24} /></div>
}

function Wardrobe({ onItem, onMatch, loading, hasNewItems }: { onItem: () => void; onMatch: () => void; loading: boolean; hasNewItems: boolean }) {
  const [filter, setFilter] = useState('Tất cả')
  const filters = ['Tất cả', 'Áo', 'Quần', 'Giày', 'Túi', 'Mũ']
  const newItems = [
    { name: 'Áo sơ mi mới', type: 'shirt', color: '#6D4AFF', tag: 'Áo · Street', rare: '', image: '' },
    { name: 'Quần ống rộng mới', type: 'pants', color: '#26203A', tag: 'Quần · Tối giản', rare: '', image: '' },
    { name: 'Giày mới', type: 'shoe', color: '#D8CDB8', tag: 'Giày · Hằng ngày', rare: '', image: '' },
  ]
  const visibleItems = hasNewItems ? [...newItems, ...wardrobe] : wardrobe
  return <div className="screen-content">
    <div className="title-row"><div><div className="eyebrow">BỘ SƯU TẬP CỦA BẠN</div><div className="page-title">Tủ đồ <span>12 món</span></div></div><div className="mini-avatar">Y</div></div>
    {loading && <div className="saving"><span className="loader" /><div><b>Đang lưu vào tủ đồ...</b><small>AI đang tách từng món</small></div></div>}
    <div className="chip-row">{filters.map(f => <Button key={f} className={`chip ${filter === f ? 'selected' : ''}`} onClick={() => setFilter(f)}>{f}</Button>)}</div>
    <div className="wardrobe-grid">
      {visibleItems.map((item, i) => <Button key={item.name} className={`wardrobe-card ${loading && i < 3 ? 'skeleton-card' : ''}`} onClick={onItem}>
        <div className="garment-box"><ProductPhoto item={item} /></div>
        <div className="item-copy"><b>{item.name}</b><small>{item.tag}</small>{item.rare && <span className="rare">{item.rare}</span>}</div>
      </Button>)}
    </div>
    <Button className="fab primary" onClick={onMatch}><Icon name="sparkle" /> Phối look mới</Button>
  </div>
}

function AddUpload({ onAnalyze }: { onAnalyze: () => void }) {
  const photoTypes = [
    { type: 'shirt', color: '#6D4AFF' },
    { type: 'pants', color: '#242038' },
    { type: 'shoe', color: '#E5D9C8' },
  ]
  const [photos, setPhotos] = useState<number[]>([])
  const [agreed, setAgreed] = useState(false)
  const removePhoto = (index: number) => setPhotos(current => current.filter(photo => photo !== index))
  return <div className="screen-content add-upload">
    <div className="eyebrow">STUDIO / 01</div>
    <div className="page-title">Thêm ảnh</div>
    <p className="upload-subtitle">Áo quần, dáng chụp hay phông nền — cứ để lẫn.</p>
    <div className={`upload-box ${photos.length ? 'has-photos' : ''}`} onClick={() => setPhotos([0, 1, 2])}>
      {photos.length === 0 ? <>
        <div className="upload-plus"><Icon name="plus" size={24} /></div>
        <b>Chạm để thêm ảnh</b>
        <small>JPG, PNG · tối đa 10 ảnh/lượt</small>
      </> : <>
        <div className="upload-count">{photos.length} ảnh đã chọn</div>
        <div className="upload-thumbnails">
          {photos.map(i => <div className="upload-thumbnail" key={photoTypes[i].type} onClick={event => event.stopPropagation()}>
            <Garment type={photoTypes[i].type} color={photoTypes[i].color} />
            <Button className="remove-photo" onClick={() => removePhoto(i)}><Icon name="x" size={13} /></Button>
          </div>)}
        </div>
      </>}
    </div>
    <div className="upload-privacy">
      <div className="upload-privacy-head"><div className="privacy-icon"><Icon name="lock" size={20} /></div><div><b>Quyền riêng tư trước tiên</b><p>Chúng tôi sẽ xóa EXIF/GPS và làm mờ người khác trong ảnh</p></div></div>
      <label className="consent-check"><input type="checkbox" checked={agreed} onChange={e => setAgreed(e.target.checked)} /><span><Icon name="check" size={15} /></span>Tôi đồng ý xử lý ảnh của mình, gồm ảnh cơ thể nếu có</label>
      <div className="privacy-note">Bạn có thể xóa dữ liệu bất cứ lúc nào trong Cài đặt (chuông thông báo &gt; bánh răng)</div>
    </div>
    <Button className="primary wide analyze-button" disabled={!agreed || photos.length === 0} onClick={onAnalyze}>Phân tích với AI <Icon name="chevron" /></Button>
  </div>
}

function CaptureSheet({ onOk, onRetake }: { onOk: () => void; onRetake: () => void }) {
  return <div className="overlay shade"><div className="sheet capture-sheet">
    <div className="sheet-handle" /><div className="sheet-title">Phân tích gì từ ảnh này?</div>
    <div className="sheet-thumbnails">{[['shirt', '#6D4AFF'], ['pants', '#242038'], ['shoe', '#E5D9C8']].map(photo => <div key={photo[0]}><Garment type={photo[0]} color={photo[1]} /></div>)}</div>
    {['Phân tích outfit', 'Phân tích pose (tư thế)', 'Phân tích nền (background)'].map((x, i) => <label className="check-row" key={x}><span><b>{x}</b><small>{i === 0 ? 'Tách quần áo và đọc thuộc tính' : 'Chỉ dùng khi có người trong ảnh'}</small></span><input type="checkbox" defaultChecked={i === 0} /><i><Icon name="check" size={15} /></i></label>)}
    <div className="two-buttons"><Button className="secondary" onClick={onRetake}>Chọn lại ảnh</Button><Button className="primary" onClick={onOk}>OK</Button></div>
  </div></div>
}

function ContextCollection({ onBack, onViewOutfits }: { onBack: () => void; onViewOutfits: () => void }) {
  const weatherRows = [
    ['10:00', 'Nhiều mây', '17°'],
    ['13:00', 'Mưa', '80%'],
    ['16:00', 'Có mây', '16°'],
  ] as const
  return <div className="context-screen">
    <div className="ctx-status-bar"><span>07:30</span><div className="ctx-status-icons"><Icon name="signal" size={13} /><Icon name="wifi" size={13} /><Icon name="battery" size={13} /></div></div>
    <div className="ctx-header">
      <Button className="ctx-icon-btn" onClick={onBack}><Icon name="back" /></Button>
      <Logo />
      <Button className="ctx-icon-btn"><Icon name="sparkle" /></Button>
    </div>
    <div className="ctx-body">
      <div className="ctx-ai">
        <div className="ctx-ai-avatar"><Icon name="sparkle" size={17} /></div>
        <div className="ctx-bubble">Mình đang thu thập thông tin để gợi ý outfit phù hợp nhất cho bạn...</div>
      </div>
      <div className="ctx-section">
        <h2>Đã phân tích ngữ cảnh của bạn</h2>
        <p>Dựa trên lịch trình, thời tiết, vị trí và thói quen di chuyển</p>
        <div className="ctx-cards">
          <div className="ctx-card ctx-event">
            <div className="ctx-card-head"><span className="ctx-card-icon"><Icon name="calendar" size={16} /></span><b>Sự kiện hôm nay</b></div>
            <div className="ctx-card-main"><strong>Hackathon Pitching Day</strong><span>09:00 – 18:00</span><span className="ctx-loc"><Icon name="pin" size={12} /> Tokyo, Nhật Bản</span></div>
          </div>
          <div className="ctx-card ctx-weather">
            <div className="ctx-card-head"><span className="ctx-card-icon"><Icon name="sun-cloud" size={16} /></span><b>Thời tiết</b></div>
            <div className="ctx-card-main"><strong>16 – 19°C</strong><span>Nhiều mây, có lúc hửng nắng</span>
              <div className="ctx-weather-list">{weatherRows.map(row => <div className="ctx-weather-row" key={row[0]}><b>{row[0]}</b><span>{row[1]}</span><i>{row[2]}</i></div>)}</div>
            </div>
          </div>
          <div className="ctx-card ctx-rain">
            <div className="ctx-card-head"><span className="ctx-card-icon"><Icon name="droplet" size={16} /></span><b>Khả năng mưa</b></div>
            <div className="ctx-card-main ctx-rain-main"><strong>80%</strong><span>vào khoảng 13:00</span></div>
          </div>
          <div className="ctx-card ctx-commute">
            <div className="ctx-card-head"><span className="ctx-card-icon"><Icon name="train" size={16} /></span><b>Di chuyển</b></div>
            <div className="ctx-card-main"><strong>Đi bộ kết hợp tàu điện</strong><span>Dự kiến di chuyển giữa các ga và đi bộ đến địa điểm sự kiện</span></div>
          </div>
          <div className="ctx-card ctx-style">
            <div className="ctx-card-head"><span className="ctx-card-icon"><Icon name="shirt" size={16} /></span><b>Phong cách ưu tiên</b></div>
            <div className="ctx-card-main"><strong>Formal, thanh lịch, thoải mái</strong><span>Phù hợp cho pitching và networking</span></div>
          </div>
        </div>
      </div>
      <div className="ctx-ready">
        <div className="ctx-ready-icon"><Icon name="sparkle" size={19} /></div>
        <h3>Đã sẵn sàng gợi ý outfit!</h3>
        <p>Dựa trên các thông tin trên và tủ đồ hiện có của bạn, mình đã chuẩn bị 3 outfit phù hợp nhất.</p>
        <Button className="ctx-cta" onClick={onViewOutfits}>Xem 3 outfit gợi ý <Icon name="chevron" size={15} /></Button>
      </div>
    </div>
  </div>
}

const outfitPhotos: Record<string, string[]> = {
  'Đi làm': [
    'photo-1699787167971-db840f61c3bd', 'photo-1590903098127-feab9d795179', 'photo-1732464517792-7385024242a6', 'photo-1674577430325-fe53f7e86bf5',
    'photo-1674577430315-2fca5f880360', 'photo-1690149070676-941d906ff186', 'photo-1684283377169-e3dcfec7790c', 'photo-1589351189946-b8eb5e170ba6',
  ],
  'Cà phê': [
    'photo-1708721743801-9a058148a72c', 'photo-1708721922700-37a0e87e4008', 'photo-1654536147243-24371d475f26', 'photo-1654536142905-0c6d5fdd1e82',
    'photo-1593378086017-1cc8341f3750', 'photo-1731965333436-75b67d2f142f', 'photo-1635229873829-2a279025ace4', 'photo-1677126748891-e5f59cfc992d',
  ],
  'Mưa chiều': [
    'photo-1559024935-2e352efdad61', 'photo-1516368694098-47836cebec97', 'photo-1630930195151-3b8434d19cd3', 'photo-1575478004055-999ebe26dab7',
    'photo-1522359767-31c3980dde91', 'photo-1605035015406-54c130d0bf89', 'photo-1498946765439-9c2480c63e19', 'photo-1669761725041-4a9384c5d564',
  ],
  'Hẹn hò': [
    'photo-1788392820077-bdcf700ef344', 'photo-1770130786706-d4c8485c44f6', 'photo-1766038803021-88d7cccfa5a1', 'photo-1762337677797-25fcf603f8f8',
    'photo-1787170765175-379085231241', 'photo-1762337672175-8f547b5e0497', 'photo-1767396858424-7d73abdcc169', 'photo-1760003565666-e46f8f1e3b1e',
  ],
  'Đi chơi cuối tuần': [
    'photo-1624353656309-8be1a6c457be', 'photo-1534404483017-8743b4e935cd', 'photo-1589351189946-b8eb5e170ba6', 'photo-1684283377169-e3dcfec7790c',
    'photo-1547069553-12f23c839aaa', 'photo-1691932113900-281771ab8879', 'photo-1690149070676-941d906ff186', 'photo-1590807334595-c17923405323',
  ],
}

function MatchCards({ context, onEdit, onTry, onContext, onBell }: { context: string; onEdit: () => void; onTry: () => void; onContext: () => void; onBell: () => void }) {
  const [look, setLook] = useState(2)
  const [toast, setToast] = useState(false)
  const [dragX, setDragX] = useState(0)
  const [transitioning, setTransitioning] = useState(false)
  const [animating, setAnimating] = useState(false)
  const dragStart = useRef<number | null>(null)
  const dragDistance = useRef(0)
  const dragDirection = dragX === 0 ? 1 : Math.sign(dragX)
  const nextOffset = dragDirection * -Math.max(0, 100 - Math.min(Math.abs(dragX) / 3.9, 100))

  const dismiss = (liked: boolean) => {
    if (animating) return
    const direction = liked ? 1 : -1
    setAnimating(true)
    setTransitioning(true)
    setDragX(direction * 480)
    if (liked) {
      setToast(true)
      window.setTimeout(() => setToast(false), 900)
    }
    window.setTimeout(() => {
      setLook(current => (current + 1) % 8)
      setTransitioning(false)
      setDragX(0)
      setAnimating(false)
    }, 320)
  }

  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (animating || (event.target as HTMLElement).closest('button')) return
    dragStart.current = event.clientX
    event.currentTarget.setPointerCapture(event.pointerId)
    setTransitioning(false)
  }

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (dragStart.current === null || animating) return
    dragDistance.current = event.clientX - dragStart.current
    setDragX(dragDistance.current)
  }

  const finishDrag = (event: PointerEvent<HTMLDivElement>) => {
    if (dragStart.current === null || animating) return
    event.currentTarget.releasePointerCapture(event.pointerId)
    dragStart.current = null
    if (Math.abs(dragDistance.current) >= 70) dismiss(dragDistance.current > 0)
    else {
      setTransitioning(true)
      setDragX(0)
      window.setTimeout(() => setTransitioning(false), 260)
    }
    dragDistance.current = 0
  }

  const renderCard = (cardLook: number, current = false) => <div
    className={`swipe-card ${transitioning ? 'transitioning' : ''} ${current ? 'current-card' : 'next-card'}`}
    style={{ transform: current ? `translateX(${dragX}px) rotate(${dragX / 45}deg)` : `translateX(${nextOffset}%)` }}
  >
    <div className="match-scene"><img className="outfit-photo" src={`https://images.unsplash.com/${outfitPhotos[context][cardLook]}?auto=format&fit=crop&w=900&q=84`} alt={`Ảnh minh họa outfit ${cardLook + 1} trong bối cảnh ${context}`} /></div>
    <div className="look-gradient" />
    <div className="look-copy"><div className="model-label">ẢNH MINH HỌA</div><div className="look-title">Violet in the rain</div><div className="score-line"><span>Độ hợp 82%</span><b>Dùng áo đã 41 ngày chưa mặc</b></div></div>
  </div>

  return <div className="match-card-screen">
    <div className="swipe-deck" onPointerDown={handlePointerDown} onPointerMove={handlePointerMove} onPointerUp={finishDrag} onPointerCancel={finishDrag}>
      {renderCard((look + 1) % 8)}
      {renderCard(look, true)}
    </div>
    <div className="match-header"><Logo inverse /><div className="match-header-actions"><div className="weather">29°</div><Button className="icon-button bell" onClick={onBell}><Icon name="bell" /><i /></Button></div></div>
    <div className="match-top"><span>{look + 1}/8 bộ hôm nay</span><Button className="glass-link" onClick={onContext}>Đổi bối cảnh</Button></div>
    {toast && <div className="saved-toast"><Icon name="check" size={16} /> Đã lưu</div>}
    <div className="action-stack">
      <Button className="action-item" onClick={() => dismiss(false)}><span className="round-action reject"><Icon name="x" /></span><small>Bỏ</small></Button>
      <Button className="action-item" onClick={() => dismiss(true)}><span className="round-action love"><Icon name="heart" /></span><small>Thích</small></Button>
      <Button className="action-item" onClick={onEdit}><span className="round-action adjust"><Icon name="sliders" /></span><small>Chỉnh</small></Button>
      <Button className="action-item" onClick={onTry}><span className="round-action try"><Icon name="shirt" /></span><small>Thử đồ ảo</small></Button>
    </div>
  </div>
}

function Impact({ onShare }: { onShare: () => void }) {
  return <div className="screen-content impact">
    <div className="eyebrow">DẤU ẤN CỦA BẠN</div><div className="page-title">Tác động</div>
    <div className="impact-hero"><div className="impact-ring"><div><b>24</b><span>look mới</span></div></div><div><div className="impact-spark">TỦ ĐỒ, NHƯNG MỚI MẺ</div><b>Từ chính quần áo<br />bạn đã có</b><small>Tháng này</small></div></div>
    <div className="stats-row"><div className="green-card"><b>68%</b><span>tỷ lệ mặc lại</span></div><div className="green-card"><b>-2.1</b><span>mua mới giảm*</span></div></div>
    <div className="footnote">*kỳ vọng, đo ở pilot</div>
    <div className="card chart-card"><div className="card-head"><b>Nhịp mặc lại</b><span>4 TUẦN</span></div><div className="bars">{[48, 69, 57, 90].map((h, i) => <div key={i}><i style={{ height: `${h}%` }} /><span>T{i + 1}</span></div>)}</div></div>
    <div className="card level-card"><div className="mascot"><Hanger /></div><div className="level-copy"><div className="eyebrow">CẤP ĐỘ HIỆN TẠI</div><b>Cấp 3 · Tín đồ mặc lại</b><div className="progress"><i /></div><small>340/500 điểm</small></div></div>
    <div className="streak">5 <span>ngày liên tiếp mặc lại đồ có sẵn</span></div>
    <div className="badge-row">{['Look đầu tiên', '10 look mới', 'Chuỗi 7 ngày', 'Cứu món 30 ngày'].map((x, i) => <div className={i > 1 ? 'locked' : ''} key={x}><i>{i > 1 ? <Icon name="lock" size={15} /> : i + 1}</i><span>{x}</span></div>)}</div>
    <div className="mission"><div><span>NHIỆM VỤ TUẦN</span><b>mặc lại 3 món chưa mặc 30 ngày</b><small>Thêm nhiệm vụ sắp có</small></div><strong>1/3</strong></div>
    <Button className="share-impact wide" onClick={onShare}><Icon name="share" /> Khoe thành tích</Button>
  </div>
}

function Hanger() {
  return <svg viewBox="0 0 100 100" aria-label="Linh vật móc áo"><path d="M46 23c0-12 17-12 17 0 0 7-9 8-9 15" fill="none" stroke="currentColor" strokeWidth="6" strokeLinecap="round" /><path d="m52 37-37 36c-4 4-1 10 5 10h64c6 0 9-6 5-10L52 37Z" fill="#C6F432" stroke="currentColor" strokeWidth="5" strokeLinejoin="round" /><circle cx="40" cy="66" r="3" fill="currentColor" /><circle cx="64" cy="66" r="3" fill="currentColor" /><path d="M45 74c5 4 10 4 15 0" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" /></svg>
}

function Community({ onShare }: { onShare: () => void }) {
  const cards = [
    { type: 'look', author: 'Mai Anh', title: 'Một chút violet cho ngày mưa', height: 'tall', look: 1 },
    { type: 'achievement', author: 'Gia Linh', title: '10 look mới', height: 'medium' },
    { type: 'thought', author: 'Minh', title: 'Mặc lại không nhàm. Chỉ là mình chưa thử phối khác đi.', height: 'short' },
    { type: 'look', author: 'An Nhi', title: 'Cà phê sáng, đồ cũ mood mới', height: 'tall', look: 2 },
  ]
  return <div className="screen-content community">
    <div className="eyebrow">CẢM HỨNG TỪ CỘNG ĐỒNG</div><div className="page-title">Cộng đồng</div>
    <div className="chip-row">{['Dành cho bạn', 'Đang theo dõi', 'Lookbook', 'Thành tích'].map((x, i) => <Button key={x} className={`chip ${i === 0 ? 'selected' : ''}`}>{x}</Button>)}</div>
    <div className="masonry">{cards.map((c, i) => <div className={`social-card ${c.type} ${c.height}`} key={c.title}>
      {c.type === 'look' && <><div className="ai-label">ẢNH DO AI TẠO</div><Mannequin look={c.look} compact /></>}
      {c.type === 'achievement' && <div className="achievement-art"><Hanger /><b>10</b><span>LOOK MỚI</span></div>}
      {c.type === 'thought' && <div className="quote-mark">“</div>}
      <div className="social-copy"><b>{c.title}</b><div className="social-meta"><span className="avatar">{c.author.slice(0, 1)}</span><small>{c.author}</small><span className="social-spacer" /><Icon name="heart" size={15} /><small>{42 + i * 9}</small><Icon name="bookmark" size={15} /></div></div>
    </div>)}</div>
    <Button className="fab share-fab" onClick={onShare}><Icon name="plus" /> Chia sẻ</Button>
  </div>
}

function ItemDetail({ onClose }: { onClose: () => void }) {
  const [tags, setTags] = useState(['Áo sơ mi', 'Violet', 'Cotton', 'Street'])
  const alternatives = ['Áo khoác', 'Tím đậm', 'Linen', 'Tối giản']
  const updateTag = (index: number) => setTags(current => current.map((value, i) => i === index ? (value === alternatives[index] ? ['Áo sơ mi', 'Violet', 'Cotton', 'Street'][index] : alternatives[index]) : value))
  return <div className="full-overlay white">
    <Header title="AI đọc ảnh" onBack={onClose} />
    <div className="overlay-content">
      <div className="source-strip"><div><Garment type="shirt" color="#6D4AFF" /></div><div><span>ẢNH GỐC</span><b>Từ 1 ảnh, AI tách được 3 món</b><small>Kiểm tra và sửa trước khi lưu</small></div></div>
      <div className="detected-card"><div className="detected-image"><Garment type="shirt" color="#6D4AFF" /></div><div className="detected-head"><div><span>MÓN 1/3</span><b>Áo sơ mi violet</b></div><i>tin cậy 94%</i></div>
        <div className="tag-grid">{['Loại', 'Màu', 'Chất liệu', 'Phong cách'].map((label, i) => <Button key={label} onClick={() => updateTag(i)}><span>{label}</span><b>{tags[i]}</b><Icon name="chevron" size={15} /></Button>)}</div>
      </div>
      <div className="small-detected"><Garment type="pants" color="#26203A" /><div><span>MÓN 2/3 · tin cậy 91%</span><b>Quần ống rộng</b></div><Icon name="chevron" /></div>
      <div className="small-detected"><Garment type="shoe" color="#D8CDB8" /><div><span>MÓN 3/3 · tin cậy 88%</span><b>Sneaker kem</b></div><Icon name="chevron" /></div>
    </div>
    <div className="sticky-action"><Button className="primary wide" onClick={onClose}>Lưu 3 món vào tủ</Button></div>
  </div>
}

function EditLook({ onClose }: { onClose: () => void }) {
  const [after, setAfter] = useState(true)
  return <div className="overlay shade"><div className="sheet edit-sheet"><div className="sheet-handle" /><div className="sheet-title">Chỉnh một món</div><p>Đổi từ đồ bạn đã có · điểm hợp cập nhật trực tiếp.</p>
    <div className="before-toggle"><Button className={!after ? 'active' : ''} onClick={() => setAfter(false)}>Trước</Button><Button className={after ? 'active' : ''} onClick={() => setAfter(true)}>Sau · 89%</Button></div>
    <div className="swap-preview"><div><Mannequin look={after ? 1 : 0} compact /></div><div className="live-score"><span>ĐỘ HỢP</span><b>{after ? '89%' : '82%'}</b><small>+7% sau khi đổi</small></div></div>
    <div className="component-tabs">{['Áo', 'Quần', 'Giày', 'Túi', 'Mũ'].map((x, i) => <Button className={i === 0 ? 'active' : ''} key={x}>{x}</Button>)}</div>
    <div className="swap-items">{wardrobe.slice(0, 3).map((x, i) => <Button className={after && i === 1 ? 'selected' : ''} key={x.name} onClick={() => setAfter(true)}><ProductPhoto item={x} /><span>{x.name}</span></Button>)}</div>
    <Button className="primary wide" onClick={onClose}>Áp dụng thay đổi</Button>
  </div></div>
}

function TryOn({ onClose }: { onClose: () => void }) {
  const [mine, setMine] = useState(false)
  const [consented, setConsented] = useState(false)
  return <div className="full-overlay white"><Header title="Thử đồ ảo" onBack={onClose} />
    <div className="overlay-content tryon-content">
      <div className="choice-label">CHỌN NGƯỜI MẪU</div><div className="try-choices"><Button className={!mine ? 'selected' : ''} onClick={() => setMine(false)}><div className="model-dot" /><b>Dùng mô hình ảo</b><small>Mặc định · không cần ảnh</small></Button><Button className={mine ? 'selected' : ''} onClick={() => setMine(true)}><Icon name="image" /><b>Dùng ảnh của tôi</b><small>Tùy chọn</small></Button></div>
      {mine && !consented ? <div className="photo-consent"><div className="privacy-icon"><Icon name="lock" /></div><b>Ảnh là của chính tôi</b><p>EXIF/GPS được xóa trước khi bất kỳ dữ liệu nào được xử lý.</p><label className="consent-check"><input type="checkbox" onChange={e => setConsented(e.target.checked)} /><span><Icon name="check" size={15} /></span>Tôi xác nhận và đồng ý</label></div> :
      <><div className="try-result"><Mannequin look={1} /><span>ẢNH DO AI TẠO</span></div><div className="critic-card"><div className="critic-head"><div><span>AI CRITIC</span><b>Kiểm tra chất lượng</b></div><strong>Cmax = 5</strong></div>{['Đủ món', 'Màu sắc đúng nguồn', 'Layering hợp lý', 'Không méo cơ thể', 'Giữ nguyên phần không sửa'].map((x, i) => <div className="critic-row" key={x}><i className={i === 3 ? 'rerender' : ''}>{i === 3 ? '↻' : <Icon name="check" size={13} />}</i><span>{x}</span><small>{i === 3 ? 'Auto re-render' : 'Đạt'}</small></div>)}<div className="confidence-question">Chưa chắc phần tay áo. Bạn muốn giữ bản này hay render lại?</div></div></>}
    </div>
  </div>
}

function ShareImpact({ onClose }: { onClose: () => void }) {
  const [show, setShow] = useState(false)
  return <div className="full-overlay lilac"><Header title="Khoe thành tích" onBack={onClose} /><div className="overlay-content share-story-wrap">
    <div className="story-card"><Logo inverse /><div className="story-mascot"><Hanger /></div><span>CẤP 3 · TÍN ĐỒ MẶC LẠI</span><b>Đồ cũ.<br />Gu mới.</b><div className="story-stats"><div><strong>24</strong><small>look mới</small></div><div><strong>68%</strong><small>tỷ lệ mặc lại</small></div></div><div className="story-badges"><i>1</i><i>10</i><span>2 HUY HIỆU</span></div>{show && <div className="favorite-outfit"><Mannequin look={1} compact /></div>}</div>
    <label className="switch-row"><div><b>Hiện outfit yêu thích</b><small>Chỉ chia sẻ khi bạn bấm</small></div><input type="checkbox" checked={show} onChange={e => setShow(e.target.checked)} /><i /></label>
    <div className="share-actions"><Button><Icon name="download" /><span>Lưu ảnh</span></Button><Button className="primary"><Icon name="share" /><span>Chia sẻ</span></Button><Button><Icon name="link" /><span>Sao chép liên kết</span></Button></div>
  </div></div>
}

function ShareCommunity({ onClose }: { onClose: () => void }) {
  const [kind, setKind] = useState('Lookbook của tôi')
  const [visibility, setVisibility] = useState('Chỉ mình tôi')
  return <div className="overlay shade"><div className="sheet community-sheet"><div className="sheet-handle" /><div className="sheet-title">Bạn muốn chia sẻ gì?</div>
    <div className="share-types">{['Lookbook của tôi', 'Thành tích', 'Cảm nghĩ'].map((x, i) => <Button className={kind === x ? 'selected' : ''} key={x} onClick={() => setKind(x)}><Icon name={i === 0 ? 'sparkle' : i === 1 ? 'chart' : 'people'} /><span>{x}</span><i><Icon name="check" size={14} /></i></Button>)}</div>
    {kind === 'Cảm nghĩ' ? <textarea className="thought-input" placeholder="Bạn đang nghĩ gì về hành trình mặc lại?" /> : <div className="share-preview">{kind === 'Lookbook của tôi' ? <Mannequin look={2} compact /> : <div className="preview-achievement"><Hanger /><b>24 look mới</b></div>}<div><span>XEM TRƯỚC</span><b>{kind}</b></div></div>}
    <div className="visibility"><span>Hiển thị</span><div><Button className={visibility === 'Chỉ mình tôi' ? 'active' : ''} onClick={() => setVisibility('Chỉ mình tôi')}>Chỉ mình tôi</Button><Button className={visibility === 'Bạn bè' ? 'active' : ''} onClick={() => setVisibility('Bạn bè')}>Bạn bè</Button></div></div>
    <p className="post-note">Không có gì được đăng cho đến khi bạn bấm Đăng.</p><Button className="primary wide" onClick={onClose}>Đăng</Button>
  </div></div>
}

function Notifications({ onClose, onGear }: { onClose: () => void; onGear: () => void }) {
  const items = [['M', 'Mai vừa đăng lookbook mới', '2 phút'], ['L', 'Linh đã lưu look của bạn', '1 giờ'], ['G', 'Nhiệm vụ tuần: còn 2 món chưa mặc 30 ngày', '3 giờ'], ['A', 'An đã thích thành tích của bạn', 'Hôm qua']]
  return <div className="full-overlay white"><Header title="Thông báo" onBack={onClose} gear={onGear} /><div className="overlay-content notifications"><div className="group-label">HÔM NAY</div>{items.slice(0, 3).map((x, i) => <div className="notification" key={x[1]}><span className={`avatar n${i}`}>{x[0]}</span><div><b>{x[1]}</b><small>{x[2]}</small></div>{i === 0 && <i />}</div>)}<div className="group-label">TRƯỚC ĐÓ</div><div className="notification"><span className="avatar">A</span><div><b>{items[3][1]}</b><small>{items[3][2]}</small></div></div></div></div>
}

function Settings({ onClose, onDelete }: { onClose: () => void; onDelete: () => void }) {
  return <div className="full-overlay white"><Header title="Cài đặt" onBack={onClose} /><div className="overlay-content settings"><div className="settings-label">QUYỀN DỮ LIỆU</div><div className="settings-card"><Button><span className="setting-icon"><Icon name="share" /></span><div><b>Chia sẻ lookbook</b><small>Chỉ mình tôi</small></div><Icon name="chevron" /></Button><Button className="delete-row" onClick={onDelete}><span className="setting-icon"><Icon name="x" /></span><div><b>Xóa dữ liệu của tôi</b><small>Ảnh, tủ đồ, lookbook và hoạt động</small></div><Icon name="chevron" /></Button></div><div className="settings-label">ỨNG DỤNG</div><div className="settings-card"><Button><span className="setting-icon"><Icon name="bell" /></span><div><b>Thông báo</b><small>Đang bật</small></div><Icon name="chevron" /></Button></div><div className="version">garblo · phiên bản demo 1.0</div></div></div>
}

function DeleteSheet({ onClose }: { onClose: () => void }) {
  const [typed, setTyped] = useState('')
  return <div className="overlay shade"><div className="sheet delete-sheet"><div className="danger-icon"><Icon name="x" /></div><div className="sheet-title">Xóa dữ liệu của bạn?</div><p>Hành động này không thể hoàn tác. Những nội dung sau sẽ bị xóa:</p><ul><li>Ảnh gốc và ảnh AI đã tạo</li><li>12 món trong tủ đồ</li><li>Lookbook, lịch sử và hoạt động</li></ul><label className="delete-input"><span>Nhập <b>XÓA</b> để xác nhận</span><input value={typed} onChange={e => setTyped(e.target.value)} placeholder="XÓA" /></label><div className="two-buttons"><Button className="secondary" onClick={onClose}>Hủy</Button><Button className="danger" disabled={typed !== 'XÓA'} onClick={onClose}>Xóa vĩnh viễn</Button></div></div></div>
}

export default function App() {
  const [tab, setTab] = useState<Tab>('wardrobe')
  const [overlay, setOverlay] = useState<Overlay>('none')
  const [captureSheet, setCaptureSheet] = useState(false)
  const [loading, setLoading] = useState(false)
  const [hasNewItems, setHasNewItems] = useState(false)
  const [matchStage, setMatchStage] = useState<'context' | 'cards'>('context')
  const [matchContext, setMatchContext] = useState('Đi làm')
  const changeTab = (next: Tab) => {
    setOverlay('none')
    setCaptureSheet(false)
    setTab(next)
    if (next === 'match') setMatchStage('context')
  }
  const finishCapture = () => {
    setCaptureSheet(false)
    setTab('wardrobe')
    setHasNewItems(true)
    setLoading(true)
    setTimeout(() => setLoading(false), 1500)
  }
  const closeOverlay = () => setOverlay('none')
  const isMatchCard = tab === 'match' && matchStage === 'cards'
  const isContextScreen = tab === 'match' && matchStage === 'context'
  return <div className={`app-frame ${isMatchCard ? 'match-mode' : ''} ${isContextScreen ? 'context-mode' : ''}`}>
    {!isMatchCard && !isContextScreen && <Header onBell={() => setOverlay('notifications')} />}
    <main>
      {tab === 'add' && <AddUpload onAnalyze={() => setCaptureSheet(true)} />}
      {tab === 'wardrobe' && <Wardrobe loading={loading} hasNewItems={hasNewItems} onItem={() => setOverlay('item')} onMatch={() => { setTab('match'); setMatchStage('context') }} />}
      {tab === 'match' && (matchStage === 'context' ? <ContextCollection onBack={() => setTab('wardrobe')} onViewOutfits={() => setMatchStage('cards')} /> : <MatchCards context={matchContext} onEdit={() => setOverlay('edit')} onTry={() => setOverlay('tryon')} onContext={() => setMatchStage('context')} onBell={() => setOverlay('notifications')} />)}
      {tab === 'impact' && <Impact onShare={() => setOverlay('shareImpact')} />}
      {tab === 'community' && <Community onShare={() => setOverlay('shareCommunity')} />}
    </main>
    <BottomNav active={tab} onChange={changeTab} floating={isMatchCard} />
    {captureSheet && <CaptureSheet onRetake={() => setCaptureSheet(false)} onOk={finishCapture} />}
    {overlay === 'item' && <ItemDetail onClose={closeOverlay} />}
    {overlay === 'edit' && <EditLook onClose={closeOverlay} />}
    {overlay === 'tryon' && <TryOn onClose={closeOverlay} />}
    {overlay === 'shareImpact' && <ShareImpact onClose={closeOverlay} />}
    {overlay === 'shareCommunity' && <ShareCommunity onClose={closeOverlay} />}
    {overlay === 'notifications' && <Notifications onClose={closeOverlay} onGear={() => setOverlay('settings')} />}
    {overlay === 'settings' && <Settings onClose={() => setOverlay('notifications')} onDelete={() => setOverlay('delete')} />}
    {overlay === 'delete' && <DeleteSheet onClose={() => setOverlay('settings')} />}
  </div>
}
