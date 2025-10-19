import svgPaths from "./svg-yxbdxs5thx";

function Icon() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Icon">
          <path d={svgPaths.p33f6b680} id="Vector" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d="M15.8333 10H4.16667" id="Vector_2" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
      </svg>
    </div>
  );
}

function Button() {
  return (
    <div className="bg-[rgba(255,255,255,0.05)] relative rounded-[2.68435e+07px] shrink-0 size-[40px]" data-name="Button">
      <div aria-hidden="true" className="absolute border-[0.8px] border-[rgba(255,255,255,0.1)] border-solid inset-0 pointer-events-none rounded-[2.68435e+07px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex items-center justify-center p-[0.8px] relative size-[40px]">
        <Icon />
      </div>
    </div>
  );
}

function Heading1() {
  return (
    <div className="absolute h-[20px] left-0 top-0 w-[174.45px]" data-name="Heading 1">
      <p className="absolute font-['Arimo:Regular',_sans-serif] font-normal leading-[20px] left-0 text-[#99a1af] text-[14px] text-nowrap top-[-1.2px] tracking-[0.35px] uppercase whitespace-pre">Performance Summary</p>
    </div>
  );
}

function Paragraph() {
  return (
    <div className="absolute h-[20px] left-0 top-[20px] w-[174.45px]" data-name="Paragraph">
      <p className="absolute font-['Arimo:Regular',_sans-serif] font-normal leading-[20px] left-0 text-[14px] text-[rgba(255,255,255,0.6)] top-[-1.2px] w-[102px]">Dynamite - Intro</p>
    </div>
  );
}

function Container() {
  return (
    <div className="h-[40px] relative shrink-0 w-[174.45px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[40px] relative w-[174.45px]">
        <Heading1 />
        <Paragraph />
      </div>
    </div>
  );
}

function Container1() {
  return (
    <div className="absolute content-stretch flex gap-[16px] h-[40px] items-center left-[24px] top-[24px] w-[1096px]" data-name="Container">
      <Button />
      <Container />
    </div>
  );
}

function Heading3() {
  return (
    <div className="h-[20px] relative shrink-0 w-[166.312px]" data-name="Heading 3">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[20px] relative w-[166.312px]">
        <p className="absolute font-['Arimo:Regular',_sans-serif] font-normal leading-[20px] left-0 text-[#99a1af] text-[14px] text-nowrap top-[-1.2px] tracking-[0.35px] uppercase whitespace-pre">Performance Timeline</p>
      </div>
    </div>
  );
}

function Button1() {
  return (
    <div className="bg-[rgba(255,255,255,0.1)] h-[27.988px] relative rounded-[4px] shrink-0 w-[77.588px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex h-[27.988px] items-start px-[12px] py-[6px] relative w-[77.588px]">
        <p className="font-['Arimo:Regular',_sans-serif] font-normal leading-[16px] relative shrink-0 text-[12px] text-nowrap text-white whitespace-pre">Pose Error</p>
      </div>
    </div>
  );
}

function Button2() {
  return (
    <div className="h-[27.988px] relative rounded-[4px] shrink-0 w-[89.2px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex h-[27.988px] items-start px-[12px] py-[6px] relative w-[89.2px]">
        <p className="font-['Arimo:Regular',_sans-serif] font-normal leading-[16px] relative shrink-0 text-[#6a7282] text-[12px] text-nowrap whitespace-pre">Timing Error</p>
      </div>
    </div>
  );
}

function Container2() {
  return (
    <div className="bg-[rgba(255,255,255,0.05)] h-[37.587px] relative rounded-[10px] shrink-0 w-[180.387px]" data-name="Container">
      <div aria-hidden="true" className="absolute border-[0.8px] border-[rgba(255,255,255,0.1)] border-solid inset-0 pointer-events-none rounded-[10px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex gap-[4px] h-[37.587px] items-start pb-[0.8px] pl-[4.8px] pr-[0.8px] pt-[4.8px] relative w-[180.387px]">
        <Button1 />
        <Button2 />
      </div>
    </div>
  );
}

function Container3() {
  return (
    <div className="h-[37.587px] relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex h-[37.587px] items-center justify-between relative w-full">
          <Heading3 />
          <Container2 />
        </div>
      </div>
    </div>
  );
}

function ReviewPage() {
  return (
    <div className="bg-[rgba(0,0,0,0.9)] h-[23.988px] opacity-0 relative rounded-[4px] shrink-0 w-full" data-name="ReviewPage">
      <p className="absolute font-['Arimo:Regular',_sans-serif] font-normal leading-[16px] left-[8px] text-[12px] text-white top-[3px] w-[62px]">Beat 0: 77%</p>
    </div>
  );
}

function Container4() {
  return (
    <div className="absolute bg-[#f9d949] box-border content-stretch flex flex-col h-[98.987px] items-start left-[8px] pb-0 rounded-tl-[6px] rounded-tr-[6px] top-[29.01px] w-[19.512px]" data-name="Container">
      <ReviewPage />
    </div>
  );
}

function ReviewPage1() {
  return (
    <div className="bg-[rgba(0,0,0,0.9)] h-[23.988px] opacity-0 relative rounded-[4px] shrink-0 w-full" data-name="ReviewPage">
      <p className="absolute font-['Arimo:Regular',_sans-serif] font-normal leading-[16px] left-[8px] text-[12px] text-white top-[3px] w-[62px]">Beat 1: 88%</p>
    </div>
  );
}

function Container5() {
  return (
    <div className="absolute bg-[#05df72] box-border content-stretch flex flex-col h-[113.125px] items-start left-[29.51px] pb-0 rounded-tl-[6px] rounded-tr-[6px] top-[14.88px] w-[19.512px]" data-name="Container">
      <ReviewPage1 />
    </div>
  );
}

function ReviewPage2() {
  return (
    <div className="bg-[rgba(0,0,0,0.9)] h-[23.988px] opacity-0 relative rounded-[4px] shrink-0 w-full" data-name="ReviewPage">
      <p className="absolute font-['Arimo:Regular',_sans-serif] font-normal leading-[16px] left-[8px] text-[12px] text-white top-[3px] w-[62px]">Beat 2: 71%</p>
    </div>
  );
}

function Container6() {
  return (
    <div className="absolute bg-[#f9d949] box-border content-stretch flex flex-col h-[91.5px] items-start left-[51.02px] pb-0 rounded-tl-[6px] rounded-tr-[6px] top-[36.5px] w-[19.512px]" data-name="Container">
      <ReviewPage2 />
    </div>
  );
}

function ReviewPage3() {
  return (
    <div className="bg-[rgba(0,0,0,0.9)] h-[23.988px] opacity-0 relative rounded-[4px] shrink-0 w-full" data-name="ReviewPage">
      <p className="absolute font-['Arimo:Regular',_sans-serif] font-normal leading-[16px] left-[8px] text-[12px] text-white top-[3px] w-[62px]">Beat 3: 89%</p>
    </div>
  );
}

function Container7() {
  return (
    <div className="absolute bg-[#05df72] box-border content-stretch flex flex-col h-[113.8px] items-start left-[72.54px] pb-0 rounded-tl-[6px] rounded-tr-[6px] top-[14.2px] w-[19.512px]" data-name="Container">
      <ReviewPage3 />
    </div>
  );
}

function ReviewPage4() {
  return (
    <div className="bg-[rgba(0,0,0,0.9)] h-[23.988px] opacity-0 relative rounded-[4px] shrink-0 w-full" data-name="ReviewPage">
      <p className="absolute font-['Arimo:Regular',_sans-serif] font-normal leading-[16px] left-[8px] text-[12px] text-white top-[3px] w-[62px]">Beat 4: 75%</p>
    </div>
  );
}

function Container8() {
  return (
    <div className="absolute bg-[#f9d949] box-border content-stretch flex flex-col h-[95.537px] items-start left-[94.05px] pb-0 rounded-tl-[6px] rounded-tr-[6px] top-[32.46px] w-[19.512px]" data-name="Container">
      <ReviewPage4 />
    </div>
  );
}

function ReviewPage5() {
  return (
    <div className="bg-[rgba(0,0,0,0.9)] h-[23.988px] opacity-0 relative rounded-[4px] shrink-0 w-full" data-name="ReviewPage">
      <p className="absolute font-['Arimo:Regular',_sans-serif] font-normal leading-[16px] left-[8px] text-[12px] text-white top-[3px] w-[62px]">Beat 5: 73%</p>
    </div>
  );
}

function Container9() {
  return (
    <div className="absolute bg-[#f9d949] box-border content-stretch flex flex-col h-[93.325px] items-start left-[115.56px] pb-0 rounded-tl-[6px] rounded-tr-[6px] top-[34.67px] w-[19.512px]" data-name="Container">
      <ReviewPage5 />
    </div>
  );
}

function ReviewPage6() {
  return (
    <div className="bg-[rgba(0,0,0,0.9)] h-[23.988px] opacity-0 relative rounded-[4px] shrink-0 w-full" data-name="ReviewPage">
      <p className="absolute font-['Arimo:Regular',_sans-serif] font-normal leading-[16px] left-[8px] text-[12px] text-white top-[3px] w-[62px]">Beat 6: 83%</p>
    </div>
  );
}

function Container10() {
  return (
    <div className="absolute bg-[#05df72] box-border content-stretch flex flex-col h-[105.688px] items-start left-[137.07px] pb-0 rounded-tl-[6px] rounded-tr-[6px] top-[22.31px] w-[19.512px]" data-name="Container">
      <ReviewPage6 />
    </div>
  );
}

function ReviewPage7() {
  return (
    <div className="bg-[rgba(0,0,0,0.9)] h-[23.988px] opacity-0 relative rounded-[4px] shrink-0 w-full" data-name="ReviewPage">
      <p className="absolute font-['Arimo:Regular',_sans-serif] font-normal leading-[16px] left-[8px] text-[12px] text-white top-[3px] w-[62px]">Beat 7: 88%</p>
    </div>
  );
}

function Container11() {
  return (
    <div className="absolute bg-[#05df72] box-border content-stretch flex flex-col h-[112.562px] items-start left-[158.59px] pb-0 rounded-tl-[6px] rounded-tr-[6px] top-[15.44px] w-[19.512px]" data-name="Container">
      <ReviewPage7 />
    </div>
  );
}

function Container12() {
  return (
    <div className="absolute content-stretch flex h-[13.325px] items-start left-[8px] top-[19.99px] w-[62.95px]" data-name="Container">
      <p className="font-['Arimo:Regular',_sans-serif] font-normal leading-[13.333px] relative shrink-0 text-[#ff6467] text-[10px] text-nowrap whitespace-pre">Error detected</p>
    </div>
  );
}

function ReviewPage8() {
  return (
    <div className="bg-[rgba(0,0,0,0.9)] h-[37.313px] opacity-0 relative rounded-[4px] shrink-0 w-full" data-name="ReviewPage">
      <p className="absolute font-['Arimo:Regular',_sans-serif] font-normal leading-[16px] left-[8px] text-[12px] text-white top-[3px] w-[62px]">Beat 8: 55%</p>
      <Container12 />
    </div>
  );
}

function Container13() {
  return (
    <div className="absolute bg-[#fb2c36] box-border content-stretch flex flex-col h-[70.875px] items-start left-[180.1px] pb-0 rounded-tl-[6px] rounded-tr-[6px] shadow-[0px_0px_8px_0px_rgba(251,44,54,0.5)] top-[57.13px] w-[19.512px]" data-name="Container">
      <ReviewPage8 />
    </div>
  );
}

