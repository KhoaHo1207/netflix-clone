import { Plus } from "lucide-react";

interface Props {
  onClick: () => void;
}

function AddProfileCard({ onClick }: Props) {
  return (
    <button
      onClick={onClick}
      className="group flex cursor-pointer flex-col items-center gap-3"
    >
      <div className="flex h-32 w-32 items-center justify-center rounded-sm border-2 border-transparent bg-zinc-700/50 transition-colors group-hover:bg-zinc-600/50">
        <Plus
          size={40}
          className="text-white/40 transition-colors group-hover:text-white"
        />
      </div>
      <span className="text-sm text-white/50 transition-colors group-hover:text-white">
        Add Profile
      </span>
    </button>
  );
}

export default AddProfileCard;
