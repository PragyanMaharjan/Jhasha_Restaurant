import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import { afterEach, vi } from 'vitest';

// Cleanup after each test
afterEach(() => {
  cleanup();
});

// Mock Next.js router
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
    back: vi.fn(),
    pathname: '/',
    query: {},
    asPath: '/',
  }),
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(),
}));

// Mock environment variables
process.env.NEXT_PUBLIC_API_URL = 'http://localhost:5000/api';

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
global.localStorage = localStorageMock as any;

// Mock Cookies
vi.mock('js-cookie', () => ({
  default: {
    get: vi.fn(),
    set: vi.fn(),
    remove: vi.fn(),
  },
}));

// Mock react-icons/fa
vi.mock('react-icons/fa', () => ({
  FaSearch: () => null,
  FaFire: () => null,
  FaHeart: () => null,
  FaPlus: () => null,
  FaMinus: () => null,
  FaStar: () => null,
  FaBox: () => null,
  FaUsers: () => null,
  FaClipboardList: () => null,
  FaHome: () => null,
  FaUserTie: () => null,
  FaSignOutAlt: () => null,
  FaInfoCircle: () => null,
  FaUser: () => null,
  FaEnvelope: () => null,
  FaPhone: () => null,
  FaLock: () => null,
  FaUserPlus: () => null,
  FaEye: () => null,
  FaEyeSlash: () => null,
  FaCamera: () => null,
  FaSave: () => null,
  FaShoppingCart: () => null,
  FaUserShield: () => null,
  FaSignInAlt: () => null,
  FaMapMarkerAlt: () => null,
  FaCreditCard: () => null,
  FaStickyNote: () => null,
  FaCheckCircle: () => null,
  FaTruck: () => null,
  FaFileInvoice: () => null,
  FaArrowLeft: () => null,
  FaClock: () => null,
  FaShoppingBag: () => null,
  FaTrash: () => null,
  FaToggleOn: () => null,
  FaToggleOff: () => null,
  FaTimes: () => null,
  FaCalendarAlt: () => null,
  FaEdit: () => null,
  FaBriefcase: () => null,
  FaDollarSign: () => null,
  FaChartLine: () => null,
  FaArrowUp: () => null,
  FaArrowDown: () => null,
  FaUpload: () => null,
  FaFacebook: () => null,
  FaInstagram: () => null,
  FaTwitter: () => null,
  FaTrophy: () => null,
  FaTimesCircle: () => null,
  FaArrowRight: () => null,
  FaCity: () => null,
  FaMailBulk: () => null,
}));