function Container14() {
  return (
    <div className="absolute content-stretch flex h-[13.325px] items-start left-[8px] top-[19.99px] w-[62.95px]" data-name="Container">
      <p className="font-['Arimo:Regular',_sans-serif] font-normal leading-[13.333px] relative shrink-0 text-[#ff6467] text-[10px] text-nowrap whitespace-pre">Error detected</p>
    </div>
  );
}

function ReviewPage9() {
  return (
    <div className="bg-[rgba(0,0,0,0.9)] h-[37.313px] opacity-0 relative rounded-[4px] shrink-0 w-full" data-name="ReviewPage">
      <p className="absolute font-['Arimo:Regular',_sans-serif] font-normal leading-[16px] left-[8px] text-[12px] text-white top-[3px] w-[62px]">Beat 9: 54%</p>
      <Container14 />
    </div>
  );
}

function Container15() {
  return (
    <div className="absolute bg-[#fb2c36] box-border content-stretch flex flex-col h-[68.862px] items-start left-[201.61px] pb-0 rounded-tl-[6px] rounded-tr-[6px] shadow-[0px_0px_8px_0px_rgba(251,44,54,0.5)] top-[59.14px] w-[19.512px]" data-name="Container">
      <ReviewPage9 />
    </div>
  );
}

function ReviewPage10() {
  return (
    <div className="bg-[rgba(0,0,0,0.9)] h-[23.988px] opacity-0 relative rounded-[4px] shrink-0 w-full" data-name="ReviewPage">
      <p className="absolute font-['Arimo:Regular',_sans-serif] font-normal leading-[16px] left-[8px] text-[12px] text-white top-[3px] w-[69px]">Beat 10: 72%</p>
    </div>
  );
}

function Container16() {
  return (
    <div className="absolute bg-[#f9d949] box-border content-stretch flex flex-col h-[91.6px] items-start left-[223.13px] pb-0 rounded-tl-[6px] rounded-tr-[6px] top-[36.4px] w-[19.512px]" data-name="Container">
      <ReviewPage10 />
    </div>
  );
}

function ReviewPage11() {
  return (
    <div className="bg-[rgba(0,0,0,0.9)] h-[23.988px] opacity-0 relative rounded-[4px] shrink-0 w-full" data-name="ReviewPage">
      <p className="absolute font-['Arimo:Regular',_sans-serif] font-normal leading-[16px] left-[8px] text-[12px] text-white top-[3px] w-[69px]">Beat 11: 97%</p>
    </div>
  );
}

function Container17() {
  return (
    <div className="absolute bg-[#05df72] box-border content-stretch flex flex-col h-[124.05px] items-start left-[244.64px] pb-0 rounded-tl-[6px] rounded-tr-[6px] top-[3.95px] w-[19.512px]" data-name="Container">
      <ReviewPage11 />
    </div>
  );
}

function ReviewPage12() {
  return (
    <div className="bg-[rgba(0,0,0,0.9)] h-[23.988px] opacity-0 relative rounded-[4px] shrink-0 w-full" data-name="ReviewPage">
      <p className="absolute font-['Arimo:Regular',_sans-serif] font-normal leading-[16px] left-[8px] text-[12px] text-white top-[3px] w-[69px]">Beat 12: 83%</p>
    </div>
  );
}

function Container18() {
  return (
    <div className="absolute bg-[#05df72] box-border content-stretch flex flex-col h-[106.013px] items-start left-[266.15px] pb-0 rounded-tl-[6px] rounded-tr-[6px] top-[21.99px] w-[19.512px]" data-name="Container">
      <ReviewPage12 />
    </div>
  );
}

function ReviewPage13() {
  return (
    <div className="bg-[rgba(0,0,0,0.9)] h-[23.988px] opacity-0 relative rounded-[4px] shrink-0 w-full" data-name="ReviewPage">
      <p className="absolute font-['Arimo:Regular',_sans-serif] font-normal leading-[16px] left-[8px] text-[12px] text-white top-[3px] w-[69px]">Beat 13: 80%</p>
    </div>
  );
}

function Container19() {
  return (
    <div className="absolute bg-[#f9d949] box-border content-stretch flex flex-col h-[101.875px] items-start left-[287.66px] pb-0 rounded-tl-[6px] rounded-tr-[6px] top-[26.13px] w-[19.512px]" data-name="Container">
      <ReviewPage13 />
    </div>
  );
}

function ReviewPage14() {
  return (
    <div className="bg-[rgba(0,0,0,0.9)] h-[23.988px] opacity-0 relative rounded-[4px] shrink-0 w-full" data-name="ReviewPage">
      <p className="absolute font-['Arimo:Regular',_sans-serif] font-normal leading-[16px] left-[8px] text-[12px] text-white top-[3px] w-[69px]">Beat 14: 76%</p>
    </div>
  );
}

function Container20() {
  return (
    <div className="absolute bg-[#f9d949] box-border content-stretch flex flex-col h-[97.263px] items-start left-[309.18px] pb-0 rounded-tl-[6px] rounded-tr-[6px] top-[30.74px] w-[19.512px]" data-name="Container">
      <ReviewPage14 />
    </div>
  );
}

function ReviewPage15() {
  return (
    <div className="bg-[rgba(0,0,0,0.9)] h-[23.988px] opacity-0 relative rounded-[4px] shrink-0 w-full" data-name="ReviewPage">
      <p className="absolute font-['Arimo:Regular',_sans-serif] font-normal leading-[16px] left-[8px] text-[12px] text-white top-[3px] w-[69px]">Beat 15: 77%</p>
    </div>
  );
}

function Container21() {
  return (
    <div className="absolute bg-[#f9d949] box-border content-stretch flex flex-col h-[98.05px] items-start left-[330.69px] pb-0 rounded-tl-[6px] rounded-tr-[6px] top-[29.95px] w-[19.512px]" data-name="Container">
      <ReviewPage15 />
    </div>
  );
}

function ReviewPage16() {
  return (
    <div className="bg-[rgba(0,0,0,0.9)] h-[23.988px] opacity-0 relative rounded-[4px] shrink-0 w-full" data-name="ReviewPage">
      <p className="absolute font-['Arimo:Regular',_sans-serif] font-normal leading-[16px] left-[8px] text-[12px] text-white top-[3px] w-[69px]">Beat 16: 77%</p>
    </div>
  );
}

function Container22() {
  return (
    <div className="absolute bg-[#f9d949] box-border content-stretch flex flex-col h-[98.013px] items-start left-[352.2px] pb-0 rounded-tl-[6px] rounded-tr-[6px] top-[29.99px] w-[19.512px]" data-name="Container">
      <ReviewPage16 />
    </div>
  );
}

function ReviewPage17() {
  return (
    <div className="bg-[rgba(0,0,0,0.9)] h-[23.988px] opacity-0 relative rounded-[4px] shrink-0 w-full" data-name="ReviewPage">
      <p className="absolute font-['Arimo:Regular',_sans-serif] font-normal leading-[16px] left-[8px] text-[12px] text-white top-[3px] w-[69px]">Beat 17: 99%</p>
    </div>
  );
}

function Container23() {
  return (
    <div className="absolute bg-[#05df72] box-border content-stretch flex flex-col h-[126.738px] items-start left-[373.71px] pb-0 rounded-tl-[6px] rounded-tr-[6px] top-[1.26px] w-[19.512px]" data-name="Container">
      <ReviewPage17 />
    </div>
  );
}

function ReviewPage18() {
  return (
    <div className="bg-[rgba(0,0,0,0.9)] h-[23.988px] opacity-0 relative rounded-[4px] shrink-0 w-full" data-name="ReviewPage">
      <p className="absolute font-['Arimo:Regular',_sans-serif] font-normal leading-[16px] left-[8px] text-[12px] text-white top-[3px] w-[69px]">Beat 18: 98%</p>
    </div>
  );
}

function Container24() {
  return (
    <div className="absolute bg-[#05df72] box-border content-stretch flex flex-col h-[125.963px] items-start left-[395.23px] pb-0 rounded-tl-[6px] rounded-tr-[6px] top-[2.04px] w-[19.512px]" data-name="Container">
      <ReviewPage18 />
    </div>
  );
}

function ReviewPage19() {
  return (
    <div className="bg-[rgba(0,0,0,0.9)] h-[23.988px] opacity-0 relative rounded-[4px] shrink-0 w-full" data-name="ReviewPage">
      <p className="absolute font-['Arimo:Regular',_sans-serif] font-normal leading-[16px] left-[8px] text-[12px] text-white top-[3px] w-[69px]">Beat 19: 96%</p>
    </div>
  );
}

function Container25() {
  return (
    <div className="absolute bg-[#05df72] box-border content-stretch flex flex-col h-[122.938px] items-start left-[416.74px] pb-0 rounded-tl-[6px] rounded-tr-[6px] top-[5.06px] w-[19.512px]" data-name="Container">
      <ReviewPage19 />
    </div>
  );
}

function ReviewPage20() {
  return (
    <div className="bg-[rgba(0,0,0,0.9)] h-[23.988px] opacity-0 relative rounded-[4px] shrink-0 w-full" data-name="ReviewPage">
      <p className="absolute font-['Arimo:Regular',_sans-serif] font-normal leading-[16px] left-[8px] text-[12px] text-white top-[3px] w-[69px]">Beat 20: 81%</p>
    </div>
  );
}

function Container26() {
  return (
    <div className="absolute bg-[#05df72] box-border content-stretch flex flex-col h-[103.863px] items-start left-[438.25px] pb-0 rounded-tl-[6px] rounded-tr-[6px] top-[24.14px] w-[19.512px]" data-name="Container">
      <ReviewPage20 />
    </div>
  );
}

function ReviewPage21() {
  return (
    <div className="bg-[rgba(0,0,0,0.9)] h-[23.988px] opacity-0 relative rounded-[4px] shrink-0 w-full" data-name="ReviewPage">
      <p className="absolute font-['Arimo:Regular',_sans-serif] font-normal leading-[16px] left-[8px] text-[12px] text-white top-[3px] w-[69px]">Beat 21: 90%</p>
    </div>
  );
}

function Container27() {
  return (
    <div className="absolute bg-[#05df72] box-border content-stretch flex flex-col h-[115.662px] items-start left-[459.76px] pb-0 rounded-tl-[6px] rounded-tr-[6px] top-[12.34px] w-[19.512px]" data-name="Container">
      <ReviewPage21 />
    </div>
  );
}

function ReviewPage22() {
  return (
    <div className="bg-[rgba(0,0,0,0.9)] h-[23.988px] opacity-0 relative rounded-[4px] shrink-0 w-full" data-name="ReviewPage">
      <p className="absolute font-['Arimo:Regular',_sans-serif] font-normal leading-[16px] left-[8px] text-[12px] text-white top-[3px] w-[69px]">Beat 22: 94%</p>
    </div>
  );
}

function Container28() {
  return (
    <div className="absolute bg-[#05df72] box-border content-stretch flex flex-col h-[120.7px] items-start left-[481.27px] pb-0 rounded-tl-[6px] rounded-tr-[6px] top-[7.3px] w-[19.512px]" data-name="Container">
      <ReviewPage22 />
    </div>
  );
}

function Container29() {
  return (
    <div className="absolute content-stretch flex h-[13.325px] items-start left-[8px] top-[19.99px] w-[68.225px]" data-name="Container">
      <p className="basis-0 font-['Arimo:Regular',_sans-serif] font-normal grow leading-[13.333px] min-h-px min-w-px relative shrink-0 text-[#ff6467] text-[10px]">Error detected</p>
    </div>
  );
}

