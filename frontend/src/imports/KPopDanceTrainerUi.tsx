import svgPaths from "./svg-pv40p5012r";

function Container() {
  return (
    <div className="h-[36px] relative shrink-0 w-full" data-name="Container">
      <p className="absolute font-['Arimo:Regular',_sans-serif] font-normal leading-[36px] left-[537.24px] text-[#05df72] text-[30px] text-center top-[-2.6px] translate-x-[-50%] w-[57px]">82%</p>
    </div>
  );
}

function Container1() {
  return (
    <div className="content-stretch flex h-[15.988px] items-start relative shrink-0 w-full" data-name="Container">
      <p className="basis-0 font-['Arimo:Regular',_sans-serif] font-normal grow leading-[16px] min-h-px min-w-px relative shrink-0 text-[#99a1af] text-[12px] text-center tracking-[0.6px] uppercase">Great!</p>
    </div>
  );
}

function Container2() {
  return (
    <div className="absolute bg-[rgba(0,201,80,0.1)] box-border content-stretch flex flex-col gap-[4px] h-[91.188px] items-start left-[16px] pb-[1.6px] pt-[17.6px] px-[25.6px] rounded-[16px] top-[24px] w-[1125.6px]" data-name="Container">
      <div aria-hidden="true" className="absolute border-[1.6px] border-[rgba(0,201,80,0.5)] border-solid inset-0 pointer-events-none rounded-[16px] shadow-[0px_0px_20px_0px_rgba(34,197,94,0.2)]" />
      <Container />
      <Container1 />
    </div>
  );
}

function Container3() {
  return (
    <div className="content-stretch flex h-[15.988px] items-start relative shrink-0 w-full" data-name="Container">
      <p className="basis-0 font-['Arimo:Regular',_sans-serif] font-normal grow leading-[16px] min-h-px min-w-px relative shrink-0 text-[#6a7282] text-[12px] text-center tracking-[0.3px] uppercase">Live Feedback</p>
    </div>
  );
}

function Icon() {
  return (
    <div className="absolute left-0 size-[16px] top-[2px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g clipPath="url(#clip0_7_832)" id="Icon">
          <path d={svgPaths.p39ee6532} id="Vector" stroke="var(--stroke-0, #C27AFF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M8 5.33333V8" id="Vector_2" stroke="var(--stroke-0, #C27AFF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M8 10.6667H8.00667" id="Vector_3" stroke="var(--stroke-0, #C27AFF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
        <defs>
          <clipPath id="clip0_7_832">
            <rect fill="white" height="16" width="16" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Container4() {
  return (
    <div className="content-stretch flex h-[15.988px] items-start relative shrink-0 w-full" data-name="Container">
      <p className="basis-0 font-['Arimo:Regular',_sans-serif] font-normal grow leading-[16px] min-h-px min-w-px relative shrink-0 text-[#dab2ff] text-[12px]">Right Elbow</p>
    </div>
  );
}

function Container5() {
  return (
    <div className="h-[17.5px] relative shrink-0 w-full" data-name="Container">
      <p className="absolute font-['Arimo:Regular',_sans-serif] font-normal leading-[17.5px] left-0 text-[14px] text-[rgba(255,255,255,0.9)] text-nowrap top-[-1.8px] whitespace-pre">Raise right elbow ~12° higher</p>
    </div>
  );
}

function Container6() {
  return (
    <div className="h-[15.988px] relative shrink-0 w-full" data-name="Container">
      <p className="absolute font-['Arimo:Regular',_sans-serif] font-normal leading-[16px] left-0 text-[#6a7282] text-[12px] top-[-1px] w-[34px]">Beat 7</p>
    </div>
  );
}

function Container7() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[4px] h-[57.475px] items-start left-[24px] top-0 w-[1068px]" data-name="Container">
      <Container4 />
      <Container5 />
      <Container6 />
    </div>
  );
}

function LiveFeedback() {
  return (
    <div className="h-[57.475px] relative shrink-0 w-full" data-name="LiveFeedback">
      <Icon />
      <Container7 />
    </div>
  );
}

function Container8() {
  return (
    <div className="bg-[rgba(173,70,255,0.1)] h-[91.075px] relative rounded-[14px] shrink-0 w-full" data-name="Container">
      <div aria-hidden="true" className="absolute border-[0.8px] border-[rgba(173,70,255,0.3)] border-solid inset-0 pointer-events-none rounded-[14px] shadow-[0px_0px_20px_0px_rgba(168,85,247,0.15)]" />
      <div className="size-full">
        <div className="box-border content-stretch flex flex-col h-[91.075px] items-start pb-[0.8px] pt-[16.8px] px-[16.8px] relative w-full">
          <LiveFeedback />
        </div>
      </div>
    </div>
  );
}

function Container9() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[16px] h-[123.062px] items-start left-[16px] overflow-clip top-[147.19px] w-[1125.6px]" data-name="Container">
      <Container3 />
      <Container8 />
    </div>
  );
}

