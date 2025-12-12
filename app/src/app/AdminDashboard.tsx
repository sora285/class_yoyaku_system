import { useState } from "react";
import { Users, Calendar, DoorOpen, Trash2, Edit } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Switch } from "./ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { toast } from "sonner";

export default function AdminDashboard() {
    // Mock data for users
    const [users] = useState([
        { id: 1, username: "田中太郎", email: "tanaka@example.com", department: "総務部", registrationDate: "2025年10月1日", isActive: true },
        { id: 2, username: "佐藤花子", email: "sato@example.com", department: "営業部", registrationDate: "2025年10月5日", isActive: true },
        { id: 3, username: "鈴木一郎", email: "suzuki@example.com", department: "開発部", registrationDate: "2025年10月10日", isActive: false },
        { id: 4, username: "高橋美咲", email: "takahashi@example.com", department: "人事部", registrationDate: "2025年10月15日", isActive: true },
    ]);

    // Mock data for all bookings
    const [allBookings] = useState([
        { id: 1, username: "田中太郎", email: "tanaka@example.com", department: "総務部", room: "501", floor: "5F", date: "2025年10月28日", time: "09:00-10:00", purpose: "部署ミーティング" },
        { id: 2, username: "佐藤花子", email: "sato@example.com", department: "営業部", room: "502", floor: "5F", date: "2025年10月28日", time: "10:00-11:00", purpose: "クライアント打ち合わせ" },
        { id: 3, username: "鈴木一郎", email: "suzuki@example.com", department: "開発部", room: "604", floor: "6F", date: "2025年10月29日", time: "14:00-15:00", purpose: "システム開発レビュー会議" },
        { id: 4, username: "高橋美咲", email: "takahashi@example.com", department: "人事部", room: "701", floor: "7F", date: "2025年10月30日", time: "16:00-17:00", purpose: "採用面接" },
        { id: 5, username: "田中太郎", email: "tanaka@example.com", department: "総務部", room: "503", floor: "5F", date: "2025年11月1日", time: "09:00-10:00", purpose: "全体会議の準備" },
    ]);

    // Mock data for rooms
    const [rooms, setRooms] = useState([
        { id: 1, number: "501", floor: "5F", capacity: 20, equipment: "プロジェクター, ホワイトボード", isAvailable: true },
        { id: 2, number: "502", floor: "5F", capacity: 30, equipment: "プロジェクター, テレビ会議", isAvailable: true },
        { id: 3, number: "503", floor: "5F", capacity: 10, equipment: "ホワイトボード", isAvailable: false },
        { id: 4, number: "604", floor: "6F", capacity: 40, equipment: "プロジェクター, 音響設備", isAvailable: true },
        { id: 5, number: "701", floor: "7F", capacity: 15, equipment: "テレビ会議", isAvailable: true },
    ]);

    // Statistics
    const stats = {
        totalUsers: users.length,
        activeUsers: users.filter(u => u.isActive).length,
        totalBookings: allBookings.length,
        totalRooms: rooms.length,
        availableRooms: rooms.filter(r => r.isAvailable).length,
    };

    const handleDeleteBooking = (id: number) => {
        toast.success(`予約ID ${id} を削除しました`);
    };

    const handleToggleRoomAvailability = (roomId: number, currentStatus: boolean) => {
        setRooms((prevRooms) =>
            prevRooms.map((room) =>
                room.id === roomId ? { ...room, isAvailable: !currentStatus } : room
            )
        );
        const newStatus = !currentStatus ? "利用可能" : "利用不可";
        const room = rooms.find((r) => r.id === roomId);
        toast.success(`教室 ${room?.number} を${newStatus}に変更しました`);
    };

    // Edit room dialog state
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [editingRoom, setEditingRoom] = useState<{ id: number; capacity: number; equipment: string } | null>(null);

    const handleOpenEditDialog = (room: { id: number; number: string; floor: string; capacity: number; equipment: string; isAvailable: boolean }) => {
        setEditingRoom({ id: room.id, capacity: room.capacity, equipment: room.equipment });
        setIsEditDialogOpen(true);
    };

    const handleSaveRoomEdit = () => {
        if (!editingRoom) return;

        setRooms((prevRooms) =>
            prevRooms.map((room) =>
                room.id === editingRoom.id
                    ? { ...room, capacity: editingRoom.capacity, equipment: editingRoom.equipment }
                    : room
            )
        );

        const room = rooms.find((r) => r.id === editingRoom.id);
        toast.success(`教室 ${room?.number} の情報を更新しました`);
        setIsEditDialogOpen(false);
        setEditingRoom(null);
    };

    return (
        <div className="w-full min-h-screen bg-white text-[#030213]">
            {/* Edit Room Dialog */}
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent className="sm:max-w-[450px]">
                    <DialogHeader>
                        <DialogTitle className="font-['Inter:Medium','Noto_Sans_JP:Medium',sans-serif]">
                            教室情報の編集
                        </DialogTitle>
                        <DialogDescription className="font-['Inter:Regular','Noto_Sans_JP:Regular',sans-serif]">
                            教室の定員と設備を編集できます
                        </DialogDescription>
                    </DialogHeader>
                    {editingRoom && (
                        <div className="space-y-[20px] py-[16px]">
                            <div className="space-y-[8px]">
                                <Label htmlFor="capacity" className="font-['Inter:Medium','Noto_Sans_JP:Medium',sans-serif] text-[14px]">
                                    定員
                                </Label>
                                <Input
                                    id="capacity"
                                    type="number"
                                    value={editingRoom.capacity}
                                    onChange={(e) =>
                                        setEditingRoom({ ...editingRoom, capacity: parseInt(e.target.value) || 0 })
                                    }
                                    className="font-['Inter:Regular',sans-serif]"
                                    placeholder="定員を入力"
                                />
                            </div>
                            <div className="space-y-[8px]">
                                <Label htmlFor="equipment" className="font-['Inter:Medium','Noto_Sans_JP:Medium',sans-serif] text-[14px]">
                                    設備
                                </Label>
                                <Input
                                    id="equipment"
                                    value={editingRoom.equipment}
                                    onChange={(e) =>
                                        setEditingRoom({ ...editingRoom, equipment: e.target.value })
                                    }
                                    className="font-['Inter:Regular','Noto_Sans_JP:Regular',sans-serif]"
                                    placeholder="設備を入力（例: プロジェクター, ホワイトボード）"
                                />
                            </div>
                        </div>
                    )}
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setIsEditDialogOpen(false)}
                            className="font-['Inter:Medium','Noto_Sans_JP:Medium',sans-serif]"
                        >
                            キャンセル
                        </Button>
                        <Button
                            onClick={handleSaveRoomEdit}
                            className="font-['Inter:Medium','Noto_Sans_JP:Medium',sans-serif]"
                        >
                            保存
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-[16px] mb-[24px]">
                <Card className="p-[20px]">
                    <div className="flex items-center gap-[12px]">
                        <div className="w-[48px] h-[48px] rounded-full bg-blue-100 flex items-center justify-center">
                            <Users className="w-[24px] h-[24px] text-blue-600" />
                        </div>
                        <div>
                            <p className="font-['Inter:Regular','Noto_Sans_JP:Regular',sans-serif] text-[#030213] text-[14px]">
                                ユーザー数
                            </p>
                            <p className="font-['Inter:Medium',sans-serif] text-[24px] text-neutral-950">
                                {stats.totalUsers}
                                <span className="font-['Inter:Regular',sans-serif] text-[16px] text-[#030213] ml-[8px]">
                                    (アクティブ: {stats.activeUsers})
                                </span>
                            </p>
                        </div>
                    </div>
                </Card>

                <Card className="p-[20px]">
                    <div className="flex items-center gap-[12px]">
                        <div className="w-[48px] h-[48px] rounded-full bg-green-100 flex items-center justify-center">
                            <Calendar className="w-[24px] h-[24px] text-green-600" />
                        </div>
                        <div>
                            <p className="font-['Inter:Regular','Noto_Sans_JP:Regular',sans-serif] text-[#030213] text-[14px]">
                                予約数
                            </p>
                            <p className="font-['Inter:Medium',sans-serif] text-[24px] text-neutral-950">
                                {stats.totalBookings}
                            </p>
                        </div>
                    </div>
                </Card>

                <Card className="p-[20px]">
                    <div className="flex items-center gap-[12px]">
                        <div className="w-[48px] h-[48px] rounded-full bg-purple-100 flex items-center justify-center">
                            <DoorOpen className="w-[24px] h-[24px] text-purple-600" />
                        </div>
                        <div>
                            <p className="font-['Inter:Regular','Noto_Sans_JP:Regular',sans-serif] text-[#030213] text-[14px]">
                                教室数
                            </p>
                            <p className="font-['Inter:Medium',sans-serif] text-[24px] text-neutral-950">
                                {stats.totalRooms}
                                <span className="font-['Inter:Regular',sans-serif] text-[16px] text-[#717182] ml-[8px]">
                                    (利用可: {stats.availableRooms})
                                </span>
                            </p>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="users" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="users" className="font-['Inter:Medium','Noto_Sans_JP:Medium',sans-serif] text-[#030213]">
                        ユーザー管理
                    </TabsTrigger>
                    <TabsTrigger value="bookings" className="font-['Inter:Medium','Noto_Sans_JP:Medium',sans-serif], text-[#030213]">
                        予約管理
                    </TabsTrigger>
                    <TabsTrigger value="rooms" className="font-['Inter:Medium','Noto_Sans_JP:Medium',sans-serif], text-[#030213]">
                        教室管理
                    </TabsTrigger>
                </TabsList>

                {/* Users Tab */}
                <TabsContent value="users" className="mt-[16px]">
                    <div className="space-y-[12px]">
                        {users.map((user) => (
                            <Card key={user.id} className="p-[16px]">
                                <div className="flex items-center justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-[12px] mb-[8px]">
                                            <p className="font-['Inter:Medium',sans-serif] text-[16px] text-neutral-950">
                                                {user.username}
                                            </p>
                                            <Badge variant={user.isActive ? "default" : "secondary"}>
                                                {user.isActive ? "アクティブ" : "非アクティブ"}
                                            </Badge>
                                        </div>
                                        <p className="font-['Inter:Regular',sans-serif] text-[14px] text-[#6a7282] mb-[4px]">
                                            {user.email}
                                        </p>
                                        <div className="flex gap-[16px] text-[13px] text-[#717182]">
                      <span className="font-['Inter:Regular','Noto_Sans_JP:Regular',sans-serif]">
                        所属: {user.department}
                      </span>
                                            <span className="font-['Inter:Regular','Noto_Sans_JP:Regular',sans-serif]">
                        登録日: {user.registrationDate}
                      </span>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                </TabsContent>

                {/* Bookings Tab */}
                <TabsContent value="bookings" className="mt-[16px]">
                    <div className="space-y-[12px]">
                        {allBookings.map((booking) => (
                            <Card key={booking.id} className="p-[16px]">
                                <div className="flex items-center justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-[12px] mb-[8px]">
                                            <p className="font-['Inter:Medium',sans-serif] text-[16px] text-neutral-950">
                                                教室 {booking.room}
                                            </p>
                                            <Badge variant="outline">{booking.floor}</Badge>
                                        </div>
                                        <p className="font-['Inter:Regular','Noto_Sans_JP:Regular',sans-serif] text-[14px] text-[#6a7282] mb-[4px]">
                                            予約者: {booking.username}
                                        </p>
                                        <div className="flex gap-[16px] text-[13px] text-[#717182] mb-[4px]">
                      <span className="font-['Inter:Regular','Noto_Sans_JP:Regular',sans-serif]">
                        {booking.date}
                      </span>
                                            <span className="font-['Inter:Medium',sans-serif]">
                        {booking.time}
                      </span>
                                        </div>
                                        <div className="flex gap-[16px] text-[12px] text-[#8a92a2]">
                      <span className="font-['Inter:Regular',sans-serif]">
                        {booking.email}
                      </span>
                                            <span className="font-['Inter:Regular','Noto_Sans_JP:Regular',sans-serif]">
                        {booking.department}
                      </span>
                                        </div>
                                        {booking.purpose && (
                                            <div className="mt-[8px] pt-[8px] border-t border-gray-100">
                                                <p className="font-['Inter:Regular','Noto_Sans_JP:Regular',sans-serif] text-[12px] text-[#717182]">
                                                    使用目的: <span className="text-neutral-950">{booking.purpose}</span>
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex gap-[8px]">
                                        <Button
                                            size="sm"
                                            variant="destructive"
                                            onClick={() => handleDeleteBooking(booking.id)}
                                            className="gap-[6px]"
                                        >
                                            <Trash2 className="w-[14px] h-[14px]" />
                                            <span className="font-['Inter:Medium','Noto_Sans_JP:Medium',sans-serif]">削除</span>
                                        </Button>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                </TabsContent>

                {/* Rooms Tab */}
                <TabsContent value="rooms" className="mt-[16px]">
                    <div className="space-y-[12px]">
                        {rooms.map((room) => (
                            <Card key={room.id} className="p-[16px]">
                                <div className="flex items-center justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-[12px] mb-[8px]">
                                            <p className="font-['Inter:Medium',sans-serif] text-[16px] text-neutral-950">
                                                教室 {room.number}
                                            </p>
                                            <Badge variant="outline">{room.floor}</Badge>
                                            <Badge variant={room.isAvailable ? "default" : "secondary"}>
                                                {room.isAvailable ? "利用可" : "利用不可"}
                                            </Badge>
                                        </div>
                                        <div className="flex gap-[16px] text-[13px] text-[#717182] mb-[4px]">
                      <span className="font-['Inter:Regular','Noto_Sans_JP:Regular',sans-serif]">
                        定員: {room.capacity}名
                      </span>
                                        </div>
                                        <p className="font-['Inter:Regular','Noto_Sans_JP:Regular',sans-serif] text-[13px] text-[#6a7282]">
                                            設備: {room.equipment}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-[12px]">
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => handleOpenEditDialog(room)}
                                            className="gap-[6px]"
                                        >
                                            <Edit className="w-[14px] h-[14px]" />
                                            <span className="font-['Inter:Medium','Noto_Sans_JP:Medium',sans-serif]">編集</span>
                                        </Button>
                                        <div className="flex items-center gap-[8px]">
                      <span className="font-['Inter:Regular','Noto_Sans_JP:Regular',sans-serif] text-[14px] text-[#717182]">
                        {room.isAvailable ? "利用可能" : "利用不可"}
                      </span>
                                            <Switch
                                                checked={room.isAvailable}
                                                onCheckedChange={() => handleToggleRoomAvailability(room.id, room.isAvailable)}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}
