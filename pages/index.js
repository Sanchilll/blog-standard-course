import { Logo } from "../component/Logo";
import Image from "next/image";
import React from "react";
import HeroImage from "../public/hero1.webp";
import Link from "next/link";

export default function Home() {
  return (
    <div className="w-screen h-screen overflow-hidden flex justify-center items-center relative ">
      <Image src={HeroImage} alt="Hero" fill className="absolute" />
      <div className="relative z-10  text-white px-10 py-5 text-center max-w-screen-sm bg-slate-900/90 rounded-md backdrop-blur-sm">
        <Logo />
        <p>
          Revolutionize your content creation with our AI-powered blog
          generator. Say goodbye to writer&apos;s block and hello to
          high-quality posts.
        </p>
        <Link href="/post/new" className="btn my-5">
          Begin
        </Link>
      </div>
    </div>
  );
}