function Icon1() {
  return (
    <div className="h-[34.8px] overflow-clip relative shrink-0 w-full" data-name="Icon">
      <div className="absolute inset-[12.5%_20.83%_8.33%_20.83%]" data-name="Vector">
        <div className="absolute inset-[-5.26%_-7.14%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 31">
            <path d={svgPaths.p21782900} id="Vector" stroke="var(--stroke-0, #FF8904)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.90001" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Container10() {
  return (
    <div className="absolute content-stretch flex flex-col items-start left-[561.4px] size-[34.8px] top-[292.85px]" data-name="Container">
      <Icon1 />
    </div>
  );
}

function LiveFeedback1() {
  return (
    <div className="bg-gradient-to-b from-[#0f1219] h-[350.25px] relative shrink-0 to-[#13161f] w-full" data-name="LiveFeedback">
      <Container2 />
      <Container9 />
      <Container10 />
    </div>
  );
}

function Container11() {
  return (
    <div className="absolute box-border content-stretch flex flex-col h-[350.25px] items-start left-0 px-[0.8px] py-0 top-[881.8px] w-[1159.2px]" data-name="Container">
      <div aria-hidden="true" className="absolute border-[0px_0.8px] border-[rgba(255,255,255,0.05)] border-solid inset-0 pointer-events-none" />
      <LiveFeedback1 />
    </div>
  );
}

function Canvas() {
  return <div className="absolute h-[832.2px] left-[0.8px] top-[0.8px] w-[1109.6px]" data-name="Canvas" />;
}

function Container12() {
  return (
    <div className="absolute content-stretch flex h-[15.988px] items-start left-[16.8px] top-[16.8px] w-[71.487px]" data-name="Container">
      <p className="font-['Arimo:Regular',_sans-serif] font-normal leading-[16px] relative shrink-0 text-[#6a7282] text-[12px] text-nowrap tracking-[0.6px] uppercase whitespace-pre">User</p>
    </div>
  );
}

function PerformerView() {
  return (
    <div className="absolute bg-gradient-to-b from-[#0b0e16] h-[537px] left-[24px] rounded-[10px] to-[#121626] top-[24px] w-[421px]" data-name="PerformerView">
      <div className="h-[537px] overflow-clip relative rounded-[inherit] w-[421px]">
        <Canvas />
        <Container12 />
      </div>
      <div aria-hidden="true" className="absolute border-[0.8px] border-[rgba(255,255,255,0.05)] border-solid inset-0 pointer-events-none rounded-[10px]" />
    </div>
  );
}

function Button() {
  return (
    <div className="h-[27.988px] relative rounded-[4px] shrink-0 w-[54.225px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[27.988px] relative w-[54.225px]">
        <p className="absolute font-['Arimo:Regular',_sans-serif] font-normal leading-[16px] left-[12px] text-[#99a1af] text-[12px] top-[5px] w-[31px]">0.75×</p>
      </div>
    </div>
  );
}

function Button1() {
  return (
    <div className="bg-[rgba(173,70,255,0.8)] h-[27.988px] relative rounded-[4px] shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_4px_6px_-4px_rgba(0,0,0,0.1)] shrink-0 w-[38.688px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[27.988px] relative w-[38.688px]">
        <p className="absolute font-['Arimo:Regular',_sans-serif] font-normal leading-[16px] left-[12px] text-[12px] text-white top-[5px] w-[15px]">1×</p>
      </div>
    </div>
  );
}

function Container13() {
  return (
    <div className="absolute bg-[rgba(255,255,255,0.05)] box-border content-stretch flex gap-[4px] h-[35.987px] items-start left-[398.88px] pb-0 pl-[4px] pr-0 pt-[4px] rounded-[10px] top-0 w-[104.912px]" data-name="Container">
      <Button />
      <Button1 />
    </div>
  );
}

function Icon2() {
  return (
    <div className="absolute left-[12px] size-[12px] top-[7.99px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
        <g id="Icon">
          <path d="M1.5 3.5L4 6L1.5 8.5V3.5Z" id="Vector" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M10.5 3.5L8 6L10.5 8.5V3.5Z" id="Vector_2" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M6 10V11" id="Vector_3" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M6 7V8" id="Vector_4" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M6 4V5" id="Vector_5" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M6 1V2" id="Vector_6" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      </svg>
    </div>
  );
}

function Button2() {
  return (
    <div className="absolute bg-[rgba(255,255,255,0.05)] h-[27.988px] left-[511.79px] rounded-[10px] top-[4px] w-[73.237px]" data-name="Button">
      <Icon2 />
      <p className="absolute font-['Arimo:Regular',_sans-serif] font-normal leading-[16px] left-[28px] text-[#99a1af] text-[12px] text-nowrap top-[5px] whitespace-pre">Mirror</p>
    </div>
  );
}

function Icon3() {
  return (
    <div className="absolute left-[12px] size-[12px] top-[7.99px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
        <g id="Icon">
          <path d={svgPaths.p2ab476c0} id="Vector" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" />
          <path d={svgPaths.p24092800} id="Vector_2" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      </svg>
    </div>
  );
}

function Button3() {
  return (
    <div className="absolute bg-[rgba(255,255,255,0.05)] h-[27.988px] left-[593.02px] rounded-[10px] top-[4px] w-[85.688px]" data-name="Button">
      <Icon3 />
      <p className="absolute font-['Arimo:Regular',_sans-serif] font-normal leading-[16px] left-[28px] text-[#99a1af] text-[12px] text-nowrap top-[5px] whitespace-pre">Skeleton</p>
    </div>
  );
}

function Container14() {
  return (
    <div className="h-[35.987px] relative shrink-0 w-full" data-name="Container">
      <Container13 />
      <Button2 />
      <Button3 />
    </div>
  );
}

function Container15() {
  return (
    <div className="absolute bg-[rgba(0,0,0,0.3)] box-border content-stretch flex flex-col h-[68.787px] items-start left-[0.8px] pb-0 pt-[16.8px] px-[16px] top-[80.8px] w-[1109.6px]" data-name="Container">
      <div aria-hidden="true" className="absolute border-[0.8px_0px_0px] border-[rgba(255,255,255,0.05)] border-solid inset-0 pointer-events-none" />
      <Container14 />
    </div>
  );
}

function Container16() {
  return (
    <div className="h-[48px] relative shrink-0 w-full" data-name="Container">
      <p className="absolute font-['Arimo:Regular',_sans-serif] font-normal leading-[48px] left-[50.34px] text-[48px] text-center text-neutral-950 text-nowrap top-[-5px] translate-x-[-50%] whitespace-pre">💃</p>
    </div>
  );
}

function Container17() {
  return (
    <div className="h-[20px] relative shrink-0 w-full" data-name="Container">
      <p className="absolute font-['Arimo:Regular',_sans-serif] font-normal leading-[20px] left-[50.5px] text-[#99a1af] text-[14px] text-center text-nowrap top-[-1.2px] translate-x-[-50%] whitespace-pre">Reference Video</p>
    </div>
  );
}

function Container18() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[12px] h-[80px] items-start left-[505.3px] top-[0.8px] w-[100.588px]" data-name="Container">
      <Container16 />
      <Container17 />
    </div>
  );
}

