import React, { useState } from 'react';
import {
  Alert,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import { ThemePreference } from '@/types/task';
import { useTasks } from '@/context/TaskContext';
import { ThemedText } from './themed-text';
import { useTheme } from '@/hooks/use-theme';

interface SettingsModalProps {
  visible: boolean;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ visible, onClose }) => {
  const theme = useTheme();
  const {
    themePreference,
    setThemePreference,
    exportJSON,
    importJSON,
    clearCompletedTasks,
    tasks,
  } = useTasks();

  const [jsonInput, setJsonInput] = useState('');
  const [showImportArea, setShowImportArea] = useState(false);
  const [exportedString, setExportedString] = useState('');
  const [message, setMessage] = useState('');

  const handleExport = () => {
    const dataStr = exportJSON();
    setExportedString(dataStr);
    setMessage('Tasks JSON copied below! Copy to your notes or backup.');
  };

  const handleImport = async () => {
    if (!jsonInput.trim()) return;
    try {
      await importJSON(jsonInput.trim());
      setMessage('Tasks imported successfully!');
      setJsonInput('');
      setShowImportArea(false);
    } catch (e) {
      setMessage('Error importing JSON. Please check JSON formatting.');
    }
  };

  const handleClearCompleted = async () => {
    if (Platform.OS === 'web') {
      if (window.confirm('Clear all completed tasks?')) {
        await clearCompletedTasks();
        setMessage('Completed tasks cleared!');
      }
    } else {
      Alert.alert('Clear Completed Tasks', 'Are you sure you want to remove all completed tasks?', [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: async () => {
            await clearCompletedTasks();
            setMessage('Completed tasks cleared!');
          },
        },
      ]);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.overlay}>
        <Pressable style={styles.backdrop} onPress={onClose} />
        <View style={[styles.modalContent, { backgroundColor: theme.background }]}>
          <View style={styles.header}>
            <ThemedText style={styles.headerTitle} type="subtitle">
              Settings & Preferences
            </ThemedText>
            <Pressable hitSlop={8} onPress={onClose}>
              <ThemedText style={styles.closeBtn}>✕</ThemedText>
            </Pressable>
          </View>

          <ScrollView style={styles.scrollBody} keyboardShouldPersistTaps="handled">
            {message ? (
              <View style={styles.msgBanner}>
                <ThemedText style={styles.msgText} type="small">
                  {message}
                </ThemedText>
              </View>
            ) : null}

            {/* Theme Preference */}
            <View style={styles.section}>
              <ThemedText style={styles.sectionTitle} type="smallBold">
                Theme Preference
              </ThemedText>
              <View style={styles.themeOptions}>
                {(['system', 'light', 'dark'] as ThemePreference[]).map((pref) => {
                  const isActive = themePreference === pref;
                  return (
                    <Pressable
                      key={pref}
                      onPress={() => setThemePreference(pref)}
                      style={[
                        styles.themeBtn,
                        {
                          backgroundColor: isActive ? '#2563EB' : theme.backgroundElement,
                        },
                      ]}>
                      <ThemedText
                        style={[
                          styles.themeBtnText,
                          { color: isActive ? '#FFFFFF' : theme.text },
                        ]}>
                        {pref.charAt(0).toUpperCase() + pref.slice(1)}
                      </ThemedText>
                    </Pressable>
                  );
                })}
              </View>
            </View>

            {/* Data Backup & Restore */}
            <View style={styles.section}>
              <ThemedText style={styles.sectionTitle} type="smallBold">
                Data Backup & Restore
              </ThemedText>

              <View style={styles.btnRow}>
                <Pressable
                  style={[styles.actionBtn, { backgroundColor: theme.backgroundElement }]}
                  onPress={handleExport}>
                  <ThemedText style={styles.actionBtnText}>Export Backup (JSON)</ThemedText>
                </Pressable>

                <Pressable
                  style={[styles.actionBtn, { backgroundColor: theme.backgroundElement }]}
                  onPress={() => setShowImportArea(!showImportArea)}>
                  <ThemedText style={styles.actionBtnText}>Import Backup</ThemedText>
                </Pressable>
              </View>

              {exportedString ? (
                <View style={styles.jsonBox}>
                  <TextInput
                    style={[styles.jsonText, { color: theme.text }]}
                    value={exportedString}
                    multiline
                    editable={false}
                  />
                </View>
              ) : null}

              {showImportArea ? (
                <View style={styles.importArea}>
                  <TextInput
                    style={[
                      styles.jsonInput,
                      { backgroundColor: theme.backgroundElement, color: theme.text },
                    ]}
                    placeholder="Paste JSON backup here..."
                    placeholderTextColor={theme.textSecondary}
                    value={jsonInput}
                    onChangeText={setJsonInput}
                    multiline
                    numberOfLines={4}
                  />
                  <Pressable style={styles.submitImportBtn} onPress={handleImport}>
                    <ThemedText style={styles.submitImportText}>Confirm Import</ThemedText>
                  </Pressable>
                </View>
              ) : null}
            </View>

            {/* Data Cleanup */}
            <View style={styles.section}>
              <ThemedText style={styles.sectionTitle} type="smallBold">
                Data Management
              </ThemedText>
              <Pressable
                style={[styles.clearBtn, { backgroundColor: '#FEF2F2' }]}
                onPress={handleClearCompleted}>
                <ThemedText style={styles.clearBtnText}>Clear All Completed Tasks</ThemedText>
              </Pressable>
            </View>

            <View style={styles.footer}>
              <ThemedText style={styles.footerText} type="small">
                TaskFlow v1.2.0 • Offline Local Storage
              </ThemedText>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  modalContent: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: Platform.OS === 'ios' ? 36 : 24,
    maxHeight: '80%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
  },
  closeBtn: {
    fontSize: 20,
    fontWeight: '600',
    opacity: 0.6,
    padding: 4,
  },
  scrollBody: {
    marginBottom: 10,
  },
  msgBanner: {
    backgroundColor: '#ECFDF5',
    padding: 10,
    borderRadius: 10,
    marginBottom: 14,
  },
  msgText: {
    color: '#047857',
    fontWeight: '600',
    fontSize: 13,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 14,
    marginBottom: 10,
    opacity: 0.7,
  },
  themeOptions: {
    flexDirection: 'row',
    gap: 10,
  },
  themeBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: 'center',
  },
  themeBtnText: {
    fontSize: 13,
    fontWeight: '700',
  },
  btnRow: {
    flexDirection: 'row',
    gap: 10,
  },
  actionBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  actionBtnText: {
    fontSize: 13,
    fontWeight: '600',
  },
  jsonBox: {
    marginTop: 10,
    padding: 10,
    backgroundColor: 'rgba(150, 150, 150, 0.1)',
    borderRadius: 10,
    maxHeight: 120,
  },
  jsonText: {
    fontSize: 11,
    fontFamily: 'monospace',
  },
  importArea: {
    marginTop: 10,
    gap: 8,
  },
  jsonInput: {
    borderRadius: 10,
    padding: 10,
    fontSize: 12,
    minHeight: 80,
  },
  submitImportBtn: {
    backgroundColor: '#2563EB',
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  submitImportText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13,
  },
  clearBtn: {
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  clearBtnText: {
    color: '#DC2626',
    fontWeight: '700',
    fontSize: 14,
  },
  footer: {
    alignItems: 'center',
    marginTop: 10,
    paddingVertical: 10,
  },
  footerText: {
    fontSize: 12,
    opacity: 0.5,
  },
});
