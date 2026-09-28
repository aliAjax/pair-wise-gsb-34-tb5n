import { StatusBadge } from "./StatusBadge";
import { formatDate } from "../../utils/formatters";

export interface TimelineItem {
  title: string;
  desc?: string;
  time?: string;
  badge?: string;
}

interface Props {
  title?: string;
  value?: string;
  items?: TimelineItem[];
  emptyText?: string;
}

export function TimelineList({ title = "TimelineList", value = "READY", items, emptyText = "暂无记录" }: Props) {
  if (!items) {
    return <div className="shared-widget"><strong>{title}</strong><StatusBadge value={value} /></div>;
  }
  return (
    <div className="timeline">
      <h3>{title}</h3>
      {items.length === 0 ? (
        <p className="empty">{emptyText}</p>
      ) : (
        <ul>
          {items.map((item, index) => (
            <li key={index}>
              <div className="timeline-head">
                <strong>{item.title}</strong>
                {item.badge ? <StatusBadge value={item.badge} /> : null}
              </div>
              {item.desc ? <p>{item.desc}</p> : null}
              {item.time ? <time>{formatDate(item.time)}</time> : null}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
