import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Switch,
  Dimensions,
} from 'react-native';

interface Student {
  id: string;
  name: string;
  isActive: boolean;
}

const { width } = Dimensions.get('window');

export default function StudentDashboard() {
  const [students, setStudents] = useState<Student[]>([]);
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(true);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    setTimeout(() => {
      setStudents([
        { id: '1', name: 'Carl Patrick', isActive: true },
        { id: '2', name: 'John Doe', isActive: false },
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const addStudent = () => {
    if (!name.trim()) return;

    const newStudent: Student = {
      id: Date.now().toString(),
      name,
      isActive: true,
    };

    setStudents(prev => [newStudent, ...prev]);
    setName('');
  };

  const confirmDelete = (id: string) => {
    setSelectedId(id);
    setShowDeleteModal(true);
  };

  const deleteStudent = () => {
    if (!selectedId) return;

    setStudents(prev => prev.filter(s => s.id !== selectedId));
    setShowDeleteModal(false);
    setSelectedId(null);
  };

  const toggleStatus = (id: string) => {
    setStudents(prev =>
      prev.map(s =>
        s.id === id ? { ...s, isActive: !s.isActive } : s
      )
    );
  };

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#4A90E2" />
        <Text style={styles.loadingText}>Loading students...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>

      {/* HEADER */}
      <Text style={styles.title}>🎓 Student Dashboard</Text>
      <Text style={styles.subtitle}>
        Manage students easily and efficiently
      </Text>

      {/* INPUT */}
      <View style={styles.inputCard}>
        <TextInput
          placeholder="Enter student name..."
          value={name}
          onChangeText={setName}
          style={styles.input}
          placeholderTextColor="#999"
        />

        <TouchableOpacity style={styles.addBtn} onPress={addStudent}>
          <Text style={styles.addText}>Add</Text>
        </TouchableOpacity>
      </View>

      {/* 👇 LIST TITLE ADDED HERE */}
      <Text style={styles.listTitle}>📋 List of Students</Text>

      {/* LIST */}
      <FlatList
        data={students}
        keyExtractor={item => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
        renderItem={({ item }) => (
          <View style={styles.card}>

            <View style={{ flex: 1 }}>
              <Text style={styles.name}>{item.name}</Text>
              <Text
                style={[
                  styles.status,
                  { color: item.isActive ? '#2ecc71' : '#e74c3c' },
                ]}
              >
                {item.isActive ? 'Active Student' : 'Inactive Student'}
              </Text>
            </View>

            <Switch
              value={item.isActive}
              onValueChange={() => toggleStatus(item.id)}
            />

            <TouchableOpacity
              style={styles.deleteBtn}
              onPress={() => confirmDelete(item.id)}
            >
              <Text style={styles.deleteText}>×</Text>
            </TouchableOpacity>

          </View>
        )}
      />

      {/* MODAL */}
      {showDeleteModal && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Delete Student</Text>
            <Text style={styles.modalText}>
              Are you sure you want to delete this student?
            </Text>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => setShowDeleteModal(false)}
              >
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.confirmBtn}
                onPress={deleteStudent}
              >
                <Text style={styles.confirmText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}

    </View>
  );
}

/* ===================== STYLES ===================== */

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#EEF2F7',
    padding: 20,
  },

  title: {
    fontSize: width * 0.075,
    fontWeight: '800',
    color: '#1F2D3D',
  },

  subtitle: {
    fontSize: 13,
    color: '#7D8A99',
    marginTop: 4,
    marginBottom: 15,
  },

  listTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1F2D3D',
    marginBottom: 10,
    marginTop: 5,
  },

  inputCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 16,
    marginBottom: 15,
    alignItems: 'center',
    elevation: 3,
  },

  input: {
    flex: 1,
    paddingHorizontal: 10,
  },

  addBtn: {
    backgroundColor: '#4A90E2',
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 12,
  },

  addText: {
    color: '#fff',
    fontWeight: '700',
  },

  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 18,
    marginBottom: 10,
    alignItems: 'center',
    elevation: 2,
  },

  name: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2D3D',
  },

  status: {
    fontSize: 12,
    marginTop: 3,
    fontWeight: '500',
  },

  deleteBtn: {
    backgroundColor: '#FF4D4D',
    width: 34,
    height: 34,
    borderRadius: 10,
    marginLeft: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },

  deleteText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },

  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  loadingText: {
    marginTop: 10,
    color: '#666',
  },

  /* MODAL */
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  modalBox: {
    width: '85%',
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
  },

  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 10,
  },

  modalText: {
    fontSize: 14,
    color: '#555',
    marginBottom: 20,
  },

  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },

  cancelBtn: {
    padding: 10,
    backgroundColor: '#eee',
    borderRadius: 10,
    marginRight: 10,
  },

  cancelText: {
    fontWeight: '600',
  },

  confirmBtn: {
    padding: 10,
    backgroundColor: '#FF4D4D',
    borderRadius: 10,
  },

  confirmText: {
    color: '#fff',
    fontWeight: '700',
  },
});