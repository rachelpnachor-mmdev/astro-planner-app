import React, { useMemo, useState } from 'react';
import { FlatList, Modal, Platform, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { LunariaColors } from '../constants/Colors';

export default function SelectModal({
  visible,
  title,
  items,
  onClose,
  onSelect,
}: {
  visible: boolean;
  title: string;
  items: string[];
  onClose: () => void;
  onSelect: (value: string) => void;
}) {
  const [q, setQ] = useState('');
    // 1) Normalize + de-duplicate the incoming list so keys are unique
    const base = useMemo(() => {
      const norm = items.map(s => s.trim());
      return Array.from(new Set(norm)); // unique labels only
    }, [items]);
    // 2) Filter against the de-duplicated list
    const data = useMemo(() => {
      const t = q.trim().toLowerCase();
      if (!t) return base.slice(0, 200);
      return base.filter(i => i.toLowerCase().includes(t)).slice(0, 200);
    }, [q, base]);

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose} presentationStyle={Platform.OS === 'ios' ? 'formSheet' : 'fullScreen'}>
      <View style={S.wrap} pointerEvents="auto">
        <Text style={S.title}>{title}</Text>
        <TextInput
          value={q}
          onChangeText={setQ}
          placeholder="Search…"
          placeholderTextColor="#8B96A8"
          style={S.search}
          autoCapitalize="none"
        />
        <FlatList
            data={data}
            // Safe even if upstream sent duplicates: we deduped in `base`
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <Pressable onPress={() => { onSelect(item); onClose(); }} style={S.row} pointerEvents="auto">
              <Text style={S.rowText}>{item}</Text>
            </Pressable>
          )}
          ItemSeparatorComponent={() => <View style={S.sep} />}
        />
        <Pressable onPress={onClose} style={S.closeBtn} pointerEvents="auto">
          <Text style={S.closeText}>Close</Text>
        </Pressable>
      </View>
    </Modal>
  );
}

const S = StyleSheet.create({
  wrap: { flex: 1, backgroundColor: LunariaColors.bg, padding: 16, gap: 12 },
  title: { color: '#E6EDF3', fontSize: 18, fontWeight: '700' },
  search: {
    backgroundColor: LunariaColors.card, color: LunariaColors.text, borderWidth: 1, borderColor: LunariaColors.border,
    borderRadius: 12, paddingHorizontal: 12, paddingVertical: 10,
  },
  row: { paddingVertical: 12, paddingHorizontal: 10, borderRadius: 10, backgroundColor: LunariaColors.card },
  rowText: { color: '#E6EDF3' },
  sep: { height: 8 },
  closeBtn: {
    marginTop: 12, alignItems: 'center', borderWidth: 1, borderColor: '#2A3447', borderRadius: 24, paddingVertical: 12,
  },
  closeText: { color: '#E6EDF3', fontWeight: '600' },
});
