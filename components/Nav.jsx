'use client'

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import {useState, useEffect} from 'react';
import {signIn, signOut, useSession, getProviders } from 'next-auth/react';
import CompanySearch from '@components/CompanySearch';

const Nav = () => {
  const {data: session } = useSession();
  const [providers, setProviders ] = useState(null);
  const [toggleDropdown, setToggleDropdown] = useState(false);

  const pathname = usePathname()
  const isCompanyPage = pathname.startsWith('/companies/');


  useEffect(() => {
    (async () => {
      const res = await getProviders();
      setProviders(res);
    })();
  }, []);


  return (
    <nav className="w-full mb-16 pt-3 flex justify-between items-center">
    {/* Existing code omitted for brevity */}
    <div> {/* This opening <div> seems to be missing in your snippet */}
      {isCompanyPage && (
        <CompanySearch />
      )}
      {/* Links and Profile */}
      {session?.user ? (
        <>
          {/* Logged In User Links */}
          <Link href="/catalog" className="nav_button">Catalog</Link>
          {/* More links can be added here */}

          {/* Profile and Dropdown */}
          <div onClick={() => setToggleDropdown((prev) => !prev)} className="cursor-pointer">
            <Image
              src={session?.user.image || "/assets/images/profile.png"}
              width={37}
              height={37}
              className="rounded-full"
              alt="profile"
            />
            {toggleDropdown && (
              <div className="dropdown-menu">
                <Link href="/settings" className="dropdown-link">Settings</Link>
                <button
                  type="button"
                  className="dropdown-link"
                  onClick={() => {
                    setToggleDropdown(false);
                    signOut({ callbackUrl: '/' });
                  }}
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </>
      ) : (
        // For Logged Out Users
        <button type="button" className="black_btn" onClick={() => signIn()}>Sign Up || Sign In</button>
      )}
    </div> {/* Closing tag for the <div> wrapping session-related content */}
  </nav>
  );
}

export default Nav;