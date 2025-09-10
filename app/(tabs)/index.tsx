import React, { useMemo, useState } from 'react';
import { Alert, FlatList, Pressable, StyleSheet, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useTasks } from '@/hooks/useTasks';
import { useThemePreference } from '@/hooks/useThemePreference';
import { useColorScheme } from '@/hooks/useColorScheme';
import { IconSymbol } from '@/components/ui/IconSymbol';

type Filter = 'all' | 'active' | 'completed';
type SortBy = 'created' | 'dueDate' | 'title';

export default function TasksListScreen() {
  const router = useRouter();
  const { tasks, isLoading, toggleTaskCompleted, deleteTask, clearAllTasks } = useTasks();
  const { toggleLightDark } = useThemePreference();
  const colorScheme = useColorScheme();
  const [filter, setFilter] = useState<Filter>('all');
  const [sortBy, setSortBy] = useState<SortBy>('created');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredAndSortedTasks = useMemo(() => {
    // First filter by completion status
    let filtered = tasks;
    switch (filter) {
      case 'active':
        filtered = tasks.filter(t => !t.completed);
        break;
      case 'completed':
        filtered = tasks.filter(t => t.completed);
        break;
    }

    // Then filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(task =>
        task.title.toLowerCase().includes(query) ||
        (task.description && task.description.toLowerCase().includes(query))
      );
    }

    // Finally sort
    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'title':
          return a.title.localeCompare(b.title);
        case 'dueDate':
          // Tasks with no due date go to the end
          if (!a.dueDate && !b.dueDate) return b.createdAt - a.createdAt;
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          return a.dueDate - b.dueDate;
        default: // 'created'
          return b.createdAt - a.createdAt;
      }
    });

    return sorted;
  }, [tasks, filter, searchQuery, sortBy]);

  const confirmDelete = (taskId: string, taskTitle: string) => {
    Alert.alert(
      'Delete Task',
      `Are you sure you want to delete "${taskTitle}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => deleteTask(taskId) },
      ]
    );
  };

  const confirmClearAll = () => {
    Alert.alert(
      'Clear All Tasks',
      'Are you sure you want to delete all tasks? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Clear All', style: 'destructive', onPress: clearAllTasks },
      ]
    );
  };

  const formatDueDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const taskDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    
    const diffTime = taskDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Tomorrow';
    if (diffDays === -1) return 'Yesterday';
    if (diffDays < 0) return `${Math.abs(diffDays)} days ago`;
    if (diffDays <= 7) return `In ${diffDays} days`;
    
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const renderEmpty = () => {
    let message = '';
    let subtitle = '';
    
    switch (filter) {
      case 'active':
        message = 'No active tasks yet';
        subtitle = 'Add a task to get started!';
        break;
      case 'completed':
        message = 'You have no completed tasks yet';
        subtitle = 'Complete some tasks to see them here.';
        break;
      default:
        message = 'No tasks yet';
        subtitle = 'Add your first task from the Add tab.';
    }
    
    return (
      <ThemedView style={styles.empty}>
        <ThemedText>{message}</ThemedText>
        <ThemedText type="default">{subtitle}</ThemedText>
      </ThemedView>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ThemedView style={styles.container}>
        <View style={styles.header}>
          <ThemedText type="title">Tasks</ThemedText>
          <Pressable onPress={toggleLightDark} style={styles.themeToggle}>
            <IconSymbol 
              size={24} 
              name={colorScheme === 'dark' ? 'sun.max.fill' : 'moon.fill'} 
              color={colorScheme === 'dark' ? '#FFA500' : '#4A90E2'} 
            />
          </Pressable>
        </View>
        <View style={styles.searchContainer}>
          <TextInput
            placeholder="Search tasks..."
            placeholderTextColor={colorScheme === 'dark' ? '#999' : '#666'}
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={[styles.searchInput, colorScheme === 'dark' && styles.searchInputDark]}
          />
        </View>
        <View style={styles.controls}>
          <View style={styles.filters}>
            {(['all', 'active', 'completed'] as Filter[]).map(f => (
              <Pressable key={f} onPress={() => setFilter(f)} style={[
                styles.chip, 
                filter === f && (colorScheme === 'dark' ? styles.chipActiveDark : styles.chipActiveLight)
              ]}>
                <ThemedText 
                  type="defaultSemiBold" 
                  style={filter === f ? (colorScheme === 'dark' ? styles.chipTextDark : styles.chipTextLight) : undefined}
                >
                  {f}
                </ThemedText>
              </Pressable>
            ))}
          </View>
          <View style={styles.sortAndClear}>
            <Pressable onPress={() => {
              const sortOptions: SortBy[] = ['created', 'dueDate', 'title'];
              const currentIndex = sortOptions.indexOf(sortBy);
              const nextIndex = (currentIndex + 1) % sortOptions.length;
              setSortBy(sortOptions[nextIndex]);
            }} style={styles.sortBtn}>
              <ThemedText style={{ fontSize: 12 }}>
                Sort: {sortBy === 'created' ? 'Date' : sortBy === 'dueDate' ? 'Due' : 'A-Z'}
              </ThemedText>
            </Pressable>
            <Pressable onPress={confirmClearAll} style={styles.clearBtn}>
              <ThemedText>Clear</ThemedText>
            </Pressable>
          </View>
        </View>
        <FlatList
          data={filteredAndSortedTasks}
          keyExtractor={item => item.id}
          ListEmptyComponent={!isLoading ? renderEmpty : null}
          contentContainerStyle={filteredAndSortedTasks.length === 0 ? { flex: 1 } : undefined}
          renderItem={({ item }) => (
            <View style={[styles.row, item.completed && styles.completedRow]}>
            <Pressable onPress={() => toggleTaskCompleted(item.id)} style={[
              styles.checkbox,
              item.completed && styles.checkboxCompleted
            ]}>
              <ThemedText style={item.completed ? styles.checkmarkText : undefined}>
                {item.completed ? '✓' : ''}
              </ThemedText>
            </Pressable>
              <View style={{ flex: 1 }}>
                <ThemedText type="defaultSemiBold">{item.title}</ThemedText>
                {item.description ? <ThemedText>{item.description}</ThemedText> : null}
                {item.dueDate && (
                  <ThemedText style={[
                    styles.dueDateText,
                    item.dueDate < Date.now() && !item.completed && styles.overdueDateText
                  ]}>
                    Due: {formatDueDate(item.dueDate)}
                  </ThemedText>
                )}
              </View>
              <Pressable onPress={() => confirmDelete(item.id, item.title)} style={styles.deleteBtn}>
                <ThemedText>Delete</ThemedText>
              </Pressable>
            </View>
          )}
        />
      </ThemedView>
      <Pressable onPress={() => router.push('/(tabs)/add')} style={styles.fab}>
        <IconSymbol size={28} name="plus" color="#fff" />
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 12,
    padding: 16,
  },
  searchContainer: {
    marginBottom: 12,
  },
  searchInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: 'transparent',
    color: '#000',
  },
  searchInputDark: {
    color: '#fff',
    borderColor: '#666',
  },
  controls: {
    gap: 8,
    marginBottom: 12,
  },
  filters: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  sortAndClear: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  sortBtn: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#999',
  },
  chip: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#999',
  },
  chipActiveLight: {
    backgroundColor: '#000',
  },
  chipActiveDark: {
    backgroundColor: '#fff',
  },
  chipTextLight: {
    color: '#fff',
  },
  chipTextDark: {
    color: '#000',
  },
  clearBtn: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#999',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#ccc',
  },
  completedRow: {
    opacity: 0.6,
  },
  checkbox: {
    height: 24,
    width: 24,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#999',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxCompleted: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
  checkmarkText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  deleteBtn: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#999',
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 100, // Above bottom tab bar
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#007AFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  themeToggle: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
  dueDateText: {
    fontSize: 12,
    opacity: 0.7,
    marginTop: 2,
  },
  overdueDateText: {
    color: '#FF6B6B',
    opacity: 1,
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
});
