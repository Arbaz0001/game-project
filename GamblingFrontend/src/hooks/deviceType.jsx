import { useEffect, useState } from "react";

export function useDeviceType() {
  const [device, setDevice] = useState("desktop");

  useEffect(() => {
    const checkDevice = () => {
      const ua = navigator.userAgent.toLowerCase();

      if (
        /mobile|android|iphone|ipod|blackberry|iemobile|opera mini/.test(ua)
      ) {
        setDevice("mobile");
      } else if (/ipad|tablet|playbook|silk/.test(ua)) {
        setDevice("tablet");
      } else {
        setDevice("desktop");
      }
    };

    checkDevice();
    window.addEventListener("resize", checkDevice);

    return () => {
      window.removeEventListener("resize", checkDevice);
    };
  }, []);

  return device;
}
