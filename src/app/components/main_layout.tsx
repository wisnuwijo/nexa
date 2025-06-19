'use client';

import { ArrowLeftIcon, HomeIcon, MagnifyingGlassIcon, Squares2X2Icon, UserIcon, UsersIcon } from '@heroicons/react/24/solid';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

interface MainLayoutProps {
  children: React.ReactNode;
  appBarTitle: string;
  showNavBar: boolean;
}

export default function MainLayout(props: MainLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();

  const homeRoutePrefix: string = '/home';
  const extinguisherRoutePrefix: string = '/extinguisher';
  const inspectionRoutePrefix: string = '/inspection';
  const usersRoutePrefix: string = '/users';

  return (
    <div>
      {/* Handle desktop view */}
      <div className="hidden md:flex h-screen overflow-hidden text-gray-500">
        <aside className="w-64 bg-white shadow-md hidden md:flex flex-col border-r">
          <div className="p-4 border-b text-gray-400">
            <h2 className="text-2xl font-bold mb-2 text-purple-600">NEXA</h2>
          </div>

          <div className="overflow-y-auto flex-1 p-4">
            <nav>
              <ul className="space-y-2">
                <li>
                  <Link href="/home" className={`flex items-center p-2 ${pathname.startsWith(homeRoutePrefix) ? 'text-purple-600 bg-purple-100' : 'text-gray-600'} hover:bg-blue-100 rounded-lg transition`}>
                    <HomeIcon className="w-6 h-6 mb-0.5 mr-3" />
                    <span className="text-xs">Beranda</span>
                  </Link>
                </li>
                <li>
                  <Link href="/extinguisher" className={`flex items-center p-2 ${pathname.startsWith(extinguisherRoutePrefix) ? 'text-purple-600 bg-purple-100' : 'text-gray-600'} hover:bg-blue-100 rounded-lg transition`}>
                    <Squares2X2Icon className="w-6 h-6 mb-0.5 mr-3" />
                    <span className="text-xs">APAR</span>
                  </Link>
                </li>
                <li>
                  <Link href="/inspection" className={`flex items-center p-2 ${pathname.startsWith(inspectionRoutePrefix) ? 'text-purple-600 bg-purple-100' : 'text-gray-600'} hover:bg-blue-100 rounded-lg transition`}>
                    <MagnifyingGlassIcon className="w-6 h-6 mb-0.5 mr-3" />
                    <span className="text-xs">Inspeksi</span>
                  </Link>
                </li>
                <li>
                  <Link href="/users" className={`flex items-center p-2 ${pathname.startsWith(usersRoutePrefix) ? 'text-purple-600 bg-purple-100' : 'text-gray-600'} hover:bg-blue-100 rounded-lg transition`}>
                    <UsersIcon className="w-6 h-6 mb-0.5 mr-3" />
                    <span className="text-xs">Pengguna</span>
                  </Link>
                </li>
              </ul>
            </nav>
          </div>

          {/* Bottom profile link */}
          <div className="p-4 border-t">
            <Link href="/profile" className={`flex items-center ${pathname.startsWith('/profile') ? 'text-purple-600 bg-purple-100' : 'text-gray-600'} hover:bg-gray-100 p-2 rounded-lg transition`}>
              <UserIcon className="w-6 h-6 mb-0.5 mr-3" />
              Profil
            </Link>
          </div>
        </aside>

        <main className="flex-1 overflow-y-auto p-6 bg-gray-50">

          {/* Breadcrumb */}
          <nav className={`${props.appBarTitle == "" ? "hidden" : "flex"} text-sm mb-4 text-gray-500`}>
            <button
              className="flex flex-col items-center left-0 text-gray-400 w-16"
              onClick={() => router.back()}
            >
              <ArrowLeftIcon className="w-6 h-6 mb-0.5" />
            </button>

            <ol className="list-reset flex">
              <li><a href="#" className="hover:underline text-blue-600">NEXA</a></li>
              <li><span className="mx-2">/</span></li>
              <li className="text-gray-500">{props.appBarTitle}</li>
            </ol>
          </nav>

          {props.children}
        </main>
      </div>

      {/* Handle mobile view */}
      <div className="sm:hidden min-h-screen bg-gray-50 relative">
        {props.children}

        {/* App bar */}
        {
          props.appBarTitle != '' && (
            <div className="fixed top-0 left-0 right-0">
              <div className="max-w-[430px] bg-white border-l border-r border-b mx-auto py-1">
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
                    className={`flex flex-col items-center w-16 ${homeRoutePrefix.includes(pathname) ? 'text-purple-600' : 'text-gray-400'}`}
                    onClick={() => router.push('/home')}
                  >
                    <HomeIcon className="w-6 h-6 mb-0.5" />
                    <span className="text-xs">Beranda</span>
                  </button>

                  <button
                    className={`flex flex-col items-center w-16 ${extinguisherRoutePrefix.includes(pathname) ? 'text-purple-600' : 'text-gray-400'}`}
                    onClick={() => router.push('/extinguisher')}
                  >
                    <Squares2X2Icon className="w-6 h-6 mb-0.5" />
                    <span className="text-xs">APAR</span>
                  </button>

                  <button
                    className={`flex flex-col items-center w-16 ${inspectionRoutePrefix.includes(pathname) ? 'text-purple-600' : 'text-gray-400'}`}
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
    </div>
  );
}