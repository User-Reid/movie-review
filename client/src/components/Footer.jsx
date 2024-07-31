export default function Footer() {
  return (
    <div className="flex items-center justify-center bg-red-800 h-36">
      <span className="text-white">
        &copy; {new Date().getFullYear()} Reel Reviews. All rights reserved.
      </span>
    </div>
  );
}
