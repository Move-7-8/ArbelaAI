"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import Profile from "@components/Profile";

const MyProfile = () => {
  const router = useRouter();
  const { data: session } = useSession();

  const [myThreads, setMyThreads] = useState([]);
  // console.log(`Profile User ID:${session.user.id} `)
  useEffect(() => {
    const fetchPosts = async () => {
      const response = await fetch(`/api/users/${session?.user.id}/threads`);
      if (!response.ok) {
        // Handle error: response is not OK
        console.error("Error fetching data:", response.statusText);
        return;
      }
      const data = await response.json();
      console.log('data fetched')
      console.log(data)
      setMyThreads(data);
        };

    if (session?.user.id) fetchPosts();
  }, [session?.user.id]);


  return (
    <Profile
    data={myThreads}
    />
  );
};

export default MyProfile;
