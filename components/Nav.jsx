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
      {/* Logo and Brand Name */}
      <Link href={session ? "/catalog" : "/"} className="flex gap-2 items-center">
        <Image
          src="/assets/images/logo3.png"
          alt="Arbela Logo"
          width={40}
          height={40}
          className="object-contain"
        />
        <p className="logo_text">Arbela</p>
      </Link>
<style jsx>
{`
  .search_input {
    padding-right: 0 !important;
  }
`}
</style>
      {/* Right Section of Navbar */}
      <div className="flex items-center gap-3 md:gap-5">
        {/* Search Bar (only if isCompanyPage is true) */}
        {isCompanyPage && (
          <CompanySearch/>
        )}
        {/* Links and Profile */}
        {session?.user ? (
          <>
            {/* Logged In User Links */}
            <Link href="/catalog" className="nav_button text-[#3A3C3E]">
              Catalog
            </Link>
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
                  <Link href="/settings" className="dropdown-link">
                    Settings
                  </Link>
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
          <Link href="/catalog" passHref>
            <button type="button" className="black_btn">
              Sign Up || Sign In
            </button>
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Nav;