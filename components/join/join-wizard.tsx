"use client";

import Image from "next/image";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  useTransition
} from "react";
import toast from "react-hot-toast";
import { RULES_SECTIONS } from "@/lib/constants";

declare global {
  interface Window {
    FaceDetector?: new (options?: { fastMode?: boolean; maxDetectedFaces?: number }) => {
      detect: (input: ImageBitmapSource) => Promise<Array<{ boundingBox: DOMRectReadOnly }>>;
    };
  }
}

const steps = ["Rules", "Foto", "Biodata", "Konfirmasi", "Sukses"];

type JoinForm = {
  nama: string;
  nickname: string;
  gender: string;
  tanggal_lahir: string;
  domisili: string;
  no_hp: string;
  division: string;
  role: string;
  photo_url: string;
  password: string;
};

const initialForm: JoinForm = {
  nama: "",
  nickname: "",
  gender: "",
  tanggal_lahir: "",
  domisili: "",
  no_hp: "",
  division: "Community",
  role: "Member",
  photo_url: "",
  password: ""
};

export function JoinWizard() {
  const [currentStep, setCurrentStep] = useState(1);
  const [agree, setAgree] = useState(false);
  const [photoMode, setPhotoMode] = useState<"scan" | "upload">("upload");
  const [form, setForm] = useState<JoinForm>(initialForm);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [cameraMessage, setCameraMessage] = useState(
    "Buka kamera lalu posisikan wajah Anda di tengah bingkai."
  );
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [isVideoAttached, setIsVideoAttached] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [scanFailed, setScanFailed] = useState(false);
  const [hasAutoStarted, setHasAutoStarted] = useState(false);
  const fileRef = useRef<HTMLInputElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [isPending, startTransition] = useTransition();

  const isBiodataValid = useMemo(
    () =>
      Boolean(
        form.nama &&
          form.nickname &&
          form.gender &&
          form.tanggal_lahir &&
          form.domisili &&
          form.no_hp &&
          form.division &&
          form.role &&
          form.password
      ),
    [form]
  );

  function next() {
    setCurrentStep((prev) => Math.min(prev + 1, 5));
  }

  function back() {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  }

  function stopCamera() {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    setIsCameraReady(false);
    setIsVideoAttached(false);
    setIsScanning(false);
    setHasAutoStarted(false);
  }

  const attachStreamToVideo = useCallback(async () => {
    if (!streamRef.current || !videoRef.current) return;

    const video = videoRef.current;
    video.srcObject = streamRef.current;

    try {
      await video.play();
      setIsVideoAttached(true);
    } catch {
      setIsVideoAttached(false);
      setCameraMessage(
        "Kamera aktif tetapi preview belum tampil. Tekan Buka Kamera sekali lagi."
      );
    }
  }, []);

  const startCamera = useCallback(async () => {
    try {
      if (streamRef.current) {
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "user",
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false
      });

      streamRef.current = stream;
      setIsCameraReady(true);
      setScanFailed(false);
      setHasAutoStarted(false);
      setCameraMessage(
        "Kamera aktif. Posisikan wajah Anda, scan akan dimulai otomatis."
      );
      setTimeout(() => {
        void attachStreamToVideo();
      }, 50);
    } catch {
      setCameraMessage(
        "Akses kamera ditolak. Izinkan kamera di browser atau gunakan Upload Foto."
      );
      setScanFailed(true);
    }
  }, [attachStreamToVideo]);

  useEffect(() => {
    if (currentStep === 2 && photoMode === "scan") {
      void startCamera();
    }

    return () => {
      stopCamera();
    };
  }, [currentStep, photoMode, startCamera]);

  const uploadCapturedBlob = useCallback(async (blob: Blob) => {
    const file = new File([blob], `scan-${Date.now()}.jpg`, {
      type: "image/jpeg"
    });
    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", "members");

    const response = await fetch("/api/upload", {
      method: "POST",
      body: formData
    });
    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Upload foto hasil scan gagal.");
    }

    setForm((prev) => ({ ...prev, photo_url: result.url as string }));
    toast.success("Foto hasil scan berhasil disimpan.");
  }, []);

  const captureFrame = useCallback(async () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth || 720;
    canvas.height = video.videoHeight || 720;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, "image/jpeg", 0.92)
    );

    if (!blob) {
      throw new Error("Gagal mengambil gambar dari kamera.");
    }

    await uploadCapturedBlob(blob);
    setCameraMessage("Wajah berhasil dipindai dan foto sudah tersimpan.");
    setScanFailed(false);
    stopCamera();
  }, [uploadCapturedBlob]);

  const runCountdownAndCapture = useCallback(async () => {
    for (const value of [3, 2, 1]) {
      setCountdown(value);
      await new Promise((resolve) => setTimeout(resolve, 800));
    }
    setCountdown(null);
    await captureFrame();
  }, [captureFrame]);

  const detectFaceAndCapture = useCallback(async () => {
    if (!videoRef.current || !isVideoAttached) return;

    setIsScanning(true);
    setScanFailed(false);
    setCameraMessage("Mendeteksi wajah, mohon hadapkan wajah ke kamera...");

    const startedAt = Date.now();
    const supportsFaceDetector =
      typeof window !== "undefined" && typeof window.FaceDetector !== "undefined";

    while (Date.now() - startedAt < 10000) {
      try {
        if (supportsFaceDetector) {
          const detector = new window.FaceDetector!({
            fastMode: true,
            maxDetectedFaces: 1
          });
          const faces = await detector.detect(videoRef.current);

          if (faces.length > 0) {
            setCameraMessage("Wajah terdeteksi. Mengambil foto...");
            await runCountdownAndCapture();
            setIsScanning(false);
            return;
          }
        } else {
          setCameraMessage(
            "Browser ini tidak mendukung deteksi wajah otomatis. Foto akan diambil setelah countdown."
          );
          await runCountdownAndCapture();
          setIsScanning(false);
          return;
        }
      } catch {
        break;
      }

      await new Promise((resolve) => setTimeout(resolve, 900));
    }

    setIsScanning(false);
    setScanFailed(true);
    setHasAutoStarted(true);
    setCameraMessage(
      "AKSES DITOLAK - Wajah tidak terdeteksi. Silakan posisikan wajah Anda dengan jelas di dalam kotak kamera."
    );
  }, [isVideoAttached, runCountdownAndCapture]);

  useEffect(() => {
    if (photoMode === "scan" && streamRef.current && videoRef.current) {
      void attachStreamToVideo();
    }
  }, [photoMode, isCameraReady, attachStreamToVideo]);

  useEffect(() => {
    if (
      currentStep === 2 &&
      photoMode === "scan" &&
      isCameraReady &&
      !isScanning &&
      !form.photo_url &&
      !hasAutoStarted
    ) {
      setHasAutoStarted(true);
      const timer = window.setTimeout(() => {
        void detectFaceAndCapture();
      }, 900);

      return () => window.clearTimeout(timer);
    }
  }, [
    currentStep,
    photoMode,
    isCameraReady,
    isScanning,
    form.photo_url,
    hasAutoStarted,
    detectFaceAndCapture
  ]);

  function handleUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    startTransition(async () => {
      try {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("folder", "members");

        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData
        });
        const result = await response.json();

        if (!response.ok) {
          toast.error(result.message || "Upload foto gagal.");
          return;
        }

        setForm((prev) => ({ ...prev, photo_url: result.url as string }));
        toast.success("Foto profil berhasil diupload.");
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Upload foto gagal.");
      }
    });
  }

  function submitRegistration() {
    startTransition(async () => {
      const response = await fetch("/api/join", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      const result = await response.json();

      if (!response.ok) {
        toast.error(result.message || "Pendaftaran gagal.");
        return;
      }

      toast.success("Pendaftaran berhasil dikirim.");
      setCurrentStep(5);
    });
  }

  return (
    <div className="space-y-8">
      <canvas ref={canvasRef} className="hidden" />

      <div className="grid gap-3 md:grid-cols-5">
        {steps.map((step, index) => {
          const active = currentStep >= index + 1;
          return (
            <div
              key={step}
              className={`rounded-full border px-4 py-3 text-center text-xs uppercase tracking-[0.25em] ${
                active
                  ? "border-gold-400 bg-gold-400/15 text-gold-300"
                  : "border-white/10 bg-white/5 text-white/45"
              }`}
            >
              {index + 1}. {step}
            </div>
          );
        })}
      </div>

      {currentStep === 1 ? (
        <div className="rounded-3xl border border-gold-400/30 bg-[#111111cc] p-6">
          <h2 className="font-orbitron text-3xl text-gold-300">
            RULES NORULES COMMUNITY
          </h2>
          <div className="mt-6 max-h-[28rem] space-y-4 overflow-y-auto pr-2">
            {RULES_SECTIONS.map((section) => (
              <div
                key={section.slice(0, 20)}
                className="whitespace-pre-line rounded-2xl border border-white/10 bg-black/40 p-4 text-sm leading-7 text-white/80"
              >
                {section}
              </div>
            ))}
          </div>
          <label className="mt-6 flex items-center gap-3 text-sm text-white/80">
            <input
              type="checkbox"
              checked={agree}
              onChange={(event) => setAgree(event.target.checked)}
              className="h-4 w-4 accent-[#E8B84B]"
            />
            Saya telah membaca dan menyetujui semua peraturan di atas.
          </label>
          <button
            type="button"
            disabled={!agree}
            onClick={next}
            className="mt-6 rounded-full border border-gold-400 px-5 py-3 font-semibold uppercase tracking-[0.25em] text-gold-300 transition hover:bg-gold-400/10 hover:shadow-gold disabled:cursor-not-allowed disabled:border-white/10 disabled:text-white/30"
          >
            Lanjutkan
          </button>
        </div>
      ) : null}

      {currentStep === 2 ? (
        <div className="rounded-3xl border border-gold-400/30 bg-[#111111cc] p-6">
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => setPhotoMode("scan")}
              className={`rounded-full px-4 py-2 text-sm ${
                photoMode === "scan"
                  ? "border border-gold-400 text-gold-300"
                  : "border border-white/10 text-white/60"
              }`}
            >
              Scan Wajah
            </button>
            <button
              type="button"
              onClick={() => {
                setPhotoMode("upload");
                stopCamera();
              }}
              className={`rounded-full px-4 py-2 text-sm ${
                photoMode === "upload"
                  ? "border border-gold-400 text-gold-300"
                  : "border border-white/10 text-white/60"
              }`}
            >
              Upload Foto
            </button>
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="rounded-3xl border border-gold-400/30 bg-black/40 p-6">
              <div className="relative flex aspect-video items-center justify-center overflow-hidden rounded-3xl border border-dashed border-gold-400/30 bg-gradient-to-br from-gold-400/10 to-transparent text-center text-white/70">
                {photoMode === "scan" ? (
                  <>
                    <video
                      ref={videoRef}
                      playsInline
                      muted
                      autoPlay
                      className={`h-full w-full object-cover ${isVideoAttached ? "opacity-100" : "opacity-0"}`}
                    />
                    <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                      <div
                        className={`relative h-[72%] w-[52%] rounded-[2rem] border shadow-[0_0_0_9999px_rgba(0,0,0,0.22)] ${
                          isScanning
                            ? "scan-pulse border-gold-300/90"
                            : scanFailed
                              ? "border-rose-400/80"
                              : "border-gold-400/60"
                        }`}
                      >
                        {isScanning ? <div className="scan-line" /> : null}
                        <div className="absolute inset-x-5 top-4 flex items-center justify-between text-[0.65rem] uppercase tracking-[0.35em] text-gold-300/90">
                          <span>Scan</span>
                          <span>{isScanning ? "Active" : scanFailed ? "Retry" : "Ready"}</span>
                        </div>
                      </div>
                    </div>
                    {countdown ? (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/35">
                        <p className="text-6xl font-bold text-gold-300">
                          {countdown}
                        </p>
                      </div>
                    ) : null}
                    {!isVideoAttached ? (
                      <div className="absolute inset-0 flex items-center justify-center px-5">
                        <div>
                          <p className="text-lg font-semibold text-gold-300">
                            Preview Kamera
                          </p>
                          <p className="mt-2 text-sm">{cameraMessage}</p>
                        </div>
                      </div>
                    ) : null}
                  </>
                ) : (
                  <div className="px-5">
                    <p className="text-lg font-semibold text-gold-300">
                      Upload Foto Profil
                    </p>
                    <p className="mt-2 text-sm">{cameraMessage}</p>
                  </div>
                )}
              </div>
              <div className="mt-4 flex flex-wrap gap-3">
                {photoMode === "scan" ? (
                  <>
                    <button
                      type="button"
                      onClick={() => void startCamera()}
                      className="rounded-full border border-gold-400 px-5 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-gold-300 transition hover:bg-gold-400/10 hover:shadow-gold"
                    >
                      Buka Kamera
                    </button>
                    <button
                      type="button"
                      disabled={!isCameraReady || isScanning}
                      onClick={() => void detectFaceAndCapture()}
                      className="rounded-full border border-gold-400 px-5 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-gold-300 transition hover:bg-gold-400/10 hover:shadow-gold disabled:opacity-40"
                    >
                      {isScanning ? "Scanning..." : "Scan Ulang"}
                    </button>
                    {scanFailed ? (
                      <button
                        type="button"
                        onClick={() => {
                          setScanFailed(false);
                          setHasAutoStarted(true);
                          void detectFaceAndCapture();
                        }}
                        className="rounded-full border border-white/20 px-5 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-white/75 transition hover:border-gold-400 hover:text-gold-300"
                      >
                        Coba Lagi
                      </button>
                    ) : null}
                  </>
                ) : null}
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  className="rounded-full border border-gold-400 px-5 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-gold-300 transition hover:bg-gold-400/10 hover:shadow-gold"
                >
                  Pilih Foto
                </button>
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleUpload}
                />
              </div>
              <p className="mt-4 text-xs text-white/45">
                Catatan: scan wajah memerlukan izin kamera. Untuk deployment
                produksi, gunakan HTTPS agar kamera bekerja stabil di Android
                Chrome dan browser modern.
              </p>
            </div>

            <div className="rounded-3xl border border-gold-400/30 bg-black/40 p-6">
              <p className="mb-4 font-orbitron text-lg text-gold-300">Preview</p>
              <div className="mx-auto flex h-56 w-56 items-center justify-center overflow-hidden rounded-full border border-gold-400/40 bg-black">
                {form.photo_url ? (
                  <Image
                    src={form.photo_url}
                    alt="Foto member"
                    width={224}
                    height={224}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span className="text-sm text-white/50">Belum ada foto</span>
                )}
              </div>
            </div>
          </div>

          <div className="mt-6 flex gap-3">
            <button
              type="button"
              onClick={() => {
                stopCamera();
                back();
              }}
              className="rounded-full border border-white/10 px-5 py-3 text-white/70"
            >
              Kembali
            </button>
            <button
              type="button"
              disabled={!form.photo_url}
              onClick={() => {
                stopCamera();
                next();
              }}
              className="rounded-full border border-gold-400 px-5 py-3 font-semibold uppercase tracking-[0.25em] text-gold-300 disabled:opacity-40"
            >
              Lanjutkan
            </button>
          </div>
        </div>
      ) : null}

      {currentStep === 3 ? (
        <div className="rounded-3xl border border-gold-400/30 bg-[#111111cc] p-6">
          <div className="mb-6 flex items-center gap-4">
            {form.photo_url ? (
              <Image
                src={form.photo_url}
                alt="Preview foto"
                width={70}
                height={70}
                className="rounded-full border border-gold-400/40 object-cover"
              />
            ) : null}
            <p className="text-sm text-white/60">
              Lengkapi biodata dengan benar. Format `nrL` wajib digunakan pada
              semua akun.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {[
              ["nama", "Nama Lengkap", "text"],
              ["nickname", "Nickname", "text"],
              ["tanggal_lahir", "Tanggal Lahir", "date"],
              ["domisili", "Domisili / Kota", "text"],
              ["no_hp", "No. HP / WhatsApp", "tel"],
              ["password", "Password Member", "password"]
            ].map(([key, label, type]) => (
              <input
                key={key}
                type={type}
                placeholder={label}
                value={form[key as keyof JoinForm] as string}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, [key]: event.target.value }))
                }
                className="rounded-2xl border border-gold-400/30 bg-black/50 px-4 py-3 text-white outline-none transition focus:border-gold-300"
              />
            ))}
            <select
              value={form.gender}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, gender: event.target.value }))
              }
              className="rounded-2xl border border-gold-400/30 bg-black/50 px-4 py-3 text-white outline-none"
            >
              <option value="">Pilih Gender</option>
              <option>Laki-laki</option>
              <option>Perempuan</option>
            </select>
            <select
              value={form.division}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, division: event.target.value }))
              }
              className="rounded-2xl border border-gold-400/30 bg-black/50 px-4 py-3 text-white outline-none"
            >
              <option>Club</option>
              <option>Community</option>
              <option>Both</option>
            </select>
            <select
              value={form.role}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, role: event.target.value }))
              }
              className="rounded-2xl border border-gold-400/30 bg-black/50 px-4 py-3 text-white outline-none"
            >
              <option>Member</option>
              <option>Officer</option>
              <option>Staff</option>
            </select>
          </div>

          <div className="mt-6 flex gap-3">
            <button
              type="button"
              onClick={back}
              className="rounded-full border border-white/10 px-5 py-3 text-white/70"
            >
              Kembali
            </button>
            <button
              type="button"
              disabled={!isBiodataValid}
              onClick={next}
              className="rounded-full border border-gold-400 px-5 py-3 font-semibold uppercase tracking-[0.25em] text-gold-300 disabled:opacity-40"
            >
              Lanjutkan
            </button>
          </div>
        </div>
      ) : null}

      {currentStep === 4 ? (
        <div className="rounded-3xl border border-gold-400/30 bg-[#111111cc] p-6">
          <p className="font-orbitron text-2xl text-gold-300">Konfirmasi Data</p>
          <div className="mt-6 grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
            <div className="rounded-3xl border border-gold-400/30 bg-black/40 p-5">
              <Image
                src={form.photo_url}
                alt="Foto final"
                width={260}
                height={260}
                className="mx-auto rounded-full border border-gold-400/40 object-cover"
              />
            </div>
            <div className="grid gap-3 rounded-3xl border border-gold-400/30 bg-black/40 p-5 text-sm text-white/80">
              {Object.entries(form).map(([key, value]) =>
                key === "photo_url" || key === "password" ? null : (
                  <div
                    key={key}
                    className="flex justify-between gap-4 border-b border-white/5 pb-3"
                  >
                    <span className="text-white/45">
                      {key.replaceAll("_", " ")}
                    </span>
                    <span className="text-right">{value}</span>
                  </div>
                )
              )}
            </div>
          </div>
          <div className="mt-6 flex gap-3">
            <button
              type="button"
              onClick={back}
              className="rounded-full border border-white/10 px-5 py-3 text-white/70"
            >
              Edit
            </button>
            <button
              type="button"
              disabled={isPending}
              onClick={submitRegistration}
              className="rounded-full border border-gold-400 px-5 py-3 font-semibold uppercase tracking-[0.25em] text-gold-300 transition hover:bg-gold-400/10 hover:shadow-gold disabled:opacity-50"
            >
              {isPending ? "Mengirim..." : "Submit Pendaftaran"}
            </button>
          </div>
        </div>
      ) : null}

      {currentStep === 5 ? (
        <div className="rounded-3xl border border-gold-400/30 bg-[#111111cc] p-8 text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-gold-400 bg-gold-400/10 text-3xl text-gold-300">
            ✓
          </div>
          <h2 className="mt-6 font-orbitron text-3xl text-gold-300">
            Selamat datang di NORULES COMMUNITY!
          </h2>
          <p className="mt-3 text-white/70">Nickname: {form.nickname}</p>
          <p className="mt-2 text-sm text-white/55">
            Akun member Anda sekarang bisa login memakai nickname dan password
            yang barusan dibuat.
          </p>
          <div className="mx-auto mt-8 max-w-md rounded-3xl border border-gold-400/35 bg-black/50 p-6 text-left">
            <p className="font-orbitron text-sm tracking-[0.25em] text-gold-300">
              MEMBER ID CARD
            </p>
            <div className="mt-4 flex items-center gap-4">
              <Image
                src={form.photo_url}
                alt="Foto kartu"
                width={86}
                height={86}
                className="rounded-2xl border border-gold-400/30 object-cover"
              />
              <div>
                <p className="text-lg font-semibold text-white">{form.nama}</p>
                <p className="text-sm text-white/60">{form.nickname}</p>
                <p className="text-xs uppercase tracking-[0.2em] text-gold-300">
                  {new Date().toLocaleDateString("id-ID")}
                </p>
              </div>
            </div>
          </div>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <a
              href="/members"
              className="rounded-full border border-gold-400 px-5 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-gold-300"
            >
              Lihat Profil
            </a>
            <a
              href="/"
              className="rounded-full border border-white/10 px-5 py-3 text-sm text-white/70"
            >
              Kembali ke Beranda
            </a>
          </div>
        </div>
      ) : null}
    </div>
  );
}
