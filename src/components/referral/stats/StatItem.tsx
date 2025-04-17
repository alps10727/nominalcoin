
interface StatItemProps {
  label: string;
  value: string;
  bgClass: string;
  textClass: string;
}

const StatItem = ({ label, value, bgClass, textClass }: StatItemProps) => {
  return (
    <div className={`rounded-lg p-3 border ${bgClass}`}>
      <div className={`text-sm ${textClass}`}>{label}</div>
      <div className="text-2xl font-bold mt-1 text-white">{value}</div>
    </div>
  );
};

export default StatItem;
