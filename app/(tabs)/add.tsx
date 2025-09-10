import React, { useMemo, useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, Pressable, StyleSheet, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import DateTimePicker from '@react-native-community/datetimepicker';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useTasks } from '@/hooks/useTasks';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function AddTaskScreen() {
  const router = useRouter();
  const { addTask } = useTasks();
  const colorScheme = useColorScheme();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState<Date | undefined>(undefined);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const isValid = useMemo(() => title.trim().length > 0, [title]);

  const onSubmit = () => {
    const trimmed = title.trim();
    if (!trimmed) {
      Alert.alert('Title required', 'Please enter a task title.');
      return;
    }
    addTask(trimmed, description, dueDate?.getTime());
    
    // Clear the form
    setTitle('');
    setDescription('');
    setDueDate(undefined);
    
    router.back();
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <KeyboardAvoidingView behavior={Platform.select({ ios: 'padding' })} style={{ flex: 1 }}>
        <ThemedView style={styles.container}>
          <ThemedText type="title">Add Task</ThemedText>
          <View style={styles.fieldGroup}>
            <ThemedText>Title</ThemedText>
            <TextInput
              placeholder="e.g. Buy groceries"
              placeholderTextColor={colorScheme === 'dark' ? '#999' : '#666'}
              value={title}
              onChangeText={setTitle}
              style={[styles.input, colorScheme === 'dark' && styles.inputDark]}
              autoFocus
              returnKeyType="done"
              onSubmitEditing={onSubmit}
            />
          </View>
          <View style={styles.fieldGroup}>
            <ThemedText>Description (optional)</ThemedText>
            <TextInput
              placeholder="Notes..."
              placeholderTextColor={colorScheme === 'dark' ? '#999' : '#666'}
              value={description}
              onChangeText={setDescription}
              style={[styles.input, styles.multiline, colorScheme === 'dark' && styles.inputDark]}
              multiline
              numberOfLines={4}
            />
          </View>
          <View style={styles.fieldGroup}>
            <ThemedText>Due Date (optional)</ThemedText>
            <Pressable 
              onPress={() => setShowDatePicker(true)} 
              style={[styles.input, styles.dateButton, colorScheme === 'dark' && styles.inputDark]}
            >
              <ThemedText style={dueDate ? undefined : { opacity: 0.6 }}>
                {dueDate ? formatDate(dueDate) : 'Select due date'}
              </ThemedText>
            </Pressable>
            {dueDate && (
              <Pressable onPress={() => setDueDate(undefined)} style={styles.clearDateBtn}>
                <ThemedText style={{ color: '#FF6B6B' }}>Clear Date</ThemedText>
              </Pressable>
            )}
          </View>
          <Pressable onPress={onSubmit} disabled={!isValid} style={[styles.button, !isValid && styles.buttonDisabled]}>
            <ThemedText type="defaultSemiBold" style={!isValid ? styles.buttonTextDisabled : undefined}>
              Save Task
            </ThemedText>
          </Pressable>
        </ThemedView>
        {showDatePicker && (
          <DateTimePicker
            value={dueDate || new Date()}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={(event, selectedDate) => {
              setShowDatePicker(false);
              if (selectedDate) {
                setDueDate(selectedDate);
              }
            }}
            minimumDate={new Date()}
            themeVariant={colorScheme}
          />
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 16,
    padding: 16,
    paddingBottom: 100, // Space for bottom tab bar
  },
  fieldGroup: {
    gap: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: 'transparent',
    color: '#000',
  },
  inputDark: {
    color: '#fff',
    borderColor: '#666',
  },
  multiline: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  button: {
    marginTop: 'auto',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#999',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonTextDisabled: {
    opacity: 0.5,
  },
  dateButton: {
    justifyContent: 'center',
  },
  clearDateBtn: {
    alignSelf: 'flex-start',
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
});