function ReviewPage23() {
  return (
    <div className="bg-[rgba(0,0,0,0.9)] h-[37.313px] opacity-0 relative rounded-[4px] shrink-0 w-full" data-name="ReviewPage">
      <p className="absolute font-['Arimo:Regular',_sans-serif] font-normal leading-[16px] left-[8px] text-[12px] text-white top-[3px] w-[69px]">Beat 23: 54%</p>
      <Container29 />
    </div>
  );
}

function Container30() {
  return (
    <div className="absolute bg-[#fb2c36] box-border content-stretch flex flex-col h-[68.513px] items-start left-[502.79px] pb-0 rounded-tl-[6px] rounded-tr-[6px] shadow-[0px_0px_8px_0px_rgba(251,44,54,0.5)] top-[59.49px] w-[19.512px]" data-name="Container">
      <ReviewPage23 />
    </div>
  );
}

function Container31() {
  return (
    <div className="absolute content-stretch flex h-[13.325px] items-start left-[8px] top-[19.99px] w-[68.225px]" data-name="Container">
      <p className="basis-0 font-['Arimo:Regular',_sans-serif] font-normal grow leading-[13.333px] min-h-px min-w-px relative shrink-0 text-[#ff6467] text-[10px]">Error detected</p>
    </div>
  );
}

function ReviewPage24() {
  return (
    <div className="bg-[rgba(0,0,0,0.9)] h-[37.313px] opacity-0 relative rounded-[4px] shrink-0 w-full" data-name="ReviewPage">
      <p className="absolute font-['Arimo:Regular',_sans-serif] font-normal leading-[16px] left-[8px] text-[12px] text-white top-[3px] w-[69px]">Beat 24: 69%</p>
      <Container31 />
    </div>
  );
}

function Container32() {
  return (
    <div className="absolute bg-[#f9d949] box-border content-stretch flex flex-col h-[88.75px] items-start left-[524.3px] pb-0 rounded-tl-[6px] rounded-tr-[6px] shadow-[0px_0px_8px_0px_rgba(249,217,73,0.5)] top-[39.25px] w-[19.512px]" data-name="Container">
      <ReviewPage24 />
    </div>
  );
}

function ReviewPage25() {
  return (
    <div className="bg-[rgba(0,0,0,0.9)] h-[23.988px] opacity-0 relative rounded-[4px] shrink-0 w-full" data-name="ReviewPage">
      <p className="absolute font-['Arimo:Regular',_sans-serif] font-normal leading-[16px] left-[8px] text-[12px] text-white top-[3px] w-[69px]">Beat 25: 98%</p>
    </div>
  );
}

function Container33() {
  return (
    <div className="absolute bg-[#05df72] box-border content-stretch flex flex-col h-[125.287px] items-start left-[545.81px] pb-0 rounded-tl-[6px] rounded-tr-[6px] top-[2.71px] w-[19.512px]" data-name="Container">
      <ReviewPage25 />
    </div>
  );
}

function ReviewPage26() {
  return (
    <div className="bg-[rgba(0,0,0,0.9)] h-[23.988px] opacity-0 relative rounded-[4px] shrink-0 w-full" data-name="ReviewPage">
      <p className="absolute font-['Arimo:Regular',_sans-serif] font-normal leading-[16px] left-[8px] text-[12px] text-white top-[3px] w-[69px]">Beat 26: 97%</p>
    </div>
  );
}

function Container34() {
  return (
    <div className="absolute bg-[#05df72] box-border content-stretch flex flex-col h-[124.7px] items-start left-[567.33px] pb-0 rounded-tl-[6px] rounded-tr-[6px] top-[3.3px] w-[19.512px]" data-name="Container">
      <ReviewPage26 />
    </div>
  );
}

function ReviewPage27() {
  return (
    <div className="bg-[rgba(0,0,0,0.9)] h-[23.988px] opacity-0 relative rounded-[4px] shrink-0 w-full" data-name="ReviewPage">
      <p className="absolute font-['Arimo:Regular',_sans-serif] font-normal leading-[16px] left-[8px] text-[12px] text-white top-[3px] w-[69px]">Beat 27: 99%</p>
    </div>
  );
}

function Container35() {
  return (
    <div className="absolute bg-[#05df72] box-border content-stretch flex flex-col h-[126.575px] items-start left-[588.84px] pb-0 rounded-tl-[6px] rounded-tr-[6px] top-[1.43px] w-[19.512px]" data-name="Container">
      <ReviewPage27 />
    </div>
  );
}

function ReviewPage28() {
  return (
    <div className="bg-[rgba(0,0,0,0.9)] h-[23.988px] opacity-0 relative rounded-[4px] shrink-0 w-full" data-name="ReviewPage">
      <p className="absolute font-['Arimo:Regular',_sans-serif] font-normal leading-[16px] left-[8px] text-[12px] text-white top-[3px] w-[69px]">Beat 28: 72%</p>
    </div>
  );
}

function Container36() {
  return (
    <div className="absolute bg-[#f9d949] box-border content-stretch flex flex-col h-[92.35px] items-start left-[610.35px] pb-0 rounded-tl-[6px] rounded-tr-[6px] top-[35.65px] w-[19.512px]" data-name="Container">
      <ReviewPage28 />
    </div>
  );
}

function ReviewPage29() {
  return (
    <div className="bg-[rgba(0,0,0,0.9)] h-[23.988px] opacity-0 relative rounded-[4px] shrink-0 w-full" data-name="ReviewPage">
      <p className="absolute font-['Arimo:Regular',_sans-serif] font-normal leading-[16px] left-[8px] text-[12px] text-white top-[3px] w-[69px]">Beat 29: 81%</p>
    </div>
  );
}

function Container37() {
  return (
    <div className="absolute bg-[#05df72] box-border content-stretch flex flex-col h-[104.088px] items-start left-[631.86px] pb-0 rounded-tl-[6px] rounded-tr-[6px] top-[23.91px] w-[19.512px]" data-name="Container">
      <ReviewPage29 />
    </div>
  );
}

function ReviewPage30() {
  return (
    <div className="bg-[rgba(0,0,0,0.9)] h-[23.988px] opacity-0 relative rounded-[4px] shrink-0 w-full" data-name="ReviewPage">
      <p className="absolute font-['Arimo:Regular',_sans-serif] font-normal leading-[16px] left-[8px] text-[12px] text-white top-[3px] w-[69px]">Beat 30: 77%</p>
    </div>
  );
}

function Container38() {
  return (
    <div className="absolute bg-[#f9d949] box-border content-stretch flex flex-col h-[98.138px] items-start left-[653.38px] pb-0 rounded-tl-[6px] rounded-tr-[6px] top-[29.86px] w-[19.512px]" data-name="Container">
      <ReviewPage30 />
    </div>
  );
}

function ReviewPage31() {
  return (
    <div className="bg-[rgba(0,0,0,0.9)] h-[23.988px] opacity-0 relative rounded-[4px] shrink-0 w-full" data-name="ReviewPage">
      <p className="absolute font-['Arimo:Regular',_sans-serif] font-normal leading-[16px] left-[8px] text-[12px] text-white top-[3px] w-[69px]">Beat 31: 89%</p>
    </div>
  );
}

function Container39() {
  return (
    <div className="absolute bg-[#05df72] box-border content-stretch flex flex-col h-[113.725px] items-start left-[674.89px] pb-0 rounded-tl-[6px] rounded-tr-[6px] top-[14.28px] w-[19.512px]" data-name="Container">
      <ReviewPage31 />
    </div>
  );
}

function ReviewPage32() {
  return (
    <div className="bg-[rgba(0,0,0,0.9)] h-[23.988px] opacity-0 relative rounded-[4px] shrink-0 w-full" data-name="ReviewPage">
      <p className="absolute font-['Arimo:Regular',_sans-serif] font-normal leading-[16px] left-[8px] text-[12px] text-white top-[3px] w-[69px]">Beat 32: 94%</p>
    </div>
  );
}

function Container40() {
  return (
    <div className="absolute bg-[#05df72] box-border content-stretch flex flex-col h-[120.662px] items-start left-[696.4px] pb-0 rounded-tl-[6px] rounded-tr-[6px] top-[7.34px] w-[19.512px]" data-name="Container">
      <ReviewPage32 />
    </div>
  );
}

function ReviewPage33() {
  return (
    <div className="bg-[rgba(0,0,0,0.9)] h-[23.988px] opacity-0 relative rounded-[4px] shrink-0 w-full" data-name="ReviewPage">
      <p className="absolute font-['Arimo:Regular',_sans-serif] font-normal leading-[16px] left-[8px] text-[12px] text-white top-[3px] w-[69px]">Beat 33: 96%</p>
    </div>
  );
}

function Container41() {
  return (
    <div className="absolute bg-[#05df72] box-border content-stretch flex flex-col h-[123.438px] items-start left-[717.91px] pb-0 rounded-tl-[6px] rounded-tr-[6px] top-[4.56px] w-[19.512px]" data-name="Container">
      <ReviewPage33 />
    </div>
  );
}

function ReviewPage34() {
  return (
    <div className="bg-[rgba(0,0,0,0.9)] h-[23.988px] opacity-0 relative rounded-[4px] shrink-0 w-full" data-name="ReviewPage">
      <p className="absolute font-['Arimo:Regular',_sans-serif] font-normal leading-[16px] left-[8px] text-[12px] text-white top-[3px] w-[69px]">Beat 34: 95%</p>
    </div>
  );
}

function Container42() {
  return (
    <div className="absolute bg-[#05df72] box-border content-stretch flex flex-col h-[121.662px] items-start left-[739.42px] pb-0 rounded-tl-[6px] rounded-tr-[6px] top-[6.34px] w-[19.512px]" data-name="Container">
      <ReviewPage34 />
    </div>
  );
}

function ReviewPage35() {
  return (
    <div className="bg-[rgba(0,0,0,0.9)] h-[23.988px] opacity-0 relative rounded-[4px] shrink-0 w-full" data-name="ReviewPage">
      <p className="absolute font-['Arimo:Regular',_sans-serif] font-normal leading-[16px] left-[8px] text-[12px] text-white top-[3px] w-[69px]">Beat 35: 76%</p>
    </div>
  );
}

function Container43() {
  return (
    <div className="absolute bg-[#f9d949] box-border content-stretch flex flex-col h-[97.9px] items-start left-[760.94px] pb-0 rounded-tl-[6px] rounded-tr-[6px] top-[30.1px] w-[19.512px]" data-name="Container">
      <ReviewPage35 />
    </div>
  );
}

function ReviewPage36() {
  return (
    <div className="bg-[rgba(0,0,0,0.9)] h-[23.988px] opacity-0 relative rounded-[4px] shrink-0 w-full" data-name="ReviewPage">
      <p className="absolute font-['Arimo:Regular',_sans-serif] font-normal leading-[16px] left-[8px] text-[12px] text-white top-[3px] w-[69px]">Beat 36: 88%</p>
    </div>
  );
}

function Container44() {
  return (
    <div className="absolute bg-[#05df72] box-border content-stretch flex flex-col h-[112.113px] items-start left-[782.45px] pb-0 rounded-tl-[6px] rounded-tr-[6px] top-[15.89px] w-[19.512px]" data-name="Container">
      <ReviewPage36 />
    </div>
  );
}

function ReviewPage37() {
  return (
    <div className="bg-[rgba(0,0,0,0.9)] h-[23.988px] opacity-0 relative rounded-[4px] shrink-0 w-full" data-name="ReviewPage">
      <p className="absolute font-['Arimo:Regular',_sans-serif] font-normal leading-[16px] left-[8px] text-[12px] text-white top-[3px] w-[69px]">Beat 37: 71%</p>
    </div>
  );
}

function Container45() {
  return (
    <div className="absolute bg-[#f9d949] box-border content-stretch flex flex-col h-[90.675px] items-start left-[803.96px] pb-0 rounded-tl-[6px] rounded-tr-[6px] top-[37.33px] w-[19.512px]" data-name="Container">
      <ReviewPage37 />
    </div>
  );
}

