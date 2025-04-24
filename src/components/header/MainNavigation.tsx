import React from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { MoonIcon, SunIcon } from "@radix-ui/react-icons";
import { useTheme } from "@/components/ui/theme-provider";
import { Github, Discord } from "lucide-react";
import { MessageCircle } from "lucide-react";

const MainNavigation = () => {
  const { currentUser, logout } = useAuth();
  const { t } = useLanguage();
  const { setTheme } = useTheme();

  return (
    <nav className="hidden md:flex items-center gap-6">
      <NavLink
        to="/"
        className={({ isActive }) =>
          cn(
            "text-sm font-medium transition-colors",
            isActive ? "text-primary" : "text-muted-foreground"
          )
        }
      >
        {t("header.home")}
      </NavLink>
      <NavLink
        to="/mining"
        className={({ isActive }) =>
          cn(
            "text-sm font-medium transition-colors",
            isActive ? "text-primary" : "text-muted-foreground"
          )
        }
      >
        {t("header.mining")}
      </NavLink>
      <NavLink
        to="/leaderboard"
        className={({ isActive }) =>
          cn(
            "text-sm font-medium transition-colors",
            isActive ? "text-primary" : "text-muted-foreground"
          )
        }
      >
        {t("header.leaderboard")}
      </NavLink>
      <NavLink
        to="/referral"
        className={({ isActive }) =>
          cn(
            "text-sm font-medium transition-colors",
            isActive ? "text-primary" : "text-muted-foreground"
          )
        }
      >
        {t("header.referral")}
      </NavLink>
      <NavLink
        to="/upgrades"
        className={({ isActive }) =>
          cn(
            "text-sm font-medium transition-colors",
            isActive ? "text-primary" : "text-muted-foreground"
          )
        }
      >
        {t("header.upgrades")}
      </NavLink>
      <a
        href="https://github.com/CoinNominal"
        target="_blank"
        rel="noreferrer"
        className="text-sm font-medium transition-colors hover:text-primary"
      >
        <Github className="w-4 h-4" />
      </a>
      <a
        href="https://discord.gg/coinnominal"
        target="_blank"
        rel="noreferrer"
        className="text-sm font-medium transition-colors hover:text-primary"
      >
        <Discord className="w-4 h-4" />
      </a>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setTheme((theme) => (theme === "light" ? "dark" : "light"))}
      >
        <SunIcon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
        <MoonIcon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        <span className="sr-only">Toggle theme</span>
      </Button>
      {currentUser ? (
        <Button variant="outline" size="sm" onClick={logout}>
          {t("header.logout")}
        </Button>
      ) : (
        <>
          <NavLink to="/login">
            <Button variant="outline" size="sm">
              {t("header.login")}
            </Button>
          </NavLink>
          <NavLink to="/register">
            <Button size="sm">{t("header.register")}</Button>
          </NavLink>
        </>
      )}
      <NavLink
        to="/chat"
        className={({ isActive }) =>
          cn(
            "flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary",
            isActive ? "text-primary" : "text-muted-foreground"
          )
        }
      >
        <MessageCircle className="h-4 w-4" />
        Sohbet
      </NavLink>
    </nav>
  );
};

export default MainNavigation;
