import { Outlet } from 'react-router-dom';
import { ChatWidget } from '@/components/chat';

export function MainLayout() {
  return (
    <div className="relative min-h-screen bg-chat-bg">
      <Outlet />
      <ChatWidget />
    </div>
  );
}

export default MainLayout;
