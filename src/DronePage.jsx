import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  Play, Award, Shield, Users, MapPin, Phone, Mail, X, CheckCircle, 
  ExternalLink, Clock, ChevronRight, Menu, MessageCircle, User, 
  ChevronDown, Camera, Wrench, ArrowLeft, FileCheck, ChevronLeft, ZoomIn
} from 'lucide-react';

// =================================================================
// 1. 에셋 경로 자동 보정 엔진 (GitHub Pages 서브 경로 자동 결합)
// =================================================================
const getAssetUrl = (path) => {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  return `${import.meta.env.BASE_URL}${cleanPath}`;
};

// =================================================================
// 2. 인라인 SVG 컴포넌트 (버전/의존성 충돌 방지)
// =================================================================
const Instagram = ({ className = "w-5 h-5", ...props }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    className={className} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    {...props}
  >
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
  </svg>
);

const Sprout = ({ className = "w-5 h-5", ...props }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    className={className} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    {...props}
  >
    <path d="M7 20h10"/>
    <path d="M12 20v-8"/>
    <path d="M12 12A5 5 0 0 1 17 7h1a5 5 0 0 1-5 5z"/>
    <path d="M12 12A5 5 0 0 0 7 7H6a5 5 0 0 0 5 5z"/>
  </svg>
);

