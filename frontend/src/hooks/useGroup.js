import { useState, useEffect, useRef } from "react";
import { groupService } from "../services/groupService";

export function useGroups() {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [success, setSuccess] = useState("");

  // Ref để track thông báo mới
  const successRef = useRef("");
  const errRef = useRef("");

  async function fetchGroups() {
    try {
      setLoading(true);
      const data = await groupService.getMyGroups();
      const groupsArray = Array.isArray(data) ? data : data.groups || [];

      const groupsWithMembers = await Promise.all(
        groupsArray.map(async (g) => {
          try {
            const members = await groupService.getMembers(g._id);
            return { ...g, members };
          } catch {
            return { ...g, members: [] };
          }
        })
      );

      setGroups(groupsWithMembers);
      // ✅ Không reset success / err ở đây
    } catch (e) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchGroups();
  }, []);

  // Tự động ẩn thông báo sau 3s nếu có
  useEffect(() => {
    if (success && success !== successRef.current) {
      successRef.current = success;
      const timer = setTimeout(() => setSuccess(""), 2000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  useEffect(() => {
    if (err && err !== errRef.current) {
      errRef.current = err;
      const timer = setTimeout(() => setErr(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [err]);

  return { groups, loading, err, success, setErr, setSuccess, fetchGroups };
}