function ReviewPage38() {
  return (
    <div className="bg-[rgba(0,0,0,0.9)] h-[23.988px] opacity-0 relative rounded-[4px] shrink-0 w-full" data-name="ReviewPage">
      <p className="absolute font-['Arimo:Regular',_sans-serif] font-normal leading-[16px] left-[8px] text-[12px] text-white top-[3px] w-[69px]">Beat 38: 76%</p>
    </div>
  );
}

function Container46() {
  return (
    <div className="absolute bg-[#f9d949] box-border content-stretch flex flex-col h-[97.65px] items-start left-[825.48px] pb-0 rounded-tl-[6px] rounded-tr-[6px] top-[30.35px] w-[19.512px]" data-name="Container">
      <ReviewPage38 />
    </div>
  );
}

function ReviewPage39() {
  return (
    <div className="bg-[rgba(0,0,0,0.9)] h-[23.988px] opacity-0 relative rounded-[4px] shrink-0 w-full" data-name="ReviewPage">
      <p className="absolute font-['Arimo:Regular',_sans-serif] font-normal leading-[16px] left-[8px] text-[12px] text-white top-[3px] w-[69px]">Beat 39: 73%</p>
    </div>
  );
}

function Container47() {
  return (
    <div className="absolute bg-[#f9d949] box-border content-stretch flex flex-col h-[94.037px] items-start left-[846.99px] pb-0 rounded-tl-[6px] rounded-tr-[6px] top-[33.96px] w-[19.512px]" data-name="Container">
      <ReviewPage39 />
    </div>
  );
}

function ReviewPage40() {
  return (
    <div className="bg-[rgba(0,0,0,0.9)] h-[23.988px] opacity-0 relative rounded-[4px] shrink-0 w-full" data-name="ReviewPage">
      <p className="absolute font-['Arimo:Regular',_sans-serif] font-normal leading-[16px] left-[8px] text-[12px] text-white top-[3px] w-[69px]">Beat 40: 91%</p>
    </div>
  );
}

function Container48() {
  return (
    <div className="absolute bg-[#05df72] box-border content-stretch flex flex-col h-[116.088px] items-start left-[868.5px] pb-0 rounded-tl-[6px] rounded-tr-[6px] top-[11.91px] w-[19.512px]" data-name="Container">
      <ReviewPage40 />
    </div>
  );
}

function ReviewPage41() {
  return (
    <div className="bg-[rgba(0,0,0,0.9)] h-[23.988px] opacity-0 relative rounded-[4px] shrink-0 w-full" data-name="ReviewPage">
      <p className="absolute font-['Arimo:Regular',_sans-serif] font-normal leading-[16px] left-[8px] text-[12px] text-white top-[3px] w-[69px]">Beat 41: 81%</p>
    </div>
  );
}

function Container49() {
  return (
    <div className="absolute bg-[#05df72] box-border content-stretch flex flex-col h-[103.537px] items-start left-[890.01px] pb-0 rounded-tl-[6px] rounded-tr-[6px] top-[24.46px] w-[19.512px]" data-name="Container">
      <ReviewPage41 />
    </div>
  );
}

function ReviewPage42() {
  return (
    <div className="bg-[rgba(0,0,0,0.9)] h-[23.988px] opacity-0 relative rounded-[4px] shrink-0 w-full" data-name="ReviewPage">
      <p className="absolute font-['Arimo:Regular',_sans-serif] font-normal leading-[16px] left-[8px] text-[12px] text-white top-[3px] w-[69px]">Beat 42: 73%</p>
    </div>
  );
}

function Container50() {
  return (
    <div className="absolute bg-[#f9d949] box-border content-stretch flex flex-col h-[92.9px] items-start left-[911.52px] pb-0 rounded-tl-[6px] rounded-tr-[6px] top-[35.1px] w-[19.512px]" data-name="Container">
      <ReviewPage42 />
    </div>
  );
}

function ReviewPage43() {
  return (
    <div className="bg-[rgba(0,0,0,0.9)] h-[23.988px] opacity-0 relative rounded-[4px] shrink-0 w-full" data-name="ReviewPage">
      <p className="absolute font-['Arimo:Regular',_sans-serif] font-normal leading-[16px] left-[8px] text-[12px] text-white top-[3px] w-[69px]">Beat 43: 79%</p>
    </div>
  );
}

function Container51() {
  return (
    <div className="absolute bg-[#f9d949] box-border content-stretch flex flex-col h-[101.525px] items-start left-[933.04px] pb-0 rounded-tl-[6px] rounded-tr-[6px] top-[26.48px] w-[19.512px]" data-name="Container">
      <ReviewPage43 />
    </div>
  );
}

function ReviewPage44() {
  return (
    <div className="bg-[rgba(0,0,0,0.9)] h-[23.988px] opacity-0 relative rounded-[4px] shrink-0 w-full" data-name="ReviewPage">
      <p className="absolute font-['Arimo:Regular',_sans-serif] font-normal leading-[16px] left-[8px] text-[12px] text-white top-[3px] w-[69px]">Beat 44: 99%</p>
    </div>
  );
}

function Container52() {
  return (
    <div className="absolute bg-[#05df72] box-border content-stretch flex flex-col h-[127.125px] items-start left-[954.55px] pb-0 rounded-tl-[6px] rounded-tr-[6px] top-[0.88px] w-[19.512px]" data-name="Container">
      <ReviewPage44 />
    </div>
  );
}

function ReviewPage45() {
  return (
    <div className="bg-[rgba(0,0,0,0.9)] h-[23.988px] opacity-0 relative rounded-[4px] shrink-0 w-full" data-name="ReviewPage">
      <p className="absolute font-['Arimo:Regular',_sans-serif] font-normal leading-[16px] left-[8px] text-[12px] text-white top-[3px] w-[69px]">Beat 45: 83%</p>
    </div>
  );
}

function Container53() {
  return (
    <div className="absolute bg-[#05df72] box-border content-stretch flex flex-col h-[106.537px] items-start left-[976.06px] pb-0 rounded-tl-[6px] rounded-tr-[6px] top-[21.46px] w-[19.512px]" data-name="Container">
      <ReviewPage45 />
    </div>
  );
}

function ReviewPage46() {
  return (
    <div className="bg-[rgba(0,0,0,0.9)] h-[23.988px] opacity-0 relative rounded-[4px] shrink-0 w-full" data-name="ReviewPage">
      <p className="absolute font-['Arimo:Regular',_sans-serif] font-normal leading-[16px] left-[8px] text-[12px] text-white top-[3px] w-[69px]">Beat 46: 98%</p>
    </div>
  );
}

function Container54() {
  return (
    <div className="absolute bg-[#05df72] box-border content-stretch flex flex-col h-[125.85px] items-start left-[997.58px] pb-0 rounded-tl-[6px] rounded-tr-[6px] top-[2.15px] w-[19.512px]" data-name="Container">
      <ReviewPage46 />
    </div>
  );
}

function ReviewPage47() {
  return (
    <div className="bg-[rgba(0,0,0,0.9)] h-[23.988px] opacity-0 relative rounded-[4px] shrink-0 w-full" data-name="ReviewPage">
      <p className="absolute font-['Arimo:Regular',_sans-serif] font-normal leading-[16px] left-[8px] text-[12px] text-white top-[3px] w-[69px]">Beat 47: 71%</p>
    </div>
  );
}

function Container55() {
  return (
    <div className="absolute bg-[#f9d949] box-border content-stretch flex flex-col h-[90.525px] items-start left-[1019.09px] pb-0 rounded-tl-[6px] rounded-tr-[6px] top-[37.48px] w-[19.512px]" data-name="Container">
      <ReviewPage47 />
    </div>
  );
}

function Container56() {
  return (
    <div className="h-[128px] relative shrink-0 w-full" data-name="Container">
      <Container4 />
      <Container5 />
      <Container6 />
      <Container7 />
      <Container8 />
      <Container9 />
      <Container10 />
      <Container11 />
      <Container13 />
      <Container15 />
      <Container16 />
      <Container17 />
      <Container18 />
      <Container19 />
      <Container20 />
      <Container21 />
      <Container22 />
      <Container23 />
      <Container24 />
      <Container25 />
      <Container26 />
      <Container27 />
      <Container28 />
      <Container30 />
      <Container32 />
      <Container33 />
      <Container34 />
      <Container35 />
      <Container36 />
      <Container37 />
      <Container38 />
      <Container39 />
      <Container40 />
      <Container41 />
      <Container42 />
      <Container43 />
      <Container44 />
      <Container45 />
      <Container46 />
      <Container47 />
      <Container48 />
      <Container49 />
      <Container50 />
      <Container51 />
      <Container52 />
      <Container53 />
      <Container54 />
      <Container55 />
    </div>
  );
}

function Text() {
  return (
    <div className="h-[15.988px] relative shrink-0 w-[11.563px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex h-[15.988px] items-start relative w-[11.563px]">
        <p className="font-['Arimo:Regular',_sans-serif] font-normal leading-[16px] relative shrink-0 text-[#6a7282] text-[12px] text-nowrap whitespace-pre">0s</p>
      </div>
    </div>
  );
}

function Text1() {
  return (
    <div className="h-[15.988px] relative shrink-0 w-[24.512px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[15.988px] relative w-[24.512px]">
        <p className="absolute font-['Arimo:Regular',_sans-serif] font-normal leading-[16px] left-0 text-[#6a7282] text-[12px] top-[-1px] w-[25px]">199s</p>
      </div>
    </div>
  );
}

function Container57() {
  return (
    <div className="h-[15.988px] relative shrink-0 w-full" data-name="Container">
      <div className="size-full">
        <div className="content-stretch flex h-[15.988px] items-start justify-between relative w-full">
          <Text />
          <Text1 />
        </div>
      </div>
    </div>
  );
}

function Container58() {
  return (
    <div className="absolute bg-gradient-to-b box-border content-stretch flex flex-col from-[rgba(26,29,46,0.6)] gap-[16px] h-[255.175px] items-start left-[24px] pb-[0.8px] pt-[24.8px] px-[24.8px] rounded-[14px] to-[rgba(15,18,25,0.4)] top-[531.19px] w-[1096px]" data-name="Container">
      <div aria-hidden="true" className="absolute border-[0.8px] border-[rgba(255,255,255,0.1)] border-solid inset-0 pointer-events-none rounded-[14px]" />
      <Container3 />
      <Container56 />
      <Container57 />
    </div>
  );
}

