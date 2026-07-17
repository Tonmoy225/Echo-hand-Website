import { formatDistanceToNow } from "date-fns";

export default function TimeAgo({ date }) {
  if (!date) return null;
  return <>{formatDistanceToNow(new Date(date), { addSuffix: true })}</>;
}
