"use client";

import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";

export default function LoginPage() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";
  const error = searchParams.get("error");

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-xl p-8 space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              🏭 Inspeksi Lapangan v0
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Sistem Inspeksi Lapangan Terintegrasi
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 p-4 rounded-lg">
              <p className="font-semibold">❌ Login Error</p>
              <p className="text-sm mt-1">
                {error === "OAuthSignin"
                  ? "Terjadi kesalahan saat menghubungi Microsoft"
                  : error === "OAuthCallback"
                    ? "Terjadi kesalahan saat memproses callback"
                    : error === "OAuthCreateUser"
                      ? "Tidak dapat membuat user account"
                      : error === "EmailSignInError"
                        ? "Email sign in error"
                        : error === "SessionCallback"
                          ? "Session error"
                          : "Terjadi kesalahan login"}
              </p>
            </div>
          )}

          {/* Login Info */}
          <div className="bg-blue-50 dark:bg-blue-900 p-4 rounded-lg">
            <p className="text-sm text-gray-700 dark:text-gray-300">
              <span className="font-semibold">ℹ️ Info:</span> Silakan login menggunakan
              Microsoft Account dari Adaro untuk melanjutkan.
            </p>
          </div>

          {/* Microsoft Login Button */}
          <button
            onClick={() => signIn("azure-ad", { callbackUrl })}
            className="w-full flex items-center justify-center gap-3 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition-colors shadow-md hover:shadow-lg"
          >
            <svg
              className="w-5 h-5"
              fill="currentColor"
              viewBox="0 0 23 23"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M11.4 5.5H5.5v5.4h5.9V5.5zm6.1 0v5.4h5.9V5.5h-5.9zM5.5 11.6H0v5.9h5.5v-5.9zm5.9 0v5.9h5.4v-5.9h-5.4zm6.1 0v5.9h5.9v-5.9h-5.9z" />
            </svg>
            Login dengan Microsoft
          </button>

          {/* Footer */}
          <div className="text-center text-sm text-gray-500 dark:text-gray-400">
            <p>© 2026 Inspeksi Lapangan v0</p>
            <p>Powered by Next.js & Azure AD</p>
          </div>
        </div>
      </div>
    </div>
  );
}
