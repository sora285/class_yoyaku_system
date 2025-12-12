import { useState, useMemo } from "react";
import { toast } from "sonner";
import { Toaster } from "./ui/sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "./ui/dialog";
import { User, Mail, Briefcase, Calendar as CalendarIcon, FileText } from "lucide-react";
import { Button } from "./ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Textarea } from "./ui/textarea";

interface RoomAvailabilityProps {
    floor: string;
    date: Date;
}

interface TimeSlot {
    time: string;
    available: boolean;
}

interface Room {
    number: string;
    capacity: number;
    slots: TimeSlot[];
}

interface BookingInfo {
    username: string;
    email: string;
    department: string;
    room: string;
    time: string;
    date: string;
    purpose?: string;
}

const getRoomsForFloor = (floor: string): Room[] => {
    const floorNumber = floor.replace("F", "");
    const baseRoomNumber = parseInt(floorNumber) * 100;

    return [
        {
            number: `${baseRoomNumber + 1}`,
            capacity: 10,
            slots: [
                { time: "09:00-10:00", available: false },
                { time: "10:00-11:00", available: false },
                { time: "11:00-12:00", available: true },
                { time: "13:00-14:00", available: false },
                { time: "14:00-15:00", available: true },
                { time: "15:00-16:00", available: true },
                { time: "16:00-17:00", available: true },
                { time: "17:00-18:00", available: true },
            ],
        },
        {
            number: `${baseRoomNumber + 2}`,
            capacity: 20,
            slots: [
                { time: "09:00-10:00", available: false },
                { time: "10:00-11:00", available: true },
                { time: "11:00-12:00", available: true },
                { time: "13:00-14:00", available: true },
                { time: "14:00-15:00", available: false },
                { time: "15:00-16:00", available: false },
                { time: "16:00-17:00", available: true },
                { time: "17:00-18:00", available: true },
            ],
        },
        {
            number: `${baseRoomNumber + 4}`,
            capacity: 30,
            slots: [
                { time: "09:00-10:00", available: true },
                { time: "10:00-11:00", available: false },
                { time: "11:00-12:00", available: false },
                { time: "13:00-14:00", available: true },
                { time: "14:00-15:00", available: true },
                { time: "15:00-16:00", available: true },
                { time: "16:00-17:00", available: false },
                { time: "17:00-18:00", available: true },
            ],
        },
        {
            number: `${baseRoomNumber + 6}`,
            capacity: 50,
            slots: [
                { time: "09:00-10:00", available: false },
                { time: "10:00-11:00", available: true },
                { time: "11:00-12:00", available: true },
                { time: "13:00-14:00", available: false },
                { time: "14:00-15:00", available: false },
                { time: "15:00-16:00", available: true },
                { time: "16:00-17:00", available: true },
                { time: "17:00-18:00", available: false },
            ],
        },
        {
            number: `${baseRoomNumber + 9}`,
            capacity: 50,
            slots: [
                { time: "09:00-10:00", available: true },
                { time: "10:00-11:00", available: true },
                { time: "11:00-12:00", available: false },
                { time: "13:00-14:00", available: false },
                { time: "14:00-15:00", available: true },
                { time: "15:00-16:00", available: true },
                { time: "16:00-17:00", available: true },
                { time: "17:00-18:00", available: true },
            ],
        },
    ];
};