function Container19() {
  return (
    <div className="absolute content-stretch flex h-[15.988px] items-start left-[1028.09px] top-[16.8px] w-[66.313px]" data-name="Container">
      <p className="font-['Arimo:Regular',_sans-serif] font-normal leading-[16px] relative shrink-0 text-[#6a7282] text-[12px] text-nowrap tracking-[0.6px] uppercase whitespace-pre">Reference</p>
    </div>
  );
}

function ReferenceVideoView() {
  return (
    <div className="absolute bg-gradient-to-b from-[#0b0e16] h-[150.387px] left-[24px] rounded-[10px] to-[#121626] top-[1256.05px] w-[1111.2px]" data-name="ReferenceVideoView">
      <div className="h-[150.387px] overflow-clip relative rounded-[inherit] w-[1111.2px]">
        <Container15 />
        <Container18 />
        <Container19 />
      </div>
      <div aria-hidden="true" className="absolute border-[0.8px] border-[rgba(255,255,255,0.05)] border-solid inset-0 pointer-events-none rounded-[10px]" />
    </div>
  );
}

function Canvas1() {
  return <div className="absolute h-[832.2px] left-[0.8px] top-[0.8px] w-[1109.6px]" data-name="Canvas" />;
}

function Container20() {
  return (
    <div className="absolute content-stretch flex h-[15.988px] items-start left-[16.8px] top-[16.8px] w-[71.487px]" data-name="Container">
      <p className="font-['Arimo:Regular',_sans-serif] font-normal leading-[16px] relative shrink-0 text-[#6a7282] text-[12px] text-nowrap tracking-[0.6px] uppercase whitespace-pre">Performer</p>
    </div>
  );
}

function PerformerView1() {
  return (
    <div className="absolute bg-gradient-to-b from-[#0b0e16] h-[537px] left-[674px] rounded-[10px] to-[#121626] top-[24px] w-[426px]" data-name="PerformerView">
      <div className="h-[537px] overflow-clip relative rounded-[inherit] w-[426px]">
        <Canvas1 />
        <Container20 />
      </div>
      <div aria-hidden="true" className="absolute border-[0.8px] border-[rgba(255,255,255,0.05)] border-solid inset-0 pointer-events-none rounded-[10px]" />
    </div>
  );
}

function Canvas2() {
  return <div className="absolute h-[832.2px] left-[0.8px] top-[0.8px] w-[1109.6px]" data-name="Canvas" />;
}

function Container21() {
  return (
    <div className="absolute content-stretch flex items-start left-[16.8px] top-[16.8px] w-[71.487px]" data-name="Container">
      <p className="font-['Arimo:Regular',_sans-serif] font-normal leading-[16px] relative shrink-0 text-[#6a7282] text-[12px] text-nowrap tracking-[0.6px] uppercase whitespace-pre">live feedback</p>
    </div>
  );
}

function PerformerView2() {
  return (
    <div className="absolute bg-gradient-to-b from-[#0b0e16] h-[515px] left-[469px] rounded-[10px] to-[#121626] top-[25px] w-[164px]" data-name="PerformerView">
      <div className="h-[515px] overflow-clip relative rounded-[inherit] w-[164px]">
        <Canvas2 />
        <Container21 />
      </div>
      <div aria-hidden="true" className="absolute border-[0.8px] border-[rgba(255,255,255,0.05)] border-solid inset-0 pointer-events-none rounded-[10px]" />
    </div>
  );
}

function Container22() {
  return (
    <div className="absolute h-[594.4px] left-0 overflow-clip top-[80px] w-[1159.2px]" data-name="Container">
      <Container11 />
      <PerformerView />
      <ReferenceVideoView />
      <PerformerView1 />
      <PerformerView2 />
    </div>
  );
}

function Icon4() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Icon">
          <path d={svgPaths.p2af6372} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
      </svg>
    </div>
  );
}

