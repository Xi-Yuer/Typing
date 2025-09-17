import DisplayHeader from '@/components/Header/Header';
import Sidebar from './components/Sidebar/Sidebar';
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <DisplayHeader activeItem='/dashboard' />
      <div className='flex h-screen w-full max-w-7xl mx-auto'>
        <Sidebar />
        <div className='flex-1 mx-3 p-4 rounded-xl text-white bg-slate-900 border border-slate-700 h-fit'>
          {children}
        </div>
      </div>
    </div>
  );
}
