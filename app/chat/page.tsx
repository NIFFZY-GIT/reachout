"use client";
import { Fragment } from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import Pusher from "pusher-js";
import { ArrowLeft, CheckCheck, CircleAlert, ImagePlus, LoaderCircle, LockKeyhole, Send, ShieldAlert, X } from "lucide-react";
import { useSignOutOnPageExit } from "@/lib/use-sign-out-on-page-exit";

type Message = {
  id: string;
  text: string;
  messageType?: "TEXT" | "IMAGE";
  senderRole: "USER" | "ADMIN";
  createdAt: string;
  isRead: boolean;
};

function dateLabel(value: string) {
  const date = new Date(value);
  const today = new Date();
  if (date.toDateString() === today.toDateString()) return "Today";
  return date.toLocaleDateString([], { day: "numeric", month: "short", year: "numeric" });
}

function formatCountdown(value: number | null) {
  if (value === null) return "--:--";
  const minutes = Math.floor(value / 60).toString().padStart(2, "0");
  const seconds = (value % 60).toString().padStart(2, "0");
  return `${minutes}:${seconds}`;
}

export default function ChatPage() {
  useSignOutOnPageExit();

  const [conversation, setConversation] = useState<{ id: string } | null>(null);
  const [showRetentionNotice, setShowRetentionNotice] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState("");
  const [selectedImage, setSelectedImage] = useState<{ name: string; dataUrl: string } | null>(null);
  const imageInput = useRef<HTMLInputElement>(null);
  const [typing, setTyping] = useState(false);
  const [connectionIssue, setConnectionIssue] = useState(false);
  const [adminIsOnline, setAdminIsOnline] = useState(false);
  const [sessionExpiresAt, setSessionExpiresAt] = useState<number | null>(null);
  const [sessionSeconds, setSessionSeconds] = useState<number | null>(null);
  const [sessionTimeoutEnabled, setSessionTimeoutEnabled] = useState(false);
  const autoLogoutStarted = useRef(false);
  const end = useRef<HTMLDivElement>(null);
  const latestMessageAt = useRef<string | null>(null);
  const typingTimer = useRef<number | null>(null);
  const lastTypingSentAt = useRef(0);

  const mergeMessages = useCallback((incoming: Message[]) => {
    if (incoming.length === 0) return;
    const newest = incoming[incoming.length - 1].createdAt;
    if (!latestMessageAt.current || newest > latestMessageAt.current) {
      latestMessageAt.current = newest;
    }
    setMessages((current) => {
      const byId = new Map(current.map((message) => [message.id, message]));
      incoming.forEach((message) => byId.set(message.id, message));
      return [...byId.values()].sort(
        (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      );
    });
  }, []);

  const syncMessages = useCallback(async (conversationId: string) => {
    const cursor = latestMessageAt.current;
    const query = cursor ? `?after=${encodeURIComponent(cursor)}` : "";
    try {
      const response = await fetch(`/api/conversations/active${query}`, { cache: "no-store" });
      if (response.status === 401) {
        await logout();
        return;
      }
      if (!response.ok) {
        setConnectionIssue(true);
        return;
      }
      const active = await response.json();
      if (active.conversation.id === conversationId) {
        mergeMessages(active.messages);
        setAdminIsOnline(active.conversation.adminIsOnline);
        if (active.receipts?.length) {
          const receipts = new Map<string, boolean>(
            active.receipts.map((receipt: { id: string; isRead: boolean }) => [receipt.id, receipt.isRead]),
          );
          setMessages((current) =>
            current.map((message) =>
              receipts.has(message.id)
                ? { ...message, isRead: receipts.get(message.id) ?? message.isRead }
                : message,
            ),
          );
        }
        setTyping(active.conversation.adminIsTyping);
      }
      setConnectionIssue(false);
    } catch {
      setConnectionIssue(true);
    }
  }, [mergeMessages]);

  useEffect(() => {
    fetch("/api/auth/session")
      .then((response) => (response.ok ? response.json() : null))
      .then(async (data) => {
        if (!data) {
          window.location.href = "/login";
          return;
        }
        const timeoutEnabled = data.sessionTimeoutEnabled === true;
        setSessionTimeoutEnabled(timeoutEnabled);
        const expiry = timeoutEnabled ? new Date(data.expiresAt).getTime() : NaN;
        if (Number.isFinite(expiry)) {
          setSessionExpiresAt(expiry);
        } else {
          setSessionExpiresAt(null);
          setSessionSeconds(null);
        }
        const response = await fetch("/api/conversations/active");
        if (!response.ok) {
          window.location.href = "/login";
          return;
        }
        const active = await response.json();
        setConversation(active.conversation);
        setShowRetentionNotice(active.conversation.isNewConversation === true);
        setAdminIsOnline(active.conversation.adminIsOnline);
        const receipts = new Map<string, boolean>(
          active.receipts.map((receipt: { id: string; isRead: boolean }) => [receipt.id, receipt.isRead] as const),
        );
        setMessages(active.messages.map((message: Message) => ({
          ...message,
          isRead: receipts.get(message.id) ?? message.isRead,
        })));
        if (active.messages.length > 0) {
          latestMessageAt.current = active.messages[active.messages.length - 1].createdAt;
        }
      });
  }, []);

  useEffect(() => {
    const syncSessionTimeout = async () => {
      try {
        const response = await fetch("/api/auth/session", { cache: "no-store" });
        if (response.status === 401) {
          if (!autoLogoutStarted.current) {
            autoLogoutStarted.current = true;
            await logout();
          }
          return;
        }
        if (!response.ok) return;
        const data = await response.json();
        const timeoutEnabled = data.sessionTimeoutEnabled === true;
        setSessionTimeoutEnabled(timeoutEnabled);
        const expiry = timeoutEnabled ? new Date(data.expiresAt).getTime() : NaN;
        if (Number.isFinite(expiry)) {
          setSessionExpiresAt(expiry);
        } else {
          setSessionExpiresAt(null);
          setSessionSeconds(null);
        }
      } catch (error) {
        console.error("Could not refresh the user session timer", error);
      }
    };
    const timer = window.setInterval(syncSessionTimeout, 10000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!conversation) return;
    if (!process.env.NEXT_PUBLIC_PUSHER_KEY) return;
    const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER || "mt1",
      authEndpoint: "/api/pusher/auth",
    });
    const channel = pusher.subscribe(`private-conversation-${conversation.id}`);
    channel.bind("message:new", () => void syncMessages(conversation.id));
    channel.bind("client-typing", () => {
      setTyping(true);
      window.setTimeout(() => setTyping(false), 1800);
    });
    return () => {
      channel.unbind();
      pusher.unsubscribe(`private-conversation-${conversation.id}`);
      pusher.disconnect();
    };
  }, [conversation, syncMessages]);

  useEffect(() => {
    if (!conversation) return;
    const poll = window.setInterval(() => {
      if (!document.hidden) void syncMessages(conversation.id);
    }, 1500);
    return () => window.clearInterval(poll);
  }, [conversation, syncMessages]);

  useEffect(() => {
    if (sessionExpiresAt === null) return;
    const updateCountdown = () => {
      const remaining = Math.max(0, Math.ceil((sessionExpiresAt - Date.now()) / 1000));
      setSessionSeconds(remaining);
      if (remaining === 0 && !autoLogoutStarted.current) {
        autoLogoutStarted.current = true;
        void fetch("/api/auth/logout", { method: "POST" })
          .catch((error) => console.error("Could not close the expired session", error))
          .finally(() => {
            window.location.href = "/login";
          });
      }
    };
    updateCountdown();
    const timer = window.setInterval(updateCountdown, 1000);
    return () => window.clearInterval(timer);
  }, [sessionExpiresAt]);

  useEffect(() => {
    const heartbeat = window.setInterval(async () => {
      try {
        const response = await fetch("/api/auth/heartbeat", { method: "POST" });
        if (response.status === 401) {
          await fetch("/api/auth/logout", { method: "POST" });
          window.location.href = "/login";
        }
      } catch {
        setConnectionIssue(true);
      }
    }, 30000);
    const onVisibility = () => {
      if (document.hidden) {
        void fetch("/api/auth/heartbeat", { method: "POST", keepalive: true }).catch(() => {
          setConnectionIssue(true);
        });
      }
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      window.clearInterval(heartbeat);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  useEffect(() => {
    end.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  function updateText(value: string) {
    setText(value);
    if (typingTimer.current) window.clearTimeout(typingTimer.current);
    if (conversation && value.trim()) {
      if (Date.now() - lastTypingSentAt.current > 1000) {
        lastTypingSentAt.current = Date.now();
        void fetch(`/api/conversations/${conversation.id}/typing`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ typing: true }),
        });
      }
      typingTimer.current = window.setTimeout(() => {
        lastTypingSentAt.current = 0;
        void fetch(`/api/conversations/${conversation.id}/typing`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ typing: false }),
        });
      }, 1600);
    } else if (conversation) {
      lastTypingSentAt.current = 0;
      void fetch(`/api/conversations/${conversation.id}/typing`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ typing: false }),
      });
    }
  }

  function selectImage(file: File | undefined) {
    if (!file) return;
    if (!/^image\/(jpeg|png|webp|gif)$/i.test(file.type)) {
      setSendError("Please choose a JPG, PNG, WEBP, or GIF image.");
      return;
    }
    if (file.size > 15 * 1024 * 1024) {
      setSendError("Images must be smaller than 15 MB.");
      return;
    }
    setSendError("");
    const sourceUrl = URL.createObjectURL(file);
    const image = new Image();
    image.onload = () => {
      URL.revokeObjectURL(sourceUrl);
      const maxDimension = 1600;
      const scale = Math.min(1, maxDimension / Math.max(image.width, image.height));
      const canvas = document.createElement("canvas");
      canvas.width = Math.max(1, Math.round(image.width * scale));
      canvas.height = Math.max(1, Math.round(image.height * scale));
      const context = canvas.getContext("2d");
      if (!context) {
        setSendError("The image could not be processed. Please try again.");
        return;
      }
      context.drawImage(image, 0, 0, canvas.width, canvas.height);
      let quality = 0.82;
      let dataUrl = canvas.toDataURL("image/jpeg", quality);
      while (dataUrl.length > 1_100_000 && quality > 0.55) {
        quality -= 0.08;
        dataUrl = canvas.toDataURL("image/jpeg", quality);
      }
      if (dataUrl.length > 1_300_000) {
        setSendError("This image is too large after compression. Please choose a smaller image.");
        return;
      }
      setSelectedImage({ name: file.name, dataUrl });
    };
    image.onerror = () => {
      URL.revokeObjectURL(sourceUrl);
      setSendError("The image could not be read. Please try again.");
    };
    image.src = sourceUrl;
  }

  async function send() {
    if (!conversation || (!text.trim() && !selectedImage) || sending) return;
    const outgoing = text.trim();
    const image = selectedImage;
    setSending(true);
    setSendError("");
    setText("");
    setSelectedImage(null);
    if (imageInput.current) imageInput.current.value = "";
    const optimistic: Message = {
      id: `pending-${Date.now()}`,
      text: image?.dataUrl || outgoing,
      messageType: image ? "IMAGE" : "TEXT",
      senderRole: "USER",
      createdAt: new Date().toISOString(),
      isRead: false,
    };
    setMessages((current) => [...current, optimistic]);
    try {
      const response = await fetch(`/api/conversations/${conversation.id}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(image
          ? { text: outgoing, image: image.dataUrl }
          : { text: outgoing }),
      });
      if (response.ok) {
        const data = await response.json();
        setMessages((current) => current.filter((message) => message.id !== optimistic.id));
        mergeMessages([data.message]);
      } else {
        setMessages((current) => current.filter((message) => message.id !== optimistic.id));
        setText(outgoing);
        setSelectedImage(image);
        const data = await response.json().catch(() => null);
        setSendError(data?.error || "Message wasn’t sent. Please try again.");
      }
    } catch {
      setMessages((current) => current.filter((message) => message.id !== optimistic.id));
      setText(outgoing);
      setSelectedImage(image);
      setSendError("Connection lost. Your message wasn’t sent—please try again.");
    } finally {
      setSending(false);
      if (typingTimer.current) window.clearTimeout(typingTimer.current);
      if (conversation) {
        void fetch(`/api/conversations/${conversation.id}/typing`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ typing: false }),
        });
      }
    }
  }

  async function logout() {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } finally {
      window.location.href = "/login";
    }
  }

  return (
    <main
      onContextMenu={(event) => event.preventDefault()}
      className="chat-protected h-[100dvh] overflow-hidden bg-[#0B141A] md:p-4"
    >
      <div className="mx-auto flex h-full max-w-5xl flex-col overflow-hidden bg-[#0B141A] md:h-[calc(100dvh-32px)] md:rounded-2xl md:border md:border-[#2A3942] md:shadow-[0_20px_60px_rgba(0,168,132,.12)]">
        <header className="flex h-[64px] sm:h-[68px] shrink-0 items-center justify-between bg-[#202C33] px-2 sm:px-3 text-[#E9EDEF] md:px-5">
          <div className="flex min-w-0 items-center gap-1.5 sm:gap-3">
            <button
              onClick={() => { window.location.href = "/dashboard"; }}
              aria-label="Back"
              className="grid size-9 sm:size-10 shrink-0 place-items-center rounded-full transition active:scale-90 active:bg-white/10"
            >
              <ArrowLeft size={19} className="sm:size-[21px]" />
            </button>
            <div className="grid size-9 sm:size-11 shrink-0 place-items-center rounded-full bg-[#00A884] text-[#0B141A] shadow-sm">
              <ShieldAlert size={18} className="sm:size-[21px]" />
            </div>
            <div className="min-w-0 pr-1">
              <h1 className="truncate text-sm sm:text-[15px] font-semibold">ReachOut Support</h1>
              <p className="mt-0.5 flex items-center gap-1 text-[11px] sm:text-xs text-[#8696A0]">
                <span
                  className={`size-2 shrink-0 rounded-full ${adminIsOnline ? "bg-[#25D366]" : "bg-[#8696A0]"}`}
                />
                <LockKeyhole size={10} className="shrink-0" />
                <span className="truncate">
                  {connectionIssue
                    ? "Reconnecting…"
                    : `Admin ${adminIsOnline ? "online" : "offline"}`}
                </span>
              </p>
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-1">
            <span
              aria-label={
                sessionTimeoutEnabled
                  ? `Automatic sign-out in ${formatCountdown(sessionSeconds)}`
                  : "Automatic sign-out timer off"
              }
              title="Automatic sign-out countdown"
              className="rounded-full bg-[#182229] px-2 py-1 sm:px-2.5 sm:py-1.5 font-mono text-[11px] sm:text-xs font-semibold text-[#FFD279]"
            >
              {sessionTimeoutEnabled ? formatCountdown(sessionSeconds) : "Timer off"}
            </span>
            <button
              onClick={logout}
              className="rounded-full px-2.5 py-1.5 sm:px-3 sm:py-2 text-xs font-semibold text-[#8696A0] transition active:scale-95 active:bg-white/10"
            >
              Sign out
            </button>
          </div>
        </header>

        <div
          className="relative flex-1 overflow-y-auto px-3 py-5 md:px-8"
          style={{
            backgroundColor: "#0B141A",
            backgroundImage:
              "radial-gradient(circle at 25% 25%, rgba(0,168,132,.08) 0 1px, transparent 1.5px), radial-gradient(circle at 75% 75%, rgba(0,168,132,.05) 0 1px, transparent 1.5px)",
            backgroundSize: "28px 28px",
          }}
        >
          {messages.length === 0 && (
            <div className="mx-auto mt-10 max-w-sm rounded-2xl bg-[#202C33]/95 px-5 py-6 text-center shadow-sm backdrop-blur">
              <div className="mx-auto grid size-12 place-items-center rounded-full bg-[#00A884]/20 text-[#00A884]">
                <LockKeyhole size={21} />
              </div>
              <h2 className="mt-3 text-sm font-bold text-[#E9EDEF]">Private conversation</h2>
              <p className="mt-2 text-xs leading-5 text-[#8696A0]">
                Signing out clears messages from your view, but support administrators retain the conversation history. Please avoid screenshots or screen recordings.
              </p>
            </div>
          )}

          <div className="mx-auto max-w-4xl space-y-2">
            {messages.length > 0 && (
              <div className="mx-auto mb-3 w-fit max-w-[88%] rounded-lg bg-[#182229] px-3 py-2 text-center text-[11px] leading-4 text-[#FFD279] shadow-sm">
                <LockKeyhole size={10} className="mr-1 inline" />
                Signing out clears messages from your view, but support administrators retain the conversation history. Please avoid sharing sensitive screenshots or recordings.
              </div>
            )}
            {messages.map((message, index) => {
              const previous = index > 0 ? messages[index - 1] : null;
              const showDate =
                !previous ||
                new Date(previous.createdAt).toDateString() !==
                  new Date(message.createdAt).toDateString();
              return (
                <Fragment key={message.id}>
                  {showDate && (
                    <div className="flex justify-center py-1">
                      <span className="rounded-md bg-[#182229] px-3 py-1.5 text-[11px] text-[#8696A0] shadow-sm">
                        {dateLabel(message.createdAt)}
                      </span>
                    </div>
                  )}
                  <div
                    className={`flex ${message.senderRole === "USER" ? "justify-end" : "justify-start"} animate-[fadeIn_.18s_ease-out]`}
                  >
                    <div
                      className={`relative max-w-[84%] rounded-lg px-3 py-2 shadow-[0_1px_1px_rgba(11,20,26,.12)] ${
                        message.senderRole === "USER"
                          ? "rounded-tr-none bg-[#005C4B] text-[#E9EDEF]"
                          : "rounded-tl-none bg-[#202C33] text-[#E9EDEF]"
                      }`}
                    >
                      {message.messageType === "IMAGE" ? (
                        <div className="mb-5">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={message.text}
                            alt="Chat attachment"
                            className="block max-h-72 max-w-full rounded-md object-contain"
                          />
                        </div>
                      ) : (
                        <p className="pr-12 text-[15px] leading-[1.35] whitespace-pre-wrap break-words">
                          {message.text}
                        </p>
                      )}
                      <span className="absolute bottom-1.5 right-2 flex items-center gap-1 text-[10px] text-[#8696A0]">
                        {message.id.startsWith("pending-")
                          ? "Sending..."
                          : new Date(message.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        {message.senderRole === "USER" && (
                          <CheckCheck
                            size={13}
                            className={message.id.startsWith("pending-")
                              ? "text-[#8696A0]"
                              : message.isRead ? "text-[#53BDEB]" : "text-[#8696A0]"}
                          />
                        )}
                      </span>
                    </div>
                  </div>
                </Fragment>
              );
            })}
            {typing && (
              <div className="flex justify-start">
                <div className="rounded-lg rounded-tl-none bg-[#202C33] px-4 py-3 text-xs text-[#8696A0] shadow-sm">
                  <span className="inline-flex items-center gap-1">
                    Support team is typing
                    <span className="flex items-center gap-0.5">
                      <i className="typing-dot" />
                      <i className="typing-dot [animation-delay:150ms]" />
                      <i className="typing-dot [animation-delay:300ms]" />
                    </span>
                  </span>
                </div>
              </div>
            )}
          </div>
          <div ref={end} />
        </div>

        <div className="shrink-0 bg-[#202C33] px-2 py-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] md:px-4">
          {sendError && (
            <p role="alert" className="mx-auto mb-2 flex max-w-4xl items-center gap-2 px-2 text-xs text-[#FF8A80]">
              <CircleAlert size={14} />
              {sendError}
            </p>
          )}
          {selectedImage && (
            <div className="mx-auto mb-2 flex max-w-4xl items-center gap-2 rounded-xl bg-[#182229] p-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={selectedImage.dataUrl} alt="" className="size-14 rounded-lg object-cover" />
              <span className="min-w-0 flex-1 truncate text-xs text-[#8696A0]">{selectedImage.name}</span>
              <button
                type="button"
                onClick={() => setSelectedImage(null)}
                aria-label="Remove selected image"
                className="grid size-8 place-items-center rounded-full text-[#8696A0] hover:bg-white/10"
              >
                <X size={16} />
              </button>
            </div>
          )}
          <div className="mx-auto flex max-w-4xl items-end gap-2">
            <input
              ref={imageInput}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              onChange={(event) => selectImage(event.target.files?.[0])}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => imageInput.current?.click()}
              disabled={sending}
              aria-label="Add image"
              className="grid size-12 shrink-0 place-items-center rounded-full text-[#8696A0] transition active:scale-90 hover:bg-[#2A3942] hover:text-[#E9EDEF]"
            >
              <ImagePlus size={22} />
            </button>
            <textarea
              value={text}
              onChange={(event) => updateText(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter" && !event.shiftKey) {
                  event.preventDefault();
                  void send();
                }
              }}
              rows={1}
              maxLength={5000}
              placeholder="Message"
              enterKeyHint="send"
              className="max-h-32 min-h-12 flex-1 resize-none rounded-3xl border-0 bg-[#2A3942] px-4 py-3 text-base text-[#E9EDEF] outline-none shadow-sm placeholder:text-[#8696A0] focus:ring-2 focus:ring-[#00A884]/50 sm:px-5"
            />
            <button
              onClick={send}
              disabled={(!text.trim() && !selectedImage) || sending}
              aria-label={sending ? "Sending message" : "Send message"}
              className={`grid size-12 shrink-0 place-items-center rounded-full bg-[#00A884] text-[#0B141A] shadow-[0_4px_12px_rgba(0,168,132,.3)] transition duration-150 active:scale-90 disabled:cursor-not-allowed disabled:opacity-60 ${sending ? "animate-pulse" : "hover:scale-105 hover:shadow-[0_6px_18px_rgba(0,168,132,.4)]"}`}
            >
              {sending ? <LoaderCircle size={21} className="animate-spin" /> : <Send size={20} fill="currentColor" />}
            </button>
          </div>
        </div>
      </div>

      {showRetentionNotice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <section
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="chat-retention-title"
            aria-describedby="chat-retention-description"
            className="w-full max-w-md rounded-2xl border border-[#2A3942] bg-[#111B21] p-6 text-[#E9EDEF] shadow-2xl"
          >
            <div className="mb-4 grid size-11 place-items-center rounded-xl bg-[#FFD279]/15 text-[#FFD279]">
              <LockKeyhole size={21} />
            </div>
            <p className="text-xs font-semibold uppercase tracking-wide text-[#FFD279]">
              Important chat notice
            </p>
            <h2 id="chat-retention-title" className="mt-2 text-xl font-bold">
              About your chat history
            </h2>
            <p
              id="chat-retention-description"
              className="mt-3 text-sm leading-6 text-[#B7C3CA]"
            >
              When you sign out, messages are automatically removed from your view. Support
              administrators can still view the full conversation history, including your messages.
            </p>
            <button
              onClick={() => setShowRetentionNotice(false)}
              className="mt-6 w-full rounded-xl bg-[#00A884] px-4 py-3 text-sm font-semibold text-[#0B141A] transition hover:bg-[#02906f]"
            >
              I understand
            </button>
          </section>
        </div>
      )}

    </main>
  );
}
