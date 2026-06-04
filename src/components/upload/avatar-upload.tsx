"use client";

import { useState, useRef, useCallback } from "react";
import Cropper from "react-easy-crop";
import { Camera, Loader2, X, Check, ZoomIn, ZoomOut } from "lucide-react";

interface AvatarUploadProps {
  currentAvatar?: string | null;
  name: string;
  onUploadSuccess: (avatarUrl: string) => void;
}

interface CroppedArea {
  x: number;
  y: number;
  width: number;
  height: number;
}

// 创建裁剪后的图片
async function createImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener("load", () => resolve(image));
    image.addEventListener("error", (error) => reject(error));
    image.setAttribute("crossOrigin", "anonymous");
    image.src = url;
  });
}

async function getCroppedImg(
  imageSrc: string,
  pixelCrop: CroppedArea
): Promise<Blob> {
  const image = await createImage(imageSrc);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    throw new Error("No 2d context");
  }

  // 设置输出尺寸为正方形
  const size = Math.max(pixelCrop.width, pixelCrop.height);
  canvas.width = size;
  canvas.height = size;

  // 绘制裁剪区域
  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    size,
    size
  );

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error("Canvas is empty"));
          return;
        }
        resolve(blob);
      },
      "image/jpeg",
      0.9
    );
  });
}

export function AvatarUpload({ currentAvatar, name, onUploadSuccess }: AvatarUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [showCropper, setShowCropper] = useState(false);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<CroppedArea | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 验证文件类型
    const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      alert("只支持 JPG、PNG、GIF、WebP 格式的图片");
      return;
    }

    // 验证文件大小 2MB
    if (file.size > 2 * 1024 * 1024) {
      alert("文件大小不能超过 2MB");
      return;
    }

    // 读取文件用于裁剪
    const reader = new FileReader();
    reader.onload = () => {
      setImageSrc(reader.result as string);
      setShowCropper(true);
      setCrop({ x: 0, y: 0 });
      setZoom(1);
    };
    reader.readAsDataURL(file);

    // 清空 input 以支持重复选择同一文件
    e.target.value = "";
  };

  const onCropComplete = useCallback(
    (croppedArea: CroppedArea, croppedAreaPixels: CroppedArea) => {
      setCroppedAreaPixels(croppedAreaPixels);
    },
    []
  );

  const handleCropConfirm = async () => {
    if (!imageSrc || !croppedAreaPixels) return;

    try {
      setUploading(true);

      // 裁剪图片
      const croppedBlob = await getCroppedImg(imageSrc, croppedAreaPixels);

      // 创建预览
      const previewUrl = URL.createObjectURL(croppedBlob);
      setPreview(previewUrl);

      // 上传
      const formData = new FormData();
      formData.append("avatar", croppedBlob, "avatar.jpg");

      const res = await fetch("/api/upload/avatar", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        onUploadSuccess(data.avatarUrl);
        setShowCropper(false);
        setImageSrc(null);
      } else {
        const data = await res.json();
        alert(data.error || "上传失败");
        setPreview(null);
      }
    } catch (error) {
      console.error("Error cropping/uploading avatar:", error);
      alert("上传失败");
      setPreview(null);
    } finally {
      setUploading(false);
    }
  };

  const handleCropCancel = () => {
    setShowCropper(false);
    setImageSrc(null);
    setCrop({ x: 0, y: 0 });
    setZoom(1);
  };

  const avatarSrc = preview || currentAvatar;
  const initial = name ? name[0] : "?";

  return (
    <>
      <div
        className="relative group cursor-pointer w-24 h-24 mx-auto"
        onClick={handleClick}
      >
        {/* 圆形头像 */}
        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-3xl font-bold text-white overflow-hidden border-2 border-transparent group-hover:border-blue-400 transition-colors">
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

        {/* 上传遮罩 - 圆形 */}
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

      {/* 裁剪弹窗 */}
      {showCropper && imageSrc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
          <div className="bg-gray-900 rounded-2xl p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">裁剪头像</h3>
              <button
                onClick={handleCropCancel}
                className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* 裁剪区域 */}
            <div className="relative w-full aspect-square rounded-xl overflow-hidden mb-4 bg-gray-800">
              <Cropper
                image={imageSrc}
                crop={crop}
                zoom={zoom}
                aspect={1}
                cropShape="round"
                showGrid={false}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
              />
            </div>

            {/* 缩放控制 */}
            <div className="flex items-center gap-4 mb-6">
              <ZoomOut className="w-5 h-5 text-gray-400" />
              <input
                type="range"
                min={1}
                max={3}
                step={0.1}
                value={zoom}
                onChange={(e) => setZoom(Number(e.target.value))}
                className="flex-1 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
              <ZoomIn className="w-5 h-5 text-gray-400" />
            </div>

            {/* 操作按钮 */}
            <div className="flex gap-3">
              <button
                onClick={handleCropCancel}
                className="flex-1 py-3 border border-white/20 hover:bg-white/10 text-white rounded-lg transition-colors"
              >
                取消
              </button>
              <button
                onClick={handleCropConfirm}
                disabled={uploading}
                className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/50 text-white rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                {uploading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    上传中...
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    确认
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