function Icon1() {
  return (
    <div className="absolute left-0 size-[16px] top-[2px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g clipPath="url(#clip0_15_2373)" id="Icon">
          <path d={svgPaths.p39ee6532} id="Vector" stroke="var(--stroke-0, #C27AFF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M8 5.33333V8" id="Vector_2" stroke="var(--stroke-0, #C27AFF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M8 10.6667H8.00667" id="Vector_3" stroke="var(--stroke-0, #C27AFF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
        <defs>
          <clipPath id="clip0_15_2373">
            <rect fill="white" height="16" width="16" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Heading4() {
  return (
    <div className="h-[20px] relative shrink-0 w-full" data-name="Heading 3">
      <Icon1 />
      <p className="absolute font-['Arimo:Regular',_sans-serif] font-normal leading-[20px] left-[24px] text-[#99a1af] text-[14px] text-nowrap top-[-1.2px] tracking-[0.35px] uppercase whitespace-pre">Top 3 Corrections</p>
    </div>
  );
}

function Container59() {
  return (
    <div className="h-[36px] relative shrink-0 w-[41.2px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[36px] relative w-[41.2px]">
        <p className="absolute font-['Arimo:Regular',_sans-serif] font-normal leading-[36px] left-0 text-[30px] text-neutral-950 text-nowrap top-[-2.6px] whitespace-pre">🦾</p>
      </div>
    </div>
  );
}

function Text2() {
  return (
    <div className="absolute h-[24px] left-0 top-0 w-[84.05px]" data-name="Text">
      <p className="absolute font-['Arimo:Regular',_sans-serif] font-normal leading-[24px] left-0 text-[16px] text-[rgba(255,255,255,0.9)] text-nowrap top-[-2.2px] whitespace-pre">Right Elbow</p>
    </div>
  );
}

function Badge() {
  return (
    <div className="absolute bg-[rgba(255,255,255,0.05)] h-[21.587px] left-[92.05px] rounded-[8px] top-[1.2px] w-[84.088px]" data-name="Badge">
      <div className="box-border content-stretch flex gap-[4px] h-[21.587px] items-center justify-center overflow-clip px-[8.8px] py-[2.8px] relative rounded-[inherit] w-[84.088px]">
        <p className="font-['Arimo:Regular',_sans-serif] font-normal leading-[16px] relative shrink-0 text-[12px] text-neutral-50 text-nowrap whitespace-pre">Intro, beat 7</p>
      </div>
      <div aria-hidden="true" className="absolute border-[0.8px] border-[rgba(255,255,255,0.2)] border-solid inset-0 pointer-events-none rounded-[8px]" />
    </div>
  );
}

function Container60() {
  return (
    <div className="absolute h-[24px] left-0 top-0 w-[399.6px]" data-name="Container">
      <Text2 />
      <Badge />
    </div>
  );
}

function Paragraph1() {
  return (
    <div className="absolute h-[20px] left-0 top-[28px] w-[399.6px]" data-name="Paragraph">
      <p className="absolute font-['Arimo:Regular',_sans-serif] font-normal leading-[20px] left-0 text-[#99a1af] text-[14px] text-nowrap top-[-1.2px] whitespace-pre">Right elbow too low in verse 1</p>
    </div>
  );
}

function Icon2() {
  return (
    <div className="absolute left-0 size-[12px] top-[1.99px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
        <g id="Icon">
          <path d={svgPaths.p32f38800} id="Vector" stroke="var(--stroke-0, #00D3F2)" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      </svg>
    </div>
  );
}

function Button3() {
  return (
    <div className="absolute h-[15.988px] left-0 top-[60px] w-[49.25px]" data-name="Button">
      <Icon2 />
      <p className="absolute font-['Arimo:Regular',_sans-serif] font-normal leading-[16px] left-[16px] text-[#00d3f2] text-[12px] text-nowrap top-[-1px] whitespace-pre">Watch</p>
    </div>
  );
}

function Container61() {
  return (
    <div className="basis-0 grow h-[75.987px] min-h-px min-w-px relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[75.987px] relative w-full">
        <Container60 />
        <Paragraph1 />
        <Button3 />
      </div>
    </div>
  );
}

function ReviewPage48() {
  return (
    <div className="h-[75.987px] relative shrink-0 w-full" data-name="ReviewPage">
      <div className="size-full">
        <div className="content-stretch flex gap-[12px] h-[75.987px] items-start relative w-full">
          <Container59 />
          <Container61 />
        </div>
      </div>
    </div>
  );
}

function Container62() {
  return (
    <div className="bg-[rgba(251,44,54,0.1)] h-[109.588px] relative rounded-[14px] shrink-0 w-full" data-name="Container">
      <div aria-hidden="true" className="absolute border-[0.8px] border-[rgba(251,44,54,0.3)] border-solid inset-0 pointer-events-none rounded-[14px]" />
      <div className="size-full">
        <div className="box-border content-stretch flex flex-col h-[109.588px] items-start pb-[0.8px] pt-[16.8px] px-[16.8px] relative w-full">
          <ReviewPage48 />
        </div>
      </div>
    </div>
  );
}

function Container63() {
  return (
    <div className="h-[36px] relative shrink-0 w-[41.2px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[36px] relative w-[41.2px]">
        <p className="absolute font-['Arimo:Regular',_sans-serif] font-normal leading-[36px] left-0 text-[30px] text-neutral-950 text-nowrap top-[-2.6px] whitespace-pre">💃</p>
      </div>
    </div>
  );
}

function Text3() {
  return (
    <div className="absolute h-[24px] left-0 top-0 w-[48.4px]" data-name="Text">
      <p className="absolute font-['Arimo:Regular',_sans-serif] font-normal leading-[24px] left-0 text-[16px] text-[rgba(255,255,255,0.9)] text-nowrap top-[-2.2px] whitespace-pre">Timing</p>
    </div>
  );
}

function Badge1() {
  return (
    <div className="absolute bg-[rgba(255,255,255,0.05)] h-[21.587px] left-[56.4px] rounded-[8px] top-[1.2px] w-[89.15px]" data-name="Badge">
      <div className="box-border content-stretch flex gap-[4px] h-[21.587px] items-center justify-center overflow-clip px-[8.8px] py-[2.8px] relative rounded-[inherit] w-[89.15px]">
        <p className="font-['Arimo:Regular',_sans-serif] font-normal leading-[16px] relative shrink-0 text-[12px] text-neutral-50 text-nowrap whitespace-pre">Intro, beat 15</p>
      </div>
      <div aria-hidden="true" className="absolute border-[0.8px] border-[rgba(255,255,255,0.2)] border-solid inset-0 pointer-events-none rounded-[8px]" />
    </div>
  );
}

function Container64() {
  return (
    <div className="absolute h-[24px] left-0 top-0 w-[399.6px]" data-name="Container">
      <Text3 />
      <Badge1 />
    </div>
  );
}

function Paragraph2() {
  return (
    <div className="absolute h-[20px] left-0 top-[28px] w-[399.6px]" data-name="Paragraph">
      <p className="absolute font-['Arimo:Regular',_sans-serif] font-normal leading-[20px] left-0 text-[#99a1af] text-[14px] text-nowrap top-[-1.2px] whitespace-pre">Late on beat 15 by ~110 ms</p>
    </div>
  );
}

function Icon3() {
  return (
    <div className="absolute left-0 size-[12px] top-[1.99px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
        <g id="Icon">
          <path d={svgPaths.p32f38800} id="Vector" stroke="var(--stroke-0, #00D3F2)" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      </svg>
    </div>
  );
}

function Button4() {
  return (
    <div className="absolute h-[15.988px] left-0 top-[60px] w-[49.25px]" data-name="Button">
      <Icon3 />
      <p className="absolute font-['Arimo:Regular',_sans-serif] font-normal leading-[16px] left-[16px] text-[#00d3f2] text-[12px] text-nowrap top-[-1px] whitespace-pre">Watch</p>
    </div>
  );
}

function Container65() {
  return (
    <div className="basis-0 grow h-[75.987px] min-h-px min-w-px relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[75.987px] relative w-full">
        <Container64 />
        <Paragraph2 />
        <Button4 />
      </div>
    </div>
  );
}

function ReviewPage49() {
  return (
    <div className="h-[75.987px] relative shrink-0 w-full" data-name="ReviewPage">
      <div className="size-full">
        <div className="content-stretch flex gap-[12px] h-[75.987px] items-start relative w-full">
          <Container63 />
          <Container65 />
        </div>
      </div>
    </div>
  );
}

function Container66() {
  return (
    <div className="bg-[rgba(240,177,0,0.1)] h-[109.588px] relative rounded-[14px] shrink-0 w-full" data-name="Container">
      <div aria-hidden="true" className="absolute border-[0.8px] border-[rgba(240,177,0,0.3)] border-solid inset-0 pointer-events-none rounded-[14px]" />
      <div className="size-full">
        <div className="box-border content-stretch flex flex-col h-[109.588px] items-start pb-[0.8px] pt-[16.8px] px-[16.8px] relative w-full">
          <ReviewPage49 />
        </div>
      </div>
    </div>
  );
}

function Container67() {
  return (
    <div className="h-[36px] relative shrink-0 w-[41.2px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[36px] relative w-[41.2px]">
        <p className="absolute font-['Arimo:Regular',_sans-serif] font-normal leading-[36px] left-0 text-[30px] text-neutral-950 text-nowrap top-[-2.6px] whitespace-pre">🦵</p>
      </div>
    </div>
  );
}

function Text4() {
  return (
    <div className="absolute h-[24px] left-0 top-0 w-[79.275px]" data-name="Text">
      <p className="absolute font-['Arimo:Regular',_sans-serif] font-normal leading-[24px] left-0 text-[16px] text-[rgba(255,255,255,0.9)] text-nowrap top-[-2.2px] whitespace-pre">Both Knees</p>
    </div>
  );
}

function Badge2() {
  return (
    <div className="absolute bg-[rgba(255,255,255,0.05)] h-[21.587px] left-[87.28px] rounded-[8px] top-[1.2px] w-[90.975px]" data-name="Badge">
      <div className="box-border content-stretch flex gap-[4px] h-[21.587px] items-center justify-center overflow-clip px-[8.8px] py-[2.8px] relative rounded-[inherit] w-[90.975px]">
        <p className="font-['Arimo:Regular',_sans-serif] font-normal leading-[16px] relative shrink-0 text-[12px] text-neutral-50 text-nowrap whitespace-pre">Intro, beat 23</p>
      </div>
      <div aria-hidden="true" className="absolute border-[0.8px] border-[rgba(255,255,255,0.2)] border-solid inset-0 pointer-events-none rounded-[8px]" />
    </div>
  );
}

function Container68() {
  return (
    <div className="absolute h-[24px] left-0 top-0 w-[399.6px]" data-name="Container">
      <Text4 />
      <Badge2 />
    </div>
  );
}

function Paragraph3() {
  return (
    <div className="absolute h-[20px] left-0 top-[28px] w-[399.6px]" data-name="Paragraph">
      <p className="absolute font-['Arimo:Regular',_sans-serif] font-normal leading-[20px] left-0 text-[#99a1af] text-[14px] text-nowrap top-[-1.2px] whitespace-pre">Knee angle off by ~15°</p>
    </div>
  );
}

function Icon4() {
  return (
    <div className="absolute left-0 size-[12px] top-[1.99px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
        <g id="Icon">
          <path d={svgPaths.p32f38800} id="Vector" stroke="var(--stroke-0, #00D3F2)" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      </svg>
    </div>
  );
}

function Button5() {
  return (
    <div className="absolute h-[15.988px] left-0 top-[60px] w-[49.25px]" data-name="Button">
      <Icon4 />
      <p className="absolute font-['Arimo:Regular',_sans-serif] font-normal leading-[16px] left-[16px] text-[#00d3f2] text-[12px] text-nowrap top-[-1px] whitespace-pre">Watch</p>
    </div>
  );
}

function Container69() {
  return (
    <div className="basis-0 grow h-[75.987px] min-h-px min-w-px relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[75.987px] relative w-full">
        <Container68 />
        <Paragraph3 />
        <Button5 />
      </div>
    </div>
  );
}

function ReviewPage50() {
  return (
    <div className="h-[75.987px] relative shrink-0 w-full" data-name="ReviewPage">
      <div className="size-full">
        <div className="content-stretch flex gap-[12px] h-[75.987px] items-start relative w-full">
          <Container67 />
          <Container69 />
        </div>
      </div>
    </div>
  );
}

function Container70() {
  return (
    <div className="bg-[rgba(240,177,0,0.1)] h-[109.588px] relative rounded-[14px] shrink-0 w-full" data-name="Container">
      <div aria-hidden="true" className="absolute border-[0.8px] border-[rgba(240,177,0,0.3)] border-solid inset-0 pointer-events-none rounded-[14px]" />
      <div className="size-full">
        <div className="box-border content-stretch flex flex-col h-[109.588px] items-start pb-[0.8px] pt-[16.8px] px-[16.8px] relative w-full">
          <ReviewPage50 />
        </div>
      </div>
    </div>
  );
}

function Container71() {
  return (
    <div className="content-stretch flex flex-col gap-[12px] h-[352.763px] items-start relative shrink-0 w-full" data-name="Container">
      <Container62 />
      <Container66 />
      <Container70 />
    </div>
  );
}

function Container72() {
  return (
    <div className="[grid-area:1_/_1_/_auto_/_span_2] bg-gradient-to-b from-[rgba(26,29,46,0.6)] h-[439px] relative rounded-[14px] shrink-0 to-[rgba(15,18,25,0.4)]" data-name="Container">
      <div aria-hidden="true" className="absolute border-[0.8px] border-[rgba(255,255,255,0.1)] border-solid inset-0 pointer-events-none rounded-[14px]" />
      <div className="size-full">
        <div className="box-border content-stretch flex flex-col gap-[16px] h-[439px] items-start pb-[0.8px] pt-[24.8px] px-[24.8px] relative w-full">
          <Heading4 />
          <Container71 />
        </div>
      </div>
    </div>
  );
}

function Container73() {
  return (
    <div className="absolute gap-[24px] grid grid-cols-[repeat(2,_minmax(0px,_1fr))] grid-rows-[repeat(1,_minmax(0px,_1fr))] h-[438.363px] left-[24px] top-[810.36px] w-[1096px]" data-name="Container">
      <Container72 />
    </div>
  );
}

function Heading5() {
  return (
    <div className="absolute h-[20px] left-[24.8px] top-[24.8px] w-[486.4px]" data-name="Heading 3">
      <p className="absolute font-['Arimo:Regular',_sans-serif] font-normal leading-[20px] left-0 text-[#99a1af] text-[14px] text-nowrap top-[-1.2px] tracking-[0.35px] uppercase whitespace-pre">Side-by-Side Replay</p>
    </div>
  );
}

function Container74() {
  return (
    <div className="absolute content-stretch flex h-[131.825px] items-center justify-center left-[0.8px] top-[0.8px] w-[235.6px]" data-name="Container">
      <p className="font-['Arimo:Regular',_sans-serif] font-normal leading-[48px] relative shrink-0 text-[48px] text-neutral-950 text-nowrap whitespace-pre">🎥</p>
    </div>
  );
}

function Badge3() {
  return (
    <div className="absolute bg-[rgba(0,184,219,0.1)] h-[21.587px] left-[8.8px] rounded-[8px] top-[11.6px] w-[37.638px]" data-name="Badge">
      <div className="h-[21.587px] overflow-clip relative rounded-[inherit] w-[37.638px]">
        <p className="absolute font-['Arimo:Regular',_sans-serif] font-normal leading-[16px] left-[8.8px] text-[#00d3f2] text-[12px] text-nowrap top-[1.8px] whitespace-pre">You</p>
      </div>
      <div aria-hidden="true" className="absolute border-[0.8px] border-[rgba(0,184,219,0.3)] border-solid inset-0 pointer-events-none rounded-[8px]" />
    </div>
  );
}

function Container75() {
  return (
    <div className="absolute bg-gradient-to-b from-[#0b0e16] h-[133.425px] left-0 rounded-[10px] to-[#121626] top-0 w-[237.2px]" data-name="Container">
      <div className="h-[133.425px] overflow-clip relative rounded-[inherit] w-[237.2px]">
        <Container74 />
        <Badge3 />
      </div>
      <div aria-hidden="true" className="absolute border-[0.8px] border-[rgba(255,255,255,0.05)] border-solid inset-0 pointer-events-none rounded-[10px]" />
    </div>
  );
}

function Container76() {
  return (
    <div className="absolute content-stretch flex h-[131.825px] items-center justify-center left-[0.8px] top-[0.8px] w-[235.6px]" data-name="Container">
      <p className="font-['Arimo:Regular',_sans-serif] font-normal leading-[48px] relative shrink-0 text-[48px] text-neutral-950 text-nowrap whitespace-pre">💃</p>
    </div>
  );
}

function Badge4() {
  return (
    <div className="absolute bg-[rgba(173,70,255,0.1)] h-[21.587px] left-[8.8px] rounded-[8px] top-[11.6px] w-[71.375px]" data-name="Badge">
      <div className="h-[21.587px] overflow-clip relative rounded-[inherit] w-[71.375px]">
        <p className="absolute font-['Arimo:Regular',_sans-serif] font-normal leading-[16px] left-[8.8px] text-[#c27aff] text-[12px] text-nowrap top-[1.8px] whitespace-pre">Reference</p>
      </div>
      <div aria-hidden="true" className="absolute border-[0.8px] border-[rgba(173,70,255,0.3)] border-solid inset-0 pointer-events-none rounded-[8px]" />
    </div>
  );
}

function Container77() {
  return (
    <div className="absolute bg-gradient-to-b from-[#0b0e16] h-[133.425px] left-[249.2px] rounded-[10px] to-[#121626] top-0 w-[237.2px]" data-name="Container">
      <div className="h-[133.425px] overflow-clip relative rounded-[inherit] w-[237.2px]">
        <Container76 />
        <Badge4 />
      </div>
      <div aria-hidden="true" className="absolute border-[0.8px] border-[rgba(255,255,255,0.05)] border-solid inset-0 pointer-events-none rounded-[10px]" />
    </div>
  );
}

function Container78() {
  return (
    <div className="absolute h-[133px] left-[359px] top-[45px] w-[461px]" data-name="Container">
      <Container75 />
      <Container77 />
    </div>
  );
}

function Container79() {
  return <div className="absolute bg-[rgba(249,217,73,0.25)] h-[32px] left-0 top-0 w-[10.137px]" data-name="Container" />;
}

function Container80() {
  return <div className="absolute bg-[rgba(5,223,114,0.25)] h-[32px] left-[10.14px] top-0 w-[10.137px]" data-name="Container" />;
}

function Container81() {
  return <div className="absolute bg-[rgba(249,217,73,0.25)] h-[32px] left-[20.27px] top-0 w-[10.137px]" data-name="Container" />;
}

function Container82() {
  return <div className="absolute bg-[rgba(5,223,114,0.25)] h-[32px] left-[30.41px] top-0 w-[10.137px]" data-name="Container" />;
}

function Container83() {
  return <div className="absolute bg-[rgba(249,217,73,0.25)] h-[32px] left-[40.55px] top-0 w-[10.137px]" data-name="Container" />;
}

function Container84() {
  return <div className="absolute bg-[rgba(249,217,73,0.25)] h-[32px] left-[50.69px] top-0 w-[10.137px]" data-name="Container" />;
}

function Container85() {
  return <div className="absolute bg-[rgba(5,223,114,0.25)] h-[32px] left-[60.83px] top-0 w-[10.137px]" data-name="Container" />;
}

function Container86() {
  return <div className="absolute bg-[rgba(5,223,114,0.25)] h-[32px] left-[70.96px] top-0 w-[10.137px]" data-name="Container" />;
}

function Container87() {
  return <div className="absolute bg-[rgba(251,44,54,0.25)] h-[32px] left-[81.1px] top-0 w-[10.137px]" data-name="Container" />;
}

function Container88() {
  return <div className="absolute bg-[rgba(251,44,54,0.25)] h-[32px] left-[91.24px] top-0 w-[10.137px]" data-name="Container" />;
}

function Container89() {
  return <div className="absolute bg-[rgba(249,217,73,0.25)] h-[32px] left-[101.38px] top-0 w-[10.137px]" data-name="Container" />;
}

function Container90() {
  return <div className="absolute bg-[rgba(5,223,114,0.25)] h-[32px] left-[111.51px] top-0 w-[10.137px]" data-name="Container" />;
}

function Container91() {
  return <div className="absolute bg-[rgba(5,223,114,0.25)] h-[32px] left-[121.65px] top-0 w-[10.137px]" data-name="Container" />;
}

function Container92() {
  return <div className="absolute bg-[rgba(249,217,73,0.25)] h-[32px] left-[131.79px] top-0 w-[10.137px]" data-name="Container" />;
}

function Container93() {
  return <div className="absolute bg-[rgba(249,217,73,0.25)] h-[32px] left-[141.93px] top-0 w-[10.137px]" data-name="Container" />;
}

function Container94() {
  return <div className="absolute bg-[rgba(249,217,73,0.25)] h-[32px] left-[152.06px] top-0 w-[10.137px]" data-name="Container" />;
}

function Container95() {
  return <div className="absolute bg-[rgba(249,217,73,0.25)] h-[32px] left-[162.2px] top-0 w-[10.137px]" data-name="Container" />;
}

function Container96() {
  return <div className="absolute bg-[rgba(5,223,114,0.25)] h-[32px] left-[172.34px] top-0 w-[10.137px]" data-name="Container" />;
}

function Container97() {
  return <div className="absolute bg-[rgba(5,223,114,0.25)] h-[32px] left-[182.47px] top-0 w-[10.137px]" data-name="Container" />;
}

function Container98() {
  return <div className="absolute bg-[rgba(5,223,114,0.25)] h-[32px] left-[192.61px] top-0 w-[10.137px]" data-name="Container" />;
}

function Container99() {
  return <div className="absolute bg-[rgba(5,223,114,0.25)] h-[32px] left-[202.75px] top-0 w-[10.137px]" data-name="Container" />;
}

function Container100() {
  return <div className="absolute bg-[rgba(5,223,114,0.25)] h-[32px] left-[212.89px] top-0 w-[10.137px]" data-name="Container" />;
}

function Container101() {
  return <div className="absolute bg-[rgba(5,223,114,0.25)] h-[32px] left-[223.03px] top-0 w-[10.137px]" data-name="Container" />;
}

function Container102() {
  return <div className="absolute bg-[rgba(251,44,54,0.25)] h-[32px] left-[233.16px] top-0 w-[10.137px]" data-name="Container" />;
}

function Container103() {
  return <div className="absolute bg-[rgba(249,217,73,0.25)] h-[32px] left-[243.3px] top-0 w-[10.137px]" data-name="Container" />;
}

function Container104() {
  return <div className="absolute bg-[rgba(5,223,114,0.25)] h-[32px] left-[253.44px] top-0 w-[10.137px]" data-name="Container" />;
}

function Container105() {
  return <div className="absolute bg-[rgba(5,223,114,0.25)] h-[32px] left-[263.57px] top-0 w-[10.137px]" data-name="Container" />;
}

function Container106() {
  return <div className="absolute bg-[rgba(5,223,114,0.25)] h-[32px] left-[273.71px] top-0 w-[10.137px]" data-name="Container" />;
}

function Container107() {
  return <div className="absolute bg-[rgba(249,217,73,0.25)] h-[32px] left-[283.85px] top-0 w-[10.137px]" data-name="Container" />;
}

function Container108() {
  return <div className="absolute bg-[rgba(5,223,114,0.25)] h-[32px] left-[293.99px] top-0 w-[10.137px]" data-name="Container" />;
}

function Container109() {
  return <div className="absolute bg-[rgba(249,217,73,0.25)] h-[32px] left-[304.13px] top-0 w-[10.137px]" data-name="Container" />;
}

function Container110() {
  return <div className="absolute bg-[rgba(5,223,114,0.25)] h-[32px] left-[314.26px] top-0 w-[10.137px]" data-name="Container" />;
}

function Container111() {
  return <div className="absolute bg-[rgba(5,223,114,0.25)] h-[32px] left-[324.4px] top-0 w-[10.137px]" data-name="Container" />;
}

function Container112() {
  return <div className="absolute bg-[rgba(5,223,114,0.25)] h-[32px] left-[334.54px] top-0 w-[10.137px]" data-name="Container" />;
}

function Container113() {
  return <div className="absolute bg-[rgba(5,223,114,0.25)] h-[32px] left-[344.68px] top-0 w-[10.137px]" data-name="Container" />;
}

function Container114() {
  return <div className="absolute bg-[rgba(249,217,73,0.25)] h-[32px] left-[354.81px] top-0 w-[10.137px]" data-name="Container" />;
}

function Container115() {
  return <div className="absolute bg-[rgba(5,223,114,0.25)] h-[32px] left-[364.95px] top-0 w-[10.137px]" data-name="Container" />;
}

function Container116() {
  return <div className="absolute bg-[rgba(249,217,73,0.25)] h-[32px] left-[375.09px] top-0 w-[10.137px]" data-name="Container" />;
}

function Container117() {
  return <div className="absolute bg-[rgba(249,217,73,0.25)] h-[32px] left-[385.23px] top-0 w-[10.137px]" data-name="Container" />;
}

function Container118() {
  return <div className="absolute bg-[rgba(249,217,73,0.25)] h-[32px] left-[395.36px] top-0 w-[10.137px]" data-name="Container" />;
}

function Container119() {
  return <div className="absolute bg-[rgba(5,223,114,0.25)] h-[32px] left-[405.5px] top-0 w-[10.137px]" data-name="Container" />;
}

function Container120() {
  return <div className="absolute bg-[rgba(5,223,114,0.25)] h-[32px] left-[415.64px] top-0 w-[10.137px]" data-name="Container" />;
}

function Container121() {
  return <div className="absolute bg-[rgba(249,217,73,0.25)] h-[32px] left-[425.77px] top-0 w-[10.137px]" data-name="Container" />;
}

function Container122() {
  return <div className="absolute bg-[rgba(249,217,73,0.25)] h-[32px] left-[435.91px] top-0 w-[10.137px]" data-name="Container" />;
}

function Container123() {
  return <div className="absolute bg-[rgba(5,223,114,0.25)] h-[32px] left-[446.05px] top-0 w-[10.137px]" data-name="Container" />;
}

function Container124() {
  return <div className="absolute bg-[rgba(5,223,114,0.25)] h-[32px] left-[456.19px] top-0 w-[10.137px]" data-name="Container" />;
}

function Container125() {
  return <div className="absolute bg-[rgba(5,223,114,0.25)] h-[32px] left-[466.32px] top-0 w-[10.137px]" data-name="Container" />;
}

function Container126() {
  return <div className="absolute bg-[rgba(249,217,73,0.25)] h-[32px] left-[476.46px] top-0 w-[10.137px]" data-name="Container" />;
}

function Container127() {
  return (
    <div className="absolute h-[32px] left-0 top-0 w-[486.4px]" data-name="Container">
      <Container79 />
      <Container80 />
      <Container81 />
      <Container82 />
      <Container83 />
      <Container84 />
      <Container85 />
      <Container86 />
      <Container87 />
      <Container88 />
      <Container89 />
      <Container90 />
      <Container91 />
      <Container92 />
      <Container93 />
      <Container94 />
      <Container95 />
      <Container96 />
      <Container97 />
      <Container98 />
      <Container99 />
      <Container100 />
      <Container101 />
      <Container102 />
      <Container103 />
      <Container104 />
      <Container105 />
      <Container106 />
      <Container107 />
      <Container108 />
      <Container109 />
      <Container110 />
      <Container111 />
      <Container112 />
      <Container113 />
      <Container114 />
      <Container115 />
      <Container116 />
      <Container117 />
      <Container118 />
      <Container119 />
      <Container120 />
      <Container121 />
      <Container122 />
      <Container123 />
      <Container124 />
      <Container125 />
      <Container126 />
    </div>
  );
}

function Container128() {
  return <div className="bg-white h-[12px] rounded-[2.68435e+07px] shrink-0 w-full" data-name="Container" />;
}

function Container129() {
  return (
    <div className="absolute bg-white box-border content-stretch flex flex-col h-[32px] items-start left-[192.53px] pb-0 pt-[10px] shadow-[0px_0px_10px_0px_rgba(255,255,255,0.8)] top-0 w-[4px]" data-name="Container">
      <Container128 />
    </div>
  );
}

function Container130() {
  return (
    <div className="bg-[rgba(0,0,0,0.4)] h-[32px] overflow-clip relative rounded-[10px] shrink-0 w-full" data-name="Container">
      <Container127 />
      <Container129 />
    </div>
  );
}

function Text5() {
  return (
    <div className="h-[15.988px] relative shrink-0 w-[22.762px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[15.988px] relative w-[22.762px]">
        <p className="absolute font-['Arimo:Regular',_sans-serif] font-normal leading-[16px] left-0 text-[#6a7282] text-[12px] top-[-1px] w-[23px]">40%</p>
      </div>
    </div>
  );
}

function Text6() {
  return (
    <div className="h-[15.988px] relative shrink-0 w-[24.512px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[15.988px] relative w-[24.512px]">
        <p className="absolute font-['Arimo:Regular',_sans-serif] font-normal leading-[16px] left-0 text-[#6a7282] text-[12px] top-[-1px] w-[25px]">199s</p>
      </div>
    </div>
  );
}

function Container131() {
  return (
    <div className="content-stretch flex h-[15.988px] items-start justify-between relative shrink-0 w-full" data-name="Container">
      <Text5 />
      <Text6 />
    </div>
  );
}

function Container132() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[8px] h-[55.987px] items-start left-[360px] top-[237px] w-[486.4px]" data-name="Container">
      <Container130 />
      <Container131 />
    </div>
  );
}

function Icon5() {
  return (
    <div className="absolute left-[16px] size-[16px] top-[10px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p20913c00} id="Vector" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p3d4ffb00} id="Vector_2" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Button6() {
  return (
    <div className="absolute bg-gradient-to-r from-[#ad46ff] h-[36px] left-0 rounded-[10px] to-[#f6339a] top-[0.8px] w-[91.675px]" data-name="Button">
      <Icon5 />
      <p className="absolute font-['Arimo:Regular',_sans-serif] font-normal leading-[20px] left-[40px] text-[14px] text-neutral-950 text-nowrap top-[6.8px] whitespace-pre">Pause</p>
    </div>
  );
}

function Button7() {
  return (
    <div className="absolute bg-[rgba(255,255,255,0.05)] h-[37.6px] left-[99.67px] rounded-[10px] top-0 w-[143.137px]" data-name="Button">
      <div aria-hidden="true" className="absolute border-[0.8px] border-[rgba(255,255,255,0.1)] border-solid inset-0 pointer-events-none rounded-[10px]" />
      <p className="absolute font-['Arimo:Regular',_sans-serif] font-normal leading-[20px] left-[16.8px] text-[14px] text-neutral-950 text-nowrap top-[7.6px] whitespace-pre">📉 Mistakes Only</p>
    </div>
  );
}

function Container133() {
  return (
    <div className="absolute h-[37.6px] left-[24.8px] top-[282.21px] w-[486.4px]" data-name="Container">
      <Button6 />
      <Button7 />
    </div>
  );
}

function Container134() {
  return (
    <div className="absolute bg-gradient-to-b from-[rgba(26,29,46,0.6)] h-[438px] left-[45px] rounded-[14px] to-[rgba(15,18,25,0.4)] top-[1249px] w-[1058px]" data-name="Container">
      <div aria-hidden="true" className="absolute border-[0.8px] border-[rgba(255,255,255,0.1)] border-solid inset-0 pointer-events-none rounded-[14px]" />
      <Heading5 />
      <Container78 />
      <Container132 />
      <Container133 />
    </div>
  );
}

function Icon6() {
  return (
    <div className="absolute left-[143.94px] size-[16px] top-[12px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p12949080} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M2 2V5.33333H5.33333" id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Button8() {
  return (
    <div className="basis-0 bg-gradient-to-r from-[#00b8db] grow h-[40px] min-h-px min-w-px relative rounded-[8px] shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_4px_6px_-4px_rgba(0,0,0,0.1)] shrink-0 to-[#ad46ff]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[40px] relative w-full">
        <Icon6 />
        <p className="absolute font-['Arimo:Regular',_sans-serif] font-normal leading-[20px] left-[175.94px] text-[14px] text-nowrap text-white top-[8.8px] whitespace-pre">Retry</p>
      </div>
    </div>
  );
}

function Icon7() {
  return (
    <div className="absolute left-[146.91px] size-[16px] top-[12px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p3c401780} id="Vector" stroke="var(--stroke-0, #FAFAFA)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p56b0600} id="Vector_2" stroke="var(--stroke-0, #FAFAFA)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p17caa400} id="Vector_3" stroke="var(--stroke-0, #FAFAFA)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Button9() {
  return (
    <div className="basis-0 bg-[rgba(38,38,38,0.3)] grow h-[40px] min-h-px min-w-px relative rounded-[8px] shrink-0" data-name="Button">
      <div aria-hidden="true" className="absolute border-[0.8px] border-neutral-800 border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[40px] relative w-full">
        <Icon7 />
        <p className="absolute font-['Arimo:Regular',_sans-serif] font-normal leading-[20px] left-[178.91px] text-[14px] text-neutral-50 text-nowrap top-[8.8px] whitespace-pre">Save</p>
      </div>
    </div>
  );
}

function Icon8() {
  return (
    <div className="absolute left-[143.81px] size-[16px] top-[12px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p185fb780} id="Vector" stroke="var(--stroke-0, #FAFAFA)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p30ca5e80} id="Vector_2" stroke="var(--stroke-0, #FAFAFA)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.pac25b80} id="Vector_3" stroke="var(--stroke-0, #FAFAFA)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M5.72668 9.00667L10.28 11.66" id="Vector_4" stroke="var(--stroke-0, #FAFAFA)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p39b18600} id="Vector_5" stroke="var(--stroke-0, #FAFAFA)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Button10() {
  return (
    <div className="basis-0 bg-[rgba(38,38,38,0.3)] grow h-[40px] min-h-px min-w-px relative rounded-[8px] shrink-0" data-name="Button">
      <div aria-hidden="true" className="absolute border-[0.8px] border-neutral-800 border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[40px] relative w-full">
        <Icon8 />
        <p className="absolute font-['Arimo:Regular',_sans-serif] font-normal leading-[20px] left-[175.81px] text-[14px] text-neutral-50 text-nowrap top-[8.8px] whitespace-pre">Share</p>
      </div>
    </div>
  );
}

function Container135() {
  return (
    <div className="absolute box-border content-stretch flex gap-[16px] h-[56px] items-start left-[34px] pb-0 pt-[16px] px-0 top-[1930px] w-[1096px]" data-name="Container">
      <Button8 />
      <Button9 />
      <Button10 />
    </div>
  );
}

function Container136() {
  return <div className="absolute h-[419.188px] left-0 opacity-30 top-0 w-[1096px]" data-name="Container" style={{ backgroundImage: "url('data:image/svg+xml;utf8,<svg viewBox=\\\'0 0 1096 419.19\\\' xmlns=\\\'http://www.w3.org/2000/svg\\\' preserveAspectRatio=\\\'none\\\'><rect x=\\\'0\\\' y=\\\'0\\\' height=\\\'100%\\\' width=\\\'100%\\\' fill=\\\'url(%23grad)\\\' opacity=\\\'1\\\'/><defs><radialGradient id=\\\'grad\\\' gradientUnits=\\\'userSpaceOnUse\\\' cx=\\\'0\\\' cy=\\\'0\\\' r=\\\'10\\\' gradientTransform=\\\'matrix(0 -64.247 -64.247 0 548 83.838)\\\'><stop stop-color=\\\'rgba(5,223,114,0.2)\\\' offset=\\\'0\\\'/><stop stop-color=\\\'rgba(3,112,57,0.1)\\\' offset=\\\'0.25\\\'/><stop stop-color=\\\'rgba(0,0,0,0)\\\' offset=\\\'0.5\\\'/></radialGradient></defs></svg>')" }} />;
}

function Container137() {
  return (
    <div className="absolute h-[120px] left-0 top-0 w-[123.375px]" data-name="Container">
      <p className="absolute font-['Arimo:Regular',_sans-serif] font-normal leading-[120px] left-[62.5px] text-[#05df72] text-[120px] text-center text-nowrap top-[-11px] tracking-[-3px] translate-x-[-50%] whitespace-pre">82</p>
    </div>
  );
}

function Text7() {
  return (
    <div className="absolute h-[48px] left-[131.38px] top-[65.6px] w-[39.288px]" data-name="Text">
      <p className="absolute font-['Arimo:Regular',_sans-serif] font-normal leading-[48px] left-[20.5px] text-[48px] text-[rgba(255,255,255,0.4)] text-center text-nowrap top-[-5px] translate-x-[-50%] whitespace-pre">%</p>
    </div>
  );
}

function Container138() {
  return (
    <div className="absolute h-[120px] left-[429.86px] top-0 w-[170.663px]" data-name="Container">
      <Container137 />
      <Text7 />
    </div>
  );
}

function ReviewPage51() {
  return (
    <div className="h-[60px] relative shadow-[0px_0px_40px_0px_rgba(5,223,114,0.5)] shrink-0 w-[82.388px]" data-name="ReviewPage">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[60px] relative w-[82.388px]">
        <p className="absolute font-['Arimo:Regular',_sans-serif] font-normal leading-[60px] left-[41px] text-[60px] text-center text-neutral-950 text-nowrap top-[-6.4px] translate-x-[-50%] whitespace-pre">🔥</p>
      </div>
    </div>
  );
}

function ReviewPage52() {
  return (
    <div className="h-[40px] relative shrink-0 w-[300.95px]" data-name="ReviewPage">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[40px] relative w-[300.95px]">
        <p className="absolute font-['Arimo:Regular',_sans-serif] font-normal leading-[40px] left-[150.5px] text-[#05df72] text-[36px] text-center top-[-3px] tracking-[1.8px] translate-x-[-50%] uppercase w-[301px]">A RANK - GREAT!</p>
      </div>
    </div>
  );
}

function Container139() {
  return (
    <div className="absolute box-border content-stretch flex gap-[12px] h-[60px] items-center justify-center left-0 pl-0 pr-[0.013px] py-0 top-[144px] w-[1030.4px]" data-name="Container">
      <ReviewPage51 />
      <ReviewPage52 />
    </div>
  );
}

function Icon9() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Icon">
          <path d={svgPaths.p30c3b00} id="Vector" stroke="var(--stroke-0, #A855F7)" strokeWidth="1.5" />
          <path d="M10 6V10L13 13" id="Vector_2" stroke="var(--stroke-0, #A855F7)" strokeLinecap="round" strokeWidth="1.5" />
        </g>
      </svg>
    </div>
  );
}

function Text8() {
  return (
    <div className="h-[20px] relative shrink-0 w-[49.538px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[20px] relative w-[49.538px]">
        <p className="absolute font-['Arimo:Regular',_sans-serif] font-normal leading-[20px] left-[25.5px] text-[#99a1af] text-[14px] text-center text-nowrap top-[-1.2px] tracking-[0.35px] translate-x-[-50%] uppercase whitespace-pre">Timing</p>
      </div>
    </div>
  );
}

function Container140() {
  return (
    <div className="content-stretch flex gap-[8px] h-[20px] items-center relative shrink-0 w-full" data-name="Container">
      <Icon9 />
      <Text8 />
    </div>
  );
}

function Container141() {
  return (
    <div className="h-[36px] relative shrink-0 w-full" data-name="Container">
      <p className="absolute font-['Arimo:Regular',_sans-serif] font-normal h-[53px] leading-[36px] left-[104.7px] text-[#c27aff] text-[30px] text-center top-[-2.6px] translate-x-[-50%] w-[55px]">79%</p>
    </div>
  );
}

function Container142() {
  return (
    <div className="content-stretch flex h-[15.988px] items-start relative shrink-0 w-full" data-name="Container">
      <p className="basis-0 font-['Arimo:Regular',_sans-serif] font-normal grow leading-[16px] min-h-px min-w-px relative shrink-0 text-[#6a7282] text-[12px] text-center">Beats on time</p>
    </div>
  );
}

function ReviewPage53() {
  return (
    <div className="absolute bg-gradient-to-b box-border content-stretch flex flex-col from-[rgba(173,70,255,0.1)] gap-[8px] h-[117.588px] items-start left-0 pb-[0.8px] pt-[16.8px] px-[16.8px] rounded-[14px] to-[rgba(0,0,0,0)] top-0 w-[245.325px]" data-name="ReviewPage">
      <div aria-hidden="true" className="absolute border-[0.8px] border-[rgba(173,70,255,0.2)] border-solid inset-0 pointer-events-none rounded-[14px]" />
      <Container140 />
      <Container141 />
      <Container142 />
    </div>
  );
}

function Icon10() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Icon">
          <path d={svgPaths.p3998eb80} id="Vector" stroke="var(--stroke-0, #00D3F3)" strokeLinejoin="round" strokeWidth="1.5" />
        </g>
      </svg>
    </div>
  );
}

function Text9() {
  return (
    <div className="h-[20px] relative shrink-0 w-[34.325px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[20px] relative w-[34.325px]">
        <p className="absolute font-['Arimo:Regular',_sans-serif] font-normal leading-[20px] left-[17px] text-[#99a1af] text-[14px] text-center text-nowrap top-[-1.2px] tracking-[0.35px] translate-x-[-50%] uppercase whitespace-pre">Pose</p>
      </div>
    </div>
  );
}

function Container143() {
  return (
    <div className="content-stretch flex gap-[8px] h-[20px] items-center relative shrink-0 w-full" data-name="Container">
      <Icon10 />
      <Text9 />
    </div>
  );
}

function Container144() {
  return (
    <div className="h-[36px] relative shrink-0 w-full" data-name="Container">
      <p className="absolute font-['Arimo:Regular',_sans-serif] font-normal leading-[36px] left-[105.91px] text-[#00d3f2] text-[30px] text-center top-[-2.6px] translate-x-[-50%] w-[57px]">86%</p>
    </div>
  );
}

function Container145() {
  return (
    <div className="content-stretch flex h-[15.988px] items-start relative shrink-0 w-full" data-name="Container">
      <p className="basis-0 font-['Arimo:Regular',_sans-serif] font-normal grow leading-[16px] min-h-px min-w-px relative shrink-0 text-[#6a7282] text-[12px] text-center">Avg angle match</p>
    </div>
  );
}

function ReviewPage54() {
  return (
    <div className="absolute bg-gradient-to-b box-border content-stretch flex flex-col from-[rgba(0,184,219,0.1)] gap-[8px] h-[117.588px] items-start left-[261.32px] pb-[0.8px] pt-[16.8px] px-[16.8px] rounded-[14px] to-[rgba(0,0,0,0)] top-0 w-[245.338px]" data-name="ReviewPage">
      <div aria-hidden="true" className="absolute border-[0.8px] border-[rgba(0,184,219,0.2)] border-solid inset-0 pointer-events-none rounded-[14px]" />
      <Container143 />
      <Container144 />
      <Container145 />
    </div>
  );
}

function Icon11() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Icon">
          <path d={svgPaths.p3ac0b600} id="Vector" stroke="var(--stroke-0, #05DF72)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d={svgPaths.p3c797180} id="Vector_2" stroke="var(--stroke-0, #05DF72)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
      </svg>
    </div>
  );
}

function Text10() {
  return (
    <div className="h-[20px] relative shrink-0 w-[93.075px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[20px] relative w-[93.075px]">
        <p className="absolute font-['Arimo:Regular',_sans-serif] font-normal leading-[20px] left-[47.5px] text-[#99a1af] text-[14px] text-center text-nowrap top-[-1.2px] tracking-[0.35px] translate-x-[-50%] uppercase whitespace-pre">Consistency</p>
      </div>
    </div>
  );
}

function Container146() {
  return (
    <div className="content-stretch flex gap-[8px] h-[20px] items-center relative shrink-0 w-full" data-name="Container">
      <Icon11 />
      <Text10 />
    </div>
  );
}

function Container147() {
  return (
    <div className="h-[36px] relative shrink-0 w-full" data-name="Container">
      <p className="absolute font-['Arimo:Regular',_sans-serif] font-normal leading-[36px] left-[105.9px] text-[#05df72] text-[30px] text-center top-[-2.6px] translate-x-[-50%] w-[57px]">82%</p>
    </div>
  );
}

function Container148() {
  return (
    <div className="content-stretch flex h-[15.988px] items-start relative shrink-0 w-full" data-name="Container">
      <p className="basis-0 font-['Arimo:Regular',_sans-serif] font-normal grow leading-[16px] min-h-px min-w-px relative shrink-0 text-[#6a7282] text-[12px] text-center">Timing variance</p>
    </div>
  );
}

function ReviewPage55() {
  return (
    <div className="absolute bg-gradient-to-b box-border content-stretch flex flex-col from-[rgba(0,201,80,0.1)] gap-[8px] h-[117.588px] items-start left-[522.66px] pb-[0.8px] pt-[16.8px] px-[16.8px] rounded-[14px] to-[rgba(0,0,0,0)] top-0 w-[245.325px]" data-name="ReviewPage">
      <div aria-hidden="true" className="absolute border-[0.8px] border-[rgba(0,201,80,0.2)] border-solid inset-0 pointer-events-none rounded-[14px]" />
      <Container146 />
      <Container147 />
      <Container148 />
    </div>
  );
}

function Container149() {
  return (
    <div className="absolute h-[117.588px] left-[131.2px] top-[236px] w-[768px]" data-name="Container">
      <ReviewPage53 />
      <ReviewPage54 />
      <ReviewPage55 />
    </div>
  );
}

function Container150() {
  return (
    <div className="h-[353.587px] relative shrink-0 w-full" data-name="Container">
      <Container138 />
      <Container139 />
      <Container149 />
    </div>
  );
}

function Container151() {
  return (
    <div className="absolute bg-gradient-to-b box-border content-stretch flex flex-col from-[rgba(26,29,46,0.8)] h-[419.188px] items-start left-0 pb-[0.8px] pt-[32.8px] px-[32.8px] rounded-[16px] to-[rgba(15,18,25,0.6)] top-0 w-[1096px]" data-name="Container">
      <div aria-hidden="true" className="absolute border-[0.8px] border-[rgba(255,255,255,0.1)] border-solid inset-0 pointer-events-none rounded-[16px]" />
      <Container150 />
    </div>
  );
}

function Container152() {
  return (
    <div className="absolute h-[419.188px] left-[24px] top-[88px] w-[1096px]" data-name="Container">
      <Container136 />
      <Container151 />
    </div>
  );
}

export default function ReviewPage56() {
  return (
    <div className="bg-gradient-to-b from-[#0b0e16] relative size-full to-[#121626] via-50% via-[#0f1219]" data-name="ReviewPage">
      <Container1 />
      <Container58 />
      <Container73 />
      <Container134 />
      <Container135 />
      <Container152 />
    </div>
  );
}