import { ParseResult, parseTasksFromSpeech } from '@/utils/taskParser';
import { useCallback, useState } from 'react';
import { useTasks } from './useTasks';

export interface VoiceTaskResult {
  success: boolean;
  tasksAdded: number;
  parseResult?: ParseResult;
  error?: string;
}

export function useVoiceTasks() {
  const { addTask } = useTasks();
  const [isProcessing, setIsProcessing] = useState(false);
  const [lastResult, setLastResult] = useState<VoiceTaskResult | null>(null);

  const processVoiceInput = useCallback(async (transcription: string): Promise<VoiceTaskResult> => {
    console.log('Processing voice input:', transcription);
    setIsProcessing(true);
    
    try {
      // Parse the transcription into tasks
      const parseResult = parseTasksFromSpeech(transcription);
      console.log('Parse result:', parseResult);
      
      if (parseResult.tasks.length === 0) {
        const result: VoiceTaskResult = {
          success: false,
          tasksAdded: 0,
          parseResult,
          error: 'No tasks could be extracted from the speech'
        };
        setLastResult(result);
        return result;
      }

      // Add each parsed task
      let tasksAdded = 0;
      for (const task of parseResult.tasks) {
        try {
          console.log('Adding task:', task.title);
          addTask(task.title);
          tasksAdded++;
          console.log('Task added successfully');
        } catch (error) {
          console.warn('Failed to add task:', task.title, error);
        }
      }

      const result: VoiceTaskResult = {
        success: tasksAdded > 0,
        tasksAdded,
        parseResult
      };

      if (tasksAdded === 0) {
        result.error = 'Failed to add any tasks to the list';
      }

      setLastResult(result);
      return result;

    } catch (error) {
      const result: VoiceTaskResult = {
        success: false,
        tasksAdded: 0,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
      setLastResult(result);
      return result;
    } finally {
      setIsProcessing(false);
    }
  }, [addTask]);

  const clearLastResult = useCallback(() => {
    setLastResult(null);
  }, []);

  return {
    processVoiceInput,
    isProcessing,
    lastResult,
    clearLastResult
  };
}
