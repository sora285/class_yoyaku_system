interface FloorSelectorProps {
    selectedFloor: string;
    onFloorChange: (floor: string) => void;
}

export default function FloorSelector({
                                          selectedFloor,
                                          onFloorChange,
                                      }: FloorSelectorProps) {
    const floors = ["2F", "4F", "5F", "6F", "7F", "8F", "9F"];

    return (
        <div className="h-[114px] relative rounded-[14px] shrink-0 w-full">
            <div className="h-[114px] overflow-clip relative rounded-[inherit] w-full">
                <div className="absolute box-border content-stretch flex gap-[10px] items-center left-0 overflow-x-auto px-[10px] py-0 top-[51px] w-full">
                    {floors.map((floor) => (
                        <button
                            key={floor}
                            onClick={() => onFloorChange(floor)}
                            className={`h-[52px] relative rounded-[14px] shrink-0 w-[75px] cursor-pointer transition-all ${
                                selectedFloor === floor
                                    ? "bg-[#030213]"
                                    : "bg-white hover:bg-gray-50"
                            }`}
                        >
                            <div className="h-[52px] overflow-clip relative rounded-[inherit] w-[75px]">
                                <div
                                    className={`absolute flex flex-col font-['Inter:Medium',sans-serif] h-[52px] justify-center leading-[0] left-[calc(50%+0.5px)] not-italic text-[14px] text-center top-1/2 tracking-[0.0703px] translate-x-[-50%] translate-y-[-50%] w-[74px] ${
                                        selectedFloor === floor ? "text-white" : "text-black"
                                    }`}
                                >
                                    <p className="leading-[36px]">{floor}</p>
                                </div>
                            </div>
                            <div
                                aria-hidden="true"
                                className="absolute border border-[rgba(0,0,0,0.2)] border-solid inset-0 pointer-events-none rounded-[14px]"
                            />
                        </button>
                    ))}
                </div>
                <div className="absolute h-[36px] left-[18px] top-[7px] w-[270.086px]">
                    <p className="absolute font-['Inter:Medium','Noto_Sans_JP:Medium',sans-serif] leading-[36px] left-0 not-italic text-[16px] text-neutral-950 text-nowrap top-0 tracking-[0.0703px] whitespace-pre">
                        予約したい教室の階数
                    </p>
                </div>
            </div>
            <div
                aria-hidden="true"
                className="absolute border border-[rgba(0,0,0,0.1)] border-solid inset-0 pointer-events-none rounded-[14px]"
            />
        </div>
    );
}
