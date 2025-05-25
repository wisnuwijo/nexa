'use client';

import { ArrowLeftIcon, HomeIcon, MagnifyingGlassIcon, Squares2X2Icon, UserIcon } from '@heroicons/react/24/solid';
import { usePathname, useRouter } from 'next/navigation';

interface MainLayoutProps {
  children: React.ReactNode;
  appBarTitle: string;
  showNavBar: boolean;
}

export default function MainLayout(props: MainLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();

  const homeRoute:string[] = ['/home'];
  const extinguisherRoute:string[] = ['/extinguisher', '/extinguisher/sticker', '/extinguisher/sticker/create'];

  return (
    <div className="min-h-screen bg-gray-50 relative">
      {props.children}

      {/* App bar */}
      {
        props.appBarTitle != '' && (
            <div className="fixed top-0 left-0 right-0 py-2">
                <div className="max-w-[430px] bg-white border-l border-r border-b mx-auto">
                <div className="flex justify-left items-center p-2">
                    <button 
                    className="flex flex-col items-center left-0 text-gray-400 w-16"
                    onClick={() => router.back()}
                    >
                        <ArrowLeftIcon className="w-6 h-6 mb-0.5" />
                    </button>
                    <span className="text-gray-700 text-xl font-semibold">{props.appBarTitle}</span>
                </div>
                </div>
            </div>
        )
      }

      {/* Bottom Navigation */}
      {
        props.showNavBar && (
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t py-2">
                <div className="max-w-[430px] mx-auto px-6">
                    <div className="flex justify-between items-center">
                        <button 
                        className={`flex flex-col items-center w-16 ${homeRoute.includes(pathname) ? 'text-purple-600' : 'text-gray-400'}`}
                        onClick={() => router.push('/home')}
                        >
                            <HomeIcon className="w-6 h-6 mb-0.5" />
                            <span className="text-xs">Beranda</span>
                        </button>

                        <button 
                        className={`flex flex-col items-center w-16 ${extinguisherRoute.includes(pathname) ? 'text-purple-600' : 'text-gray-400'}`}
                        onClick={() => router.push('/extinguisher')}
                        >
                            <Squares2X2Icon className="w-6 h-6 mb-0.5" />
                            <span className="text-xs">APAR</span>
                        </button>

                        <button 
                        className={`flex flex-col items-center w-16 ${pathname === '/notification' ? 'text-purple-600' : 'text-gray-400'}`}
                        onClick={() => router.push('/inspection')}
                        >
                            <MagnifyingGlassIcon className="w-6 h-6 mb-0.5" />
                            <span className="text-xs">Inspeksi</span>
                        </button>

                        <button 
                        className={`flex flex-col items-center w-16 ${pathname === '/profile' ? 'text-purple-600' : 'text-gray-400'}`}
                        onClick={() => router.push('/profile')}
                        >
                            <UserIcon className="w-6 h-6 mb-0.5" />
                            <span className="text-xs">Profil</span>
                        </button>
                    </div>
                </div>
            </div>
        )
      }
    </div>
  );
}