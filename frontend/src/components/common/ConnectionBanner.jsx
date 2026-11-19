import React, { useState, useEffect } from "react";
import { WifiOff, RefreshCw, CheckCircle2, X } from "lucide-react";
import { useOnlineStatus } from "../../hooks/useOnlineStatus";
import { getOfflineQueue, flushOfflineQueue } from "../../utils/offlineSync";
import { supabase } from "../../supabaseClient";
import { useLanguage } from "../../i18n/LanguageContext";
import "./ConnectionBanner.css";

export default function ConnectionBanner() {
  const { isOnline, wasOffline, setWasOffline } = useOnlineStatus();
  const { t } = useLanguage();
  const [queueCount, setQueueCount] = useState(() => getOfflineQueue().length);
  const [syncing, setSyncing] = useState(false);
  const [showSyncedNotice, setShowSyncedNotice] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  // Listen for queue updates
  useEffect(() => {
    const handleQueueUpdate = (e) => {
      setQueueCount(e.detail?.count ?? getOfflineQueue().length);
    };

    const handleSyncSuccess = () => {
      setShowSyncedNotice(true);
      const timer = setTimeout(() => {
        setShowSyncedNotice(false);
      }, 4500);
      return () => clearTimeout(timer);
    };

    window.addEventListener("eduspark_queue_updated", handleQueueUpdate);
    window.addEventListener("eduspark_sync_success", handleSyncSuccess);

    return () => {
      window.removeEventListener("eduspark_queue_updated", handleQueueUpdate);
      window.removeEventListener("eduspark_sync_success", handleSyncSuccess);
    };
  }, []);

  // When connection transitions from offline to online, flush pending queue
  useEffect(() => {
    let active = true;

    if (isOnline && wasOffline) {
      const runSync = async () => {
        setSyncing(true);
        try {
          await flushOfflineQueue(supabase);
          if (active) {
            setWasOffline(false);
            setQueueCount(getOfflineQueue().length);
          }
        } finally {
          if (active) {
            setSyncing(false);
          }
        }
      };

      runSync();
    }

    return () => {
      active = false;
    };
  }, [isOnline, wasOffline, setWasOffline]);

  // If online, no queue items, and not showing sync notice, render nothing
  if (isOnline && queueCount === 0 && !showSyncedNotice) {
    return null;
  }

  if (dismissed && !showSyncedNotice) {
    return null;
  }

  return (
    <div
      className={`eduspark-connection-banner ${
        !isOnline ? "offline" : showSyncedNotice ? "synced" : "syncing"
      }`}
      role="status"
      aria-live="polite"
    >
      <div className="conn-banner-inner">
        <div className="conn-banner-left">
          {!isOnline ? (
            <WifiOff size={18} className="conn-icon offline" />
          ) : showSyncedNotice ? (
            <CheckCircle2 size={18} className="conn-icon synced" />
          ) : (
            <RefreshCw size={18} className="conn-icon spin" />
          )}

          <div className="conn-banner-text">
            {!isOnline ? (
              <>
                <strong>{t("offline_status_offline", "Offline Mode Active")}:</strong>{" "}
                <span>
                  {t(
                    "offline_banner_desc",
                    "3D Labs and Quizzes function offline. Your work is saved locally."
                  )}
                </span>
                {queueCount > 0 && (
                  <span className="conn-queue-pill">
                    {queueCount} {t("offline_sync_pending", "activities queued")}
                  </span>
                )}
              </>
            ) : showSyncedNotice ? (
              <>
                <strong>{t("offline_status_online", "Online")}:</strong>{" "}
                <span>{t("offline_sync_success", "Offline activities successfully synchronized!")}</span>
              </>
            ) : (
              <>
                <strong>{t("offline_syncing", "Syncing with EduSpark Cloud...")}</strong>
              </>
            )}
          </div>
        </div>

        <div className="conn-banner-actions">
          {isOnline && queueCount > 0 && !syncing && (
            <button
              className="conn-sync-btn"
              onClick={() => {
                setSyncing(true);
                flushOfflineQueue(supabase).finally(() => setSyncing(false));
              }}
            >
              <RefreshCw size={12} /> Sync Now
            </button>
          )}

          <button
            className="conn-close-btn"
            onClick={() => setDismissed(true)}
            aria-label="Dismiss banner"
          >
            <X size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}
