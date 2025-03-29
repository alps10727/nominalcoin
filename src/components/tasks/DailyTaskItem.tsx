
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Task } from "@/types/tasks";
import { useLanguage } from "@/contexts/LanguageContext";

interface DailyTaskItemProps {
  task: Task;
  onClaim: (taskId: number) => void;
}

const DailyTaskItem = ({ task, onClaim }: DailyTaskItemProps) => {
  const { t } = useLanguage();
  
  return (
    <Card className="border-none shadow-md bg-gray-800 text-gray-100 dark:bg-gray-850 overflow-hidden">
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="font-medium text-gray-200">{task.title}</h3>
            <p className="text-sm text-gray-400">{task.description}</p>
          </div>
          <div className="flex items-center">
            <span className="text-green-400 font-medium mr-2">+{task.reward} FC</span>
            {task.completed ? (
              <span className="bg-green-900/50 text-green-300 text-xs px-2 py-1 rounded-md">
                {t('tasks.completed')}
              </span>
            ) : (
              task.progress >= task.totalRequired ? (
                <Button 
                  size="sm" 
                  className="bg-indigo-600 hover:bg-indigo-700 h-8"
                  onClick={() => onClaim(task.id)}
                >
                  {t('tasks.claim')}
                </Button>
              ) : (
                <span className="bg-gray-700 text-gray-300 text-xs px-2 py-1 rounded-md">
                  {t('tasks.progress')}
                </span>
              )
            )}
          </div>
        </div>
        {!task.completed && (
          <div className="mt-3">
            <div className="flex justify-between text-xs text-gray-400 mb-1">
              <span>Progress</span>
              <span>{task.progress}/{task.totalRequired}</span>
            </div>
            <Progress value={(task.progress / task.totalRequired) * 100} className="h-2 bg-gray-700" />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DailyTaskItem;