// =================================================================
// 3. 브이톨테크 공식 데이터 세팅
// =================================================================
const droneData = {
  company: {
    name: "(주)브이톨테크 드론교육원",
    ceo: "정재영",
    slogan: "미래 무인항공을 이끄는 VTOL & 드론 전문 교육기관",
    cert: "국토교통부 지정 전문교육기관",
    location: "경남 창원시 마산회원구 내서읍 함마대로 2640 9호관 309-좌호",
    fieldAddress: "석전주민운동장 (자체 실기 비행장)",
    phone: "010-4689-7548",
    email: "vtoltech@naver.com",
    kakaoUrl: "https://open.kakao.com/o/s5lQENYg",
    instagram: "@vtoltech_drone",
    instaUrl: "https://www.instagram.com/vtoltech_drone/"
  },
  
  // 메인 배경 로컬 비디오
  heroVideo: "/video/main.mp4",

  // 🌟 [인증서 데이터] 공식 명칭 1:1 매핑
  certImages: [
    { src: "/images/certification/1.jpg", title: "사업자등록증" },
    { src: "/images/certification/2.jpg", title: "초경량비행 장치사용 사업등록증" },
    { src: "/images/certification/3.jpg", title: "훈련이수증명(실기평가조종자)" },
    { src: "/images/certification/4.jpg", title: "마산대학교 협약서" }
  ],

  // 상단 내비게이션 메뉴 구조
  navCategories: [
    {
      id: "company",
      title: "회사소개",
      subMenus: [
        { name: "대표 인사말", pageId: "ceo", bgImg: "/images/main/전경 촬영 1.jpg" },
        { name: "교육원 특징", pageId: "about", bgImg: "/images/main/전경촬영 2.jpg" },
        { name: "인증 현황", pageId: "cert", bgImg: "/images/main/전경 촬영 3.jpg" },
        { name: "홍보 및 비행 영상", pageId: "media", bgImg: "/images/main/전경 촬영 4.jpg" },
        { name: "찾아오시는 길", pageId: "location", bgImg: "/images/main/전경 촬영 1.jpg" }
      ]
    },
    {
      id: "edu",
      title: "드론교육",
      subMenus: [
        { name: "VTOL 특화 과정", pageId: "edu-vtol", bgImg: "/images/edu-outdoor/야외 교육 2.jpg" },
        { name: "국가자격증 과정", pageId: "edu-national", bgImg: "/images/edu-outdoor/야외 교육 3.jpg" },
        { name: "지도조종자(교관) 과정", pageId: "edu-instructor", bgImg: "/images/edu-outdoor/야외 교육 4.jpg" },
        { name: "드론 농구 & 드론 축구", pageId: "edu-sports", bgImg: "/images/drone-sports/드론농구 1.jpg" }, 
        { name: "자체 실기 시험장", pageId: "edu-field", bgImg: "/images/edu-outdoor/야외 교육 5.jpg" },
        { name: "실내 이론 및 시뮬레이터 교육", pageId: "edu-indoor", bgImg: "/images/edu-indoor/실내 교육 1.jpg" },
        { name: "야외 실기 비행 교육", pageId: "edu-outdoor", bgImg: "/images/edu-outdoor/야외 교육 1.jpg" }
      ]
    },
    {
      id: "business",
      title: "사업분야",
      subMenus: [
        { name: "드론 교육", pageId: "biz-edu", bgImg: "/images/edu-indoor/실내 교육 1.jpg" },
        { name: "농업 방제 드론 운용", pageId: "biz-agri", bgImg: "/images/agri/농업 방제 2.jpg" },
        { name: "항공 촬영 영상제작", pageId: "biz-aerial", bgImg: "/images/main/전경 촬영 3.jpg" },
        { name: "드론 판매 & 기체 정비", pageId: "biz-maintenance", bgImg: "/images/edu-indoor/드론.jpg" }
      ]
    },
    {
      id: "contact",
      title: "실시간 상담",
      subMenus: [
        { name: "오픈카톡 1:1 실시간 상담", externalUrl: "https://open.kakao.com/o/s5lQENYg" },
        { name: "인스타그램 DM 문의", externalUrl: "https://www.instagram.com/vtoltech_drone/" }
      ]
    }
  ],

  // 교육과정 상세 데이터
  courses: [
    {
      id: "edu-vtol",
      cat: "VTOL 특화",
      title: "무인수직이착륙기(VTOL) 운용 과정",
      hours: "실무 집중 / 장거리 순항",
      target: "측량, 정찰, 공간정보 수집, 특수 산업용",
      desc: "수직이착륙의 편의성과 고정익의 고속 장거리 순항 능력을 결합한 차세대 VTOL 무인기 전문 조종자 양성 과정입니다.",
      features: [
        "수직 이착륙 및 고속 순항 자동 제어",
        "지상통제소(GCS) 자동 항법 및 미션 플래닝",
        "1:1 베테랑 전문가 전담 밀착 코칭",
        "실전 특수 미션(측량, 정찰) 드론 운용"
      ]
    },
    {
      id: "edu-national",
      cat: "국가자격증",
      title: "1종 & 2종 무인멀티콥터 조종자",
      hours: "비행경력 10시간~20시간",
      target: "취업, 농업 방제, 대형 산업용 드론, 공공기관",
      desc: "국토교통부 지정 전문교육기관으로, 익숙한 자체 실기 비행장에서 지도조종자의 지도하에 높은 합격률로 국가자격증을 취득합니다.",
      features: [
        "자체 시험장에서 실기 시험 직접 응시",
        "최신 인프라 및 전용 기체 완비",
        "평일반 / 주말반 / 맞춤 일정 지원",
        "이론 및 비행 시뮬레이터 교육 무료 제공"
      ]
    },
    {
      id: "edu-instructor",
      cat: "전문가과정",
      title: "지도조종자(교관) 및 실기평가 과정",
      hours: "비행경력 100시간 이상",
      target: "드론 교관 취업, 교육원 창업, 전문 평가관",
      desc: "드론 전문가로서 교육생을 지도하고 평가할 수 있는 상위 자격 과정으로, 실기평가 대비 특강 및 비행 교수법을 지도합니다.",
      features: [
        "100시간 비행 경력 증명 인정",
        "실기평가관 출신 교관의 노하우 집중 전수",
        "자격 취득 후 취업 및 교육원 창업 연계",
        "비행 교수법 및 교관 교육 실무 연수"
      ]
    },
    {
      id: "edu-sports",
      cat: "스포츠 특화",
      title: "드론 농구 & 드론 축구 전문 선수/지도자 과정",
      hours: "실내 리그전 및 실기 집중",
      target: "청소년 방과 후 지도, 동호회 활성화, 레저 스포츠 선수 양성",
      desc: "최첨단 탄소 보호구 내에 장착된 드론을 활용하여 골대에 넣는 신개념 팀 스포츠인 '드론 농구'와 '드론 축구'의 전술 및 조종 기술을 마스터하는 과정입니다.",
      features: [
        "드론 농구/축구 전용 기체 조종 및 슈팅·패스 정밀 제어 훈련",
        "공식 경기 규격에 맞춘 포메이션 및 실전 팀 플레이 전술",
        "경기 중 발생하는 충돌 대비 기체 자가 정비 및 하드웨어 수리",
        "지역 대회 출전 연계 및 레저 스포츠 전문 지도자 자격 취득"
      ],
      images: [
        "/images/drone-sports/드론농구 1.jpg",
        "/images/drone-sports/드론 축구 1.png",
        "/images/drone-sports/드론 축구 2.png"
      ]
    }
  ],

  // 사업 분야 개요
  businessAreas: [
    {
      id: "biz-edu",
      icon: Users,
      title: "드론 교육",
      desc: "국토교통부 지정 전문 교육기관으로서 1종~2종 국가자격증, VTOL 수직이착륙기 및 지도조종자(교관) 인재 양성 교육을 수행합니다."
    },
    {
      id: "biz-agri",
      icon: Sprout,
      title: "농업 방제 드론 운용",
      desc: "고성능 농업용 드론을 활용한 정밀 분무 방제, 비하 방지 대책 및 농가 맞춤형 방제 위탁 솔루션을 제공합니다.",
      images: [
        "/images/agri/농업 방제 1.jpg",
        "/images/agri/농업 방제 2.jpg",
        "/images/agri/농업 방제 3.jpg",
        "/images/agri/농업 방제 4.jpg",
        "/images/agri/농업 방제 5.jpg",
        "/images/agri/농업 방제 6.jpg"
      ]
    },
    {
      id: "biz-aerial",
      icon: Camera,
      title: "항공 촬영 영상제작",
      desc: "초고화질 4K/8K 카메라 및 짐벌 시스템을 탑재하여 홍보용 영상, 건설 현장 모니터링, 방송용 항공 촬영 프로젝트를 수행합니다."
    },
    {
      id: "biz-maintenance",
      icon: Wrench,
      title: "드론 판매 & 기체 정비",
      desc: "산업용/교육용 정품 드론 기체 유통 및 전문 정비 교관의 기체 커스터마이징, 정기 점검, 수리 서비스를 제공합니다."
    }
  ],

  // 홍보 영상 데이터
  promoVideos: [
    {
      id: "dYZg47ddagM",
      title: "브이톨테크 드론교육원 공식 홍보영상",
      category: "공식 홍보",
      desc: "최첨단 VTOL 기체 및 넓은 자체 실기 비행장 전경 안내"
    },
    {
      id: "sjpUFz-6ZHc",
      title: "VTOL 무인 수직이착륙기 실전 비행 시연",
      category: "VTOL 특화",
      desc: "장거리 순항 및 정밀 제어 VTOL 드론 교육 현장"
    },
    {
      id: "Bn20JEiJdC4",
      title: "산업용 드론 및 특수 미션 운용 시연",
      category: "산업/특수",
      desc: "고성능 센서 탑재 특수 드론 및 위탁 교육 과정"
    },
    {
      id: "GCYPEc71zBY",
      title: "드론 국가자격증 실기 시험장 코스 비행",
      category: "자격증 실기",
      desc: "자체 시험장에서의 1:1 밀착 코칭 및 실기 시험 코스 연습"
    }
  ]
};

