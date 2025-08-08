import { useEffect } from "react";

export default function useClickOutside(refs: any | any[], callback: any) {
  useEffect(() => {
    function handleClickOutside(event: any) {
      const refsArray = Array.isArray(refs) ? refs : [refs];
      const isOutside = refsArray.every(
        (ref) => ref.current && !ref.current.contains(event.target)
      );
      if (isOutside) {
        callback();
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [refs, callback]);
}
