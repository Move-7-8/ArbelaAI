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

// Home Page Logo
<nav className="flex-between w-full mb-16 pt-3">
<Link href={session ? "/catalog" : "/"} className="flex gap-2 flex-center">
        <Image
        src="/assets/images/logo3.png"
        alt="Arbela Logo"
        width={40}
        height={40}
        className="object-contain"
        />
        <p className="logo_text">Arbela</p>
      </Link>

{/* Desktop Navigation  */}
{/* For Logged In Users  */}
{isCompanyPage && (
  <CompanySearch />

      )}
      <div className="sm:flex hidden">
        {session?.user ? (
          <div className="flex gap-3 md:gap-5">
            <Link href="/catalog" className="nav_button">
              Catalog
            </Link>
            {/* <Link href="/create-model" className="nav_button">
              Upload
            </Link> */}

            <div onClick={() => setToggleDropdown((prev) => !prev)} className="cursor-pointer">
              <Image 
                // src={session?.user.image}
                src="/assets/images/profile.png"

                width={37}
                height={37}
                className="rounded-full "
                alt="profile"
              />
              {toggleDropdown && (
                <div className="dropdown-menu"> {/* Add appropriate styles for positioning */}
                  {/* <Link href="/profile" className="dropdown-link">
                    My Potfolio
                  </Link> */}
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
          </div>
        ):

//For Logged Out Users  
<>
{/* For Logged Out Users */}
{/* <Link href="/pricing" className="nav_button">
  Pricing
</Link> */}
{/* <button
  type="button"
  onClick={() => signIn('google', { callbackUrl: '/catalog' })} // Change 'google' to your preferred provider ID
  className="black_btn"
>
  Sign In
</button> */}
<Link href="/catalog" passHref>
  <button type="button" className="black_btn">
    Sign Up || Sign In
  </button>
</Link>


</>
}
      </div>


{/* Mobile Navigation */}
{/* For Logged In Users */}
  <div className="sm:hidden flex relative"> 
    {session?.user ? (
      <div className="flex"> 
        <Image 
        src={session?.user.image}
        width={37}
        height={37}
        className="rounded-full"
        alt="profile"
        onClick={() => setToggleDropdown((prev) => !prev)}
        />
        {toggleDropdown && (
          <div className="dropdown">
            <Link href="/catalog" 
            className="dropdown_link"
            onClick={() => setToggleDropdown(false)}
            >
              Catalog
            </Link>

            {/* <Link href="/create-model" 
            className="nav_button"
            onClick={() => setToggleDropdown(false)}
            >
              Upload
            </Link> */}
            <Link
            href="/profile"
            className="dropdown_link"
            onClick={() => setToggleDropdown(false)}
            >
              My Models
            </Link>
            <Link
            href="/settings"
            className="dropdown_link"
            onClick={() => setToggleDropdown(false)}
            >
              Settings
            </Link>
            <button
            type="button"
            className="dropdown_link"
            onClick={()=>{
              setToggleDropdown(false);
              signOut({ callbackUrl: '/' });
            }}
            >
              Sign Out
            </button>
          </div>
        )}
      </div>
    ):
    <>
{/* For Logged Out Users */}
{/* <Link href="/pricing" className="nav_button">
  Pricing
</Link> */}
{/* <button
  type="button"
  onClick={() => signIn('google', { callbackUrl: '/catalog' })} // Change 'google' to your preferred provider ID
  className="black_btn"
>
  Sign In
</button> */}
<Link href="/catalog" passHref>
  <button type="button" className="black_btn">
    Sign Up || Sign In
  </button>
</Link>

    </>
    }




  </div>
</nav>
)}

export default Nav