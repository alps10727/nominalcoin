
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Task } from "@/types/tasks";
import { useLanguage } from "@/contexts/LanguageContext";
import { commonStyles, combineStyles } from "@/styles/shared";

interface DailyTaskItemProps {
  task: Task;
  onClaim: (taskId: string | number) => void;
}

const DailyTaskItem = ({ task, onClaim }: DailyTaskItemProps) => {
  const { t } = useLanguage();
  
  return (
    <Card className={commonStyles.card}>
      <CardContent className={commonStyles.cardContent}>
        <div className={commonStyles.flexBetween}>
          <div>
            <h3 className="font-medium text-gray-200">{task.title}</h3>
            <p className="text-sm text-gray-400">{task.description}</p>
          </div>
          <div className={commonStyles.flexCenter}>
            <span className="text-green-400 font-medium mr-2">+{task.reward} FC</span>
            {task.completed ? (
              <span className="bg-green-900/50 text-green-300 text-xs px-2 py-1 rounded-md">
                {t('tasks.completed')}
              </span>
            ) : (
              task.progress >= task.totalRequired ? (
                <Button 
                  size="sm" 
                  className={combineStyles(commonStyles.button.primary, "h-8")}
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
            <div className={commonStyles.flexBetween}>
              <span className="text-xs text-gray-400">{t('tasks.progress')}</span>
              <span className="text-xs text-gray-400">{task.progress}/{task.totalRequired}</span>
            </div>
            <Progress 
              value={(task.progress / task.totalRequired) * 100} 
              className={commonStyles.progressBar} 
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DailyTaskItem;
