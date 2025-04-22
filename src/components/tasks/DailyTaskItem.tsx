
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Task } from "@/types/tasks";
import { useLanguage } from "@/contexts/LanguageContext";
import { commonStyles } from "@/styles/shared";

interface DailyTaskItemProps {
  task: Task;
  onClaim: (taskId: string | number) => void;
}

const DailyTaskItem = ({ task, onClaim }: DailyTaskItemProps) => {
  const { t } = useLanguage();
  
  return (
    <Card className={commonStyles.card}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
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
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button 
                      size="sm" 
                      variant="default"
                      className="h-8"
                    >
                      {t('tasks.claim')}
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>{t('tasks.confirmClaim')}</AlertDialogTitle>
                      <AlertDialogDescription>
                        {t('tasks.claimDescription', {
                          reward: task.reward,
                          title: task.title
                        })}
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>{t('common.cancel')}</AlertDialogCancel>
                      <AlertDialogAction 
                        onClick={() => onClaim(task.id)}
                      >
                        {t('tasks.confirmReward')}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
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
            <div className="flex justify-between">
              <span className="text-xs text-gray-400">{t('tasks.progress')}</span>
              <span className="text-xs text-gray-400">{task.progress}/{task.totalRequired}</span>
            </div>
            <Progress 
              value={(task.progress / task.totalRequired) * 100} 
              className="h-2 mt-1" 
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DailyTaskItem;
