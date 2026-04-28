import {
  Thermometer, Droplets, Wind, Sun,
  Droplet, Waves, Snowflake, Sprout, Fan, AlertTriangle,
} from 'lucide-react';

const ICON_MAP = {
  thermometer: Thermometer,
  droplets:    Droplets,
  wind:        Wind,
  sun:         Sun,
  droplet:     Droplet,
  waves:       Waves,
  snowflake:   Snowflake,
  sprout:      Sprout,
  fan:         Fan,
  alert:       AlertTriangle,
};

export default function Pill({ icon, content, color }) {
  const Icon = ICON_MAP[icon] || AlertTriangle;
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 rounded-lg text-sm font-bold mx-1 whitespace-nowrap"
      style={{
        background: color,
        color: '#F8FFF6',
        height: '26px',
        verticalAlign: '-0.3em',
        flexShrink: 0,
      }}
    >
      <Icon size={13} strokeWidth={2.5} style={{ flexShrink: 0 }} />
      {content}
    </span>
  );
}