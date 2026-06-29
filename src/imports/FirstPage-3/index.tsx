function Frame() {
  return (
    <div className="absolute bg-[#007aff] content-stretch flex h-[56px] items-center justify-center left-[24px] p-[10px] rounded-[8px] top-[548px] w-[354px]">
      <p className="[word-break:break-word] font-['Inter:Bold',sans-serif] font-bold leading-[normal] not-italic relative shrink-0 text-[16px] text-white whitespace-nowrap">Credit / Debit</p>
    </div>
  );
}

function Frame1() {
  return (
    <div className="absolute bg-[#007aff] content-stretch flex h-[56px] items-center justify-center left-[24px] p-[10px] rounded-[8px] top-[628px] w-[354px]">
      <p className="[word-break:break-word] font-['Inter:Bold',sans-serif] font-bold leading-[normal] not-italic relative shrink-0 text-[16px] text-white whitespace-nowrap">Zello</p>
    </div>
  );
}

function Frame2() {
  return (
    <div className="absolute bg-[#007aff] content-stretch flex h-[56px] items-center justify-center left-[24px] p-[10px] rounded-[8px] top-[708px] w-[354px]">
      <p className="[word-break:break-word] font-['Inter:Bold',sans-serif] font-bold leading-[normal] not-italic relative shrink-0 text-[16px] text-white whitespace-nowrap">Venmo</p>
    </div>
  );
}

function Frame3() {
  return (
    <div className="absolute bg-[#007aff] content-stretch flex h-[56px] items-center justify-center left-[24px] p-[10px] rounded-[8px] top-[788px] w-[354px]">
      <p className="[word-break:break-word] font-['Inter:Bold',sans-serif] font-bold leading-[normal] not-italic relative shrink-0 text-[16px] text-white whitespace-nowrap">Cash App</p>
    </div>
  );
}

export default function FirstPage() {
  return (
    <div className="bg-white opacity-80 relative size-full" data-name="FirstPage">
      <Frame />
      <Frame1 />
      <Frame2 />
      <Frame3 />
      <p className="-translate-x-1/2 [word-break:break-word] absolute font-['Advent_Pro:Medium',sans-serif] font-medium leading-[normal] left-[175.5px] text-[#007aff] text-[48px] text-center top-[450px] whitespace-nowrap" style={{ fontVariationSettings: '"wdth" 100' }}>
        Payment Method
      </p>
      <p className="-translate-x-1/2 [word-break:break-word] absolute font-['Advent_Pro:Medium',sans-serif] font-medium leading-[normal] left-[calc(16.67%+133px)] text-[#007aff] text-[128px] text-center top-[256px] whitespace-nowrap" style={{ fontVariationSettings: '"wdth" 100' }}>
        $ 150
      </p>
    </div>
  );
}