import { useEffect, useRef, useState, type ButtonHTMLAttributes, type ChangeEvent, type PointerEvent, type ReactNode, type RefObject } from 'react'

type Tab = 'add' | 'wardrobe' | 'match' | 'impact' | 'community'
type Overlay = 'none' | 'notifications' | 'settings' | 'delete' | 'item' | 'tryon' | 'edit' | 'shareImpact' | 'shareCommunity'

const categories = ['Áo', 'Quần', 'Váy', 'Giày', 'Túi', 'Mũ'] as const
type Category = typeof categories[number]
type UploadedPhoto = { id: string; file: File; url: string }
type WardrobeItem = {
  id: string; name: string; category: Category; type: string; color: string
  material: string; style: string; tag: string; rare: string; image: string
  sourcePhotoId?: string; batchId?: string; demo: boolean
}
type AnalysisDraft = { id: string; photos: UploadedPhoto[]; items: WardrobeItem[] }
type MatchContext = {
  id: string; label: string; event: string; time: string; location: string
  temperature: string; weather: string; rain: string; commute: string; style: string
}
type Outfit = { id: string; name: string; image: string; itemIds: string[]; number: number }
type MatchSession = {
  id: string; context: MatchContext; outfits: Outfit[]; items: WardrobeItem[]
  index: number; decisions: Record<string, 'like' | 'dislike'>; selectedOutfitId: string | null
}
type AnalysisStatus = 'idle' | 'loading' | 'error'
const categoryTypes: Record<Category, string> = { Áo: 'shirt', Quần: 'pants', Váy: 'pants', Giày: 'shoe', Túi: 'bag', Mũ: 'hat' }
const contextPresets: MatchContext[] = [
  { id: 'work', label: 'Đi làm', event: 'Hackathon Pitching Day', time: '09:00 – 18:00', location: 'Tokyo, Nhật Bản', temperature: '16 – 19°C', weather: 'Nhiều mây, có lúc hửng nắng', rain: '80%', commute: 'Đi bộ kết hợp tàu điện', style: 'Thanh lịch, thoải mái' },
  { id: 'coffee', label: 'Cà phê', event: 'Cà phê cùng bạn', time: '09:00 – 11:00', location: 'TP. Hồ Chí Minh', temperature: '27 – 30°C', weather: 'Nắng nhẹ', rain: '20%', commute: 'Đi bộ quãng ngắn', style: 'Hằng ngày, thoải mái' },
  { id: 'rain', label: 'Mưa chiều', event: 'Hẹn chiều sau giờ làm', time: '17:00 – 19:00', location: 'TP. Hồ Chí Minh', temperature: '25 – 28°C', weather: 'Có mưa vào buổi chiều', rain: '80%', commute: 'Tàu điện và đi bộ', style: 'Gọn nhẹ, dễ di chuyển' },
  { id: 'date', label: 'Hẹn hò', event: 'Bữa tối hẹn hò', time: '18:00 – 21:00', location: 'Hà Nội', temperature: '22 – 25°C', weather: 'Trời mát, ít mây', rain: '10%', commute: 'Taxi và đi bộ quãng ngắn', style: 'Thanh lịch, tối giản' },
  { id: 'weekend', label: 'Đi chơi cuối tuần', event: 'Dạo phố cuối tuần', time: '09:00 – 16:00', location: 'Đà Nẵng', temperature: '26 – 29°C', weather: 'Nắng, có mây', rain: '20%', commute: 'Đi bộ nhiều', style: 'Năng động, thoải mái' },
]

// Fixture FE: một bản nháp cho mỗi ảnh, không phải kết quả nhận diện AI.
function createDemoDraft(photos: UploadedPhoto[]): AnalysisDraft {
  const id = crypto.randomUUID()
  return { id, photos: [...photos], items: photos.map((photo, index) => {
    const category = (['Áo', 'Quần', 'Giày'] as const)[index % 3]
    return { id: crypto.randomUUID(), batchId: id, sourcePhotoId: photo.id, name: `${category} từ ảnh ${index + 1}`, category, type: categoryTypes[category], color: 'Chưa xác định', material: 'Chưa xác định', style: 'Hằng ngày', tag: `${category} · Hằng ngày`, rare: '', image: photo.url, demo: true }
  }) }
}

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
    trophy: <><path d="M7 4h10v4a5 5 0 0 1-10 0V4Z" /><path d="M7 5H4v1a4 4 0 0 0 4 4M17 5h3v1a4 4 0 0 1-4 4M12 13v4m-3 3h6m-3-3v3" /></>,
    tree: <><path d="M12 3c2.5 3 4 5 4 7.5a4 4 0 0 1-8 0C8 8 9.5 6 12 3Z" /><path d="M12 14v7M9 21h6" /></>,
    info: <><circle cx="12" cy="12" r="9" /><path d="M12 11v5M12 8h.01" /></>,
    hanger: <><path d="M12 5a2 2 0 1 1 2 2c-1.6 0-2.7 1.2-2.7 2.8V11" /><path d="m4.5 12.5 7.5-3 7.5 3-7.5 5.5-7.5-5.5Z" /></>,
    star: <path d="m12 3 2.6 5.6 6.1.8-4.5 4.3 1.2 6L12 16.9 6.6 19.7l1.2-6L3.3 9.4l6.1-.8L12 3Z" />,
    'cloud-co2': <><path d="M7 18a4.5 4.5 0 1 1 .6-8.96A5.5 5.5 0 0 1 18.3 9.5 3.5 3.5 0 0 1 17 16H7Z" /><text x="12" y="15" textAnchor="middle" fontSize="6.5" fontWeight="800" fill="currentColor" stroke="none" fontFamily="Manrope,sans-serif">CO₂</text></>,
    jacket: <path d="m6 4-4 3 2 4 3-1v10h10V10l3 1 2-4-4-3-2 2H8Z" />,
    pants: <path d="M8 4h8l-1 16h-3l-1-6-1 6H7L8 4Z" />,
    shoe: <path d="M4 15c4-1 7-4 9-8l5 2c2 3 3 5 2 7l-2 2H6c-2 0-3-2-2-3Z" />,
    tie: <><path d="m12 3 2 4-2 4-2-4 2-4Z" /><path d="M10 11h4l-2 10-2-10Z" /></>,
  }
  return <svg className="icon" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>
}

