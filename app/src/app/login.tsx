"use client";

import { useState } from "react";
import svgPaths from "./imports/svg-0n7mnszfa6";
import HomeScreen from "./HomeScreen";
import { auth, db } from "../lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from "firebase/auth";

type UserState = {
  username: string;
  isAdmin: boolean;
};

interface LoginFormProps {
  onLogin: (username: string, isAdmin: boolean) => void;
}

/**
 * ログインフォーム（Google サインイン）
 */
function LoginForm({ onLogin }: LoginFormProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);

      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const email = (user.email || "").toLowerCase();

      // gn ドメインチェック
      if (!email.endsWith("@gn.iwasaki.ac.jp")) {
        await signOut(auth);
        alert("このシステムは gn アカウントのみ利用可能です。");
        return;
      }

      const displayName = user.displayName || email;
      let username = displayName;

      // --- Firestore からユーザー情報取得 ---
      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);

      let isAdmin = false;

      if (!userSnap.exists()) {
        // 初回ログイン → 一般ユーザーとして作成
        await setDoc(userRef, {
          email,
          username,
          role: "user",
        });
      } else {
        const data = userSnap.data();
        if (typeof data.username === "string" && data.username.length > 0) {
          username = data.username;
        }
        if (data.role === "admin") {
          isAdmin = true;
        }
      }

      // 予備：特定メールは強制 admin
      if (email === "admin@gn.example.ac.jp") {
        isAdmin = true;
      }

      console.log("DEBUG LoginForm isAdmin =", isAdmin);

      onLogin(username, isAdmin);
    } catch (error: any) {
      console.error("Error during Google sign in:", error);
      alert(
          error.message ||
          "Googleサインインに失敗しました。もう一度お試しください。"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
      <div
          className="min-h-screen w-full flex items-center justify-center relative"
          style={{
            backgroundImage:
                "linear-gradient(142.798deg, rgb(239, 246, 255) 0%, rgb(224, 231, 255) 100%), linear-gradient(90deg, rgb(255, 255, 255) 0%, rgb(255, 255, 255) 100%)",
          }}
      >
        <div className="bg-white h-auto relative rounded-[14px] shrink-0 w-[448px] py-12">
          <div
              aria-hidden="true"
              className="absolute border border-[rgba(0,0,0,0.1)] border-solid inset-0 pointer-events-none rounded-[14px]"
          />
          <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex flex-col gap-[32px] h-auto items-center px-[24px] relative w-[448px]">
            {/* Header */}
            <div className="content-stretch flex flex-col items-center gap-[16px] w-full">
              <div className="bg-[#155dfc] content-stretch flex items-center justify-center rounded-[1.67772e+07px] size-[64px]">
                <div className="relative shrink-0 size-[32px]">
                  <svg
                      className="block size-full"
                      fill="none"
                      preserveAspectRatio="none"
                      viewBox="0 0 32 32"
                  >
                    <g>
                      <path
                          d={svgPaths.p1def5380}
                          stroke="white"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2.66667"
                      />
                      <path
                          d="M20 16H4"
                          stroke="white"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2.66667"
                      />
                      <path
                          d={svgPaths.p3fa14880}
                          stroke="white"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2.66667"
                      />
                    </g>
                  </svg>
                </div>
              </div>
              <div className="content-stretch flex flex-col gap-[8px] items-center w-full">
                <p className="font-['Inter:Regular','Noto_Sans_JP:Regular',sans-serif] leading-[32px] not-italic text-[24px] text-center text-neutral-950 tracking-[0.0703px]">
                  教室予約システム
                </p>
                <p className="font-['Inter:Regular','Noto_Sans_JP:Regular',sans-serif] leading-[24px] not-italic text-[#717182] text-[16px] text-center tracking-[-0.3125px]">
                  Googleアカウントでログインしてください
                </p>
              </div>
            </div>

            {/* Google Sign-In Button */}
            <div className="w-full max-w-[398px]">
              <button
                  onClick={handleGoogleSignIn}
                  disabled={isLoading}
                  className="bg-white border border-[#e5e5e8] h-[48px] relative rounded-[8px] shrink-0 w-full hover:bg-[#f9f9fb] transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
              >
                <div className="flex items-center justify-center gap-3 h-full px-4">
                  <svg width="20" height="20" viewBox="0 0 16 16" fill="none">
                    <path
                        d="M15.68 8.18182C15.68 7.61455 15.6291 7.06909 15.5345 6.54545H8V9.64364H12.3055C12.12 10.64 11.5564 11.4836 10.7091 12.0509V14.0655H13.2945C14.8073 12.6691 15.68 10.6182 15.68 8.18182Z"
                        fill="#4285F4"
                    />
                    <path
                        d="M8 16C10.16 16 11.9709 15.2873 13.2945 14.0655L10.7091 12.0509C9.99273 12.5309 9.07636 12.8218 8 12.8218C5.91636 12.8218 4.15273 11.4109 3.52364 9.52H0.850909V11.5927C2.16727 14.2036 4.87273 16 8 16Z"
                        fill="#34A853"
                    />
                    <path
                        d="M3.52364 9.52C3.36364 9.04 3.27273 8.52727 3.27273 8C3.27273 7.47273 3.36364 6.96 3.52364 6.48V4.40727H0.850909C0.309091 5.48727 0 6.70909 0 8C0 9.29091 0.309091 10.5127 0.850909 11.5927L3.52364 9.52Z"
                        fill="#FBBC05"
                    />
                    <path
                        d="M8 3.17818C9.17818 3.17818 10.2255 3.58545 11.0582 4.37818L13.3527 2.08364C11.9673 0.792727 10.1564 0 8 0C4.87273 0 2.16727 1.79636 0.850909 4.40727L3.52364 6.48C4.15273 4.58909 5.91636 3.17818 8 3.17818Z"
                        fill="#EA4335"
                    />
                  </svg>
                  <p className="font-['Inter:Medium','Noto_Sans_JP:Medium',sans-serif] leading-[20px] not-italic text-[15px] text-neutral-950 tracking-[-0.1504px]">
                    {isLoading ? "読み込み中..." : "Googleでログイン"}
                  </p>
                </div>
              </button>
            </div>

            <div className="w-full max-w-[398px]">
              <p className="font-['Inter:Regular','Noto_Sans_JP:Regular',sans-serif] text-[12px] text-center text-[#717182] tracking-[-0.1504px] leading-[18px]">
                ログインすることで、利用規約とプライバシーポリシーに同意したものとみなされます。
              </p>
            </div>
          </div>
        </div>
      </div>
  );
}

/**
 * ログイン状態を管理するページ
 */
export default function RoginPage() {
  const [user, setUser] = useState<UserState | null>(null);

  const handleLogin = (username: string, isAdmin: boolean) => {
    console.log("DEBUG handleLogin isAdmin =", isAdmin);
    setUser({username, isAdmin});
  };

  const handleLogout = async () => {
    await auth.signOut();
    setUser(null);
  };

  if (user) {
    console.log("DEBUG HomeScreen props isAdmin =", user.isAdmin);
    return (
        <HomeScreen
            username={user.username}
            isAdmin={user.isAdmin}
            onLogout={handleLogout}
        />
    );
  }

  return <LoginForm onLogin={handleLogin}/>;
}