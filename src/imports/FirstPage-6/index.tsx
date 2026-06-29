import svgPaths from "./svg-g75lehwixj";

function UserName() {
  return (
    <div className="absolute bg-white h-[56px] left-[24px] overflow-clip rounded-[8px] top-[310px] w-[354px]" data-name="UserName">
      <p className="[word-break:break-word] absolute font-['Inter:Regular',sans-serif] font-normal leading-[normal] left-[15px] not-italic text-[16px] text-black top-[21px] whitespace-nowrap">User name</p>
    </div>
  );
}

function UserName1() {
  return (
    <div className="absolute bg-white h-[56px] left-[24px] overflow-clip rounded-[8px] top-[390px] w-[354px]" data-name="UserName">
      <p className="[word-break:break-word] absolute font-['Inter:Regular',sans-serif] font-normal leading-[normal] left-[15px] not-italic text-[16px] text-black top-[21px] whitespace-nowrap">Password</p>
    </div>
  );
}

function Frame() {
  return (
    <div className="absolute bg-black content-stretch flex h-[56px] items-center justify-center left-[24px] p-[10px] rounded-[8px] top-[495px] w-[354px]">
      <p className="[word-break:break-word] font-['Inter:Bold',sans-serif] font-bold leading-[normal] not-italic relative shrink-0 text-[16px] text-white whitespace-nowrap">Log In</p>
    </div>
  );
}

function Frame2() {
  return (
    <div className="absolute content-stretch flex h-[56px] items-center justify-center left-[14px] p-[10px] top-[566px] w-[364px]">
      <p className="[word-break:break-word] font-['Inter:Bold',sans-serif] font-bold leading-[normal] not-italic relative shrink-0 text-[16px] text-center text-white whitespace-nowrap">Sign In</p>
    </div>
  );
}

function Frame1() {
  return (
    <div className="absolute content-stretch flex h-[56px] items-center justify-center left-[24px] p-[10px] rounded-[8px] top-[792px] w-[354px]">
      <div aria-hidden className="absolute border-2 border-solid border-white inset-0 pointer-events-none rounded-[8px]" />
      <p className="[word-break:break-word] font-['Inter:Bold',sans-serif] font-bold leading-[normal] not-italic relative shrink-0 text-[16px] text-white whitespace-nowrap">Continue as Guest</p>
    </div>
  );
}

export default function FirstPage() {
  return (
    <div className="bg-[#024ad8] opacity-80 relative size-full" data-name="FirstPage">
      <UserName />
      <UserName1 />
      <Frame />
      <Frame2 />
      <Frame1 />
      <p className="[word-break:break-word] absolute font-['Inter:Regular',sans-serif] font-normal leading-[normal] left-[calc(50%+48px)] not-italic text-[14px] text-white top-[449px] whitespace-nowrap">Forgot Password?</p>
      <p className="-translate-x-1/2 [word-break:break-word] absolute font-['Advent_Pro:Medium',sans-serif] font-medium leading-[normal] left-[181.5px] text-[#ccc] text-[48px] text-center top-[33px] whitespace-nowrap" style={{ fontVariationSettings: '"wdth" 100' }}>
        SWEETWATER
      </p>
      <p className="-translate-x-1/2 [word-break:break-word] absolute font-['Advent_Pro:Medium',sans-serif] font-medium leading-[normal] left-[100.5px] text-[#ebedf0] text-[48px] text-center top-[74px] whitespace-nowrap" style={{ fontVariationSettings: '"wdth" 100' }}>
        PARKING
      </p>
      <p className="-translate-x-1/2 [word-break:break-word] absolute font-['Advent_Pro:Medium',sans-serif] font-medium leading-[normal] left-[87px] text-[#999] text-[48px] text-center top-[114px] whitespace-nowrap" style={{ fontVariationSettings: '"wdth" 100' }}>
        SPOT
      </p>
      <div className="absolute h-[58px] left-[calc(33.33%+49px)] top-[200px] w-[36.25px]" data-name="Exclude">
        <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 36.25 58">
          <path d={svgPaths.p1900d280} fill="var(--fill-0, white)" fillOpacity="0.18" id="Exclude" />
        </svg>
      </div>
    </div>
  );
}