function Logo({ inverse = false }: { inverse?: boolean }) {
  return <div className={`logo ${inverse ? 'inverse' : ''}`}><span>G</span><b>garblo</b></div>
}

function Button({ children, className = '', type = 'button', ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button type={type} className={`button ${className}`} {...props}>{children}</button>
}

function Header({ dark = false, onBell, title, onBack, gear }: { dark?: boolean; onBell?: () => void; title?: string; onBack?: () => void; gear?: () => void }) {
  return <div className={`header ${dark ? 'header-dark' : ''}`}>
    {onBack ? <Button className="icon-button ghost" aria-label="Quay lại" onClick={onBack}><Icon name="back" /></Button> : <Logo inverse={dark} />}
    {title && <div className="header-title">{title}</div>}
    <div className="header-actions">
      {!title && <div className="weather">Bản demo</div>}
      {gear ? <Button className="icon-button ghost muted" aria-label="Cài đặt" onClick={gear}><Icon name="gear" /></Button> :
        onBell && <Button className="icon-button ghost bell" aria-label="Thông báo" onClick={onBell}><Icon name="bell" /><i /></Button>}
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

const initialWardrobe: WardrobeItem[] = wardrobe.map((item, index) => ({
  ...item, id: `demo-item-${index + 1}`, category: item.tag.split(' · ')[0] as Category,
  material: 'Chưa xác định', style: item.tag.split(' · ')[1], demo: true,
}))

function ProductPhoto({ item }: { item: { name: string; image: string } }) {
  const [failedImage, setFailedImage] = useState<string | null>(null)
  return item.image && failedImage !== item.image
    ? <img className="product-photo" src={item.image} alt={item.name} draggable={false} onError={() => setFailedImage(item.image)} />
    : <div className="product-placeholder" aria-label={`Chưa có ảnh cho ${item.name}`}><Icon name="image" size={24} /></div>
}

function Wardrobe({ items, filter, onFilter, onItem, onMatch, onAdd, message }: {
  items: WardrobeItem[]; filter: string; onFilter: (filter: string) => void
  onItem: (id: string) => void; onMatch: () => void; onAdd: () => void; message: string
}) {
  const filters = ['Tất cả', ...categories]
  const visibleItems = items.filter(item => filter === 'Tất cả' || item.category === filter)
  return <div className="screen-content">
    <div className="title-row"><div><div className="eyebrow">BỘ SƯU TẬP CỦA BẠN</div><div className="page-title">Tủ đồ <span>{items.length} món</span></div></div><div className="mini-avatar">Y</div></div>
    <p className="demo-note">Tủ đồ mẫu + món bạn xác nhận. Dữ liệu được giữ trong phiên; tải lại trang sẽ đặt lại.</p>
    {message && <div className="flow-status" role="status">{message}</div>}
    <div className="chip-row">{filters.map(f => <Button key={f} aria-pressed={filter === f} className={`chip ${filter === f ? 'selected' : ''}`} onClick={() => onFilter(f)}>{f}</Button>)}</div>
    <div className="wardrobe-grid">
      {visibleItems.map(item => <Button key={item.id} className="wardrobe-card" onClick={() => onItem(item.id)}>
        <div className="garment-box"><ProductPhoto item={item} /></div>
        <div className="item-copy"><b>{item.name}</b><small>{item.tag}</small>{item.rare && <span className="rare">{item.rare}</span>}</div>
      </Button>)}
    </div>
    {visibleItems.length === 0 && <div className="flow-empty"><b>{items.length ? 'Chưa có món thuộc nhóm này' : 'Tủ đồ đang trống'}</b><p>Thêm ảnh và xác nhận thông tin để lưu món vào tủ.</p><Button className="secondary wide" onClick={onAdd}>Thêm ảnh</Button></div>}
    <Button className="fab primary" onClick={onMatch}><Icon name="sparkle" /> Phối look mới</Button>
  </div>
}

function AddUpload({ photos, agreed, onConsent, onFiles, onRemove, onAnalyze, error, reading, pickerRef, hasDraft, onReview }: {
  photos: UploadedPhoto[]; agreed: boolean; onConsent: (value: boolean) => void
  onFiles: (event: ChangeEvent<HTMLInputElement>) => void; onRemove: (id: string) => void
  onAnalyze: () => void; error: string; reading: boolean; pickerRef: RefObject<HTMLInputElement | null>
  hasDraft: boolean; onReview: () => void
}) {
  return <div className="screen-content add-upload">
    <div className="eyebrow">STUDIO / 01</div>
    <div className="page-title">Thêm ảnh</div>
    <p className="upload-subtitle">Áo quần, dáng chụp hay phông nền — cứ để lẫn.</p>
    <input ref={pickerRef} className="visually-hidden" type="file" accept="image/jpeg,image/png" multiple aria-label="Chọn ảnh JPG hoặc PNG" onChange={onFiles} disabled={reading} />
    <div className={`upload-box ${photos.length ? 'has-photos' : ''}`}>
      {photos.length === 0 ? <Button className="upload-picker" disabled={reading} onClick={() => pickerRef.current?.click()}>
        <div className="upload-plus"><Icon name="plus" size={24} /></div>
        <b>Chạm để thêm ảnh</b>
        <small>JPG, PNG · tối đa 10 ảnh/lượt</small>
      </Button> : <>
        <div className="upload-count">{photos.length} ảnh đã chọn</div>
        <div className="upload-thumbnails">
          {photos.map(photo => <div className="upload-thumbnail" key={photo.id}>
            <img src={photo.url} alt={photo.file.name} />
            <Button className="remove-photo" aria-label={`Bỏ ảnh ${photo.file.name}`} disabled={reading} onClick={() => onRemove(photo.id)}><Icon name="x" size={13} /></Button>
          </div>)}
        </div>
        <Button className="secondary wide add-more-photos" disabled={reading || photos.length >= 10} onClick={() => pickerRef.current?.click()}>Thêm ảnh</Button>
      </>}
    </div>
    {reading && <div className="flow-status" role="status">Đang kiểm tra ảnh...</div>}
    {error && <p className="flow-error" role="alert">{error}</p>}
    <div className="upload-privacy">
      <div className="upload-privacy-head"><div className="privacy-icon"><Icon name="lock" size={20} /></div><div><b>Ảnh được giữ trong trình duyệt</b><p>Bản demo không gửi ảnh đến AI, chưa xóa EXIF/GPS hoặc làm mờ người trong ảnh.</p></div></div>
      <label className="consent-check"><input type="checkbox" checked={agreed} onChange={e => onConsent(e.target.checked)} /><span><Icon name="check" size={15} /></span>Tôi đồng ý dùng ảnh của mình để thử luồng demo</label>
      <div className="privacy-note">Ảnh và tủ đồ chỉ được giữ trong phiên. Tải lại trang sẽ đặt lại dữ liệu.</div>
    </div>
    <Button className="primary wide analyze-button" disabled={!agreed || photos.length === 0 || reading} onClick={onAnalyze}>Phân tích với AI · demo <Icon name="chevron" /></Button>
    {hasDraft && <Button className="secondary wide resume-review" onClick={onReview}>Tiếp tục kiểm tra bản nháp</Button>}
  </div>
}

function CaptureSheet({ photos, analyzeOutfit, onOption, onOk, onRetake }: {
  photos: UploadedPhoto[]; analyzeOutfit: boolean; onOption: (value: boolean) => void; onOk: () => void; onRetake: () => void
}) {
  return <div className="overlay shade"><div className="sheet capture-sheet" role="dialog" aria-modal="true" aria-label="Chọn nội dung phân tích">
    <div className="sheet-handle" /><div className="sheet-title">Phân tích gì từ ảnh này?</div>
    <div className="sheet-thumbnails">{photos.map(photo => <div key={photo.id}><img src={photo.url} alt={photo.file.name} /></div>)}</div>
    <p className="demo-note">Demo tạo một món nháp cho mỗi ảnh. Bạn cần kiểm tra, sửa và xác nhận; chưa có AI nhận diện.</p>
    <label className="check-row"><span><b>Phân tích outfit · demo</b><small>Tạo bản nháp để kiểm tra thông tin quần áo</small></span><input type="checkbox" checked={analyzeOutfit} onChange={event => onOption(event.target.checked)} /><i><Icon name="check" size={15} /></i></label>
    {['Phân tích tư thế', 'Phân tích nền'].map(label => <label className="check-row unavailable" key={label}><span><b>{label}</b><small>Chưa hỗ trợ trong bản demo</small></span><input type="checkbox" disabled checked={false} readOnly /><i><Icon name="check" size={15} /></i></label>)}
    <div className="two-buttons"><Button className="secondary" onClick={onRetake}>Chọn lại ảnh</Button><Button className="primary" disabled={!analyzeOutfit || !photos.length} onClick={onOk}>OK</Button></div>
  </div></div>
}

function ContextCollection({ context, onChange, onBack, onViewOutfits, error, onAdd }: {
  context: MatchContext; onChange: (context: MatchContext) => void; onBack: () => void
  onViewOutfits: () => void; error: string; onAdd: () => void
}) {
  return <div className="context-screen">
    <div className="ctx-status-bar"><span>07:30</span><div className="ctx-status-icons"><Icon name="signal" size={13} /><Icon name="wifi" size={13} /><Icon name="battery" size={13} /></div></div>
    <div className="ctx-header">
      <Button className="ctx-icon-btn" aria-label="Quay lại" onClick={onBack}><Icon name="back" /></Button>
      <Logo />
      <span className="demo-badge">DEMO</span>
    </div>
    <div className="ctx-body">
      <div className="ctx-ai">
        <div className="ctx-ai-avatar"><Icon name="sparkle" size={17} /></div>
        <div className="ctx-bubble">Chọn bối cảnh mẫu để thử phối đồ từ tủ của bạn. Dữ liệu lịch, vị trí và thời tiết bên dưới đều là demo.</div>
      </div>
      <div className="ctx-section">
        <h2>Bối cảnh phối đồ</h2>
        <p>Thông tin mẫu, chưa kết nối lịch, vị trí hay thời tiết thực tế.</p>
        <label className="context-select">Chọn bối cảnh<select aria-label="Chọn bối cảnh" value={context.id} onChange={event => { const next = contextPresets.find(preset => preset.id === event.target.value); if (next) onChange(next) }}>{contextPresets.map(preset => <option key={preset.id} value={preset.id}>{preset.label}</option>)}</select></label>
        <div className="ctx-cards">
          <div className="ctx-card ctx-event">
            <div className="ctx-card-head"><span className="ctx-card-icon"><Icon name="calendar" size={16} /></span><b>Sự kiện hôm nay</b></div>
            <div className="ctx-card-main"><strong>{context.event}</strong><span>{context.time}</span><span className="ctx-loc"><Icon name="pin" size={12} /> {context.location}</span></div>
          </div>
          <div className="ctx-card ctx-weather">
            <div className="ctx-card-head"><span className="ctx-card-icon"><Icon name="sun-cloud" size={16} /></span><b>Thời tiết</b></div>
            <div className="ctx-card-main"><strong>{context.temperature}</strong><span>{context.weather}</span></div>
          </div>
          <div className="ctx-card ctx-rain">
            <div className="ctx-card-head"><span className="ctx-card-icon"><Icon name="droplet" size={16} /></span><b>Khả năng mưa</b></div>
            <div className="ctx-card-main ctx-rain-main"><strong>{context.rain}</strong><span>Dữ liệu thời tiết mẫu</span></div>
          </div>
          <div className="ctx-card ctx-commute">
            <div className="ctx-card-head"><span className="ctx-card-icon"><Icon name="train" size={16} /></span><b>Di chuyển</b></div>
            <div className="ctx-card-main"><strong>{context.commute}</strong><span>Phương án di chuyển mẫu</span></div>
          </div>
          <div className="ctx-card ctx-style">
            <div className="ctx-card-head"><span className="ctx-card-icon"><Icon name="shirt" size={16} /></span><b>Phong cách ưu tiên</b></div>
            <div className="ctx-card-main"><strong>{context.style}</strong><span>Gợi ý theo bối cảnh {context.label.toLocaleLowerCase('vi')}</span></div>
          </div>
        </div>
      </div>
      <div className="ctx-ready">
        <div className="ctx-ready-icon"><Icon name="sparkle" size={19} /></div>
        <h3>Sẵn sàng thử 3 outfit demo?</h3>
        <p>Bản demo ghép các món hiện có trong tủ. Ảnh outfit chỉ là minh họa, chưa có AI chấm độ phù hợp.</p>
        {error && <div className="flow-error" role="alert">{error}<Button className="secondary wide" onClick={onAdd}>Thêm ảnh vào tủ</Button></div>}
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

// Fixture phối đồ theo ID thật trong tủ; ảnh Unsplash chỉ minh họa phong cách.
function createMatchSession(context: MatchContext, items: WardrobeItem[]): MatchSession | null {
  const tops = items.filter(item => item.category === 'Áo')
  const bottoms = items.filter(item => item.category === 'Quần' || item.category === 'Váy')
  const shoes = items.filter(item => item.category === 'Giày')
  const bags = items.filter(item => item.category === 'Túi')
  if (!tops.length || !bottoms.length || !shoes.length) return null
  const id = crypto.randomUUID()
  const names = ['Thanh lịch mỗi ngày', 'Thoải mái di chuyển', 'Điểm nhấn riêng']
  const outfits = names.map((name, index) => ({
    id: `${id}-${index + 1}`, number: index + 1, name,
    image: `https://images.unsplash.com/${outfitPhotos[context.label][index]}?auto=format&fit=crop&w=900&q=84`,
    itemIds: [tops[index % tops.length].id, bottoms[index % bottoms.length].id, shoes[index % shoes.length].id, ...(bags.length ? [bags[index % bags.length].id] : [])],
  }))
  return { id, context: { ...context }, outfits, items: [...items], index: 0, decisions: {}, selectedOutfitId: null }
}

function recordDecision(session: MatchSession, outfitId: string, liked: boolean): MatchSession {
  if (session.outfits[session.index]?.id !== outfitId) return session
  const previousDecisions = Object.fromEntries(Object.entries(session.decisions).filter(([id]) => id !== outfitId))
  const decisions = { ...previousDecisions, [outfitId]: liked ? 'like' as const : 'dislike' as const }
  const selectedOutfitId = liked ? outfitId : session.selectedOutfitId === outfitId
    ? Object.keys(decisions).reverse().find(id => decisions[id] === 'like') ?? null
    : session.selectedOutfitId
  return { ...session, decisions, selectedOutfitId, index: session.index + 1 }
}

function MatchCards({ session, onDecision, onContext, onFinish, onRestart }: {
  session: MatchSession; onDecision: (id: string, liked: boolean) => void
  onContext: () => void; onFinish: () => void; onRestart: () => void
}) {
  const [dragX, setDragX] = useState(0)
  const [transitioning, setTransitioning] = useState(false)
  const [animating, setAnimating] = useState(false)
  const animationLock = useRef(false)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const dragStart = useRef<number | null>(null)
  const dragDistance = useRef(0)
  const outfit = session.outfits[session.index]
  const nextOutfit = session.outfits[session.index + 1]
  const dragDirection = dragX === 0 ? 1 : Math.sign(dragX)
  const nextOffset = dragDirection * -Math.max(0, 100 - Math.min(Math.abs(dragX) / 3.9, 100))

  useEffect(() => () => { if (timer.current) clearTimeout(timer.current) }, [])

  const dismiss = (liked: boolean) => {
    if (animationLock.current || !outfit) return
    if (timer.current) clearTimeout(timer.current)
    animationLock.current = true
    setAnimating(true)
    setTransitioning(true)
    setDragX((liked ? 1 : -1) * 480)
    timer.current = setTimeout(() => {
      onDecision(outfit.id, liked)
      animationLock.current = false
      setTransitioning(false)
      setDragX(0)
      setAnimating(false)
    }, 320)
  }

  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (animationLock.current || (event.target as HTMLElement).closest('button')) return
    if (timer.current) clearTimeout(timer.current)
    dragStart.current = event.clientX
    dragDistance.current = 0
    event.currentTarget.setPointerCapture(event.pointerId)
    setTransitioning(false)
  }

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (dragStart.current === null || animationLock.current) return
    dragDistance.current = event.clientX - dragStart.current
    setDragX(dragDistance.current)
  }

  const finishDrag = (event: PointerEvent<HTMLDivElement>) => {
    if (dragStart.current === null || animationLock.current) return
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId)
    dragStart.current = null
    if (event.type !== 'pointercancel' && Math.abs(dragDistance.current) >= 70) dismiss(dragDistance.current > 0)
    else {
      setTransitioning(true)
      setDragX(0)
      timer.current = setTimeout(() => setTransitioning(false), 320)
    }
    dragDistance.current = 0
  }

  const renderCard = (card: Outfit, current = false) => <div
    className={`swipe-card ${transitioning ? 'transitioning' : ''} ${current ? 'current-card' : 'next-card'}`}
    style={{ transform: current ? `translateX(${dragX}px) rotate(${dragX / 45}deg)` : `translateX(${nextOffset}%)` }}
  >
    <div className="match-scene"><ProductPhoto item={{ name: `Ảnh minh họa outfit ${card.number}: ${card.name}`, image: card.image }} /></div>
    <div className="look-gradient" />
    <div className="look-copy"><div className="model-label">PHỐI ĐỒ DEMO · ẢNH MINH HỌA</div><div className="look-title">{card.name}</div><div className="score-line"><span>{session.context.label}</span><b>{session.context.event}</b></div><div className="card-item-names">{card.itemIds.map(id => session.items.find(item => item.id === id)?.name).join(' · ')}</div></div>
  </div>

  if (!outfit) return <div className="match-card-screen completed-deck"><Logo /><div className="flow-empty"><h2>{session.selectedOutfitId ? 'Đã xem hết 3 outfit' : 'Bạn chưa chọn outfit nào'}</h2><p>{session.selectedOutfitId ? 'Outfit được thích gần nhất là lựa chọn hiện tại.' : 'Bạn đã bỏ cả 3 outfit. Xem lại để chọn hoặc thử bối cảnh khác.'}</p>{session.selectedOutfitId && <Button className="primary wide" onClick={onFinish}>Xem kết quả</Button>}<Button className="secondary wide" onClick={onRestart}>Xem lại 3 outfit</Button><Button className="secondary wide" onClick={onContext}>Đổi bối cảnh</Button></div></div>

  return <div className="match-card-screen">
    <div className="swipe-deck" onPointerDown={handlePointerDown} onPointerMove={handlePointerMove} onPointerUp={finishDrag} onPointerCancel={finishDrag}>
      {nextOutfit && renderCard(nextOutfit)}
      {renderCard(outfit, true)}
    </div>
    <div className="match-header"><Logo inverse /><div className="match-header-actions"><div className="weather">{session.context.temperature} · mẫu</div></div></div>
    <div className="match-top"><span>{session.index + 1}/{session.outfits.length} outfit</span><div className="match-top-actions"><Button className="glass-link" disabled={animating} onClick={onContext}>Đổi bối cảnh</Button><Button className="result-pill" disabled={animating || !session.selectedOutfitId} onClick={onFinish}><Icon name="sparkle" size={13} /> Xem kết quả</Button></div></div>
    <div className="saved-toast" role="status">{session.selectedOutfitId ? 'Đã thích trong phiên · chọn lượt thích gần nhất' : 'Thích một outfit để xem kết quả'}</div>
    <div className="action-stack">
      <Button className="action-item" disabled={animating} onClick={() => dismiss(false)}><span className="round-action reject"><Icon name="x" /></span><small>Bỏ</small></Button>
      <Button className="action-item" disabled={animating} onClick={() => dismiss(true)}><span className="round-action love"><Icon name="heart" /></span><small>Thích</small></Button>
      <Button className="action-item" disabled title="Chưa hỗ trợ trong luồng demo"><span className="round-action adjust"><Icon name="sliders" /></span><small>Chỉnh · chưa hỗ trợ</small></Button>
      <Button className="action-item" disabled title="Chưa hỗ trợ trong luồng demo"><span className="round-action try"><Icon name="shirt" /></span><small>Thử đồ · chưa hỗ trợ</small></Button>
    </div>
  </div>
}

