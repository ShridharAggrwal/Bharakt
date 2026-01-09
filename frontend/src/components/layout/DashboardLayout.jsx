import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import {
    Menu,
    X,
    LogOut,
    ChevronRight,
    LayoutDashboard,
    User,
    Settings,
    Bell,
    Home,
    Plus,
} from "lucide-react";

import { Button } from "../ui/Button";
import { cn } from "../../lib/utils";

const DashboardLayout = ({ children, navItems = [], portalName = "Admin Portal" }) => {
    const [isQuickActionsOpen, setIsQuickActionsOpen] = useState(false);
    const { user, logout } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/");
    };

    // Color schemes for nav items based on index
    const navColors = [
        { active: "bg-red-50 text-red-700 border-red-100", icon: "text-red-600", hover: "hover:bg-red-50/50" },
        { active: "bg-blue-50 text-blue-700 border-blue-100", icon: "text-blue-600", hover: "hover:bg-blue-50/50" },
        { active: "bg-emerald-50 text-emerald-700 border-emerald-100", icon: "text-emerald-600", hover: "hover:bg-emerald-50/50" },
        { active: "bg-purple-50 text-purple-700 border-purple-100", icon: "text-purple-600", hover: "hover:bg-purple-50/50" },
        { active: "bg-amber-50 text-amber-700 border-amber-100", icon: "text-amber-600", hover: "hover:bg-amber-50/50" },
        { active: "bg-rose-50 text-rose-700 border-rose-100", icon: "text-rose-600", hover: "hover:bg-rose-50/50" },
        { active: "bg-cyan-50 text-cyan-700 border-cyan-100", icon: "text-cyan-600", hover: "hover:bg-cyan-50/50" },
    ];

    return (
        <div className="min-h-screen relative text-slate-900">
            {/* Background Image with Overlay */}
            <div className="fixed inset-0 z-0">
                <img
                    src="https://www.livemint.com/lm-img/img/2025/02/20/optimize/INDIA-POLITICS-DELHI-14_1740045325725_1740045348415.jpg"
                    alt="Background"
                    className="w-full h-full object-cover object-[center_15%]"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-slate-50/85 via-white/80 to-slate-50/85" />
                <div className="absolute inset-0 backdrop-blur-[1px]" />
            </div>

            {/* Mobile Header */}
            <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-xl border-b border-slate-200/50 px-4 py-3 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-rose-600 rounded-lg flex items-center justify-center text-white shadow-lg shadow-red-200">
                        <span className="text-lg">🩸</span>
                    </div>
                    <div>
                        <span className="font-bold text-lg text-slate-900">Bharakt</span>
                        <p className="text-[9px] text-slate-400 uppercase tracking-wider -mt-1">{portalName}</p>
                    </div>
                </div>
                <button
                    onClick={handleLogout}
                    className="p-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 transition-all"
                    title="Logout"
                >
                    <LogOut className="w-5 h-5" />
                </button>
            </div>

            <div className="relative z-10 flex min-h-screen pt-16 pb-20 lg:pt-0 lg:pb-0">
                {/* Desktop Sidebar */}
                <aside
                    className={cn(
                        "hidden lg:block fixed inset-y-0 left-0 z-40 w-72",
                        "bg-gradient-to-b from-white/90 via-red-50/40 to-rose-50/50 backdrop-blur-xl border-r border-rose-100/50 shadow-xl shadow-red-100/20"
                    )}
                >
                    <div className="flex flex-col h-full p-6 relative overflow-hidden">
                        {/* Decorative gradient orbs */}
                        <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br from-red-300/50 to-rose-400/40 rounded-full blur-3xl" />
                        <div className="absolute top-1/3 -left-16 w-36 h-36 bg-gradient-to-br from-rose-200/50 to-red-300/40 rounded-full blur-3xl" />
                        <div className="absolute -bottom-10 right-0 w-36 h-36 bg-gradient-to-br from-red-200/50 to-rose-300/40 rounded-full blur-3xl" />

                        {/* Logo - Desktop */}
                        <div className="flex items-center justify-between mb-10 px-2 relative z-10">
                            <div className="flex items-center gap-3">
                                <div className="w-11 h-11 bg-gradient-to-br from-red-500 to-rose-600 rounded-xl flex items-center justify-center shadow-lg shadow-red-500/30 p-2.5">
                                    <img src="/blood-drop.svg" alt="logo" className="w-full h-full object-contain brightness-0 invert" />
                                </div>
                                <div>
                                    <span className="text-xl font-bold font-serif tracking-tight text-slate-900">Bharakt</span>
                                    <p className="text-[10px] text-slate-400 uppercase tracking-widest">{portalName}</p>
                                </div>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="p-2.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 transition-all shadow-sm border border-red-100"
                                title="Logout"
                            >
                                <LogOut className="w-5 h-5" />
                            </button>
                        </div>

                        {/* User Profile Summary */}
                        <div className="mb-8 p-4 bg-gradient-to-br from-white/80 to-slate-50/80 rounded-2xl border border-white/60 shadow-sm relative z-10">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-11 h-11 rounded-full bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center text-white text-sm font-bold shadow-lg shadow-red-100 ring-2 ring-white">
                                    {user?.name?.charAt(0) || "U"}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-semibold truncate text-slate-900">{user?.name}</p>
                                    <p className="text-xs text-slate-500 truncate capitalize">
                                        {user?.role?.replace("_", " ")}
                                    </p>
                                </div>
                            </div>
                            {user?.blood_group && (
                                <div className="flex items-center gap-2 text-xs text-slate-600 bg-white/80 p-2.5 rounded-xl border border-slate-100/50 shadow-sm">
                                    <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                                    Blood Group: <span className="text-slate-900 font-bold">{user.blood_group}</span>
                                </div>
                            )}
                        </div>

                        {/* Navigation */}
                        <nav className="flex-1 space-y-1.5 relative z-10">
                            {navItems.map((item, index) => {
                                const isActive = location.pathname === item.path;
                                const Icon = item.icon;
                                const colorScheme = navColors[index % navColors.length];
                                return (
                                    <Link
                                        key={item.path}
                                        to={item.path}
                                        className={cn(
                                            "flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-300 group relative overflow-hidden border",
                                            isActive
                                                ? cn(colorScheme.active, "font-semibold shadow-sm")
                                                : cn("text-slate-600 hover:text-slate-900 border-transparent", colorScheme.hover)
                                        )}
                                    >
                                        <Icon className={cn("w-5 h-5 relative z-10 transition-colors", isActive ? colorScheme.icon : "text-slate-400 group-hover:text-slate-600")} />
                                        <span className="relative z-10">{item.label}</span>
                                        {item.badge > 0 && (
                                            <span className={cn(
                                                "ml-auto text-[10px] px-2.5 py-1 rounded-full font-bold relative z-10",
                                                isActive ? "bg-white/80 text-slate-700" : "bg-red-100 text-red-600"
                                            )}>
                                                {item.badge}
                                            </span>
                                        )}
                                    </Link>
                                );
                            })}
                        </nav>

                        {/* Bottom Actions */}
                        <div className="mt-auto pt-6 border-t border-white/50 space-y-2 relative z-10">
                            <Link to="/">
                                <Button
                                    variant="ghost"
                                    className="w-full justify-start gap-3 hover:bg-slate-100 text-slate-600 hover:text-slate-900 rounded-xl"
                                >
                                    <Home className="w-5 h-5" />
                                    <span>Home</span>
                                </Button>
                            </Link>
                        </div>
                    </div>
                </aside>

                {/* Main Content */}
                <main className="flex-1 w-full min-w-0 overflow-hidden lg:pl-72">
                    <div className="h-full overflow-y-auto p-4 lg:p-8 custom-scrollbar">
                        <div className="max-w-7xl mx-auto space-y-8">
                            {children}
                        </div>
                    </div>
                </main>
            </div>

            {/* Mobile Bottom Navigation */}
            <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-xl border-t border-slate-200/50 shadow-lg">
                <div className="flex items-center justify-around px-4 py-2 relative">
                    {/* Overview (First Item) */}
                    {navItems.length > 0 && (() => {
                        const item = navItems[0];
                        const isActive = location.pathname === item.path;
                        const Icon = item.icon;
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={cn(
                                    "flex flex-col items-center justify-center py-2 px-4 rounded-xl transition-all relative",
                                    isActive ? "text-red-600" : "text-slate-400"
                                )}
                            >
                                <Icon className={cn("w-6 h-6", isActive && "scale-110")} />
                                <span className={cn("text-[10px] mt-1 font-medium", isActive && "font-bold")}>{item.label}</span>
                            </Link>
                        );
                    })()}

                    {/* Center Plus Button */}
                    <button
                        onClick={() => setIsQuickActionsOpen(!isQuickActionsOpen)}
                        className={cn(
                            "w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 -mt-6",
                            isQuickActionsOpen
                                ? "bg-slate-900 rotate-45"
                                : "bg-gradient-to-br from-red-500 to-rose-600 shadow-red-200"
                        )}
                    >
                        <Plus className="w-7 h-7 text-white" />
                    </button>

                    {/* Profile (Last Item) */}
                    {navItems.length > 1 && (() => {
                        const item = navItems[navItems.length - 1];
                        const isActive = location.pathname === item.path;
                        const Icon = item.icon;
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={cn(
                                    "flex flex-col items-center justify-center py-2 px-4 rounded-xl transition-all relative",
                                    isActive ? "text-red-600" : "text-slate-400"
                                )}
                            >
                                <Icon className={cn("w-6 h-6", isActive && "scale-110")} />
                                <span className={cn("text-[10px] mt-1 font-medium", isActive && "font-bold")}>{item.label}</span>
                            </Link>
                        );
                    })()}
                </div>

                {/* Nav Items Popup - Outside of flex container for proper centering */}
                <AnimatePresence>
                    {isQuickActionsOpen && navItems.length > 2 && (
                        <>
                            {/* Backdrop - stops above bottom nav */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="fixed inset-0 bg-black/30 z-40"
                                onClick={() => setIsQuickActionsOpen(false)}
                                style={{ bottom: '70px' }}
                            />
                            {/* Centered Popup */}
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                                className="fixed bottom-24 left-0 right-0 mx-auto bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden z-50 w-[280px]"
                            >
                                <div className="p-3">
                                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 px-1">Quick Access</p>
                                    <div className="grid grid-cols-3 gap-2">
                                        {navItems.slice(1, -1).map((item, index) => {
                                            const Icon = item.icon;
                                            const isActive = location.pathname === item.path;
                                            const colors = [
                                                { bg: 'bg-rose-50', icon: 'text-rose-600', border: 'border-rose-100' },
                                                { bg: 'bg-blue-50', icon: 'text-blue-600', border: 'border-blue-100' },
                                                { bg: 'bg-emerald-50', icon: 'text-emerald-600', border: 'border-emerald-100' },
                                                { bg: 'bg-purple-50', icon: 'text-purple-600', border: 'border-purple-100' },
                                                { bg: 'bg-amber-50', icon: 'text-amber-600', border: 'border-amber-100' },
                                                { bg: 'bg-cyan-50', icon: 'text-cyan-600', border: 'border-cyan-100' },
                                            ];
                                            const color = colors[index % colors.length];
                                            return (
                                                <Link
                                                    key={item.path}
                                                    to={item.path}
                                                    onClick={() => setIsQuickActionsOpen(false)}
                                                    className={cn(
                                                        "flex flex-col items-center justify-center p-3 rounded-xl border transition-all hover:scale-105 hover:shadow-md",
                                                        isActive ? `${color.bg} ${color.border}` : "bg-slate-50 border-slate-100 hover:bg-white"
                                                    )}
                                                >
                                                    <div className={cn(
                                                        "w-10 h-10 rounded-xl flex items-center justify-center mb-2",
                                                        color.bg
                                                    )}>
                                                        <Icon className={cn("w-5 h-5", color.icon)} />
                                                    </div>
                                                    <span className="text-[10px] font-semibold text-slate-700 text-center leading-tight">{item.label}</span>
                                                    {item.badge > 0 && (
                                                        <span className="mt-1 px-1.5 py-0.5 bg-red-500 text-white text-[8px] font-bold rounded-full">
                                                            {item.badge > 9 ? '9+' : item.badge}
                                                        </span>
                                                    )}
                                                </Link>
                                            );
                                        })}
                                    </div>
                                </div>
                            </motion.div>
                        </>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default DashboardLayout;