export default function RoomAvailability({ floor, date }: RoomAvailabilityProps) {
    const rooms = getRoomsForFloor(floor);
    const [bookings, setBookings] = useState<Record<string, boolean>>({});
    const [selectedBooking, setSelectedBooking] = useState<BookingInfo | null>(null);
    const [isBookingDialogOpen, setIsBookingDialogOpen] = useState(false);

    // New booking dialog states
    const [isNewBookingDialogOpen, setIsNewBookingDialogOpen] = useState(false);
    const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
    const [bookingStep, setBookingStep] = useState<'select' | 'confirm'>('select');
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
    const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>("");
    const [selectedPurpose, setSelectedPurpose] = useState<string>("");

    const formatDate = (date: Date) => {
        return `${date.getMonth() + 1}月${date.getDate()}日`;
    };

    // Mock booking data - who has booked which time slots
    const getBookingInfo = (roomNumber: string, time: string): BookingInfo => {
        const bookingUsers = [
            { username: "田中太郎", email: "tanaka@example.com", department: "総務部" },
            { username: "佐藤花子", email: "sato@example.com", department: "営業部" },
            { username: "鈴木一郎", email: "suzuki@example.com", department: "開発部" },
            { username: "高橋美咲", email: "takahashi@example.com", department: "人事部" },
        ];

        // Use room number and time to consistently select a user
        const index = (parseInt(roomNumber) + parseInt(time.split(':')[0])) % bookingUsers.length;
        const user = bookingUsers[index];

        return {
            ...user,
            room: roomNumber,
            time: time,
            date: formatDate(date),
        };
    };

    const handleSlotClick = (roomNumber: string, slot: TimeSlot) => {
        const key = `${roomNumber}-${slot.time}`;
        const isBooked = bookings[key];

        if (slot.available) {
            // 予約可能な時間帯の場合
            if (isBooked) {
                setBookings((prev) => {
                    const newBookings = { ...prev };
                    delete newBookings[key];
                    return newBookings;
                });
                toast.success(`教室${roomNumber}の${slot.time}の予約をキャンセルしました`);
            } else {
                setBookings((prev) => ({
                    ...prev,
                    [key]: true,
                }));
                toast.success(`教室${roomNumber}を${slot.time}に予約しました`);
            }
        } else {
            // 予約済みの時間帯の場合 - Show booking info dialog
            const bookingInfo = getBookingInfo(roomNumber, slot.time);
            setSelectedBooking(bookingInfo);
            setIsBookingDialogOpen(true);
        }
    };

    const handleRoomClick = (room: Room) => {
        setSelectedRoom(room);
        setBookingStep('select');
        setSelectedDate(dateOptions[0]);
        setSelectedTimeSlot("");
        setSelectedPurpose("");
        setIsNewBookingDialogOpen(true);
    };

    // Generate list of dates (today + next 30 days)
    const dateOptions = useMemo(() => {
        const dates: Date[] = [];
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Reset time to midnight
        for (let i = 0; i < 31; i++) {
            const date = new Date(today);
            date.setDate(today.getDate() + i);
            dates.push(date);
        }
        return dates;
    }, []);

    const formatDateForSelect = (date: Date) => {
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const day = date.getDate();
        const dayOfWeek = ['日', '月', '火', '水', '木', '金', '土'][date.getDay()];
        return `${year}年${month}月${day}日 (${dayOfWeek})`;
    };

    const handleConfirmBooking = () => {
        if (!selectedRoom || !selectedDate || !selectedTimeSlot) return;

        const key = `${selectedRoom.number}-${selectedTimeSlot}`;
        setBookings((prev) => ({
            ...prev,
            [key]: true,
        }));

        const purposeText = selectedPurpose ? `\n使用目的: ${selectedPurpose}` : "";
        toast.success(`教室${selectedRoom.number}を${formatDate(selectedDate)} ${selectedTimeSlot}に予約しました${purposeText}`);
        setIsNewBookingDialogOpen(false);
        setSelectedRoom(null);
        setSelectedTimeSlot("");
        setSelectedPurpose("");
    };

    const availableTimeSlots = [
        "09:00-10:00",
        "10:00-11:00",
        "11:00-12:00",
        "13:00-14:00",
        "14:00-15:00",
        "15:00-16:00",
        "16:00-17:00",
        "17:00-18:00",
    ];

    return (
        <>
            <Toaster />

            {/* New Booking Dialog */}
            <Dialog open={isNewBookingDialogOpen} onOpenChange={setIsNewBookingDialogOpen}>
                <DialogContent className="sm:max-w-[500px], bg-white">
                    <DialogHeader>
                        <DialogTitle className="font-['Inter:Medium','Noto_Sans_JP:Medium',sans-serif]">
                            {bookingStep === 'select' ? '予約詳細の入力' : '予約内容の確認'}
                        </DialogTitle>
                        <DialogDescription className="font-['Inter:Regular','Noto_Sans_JP:Regular',sans-serif]">
                            {bookingStep === 'select' ? '教室の予約日時を選択してください' : '以下の内容で予約を確定します'}
                        </DialogDescription>
                    </DialogHeader>

                    {bookingStep === 'select' && selectedRoom && (
                        <div className="space-y-[24px] py-[16px]">
                            <div>
                                <p className="font-['Inter:Medium','Noto_Sans_JP:Medium',sans-serif] text-[14px] mb-[8px] text-neutral-950">
                                    教室情報
                                </p>
                                <div className="bg-gray-50 p-[12px] rounded-[8px]">
                                    <p className="font-['Inter:Medium',sans-serif] text-[16px] text-neutral-950">
                                        教室 {selectedRoom.number}
                                    </p>
                                    <p className="font-['Inter:Regular','Noto_Sans_JP:Regular',sans-serif] text-[14px] text-[#6a7282]">
                                        定員: {selectedRoom.capacity}名
                                    </p>
                                </div>
                            </div>

                            <div>
                                <p className="font-['Inter:Medium','Noto_Sans_JP:Medium',sans-serif] text-[14px] mb-[8px] text-neutral-950">
                                    日付を選択
                                </p>
                                <Select
                                    value={selectedDate?.toISOString()}
                                    onValueChange={(value) => setSelectedDate(new Date(value))}
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="日付を選択してください" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {dateOptions.map((date) => (
                                            <SelectItem key={date.toISOString()} value={date.toISOString()}>
                                                {formatDateForSelect(date)}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div>
                                <p className="font-['Inter:Medium','Noto_Sans_JP:Medium',sans-serif] text-[14px] mb-[8px] text-neutral-950">
                                    時間帯を選択
                                </p>
                                <Select value={selectedTimeSlot} onValueChange={setSelectedTimeSlot}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="時間帯を選択してください" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {availableTimeSlots.map((slot) => (
                                            <SelectItem key={slot} value={slot}>
                                                {slot}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div>
                                <p className="font-['Inter:Medium','Noto_Sans_JP:Medium',sans-serif] text-[14px] mb-[8px] text-neutral-950">
                                    使用目的 <span className="text-red-500">*</span>
                                </p>
                                <Textarea
                                    placeholder="使用目的を入力してください"
                                    value={selectedPurpose}
                                    onChange={(e) => setSelectedPurpose(e.target.value)}
                                    className="w-full min-h-[80px] resize-none"
                                />
                            </div>
                        </div>
                    )}

                    {bookingStep === 'confirm' && selectedRoom && selectedDate && selectedTimeSlot && (
                        <div className="space-y-[20px] py-[16px]">
                            <div className="bg-blue-50 p-[16px] rounded-[8px] space-y-[12px]">
                                <div className="flex items-center gap-[12px]">
                                    <div className="w-[40px] h-[40px] rounded-full bg-blue-100 flex items-center justify-center">
                                        <CalendarIcon className="w-[20px] h-[20px] text-blue-600" />
                                    </div>
                                    <div>
                                        <p className="font-['Inter:Regular','Noto_Sans_JP:Regular',sans-serif] text-[12px] text-[#717182]">
                                            教室
                                        </p>
                                        <p className="font-['Inter:Medium',sans-serif] text-[16px] text-neutral-950">
                                            {selectedRoom.number}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-[12px]">
                                    <div className="w-[40px] h-[40px] rounded-full bg-blue-100 flex items-center justify-center">
                                        <CalendarIcon className="w-[20px] h-[20px] text-blue-600" />
                                    </div>
                                    <div>
                                        <p className="font-['Inter:Regular','Noto_Sans_JP:Regular',sans-serif] text-[12px] text-[#717182]">
                                            日付
                                        </p>
                                        <p className="font-['Inter:Medium','Noto_Sans_JP:Medium',sans-serif] text-[16px] text-neutral-950">
                                            {formatDate(selectedDate)}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-[12px]">
                                    <div className="w-[40px] h-[40px] rounded-full bg-blue-100 flex items-center justify-center">
                                        <CalendarIcon className="w-[20px] h-[20px] text-blue-600" />
                                    </div>
                                    <div>
                                        <p className="font-['Inter:Regular','Noto_Sans_JP:Regular',sans-serif] text-[12px] text-[#717182]">
                                            時間帯
                                        </p>
                                        <p className="font-['Inter:Medium',sans-serif] text-[16px] text-neutral-950">
                                            {selectedTimeSlot}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-[12px]">
                                    <div className="w-[40px] h-[40px] rounded-full bg-blue-100 flex items-center justify-center">
                                        <User className="w-[20px] h-[20px] text-blue-600" />
                                    </div>
                                    <div>
                                        <p className="font-['Inter:Regular','Noto_Sans_JP:Regular',sans-serif] text-[12px] text-[#717182]">
                                            定員
                                        </p>
                                        <p className="font-['Inter:Regular','Noto_Sans_JP:Regular',sans-serif] text-[16px] text-neutral-950">
                                            {selectedRoom.capacity}名
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-[12px]">
                                    <div className="w-[40px] h-[40px] rounded-full bg-blue-100 flex items-center justify-center">
                                        <FileText className="w-[20px] h-[20px] text-blue-600" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-['Inter:Regular','Noto_Sans_JP:Regular',sans-serif] text-[12px] text-[#717182]">
                                            使用目的
                                        </p>
                                        <p className="font-['Inter:Regular','Noto_Sans_JP:Regular',sans-serif] text-[16px] text-neutral-950 whitespace-pre-wrap">
                                            {selectedPurpose}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <p className="font-['Inter:Regular','Noto_Sans_JP:Regular',sans-serif] text-[14px] text-[#6a7282] text-center">
                                上記の内容で予約を確定しますか？
                            </p>
                        </div>
                    )}

                    <DialogFooter>
                        {bookingStep === 'select' && (
                            <>
                                <Button
                                    variant="outline"
                                    onClick={() => setIsNewBookingDialogOpen(false)}
                                    className="font-['Inter:Medium','Noto_Sans_JP:Medium',sans-serif]"
                                >
                                    キャンセル
                                </Button>
                                <Button
                                    onClick={() => setBookingStep('confirm')}
                                    disabled={!selectedDate || !selectedTimeSlot || !selectedPurpose.trim()}
                                    className="font-['Inter:Medium','Noto_Sans_JP:Medium',sans-serif]"
                                >
                                    次へ
                                </Button>
                            </>
                        )}
                        {bookingStep === 'confirm' && (
                            <>
                                <Button
                                    variant="outline"
                                    onClick={() => setBookingStep('select')}
                                    className="font-['Inter:Medium','Noto_Sans_JP:Medium',sans-serif]"
                                >
                                    戻る
                                </Button>
                                <Button
                                    onClick={handleConfirmBooking}
                                    className="font-['Inter:Medium','Noto_Sans_JP:Medium',sans-serif]"
                                >
                                    予約を確定
                                </Button>
                            </>
                        )}
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Booking Info Dialog */}
            <Dialog open={isBookingDialogOpen} onOpenChange={setIsBookingDialogOpen}>
                <DialogContent className="sm:max-w-[450px]">
                    <DialogHeader>
                        <DialogTitle className="font-['Inter:Medium','Noto_Sans_JP:Medium',sans-serif]">
                            予約詳細
                        </DialogTitle>
                        <DialogDescription className="font-['Inter:Regular','Noto_Sans_JP:Regular',sans-serif]">
                            予約者の情報を表示しています
                        </DialogDescription>
                    </DialogHeader>
                    {selectedBooking && (
                        <div className="mt-[24px] space-y-[20px]">
                            <div className="flex justify-center mb-[24px]">
                                <div className="w-[80px] h-[80px] rounded-full bg-blue-100 flex items-center justify-center">
                                    <User className="w-[40px] h-[40px] text-blue-600" />
                                </div>
                            </div>

                            <div className="space-y-[16px]">
                                <div className="flex items-center gap-[12px]">
                                    <div className="w-[40px] h-[40px] rounded-full bg-gray-100 flex items-center justify-center">
                                        <User className="w-[20px] h-[20px] text-gray-600" />
                                    </div>
                                    <div>
                                        <p className="font-['Inter:Regular','Noto_Sans_JP:Regular',sans-serif] text-[12px] text-[#717182]">
                                            予約者
                                        </p>
                                        <p className="font-['Inter:Medium',sans-serif] text-[16px] text-neutral-950">
                                            {selectedBooking.username}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-[12px]">
                                    <div className="w-[40px] h-[40px] rounded-full bg-gray-100 flex items-center justify-center">
                                        <Mail className="w-[20px] h-[20px] text-gray-600" />
                                    </div>
                                    <div>
                                        <p className="font-['Inter:Regular','Noto_Sans_JP:Regular',sans-serif] text-[12px] text-[#717182]">
                                            メールアドレス
                                        </p>
                                        <p className="font-['Inter:Regular',sans-serif] text-[16px] text-neutral-950">
                                            {selectedBooking.email}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-[12px]">
                                    <div className="w-[40px] h-[40px] rounded-full bg-gray-100 flex items-center justify-center">
                                        <Briefcase className="w-[20px] h-[20px] text-gray-600" />
                                    </div>
                                    <div>
                                        <p className="font-['Inter:Regular','Noto_Sans_JP:Regular',sans-serif] text-[12px] text-[#717182]">
                                            所属
                                        </p>
                                        <p className="font-['Inter:Regular','Noto_Sans_JP:Regular',sans-serif] text-[16px] text-neutral-950">
                                            {selectedBooking.department}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-[12px]">
                                    <div className="w-[40px] h-[40px] rounded-full bg-gray-100 flex items-center justify-center">
                                        <CalendarIcon className="w-[20px] h-[20px] text-gray-600" />
                                    </div>
                                    <div>
                                        <p className="font-['Inter:Regular','Noto_Sans_JP:Regular',sans-serif] text-[12px] text-[#717182]">
                                            予約情報
                                        </p>
                                        <p className="font-['Inter:Regular','Noto_Sans_JP:Regular',sans-serif] text-[16px] text-neutral-950">
                                            教室 {selectedBooking.room} / {selectedBooking.date} / {selectedBooking.time}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            <div className="bg-white h-auto relative rounded-[14px] w-full pb-[25px]">
                <div
                    aria-hidden="true"
                    className="absolute border border-[rgba(0,0,0,0.1)] border-solid inset-0 pointer-events-none rounded-[14px]"
                />
                {/* Header */}
                <div className="box-border gap-[6px] grid grid-cols-[repeat(1,_minmax(0px,_1fr))] grid-rows-[16px_minmax(0px,_1fr)] h-[70px] pb-0 pt-[24px] px-[24px] w-full max-w-[672px]">
                    <div className="[grid-area:1_/_1] relative shrink-0">
                        <p className="absolute font-['Inter:Medium','Noto_Sans_JP:Medium',sans-serif] leading-[16px] left-0 not-italic text-[16px] text-neutral-950 text-nowrap top-[-0.5px] tracking-[-0.3125px] whitespace-pre">
                            教室別予約状況
                        </p>
                    </div>
                    <div className="[grid-area:2_/_1] relative shrink-0">
                        <p className="absolute font-['Inter:Regular','Noto_Sans_JP:Regular',sans-serif] leading-[24px] left-0 not-italic text-[#717182] text-[16px] top-[-0.5px] tracking-[-0.3125px]">
                            {formatDate(date)} の予約状況
                        </p>
                    </div>
                </div>

                {/* Room List */}
                <div className="content-stretch flex flex-col gap-[16px] h-auto items-start px-[25px] mt-[25px]">
                    {rooms.map((room) => {
                        const bookedSlots = room.slots.filter(slot => !slot.available);

                        return (
                            <div
                                key={room.number}
                                className="h-auto min-h-[122px] relative rounded-[10px] w-full pb-[40px]"
                            >
                                <div
                                    aria-hidden="true"
                                    className="absolute border border-[rgba(0,0,0,0.1)] border-solid inset-0 pointer-events-none rounded-[10px]"
                                />
                                {/* Room Info */}
                                <div
                                    className="relative content-stretch flex flex-row gap-[12px] h-[24px] items-center left-[17px] top-[17px] cursor-pointer hover:opacity-70 transition-opacity"
                                    onClick={() => handleRoomClick(room)}
                                >
                                    <p className="font-['Inter:Medium',sans-serif] leading-[24px] not-italic text-[16px] text-neutral-950 text-nowrap tracking-[-0.3125px] whitespace-pre">
                                        {room.number}
                                    </p>
                                    <p className="font-['Inter:Regular','Noto_Sans_JP:Regular',sans-serif] leading-[20px] not-italic text-[#6a7282] text-[14px] tracking-[-0.1504px]">
                                        定員: {room.capacity}名
                                    </p>
                                    <span className="font-['Inter:Regular','Noto_Sans_JP:Regular',sans-serif] text-[12px] text-blue-600 ml-auto mr-[34px]">
                                        クリックして予約
                                    </span>
                                </div>

                                {/* Available Slots Section */}
                                <div className="relative left-[17px] top-[29px] w-[calc(100%-34px)]">
                                    <p className="font-['Inter:Medium','Noto_Sans_JP:Medium',sans-serif] leading-[16px] not-italic text-[14px] text-neutral-950 mb-[8px]">
                                        予約可能
                                    </p>
                                    <div className="flex flex-wrap gap-[8px] mb-[16px]">
                                        {room.slots.filter(slot => slot.available).map((slot) => {
                                            const key = `${room.number}-${slot.time}`;
                                            const isBooked = bookings[key];

                                            return (
                                                <button
                                                    key={slot.time}
                                                    onClick={() => handleSlotClick(room.number, slot)}
                                                    className={`${
                                                        isBooked
                                                            ? "bg-blue-50 hover:bg-blue-100"
                                                            : "bg-green-50 hover:bg-green-100"
                                                    } h-[22px] rounded-[8px] transition-colors cursor-pointer`}
                                                >
                                                    <div className="box-border content-stretch flex gap-[4px] h-[22px] items-center justify-center overflow-clip px-[9px] py-[3px] relative rounded-[inherit]">
                                                        <p
                                                            className={`font-['Inter:Medium',sans-serif] leading-[16px] not-italic relative shrink-0 ${
                                                                isBooked ? "text-blue-600" : "text-green-700"
                                                            } text-[12px] text-nowrap whitespace-pre`}
                                                        >
                                                            {slot.time}
                                                        </p>
                                                    </div>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Booked Slots Section */}
                                <div className="relative left-[17px] top-[29px] w-[calc(100%-34px)]">
                                    <p className="font-['Inter:Medium','Noto_Sans_JP:Medium',sans-serif] leading-[16px] not-italic text-[14px] text-neutral-950 mb-[8px]">
                                        予約済み
                                    </p>
                                    <div className="flex flex-wrap gap-[8px]">
                                        {room.slots.filter(slot => !slot.available).map((slot) => {
                                            return (
                                                <button
                                                    key={slot.time}
                                                    onClick={() => handleSlotClick(room.number, slot)}
                                                    className="bg-red-50 h-[22px] rounded-[8px] hover:bg-red-100 cursor-pointer transition-colors"
                                                >
                                                    <div className="box-border content-stretch flex gap-[4px] h-[22px] items-center justify-center overflow-clip px-[9px] py-[3px] relative rounded-[inherit]">
                                                        <p
                                                            className="font-['Inter:Medium',sans-serif] leading-[16px] not-italic relative shrink-0 text-red-600 text-[12px] text-nowrap whitespace-pre"
                                                        >
                                                            {slot.time}
                                                        </p>
                                                    </div>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Status Text */}
                                <div className="absolute right-[17px] bottom-[17px]">
                                    <p className="font-['Inter:Regular','Noto_Sans_JP:Regular',sans-serif] leading-[16px] not-italic text-[#717182] text-[12px] tracking-[-0.1504px]">
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </>
    );
}
