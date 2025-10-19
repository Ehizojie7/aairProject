import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { VoiceInput } from '@/components/VoiceInput';
import { useVoiceTasks } from '@/hooks/useVoiceTasks';
import { getParsingStats } from '@/utils/taskParser';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function VoiceScreen() {
  const router = useRouter();
  const { processVoiceInput, lastResult } = useVoiceTasks();
  const [showResult, setShowResult] = useState(false);

  const handleTranscriptionComplete = async (transcription: string) => {
    console.log('Transcription received in voice screen:', transcription);
    try {
      const result = await processVoiceInput(transcription);
      console.log('Voice processing result:', result);
      setShowResult(true);
      
      if (result.success) {
        Alert.alert(
          'Tasks Added Successfully!',
          `Added ${result.tasksAdded} task${result.tasksAdded === 1 ? '' : 's'} to your list.\n\n${result.parseResult ? getParsingStats(result.parseResult) : ''}`,
          [
            { text: 'Add More', style: 'default' },
            { 
              text: 'View Tasks', 
              style: 'default',
              onPress: () => router.push('/(tabs)')
            }
          ]
        );
      } else {
        Alert.alert(
          'Error Processing Voice Input',
          result.error || 'Failed to process your voice input',
          [{ text: 'Try Again', style: 'default' }]
        );
      }
    } catch {
      Alert.alert(
        'Error',
        'An unexpected error occurred while processing your voice input',
        [{ text: 'OK', style: 'default' }]
      );
    }
  };

  const handleError = (error: string) => {
    Alert.alert(
      'Voice Input Error',
      error,
      [{ text: 'OK', style: 'default' }]
    );
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ThemedView style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <ThemedText type="title">Voice to Tasks</ThemedText>
            <ThemedText style={styles.subtitle}>
              Speak naturally to add multiple tasks at once
            </ThemedText>
          </View>

          <VoiceInput
            onTranscriptionComplete={handleTranscriptionComplete}
            onError={handleError}
          />

          {showResult && lastResult && (
            <ThemedView style={styles.resultContainer}>
              <ThemedText type="subtitle" style={styles.resultTitle}>
                Last Result
              </ThemedText>
              
              {lastResult.success ? (
                <View style={styles.successResult}>
                  <ThemedText style={styles.successText}>
                    ✅ Successfully added {lastResult.tasksAdded} task{lastResult.tasksAdded === 1 ? '' : 's'}
                  </ThemedText>
                  {lastResult.parseResult && (
                    <ThemedText style={styles.statsText}>
                      {getParsingStats(lastResult.parseResult)}
                    </ThemedText>
                  )}
                </View>
              ) : (
                <View style={styles.errorResult}>
                  <ThemedText style={styles.errorText}>
                    ❌ {lastResult.error}
                  </ThemedText>
                </View>
              )}
            </ThemedView>
          )}

          <View style={styles.examples}>
            <ThemedText type="defaultSemiBold" style={styles.examplesTitle}>
              Try saying:
            </ThemedText>
            <View style={styles.examplesList}>
              <ThemedText style={styles.exampleText}>
                • &quot;Buy groceries and call mom&quot;
              </ThemedText>
              <ThemedText style={styles.exampleText}>
                • &quot;Send email to John, schedule meeting, and finish report&quot;
              </ThemedText>
              <ThemedText style={styles.exampleText}>
                • &quot;Clean the house then do laundry&quot;
              </ThemedText>
              <ThemedText style={styles.exampleText}>
                • &quot;Book flight and reserve hotel&quot;
              </ThemedText>
            </View>
          </View>

          <View style={styles.tips}>
            <ThemedText type="defaultSemiBold" style={styles.tipsTitle}>
              Tips for better results:
            </ThemedText>
            <View style={styles.tipsList}>
              <ThemedText style={styles.tipText}>
                • Use &quot;and&quot;, &quot;then&quot;, or commas to separate tasks
              </ThemedText>
              <ThemedText style={styles.tipText}>
                • Start each task with an action word (buy, call, send, etc.)
              </ThemedText>
              <ThemedText style={styles.tipText}>
                • Speak clearly and at a normal pace
              </ThemedText>
              <ThemedText style={styles.tipText}>
                • Keep tasks concise and specific
              </ThemedText>
            </View>
          </View>
        </ScrollView>
      </ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    gap: 24,
  },
  header: {
    alignItems: 'center',
    gap: 8,
  },
  subtitle: {
    fontSize: 16,
    opacity: 0.7,
    textAlign: 'center',
  },
  resultContainer: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  resultTitle: {
    marginBottom: 8,
  },
  successResult: {
    gap: 4,
  },
  successText: {
    color: '#4CAF50',
    fontWeight: '600',
  },
  statsText: {
    fontSize: 12,
    opacity: 0.7,
  },
  errorResult: {
    gap: 4,
  },
  errorText: {
    color: '#FF6B6B',
    fontWeight: '600',
  },
  examples: {
    gap: 12,
  },
  examplesTitle: {
    fontSize: 16,
  },
  examplesList: {
    gap: 8,
    paddingLeft: 8,
  },
  exampleText: {
    fontSize: 14,
    opacity: 0.8,
  },
  tips: {
    gap: 12,
  },
  tipsTitle: {
    fontSize: 16,
  },
  tipsList: {
    gap: 8,
    paddingLeft: 8,
  },
  tipText: {
    fontSize: 14,
    opacity: 0.8,
  },
});