function Button4() {
  return (
    <div className="absolute box-border content-stretch flex items-center justify-center left-0 pl-[2px] pr-0 py-0 rounded-[2.68435e+07px] shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_4px_6px_-4px_rgba(0,0,0,0.1)] size-[48px] top-0" data-name="Button">
      <Icon4 />
    </div>
  );
}

function Icon5() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p12949080} id="Vector" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M2 2V5.33333H5.33333" id="Vector_2" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Button5() {
  return (
    <div className="absolute bg-[rgba(255,255,255,0.05)] box-border content-stretch flex items-center justify-center left-[60px] p-[0.8px] rounded-[2.68435e+07px] size-[40px] top-[4px]" data-name="Button">
      <div aria-hidden="true" className="absolute border-[0.8px] border-[rgba(255,255,255,0.1)] border-solid inset-0 pointer-events-none rounded-[2.68435e+07px]" />
      <Icon5 />
    </div>
  );
}

function Container23() {
  return <div className="absolute bg-[rgba(255,255,255,0.1)] h-[32px] left-[120px] top-[8px] w-px" data-name="Container" />;
}

function Icon6() {
  return (
    <div className="absolute left-[12px] size-[12px] top-[7.99px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
        <g id="Icon">
          <path d="M8.5 1L10.5 3L8.5 5" id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" />
          <path d={svgPaths.pc185880} id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M3.5 11L1.5 9L3.5 7" id="Vector_3" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" />
          <path d={svgPaths.p1b93600} id="Vector_4" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      </svg>
    </div>
  );
}

function Button6() {
  return (
    <div className="bg-[rgba(255,255,255,0.1)] h-[27.988px] relative rounded-[4px] shrink-0 w-[46.475px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[27.988px] relative w-[46.475px]">
        <Icon6 />
        <p className="absolute font-['Arimo:Regular',_sans-serif] font-normal leading-[16px] left-[28px] text-[12px] text-nowrap text-white top-[5px] whitespace-pre">8</p>
      </div>
    </div>
  );
}

function Icon7() {
  return (
    <div className="absolute left-[12px] size-[12px] top-[7.99px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
        <g id="Icon">
          <path d="M8.5 1L10.5 3L8.5 5" id="Vector" stroke="var(--stroke-0, #6A7282)" strokeLinecap="round" strokeLinejoin="round" />
          <path d={svgPaths.pc185880} id="Vector_2" stroke="var(--stroke-0, #6A7282)" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M3.5 11L1.5 9L3.5 7" id="Vector_3" stroke="var(--stroke-0, #6A7282)" strokeLinecap="round" strokeLinejoin="round" />
          <path d={svgPaths.p1b93600} id="Vector_4" stroke="var(--stroke-0, #6A7282)" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      </svg>
    </div>
  );
}

function Button7() {
  return (
    <div className="h-[27.988px] relative rounded-[4px] shrink-0 w-[52.938px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[27.988px] relative w-[52.938px]">
        <Icon7 />
        <p className="absolute font-['Arimo:Regular',_sans-serif] font-normal leading-[16px] left-[28px] text-[#6a7282] text-[12px] text-nowrap top-[5px] whitespace-pre">16</p>
      </div>
    </div>
  );
}

function Container24() {
  return (
    <div className="absolute bg-[rgba(255,255,255,0.05)] box-border content-stretch flex gap-[4px] h-[37.587px] items-start left-[141px] pb-[0.8px] pl-[4.8px] pr-[0.8px] pt-[4.8px] rounded-[10px] top-[5.2px] w-[113.013px]" data-name="Container">
      <div aria-hidden="true" className="absolute border-[0.8px] border-[rgba(255,255,255,0.1)] border-solid inset-0 pointer-events-none rounded-[10px]" />
      <Button6 />
      <Button7 />
    </div>
  );
}

function Icon8() {
  return (
    <div className="absolute left-[12.8px] size-[12px] top-[8.79px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
        <g id="Icon">
          <path d="M6 7L8 5" id="Vector" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" />
          <path d={svgPaths.p2b522d80} id="Vector_2" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      </svg>
    </div>
  );
}

function Button8() {
  return (
    <div className="absolute bg-[rgba(255,255,255,0.05)] h-[29.587px] left-[266.01px] rounded-[10px] top-[9.2px] w-[56.288px]" data-name="Button">
      <div aria-hidden="true" className="absolute border-[0.8px] border-[rgba(255,255,255,0.1)] border-solid inset-0 pointer-events-none rounded-[10px]" />
      <Icon8 />
      <p className="absolute font-['Arimo:Regular',_sans-serif] font-normal leading-[16px] left-[28.8px] text-[#99a1af] text-[12px] top-[5.8px] w-[15px]">1×</p>
    </div>
  );
}

function Container25() {
  return (
    <div className="h-[48px] relative shrink-0 w-[322.3px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[48px] relative w-[322.3px]">
        <Button4 />
        <Button5 />
        <Container23 />
        <Container24 />
        <Button8 />
      </div>
    </div>
  );
}

function Icon9() {
  return (
    <div className="absolute left-[12.8px] size-[12px] top-[8.79px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
        <g id="Icon">
          <path d={svgPaths.p2eb9c380} id="Vector" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" />
          <path d={svgPaths.p24092800} id="Vector_2" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      </svg>
    </div>
  );
}

function Button9() {
  return (
    <div className="absolute bg-[rgba(255,255,255,0.05)] h-[29.587px] left-0 rounded-[10px] top-[5.2px] w-[98.862px]" data-name="Button">
      <div aria-hidden="true" className="absolute border-[0.8px] border-[rgba(255,255,255,0.1)] border-solid inset-0 pointer-events-none rounded-[10px]" />
      <Icon9 />
      <p className="absolute font-['Arimo:Regular',_sans-serif] font-normal leading-[16px] left-[28.8px] text-[#99a1af] text-[12px] top-[5.8px] w-[58px]">Ghost 60%</p>
    </div>
  );
}

function Icon10() {
  return (
    <div className="absolute left-[12.8px] size-[12px] top-[8.79px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
        <g id="Icon">
          <path d="M1.5 3.5L4 6L1.5 8.5V3.5Z" id="Vector" stroke="var(--stroke-0, #00D3F2)" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M10.5 3.5L8 6L10.5 8.5V3.5Z" id="Vector_2" stroke="var(--stroke-0, #00D3F2)" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M6 10V11" id="Vector_3" stroke="var(--stroke-0, #00D3F2)" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M6 7V8" id="Vector_4" stroke="var(--stroke-0, #00D3F2)" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M6 4V5" id="Vector_5" stroke="var(--stroke-0, #00D3F2)" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M6 1V2" id="Vector_6" stroke="var(--stroke-0, #00D3F2)" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      </svg>
    </div>
  );
}

function Button10() {
  return (
    <div className="absolute bg-[rgba(0,184,219,0.2)] h-[29.587px] left-[110.86px] rounded-[10px] top-[5.2px] w-[74.838px]" data-name="Button">
      <div aria-hidden="true" className="absolute border-[0.8px] border-[rgba(0,184,219,0.5)] border-solid inset-0 pointer-events-none rounded-[10px]" />
      <Icon10 />
      <p className="absolute font-['Arimo:Regular',_sans-serif] font-normal leading-[16px] left-[28.8px] text-[#00d3f2] text-[12px] text-nowrap top-[5.8px] whitespace-pre">Mirror</p>
    </div>
  );
}

function Icon11() {
  return (
    <div className="absolute left-[12.8px] size-[12px] top-[8.79px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
        <g id="Icon">
          <path d={svgPaths.p2164a200} id="Vector" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" />
          <path d={svgPaths.p34692400} id="Vector_2" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      </svg>
    </div>
  );
}

function Button11() {
  return (
    <div className="absolute bg-[rgba(255,255,255,0.05)] h-[29.587px] left-[197.7px] rounded-[10px] top-[5.2px] w-[99.838px]" data-name="Button">
      <div aria-hidden="true" className="absolute border-[0.8px] border-[rgba(255,255,255,0.1)] border-solid inset-0 pointer-events-none rounded-[10px]" />
      <Icon11 />
      <p className="absolute font-['Arimo:Regular',_sans-serif] font-normal leading-[16px] left-[28.8px] text-[#99a1af] text-[12px] text-nowrap top-[5.8px] whitespace-pre">Recalibrate</p>
    </div>
  );
}

function Icon12() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p27ba7fa0} id="Vector" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p28db2b80} id="Vector_2" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Button12() {
  return (
    <div className="absolute bg-[rgba(255,255,255,0.05)] box-border content-stretch flex items-center justify-center left-[309.54px] p-[0.8px] rounded-[2.68435e+07px] size-[40px] top-0" data-name="Button">
      <div aria-hidden="true" className="absolute border-[0.8px] border-[rgba(255,255,255,0.1)] border-solid inset-0 pointer-events-none rounded-[2.68435e+07px]" />
      <Icon12 />
    </div>
  );
}

