"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Pusher from "pusher-js";
import {
  Archive,
  ArchiveRestore,
  ArrowLeft,
  Check,
  CheckCheck,
  CheckCircle2,
  Clock,
  Filter,
  Inbox,
  Info,
  KeyRound,
  LoaderCircle,
  Lock,
  LogOut,
  MessageCircle,
  MessageSquare,
  Pencil,
  Plus,
  RefreshCw,
  Search,
  Send,
  Shield,
  ShieldAlert,
  Sparkles,
  Trash2,
  User,
  Users,
  X,
} from "lucide-react";

type Conversation = {
  id: string;
  status: string;
  safetyFlag: string;
  lastMessage?: string;
  lastMessageAt?: string;
  lastMessageSender?: string;
  adminUnreadCount: number;
  userTypingUntil?: string | null;
  userIsTyping?: boolean;
  userSessionExpiresAt?: string | null;
  user: { id: string; username: string; email?: string | null };
};

type AdminMessage = {
  id: string;
  senderRole: "USER" | "ADMIN";
  text: string;
  createdAt: string;
  isRead: boolean;
};

type AdminNote = {
  id: string;
  note: string;
  createdAt: string;
  updatedAt?: string;
};

type Detail = {
  conversation: Conversation & {
    adminMessages: AdminMessage[];
    adminNotes?: AdminNote[];
  };
  receipts: { id: string; isRead: boolean; readAt: string | null }[];
};

const QUICK_REPLIES = [
  "I'm here for you. Take all the time you need.",
  "You are safe here, and you don't have to carry this alone.",
  "Would you like to share a bit more about what brought this on?",
  "Thank you for reaching out and sharing this with me.",
  "I'm listening. How can I best support you right now?",
];

function formatTime(dateString: string) {
  try {
    return new Date(dateString).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  } catch {
    return "";
  }
}

function formatRelative(dateString?: string) {
  if (!dateString) return "";
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    if (diffHours < 24 && date.toDateString() === now.toDateString()) {
      return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    }
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return date.toLocaleDateString([], { weekday: "short" });
    return date.toLocaleDateString([], { month: "short", day: "numeric" });
  } catch {
    return "";
  }
}

function dateLabel(dateString: string) {
  try {
    const date = new Date(dateString);
    const now = new Date();
    if (date.toDateString() === now.toDateString()) return "Today";
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    if (date.toDateString() === yesterday.toDateString()) return "Yesterday";
    return date.toLocaleDateString([], { day: "numeric", month: "short", year: "numeric" });
  } catch {
    return "";
  }
}

function formatCountdown(value: number | null) {
  if (value === null) return "--:--";
  const minutes = Math.floor(value / 60).toString().padStart(2, "0");
  const seconds = (value % 60).toString().padStart(2, "0");
  return `${minutes}:${seconds}`;
}

function formatUserSessionTime(
  expiresAt: string | null | undefined,
  now: number,
  timeoutEnabled: boolean | null,
) {
  if (!expiresAt) return "User signed out";
  if (timeoutEnabled === false) return "10-minute timer off";
  if (timeoutEnabled === null) return "Checking timeout setting";
  if (!now) return "Checking user session";
  const remaining = Math.ceil((new Date(expiresAt).getTime() - now) / 1000);
  if (!Number.isFinite(remaining) || remaining <= 0) return "User signed out";
  return `User session ${formatCountdown(remaining)} left`;
}

