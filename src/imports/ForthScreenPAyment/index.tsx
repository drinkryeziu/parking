function UserName() {
  return (
    <div className="absolute bg-white border border-black border-solid h-[56px] left-[25px] overflow-clip rounded-[8px] top-[202px] w-[354px]" data-name="UserName">
      <p className="[word-break:break-word] absolute font-['Inter:Regular',sans-serif] font-normal leading-[normal] left-[14px] not-italic text-[16px] text-black top-[20px] whitespace-nowrap">Card Numer</p>
    </div>
  );
}

function UserName1() {
  return (
    <div className="absolute bg-white border border-black border-solid h-[56px] left-[25px] overflow-clip rounded-[8px] top-[282px] w-[166px]" data-name="UserName">
      <p className="[word-break:break-word] absolute font-['Inter:Regular',sans-serif] font-normal leading-[normal] left-[14px] not-italic text-[16px] text-black top-[20px] whitespace-nowrap">Exp Date</p>
    </div>
  );
}

function UserName2() {
  return (
    <div className="absolute bg-white border border-black border-solid h-[56px] left-[calc(50%+12px)] overflow-clip rounded-[8px] top-[282px] w-[166px]" data-name="UserName">
      <p className="[word-break:break-word] absolute font-['Inter:Regular',sans-serif] font-normal leading-[normal] left-[14px] not-italic text-[16px] text-black top-[20px] whitespace-nowrap">CVS Number</p>
    </div>
  );
}

function UserName3() {
  return (
    <div className="absolute bg-white border border-black border-solid h-[56px] left-[25px] overflow-clip rounded-[8px] top-[362px] w-[354px]" data-name="UserName">
      <p className="[word-break:break-word] absolute font-['Inter:Regular',sans-serif] font-normal leading-[normal] left-[14px] not-italic text-[16px] text-black top-[20px] whitespace-nowrap">Name on the card</p>
    </div>
  );
}

function Frame() {
  return (
    <div className="absolute bg-[#007aff] content-stretch flex h-[56px] items-center justify-center left-[25px] p-[10px] rounded-[8px] top-[442px] w-[354px]">
      <p className="[word-break:break-word] font-['Inter:Bold',sans-serif] font-bold leading-[normal] not-italic relative shrink-0 text-[16px] text-white whitespace-nowrap">Pay</p>
    </div>
  );
}

export default function ForthScreenPAyment() {
  return (
    <div className="bg-white opacity-80 relative size-full" data-name="Forth Screen PAyment">
      <p className="-translate-x-1/2 [word-break:break-word] absolute font-['Advent_Pro:Medium',sans-serif] font-medium leading-[normal] left-[123px] text-[#007aff] text-[48px] text-center top-[75px] whitespace-nowrap" style={{ fontVariationSettings: '"wdth" 100' }}>
        Credit Card
      </p>
      <UserName />
      <UserName1 />
      <UserName2 />
      <UserName3 />
      <Frame />
    </div>
  );
}