function Container26() {
  return (
    <div className="h-[40px] relative shrink-0 w-[349.538px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[40px] relative w-[349.538px]">
        <Button9 />
        <Button10 />
        <Button11 />
        <Button12 />
      </div>
    </div>
  );
}

function Badge() {
  return (
    <div className="bg-[rgba(0,201,80,0.1)] h-[21.587px] relative rounded-[8px] shrink-0 w-[53.837px]" data-name="Badge">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex gap-[4px] h-[21.587px] items-center justify-center overflow-clip px-[8.8px] py-[2.8px] relative rounded-[inherit] w-[53.837px]">
        <p className="font-['Arimo:Regular',_sans-serif] font-normal leading-[16px] relative shrink-0 text-[#05df72] text-[12px] text-nowrap whitespace-pre">60 FPS</p>
      </div>
      <div aria-hidden="true" className="absolute border-[0.8px] border-[rgba(0,201,80,0.3)] border-solid inset-0 pointer-events-none rounded-[8px]" />
    </div>
  );
}

function Badge1() {
  return (
    <div className="bg-[rgba(0,201,80,0.1)] h-[21.587px] relative rounded-[8px] shrink-0 w-[99.588px]" data-name="Badge">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex gap-[4px] h-[21.587px] items-center justify-center overflow-clip px-[8.8px] py-[2.8px] relative rounded-[inherit] w-[99.588px]">
        <p className="font-['Arimo:Regular',_sans-serif] font-normal leading-[16px] relative shrink-0 text-[#05df72] text-[12px] text-nowrap whitespace-pre">Connection OK</p>
      </div>
      <div aria-hidden="true" className="absolute border-[0.8px] border-[rgba(0,201,80,0.3)] border-solid inset-0 pointer-events-none rounded-[8px]" />
    </div>
  );
}

