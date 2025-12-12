import { useState } from "react";
import svgPaths from "./imports/svg-o2th8f2xf9";
import map2F from "./assets/2F.png";
import map4F from "./assets/4F.png";
import map5F from "./assets/5F.png";
import map6F from "./assets/6F.png";
import map7F from "./assets/7F.png";
import map8F from "./assets/8F.png";
import map9F from "./assets/9F.png";

const floorMapImages = {
    "2F": map2F,
    "4F": map4F,
    "5F": map5F,
    "6F": map6F,
    "7F": map7F,
    "8F": map8F,
    "9F": map9F,
};
import FloorSelector from "./FloorSelector";
import DateSelector from "./DateSelector";
import RoomAvailability from "./RoomAvailability";
import AdminDashboard from "./AdminDashboard";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "./ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "./ui/alert-dialog";
import { Calendar, User, Edit2, Save, X, Shield } from "lucide-react";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { toast } from "sonner";

interface HomeScreenProps {
    username: string;
    isAdmin: boolean;
    onLogout: () => void;
}

type Floor = keyof typeof floorMapImages;
export default function HomeScreen({ username, isAdmin, onLogout }: HomeScreenProps) {
    console.log("HomeScreen isAdmin =", isAdmin);
    const [selectedFloor, setSelectedFloor] = useState<Floor>("5F");
    const [selectedDate, setSelectedDate] = useState(() => {
        const today = new Date();
        today.setHours(0, 0, 0, 0); // 時刻を 00:00 にそろえる（比較が安定）
        return today;
    });

    const currentFloorImage = (floorMapImages[selectedFloor] ?? floorMapImages["5F"]).src;
    // Mock booking data
    const myBookings = [
        { room: "501", date: "2025年10月28日", time: "09:00-10:00", floor: "5F" },
        { room: "502", date: "2025年10月29日", time: "14:00-15:00", floor: "5F" },
        { room: "604", date: "2025年11月1日", time: "10:00-11:00", floor: "6F" },
    ];

    // Profile edit state
    const [isEditingProfile, setIsEditingProfile] = useState(false);
    const [profileData, setProfileData] = useState({
        username: username,
        email: `${username}@gn.iwasaki.com`,
        registrationDate: "2025年10月1日"
    });
    const [editedProfile, setEditedProfile] = useState({ ...profileData });

    const handleEditProfile = () => {
        setEditedProfile({ ...profileData });
        setIsEditingProfile(true);
    };

    const handleSaveProfile = () => {
        setProfileData({ ...editedProfile });
        setIsEditingProfile(false);
        toast.success("プロフィールを更新しました");
    };

    const handleCancelEdit = () => {
        setEditedProfile({ ...profileData });
        setIsEditingProfile(false);
    };

    return (
        <div className="bg-white content-stretch flex flex-col items-start relative size-full">
            <div className="bg-gray-50 h-full relative shrink-0 w-full overflow-auto">
                <div className="size-full">
                    <div className="box-border content-stretch flex flex-col gap-[32px] items-start pb-0 pt-[24px] px-[24px] relative w-full min-h-full">
                        {/* Header */}
                        <div className="content-stretch flex h-[68px] items-start justify-between relative shrink-0 w-full">
                            <div className="h-[68px] relative shrink-0 w-[270.086px]">
                                <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex flex-col gap-[8px] h-[68px] items-start relative w-[270.086px]">
                                    <div className="h-[36px] relative shrink-0 w-full">
                                        <p className="absolute font-['Inter:Medium','Noto_Sans_JP:Medium',sans-serif] leading-[36px] left-0 not-italic text-[24px] text-neutral-950 text-nowrap top-0 tracking-[0.0703px] whitespace-pre">
                                            教室予約システム
                                        </p>
                                    </div>
                                    <div className="h-[24px] relative shrink-0 w-full">
                                        <p className="absolute font-['Inter:Regular','Noto_Sans_JP:Regular',sans-serif] leading-[24px] left-0 not-italic text-[#4a5565] text-[16px] text-nowrap top-[-0.5px] tracking-[-0.3125px] whitespace-pre">
                                            教室を選択して予約を行ってください
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="h-[36px] relative shrink-0 flex items-center gap-[12px]">
                                <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex gap-[16px] h-[36px] items-center">
                                    <div className="h-[24px] relative shrink-0 w-[260px]">
                                        <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex gap-[8px] h-[24px] items-center relative w-full">
                                            <div className="relative shrink-0 size-[20px]">
                                                <svg
                                                    className="block size-full"
                                                    fill="none"
                                                    preserveAspectRatio="none"
                                                    viewBox="0 0 20 20"
                                                >
                                                    <g>
                                                        <path
                                                            d={svgPaths.p1beb9580}
                                                            stroke="#364153"
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth="1.66667"
                                                        />
                                                        <path
                                                            d={svgPaths.p32ab0300}
                                                            stroke="#364153"
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth="1.66667"
                                                        />
                                                    </g>
                                                </svg>
                                            </div>
                                            <div className="basis-0 grow h-[24px] min-h-px min-w-px relative shrink-0">
                                                <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[24px] relative w-full">
                                                    <p className="w-full font-['Inter:Regular',sans-serif] leading-[24px] not-italic text-[#364153] text-[16px] text-nowrap tracking-[-0.3125px] whitespace-pre">
                                                        {username}
                                                        {isAdmin && (
                                                            <span className="ml-[6px] text-[12px] bg-red-100 text-red-700 px-[6px] py-[2px] rounded-[4px]">
                                                                管理者
                                                            </span>
                                                        )}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Admin Dashboard Button - Only visible for admins */}
                                    {isAdmin && (
                                        <Dialog>
                                            <DialogTrigger asChild>
                                                <button className="bg-red-600 text-white h-[36px] px-[16px] relative rounded-[8px] hover:bg-red-700 transition-colors cursor-pointer flex items-center gap-[8px]">
                                                    <Shield className="w-[16px] h-[16px]" />
                                                    <p className="font-['Inter:Medium','Noto_Sans_JP:Medium',sans-serif] leading-[20px] not-italic text-[14px] text-nowrap tracking-[-0.1504px] whitespace-pre">
                                                        管理者画面
                                                    </p>
                                                </button>
                                            </DialogTrigger>
                                            <DialogContent className="sm:max-w-[800px] max-h-[80vh] overflow-y-auto bg-white text-black">
                                                <DialogHeader>
                                                    <DialogTitle className="font-['Inter:Medium','Noto_Sans_JP:Medium',sans-serif] flex items-center gap-[8px]">
                                                        <Shield className="w-[20px] h-[20px] text-red-600" />
                                                        管理者ダッシュボード
                                                    </DialogTitle>
                                                    <DialogDescription>
                                                        統計情報、ユーザー管理、予約管理、教室管理を行います。
                                                    </DialogDescription>
                                                </DialogHeader>
                                                <AdminDashboard />
                                            </DialogContent>
                                        </Dialog>
                                    )}

                                    {/* My Bookings Button */}
                                    <Dialog>
                                        <DialogTrigger asChild>
                                            <button className="bg-white h-[36px] px-[16px] relative rounded-[8px] hover:bg-gray-50 transition-colors cursor-pointer flex items-center gap-[8px]">
                                                <div
                                                    aria-hidden="true"
                                                    className="absolute border border-[rgba(0,0,0,0.1)] border-solid inset-0 pointer-events-none rounded-[8px]"
                                                />
                                                <Calendar className="w-[16px] h-[16px] text-neutral-950" />
                                                <p className="font-['Inter:Medium','Noto_Sans_JP:Medium',sans-serif] leading-[20px] not-italic text-[14px] text-neutral-950 text-nowrap tracking-[-0.1504px] whitespace-pre">
                                                    予約一覧
                                                </p>
                                            </button>
                                        </DialogTrigger>
                                        <DialogContent className="sm:max-w-[500px]">
                                            <DialogHeader>
                                                <DialogTitle className="font-['Inter:Medium','Noto_Sans_JP:Medium',sans-serif]">予約一覧</DialogTitle>
                                                <DialogDescription>
                                                    あなたの予約を確認・キャンセルできます。
                                                </DialogDescription>
                                            </DialogHeader>
                                            <div className="mt-[24px] space-y-[16px] max-h-[60vh] overflow-y-auto">
                                                {myBookings.length === 0 ? (
                                                    <p className="font-['Inter:Regular','Noto_Sans_JP:Regular',sans-serif] text-[#717182] text-[14px]">
                                                        予約はありません
                                                    </p>
                                                ) : (
                                                    myBookings.map((booking, index) => (
                                                        <div
                                                            key={index}
                                                            className="bg-gray-50 border border-[rgba(0,0,0,0.1)] rounded-[8px] p-[16px]"
                                                        >
                                                            <div className="flex justify-between items-start mb-[8px]">
                                                                <p className="font-['Inter:Medium',sans-serif] text-[16px] text-neutral-950">
                                                                    教室 {booking.room}
                                                                </p>
                                                                <span className="bg-blue-50 text-blue-700 px-[8px] py-[2px] rounded-[4px] text-[12px] font-['Inter:Medium',sans-serif]">
                                                                    {booking.floor}
                                                                </span>
                                                            </div>
                                                            <p className="font-['Inter:Regular','Noto_Sans_JP:Regular',sans-serif] text-[14px] text-[#6a7282] mb-[4px]">
                                                                {booking.date}
                                                            </p>
                                                            <p className="font-['Inter:Medium',sans-serif] text-[14px] text-neutral-950">
                                                                {booking.time}
                                                            </p>
                                                        </div>
                                                    ))
                                                )}
                                            </div>
                                        </DialogContent>
                                    </Dialog>

                                    {/* Profile Button */}
                                    <Dialog>
                                        <DialogTrigger asChild>
                                            <button
                                                className="bg-white h-[36px] px-[16px] relative rounded-[8px] hover:bg-gray-50 transition-colors cursor-pointer flex items-center gap-[8px]"
                                                onClick={() => setIsEditingProfile(false)}
                                            >
                                                <div
                                                    aria-hidden="true"
                                                    className="absolute border border-[rgba(0,0,0,0.1)] border-solid inset-0 pointer-events-none rounded-[8px]"
                                                />
                                                <User className="w-[16px] h-[16px] text-neutral-950" />
                                                <p className="font-['Inter:Medium','Noto_Sans_JP:Medium',sans-serif] leading-[20px] not-italic text-[14px] text-neutral-950 text-nowrap tracking-[-0.1504px] whitespace-pre">
                                                    プロフィール
                                                </p>
                                            </button>
                                        </DialogTrigger>
                                        <DialogContent className="sm:max-w-[450px]">
                                            <DialogHeader>
                                                <div className="flex items-center justify-between">
                                                    <DialogTitle className="font-['Inter:Medium','Noto_Sans_JP:Medium',sans-serif]">プロフィール</DialogTitle>
                                                    {!isEditingProfile && (
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={handleEditProfile}
                                                            className="h-[32px] px-[12px] gap-[6px]"
                                                        >
                                                            <Edit2 className="w-[14px] h-[14px]" />
                                                            <span className="font-['Inter:Medium','Noto_Sans_JP:Medium',sans-serif] text-[13px]">編集</span>
                                                        </Button>
                                                    )}
                                                </div>
                                                <DialogDescription>
                                                    ユーザー情報を確認・編集できます。
                                                </DialogDescription>
                                            </DialogHeader>
                                            <div className="mt-[24px] space-y-[24px]">
                                                <div className="flex justify-center mb-[24px]">
                                                    <div className="w-[80px] h-[80px] rounded-full bg-blue-100 flex items-center justify-center">
                                                        <User className="w-[40px] h-[40px] text-blue-600" />
                                                    </div>
                                                </div>

                                                <div className="space-y-[16px]">
                                                    {/* Username */}
                                                    <div>
                                                        <Label className="font-['Inter:Medium','Noto_Sans_JP:Medium',sans-serif] text-[12px] text-[#717182] mb-[6px]">
                                                            ユーザー名
                                                        </Label>
                                                        {isEditingProfile ? (
                                                            <Input
                                                                value={editedProfile.username}
                                                                onChange={(e) => setEditedProfile({ ...editedProfile, username: e.target.value })}
                                                                className="mt-[6px] font-['Inter:Regular',sans-serif]"
                                                            />
                                                        ) : (
                                                            <p className="font-['Inter:Regular',sans-serif] text-[16px] text-neutral-950 mt-[6px]">
                                                                {profileData.username}
                                                            </p>
                                                        )}
                                                    </div>

                                                    {/* Email */}
                                                    <div>
                                                        <Label className="font-['Inter:Medium','Noto_Sans_JP:Medium',sans-serif] text-[12px] text-[#717182] mb-[6px]">
                                                            メールアドレス
                                                        </Label>
                                                        {isEditingProfile ? (
                                                            <Input
                                                                type="email"
                                                                value={editedProfile.email}
                                                                onChange={(e) => setEditedProfile({ ...editedProfile, email: e.target.value })}
                                                                className="mt-[6px] font-['Inter:Regular',sans-serif]"
                                                            />
                                                        ) : (
                                                            <p className="font-['Inter:Regular',sans-serif] text-[16px] text-neutral-950 mt-[6px]">
                                                                {profileData.email}
                                                            </p>
                                                        )}
                                                    </div>


                                                    {/* Registration Date (read-only) */}
                                                    <div>
                                                        <Label className="font-['Inter:Medium','Noto_Sans_JP:Medium',sans-serif] text-[12px] text-[#717182] mb-[6px]">
                                                            登録日
                                                        </Label>
                                                        <p className="font-['Inter:Regular',sans-serif] text-[16px] text-neutral-950 mt-[6px]">
                                                            {profileData.registrationDate}
                                                        </p>
                                                    </div>
                                                </div>

                                                {/* Action Buttons */}
                                                {isEditingProfile && (
                                                    <div className="flex gap-[12px] pt-[12px]">
                                                        <Button
                                                            onClick={handleSaveProfile}
                                                            className="flex-1 bg-blue-600 hover:bg-blue-700 gap-[6px]"
                                                        >
                                                            <Save className="w-[16px] h-[16px]" />
                                                            <span className="font-['Inter:Medium','Noto_Sans_JP:Medium',sans-serif]">保存</span>
                                                        </Button>
                                                        <Button
                                                            variant="outline"
                                                            onClick={handleCancelEdit}
                                                            className="flex-1 gap-[6px]"
                                                        >
                                                            <X className="w-[16px] h-[16px]" />
                                                            <span className="font-['Inter:Medium','Noto_Sans_JP:Medium',sans-serif]">キャンセル</span>
                                                        </Button>
                                                    </div>
                                                )}
                                            </div>
                                        </DialogContent>
                                    </Dialog>
                                    {/* Logout Button with Confirmation */}
                                    <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                            <button className="bg-white h-[36px] px-[16px] relative rounded-[8px] hover:bg-gray-50 transition-colors cursor-pointer flex items-center gap-[8px]">
                                                <div
                                                    aria-hidden="true"
                                                    className="absolute border border-[rgba(0,0,0,0.1)] border-solid inset-0 pointer-events-none rounded-[8px]"
                                                />
                                                <div className="w-[16px] h-[16px]">
                                                    <svg
                                                        className="block size-full"
                                                        fill="none"
                                                        preserveAspectRatio="none"
                                                        viewBox="0 0 16 16"
                                                    >
                                                        <g>
                                                            <path
                                                                d={svgPaths.p2c1f680}
                                                                stroke="#0A0A0A"
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                strokeWidth="1.33333"
                                                            />
                                                            <path
                                                                d="M14 8H6"
                                                                stroke="#0A0A0A"
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                strokeWidth="1.33333"
                                                            />
                                                            <path
                                                                d={svgPaths.p12257fa0}
                                                                stroke="#0A0A0A"
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                strokeWidth="1.33333"
                                                            />
                                                        </g>
                                                    </svg>
                                                </div>
                                                <p className="font-['Inter:Medium','Noto_Sans_JP:Medium',sans-serif] leading-[20px] not-italic text-[14px] text-neutral-950 text-nowrap tracking-[-0.1504px] whitespace-pre">
                                                    ログアウト
                                                </p>
                                            </button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                                <AlertDialogTitle className="font-['Inter:Medium','Noto_Sans_JP:Medium',sans-serif]">
                                                    ログアウトしますか？
                                                </AlertDialogTitle>
                                                <AlertDialogDescription className="font-['Inter:Regular','Noto_Sans_JP:Regular',sans-serif]">
                                                    ログアウトすると、再度ログインが必要になります。
                                                </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel className="font-['Inter:Medium','Noto_Sans_JP:Medium',sans-serif]">
                                                    キャンセル
                                                </AlertDialogCancel>
                                                <AlertDialogAction
                                                    onClick={onLogout}
                                                    className="bg-red-600 hover:bg-red-700 font-['Inter:Medium','Noto_Sans_JP:Medium',sans-serif]"
                                                >
                                                    ログアウト
                                                </AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                </div>
                            </div>
                        </div>

                        {/* Floor Selector */}
                        <FloorSelector
                            selectedFloor={selectedFloor}
                            onFloorChange={(floor) => setSelectedFloor(floor as Floor)}
                        />

                        {/* Main Content */}
                        <div className="h-auto relative shrink-0 w-full pb-[24px]">
                            <div className="flex gap-[24px] flex-wrap lg:flex-nowrap">
                                {/* Left Column */}
                                <div className="flex flex-col gap-[24px] w-full lg:w-[325px] shrink-0">
                                    {/* Date Selector */}
                                    <DateSelector
                                        selectedDate={selectedDate}
                                        onDateChange={setSelectedDate}
                                    />

                                    {/* Map */}
                                    <div className="bg-white h-[327px] relative rounded-[14px] w-full">
                                        <div
                                            aria-hidden="true"
                                            className="absolute border border-[rgba(0,0,0,0.1)] border-solid inset-0 pointer-events-none rounded-[14px]"
                                        />
                                        <div className="absolute box-border gap-[6px] grid grid-cols-[repeat(1,_minmax(0px,_1fr))] grid-rows-[16px_minmax(0px,_1fr)] h-[70px] left-px pb-0 pt-[24px] px-[24px] top-px w-[323px]">
                                            <div className="[grid-area:1_/_1] relative shrink-0">
                                                <p className="absolute font-['Inter:Medium','Noto_Sans_JP:Medium',sans-serif] leading-[16px] left-0 not-italic text-[16px] text-neutral-950 text-nowrap top-[-0.5px] tracking-[-0.3125px] whitespace-pre">
                                                    地図
                                                </p>
                                            </div>
                                            <div className="[grid-area:2_/_1] relative shrink-0">
                                                <p className="absolute font-['Inter:Regular','Noto_Sans_JP:Regular',sans-serif] leading-[24px] left-0 not-italic text-[#717182] text-[16px] text-nowrap top-[-0.5px] tracking-[-0.3125px] whitespace-pre">
                                                    選択している階数が表示されます
                                                </p>
                                            </div>
                                        </div>
                                        <div className="absolute h-[237px] left-[6px] top-[78px] w-[302px]">
                                            <img
                                                alt={`${selectedFloor} floor map`}
                                                className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full"
                                                src={currentFloorImage}
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Right Column */}
                                <div className="flex-1 min-w-0">
                                    <RoomAvailability
                                        floor={selectedFloor}
                                        date={selectedDate}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
