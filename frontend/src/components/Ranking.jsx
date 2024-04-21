import React, { useState, useEffect } from 'react';
import { Alert, View, Text, TouchableOpacity, Modal, StyleSheet, FlatList, TextInput } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import axios from 'axios';
import comarcasList from '../../locales/comarcas';
import { useTranslation } from 'react-i18next';
import i18next from '../../services/i18next';

const Ranking = ({ navigation }) => {
  const { t } = useTranslation();
  const [selectedFilter, setSelectedFilter] = useState('elo');
  const [users, setUsers] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [showComarcaModal, setShowComarcaModal] = useState(false);
  const [selectedComarca, setSelectedComarca] = useState(null);
  const [comarcas, setComarcas] = useState(comarcasList);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchUsers = async () => {
    try {
      let apiUrl = 'http://nattech.fib.upc.edu:40520/api/ranking-elo';

      if (selectedFilter === 'comarca' && selectedComarca) {
        apiUrl = `http://nattech.fib.upc.edu:40520/api/ranking-elo?comarca=${selectedComarca.id}`;
      } else if (selectedFilter === 'racha') {
        apiUrl = 'http://nattech.fib.upc.edu:40520/api/ranking-daily-quiz';
      }

      const response = await axios.get(apiUrl);
      setUsers(response.data);
    } catch (error) {
      console.error('Error al obtener usuarios:', error);
      Alert.alert('Error: '+ error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [selectedFilter, selectedComarca]);

  const handleFilterSelection = (filter) => {
    setSelectedFilter(filter);
    setShowFilters(false);
    if (filter === 'comarca') {
      setShowComarcaModal(true);
    }
  };

  const handleComarcaSelection = (comarca) => {
    setSelectedComarca(comarca);
    setShowComarcaModal(false);
  };

  const filterComarcas = (query) => {
    const filteredComarcas = comarcas.filter((comarca) =>
      comarca.name.toLowerCase().includes(query.toLowerCase())
    );
    return filteredComarcas;
  };
  const getTopThreeUsers = () => {
    return users.slice(0, 3);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialCommunityIcons name="arrow-left" size={30} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setShowFilters(true)}>
          <MaterialCommunityIcons name="filter" size={30} />
        </TouchableOpacity>
        {selectedFilter === 'comarca' && (
          <TouchableOpacity onPress={() => handleFilterSelection('comarca')}>
            <MaterialCommunityIcons name="map-marker" size={30} />
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.podium}>
        <Text style={styles.podiumTitle}>{t('podioRanking')}</Text>
        {getTopThreeUsers().map((user, index) => (
          <View key={user.id} style={styles.podiumUser}>
            {index === 0 && (
              <MaterialCommunityIcons name="trophy" size={30} color="#FFD700" style={styles.trophyIcon} />
            )}
            {index === 1 && (
              <MaterialCommunityIcons name="trophy" size={30} color="#C0C0C0" style={styles.trophyIcon} />
            )}
            {index === 2 && (
              <MaterialCommunityIcons name="trophy" size={30} color="#CD7F32" style={styles.trophyIcon} />
            )}
            <View style={styles.podiumUserInfo}>
            <Text>{user.name}</Text>
            <Text>{user.puntuacio}{t('puntos')}</Text>
            </View>
          </View>
        ))}
      </View>

      <View style={styles.userList}>
        <Text style={styles.userListTitle}>{t('listadoRanking')}{selectedFilter}</Text>
        {users.map((user, index) => (
          <View key={user.id} style={styles.userListItem}>
            <Text style={styles.userItemPosition}>{index + 1}</Text>
            <Text>{user.name}</Text>
            <Text>{user.puntuacio}{t('puntos')}</Text>
          </View>
        ))}
      </View>

      <Modal visible={showFilters} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TouchableOpacity onPress={() => setShowFilters(false)} style={styles.closeButton}>
              <MaterialCommunityIcons name="close" size={30} />
            </TouchableOpacity>
            <Text style={styles.filterText}>{t('selectFilter')}</Text>
            <TouchableOpacity onPress={() => handleFilterSelection('elo')}>
              <Text style={styles.filterOption}>{t('porPuntos')}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleFilterSelection('comarca')}>
              <Text style={styles.filterOption}>{t('porComarca')}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleFilterSelection('racha')}>
              <Text style={styles.filterOption}>{t('porRacha')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal visible={showComarcaModal} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TouchableOpacity onPress={() => setShowComarcaModal(false)} style={styles.closeButton}>
              <MaterialCommunityIcons name="close" size={30} />
            </TouchableOpacity>
            <Text style={styles.filterText}>{t('selectComarca')}</Text>
            <TextInput
              style={styles.searchInput}
              placeholder= {t('buscarComarca')}
              onChangeText={(text) => setSearchQuery(text)}
            />
            {showComarcaModal && (
        <FlatList
          data={filterComarcas(searchQuery)}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => handleComarcaSelection(item)}>
              <Text style={styles.filterOption}>{item.name}</Text>
            </TouchableOpacity>
              )}
            />
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    marginTop: 30,
  },
  podium: {
    alignItems: 'center',
    marginVertical: 20,
  },
  podiumTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  podiumUser: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '80%',
    marginVertical: 5,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  trophyIcon: {
    marginRight: 10,
  },
  podiumUserInfo: {
    flex: 1,
  },
  podiumPosition: {
    fontWeight: 'bold',
    marginRight: 10,
  },
  userList: {
    marginHorizontal: 20,
  },
  userListTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  userListItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  userItemPosition: {
    fontWeight: 'bold',
    marginRight: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    elevation: 5,
  },
  closeButton: {
    alignSelf: 'flex-end',
  },
  filterText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  filterOption: {
    fontSize: 16,
    marginVertical: 5,
  },
  searchInput: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 10,
  },
});

export default Ranking;