function Container27() {
  return (
    <div className="h-[21.587px] relative shrink-0 w-[165.425px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex gap-[12px] h-[21.587px] items-center relative w-[165.425px]">
        <Badge />
        <Badge1 />
      </div>
    </div>
  );
}

function Container28() {
  return (
    <div className="h-[48px] relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-row items-center size-full">
        <div className="box-border content-stretch flex h-[48px] items-center justify-between pl-0 pr-[0.013px] py-0 relative w-full">
          <Container25 />
          <Container26 />
          <Container27 />
        </div>
      </div>
    </div>
  );
}

function PracticeControlBar() {
  return (
    <div className="absolute bg-gradient-to-b box-border content-stretch flex flex-col from-[#0f1219] h-[80.8px] items-start left-0 pb-0 pt-[16.8px] px-[24px] to-[#0f1219] top-[674.4px] via-50% via-[#13161f] w-[1159.2px]" data-name="PracticeControlBar">
      <div aria-hidden="true" className="absolute border-[0.8px_0px_0px] border-[rgba(255,255,255,0.1)] border-solid inset-0 pointer-events-none" />
      <Container28 />
    </div>
  );
}

function Container29() {
  return (
    <div className="content-stretch flex h-[15.988px] items-start relative shrink-0 w-full" data-name="Container">
      <p className="font-['Arimo:Regular',_sans-serif] font-normal leading-[16px] relative shrink-0 text-[#99a1af] text-[12px] text-nowrap tracking-[0.3px] uppercase whitespace-pre">Intro</p>
    </div>
  );
}

function Container30() {
  return (
    <div className="absolute box-border content-stretch flex flex-col h-[79.2px] items-start left-0 pb-0 pl-[12px] pr-[338.325px] pt-[12px] top-0 w-[386.4px]" data-name="Container">
      <div aria-hidden="true" className="absolute border-[0px_0.8px_0px_0px] border-[rgba(255,255,255,0.05)] border-solid inset-0 pointer-events-none" />
      <Container29 />
    </div>
  );
}

function Container31() {
  return (
    <div className="content-stretch flex h-[15.988px] items-start relative shrink-0 w-full" data-name="Container">
      <p className="font-['Arimo:Regular',_sans-serif] font-normal leading-[16px] relative shrink-0 text-[#99a1af] text-[12px] text-nowrap tracking-[0.3px] uppercase whitespace-pre">Verse 1</p>
    </div>
  );
}

function Container32() {
  return (
    <div className="absolute box-border content-stretch flex flex-col h-[79.2px] items-start left-[386.4px] pb-0 pl-[12px] pr-[329.387px] pt-[12px] top-0 w-[386.4px]" data-name="Container">
      <div aria-hidden="true" className="absolute border-[0px_0.8px_0px_0px] border-[rgba(255,255,255,0.05)] border-solid inset-0 pointer-events-none" />
      <Container31 />
    </div>
  );
}

function Container33() {
  return (
    <div className="content-stretch flex h-[15.988px] items-start relative shrink-0 w-full" data-name="Container">
      <p className="font-['Arimo:Regular',_sans-serif] font-normal leading-[16px] relative shrink-0 text-[#99a1af] text-[12px] text-nowrap tracking-[0.3px] uppercase whitespace-pre">Chorus</p>
    </div>
  );
}

function Container34() {
  return (
    <div className="absolute box-border content-stretch flex flex-col h-[79.2px] items-start left-[772.8px] pb-0 pl-[12px] pr-[325.8px] pt-[12px] top-0 w-[386.4px]" data-name="Container">
      <div aria-hidden="true" className="absolute border-[0px_0.8px_0px_0px] border-[rgba(255,255,255,0.05)] border-solid inset-0 pointer-events-none" />
      <Container33 />
    </div>
  );
}

function Container35() {
  return (
    <div className="absolute h-[79.2px] left-0 top-0 w-[1159.2px]" data-name="Container">
      <Container30 />
      <Container32 />
      <Container34 />
    </div>
  );
}

function Container36() {
  return <div className="absolute bg-[rgba(255,255,255,0.4)] h-[24px] left-[11.57px] top-[43.2px] w-px" data-name="Container" />;
}

function Container37() {
  return <div className="absolute bg-[rgba(255,255,255,0.15)] h-[12px] left-[35.73px] top-[55.2px] w-px" data-name="Container" />;
}

function Container38() {
  return <div className="absolute bg-[rgba(255,255,255,0.15)] h-[12px] left-[59.88px] top-[55.2px] w-px" data-name="Container" />;
}

function Container39() {
  return <div className="absolute bg-[rgba(255,255,255,0.15)] h-[12px] left-[84.03px] top-[55.2px] w-px" data-name="Container" />;
}

function Container40() {
  return <div className="absolute bg-[rgba(255,255,255,0.4)] h-[24px] left-[108.17px] top-[43.2px] w-px" data-name="Container" />;
}

function Container41() {
  return <div className="absolute bg-[rgba(255,255,255,0.15)] h-[12px] left-[132.32px] top-[55.2px] w-px" data-name="Container" />;
}

function Container42() {
  return <div className="absolute bg-[rgba(255,255,255,0.15)] h-[12px] left-[156.47px] top-[55.2px] w-px" data-name="Container" />;
}

function Container43() {
  return <div className="absolute bg-[rgba(255,255,255,0.15)] h-[12px] left-[180.63px] top-[55.2px] w-px" data-name="Container" />;
}

