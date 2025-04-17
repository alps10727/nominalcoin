
import { Task, Badge } from "@/types/tasks";
import { CheckCircle, Clock, Award, CheckCheck } from "lucide-react";
import React from "react";

type TranslationFunction = (key: string, ...args: any[]) => string;

export function getInitialTasks(t: TranslationFunction): Task[] {
  return [
    {
      id: "1",
      title: t("tasks.mineTask"),
      description: t("tasks.mineTaskDesc"),
      reward: 1,
      progress: 0,
      totalRequired: 5,
      completed: false
    },
    {
      id: "2",
      title: t("tasks.profileTask"),
      description: t("tasks.profileTaskDesc"),
      reward: 0.5,
      progress: 0,
      totalRequired: 1,
      completed: false
    },
    {
      id: "3",
      title: t("tasks.inviteTask"),
      description: t("tasks.inviteTaskDesc"),
      reward: 2,
      progress: 0,
      totalRequired: 1,
      completed: false
    },
  ];
}

export function getInitialBadges(t: TranslationFunction): Badge[] {
  return [
    {
      id: 1,
      title: t("badges.firstMiner"),
      description: t("badges.firstMinerDesc"),
      icon: React.createElement(CheckCircle, { className: "h-6 w-6 text-green-400" }),
      earned: false,
      progress: 0
    },
    {
      id: 2,
      title: t("badges.miningPro"),
      description: t("badges.miningProDesc"),
      icon: React.createElement(Clock, { className: "h-6 w-6 text-indigo-400" }),
      earned: false,
      progress: 0
    },
    {
      id: 3,
      title: t("badges.socialNetworker"),
      description: t("badges.socialNetworkerDesc"),
      icon: React.createElement(Award, { className: "h-6 w-6 text-yellow-400" }),
      earned: false,
      progress: 0
    },
    {
      id: 4,
      title: t("badges.upgradeMaster"),
      description: t("badges.upgradeMasterDesc"),
      icon: React.createElement(CheckCheck, { className: "h-6 w-6 text-purple-400" }),
      earned: false,
      progress: 0
    },
  ];
}
