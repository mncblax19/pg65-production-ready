"use client";
import BrandSection from "@/components/auth/Brand-section";
import Header from "@/components/auth/Header";
import React from "react";
import OTPVerification from "@/components/auth/OtpVerification";
export default function MailCheck() {
  return (
    <div className="flex bg-white min-h-screen flex-col lg:flex-row">
      <BrandSection />
      {/* right-side */}

      <div className="flex flex-col h-screen w-full items-center justify-center px-6 py-12 lg:w-2/5 lg:px-8">
        <div className=" max-w-md">
          <Header
            title="Check Your Email"
            subtitle=""
          />
          <OTPVerification />
        </div>
      </div>
    </div>
  );
}