export default function DronePage() {
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [hoveredNav, setHoveredNav] = useState(null);
  const [expandedMobileCategory, setExpandedMobileCategory] = useState(null);

  // 라이트박스 상태 관리
  const [lightboxImages, setLightboxImages] = useState([]);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  const openLightbox = (itemsArray, index) => {
    const formatted = itemsArray.map(item => (typeof item === 'string' ? item : item.src));
    setLightboxImages(formatted);
    setLightboxIndex(index);
    setIsLightboxOpen(true);
  };

  const nextImage = useCallback((e) => {
    if (e) e.stopPropagation();
    setLightboxIndex((prev) => (prev + 1) % lightboxImages.length);
  }, [lightboxImages.length]);

  const prevImage = useCallback((e) => {
    if (e) e.stopPropagation();
    setLightboxIndex((prev) => (prev - 1 + lightboxImages.length) % lightboxImages.length);
  }, [lightboxImages.length]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isLightboxOpen) return;
      if (e.key === 'Escape') setIsLightboxOpen(false);
      if (e.key === 'ArrowRight') nextImage();
      if (e.key === 'ArrowLeft') prevImage();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isLightboxOpen, nextImage, prevImage]);

  useEffect(() => {
    const syncRouteFromHash = () => {
      try {
        const rawHash = window.location.hash.replace('#', '');
        const pageTarget = rawHash.trim() === '' ? 'home' : rawHash;
        setCurrentPage(pageTarget);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } catch (err) {
        console.error("Hash sync error:", err);
      }
    };

    syncRouteFromHash();
    window.addEventListener('hashchange', syncRouteFromHash);
    return () => window.removeEventListener('hashchange', syncRouteFromHash);
  }, []);

  const handleNavigate = (pageId, externalUrl = null) => {
    if (externalUrl) {
      window.open(externalUrl, '_blank');
      return;
    }
    window.location.hash = pageId === 'home' ? '' : `#${pageId}`;
    setMobileMenuOpen(false);
    setHoveredNav(null);
  };

  const handleCategoryClick = (cat) => {
    if (cat.subMenus && cat.subMenus.length > 0) {
      const firstSub = cat.subMenus[0];
      handleNavigate(firstSub.pageId, firstSub.externalUrl);
    }
  };

  const currentNavContext = useMemo(() => {
    if (currentPage === 'home') return null;
    for (const cat of droneData.navCategories) {
      const match = cat.subMenus.find(sub => sub.pageId === currentPage);
      if (match) {
        return {
          categoryTitle: cat.title,
          activeSubName: match.name,
          subMenus: cat.subMenus,
          bgImg: match.bgImg || "/images/main/전경 촬영 1.jpg"
        };
      }
    }
    return {
      categoryTitle: "상세 안내",
      activeSubName: "페이지",
      subMenus: [],
      bgImg: "/images/main/전경 촬영 1.jpg"
    };
  }, [currentPage]);

  // 🛡️ [스마트 동적 갤러리 그리드]
  const renderGalleryGrid = (items) => {
    if (!items || !Array.isArray(items) || items.length === 0) return null;
    
    const isOddTotal = items.length % 2 !== 0;

    return (
      <div className="grid sm:grid-cols-2 gap-4">
        {items.map((item, imgIdx) => {
          const isLastAndOdd = isOddTotal && imgIdx === items.length - 1;
          const imgPath = typeof item === 'string' ? item : item.src;
          const displayTitle = typeof item === 'string' 
            ? (isLastAndOdd ? `하이라이트 현장 보기 (${imgIdx + 1})` : `갤러리 ${imgIdx + 1}`)
            : item.title;

          return (
            <div 
              key={imgIdx} 
              onClick={() => openLightbox(items, imgIdx)}
              className={`bg-slate-900 rounded-2xl overflow-hidden aspect-video cursor-pointer group relative shadow-md hover:shadow-xl transition-all ${
                isLastAndOdd ? 'sm:col-span-2 aspect-[21/9]' : ''
              }`}
            >
              <img 
                src={getAssetUrl(imgPath)} 
                alt={displayTitle} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90" 
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  if(e.currentTarget.nextSibling) e.currentTarget.nextSibling.style.display = 'flex';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent flex flex-col justify-end p-4">
                <span className="text-white font-bold text-sm tracking-tight drop-shadow-sm">
                  {displayTitle}
                </span>
              </div>
              <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/40 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                <ZoomIn className="w-4 h-4" />
              </div>
              <div className="hidden w-full h-full items-center justify-center text-xs text-slate-400 p-4 text-center">
                [{displayTitle}]
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans break-keep selection:bg-sky-600 selection:text-white">
      
      {/* --- [0. 이미지 전체화면 확대 라이트박스] --- */}
      {isLightboxOpen && lightboxImages.length > 0 && (
        <div 
          className="fixed inset-0 z-[200] bg-black/90 backdrop-blur-md flex items-center justify-center p-4 md:p-12 animate-in fade-in duration-200"
          onClick={() => setIsLightboxOpen(false)}
        >
          <button 
            onClick={() => setIsLightboxOpen(false)}
            className="absolute top-6 right-6 z-20 p-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition-all border border-white/20"
            title="닫기"
          >
            <X className="w-6 h-6" />
          </button>

          {lightboxImages.length > 1 && (
            <button 
              onClick={prevImage}
              className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-20 p-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition-all border border-white/20"
              title="이전 이미지"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
          )}

          <div 
            className="relative max-w-5xl max-h-[85vh] w-full h-full flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <img 
              src={getAssetUrl(lightboxImages[lightboxIndex])} 
              alt="확대 이미지" 
              className="max-w-full max-h-[85vh] object-contain rounded-2xl shadow-2xl cursor-pointer"
              onClick={() => setIsLightboxOpen(false)}
            />
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-black/60 text-white/90 rounded-full text-xs font-semibold backdrop-blur-sm">
              {lightboxIndex + 1} / {lightboxImages.length}
            </div>
          </div>

          {lightboxImages.length > 1 && (
            <button 
              onClick={nextImage}
              className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-20 p-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition-all border border-white/20"
              title="다음 이미지"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          )}
        </div>
      )}

      {/* --- [1. 상단 내비게이션 바] --- */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          
          <button onClick={() => handleNavigate('home')} className="group text-left">
            <span className="text-lg md:text-xl font-black tracking-wider text-slate-900 block leading-none">VTOL TECH</span>
            <span className="text-[10px] text-sky-600 font-bold uppercase tracking-widest block mt-1">드론교육원</span>
          </button>

          <nav className="hidden lg:flex items-center gap-2 h-full">
            <button 
              onClick={() => handleNavigate('home')}
              className={`px-4 py-2 font-bold text-sm transition-colors ${currentPage === 'home' ? 'text-sky-600 font-black' : 'text-slate-700 hover:text-sky-600'}`}
            >
              홈
            </button>

            {droneData.navCategories.map((cat) => (
              <div
                key={cat.id}
                className="relative h-full flex items-center px-2"
                onMouseEnter={() => setHoveredNav(cat.id)}
                onMouseLeave={() => setHoveredNav(null)}
              >
                <button 
                  onClick={() => handleCategoryClick(cat)}
                  className="flex items-center gap-1.5 font-bold text-sm text-slate-700 hover:text-sky-600 py-2 transition-colors"
                >
                  <span>{cat.title}</span>
                  <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${hoveredNav === cat.id ? 'rotate-180 text-sky-600' : 'text-slate-400'}`} />
                </button>

                {hoveredNav === cat.id && (
                  <div className="absolute top-full left-1/2 -translate-x-1/2 w-56 bg-white border border-slate-200 rounded-2xl p-2 shadow-xl duration-200">
                    <div className="py-1">
                      {cat.subMenus.map((sub, sIdx) => (
                        <button
                          key={sIdx}
                          onClick={() => handleNavigate(sub.pageId, sub.externalUrl)}
                          className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-semibold transition-all flex items-center justify-between group ${
                            currentPage === sub.pageId 
                              ? 'bg-sky-50 text-sky-700 font-bold' 
                              : 'text-slate-700 hover:text-sky-700 hover:bg-slate-50'
                          }`}
                        >
                          <span>{sub.name}</span>
                          <ChevronRight className={`w-3.5 h-3.5 transition-opacity ${currentPage === sub.pageId ? 'opacity-100 text-sky-600' : 'opacity-0 group-hover:opacity-100 text-slate-400'}`} />
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </nav>

          <div className="hidden lg:flex items-center gap-3">
            <a 
              href={droneData.company.kakaoUrl} 
              target="_blank" 
              rel="noreferrer" 
              className="flex items-center gap-2 text-xs font-bold text-amber-800 bg-amber-50 px-4 py-2.5 rounded-xl border border-amber-200 hover:bg-amber-100 transition-all shadow-sm"
            >
              <MessageCircle className="w-4 h-4 fill-amber-500 text-transparent" />
              <span>오픈카톡 상담</span>
            </a>
            <a 
              href={`tel:${droneData.company.phone}`} 
              className="flex items-center gap-2 text-xs font-bold text-sky-700 bg-sky-50 px-4 py-2.5 rounded-xl border border-sky-200 hover:bg-sky-100 transition-all"
            >
              <Phone className="w-4 h-4" />
              <span>{droneData.company.phone}</span>
            </a>
          </div>

          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-slate-700 hover:text-slate-900 rounded-xl bg-slate-100 border border-slate-200"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-b border-slate-200 px-6 py-4 space-y-3 font-semibold text-slate-700 max-h-[80vh] overflow-y-auto">
            <button 
              onClick={() => handleNavigate('home')} 
              className="w-full text-left py-2 font-bold text-sky-600 text-base border-b border-slate-100"
            >
              🏠 메인 홈으로 이동
            </button>

            {droneData.navCategories.map((cat) => (
              <div key={cat.id} className="border-b border-slate-100 pb-2 last:border-0">
                <div className="flex items-center justify-between py-2 text-left font-bold text-slate-900 text-base">
                  <button 
                    onClick={() => handleCategoryClick(cat)}
                    className="hover:text-sky-600 transition-colors"
                  >
                    {cat.title}
                  </button>
                  <button 
                    onClick={() => setExpandedMobileCategory(expandedMobileCategory === cat.id ? null : cat.id)}
                    className="p-1 text-slate-400"
                  >
                    <ChevronDown className={`w-4 h-4 transition-transform ${expandedMobileCategory === cat.id ? 'rotate-180 text-sky-600' : ''}`} />
                  </button>
                </div>

                {expandedMobileCategory === cat.id && (
                  <div className="pl-4 py-2 space-y-2 bg-slate-50 rounded-xl my-1">
                    {cat.subMenus.map((sub, sIdx) => (
                      <button
                        key={sIdx}
                        onClick={() => handleNavigate(sub.pageId, sub.externalUrl)}
                        className={`w-full text-left py-1.5 text-xs font-medium block ${
                          currentPage === sub.pageId ? 'text-sky-600 font-bold' : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        • {sub.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}

            <div className="pt-2 flex flex-col gap-2">
              <a 
                href={droneData.company.kakaoUrl} 
                target="_blank" 
                rel="noreferrer"
                className="w-full py-3 text-center text-amber-800 bg-amber-50 border border-amber-200 rounded-xl font-bold text-sm block"
              >
                오픈카카오톡 1:1 실시간 상담
              </a>
              <a 
                href={droneData.company.instaUrl} 
                target="_blank" 
                rel="noreferrer"
                className="w-full py-3 text-center text-pink-800 bg-pink-50 border border-pink-200 rounded-xl font-bold text-sm block"
              >
                인스타그램 DM 문의하기
              </a>
            </div>
          </div>
        )}
      </header>

      {/* --- [2. 유튜브 비디오 팝업 모달] --- */}
      {selectedVideo && (
        <div className="fixed inset-0 z-[100] bg-slate-900/80 backdrop-blur-md flex items-center justify-center p-4 md:p-8 duration-200">
          <div className="relative w-full max-w-4xl bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-2xl">
            <div className="flex justify-between items-center p-6 border-b border-slate-100 bg-slate-50">
              <div>
                <span className="text-xs font-bold text-sky-600 uppercase tracking-wider">{selectedVideo.category}</span>
                <h3 className="text-lg font-bold text-slate-900 mt-0.5">{selectedVideo.title}</h3>
              </div>
              <button 
                onClick={() => setSelectedVideo(null)}
                className="p-2 bg-white hover:bg-slate-200 text-slate-600 rounded-full transition-all border border-slate-200"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="relative aspect-video w-full bg-black">
              <iframe
                className="w-full h-full"
                src={`https://www.youtube.com/embed/${selectedVideo.id}?autoplay=1`}
                title={selectedVideo.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}

      {/* --- [3. 메인 랜딩 화면] --- */}
      {currentPage === 'home' && (
        <>
          <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden border-b border-slate-200 py-20 bg-slate-950">
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-900/80 to-slate-900/40 z-10" />
            
            <div className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden flex items-center justify-center">
              <video
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover opacity-50 scale-105"
              >
                <source src={getAssetUrl(droneData.heroVideo)} type="video/mp4" />
              </video>
            </div>

            <div className="relative z-20 max-w-6xl mx-auto px-6 w-full text-white">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-sky-500/20 border border-sky-400/40 text-sky-300 rounded-full text-xs font-bold tracking-widest uppercase mb-6 backdrop-blur-md">
                <Award className="w-4 h-4" /> {droneData.company.cert}
              </span>
              
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight leading-normal md:leading-tight mb-8">
                <span className="block mb-3 sm:mb-4">미래를 날리는 전문 조종자,</span>
                <span className="block text-sky-400 opacity-100 mt-2 font-black">
                  {droneData.company.name}
                </span>
              </h1>

              <p className="text-slate-200 text-base sm:text-lg md:text-xl max-w-2xl mb-10 leading-relaxed font-medium">
                {droneData.company.slogan}. 자체 실기 시험장과 최신 VTOL 기체 완비로 최상위 합격률을 약속합니다.
              </p>
              
              <div className="flex flex-wrap gap-4">
                <button 
                  onClick={() => setSelectedVideo(droneData.promoVideos[0])}
                  className="px-8 py-4 bg-sky-600 hover:bg-sky-500 text-white font-bold rounded-xl transition-all flex items-center gap-3 shadow-lg shadow-sky-600/30 hover:-translate-y-0.5 active:translate-y-0"
                >
                  <Play className="w-5 h-5 fill-current" /> 홍보영상 시청
                </button>
                <a 
                  href={droneData.company.kakaoUrl} 
                  target="_blank" 
                  rel="noreferrer"
                  className="px-8 py-4 bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/40 text-amber-300 font-bold rounded-xl transition-all flex items-center gap-2 backdrop-blur-md"
                >
                  <MessageCircle className="w-5 h-5 fill-amber-300 text-transparent" />
                  <span>오픈카톡 상담 연결</span>
                </a>
              </div>
            </div>
          </section>

          <section className="py-20 bg-white border-b border-slate-200">
            <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-3 gap-8">
              <div 
                onClick={() => handleNavigate('about')}
                className="p-8 bg-slate-50 border border-slate-200 rounded-3xl hover:border-sky-500 hover:shadow-md transition-all cursor-pointer group"
              >
                <Award className="w-10 h-10 text-sky-600 mb-6 group-hover:scale-110 transition-transform" />
                <h3 className="text-xl font-bold mb-2 text-slate-900">자체 시험장 높은 합격률</h3>
                <p className="text-slate-600 text-sm leading-relaxed mb-4">
                  연습하던 환경 그대로 자체 비행장에서 시험을 치러 수강생의 최상위 합격률을 보장합니다.
                </p>
                <span className="text-xs font-bold text-sky-600 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  특징 자세히 보기 <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </div>

              <div 
                onClick={() => handleNavigate('edu-vtol')}
                className="p-8 bg-slate-50 border border-slate-200 rounded-3xl hover:border-sky-500 hover:shadow-md transition-all cursor-pointer group"
              >
                <Users className="w-10 h-10 text-sky-600 mb-6 group-hover:scale-110 transition-transform" />
                <h3 className="text-xl font-bold mb-2 text-slate-900">VTOL 전문 1:1 코칭</h3>
                <p className="text-slate-600 text-sm leading-relaxed mb-4">
                  일반 멀티콥터 외 차세대 무인수직이착륙기(VTOL) 운용 기술 및 베테랑 교관 1:1 전담 마크.
                </p>
                <span className="text-xs font-bold text-sky-600 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  교육과정 자세히 보기 <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </div>

              <div 
                onClick={() => handleNavigate('biz-edu')}
                className="p-8 bg-slate-50 border border-slate-200 rounded-3xl hover:border-sky-500 hover:shadow-md transition-all cursor-pointer group"
              >
                <Shield className="w-10 h-10 text-sky-600 mb-6 group-hover:scale-110 transition-transform" />
                <h3 className="text-xl font-bold mb-2 text-slate-900">다양한 사업 솔루션</h3>
                <p className="text-slate-600 text-sm leading-relaxed mb-4">
                  드론 전문 교육부터 농업 방제, 항공 촬영 제작, 드론 판매 및 정비 서비스까지 원스톱 제공.
                </p>
                <span className="text-xs font-bold text-sky-600 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  사업분야 자세히 보기 <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          </section>
        </>
      )}

      {/* --- [4. 서브페이지 레이아웃] --- */}
      {currentPage !== 'home' && currentNavContext && (
        <div className="duration-300">
          
          <div className="relative py-20 bg-slate-900 border-b border-slate-800 overflow-hidden">
            <div className="absolute inset-0 z-0">
              <img 
                src={getAssetUrl(currentNavContext.bgImg)} 
                alt={currentNavContext.activeSubName} 
                className="w-full h-full object-cover opacity-45 scale-105"
                onError={(e) => { e.currentTarget.style.display = 'none'; }}
              />
            </div>
            <div className="absolute inset-0 bg-slate-950/75 backdrop-blur-[2px] z-10" />

            <div className="relative z-20 max-w-6xl mx-auto px-6 text-white">
              <div className="flex items-center gap-2 text-xs text-slate-300 mb-4 font-semibold">
                <button onClick={() => handleNavigate('home')} className="hover:text-sky-400 flex items-center gap-1">
                  홈
                </button>
                <ChevronRight className="w-3 h-3 text-slate-500" />
                <span className="text-slate-300">{currentNavContext.categoryTitle}</span>
                <ChevronRight className="w-3 h-3 text-slate-500" />
                <span className="text-sky-400 font-bold">{currentNavContext.activeSubName}</span>
              </div>

              <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                  <span className="text-xs font-bold text-sky-400 uppercase tracking-widest block mb-2">{currentNavContext.categoryTitle}</span>
                  <h1 className="text-3xl md:text-4xl font-black text-white">{currentNavContext.activeSubName}</h1>
                </div>

                <button 
                  onClick={() => handleNavigate('home')}
                  className="inline-flex items-center gap-2 text-xs font-bold text-slate-200 hover:text-white bg-white/10 hover:bg-white/20 border border-white/20 px-4 py-2.5 rounded-xl transition-all shadow-sm backdrop-blur-md self-start md:self-auto"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>메인 홈으로 돌아가기</span>
                </button>
              </div>
            </div>
          </div>

          <div className="max-w-6xl mx-auto px-6 py-16 grid lg:grid-cols-4 gap-12">
            
            <aside className="lg:col-span-1">
              <div className="bg-white border border-slate-200 rounded-3xl p-6 sticky top-28 shadow-sm">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 pb-3 border-b border-slate-100">
                  {currentNavContext.categoryTitle} 메뉴
                </h3>
                <nav className="space-y-1">
                  {currentNavContext.subMenus.map((sub, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleNavigate(sub.pageId, sub.externalUrl)}
                      className={`w-full text-left px-4 py-3 rounded-2xl text-xs font-bold transition-all flex items-center justify-between ${
                        currentPage === sub.pageId
                          ? 'bg-sky-600 text-white shadow-md shadow-sky-600/20'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                      }`}
                    >
                      <span>{sub.name}</span>
                      <ChevronRight className={`w-3.5 h-3.5 ${currentPage === sub.pageId ? 'opacity-100' : 'opacity-40'}`} />
                    </button>
                  ))}
                </nav>
              </div>
            </aside>

            <main className="lg:col-span-3 space-y-12">
              
              {currentPage === 'ceo' && (
                <div className="bg-white border border-slate-200 rounded-3xl p-8 md:p-10 space-y-8 shadow-sm">
                  <div className="border-b border-slate-100 pb-6">
                    <span className="text-xs font-bold text-sky-600 uppercase tracking-widest block mb-2">CEO Greeting</span>
                    <h2 className="text-2xl md:text-3xl font-bold text-slate-900">미래 무인항공 산업을 선도하는 정직한 교육</h2>
                  </div>

                  <div className="space-y-4 text-slate-700 leading-relaxed text-sm md:text-base">
                    <p>안녕하십니까, <strong className="text-slate-900">(주)브이톨테크 드론교육원 대표 정재영</strong>입니다.</p>
                    <p>
                      4차 산업혁명의 중심에 있는 무인항공기(드론) 기술은 이제 단순한 취미나 조종을 넘어, 측량, 농업, 방제, 재난 구조, 군사 정찰 등 산업 전반의 필수 핵심 인프라로 자리 잡았습니다.
                    </p>
                    <p>
                      저희 브이톨테크 드론교육원은 국토교통부 지정 전문교육기관으로서, 수강생 여러분이 실제 시험을 치르는 자체 실기 비행장과 최신 수직이착륙(VTOL) 기체를 완비하고 있습니다. 베테랑 교관진의 1:1 밀착 코칭을 통해 최고의 합격률과 실무 역량을 약속드립니다.
                    </p>
                  </div>

                  <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <span className="text-xs text-slate-400 font-bold block">대표이사 / 원장</span>
                      <span className="text-lg font-bold text-slate-900">{droneData.company.ceo}</span>
                    </div>
                    <div className="px-4 py-2 bg-sky-50 border border-sky-200 text-sky-700 text-xs font-bold rounded-xl">
                      {droneData.company.cert}
                    </div>
                  </div>
                </div>
              )}

              {currentPage === 'about' && (
                <div className="space-y-8">
                  <div className="bg-white border border-slate-200 rounded-3xl p-8 space-y-6 shadow-sm">
                    <h2 className="text-2xl font-bold text-slate-900">브이톨테크 드론교육원 핵심 경쟁력</h2>
                    <div className="grid md:grid-cols-2 gap-6 pt-4">
                      <div className="p-6 bg-slate-50 border border-slate-200 rounded-2xl">
                        <Award className="w-8 h-8 text-sky-600 mb-4" />
                        <h3 className="text-lg font-bold mb-2 text-slate-900">자체 시험장 보유</h3>
                        <p className="text-slate-600 text-xs leading-relaxed">
                          훈련받던 익숙한 기체와 장소에서 실기 평가를 치르므로 비행 긴장감을 최소화하고 최상의 합격률을 기록합니다.
                        </p>
                      </div>
                      <div className="p-6 bg-slate-50 border border-slate-200 rounded-2xl">
                        <Users className="w-8 h-8 text-sky-600 mb-4" />
                        <h3 className="text-lg font-bold mb-2 text-slate-900">1:1 베테랑 전담 지도</h3>
                        <p className="text-slate-600 text-xs leading-relaxed">
                          수강생 개인별 비행 감각에 맞춘 맞춤형 스케줄링과 비행 시뮬레이터 시스템을 사전에 무제한 지원합니다.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 🌟 인증 현황 4대 공식 명칭 갤러리 렌더링 */}
              {currentPage === 'cert' && (
                <div className="bg-white border border-slate-200 rounded-3xl p-8 space-y-8 shadow-sm">
                  <div>
                    <span className="text-xs font-bold text-sky-600 uppercase tracking-widest block mb-1">Certification</span>
                    <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">기관 지정 및 자격 인증서</h2>
                    <p className="text-slate-600 text-sm leading-relaxed">
                      국토교통부 지정 전문교육기관 공식 인증서 및 임직원 국가 자격 증명서입니다.
                    </p>
                  </div>
                  {renderGalleryGrid(droneData.certImages)}
                </div>
              )}

              {currentPage === 'media' && (
                <div className="space-y-8">
                  <div className="bg-white border border-slate-200 rounded-3xl p-8 space-y-6 shadow-sm">
                    <span className="text-xs font-bold text-sky-600 uppercase tracking-widest block mb-1">Company Media</span>
                    <h2 className="text-2xl md:text-3xl font-bold text-slate-900">홍보 및 비행 영상 갤러리</h2>
                    <p className="text-slate-600 text-sm">브이톨테크의 교육 현장과 실제 VTOL 비행 영상입니다.</p>

                    <div className="grid sm:grid-cols-2 gap-6 pt-4">
                      {droneData.promoVideos.map((video) => (
                        <div 
                          key={video.id}
                          onClick={() => setSelectedVideo(video)}
                          className="group cursor-pointer bg-white border border-slate-200 rounded-2xl overflow-hidden hover:border-sky-500 transition-all shadow-sm hover:shadow-md"
                        >
                          <div className="relative aspect-video bg-slate-100 overflow-hidden">
                            <img 
                              src={`https://img.youtube.com/vi/${video.id}/hqdefault.jpg`} 
                              alt={video.title} 
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-black/30 flex items-center justify-center group-hover:bg-black/10 transition-all">
                              <div className="w-12 h-12 bg-sky-600 text-white rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                                <Play className="w-5 h-5 fill-current ml-0.5" />
                              </div>
                            </div>
                          </div>
                          <div className="p-4">
                            <span className="text-[10px] font-bold text-sky-600 uppercase block mb-1">{video.category}</span>
                            <h3 className="text-sm font-bold mb-1 text-slate-900 group-hover:text-sky-600 transition-colors">{video.title}</h3>
                            <p className="text-slate-500 text-xs">{video.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {currentPage === 'location' && (
                <div className="bg-white border border-slate-200 rounded-3xl p-8 space-y-8 shadow-sm">
                  <h2 className="text-2xl font-bold text-slate-900">교육원 위치 및 비행장 안내</h2>
                  <div className="space-y-6">
                    <div className="p-6 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
                      <span className="text-xs font-bold text-sky-600 uppercase">본원 (이론 및 상담)</span>
                      <h3 className="text-lg font-bold text-slate-900">{droneData.company.location}</h3>
                      <p className="text-xs text-slate-600">• 직통 문의: {droneData.company.phone}</p>
                    </div>

                    <div className="p-6 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
                      <span className="text-xs font-bold text-sky-600 uppercase">자체 실기 비행장</span>
                      <h3 className="text-lg font-bold text-slate-900">{droneData.company.fieldAddress}</h3>
                      <p className="text-xs text-slate-600">• 야외 드론 자격증 실기 시험 코스 연습장 및 시험 응시장</p>
                    </div>
                  </div>
                </div>
              )}

              {currentPage === 'edu-indoor' && (
                <div className="bg-white border border-slate-200 rounded-3xl p-8 space-y-8 shadow-sm">
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-2">실내 이론 및 시뮬레이터 교육</h2>
                    <p className="text-slate-600 text-sm leading-relaxed">
                      체계적인 학과 교육과 최신 시뮬레이터 장비를 통한 조종 감각 배양 현장입니다.
                    </p>
                  </div>

                  {renderGalleryGrid([
                    "/images/edu-indoor/실내 교육 1.jpg",
                    "/images/edu-indoor/실내 교육 2.jpg",
                    "/images/edu-indoor/실내 교육 3.jpg",
                    "/images/edu-indoor/드론.jpg"
                  ])}
                </div>
              )}

              {currentPage === 'edu-outdoor' && (
                <div className="bg-white border border-slate-200 rounded-3xl p-8 space-y-8 shadow-sm">
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-2">야외 실기 비행 교육</h2>
                    <p className="text-slate-600 text-sm leading-relaxed">
                      자체 실기 비행장에서 베테랑 교관의 1:1 입체 코칭으로 진행되는 실전 비행 조종 훈련 현장입니다.
                    </p>
                  </div>

                  {renderGalleryGrid([
                    "/images/edu-outdoor/야외 교육 1.jpg",
                    "/images/edu-outdoor/야외 교육 2.jpg",
                    "/images/edu-outdoor/야외 교육 3.jpg",
                    "/images/edu-outdoor/야외 교육 4.jpg",
                    "/images/edu-outdoor/야외 교육 5.jpg",
                    "/images/edu-outdoor/야외 교육 6.jpg",
                    "/images/edu-outdoor/야외 교육 7.jpg",
                    "/images/edu-outdoor/야외 교육 8.jpg",
                    "/images/edu-outdoor/드론 조종 1.jpg",
                    "/images/edu-outdoor/드론 조종 2.png",
                    "/images/edu-outdoor/드론 조종기.jpg"
                  ])}
                </div>
              )}

              {/* 교육과정 개별 탭 */}
              {(currentPage === 'edu-vtol' || currentPage === 'edu-national' || currentPage === 'edu-instructor' || currentPage === 'edu-sports') && (
                <div className="space-y-8">
                  {droneData.courses.filter(c => c.id === currentPage).map((course) => (
                    <div key={course.id} className="bg-white border border-slate-200 rounded-3xl p-8 space-y-8 shadow-sm">
                      <div>
                        <span className="text-xs font-bold text-sky-700 uppercase px-3 py-1 bg-sky-50 rounded-full border border-sky-200 mb-3 inline-block">
                          {course.cat}
                        </span>
                        <h2 className="text-3xl font-bold text-slate-900 mb-3">{course.title}</h2>
                        <p className="text-slate-600 text-sm leading-relaxed">{course.desc}</p>
                      </div>

                      <div className="p-6 bg-slate-50 border border-slate-200 rounded-2xl space-y-4">
                        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                          <CheckCircle className="w-5 h-5 text-sky-600" /> 주요 커리큘럼 특징
                        </h3>
                        <div className="grid md:grid-cols-2 gap-3">
                          {course.features.map((ft, idx) => (
                            <div key={idx} className="p-3 bg-white border border-slate-200 rounded-xl text-xs text-slate-700 font-semibold flex items-center gap-2">
                              <span className="w-1.5 h-1.5 rounded-full bg-sky-600" />
                              <span>{ft}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* 드론 농구 & 축구 전용 갤러리 */}
                      {course.images && course.images.length > 0 && (
                        <div className="space-y-4 pt-6 border-t border-slate-100">
                          <h3 className="text-lg font-bold text-slate-900">드론 농구 & 드론 축구 훈련 갤러리</h3>
                          {renderGalleryGrid(course.images)}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {currentPage === 'edu-field' && (
                <div className="bg-white border border-slate-200 rounded-3xl p-8 space-y-8 shadow-sm">
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-2">자체 실기 시험장 시설 안내</h2>
                    <p className="text-slate-600 text-sm leading-relaxed">
                      브이톨테크 드론교육원은 넓은 전용 비행장과 안전망 시설을 완비하여 수강생들이 편안하게 비행 연습을 진행할 수 있으며, 교육받은 동일한 장소에서 실기 평가를 치릅니다.
                    </p>
                  </div>

                  <div className="p-6 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-700 space-y-2">
                    <p>• 위치: {droneData.company.fieldAddress}</p>
                    <p>• 구비 시설: 규격 실기 비행장 코스 라인, 풍향계, 안전 대기소, 기체 점검 테이블</p>
                  </div>
                </div>
              )}

              {(currentPage === 'biz-edu' || currentPage === 'biz-agri' || currentPage === 'biz-aerial' || currentPage === 'biz-maintenance') && (
                <div className="space-y-8">
                  {droneData.businessAreas.filter(b => b.id === currentPage).map((biz) => {
                    const IconComp = biz.icon || Shield;
                    return (
                      <div key={biz.id} className="bg-white border border-slate-200 rounded-3xl p-8 space-y-6 shadow-sm">
                        <div className="w-14 h-14 bg-sky-50 border border-sky-200 text-sky-600 rounded-2xl flex items-center justify-center">
                          <IconComp className="w-7 h-7" />
                        </div>
                        <h2 className="text-3xl font-bold text-slate-900">{biz.title}</h2>
                        <p className="text-slate-700 leading-relaxed text-sm md:text-base">{biz.desc}</p>
                        
                        {biz.images && biz.images.length > 0 && (
                          <div className="space-y-4 pt-6 border-t border-slate-100">
                            <h3 className="text-lg font-bold text-slate-900">농업 방제 현장 갤러리</h3>
                            {renderGalleryGrid(biz.images)}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

            </main>
          </div>
        </div>
      )}

      {/* --- [5. 푸터] --- */}
      <footer className="py-8 bg-white border-t border-slate-200 text-center text-xs text-slate-500 space-y-2">
        <p>{droneData.company.name} | 대표: {droneData.company.ceo} | 주소: {droneData.company.location} | 연락처: {droneData.company.phone}</p>
        <p>© 2026 {droneData.company.name}. All rights reserved.</p>
      </footer>

    </div>
  );
}