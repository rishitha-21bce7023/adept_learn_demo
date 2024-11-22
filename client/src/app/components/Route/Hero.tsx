import React, { FC } from "react";
import Image from "next/image";
import { BiSearch } from "react-icons/bi";
import Link from "next/link";

type Props = {};

const Hero: FC<Props> = (props) => {
  return (
    <div className="w-full min-h-screen flex items-center relative">
      {/* Animated circle with the image inside */}
      <div className="absolute top-[100px] w-[500px] h-[500px] rounded-full hero_animation transform translate-x-[50px] flex items-center justify-center">
        <div className="absolute inset-0 rounded-full clip-animation"></div>
        <Image
          src="/assets/banner-img-1.png"
          alt="Banner Image"
          width={400}
          height={600}
          className="object-cover rounded-full z-10"
        />
      </div>

      {/* Flex container for text and search field positioned to the right */}
      <div className="flex flex-col items-start text-left z-10 ml-auto pr-[100px] w-[50%] mt-4">
        <h2 className="dark:text-white text-[#000000c7] text-[30px] w-full text-[40px] font-[600] font-Josefin leading-[175%] mb-9">
          Improve Your Online Learning Experience Better Instantly
        </h2>
        <p className="dark:text-[#edfff4] text-[#000000ac] font-Josefin font-[600] text-[18px] w-[90%] mb-16"> {/* Added margin-bottom */}
          We have 48k+ Online courses & 500K+ Online registered students. Find
          your desired Courses from them.
        </p>
        <div className="relative w-[90%] h-[50px]">
          <input
            type="search"
            placeholder="Search Courses..."
            className="bg-transparent border dark:border-none dark:bg-[#575757] dark:placeholder:text-[#ffffffdd] rounded-l-[5px] p-2 w-full h-full outline-none text-[#0000004e] dark:text-[#ffffffe6] text-[20px] font-Josefin"
          />
          <div className="absolute flex items-center justify-center w-[50px] cursor-pointer h-full right-0 top-0 bg-[#39c1f3] rounded-r-[5px]">
            <BiSearch className="text-white" size={30} />
          </div>
        </div>
        <div className="w-[90%] flex items-center mt-1">
          <Image
            src="/assets/client-1.png"
            alt="Client 1"
            width={45}
            height={20}
            className="rounded-full"
          />
          <Image
            src="/assets/client-2.png"
            alt="Client 2"
            width={55}
            height={50}
            className="rounded-full ml-[-20px]"
          />
          <Image
            src="/assets/client-3.png"
            alt="Client 3"
            width={50}
            height={50}
            className="rounded-full ml-[-20px]"
          />
          <Link href="/courses" className="dark:text-[#46e256] text-[crimson] ml-3">
            View Courses
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Hero;