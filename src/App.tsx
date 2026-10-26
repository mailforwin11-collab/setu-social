import { useIsMobile } from './hooks/useMediaQuery';
import DesktopLayout from './components/layout/DesktopLayout';
import MobileLayout from './components/layout/MobileLayout';
import './App.css';

export default function App() {
  const isMobile = useIsMobile(768);

  return isMobile ? <MobileLayout /> : <DesktopLayout />;
}
