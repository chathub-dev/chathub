import cn from './cn';

export default function Zoom({ className = '' }: { className?: string }) {
  return (
    <svg
      fill="none"
      strokeWidth="2"
      viewBox="0 0 24 24"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn('h-4 w-4', className)}
      height="1em"
      width="1em"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="12" cy="12" r="8" />
      <path d="M14 14l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}