function ImpactResult({ session, outfit, onBack, onReview }: { session: MatchSession; outfit: Outfit; onBack: () => void; onReview: () => void }) {
  const [showInfo, setShowInfo] = useState(false)
  const metrics = [
    { icon: 'trophy', value: 'Top 8%', desc: 'người dùng tận dụng tủ đồ hiệu quả' },
    { icon: 'cloud-co2', value: '6 kg', desc: 'CO₂e tránh phát thải ước tính' },
    { icon: 'tree', value: '3 tháng', desc: 'hấp thụ CO₂ của một cây trưởng thành' },
  ]
  const items = outfit.itemIds.flatMap(id => session.items.filter(item => item.id === id))
  return <div className="result-screen">
    <div className="ctx-status-bar"><span>07:30</span><div className="ctx-status-icons"><Icon name="signal" size={13} /><Icon name="wifi" size={13} /><Icon name="battery" size={13} /></div></div>
    <div className="ctx-header">
      <Button className="ctx-icon-btn" aria-label="Quay lại outfit đã chọn" onClick={onBack}><Icon name="back" /></Button>
      <Logo />
      <Button className="ctx-icon-btn" disabled aria-label="Chia sẻ chưa hỗ trợ" title="Chia sẻ chưa hỗ trợ"><Icon name="share" /></Button>
    </div>
    <div className="result-body">
      <div className="result-hero">
        <h1>Outfit bạn đã chọn</h1>
        <p>Lựa chọn được thích gần nhất, giữ trong phiên ứng dụng.</p>
        <p className="result-hero-sub">Mỗi lần mặc thông minh hơn là một bước tiến vì hành tinh xanh hơn.</p>
      </div>
      <div className="impact-card">
        <div className="impact-card-head"><b>CHỈ SỐ TÁC ĐỘNG · DEMO</b><Button className="impact-info-btn" onClick={() => setShowInfo(v => !v)} aria-expanded={showInfo} aria-label="Giải thích chỉ số demo"><Icon name="info" size={15} /></Button></div>
        <p className="demo-note">Số liệu mẫu, không được tính từ outfit hoặc hoạt động của bạn.</p>
        {showInfo && <div className="impact-note">Các giá trị cố định chỉ minh họa giao diện, chưa có cơ chế đo lường hay xác minh khoa học.</div>}
        <div className="impact-metrics">{metrics.map(m => <div className="impact-metric" key={m.value}><span className="impact-metric-icon"><Icon name={m.icon} size={18} /></span><strong>{m.value}</strong><small>{m.desc}</small></div>)}</div>
      </div>
      <div className="nature-banner">
        <img src="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=900&q=80" alt="Rừng xanh" />
        <div className="nature-copy">Mặc thông minh hơn<br />vì một hành tinh xanh hơn. 🌱</div>
      </div>
      <div className="outfit-card">
        <div className="outfit-card-head"><b>Outfit đã chọn</b><span>{session.context.label} · {session.context.event}</span></div>
        <p className="demo-note">{session.context.temperature} · {session.context.weather} · {session.context.commute} (bối cảnh mẫu)</p>
        <div className="outfit-label"><span>OUTFIT {String(outfit.number).padStart(2, '0')}</span><div><strong>{outfit.name}</strong><Icon name="star" size={16} /></div></div>
        <div className="outfit-photo-wrap"><ProductPhoto item={{ name: `Ảnh minh họa outfit ${outfit.number}: ${outfit.name}`, image: outfit.image }} /></div>
        <p className="demo-note">Ảnh minh họa phong cách, không phải ảnh AI ghép từ các món bên dưới.</p>
        <div className="outfit-items">{items.map(item => <div className="outfit-item" key={item.id}><span className="outfit-item-photo"><ProductPhoto item={item} /></span><span><b>{item.name}</b><small>{item.category} · {item.color} · {item.style}</small></span></div>)}</div>
        <div className="outfit-actions">
          <Button className="outfit-btn secondary" onClick={onReview}><Icon name="hanger" size={16} /> Xem lại outfit</Button>
          <Button className="outfit-btn primary" disabled title="Chưa tích hợp lịch"><Icon name="calendar" size={16} /> Lưu vào lịch</Button>
        </div>
        <p className="demo-note">Lưu vào lịch chưa được hỗ trợ. Không có dữ liệu nào được gửi đến lịch của bạn.</p>
      </div>
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

function ItemDetail({ items, photoCount, reviewing, onChange, onClose, onSave }: {
  items: WardrobeItem[]; photoCount: number; reviewing: boolean
  onChange: (id: string, patch: Partial<WardrobeItem>) => void; onClose: () => void; onSave: () => void
}) {
  const [activeId, setActiveId] = useState(items[0]?.id)
  const item = items.find(candidate => candidate.id === activeId) ?? items[0]
  const index = items.findIndex(candidate => candidate.id === item?.id)
  const valid = items.length > 0 && items.every(candidate => candidate.name.trim())
  return <div className="full-overlay white" role="dialog" aria-modal="true" aria-label={reviewing ? 'Kiểm tra kết quả phân tích demo' : 'Chi tiết món đồ'}>
    <Header title={reviewing ? 'AI đọc ảnh · demo' : 'Chi tiết món đồ'} onBack={onClose} />
    <div className="overlay-content">
      {item ? <>
        <div className="source-strip"><div><ProductPhoto item={item} /></div><div><span>{item.sourcePhotoId ? 'ẢNH GỐC' : 'TỦ ĐỒ MẪU'}</span><b>{reviewing ? `${photoCount} ảnh · ${items.length} món nháp` : item.name}</b><small>{reviewing ? 'Kiểm tra và sửa trước khi lưu' : 'Thông tin đang lưu trong phiên'}</small></div></div>
        {reviewing && <p className="demo-note">Kết quả phân tích demo: một món nháp cho mỗi ảnh. Loại và thuộc tính là giá trị mẫu, chưa được AI nhận diện. Ảnh bên dưới là ảnh gốc, chưa tách món.</p>}
        <div className="detected-card"><div className="detected-image"><ProductPhoto item={item} /></div><div className="detected-head"><div><span>MÓN {index + 1}/{items.length}</span><b>{item.name || 'Chưa đặt tên'}</b></div><i>{reviewing ? 'Bản nháp demo' : 'Đã lưu trong phiên'}</i></div>
          <div className="review-fields">
            <label className="full-field">Tên món<input value={item.name} maxLength={100} required aria-invalid={!item.name.trim()} onChange={event => onChange(item.id, { name: event.target.value })} /></label>
            {!item.name.trim() && <p className="flow-error full-field" role="alert">Nhập tên món trước khi lưu.</p>}
            <label>Loại<select aria-label="Loại" value={item.category} onChange={event => { const category = event.target.value as Category; onChange(item.id, { category, type: categoryTypes[category] }) }}>{categories.map(category => <option key={category}>{category}</option>)}</select></label>
            <label>Màu<input value={item.color} maxLength={60} onChange={event => onChange(item.id, { color: event.target.value })} /></label>
            <label>Chất liệu<input value={item.material} maxLength={60} onChange={event => onChange(item.id, { material: event.target.value })} /></label>
            <label>Phong cách<input value={item.style} maxLength={60} onChange={event => onChange(item.id, { style: event.target.value })} /></label>
          </div>
        </div>
        {items.length > 1 && <div className="review-item-list" aria-label="Chọn món để kiểm tra">{items.map((candidate, itemIndex) => <Button key={candidate.id} className={`small-detected ${candidate.id === item.id ? 'selected' : ''}`} aria-pressed={candidate.id === item.id} onClick={() => setActiveId(candidate.id)}><ProductPhoto item={candidate} /><div><span>MÓN {itemIndex + 1}/{items.length}</span><b>{candidate.name || 'Chưa đặt tên'}</b></div><Icon name="chevron" /></Button>)}</div>}
      </> : <div className="flow-empty">Chưa có món để kiểm tra. Quay lại và chọn ảnh.</div>}
    </div>
    <div className="sticky-action"><Button className="primary wide" disabled={!valid} onClick={onSave}>{reviewing ? `Xác nhận và lưu ${items.length} món vào tủ` : 'Lưu thay đổi vào tủ'}</Button><small>Lưu trong phiên ứng dụng</small></div>
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
  const [photos, setPhotos] = useState<UploadedPhoto[]>([])
  const [agreed, setAgreed] = useState(false)
  const [reading, setReading] = useState(false)
  const [uploadError, setUploadError] = useState('')
  const [analyzeOutfit, setAnalyzeOutfit] = useState(true)
  const [draft, setDraft] = useState<AnalysisDraft | null>(null)
  const [analysisStatus, setAnalysisStatus] = useState<AnalysisStatus>('idle')
  const [items, setItems] = useState(initialWardrobe)
  const [filter, setFilter] = useState('Tất cả')
  const [message, setMessage] = useState('')
  const [detailMode, setDetailMode] = useState<'draft' | 'saved'>('draft')
  const [editedItem, setEditedItem] = useState<WardrobeItem | null>(null)
  const [matchStage, setMatchStage] = useState<'context' | 'cards' | 'result'>('context')
  const [matchContext, setMatchContext] = useState(contextPresets[0])
  const [session, setSession] = useState<MatchSession | null>(null)
  const [contextError, setContextError] = useState('')
  const [contextOrigin, setContextOrigin] = useState<'wardrobe' | 'cards'>('wardrobe')
  const pickerRef = useRef<HTMLInputElement>(null)
  const analysisTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const savedBatches = useRef(new Set<string>())
  const objectUrls = useRef(new Set<string>())
  const pendingUrls = useRef(new Set<string>())
  const mounted = useRef(true)
  const readingLock = useRef(false)
  const frameRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    mounted.current = true
    const urls = objectUrls.current
    return () => {
      mounted.current = false
      if (analysisTimer.current) clearTimeout(analysisTimer.current)
      urls.forEach(url => URL.revokeObjectURL(url))
      urls.clear()
    }
  }, [])

  useEffect(() => {
    const retained = new Set([
      ...photos.map(photo => photo.url), ...(draft?.photos.map(photo => photo.url) ?? []),
      ...items.map(item => item.image), ...(session?.items.map(item => item.image) ?? []),
    ])
    objectUrls.current.forEach(url => {
      if (!retained.has(url) && !pendingUrls.current.has(url)) {
        URL.revokeObjectURL(url)
        objectUrls.current.delete(url)
      }
    })
  }, [photos, draft, items, session])

  const closeOverlay = () => {
    if (analysisTimer.current) clearTimeout(analysisTimer.current)
    analysisTimer.current = null
    setAnalysisStatus('idle')
    setOverlay('none')
  }

  // Focus stays in the two Happy Path dialogs; Escape preserves the review draft.
  useEffect(() => {
    if (!captureSheet && overlay !== 'item') return
    const dialog = frameRef.current?.querySelector<HTMLElement>('[role="dialog"]')
    if (!dialog) return
    const previous = document.activeElement as HTMLElement | null
    const getFocusable = () => Array.from(dialog.querySelectorAll<HTMLElement>('button:not(:disabled), input:not(:disabled), select:not(:disabled), [tabindex="0"]'))
    getFocusable()[0]?.focus()
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        if (captureSheet) setCaptureSheet(false)
        else closeOverlay()
      }
      if (event.key === 'Tab') {
        const elements = getFocusable()
        const first = elements[0]
        const last = elements[elements.length - 1]
        if (event.shiftKey && (document.activeElement === first || !dialog.contains(document.activeElement))) { event.preventDefault(); last?.focus() }
        else if (!event.shiftKey && (document.activeElement === last || !dialog.contains(document.activeElement))) { event.preventDefault(); first?.focus() }
      }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => { document.removeEventListener('keydown', onKeyDown); if (previous?.isConnected) previous.focus() }
  }, [captureSheet, overlay, analysisStatus])

  const handleFiles = async (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? [])
    event.target.value = ''
    if (!files.length || readingLock.current) return
    setUploadError('')
    if (files.length + photos.length > 10) { setUploadError('Tối đa 10 ảnh/lượt. Hãy chọn ít ảnh hơn hoặc bỏ bớt ảnh đã chọn.'); return }
    if (files.some(file => !['image/jpeg', 'image/png'].includes(file.type))) { setUploadError('Chỉ hỗ trợ ảnh JPG hoặc PNG. Vui lòng chọn lại.'); return }
    readingLock.current = true
    setReading(true)
    const created: UploadedPhoto[] = []
    try {
      for (const file of files) {
        const url = URL.createObjectURL(file)
        objectUrls.current.add(url)
        pendingUrls.current.add(url)
        const photo = { id: crypto.randomUUID(), file, url }
        created.push(photo)
        await new Promise<void>((resolve, reject) => {
          const image = new Image()
          const timeout = setTimeout(() => { image.onload = null; image.onerror = null; image.src = ''; reject(new Error('Không đọc được ảnh')) }, 10000)
          image.onload = () => { clearTimeout(timeout); image.onload = null; image.onerror = null; resolve() }
          image.onerror = () => { clearTimeout(timeout); image.onload = null; image.onerror = null; reject(new Error('Ảnh bị lỗi')) }
          image.src = url
        })
        if (!mounted.current) return
      }
      if (mounted.current) setPhotos(current => [...current, ...created])
    } catch {
      created.forEach(photo => { URL.revokeObjectURL(photo.url); objectUrls.current.delete(photo.url) })
      if (mounted.current) setUploadError('Không đọc được ảnh đã chọn. Hãy thử lại bằng ảnh JPG/PNG khác.')
    } finally {
      created.forEach(photo => pendingUrls.current.delete(photo.url))
      readingLock.current = false
      if (mounted.current) setReading(false)
    }
  }

  const changeTab = (next: Tab) => {
    if (next === tab) return
    closeOverlay()
    setCaptureSheet(false)
    setTab(next)
  }
  const finishCapture = () => {
    if (!photos.length || !agreed || !analyzeOutfit || analysisTimer.current) return
    setCaptureSheet(false)
    setDetailMode('draft')
    setDraft(null)
    setOverlay('item')
    setAnalysisStatus('loading')
    // Timer only simulates preparation of a clearly labelled FE fixture.
    analysisTimer.current = setTimeout(() => {
      analysisTimer.current = null
      try { setDraft(createDemoDraft(photos)); setAnalysisStatus('idle') }
      catch { setAnalysisStatus('error') }
    }, 650)
  }
  const updateItem = (id: string, patch: Partial<WardrobeItem>) => {
    if (detailMode === 'draft') setDraft(current => current ? { ...current, items: current.items.map(item => item.id === id ? { ...item, ...patch } : item) } : null)
    else setEditedItem(current => current?.id === id ? { ...current, ...patch } : current)
  }
  const saveItems = () => {
    const candidates = detailMode === 'draft' ? draft?.items : editedItem ? [editedItem] : []
    if (!candidates?.length || candidates.some(item => !item.name.trim())) return
    const confirmed = candidates.map(item => ({ ...item, name: item.name.trim(), color: item.color.trim() || 'Chưa xác định', material: item.material.trim() || 'Chưa xác định', style: item.style.trim() || 'Chưa xác định', tag: `${item.category} · ${item.style.trim() || 'Chưa xác định'}` }))
    if (detailMode === 'draft') {
      if (!draft || savedBatches.current.has(draft.id)) return
      savedBatches.current.add(draft.id)
      setItems(current => [...confirmed, ...current])
      setMessage(`Đã lưu ${confirmed.length} món bạn xác nhận trong phiên.`)
      const savedPhotoIds = new Set(draft.photos.map(photo => photo.id))
      setPhotos(current => current.filter(photo => !savedPhotoIds.has(photo.id)))
      setDraft(null)
      setAgreed(false)
    } else {
      setItems(current => current.map(item => confirmed.find(candidate => candidate.id === item.id) ?? item))
      setEditedItem(null)
      setMessage('Đã cập nhật món đồ trong phiên.')
    }
    setFilter('Tất cả')
    closeOverlay()
    setTab('wardrobe')
  }
  const startMatch = () => {
    // Return to an existing session only when both its context and wardrobe snapshot match.
    if (session?.context.id === matchContext.id && session.items.length === items.length && session.items.every((item, index) => item === items[index])) {
      setContextError('')
      setMatchStage('cards')
      return
    }
    const next = createMatchSession(matchContext, items)
    if (!next) { setContextError('Cần ít nhất một áo, một quần hoặc váy, và một đôi giày trong tủ để tạo outfit demo.'); return }
    setSession(next)
    setContextError('')
    setMatchStage('cards')
  }
  const decide = (id: string, liked: boolean) => {
    if (!session) return
    const next = recordDecision(session, id, liked)
    setSession(next)
    if (next.index === next.outfits.length && next.selectedOutfitId) setMatchStage('result')
  }
  const reviewSelected = () => {
    if (!session) return
    const index = session.outfits.findIndex(outfit => outfit.id === session.selectedOutfitId)
    setSession({ ...session, index: Math.max(0, index) })
    setMatchStage('cards')
  }
  const openContext = (origin: 'wardrobe' | 'cards') => {
    setContextOrigin(origin)
    setContextError('')
    setTab('match')
    setMatchStage('context')
  }
  const selectedOutfit = session?.outfits.find(outfit => outfit.id === session.selectedOutfitId)
  const isMatchCard = tab === 'match' && matchStage === 'cards'
  const isContextScreen = tab === 'match' && matchStage === 'context'
  const isResultScreen = tab === 'match' && matchStage === 'result'
  return <div ref={frameRef} className={`app-frame ${isMatchCard ? 'match-mode' : ''} ${isContextScreen ? 'context-mode' : ''} ${isResultScreen ? 'result-mode' : ''} ${captureSheet || overlay === 'item' ? 'flow-dialog-open' : ''}`}>
    {!isMatchCard && !isContextScreen && !isResultScreen && <Header onBell={() => setOverlay('notifications')} />}
    <main inert={captureSheet || overlay === 'item'}>
      {tab === 'add' && <AddUpload photos={photos} agreed={agreed} onConsent={setAgreed} onFiles={handleFiles} onRemove={id => { setPhotos(current => current.filter(photo => photo.id !== id)); setUploadError('') }} onAnalyze={() => setCaptureSheet(true)} error={uploadError} reading={reading} pickerRef={pickerRef} hasDraft={!!draft} onReview={() => { setDetailMode('draft'); setOverlay('item') }} />}
      {tab === 'wardrobe' && <Wardrobe items={items} filter={filter} onFilter={setFilter} message={message} onItem={id => { setEditedItem(items.find(item => item.id === id) ?? null); setDetailMode('saved'); setOverlay('item') }} onMatch={() => openContext('wardrobe')} onAdd={() => changeTab('add')} />}
      {tab === 'match' && (matchStage === 'context' ? <ContextCollection context={matchContext} onChange={context => { setMatchContext(context); setContextError('') }} onBack={() => { if (contextOrigin === 'cards' && session) { setMatchContext(session.context); setMatchStage('cards') } else setTab('wardrobe') }} onViewOutfits={startMatch} error={contextError} onAdd={() => changeTab('add')} /> : matchStage === 'cards' && session ? <MatchCards key={session.id} session={session} onDecision={decide} onContext={() => openContext('cards')} onFinish={() => { if (session.selectedOutfitId) setMatchStage('result') }} onRestart={() => setSession({ ...session, index: 0 })} /> : session && selectedOutfit ? <ImpactResult session={session} outfit={selectedOutfit} onBack={reviewSelected} onReview={reviewSelected} /> : <div className="flow-empty"><p>Chưa có outfit được chọn.</p><Button className="primary wide" onClick={() => openContext('wardrobe')}>Chọn bối cảnh</Button></div>)}
      {tab === 'impact' && <Impact onShare={() => setOverlay('shareImpact')} />}
      {tab === 'community' && <Community onShare={() => setOverlay('shareCommunity')} />}
    </main>
    <BottomNav active={tab} onChange={changeTab} floating={isMatchCard} />
    {captureSheet && <CaptureSheet photos={photos} analyzeOutfit={analyzeOutfit} onOption={setAnalyzeOutfit} onRetake={() => { setCaptureSheet(false); pickerRef.current?.click() }} onOk={finishCapture} />}
    {overlay === 'item' && (analysisStatus !== 'idle' ? <div className="full-overlay white" role="dialog" aria-modal="true" aria-label="Chuẩn bị bản nháp demo"><Header title="AI đọc ảnh · demo" onBack={closeOverlay} /><div className="overlay-content"><div className="flow-empty">{analysisStatus === 'loading' ? <div role="status"><span className="loader" /><p>Đang chuẩn bị bản nháp demo...</p></div> : <div role="alert"><p>Không tạo được bản nháp. Ảnh đã chọn vẫn được giữ.</p><Button className="primary wide" onClick={finishCapture}>Thử lại</Button></div>}</div></div></div> : <ItemDetail key={detailMode === 'draft' ? draft?.id : editedItem?.id} items={detailMode === 'draft' ? draft?.items ?? [] : editedItem ? [editedItem] : []} photoCount={draft?.photos.length ?? 1} reviewing={detailMode === 'draft'} onChange={updateItem} onClose={closeOverlay} onSave={saveItems} />)}
    {overlay === 'edit' && <EditLook onClose={closeOverlay} />}
    {overlay === 'tryon' && <TryOn onClose={closeOverlay} />}
    {overlay === 'shareImpact' && <ShareImpact onClose={closeOverlay} />}
    {overlay === 'shareCommunity' && <ShareCommunity onClose={closeOverlay} />}
    {overlay === 'notifications' && <Notifications onClose={closeOverlay} onGear={() => setOverlay('settings')} />}
    {overlay === 'settings' && <Settings onClose={() => setOverlay('notifications')} onDelete={() => setOverlay('delete')} />}
    {overlay === 'delete' && <DeleteSheet onClose={() => setOverlay('settings')} />}
  </div>
}