export default function AdminPage() {
  const [items, setItems] = useState<Conversation[]>([]);
  const [totals, setTotals] = useState({
    users: 0,
    conversations: 0,
    unread: 0,
    awaiting: 0,
    active: 0,
    resolved: 0,
  });
  const [selected, setSelected] = useState<string | null>(null);
  const [detail, setDetail] = useState<Detail | null>(null);
  const [text, setText] = useState("");
  const [note, setNote] = useState("");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"ALL" | "UNREAD" | "AWAITING" | "ACTIVE" | "RESOLVED">("ALL");
  const [showNotesPanel, setShowNotesPanel] = useState(true);
  const [sending, setSending] = useState(false);
  const [addingNote, setAddingNote] = useState(false);
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [editingNoteText, setEditingNoteText] = useState("");
  const [savingNoteId, setSavingNoteId] = useState<string | null>(null);
  const [deletingNoteId, setDeletingNoteId] = useState<string | null>(null);
  const [confirmDeleteNoteId, setConfirmDeleteNoteId] = useState<string | null>(null);
  const [sendError, setSendError] = useState("");
  const [updatingFlag, setUpdatingFlag] = useState(false);
  const [forcingLogout, setForcingLogout] = useState(false);
  const [forceLogoutError, setForceLogoutError] = useState("");
  const [forceLogoutSuccess, setForceLogoutSuccess] = useState("");
  const [deletingConversation, setDeletingConversation] = useState(false);
  const [deleteConversationError, setDeleteConversationError] = useState("");
  const [showPasswordReset, setShowPasswordReset] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [resettingPassword, setResettingPassword] = useState(false);
  const [passwordResetError, setPasswordResetError] = useState("");
  const [passwordResetSuccess, setPasswordResetSuccess] = useState("");
  const [sessionClock, setSessionClock] = useState(0);
  const [sessionTimeoutEnabled, setSessionTimeoutEnabled] = useState<boolean | null>(null);
  const [updatingSessionTimeout, setUpdatingSessionTimeout] = useState(false);
  const [sessionTimeoutError, setSessionTimeoutError] = useState("");

  const lastDetailAt = useRef<string | null>(null);
  const typingTimer = useRef<number | null>(null);
  const lastTypingSentAt = useRef(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = (smooth = true) => {
    messagesEndRef.current?.scrollIntoView({ behavior: smooth ? "smooth" : "auto" });
  };

  const load = useCallback(async () => {
    try {
      const response = await fetch("/api/admin/conversations", { cache: "no-store" });
      if (response.status === 401) {
        void fetch("/api/auth/logout", { method: "POST" })
          .catch((error) => console.error("Could not close the expired admin session", error))
          .finally(() => {
            window.location.href = "/login";
          });
        return;
      }
      if (response.status === 403) {
        window.location.href = "/login";
        return;
      }
      if (!response.ok) return;
      const data = await response.json();
      setItems(data.conversations);
      setTotals(data.totals);
    } catch (error) {
      console.error("Could not refresh the admin inbox", error);
    }
  }, []);

  useEffect(() => {
    const timer = window.setInterval(() => setSessionClock(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    let active = true;
    const loadSessionTimeout = async () => {
      try {
        const response = await fetch("/api/admin/settings/session-timeout", {
          cache: "no-store",
        });
        const data = await response.json().catch(() => null);
        if (!response.ok) {
          throw new Error(data?.error || "Could not load the session timer setting.");
        }
        if (active) {
          setSessionTimeoutEnabled(data.enabled);
          setSessionTimeoutError("");
        }
      } catch (error) {
        if (active) {
          setSessionTimeoutError(
            error instanceof Error ? error.message : "Could not load the session timer setting.",
          );
        }
      }
    };
    void loadSessionTimeout();
    const timer = window.setInterval(loadSessionTimeout, 15000);
    return () => {
      active = false;
      window.clearInterval(timer);
    };
  }, []);

  const open = useCallback(async (id: string, incremental = false) => {
    setSelected(id);
    if (!incremental) {
      setForceLogoutError("");
      setForceLogoutSuccess("");
      setDeleteConversationError("");
      setShowPasswordReset(false);
      setNewPassword("");
      setPasswordResetError("");
      setPasswordResetSuccess("");
    }
    const cursor = incremental ? lastDetailAt.current : null;
    const query = cursor ? `?after=${encodeURIComponent(cursor)}` : "";
    try {
      const response = await fetch(`/api/admin/conversations/${id}${query}`, {
        cache: "no-store",
      });
      if (!response.ok) return;
      const data: Detail = await response.json();
      const incoming = data.conversation.adminMessages;
      const readById = new Map(data.receipts.map((receipt) => [receipt.id, receipt.isRead] as const));

      if (incremental) {
        setDetail((current) => {
          if (!current || current.conversation.id !== id) {
            if (incoming.length) {
              lastDetailAt.current = incoming[incoming.length - 1].createdAt;
            }
            return {
              ...data,
              conversation: {
                ...data.conversation,
                adminMessages: incoming.map((message) => ({
                  ...message,
                  isRead: readById.get(message.id) ?? message.isRead,
                })),
              },
            };
          }
          const byId = new Map(
            current.conversation.adminMessages.map((message) => [message.id, message]),
          );
          incoming.forEach((message) => byId.set(message.id, message));
          const messages = [...byId.values()]
            .map((message) => ({
              ...message,
              isRead: readById.get(message.id) ?? message.isRead,
            }))
            .sort((a, b) => a.createdAt.localeCompare(b.createdAt));
          if (messages.length) lastDetailAt.current = messages[messages.length - 1].createdAt;
          return {
            ...data,
            conversation: { ...data.conversation, adminMessages: messages },
          };
        });
      } else {
        lastDetailAt.current = incoming.length
          ? incoming[incoming.length - 1].createdAt
          : null;
        setDetail({
          ...data,
          conversation: {
            ...data.conversation,
            adminMessages: incoming.map((message) => ({
              ...message,
              isRead: readById.get(message.id) ?? message.isRead,
            })),
          },
        });
        setTimeout(() => scrollToBottom(false), 100);
      }
    } catch (error) {
      console.error("Could not refresh the selected conversation", error);
    }
  }, []);

  useEffect(() => {
    const initialLoad = window.setTimeout(() => void load(), 0);
    const poll = window.setInterval(() => {
      if (!document.hidden) void load();
    }, 3000);
    const key = process.env.NEXT_PUBLIC_PUSHER_KEY;
    const pusher = key
      ? new Pusher(key, {
          cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER || "mt1",
          authEndpoint: "/api/pusher/auth",
        })
      : null;
    const channel = pusher?.subscribe("private-admin");
    channel?.bind("conversation:new", load);
    return () => {
      window.clearTimeout(initialLoad);
      window.clearInterval(poll);
      pusher?.unsubscribe("private-admin");
      pusher?.disconnect();
    };
  }, [load]);

  useEffect(() => {
    const heartbeat = () => {
      void fetch("/api/auth/heartbeat", { method: "POST" }).then((response) => {
        if (response.status === 401) window.location.href = "/login";
      }).catch((error) => console.error("Could not update admin presence", error));
    };
    heartbeat();
    const interval = window.setInterval(heartbeat, 30000);
    const onVisibilityChange = () => {
      if (!document.hidden) heartbeat();
    };
    document.addEventListener("visibilitychange", onVisibilityChange);
    return () => {
      window.clearInterval(interval);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, []);

  useEffect(() => {
    if (!selected) return;
    const poll = window.setInterval(() => {
      if (!document.hidden) void open(selected, true);
    }, 1200);
    const key = process.env.NEXT_PUBLIC_PUSHER_KEY;
    const pusher = key
      ? new Pusher(key, {
          cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER || "mt1",
          authEndpoint: "/api/pusher/auth",
        })
      : null;
    const channel = pusher?.subscribe(`private-conversation-${selected}`);
    channel?.bind("message:new", () => void open(selected, true));
    return () => {
      window.clearInterval(poll);
      pusher?.unsubscribe(`private-conversation-${selected}`);
      pusher?.disconnect();
    };
  }, [selected, open]);

  // Scroll to bottom on new message
  useEffect(() => {
    if (detail?.conversation.adminMessages.length) {
      scrollToBottom(true);
    }
  }, [detail?.conversation.adminMessages.length]);

  function updateReply(value: string) {
    setText(value);
    if (typingTimer.current) window.clearTimeout(typingTimer.current);
    if (!selected) return;
    if (value.trim() && Date.now() - lastTypingSentAt.current > 1000) {
      lastTypingSentAt.current = Date.now();
      void fetch(`/api/conversations/${selected}/typing`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ typing: true }),
      }).catch((error) => console.error("Could not update typing status", error));
    }
    typingTimer.current = window.setTimeout(() => {
      lastTypingSentAt.current = 0;
      void fetch(`/api/conversations/${selected}/typing`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ typing: false }),
      }).catch((error) => console.error("Could not clear typing status", error));
    }, value.trim() ? 1600 : 0);
  }

  async function send() {
    if (!selected || !text.trim() || sending) return;
    const conversationId = selected;
    const outgoing = text.trim();
    const pending: AdminMessage = {
      id: `pending-${Date.now()}`,
      senderRole: "ADMIN",
      text: outgoing,
      createdAt: new Date().toISOString(),
      isRead: false,
    };
    setSending(true);
    setSendError("");
    setText("");
    setDetail((current) =>
      current
        ? {
            ...current,
            conversation: {
              ...current.conversation,
              adminMessages: [...current.conversation.adminMessages, pending],
            },
          }
        : current,
    );
    try {
      const response = await fetch(`/api/conversations/${conversationId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: outgoing }),
      });
      if (!response.ok) {
        const data = await response.json().catch(() => null);
        throw new Error(data?.error || "Message wasn't sent. Please try again.");
      }
      const data = await response.json();
      setDetail((current) => {
        if (!current) return current;
        const byId = new Map(
          current.conversation.adminMessages
            .filter((message) => message.id !== pending.id)
            .map((message) => [message.id, message]),
        );
        byId.set(data.message.id, data.message);
        const messages = [...byId.values()].sort((a, b) =>
          a.createdAt.localeCompare(b.createdAt),
        );
        lastDetailAt.current = messages[messages.length - 1]?.createdAt ?? null;
        return {
          ...current,
          conversation: { ...current.conversation, adminMessages: messages },
        };
      });
      await load();
    } catch (error) {
      setDetail((current) =>
        current
          ? {
              ...current,
              conversation: {
                ...current.conversation,
                adminMessages: current.conversation.adminMessages.filter(
                  (message) => message.id !== pending.id,
                ),
              },
            }
          : current,
      );
      setText(outgoing);
      setSendError(error instanceof Error ? error.message : "Message wasn't sent. Please try again.");
    } finally {
      setSending(false);
      if (typingTimer.current) window.clearTimeout(typingTimer.current);
      lastTypingSentAt.current = 0;
      void fetch(`/api/conversations/${conversationId}/typing`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ typing: false }),
      });
    }
  }

  async function addNote() {
    if (!selected || !note.trim() || addingNote) return;
    setAddingNote(true);
    try {
      const response = await fetch(`/api/admin/conversations/${selected}/notes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ note: note.trim() }),
      });
      if (response.ok) {
        setNote("");
        await open(selected, true);
      }
    } finally {
      setAddingNote(false);
    }
  }

  function startEditNote(n: AdminNote) {
    setEditingNoteId(n.id);
    setEditingNoteText(n.note);
    setConfirmDeleteNoteId(null);
  }

  function cancelEditNote() {
    setEditingNoteId(null);
    setEditingNoteText("");
  }

  async function saveEditNote(noteId: string) {
    if (!selected || !editingNoteText.trim() || savingNoteId) return;
    setSavingNoteId(noteId);
    try {
      const response = await fetch(`/api/admin/conversations/${selected}/notes/${noteId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ note: editingNoteText.trim() }),
      });
      if (response.ok) {
        const data = await response.json();
        setDetail((current) =>
          current
            ? {
                ...current,
                conversation: {
                  ...current.conversation,
                  adminNotes: (current.conversation.adminNotes || []).map((n) =>
                    n.id === noteId
                      ? { ...n, note: data.note.note, updatedAt: data.note.updatedAt }
                      : n,
                  ),
                },
              }
            : current,
        );
        setEditingNoteId(null);
        setEditingNoteText("");
      }
    } finally {
      setSavingNoteId(null);
    }
  }

  async function deleteNote(noteId: string) {
    if (!selected || deletingNoteId) return;
    setDeletingNoteId(noteId);
    try {
      const response = await fetch(`/api/admin/conversations/${selected}/notes/${noteId}`, {
        method: "DELETE",
      });
      if (response.ok) {
        setDetail((current) =>
          current
            ? {
                ...current,
                conversation: {
                  ...current.conversation,
                  adminNotes: (current.conversation.adminNotes || []).filter((n) => n.id !== noteId),
                },
              }
            : current,
        );
        setConfirmDeleteNoteId(null);
      }
    } finally {
      setDeletingNoteId(null);
    }
  }

  async function update(data: Record<string, string>) {
    if (!selected) return;
    setUpdatingFlag(true);
    try {
      await fetch(`/api/admin/conversations/${selected}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      await open(selected, true);
      await load();
    } finally {
      setUpdatingFlag(false);
    }
  }

  async function forceLogoutAndClearChat() {
    if (!selected || !detail || forcingLogout) return;
    const conversationId = selected;
    const username = detail.conversation.user.username;
    if (
      !window.confirm(
        `Log out @${username} on all devices and clear their chat? This removes messages from the user's view; admin history is retained.`,
      )
    ) {
      return;
    }

    setForcingLogout(true);
    setForceLogoutError("");
    setForceLogoutSuccess("");
    try {
      const response = await fetch(
        `/api/admin/conversations/${conversationId}/force-logout`,
        { method: "POST" },
      );
      const data = await response.json().catch(() => null);
      if (!response.ok) throw new Error(data?.error || "Could not log out the user.");
      setDetail((current) =>
        current
          ? {
              ...current,
              conversation: {
                ...current.conversation,
                userIsTyping: false,
                userTypingUntil: null,
              },
            }
          : current,
      );
      setForceLogoutSuccess("User logged out and their chat was cleared. Admin history is retained.");
      await load();
    } catch (error) {
      setForceLogoutError(error instanceof Error ? error.message : "Could not log out the user.");
    } finally {
      setForcingLogout(false);
    }
  }

  async function deleteConversation() {
    if (!selected || !detail || deletingConversation) return;
    const conversationId = selected;
    const username = detail.conversation.user.username;
    if (
      !window.confirm(
        `Permanently delete @${username}'s conversation, all messages, and private notes? Their active sessions will be signed out. This cannot be undone.`,
      )
    ) {
      return;
    }

    setDeletingConversation(true);
    setDeleteConversationError("");
    try {
      const response = await fetch(`/api/admin/conversations/${conversationId}`, {
        method: "DELETE",
      });
      const data = await response.json().catch(() => null);
      if (!response.ok) {
        throw new Error(data?.error || "Could not delete the conversation.");
      }

      setSelected(null);
      setDetail(null);
      setText("");
      setNote("");
      lastDetailAt.current = null;
      await load();
    } catch (error) {
      setDeleteConversationError(
        error instanceof Error ? error.message : "Could not delete the conversation.",
      );
    } finally {
      setDeletingConversation(false);
    }
  }

  async function resetUserPassword(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!detail || resettingPassword) return;
    setResettingPassword(true);
    setPasswordResetError("");
    setPasswordResetSuccess("");
    try {
      const response = await fetch(
        `/api/admin/users/${detail.conversation.user.id}/password`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ password: newPassword }),
        },
      );
      const data = await response.json().catch(() => null);
      if (!response.ok) throw new Error(data?.error || "Could not reset the password.");
      setNewPassword("");
      setPasswordResetSuccess("Password reset. The user’s existing sessions have been signed out.");
    } catch (error) {
      setPasswordResetError(error instanceof Error ? error.message : "Could not reset the password.");
    } finally {
      setResettingPassword(false);
    }
  }

  function closePasswordReset() {
    if (resettingPassword) return;
    setShowPasswordReset(false);
    setNewPassword("");
    setPasswordResetError("");
    setPasswordResetSuccess("");
  }

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/login";
  }

  async function toggleSessionTimeout() {
    if (sessionTimeoutEnabled === null || updatingSessionTimeout) return;
    setUpdatingSessionTimeout(true);
    setSessionTimeoutError("");
    try {
      const response = await fetch("/api/admin/settings/session-timeout", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ enabled: !sessionTimeoutEnabled }),
      });
      const data = await response.json().catch(() => null);
      if (!response.ok) {
        throw new Error(data?.error || "Could not update the session timer setting.");
      }
      setSessionTimeoutEnabled(data.enabled);
      await load();
      if (selected) await open(selected, true);
    } catch (error) {
      setSessionTimeoutError(
        error instanceof Error ? error.message : "Could not update the session timer setting.",
      );
    } finally {
      setUpdatingSessionTimeout(false);
    }
  }

  // Filtered list
  const filtered = items.filter((item) => {
    const matchesSearch = `${item.user.username} ${item.lastMessage || ""}`
      .toLowerCase()
      .includes(search.toLowerCase());
    if (!matchesSearch) return false;

    if (filter === "UNREAD") return item.adminUnreadCount > 0;
    if (filter === "AWAITING") return item.lastMessageSender === "USER";
    if (filter === "ACTIVE") return item.status === "OPEN";
    if (filter === "RESOLVED") return item.status === "RESOLVED";
    return true;
  });

  const userIsTyping = Boolean(detail?.conversation.userIsTyping);

  return (
    <main className="flex h-[100dvh] w-screen flex-col overflow-hidden bg-[#0B141A] text-[#E9EDEF]">
      {/* Top Console Navigation Bar */}
      <header className="flex h-14 shrink-0 items-center justify-between gap-2 border-b border-[#222E35] bg-[#111B21] px-3 sm:h-15 sm:px-4 md:px-6">
        <div className="flex min-w-0 items-center gap-2 sm:gap-3">
          <div className="grid size-9 place-items-center rounded-xl bg-[#00A884] text-[#0B141A] shadow-[0_2px_10px_rgba(0,168,132,0.35)]">
            <MessageCircle size={19} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="truncate text-sm font-bold text-[#E9EDEF] sm:text-base">ReachOut Admin Console</h1>
              <span className="hidden items-center gap-1 rounded-full bg-[#00A884]/20 px-2 py-0.5 text-[10px] font-semibold text-[#00A884] sm:flex">
                <span className="size-1.5 rounded-full bg-[#00A884] animate-pulse" />
                Live
              </span>
            </div>
          </div>
        </div>

        {/* Compact Quick Stats Strip in Header */}
        <div className="hidden lg:flex items-center gap-2">
          <button
            onClick={() => setFilter("ALL")}
            className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-medium transition ${
              filter === "ALL"
                ? "bg-[#202C33] text-[#00A884] border border-[#00A884]/30"
                : "text-[#8696A0] hover:text-[#E9EDEF]"
            }`}
          >
            <Users size={13} className="text-[#00A884]" />
            <span>{totals.users} Users</span>
          </button>
          <button
            onClick={() => setFilter("UNREAD")}
            className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-medium transition ${
              filter === "UNREAD"
                ? "bg-[#202C33] text-[#00A884] border border-[#00A884]/30"
                : "text-[#8696A0] hover:text-[#E9EDEF]"
            }`}
          >
            <MessageSquare size={13} className="text-[#00A884]" />
            <span>{totals.unread} Unread</span>
          </button>
          <button
            onClick={() => setFilter("AWAITING")}
            className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-medium transition ${
              filter === "AWAITING"
                ? "bg-[#202C33] text-[#00A884] border border-[#00A884]/30"
                : "text-[#8696A0] hover:text-[#E9EDEF]"
            }`}
          >
            <Clock size={13} className="text-[#FFD279]" />
            <span>{totals.awaiting} Awaiting</span>
          </button>
          <button
            onClick={() => setFilter("ACTIVE")}
            className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-medium transition ${
              filter === "ACTIVE"
                ? "bg-[#202C33] text-[#00A884] border border-[#00A884]/30"
                : "text-[#8696A0] hover:text-[#E9EDEF]"
            }`}
          >
            <CheckCircle2 size={13} className="text-[#00A884]" />
            <span>{totals.active} Active</span>
          </button>
        </div>

        <div className="flex shrink-0 items-center gap-1 sm:gap-2">
          <button
            onClick={() => void load()}
            title="Refresh conversations"
            className="grid size-8 place-items-center rounded-lg text-[#8696A0] transition hover:bg-[#202C33] hover:text-[#E9EDEF]"
          >
            <RefreshCw size={15} />
          </button>
          <button
            onClick={logout}
            className="rounded-lg border border-[#2A3942] bg-[#202C33] px-3 py-1.5 text-xs font-semibold text-[#8696A0] transition hover:border-[#00A884]/40 hover:text-[#E9EDEF]"
          >
            Sign out
          </button>
        </div>
      </header>

      {/* Main Workspace: 3-column architecture (List, Chat, Details/Notes) */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar: Conversations Inbox */}
        <aside
          className={`flex w-full flex-col border-r border-[#222E35] bg-[#111B21] transition-all md:w-80 lg:w-[360px] shrink-0 ${
            selected ? "hidden md:flex" : "flex"
          }`}
        >
          <div className="flex items-center justify-between gap-3 border-b border-[#222E35] px-3 py-2.5">
            <div className="min-w-0">
              <p className="text-xs font-semibold text-[#E9EDEF]">10-minute user timer</p>
              <p className="mt-0.5 text-[10px] text-[#8696A0]">
                {sessionTimeoutEnabled === true
                  ? "Users sign out 10 minutes after activation."
                  : sessionTimeoutEnabled === false
                    ? "Off by default. User sessions do not time out."
                    : "Loading timer setting…"}
              </p>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={sessionTimeoutEnabled === true}
              aria-label="10-minute user session timer"
              onClick={() => void toggleSessionTimeout()}
              disabled={sessionTimeoutEnabled === null || updatingSessionTimeout}
              className={`relative h-7 w-14 shrink-0 rounded-full border transition disabled:cursor-wait disabled:opacity-60 ${
                sessionTimeoutEnabled
                  ? "border-[#00A884] bg-[#005C4B]"
                  : "border-[#2A3942] bg-[#202C33]"
              }`}
            >
              <span
                className={`absolute top-0.5 grid size-5 place-items-center rounded-full text-[9px] font-bold transition-all ${
                  sessionTimeoutEnabled
                    ? "left-[30px] bg-[#00A884] text-[#0B141A]"
                    : "left-0.5 bg-[#8696A0] text-[#0B141A]"
                }`}
              >
                {updatingSessionTimeout ? <LoaderCircle size={12} className="animate-spin" /> : null}
              </span>
            </button>
          </div>
          {sessionTimeoutError && (
            <p role="alert" className="border-b border-[#222E35] px-3 py-2 text-[11px] text-[#FF8A8A]">
              {sessionTimeoutError}
            </p>
          )}
          {/* Search Bar */}
          <div className="p-3 border-b border-[#222E35]">
            <div className="flex items-center gap-2 rounded-xl border border-[#2A3942] bg-[#202C33] px-3 py-2 text-sm">
              <Search size={16} className="text-[#8696A0] shrink-0" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by user or text..."
                className="w-full bg-transparent text-sm text-[#E9EDEF] placeholder:text-[#8696A0] outline-none"
              />
              {search && (
                <button onClick={() => setSearch("")} className="text-[#8696A0] hover:text-[#E9EDEF]">
                  <X size={14} />
                </button>
              )}
            </div>

            {/* Filter Pills */}
            <div className="mt-2.5 flex items-center gap-1 overflow-x-auto pb-1 text-[11px]">
              {(
                [
                  ["ALL", "All"],
                  ["UNREAD", "Unread"],
                  ["AWAITING", "Awaiting"],
                  ["ACTIVE", "Active"],
                  ["RESOLVED", "Resolved"],
                ] as const
              ).map(([fKey, label]) => (
                <button
                  key={fKey}
                  onClick={() => setFilter(fKey)}
                  className={`rounded-full px-2.5 py-1 font-medium transition whitespace-nowrap ${
                    filter === fKey
                      ? "bg-[#00A884] text-[#0B141A] font-semibold"
                      : "bg-[#202C33] text-[#8696A0] hover:text-[#E9EDEF] hover:bg-[#2A3942]"
                  }`}
                >
                  {label}
                  {fKey === "UNREAD" && totals.unread > 0 && (
                    <span className="ml-1.5 rounded-full bg-[#0B141A] px-1.5 py-0.2 text-[9px] font-bold text-[#00A884]">
                      {totals.unread}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Conversations Scrollable List */}
          <div className="flex-1 overflow-y-auto divide-y divide-[#222E35]/60">
            {filtered.length === 0 ? (
              <div className="p-8 text-center text-xs text-[#8696A0]">
                <Inbox size={28} className="mx-auto mb-2 text-[#667781]" />
                No conversations match current filter
              </div>
            ) : (
              filtered.map((item) => {
                const isSelected = selected === item.id;
                const isTyping = Boolean(item.userIsTyping);
                const isUrgent = item.safetyFlag === "URGENT_SAFETY_CONCERN";
                const needsAttention = item.safetyFlag === "NEEDS_ATTENTION";

                return (
                  <button
                    key={item.id}
                    onClick={() => void open(item.id)}
                    className={`group relative flex w-full items-start gap-3 p-3.5 text-left transition ${
                      isSelected
                        ? "bg-[#202C33] border-l-4 border-l-[#00A884]"
                        : "hover:bg-[#202C33]/60"
                    }`}
                  >
                    {/* User Avatar */}
                    <div className="relative shrink-0">
                      <div className="grid size-11 place-items-center rounded-full bg-[#2A3942] text-[#00A884] font-bold shadow-sm group-hover:scale-105 transition">
                        {item.user.username.slice(0, 2).toUpperCase()}
                      </div>
                      {isTyping && (
                        <span className="absolute bottom-0 right-0 size-3 rounded-full border-2 border-[#111B21] bg-[#25D366] animate-pulse" />
                      )}
                    </div>

                    {/* Details Column */}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-1">
                        <div className="flex items-center gap-1.5 min-w-0">
                          <span className="truncate text-sm font-semibold text-[#E9EDEF]">
                            @{item.user.username}
                          </span>
                          {isUrgent && (
                            <span className="shrink-0 rounded px-1.5 py-0.5 text-[9px] font-bold bg-[#4A1E22] text-[#FF8A8A]">
                              URGENT
                            </span>
                          )}
                          {needsAttention && (
                            <span className="shrink-0 rounded px-1.5 py-0.5 text-[9px] font-bold bg-[#3F2E14] text-[#FFD279]">
                              ATTENTION
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] text-[#8696A0] shrink-0">
                          {formatRelative(item.lastMessageAt)}
                        </span>
                      </div>

                      {/* Snippet */}
                      <p className="mt-1 flex items-center justify-between gap-2 text-xs">
                        <span
                          className={`truncate ${
                            isTyping
                              ? "text-[#25D366] font-medium"
                              : item.adminUnreadCount > 0
                              ? "text-[#E9EDEF] font-medium"
                              : "text-[#8696A0]"
                          }`}
                        >
                          {isTyping ? (
                            "user is typing..."
                          ) : item.lastMessage ? (
                            <>
                              {item.lastMessageSender === "ADMIN" && (
                                <span className="text-[#8696A0] mr-1">You:</span>
                              )}
                              {item.lastMessage}
                            </>
                          ) : (
                            <span className="italic text-[#667781]">New session opened</span>
                          )}
                        </span>

                        {/* Unread Counter Badge */}
                        {item.adminUnreadCount > 0 && (
                          <span className="grid size-5 shrink-0 place-items-center rounded-full bg-[#00A884] text-[10px] font-bold text-[#0B141A] shadow-sm">
                            {item.adminUnreadCount}
                          </span>
                        )}
                      </p>

                      {/* Status row */}
                      <div className="mt-1.5 flex items-center gap-2 text-[10px] text-[#667781]">
                        <span className="capitalize">{item.status.toLowerCase()}</span>
                        <span>·</span>
                        <span>{item.safetyFlag.replaceAll("_", " ").toLowerCase()}</span>
                        <span className="truncate text-[#FFD279]">
                          {formatUserSessionTime(
                            item.userSessionExpiresAt,
                            sessionClock,
                            sessionTimeoutEnabled,
                          )}
                        </span>
                      </div>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </aside>

        {/* Center Panel: Active Chat Thread */}
        <section
          className={`flex flex-1 flex-col overflow-hidden bg-[#0B141A] ${
            !selected ? "hidden md:flex" : "flex"
          }`}
        >
          {detail ? (
            <>
              {/* Active Conversation Top Bar */}
              <div className="flex min-h-16 shrink-0 flex-wrap items-center justify-between gap-2 border-b border-[#222E35] bg-[#111B21] px-3 py-2 sm:px-4 md:flex-nowrap md:px-5">
                <div className="flex min-w-0 flex-1 items-center gap-2 sm:gap-3 md:flex-initial">
                  <button
                    onClick={() => setSelected(null)}
                    className="grid size-8 place-items-center rounded-lg text-[#8696A0] hover:text-[#E9EDEF] md:hidden"
                  >
                    <ArrowLeft size={18} />
                  </button>
                  <div className="grid size-10 shrink-0 place-items-center rounded-full bg-[#00A884]/20 text-[#00A884] font-bold">
                    {detail.conversation.user.username.slice(0, 2).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h2 className="truncate text-sm font-bold text-[#E9EDEF]">
                        @{detail.conversation.user.username}
                      </h2>
                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                          detail.conversation.status === "OPEN"
                            ? "bg-[#005C4B]/60 text-[#25D366]"
                            : "bg-[#202C33] text-[#8696A0]"
                        }`}
                      >
                        {detail.conversation.status}
                      </span>
                    </div>
                    <p className="text-xs text-[#8696A0]">
                      {detail.conversation.user.email || "No email provided"}
                    </p>
                    <p className="text-xs text-[#8696A0]">
                      {userIsTyping ? (
                        <span className="text-[#25D366] font-medium flex items-center gap-1">
                          user is typing
                          <span className="animate-bounce">.</span>
                          <span className="animate-bounce [animation-delay:150ms]">.</span>
                          <span className="animate-bounce [animation-delay:300ms]">.</span>
                        </span>
                      ) : (
                        "Confidential User Session"
                      )}
                    </p>
                    <p className="text-[11px] text-[#FFD279]">
                      {formatUserSessionTime(
                        detail.conversation.userSessionExpiresAt,
                        sessionClock,
                        sessionTimeoutEnabled,
                      )}
                    </p>
                  </div>
                </div>

                {/* Right Actions: Safety Flag Dropdown, Resolve Toggle, Notes Toggle */}
                <div className="flex w-full flex-wrap items-center justify-end gap-1 md:w-auto md:flex-nowrap md:gap-2">
                  {/* Safety Flag Selector */}
                  <div className="relative">
                    <select
                      value={detail.conversation.safetyFlag}
                      disabled={updatingFlag}
                      onChange={(e) => void update({ safetyFlag: e.target.value })}
                      className={`max-w-[155px] cursor-pointer rounded-lg border px-2 py-1.5 text-[11px] font-semibold outline-none transition sm:max-w-none sm:px-2.5 sm:text-xs ${
                        detail.conversation.safetyFlag === "URGENT_SAFETY_CONCERN"
                          ? "border-[#5C2329] bg-[#3B1E22] text-[#FF8A8A]"
                          : detail.conversation.safetyFlag === "NEEDS_ATTENTION"
                          ? "border-[#533814] bg-[#2E200D] text-[#FFD279]"
                          : "border-[#2A3942] bg-[#202C33] text-[#00A884]"
                      }`}
                    >
                      <option value="NORMAL">Normal Priority</option>
                      <option value="NEEDS_ATTENTION">Needs Attention</option>
                      <option value="URGENT_SAFETY_CONCERN">Urgent Safety Concern</option>
                    </select>
                  </div>

                  {/* Resolve / Reopen Button */}
                  <button
                    onClick={() =>
                      void update({
                        status: detail.conversation.status === "OPEN" ? "RESOLVED" : "OPEN",
                      })
                    }
                    className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold transition ${
                      detail.conversation.status !== "OPEN"
                        ? "border-[#00A884]/40 bg-[#005C4B] text-[#E9EDEF] hover:bg-[#02906f]"
                        : "border-[#2A3942] bg-[#202C33] text-[#E9EDEF] hover:bg-[#2A3942]"
                    }`}
                  >
                    {detail.conversation.status === "ARCHIVED" ? (
                      <ArchiveRestore size={14} />
                    ) : (
                      <Check size={14} />
                    )}
                    <span>
                      {detail.conversation.status === "ARCHIVED"
                        ? "Unarchive"
                        : detail.conversation.status === "RESOLVED"
                          ? "Reopen"
                          : "Resolve"}
                    </span>
                  </button>

                  {/* Archive Button */}
                  <button
                    onClick={() => void update({ status: "ARCHIVED" })}
                    title="Archive conversation"
                    aria-label="Archive conversation"
                    className="grid size-8 place-items-center rounded-lg border border-[#2A3942] bg-[#202C33] text-[#8696A0] transition hover:bg-[#2A3942] hover:text-[#E9EDEF]"
                  >
                    <Archive size={14} />
                  </button>

                  <button
                    onClick={() => void forceLogoutAndClearChat()}
                    disabled={forcingLogout}
                    title="Log user out and clear their chat"
                    aria-label="Log user out and clear their chat"
                    className="grid size-8 place-items-center rounded-lg border border-[#533814] bg-[#2E200D] text-[#FFD279] transition hover:bg-[#3F2E14] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {forcingLogout ? (
                      <LoaderCircle size={14} className="animate-spin" />
                    ) : (
                      <LogOut size={14} />
                    )}
                  </button>

                  <button
                    onClick={() => void deleteConversation()}
                    disabled={deletingConversation}
                    title="Permanently delete conversation"
                    aria-label="Permanently delete conversation"
                    className="grid size-8 place-items-center rounded-lg border border-[#5C2329] bg-[#3B1E22] text-[#FF8A8A] transition hover:bg-[#51252B] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {deletingConversation ? (
                      <LoaderCircle size={14} className="animate-spin" />
                    ) : (
                      <Trash2 size={14} />
                    )}
                  </button>

                  <button
                    onClick={() => {
                      setPasswordResetError("");
                      setPasswordResetSuccess("");
                      setShowPasswordReset(true);
                    }}
                    title="Reset user password"
                    aria-label="Reset user password"
                    className="grid size-8 place-items-center rounded-lg border border-[#2A3942] bg-[#202C33] text-[#8696A0] transition hover:bg-[#2A3942] hover:text-[#E9EDEF]"
                  >
                    <KeyRound size={14} />
                  </button>

                  {/* Toggle Notes/Details Panel */}
                  <button
                    onClick={() => setShowNotesPanel(!showNotesPanel)}
                    title="Toggle notes & details"
                    className={`grid size-8 place-items-center rounded-lg border transition ${
                      showNotesPanel
                        ? "border-[#00A884]/50 bg-[#00A884]/20 text-[#00A884]"
                        : "border-[#2A3942] bg-[#202C33] text-[#8696A0] hover:text-[#E9EDEF]"
                    }`}
                  >
                    <Info size={15} />
                  </button>
                </div>
              </div>

              {/* Chat Message Scrollable Container */}
              <div
                className="relative flex-1 overflow-y-auto px-4 py-5 md:px-8"
                style={{
                  backgroundColor: "#0B141A",
                  backgroundImage:
                    "radial-gradient(circle at 25% 25%, rgba(0,168,132,.06) 0 1px, transparent 1.5px), radial-gradient(circle at 75% 75%, rgba(0,168,132,.04) 0 1px, transparent 1.5px)",
                  backgroundSize: "28px 28px",
                }}
              >
                {deleteConversationError && (
                  <p
                    role="alert"
                    className="mx-auto mb-3 w-fit rounded-lg bg-[#3B1E22] px-3 py-2 text-xs text-[#FF8A8A]"
                  >
                    {deleteConversationError}
                  </p>
                )}
                {forceLogoutError && (
                  <p role="alert" className="mx-auto mb-3 w-fit rounded-lg bg-[#3B1E22] px-3 py-2 text-xs text-[#FF8A8A]">
                    {forceLogoutError}
                  </p>
                )}
                {forceLogoutSuccess && (
                  <p role="status" className="mx-auto mb-3 w-fit rounded-lg bg-[#005C4B] px-3 py-2 text-xs text-[#25D366]">
                    {forceLogoutSuccess}
                  </p>
                )}
                {/* Session Security Banner */}
                <div className="mx-auto mb-4 w-fit max-w-[85%] rounded-lg bg-[#182229] px-3.5 py-1.5 text-center text-[11px] leading-relaxed text-[#FFD279] shadow-sm">
                  <Lock size={11} className="mr-1.5 inline" />
                  User-facing messages clear when the user signs out; admin history is retained.
                </div>

                {/* Messages List */}
                <div className="mx-auto max-w-3xl space-y-3">
                  {detail.conversation.adminMessages.map((message, index) => {
                    const previous = index > 0 ? detail.conversation.adminMessages[index - 1] : null;
                    const showDate =
                      !previous ||
                      new Date(previous.createdAt).toDateString() !==
                        new Date(message.createdAt).toDateString();

                    return (
                      <div key={message.id}>
                        {showDate && (
                          <div className="flex justify-center my-3">
                            <span className="rounded-md bg-[#182229] px-3 py-1 text-[11px] text-[#8696A0] shadow-sm">
                              {dateLabel(message.createdAt)}
                            </span>
                          </div>
                        )}
                        <div
                          className={`flex ${
                            message.senderRole === "ADMIN" ? "justify-end" : "justify-start"
                          } animate-[fadeIn_.18s_ease-out]`}
                        >
                          <div
                            className={`relative max-w-[82%] rounded-2xl px-4 py-2.5 shadow-[0_1px_2px_rgba(11,20,26,.15)] ${
                              message.senderRole === "ADMIN"
                                ? "rounded-tr-sm bg-[#005C4B] text-[#E9EDEF]"
                                : "rounded-tl-sm bg-[#202C33] text-[#E9EDEF]"
                            }`}
                          >
                            <p className="pr-12 text-[14.5px] leading-relaxed whitespace-pre-wrap break-words">
                              {message.text}
                            </p>
                            <span className="mt-1 flex items-center justify-end gap-1 text-[10px] text-[#8696A0]">
                              {message.id.startsWith("pending-")
                                ? "Sending..."
                                : formatTime(message.createdAt)}
                              {message.senderRole === "ADMIN" && !message.id.startsWith("pending-") && (
                                <CheckCheck
                                  size={13}
                                  className={message.isRead ? "text-[#53BDEB]" : "text-[#8696A0]"}
                                />
                              )}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  {userIsTyping && (
                    <div className="flex justify-start">
                      <div className="rounded-2xl rounded-tl-sm bg-[#202C33] px-4 py-2.5 text-xs text-[#8696A0] shadow-sm">
                        User is typing...
                      </div>
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </div>
              </div>

              {/* Message Composer Footer */}
              <div className="border-t border-[#222E35] bg-[#111B21] p-3 md:p-4">
                {sendError && (
                  <p role="alert" className="mx-auto mb-2 max-w-3xl text-xs text-[#FF8A80]">
                    {sendError}
                  </p>
                )}

                {/* Quick Canned Replies Carousel */}
                <div className="mx-auto mb-2.5 flex max-w-3xl items-center gap-1.5 overflow-x-auto pb-1 text-xs">
                  <span className="flex items-center gap-1 text-[#8696A0] text-[11px] shrink-0 mr-1">
                    <Sparkles size={12} className="text-[#00A884]" /> Quick:
                  </span>
                  {QUICK_REPLIES.map((reply) => (
                    <button
                      key={reply}
                      onClick={() => setText(reply)}
                      className="rounded-full border border-[#2A3942] bg-[#202C33] px-3 py-1 text-[11px] text-[#8696A0] hover:border-[#00A884]/40 hover:text-[#E9EDEF] whitespace-nowrap transition"
                    >
                      {reply}
                    </button>
                  ))}
                </div>

                {/* Chat Composer Input */}
                <div className="mx-auto flex max-w-3xl items-end gap-2">
                  <textarea
                    value={text}
                    onChange={(e) => updateReply(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        void send();
                      }
                    }}
                    rows={1}
                    maxLength={5000}
                    placeholder="Type your reply (Enter to send, Shift+Enter for new line)..."
                    className="max-h-32 min-h-12 flex-1 resize-none rounded-2xl border border-[#2A3942] bg-[#202C33] px-4 py-3 text-sm text-[#E9EDEF] placeholder:text-[#8696A0] outline-none transition focus:border-[#00A884] focus:ring-1 focus:ring-[#00A884]"
                  />
                  <button
                    onClick={() => void send()}
                    disabled={!text.trim() || sending}
                    aria-label="Send reply"
                    className="grid size-12 shrink-0 place-items-center rounded-2xl bg-[#00A884] text-[#0B141A] shadow-[0_2px_12px_rgba(0,168,132,0.35)] transition duration-150 active:scale-95 hover:bg-[#02906f] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {sending ? (
                      <LoaderCircle size={20} className="animate-spin" />
                    ) : (
                      <Send size={19} />
                    )}
                  </button>
                </div>
              </div>
            </>
          ) : (
            /* Empty State when no conversation selected */
            <div className="flex flex-1 flex-col items-center justify-center p-8 text-center bg-[#0B141A]">
              <div className="grid size-20 place-items-center rounded-3xl border border-[#222E35] bg-[#111B21] text-[#00A884] shadow-xl">
                <MessageCircle size={40} />
              </div>
              <h2 className="mt-5 text-xl font-bold text-[#E9EDEF]">ReachOut Admin Inbox</h2>
              <p className="mt-2 max-w-md text-sm text-[#8696A0]">
                Select a user session from the left column to read messages, provide supportive guidance, or manage safety flags.
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-3 text-xs text-[#8696A0]">
                <span className="flex items-center gap-1.5 rounded-lg border border-[#222E35] bg-[#111B21] px-3 py-1.5">
                  <Shield size={14} className="text-[#00A884]" />
                  Encrypted Sessions
                </span>
                <span className="flex items-center gap-1.5 rounded-lg border border-[#222E35] bg-[#111B21] px-3 py-1.5">
                  <Clock size={14} className="text-[#00A884]" />
                  Realtime Sync Active
                </span>
              </div>
            </div>
          )}
        </section>

        {/* Right Panel: Conversation Details & Private Admin Notes */}
        {detail && showNotesPanel && (
          <aside className="hidden xl:flex w-80 shrink-0 flex-col border-l border-[#222E35] bg-[#111B21] overflow-hidden">
            {/* Header */}
            <div className="flex h-16 shrink-0 items-center justify-between border-b border-[#222E35] px-4">
              <h3 className="font-bold text-sm text-[#E9EDEF]">Session Information</h3>
              <button
                onClick={() => setShowNotesPanel(false)}
                className="grid size-7 place-items-center rounded-lg text-[#8696A0] hover:bg-[#202C33] hover:text-[#E9EDEF]"
              >
                <X size={15} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-5">
              {/* User Profile Card */}
              <div className="rounded-2xl border border-[#222E35] bg-[#202C33] p-4">
                <div className="flex items-center gap-3">
                  <div className="grid size-12 place-items-center rounded-xl bg-[#00A884]/20 text-[#00A884] font-bold">
                    <User size={22} />
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-bold text-sm text-[#E9EDEF] truncate">
                      @{detail.conversation.user.username}
                    </h4>
                    <p className="text-xs text-[#8696A0] truncate">
                      {detail.conversation.user.email || "No email provided (anonymous)"}
                    </p>
                  </div>
                </div>

                <div className="mt-4 space-y-2 border-t border-[#2A3942] pt-3 text-xs">
                  <div className="flex justify-between text-[#8696A0]">
                    <span>Session Status:</span>
                    <span className="font-medium text-[#E9EDEF] capitalize">
                      {detail.conversation.status.toLowerCase()}
                    </span>
                  </div>
                  <div className="flex justify-between text-[#8696A0]">
                    <span>Safety Level:</span>
                    <span
                      className={`font-semibold ${
                        detail.conversation.safetyFlag === "URGENT_SAFETY_CONCERN"
                          ? "text-[#FF8A8A]"
                          : detail.conversation.safetyFlag === "NEEDS_ATTENTION"
                          ? "text-[#FFD279]"
                          : "text-[#00A884]"
                      }`}
                    >
                      {detail.conversation.safetyFlag.replaceAll("_", " ")}
                    </span>
                  </div>
                  <div className="flex justify-between text-[#8696A0]">
                    <span>Messages Count:</span>
                    <span className="font-medium text-[#E9EDEF]">
                      {detail.conversation.adminMessages.length}
                    </span>
                  </div>
                </div>
              </div>

              {/* Private Admin Notes Section */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#8696A0]">
                    Private Admin Notes
                  </h4>
                  <span className="rounded-full bg-[#202C33] px-2 py-0.5 text-[10px] text-[#8696A0]">
                    {detail.conversation.adminNotes?.length || 0}
                  </span>
                </div>

                {/* Add Note Form */}
                <div className="rounded-2xl border border-[#222E35] bg-[#202C33] p-3">
                  <textarea
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    rows={2}
                    placeholder="Add an internal observation or clinical note..."
                    className="w-full resize-none rounded-xl border border-[#2A3942] bg-[#111B21] p-2.5 text-xs text-[#E9EDEF] placeholder:text-[#8696A0] outline-none focus:border-[#00A884]"
                  />
                  <div className="mt-2 flex justify-end">
                    <button
                      onClick={() => void addNote()}
                      disabled={!note.trim() || addingNote}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-[#00A884] px-3 py-1.5 text-xs font-semibold text-[#0B141A] transition hover:bg-[#02906f] disabled:opacity-50"
                    >
                      {addingNote ? (
                        <LoaderCircle size={13} className="animate-spin" />
                      ) : (
                        <Plus size={14} />
                      )}
                      <span>Add Note</span>
                    </button>
                  </div>
                </div>

                {/* Saved Notes List */}
                <div className="space-y-2.5">
                  {!detail.conversation.adminNotes?.length ? (
                    <p className="p-3 text-center text-xs text-[#667781] italic">
                      No private notes recorded yet for this session.
                    </p>
                  ) : (
                    detail.conversation.adminNotes.map((n) => {
                      const isEditing = editingNoteId === n.id;
                      const isConfirmingDelete = confirmDeleteNoteId === n.id;
                      const isSaving = savingNoteId === n.id;
                      const isDeleting = deletingNoteId === n.id;

                      return (
                        <div
                          key={n.id}
                          className="group relative rounded-xl border border-[#2A3942] bg-[#202C33] p-3 text-xs transition hover:border-[#00A884]/30"
                        >
                          {isEditing ? (
                            /* Inline Edit Mode */
                            <div className="space-y-2">
                              <textarea
                                value={editingNoteText}
                                onChange={(e) => setEditingNoteText(e.target.value)}
                                rows={3}
                                autoFocus
                                className="w-full resize-none rounded-lg border border-[#00A884] bg-[#111B21] p-2 text-xs text-[#E9EDEF] outline-none"
                              />
                              <div className="flex items-center justify-end gap-2">
                                <button
                                  type="button"
                                  onClick={cancelEditNote}
                                  disabled={isSaving}
                                  className="rounded px-2.5 py-1 text-[11px] text-[#8696A0] hover:text-[#E9EDEF] transition disabled:opacity-50"
                                >
                                  Cancel
                                </button>
                                <button
                                  type="button"
                                  onClick={() => void saveEditNote(n.id)}
                                  disabled={isSaving || !editingNoteText.trim()}
                                  className="inline-flex items-center gap-1 rounded bg-[#00A884] px-2.5 py-1 text-[11px] font-semibold text-[#0B141A] transition hover:bg-[#02906f] disabled:opacity-50"
                                >
                                  {isSaving && <LoaderCircle size={11} className="animate-spin" />}
                                  <span>Save</span>
                                </button>
                              </div>
                            </div>
                          ) : isConfirmingDelete ? (
                            /* Delete Confirmation Prompt */
                            <div className="space-y-2">
                              <p className="font-medium text-[#FF8A8A]">Delete this note?</p>
                              <div className="flex items-center justify-end gap-2">
                                <button
                                  type="button"
                                  onClick={() => setConfirmDeleteNoteId(null)}
                                  disabled={isDeleting}
                                  className="rounded px-2 py-1 text-[11px] text-[#8696A0] hover:text-[#E9EDEF] transition disabled:opacity-50"
                                >
                                  Cancel
                                </button>
                                <button
                                  type="button"
                                  onClick={() => void deleteNote(n.id)}
                                  disabled={isDeleting}
                                  className="inline-flex items-center gap-1 rounded bg-[#E53935] px-2.5 py-1 text-[11px] font-semibold text-white transition hover:bg-[#D32F2F] disabled:opacity-50"
                                >
                                  {isDeleting && <LoaderCircle size={11} className="animate-spin" />}
                                  <span>Delete</span>
                                </button>
                              </div>
                            </div>
                          ) : (
                            /* Normal Note Display with Actions */
                            <>
                              <div className="flex items-center justify-between pb-1 text-[10px] text-[#8696A0]">
                                <span>
                                  {n.createdAt &&
                                    new Date(n.createdAt).toLocaleString([], {
                                      month: "short",
                                      day: "numeric",
                                      hour: "2-digit",
                                      minute: "2-digit",
                                    })}
                                  {n.updatedAt && n.updatedAt !== n.createdAt && (
                                    <span className="ml-1 text-[#667781]">(edited)</span>
                                  )}
                                </span>
                                <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition">
                                  <button
                                    type="button"
                                    onClick={() => startEditNote(n)}
                                    title="Edit note"
                                    aria-label="Edit note"
                                    className="rounded p-1 text-[#8696A0] hover:bg-[#2A3942] hover:text-[#00A884] transition"
                                  >
                                    <Pencil size={12} />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => setConfirmDeleteNoteId(n.id)}
                                    title="Delete note"
                                    aria-label="Delete note"
                                    className="rounded p-1 text-[#8696A0] hover:bg-[#2A3942] hover:text-[#FF8A8A] transition"
                                  >
                                    <Trash2 size={12} />
                                  </button>
                                </div>
                              </div>
                              <p className="mt-1 leading-relaxed text-[#E9EDEF] whitespace-pre-wrap">
                                {n.note}
                              </p>
                            </>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>
          </aside>
        )}
      </div>
      {showPasswordReset && detail && (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-black/70 p-4"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closePasswordReset();
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="password-reset-title"
            className="w-full max-w-md rounded-2xl border border-[#2A3942] bg-[#111B21] p-5 shadow-2xl"
          >
            <div className="mb-4 flex items-center justify-between">
              <h2 id="password-reset-title" className="font-bold text-[#E9EDEF]">
                Reset @{detail.conversation.user.username}&apos;s password
              </h2>
              <button
                type="button"
                onClick={closePasswordReset}
                disabled={resettingPassword}
                aria-label="Close password reset"
                className="grid size-8 place-items-center rounded-lg text-[#8696A0] hover:bg-[#202C33] hover:text-[#E9EDEF] disabled:opacity-50"
              >
                <X size={16} />
              </button>
            </div>
            <p className="mb-4 text-sm leading-relaxed text-[#8696A0]">
              Existing passwords are securely hashed and can’t be viewed. Set a new password below; the user will need it to sign in.
            </p>
            <form onSubmit={resetUserPassword} className="space-y-3">
              <label className="block text-sm font-medium text-[#E9EDEF]">
                New password
                <input
                  type="password"
                  autoComplete="new-password"
                  minLength={10}
                  maxLength={128}
                  required
                  value={newPassword}
                  onChange={(event) => setNewPassword(event.target.value)}
                  className="mt-2 w-full rounded-xl border border-[#2A3942] bg-[#202C33] px-4 py-3 text-[#E9EDEF] outline-none focus:border-[#00A884]"
                />
              </label>
              {passwordResetError && (
                <p role="alert" className="text-sm text-[#FF8A8A]">
                  {passwordResetError}
                </p>
              )}
              {passwordResetSuccess && (
                <p role="status" className="text-sm text-[#25D366]">
                  {passwordResetSuccess}
                </p>
              )}
              <button
                type="submit"
                disabled={newPassword.length < 10 || resettingPassword}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#00A884] py-3 font-semibold text-[#0B141A] transition hover:bg-[#02906f] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {resettingPassword && <LoaderCircle size={16} className="animate-spin" />}
                {resettingPassword ? "Resetting..." : "Set new password"}
              </button>
            </form>
          </section>
        </div>
      )}
    </main>
  );
}
