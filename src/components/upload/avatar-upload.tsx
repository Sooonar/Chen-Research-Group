"use client";

import { useState, useRef } from "react";
import { Camera, Loader2 } from "lucide-react";

interface AvatarUploadProps {
  currentAvatar?: string | null;
  name: string;
  onUploadSuccess: (avatarUrl: string) => void;
}

export function AvatarUpload({ currentAvatar, name, onUploadSuccess }: AvatarUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 预览
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    // 上传
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("avatar", file);

      const res = await fetch("/api/upload/avatar", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        onUploadSuccess(data.avatarUrl);
      } else {
        const data = await res.json();
        alert(data.error || "上传失败");
        setPreview(null);
      }
    } catch (error) {
      console.error("Error uploading avatar:", error);
      alert("上传失败");
      setPreview(null);
    } finally {
      setUploading(false);
    }
  };

  const avatarSrc = preview || currentAvatar;
  const initial = name ? name[0] : "?";

  return (
    <div className="relative group cursor-pointer" onClick={handleClick}>
      <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-3xl font-bold text-white overflow-hidden">
        {avatarSrc ? (
          <img
            src={avatarSrc}
            alt={name}
            className="w-full h-full object-cover"
          />
        ) : (
          initial
        )}
      </div>

      {/* 上传遮罩 */}
      <div className="absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
        {uploading ? (
          <Loader2 className="w-6 h-6 text-white animate-spin" />
        ) : (
          <Camera className="w-6 h-6 text-white" />
        )}
      </div>

      {/* 隐藏的文件输入 */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/gif,image/webp"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
}
