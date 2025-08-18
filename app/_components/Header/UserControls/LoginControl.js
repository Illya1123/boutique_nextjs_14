'use client'
import Link from "next/link";
import { FaUserAlt } from "react-icons/fa";
import { useSession } from "next-auth/react";

export default function LoginControl() {
  const { data: session } = useSession();
  return (
    <div>
      {session?.user?.email ? (
        <Link
          href="/account"
          className="hover:text-accent-400 transition-colors flex items-center gap-4"
        >
          <img
            className="h-8 rounded-full"
            src={session.user.image}
            alt={session.user.name}
            referrerPolicy="no-referrer"
          />
          <span>{session.user.name}</span>
        </Link>
      ) : (
        <Link
          href="/login"
          className="flex space-x-2 justify-between text-xl"
        >
          <FaUserAlt />
          <span>Login</span>
        </Link>
      )}
    </div>
  )
}