function Container44() {
  return <div className="absolute bg-[#fb2c36] h-[32px] left-[204.78px] shadow-[0px_0px_8px_0px_rgba(239,68,68,0.6)] top-[35.2px] w-px" data-name="Container" />;
}

function Container45() {
  return <div className="absolute bg-[#fb2c36] h-[32px] left-[228.93px] shadow-[0px_0px_8px_0px_rgba(239,68,68,0.6)] top-[35.2px] w-px" data-name="Container" />;
}

function Container46() {
  return <div className="absolute bg-[rgba(255,255,255,0.15)] h-[12px] left-[253.07px] top-[55.2px] w-px" data-name="Container" />;
}

function Container47() {
  return <div className="absolute bg-[rgba(255,255,255,0.15)] h-[12px] left-[277.23px] top-[55.2px] w-px" data-name="Container" />;
}

function Container48() {
  return <div className="absolute bg-[rgba(255,255,255,0.4)] h-[24px] left-[301.38px] top-[43.2px] w-px" data-name="Container" />;
}

function Container49() {
  return <div className="absolute bg-[rgba(255,255,255,0.15)] h-[12px] left-[325.52px] top-[55.2px] w-px" data-name="Container" />;
}

function Container50() {
  return <div className="absolute bg-[rgba(255,255,255,0.15)] h-[12px] left-[349.68px] top-[55.2px] w-px" data-name="Container" />;
}

function Container51() {
  return <div className="absolute bg-[#fb2c36] h-[32px] left-[373.82px] shadow-[0px_0px_8px_0px_rgba(239,68,68,0.6)] top-[35.2px] w-px" data-name="Container" />;
}

function Container52() {
  return <div className="absolute bg-[rgba(255,255,255,0.4)] h-[24px] left-[397.98px] top-[43.2px] w-px" data-name="Container" />;
}

function Container53() {
  return <div className="absolute bg-[rgba(255,255,255,0.15)] h-[12px] left-[422.13px] top-[55.2px] w-px" data-name="Container" />;
}

function Container54() {
  return <div className="absolute bg-[rgba(255,255,255,0.15)] h-[12px] left-[446.27px] top-[55.2px] w-px" data-name="Container" />;
}

function Container55() {
  return <div className="absolute bg-[rgba(255,255,255,0.15)] h-[12px] left-[470.43px] top-[55.2px] w-px" data-name="Container" />;
}

function Container56() {
  return <div className="absolute bg-[rgba(255,255,255,0.4)] h-[24px] left-[494.57px] top-[43.2px] w-px" data-name="Container" />;
}

function Container57() {
  return <div className="absolute bg-[rgba(255,255,255,0.15)] h-[12px] left-[518.73px] top-[55.2px] w-px" data-name="Container" />;
}

function Container58() {
  return <div className="absolute bg-[rgba(255,255,255,0.15)] h-[12px] left-[542.88px] top-[55.2px] w-px" data-name="Container" />;
}

function Container59() {
  return <div className="absolute bg-[#fb2c36] h-[32px] left-[567.02px] shadow-[0px_0px_8px_0px_rgba(239,68,68,0.6)] top-[35.2px] w-px" data-name="Container" />;
}

function Container60() {
  return <div className="absolute bg-[#fb2c36] h-[32px] left-[591.17px] shadow-[0px_0px_8px_0px_rgba(239,68,68,0.6)] top-[35.2px] w-px" data-name="Container" />;
}

function Container61() {
  return <div className="absolute bg-[rgba(255,255,255,0.15)] h-[12px] left-[615.33px] top-[55.2px] w-px" data-name="Container" />;
}

function Container62() {
  return <div className="absolute bg-[rgba(255,255,255,0.15)] h-[12px] left-[639.48px] top-[55.2px] w-px" data-name="Container" />;
}

function Container63() {
  return <div className="absolute bg-[rgba(255,255,255,0.15)] h-[12px] left-[663.63px] top-[55.2px] w-px" data-name="Container" />;
}

function Container64() {
  return <div className="absolute bg-[rgba(255,255,255,0.4)] h-[24px] left-[687.77px] top-[43.2px] w-px" data-name="Container" />;
}

function Container65() {
  return <div className="absolute bg-[rgba(255,255,255,0.15)] h-[12px] left-[711.92px] top-[55.2px] w-px" data-name="Container" />;
}

function Container66() {
  return <div className="absolute bg-[rgba(255,255,255,0.15)] h-[12px] left-[736.08px] top-[55.2px] w-px" data-name="Container" />;
}

function Container67() {
  return <div className="absolute bg-[rgba(255,255,255,0.15)] h-[12px] left-[760.23px] top-[55.2px] w-px" data-name="Container" />;
}

function Container68() {
  return <div className="absolute bg-[rgba(255,255,255,0.4)] h-[24px] left-[784.38px] top-[43.2px] w-px" data-name="Container" />;
}

function Container69() {
  return <div className="absolute bg-[rgba(255,255,255,0.15)] h-[12px] left-[808.52px] top-[55.2px] w-px" data-name="Container" />;
}

function Container70() {
  return <div className="absolute bg-[rgba(255,255,255,0.15)] h-[12px] left-[832.67px] top-[55.2px] w-px" data-name="Container" />;
}

function Container71() {
  return <div className="absolute bg-[rgba(255,255,255,0.15)] h-[12px] left-[856.83px] top-[55.2px] w-px" data-name="Container" />;
}

