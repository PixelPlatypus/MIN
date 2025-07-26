interface MinionImageProps {
  className?: string;
}

export function MinionImage({ className }: MinionImageProps) {
  return (
    <img
      src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fmedia1.giphy.com%2Fmedia%2FgW9YgAKyDEOzQV1PA3%2Fgiphy.gif&f=1&nofb=1&ipt=91d546ddc16737c3beed05d4ffaa50cb3389ad6aa3ac169706734131fb9fc49e"
      alt="Surprise Minion"
      width={500}
      height={500}
      className={className}
    />
  );
}