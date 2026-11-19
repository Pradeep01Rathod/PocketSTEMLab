// =============================================================================
// EDUSPARK OFFLINE STORAGE & SYNCHRONIZATION QUEUE
// Stores quiz completions and experiment progress locally during offline sessions
// Automatically flushes queue when connectivity returns without duplicate entries
// =============================================================================

const OFFLINE_QUEUE_KEY = "eduspark_offline_sync_queue";

export function getOfflineQueue() {
  try {
    const raw = localStorage.getItem(OFFLINE_QUEUE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    console.error("Failed to parse offline sync queue:", err);
    return [];
  }
}

export function saveOfflineQueue(queue) {
  try {
    localStorage.setItem(OFFLINE_QUEUE_KEY, JSON.stringify(queue));
    window.dispatchEvent(new CustomEvent("eduspark_queue_updated", { detail: { count: queue.length } }));
  } catch (err) {
    console.error("Failed to persist offline sync queue:", err);
  }
}

export function queueOfflineProgress({ userId, lessonId, progressPercent = 100, completed = true }) {
  const queue = getOfflineQueue();
  
  // Deduplicate: replace any existing un-synced entry for this exact lesson
  const filtered = queue.filter(
    (item) => !(item.type === "progress" && item.data.lessonId === lessonId && item.data.userId === userId)
  );

  filtered.push({
    id: `progress_${lessonId}_${Date.now()}`,
    type: "progress",
    data: {
      userId,
      lessonId,
      progressPercent,
      completed,
    },
    timestamp: new Date().toISOString(),
  });

  saveOfflineQueue(filtered);
  return true;
}

export function queueOfflineQuiz({ userId, quizId, score, totalQuestions }) {
  const queue = getOfflineQueue();

  // Add quiz result to queue
  queue.push({
    id: `quiz_${quizId}_${Date.now()}`,
    type: "quiz",
    data: {
      userId,
      quizId,
      score,
      totalQuestions,
    },
    timestamp: new Date().toISOString(),
  });

  saveOfflineQueue(queue);
  return true;
}

export async function flushOfflineQueue(supabase) {
  if (!navigator.onLine) {
    return { synced: 0, pending: getOfflineQueue().length, error: "Device is currently offline" };
  }

  const queue = getOfflineQueue();
  if (queue.length === 0) {
    return { synced: 0, pending: 0 };
  }

  // Ensure active user session before syncing
  const { data: { session } } = await supabase.auth.getSession();
  const currentUserId = session?.user?.id;

  const remaining = [];
  let syncedCount = 0;

  for (const item of queue) {
    try {
      const targetUserId = item.data.userId || currentUserId;
      if (!targetUserId) {
        // Retain unauthenticated offline actions until user logs in
        remaining.push(item);
        continue;
      }

      if (item.type === "quiz") {
        const { error } = await supabase.from("quiz_results").insert([
          {
            user_id: targetUserId,
            quiz_id: item.data.quizId,
            score: item.data.score,
            total_questions: item.data.totalQuestions,
            created_at: item.timestamp,
          },
        ]);

        if (error) {
          console.warn("Failed to flush offline quiz entry:", error.message);
          remaining.push(item);
        } else {
          syncedCount++;
        }
      } else if (item.type === "progress") {
        const { error } = await supabase.from("learning_progress").upsert(
          {
            user_id: targetUserId,
            lesson_id: item.data.lessonId,
            progress_percent: item.data.progressPercent,
            completed: item.data.completed,
            updated_at: item.timestamp,
          },
          { onConflict: "user_id, lesson_id" }
        );

        if (error) {
          console.warn("Failed to flush offline progress entry:", error.message);
          remaining.push(item);
        } else {
          syncedCount++;
        }
      }
    } catch (err) {
      console.error("Error processing queue item:", err);
      remaining.push(item);
    }
  }

  saveOfflineQueue(remaining);

  if (syncedCount > 0) {
    window.dispatchEvent(
      new CustomEvent("eduspark_sync_success", { detail: { count: syncedCount } })
    );
  }

  return { synced: syncedCount, pending: remaining.length };
}