function Container72() {
  return <div className="absolute bg-[rgba(255,255,255,0.4)] h-[24px] left-[880.98px] top-[43.2px] w-px" data-name="Container" />;
}

function Container73() {
  return <div className="absolute bg-[rgba(255,255,255,0.15)] h-[12px] left-[905.13px] top-[55.2px] w-px" data-name="Container" />;
}

function Container74() {
  return <div className="absolute bg-[rgba(255,255,255,0.15)] h-[12px] left-[929.27px] top-[55.2px] w-px" data-name="Container" />;
}

function Container75() {
  return <div className="absolute bg-[rgba(255,255,255,0.15)] h-[12px] left-[953.42px] top-[55.2px] w-px" data-name="Container" />;
}

function Container76() {
  return <div className="absolute bg-[rgba(255,255,255,0.4)] h-[24px] left-[977.58px] top-[43.2px] w-px" data-name="Container" />;
}

function Container77() {
  return <div className="absolute bg-[rgba(255,255,255,0.15)] h-[12px] left-[1001.73px] top-[55.2px] w-px" data-name="Container" />;
}

function Container78() {
  return <div className="absolute bg-[rgba(255,255,255,0.15)] h-[12px] left-[1025.88px] top-[55.2px] w-px" data-name="Container" />;
}

function Container79() {
  return <div className="absolute bg-[rgba(255,255,255,0.15)] h-[12px] left-[1050.03px] top-[55.2px] w-px" data-name="Container" />;
}

function Container80() {
  return <div className="absolute bg-[rgba(255,255,255,0.4)] h-[24px] left-[1074.17px] top-[43.2px] w-px" data-name="Container" />;
}

function Container81() {
  return <div className="absolute bg-[rgba(255,255,255,0.15)] h-[12px] left-[1098.33px] top-[55.2px] w-px" data-name="Container" />;
}

function Container82() {
  return <div className="absolute bg-[rgba(255,255,255,0.15)] h-[12px] left-[1122.47px] top-[55.2px] w-px" data-name="Container" />;
}

function Container83() {
  return <div className="absolute bg-[rgba(255,255,255,0.15)] h-[12px] left-[1146.62px] top-[55.2px] w-px" data-name="Container" />;
}

function Container84() {
  return (
    <div className="absolute h-[79.2px] left-0 top-0 w-[1159.2px]" data-name="Container">
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
      <Container56 />
      <Container57 />
      <Container58 />
      <Container59 />
      <Container60 />
      <Container61 />
      <Container62 />
      <Container63 />
      <Container64 />
      <Container65 />
      <Container66 />
      <Container67 />
      <Container68 />
      <Container69 />
      <Container70 />
      <Container71 />
      <Container72 />
      <Container73 />
      <Container74 />
      <Container75 />
      <Container76 />
      <Container77 />
      <Container78 />
      <Container79 />
      <Container80 />
      <Container81 />
      <Container82 />
      <Container83 />
    </div>
  );
}

function Container85() {
  return <div className="bg-[#00d3f3] h-[12px] rounded-[2.68435e+07px] shadow-[0px_0px_12px_0px_#22d3ee,0px_0px_24px_0px_rgba(34,211,238,0.6)] shrink-0 w-full" data-name="Container" />;
}

function Container86() {
  return (
    <div className="absolute bg-[#00d3f3] box-border content-stretch flex flex-col h-[79.2px] items-start left-[289.8px] shadow-[0px_0px_20px_0px_rgba(34,211,238,0.8),0px_0px_40px_0px_rgba(34,211,238,0.4)] top-0 w-[3px]" data-name="Container">
      <Container85 />
    </div>
  );
}

function Container87() {
  return (
    <div className="absolute h-[15.988px] left-[16px] top-[51.21px] w-[39.563px]" data-name="Container">
      <p className="absolute font-['Arimo:Regular',_sans-serif] font-normal leading-[16px] left-0 text-[#6a7282] text-[12px] top-[-1px] w-[40px]">Beat 12</p>
    </div>
  );
}

function Container88() {
  return (
    <div className="absolute h-[15.988px] left-[1070.91px] top-[51.21px] w-[72.287px]" data-name="Container">
      <p className="absolute font-['Arimo:Regular',_sans-serif] font-normal leading-[16px] left-0 text-[#6a7282] text-[12px] top-[-1px] w-[73px]">48 beats total</p>
    </div>
  );
}

function BeatTimeline() {
  return (
    <div className="absolute bg-gradient-to-b from-[#1a1d2e] h-[80px] left-0 to-[rgba(0,0,0,0)] top-0 w-[1159.2px]" data-name="BeatTimeline">
      <div aria-hidden="true" className="absolute border-[0px_0px_0.8px] border-[rgba(255,255,255,0.05)] border-solid inset-0 pointer-events-none" />
      <Container35 />
      <Container84 />
      <Container86 />
      <Container87 />
      <Container88 />
    </div>
  );
}

export default function KPopDanceTrainerUi() {
  return (
    <div className="relative size-full" data-name="K-Pop Dance Trainer UI" style={{ backgroundImage: "linear-gradient(rgb(11, 14, 22) 0%, rgb(15, 18, 25) 50%, rgb(18, 22, 38) 100%), linear-gradient(90deg, rgb(255, 255, 255) 0%, rgb(255, 255, 255) 100%)" }}>
      <Container22 />
      <PracticeControlBar />
      <BeatTimeline />
    </div>
  );
}