import React, { useState, useEffect } from "react";
import {
    ShoppingBag,
    Tag,
    CreditCard,
    Truck,
    Package,
    Percent,
    Gift,
} from "lucide-react";

interface AnimatedIcon {
    id: string;
    component: React.ElementType;
    size: number;
    left: number;
    duration: number;
    delay: number;
    expiresAt: number;
}

const Loader: React.FC = () => {
    const [animatedIcons, setAnimatedIcons] = useState<AnimatedIcon[]>([]);

    const iconComponents: React.ElementType[] = [
        ShoppingBag,
        Tag,
        CreditCard,
        Truck,
        Package,
        Percent,
        Gift,
    ];

    useEffect(() => {
        setAnimatedIcons(createIcons());
        const iconInterval = setInterval(() => {
            setAnimatedIcons((prev) => {
                const currentTime = Date.now();
                const filtered = prev.filter(
                    (icon) => icon.expiresAt > currentTime
                );

                return [...filtered, ...createIcons(1)];
            });
        }, 800);

        return () => clearInterval(iconInterval);
    }, []);

    const createIcons = (count: number = 3): AnimatedIcon[] => {
        return Array.from({ length: count }, () => {
            const IconComponent =
                iconComponents[
                    Math.floor(Math.random() * iconComponents.length)
                ];
            return {
                id: Math.random().toString(36).substr(2, 9),
                component: IconComponent,
                size: Math.floor(Math.random() * 16) + 24, // 24-40px
                left: Math.floor(Math.random() * 80) + 10, // 10-90%
                duration: Math.floor(Math.random() * 4) + 3, // 3-7s
                delay: Math.floor(Math.random() * 2), // 0-2s
                expiresAt:
                    Date.now() + (Math.floor(Math.random() * 4) + 6) * 1000, // 6-10s
            };
        });
    };

    useEffect(() => {
        const styleEl = document.createElement("style");
        styleEl.textContent = `
      @keyframes float {
        0% {
          transform: translateY(0%);
          opacity: 0;
        }
        10% {
          opacity: 1;
        }
        100% {
          transform: translateY(-500%);
          opacity: 0;
        }
      }
      .animate-float {
        animation-fill-mode: forwards;
      }
    `;

        document.head.appendChild(styleEl);

        // Cleanup function
        return () => {
            document.head.removeChild(styleEl);
        };
    }, []); // Empty dependency array - only run once on mount

    return (
        <div className="flex items-center justify-center w-full h-64 relative">
            {animatedIcons.map((icon) => {
                const Icon = icon.component;
                return (
                    <div
                        key={icon.id}
                        className="absolute animate-float"
                        style={{
                            left: `${icon.left}%`,
                            bottom: "-10%",
                            animation: `float ${icon.duration}s ease-in-out -${icon.delay}s forwards`,
                        }}
                    >
                        <div className="bg-yellow-50 rounded-full p-3 border border-amber-300 shadow-sm">
                            <Icon size={icon.size} className="text-amber-600" />
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default Loader;
