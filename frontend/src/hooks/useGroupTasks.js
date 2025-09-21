import { useEffect, useState } from "react";
import { taskService } from "../services/taskService";
import { groupService } from "../services/groupService";

export function useGroupTasks() {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  useEffect(() => {
    async function fetchAll() {
      try {
        setLoading(true);
        setErr(null);

        // 📌 Chuẩn hóa groups về array
        const res = await groupService.getMyGroups();
        const myGroups = Array.isArray(res) ? res : res.groups || [];

        // 📌 Lấy task cho từng group
        const groupsWithTasks = await Promise.all(
          myGroups.map(async (g) => {
            try {
              const taskRes = await taskService.getGroupTasks(g._id);
              return { ...g, tasks: taskRes.members || {} };
            } catch (e) {
              console.warn("Không load được task của group:", g._id, e.message);
              return { ...g, tasks: {} };
            }
          })
        );

        setGroups(groupsWithTasks);
      } catch (e) {
        setErr(e.message);
      } finally {
        setLoading(false);
      }
    }

    fetchAll();
  }, []);

  return { groups, loading, err };
}
