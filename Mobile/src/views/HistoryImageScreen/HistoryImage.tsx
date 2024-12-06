import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, FlatList, Image, Dimensions, ActivityIndicator, TouchableOpacity, Modal, Button } from 'react-native';
import * as _ from 'lodash';
import { Text } from 'react-native-paper';
import Background from '../../components/DashboardScreen/Background';
import { fetchHistoryImages } from 'src/services/media/getHistoryImageList';
const { width } = Dimensions.get('window');
import { useFocusEffect } from '@react-navigation/native';

export default function HistoryImage({ navigation }: any) {
  const [historyData, setHistoryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const isStop = useRef<boolean>(false);

  useFocusEffect(
    React.useCallback(() => {
      loadImages(1, false);
    }, [])
  );

  const loadImages = async (page: number, loadMore = true) => {
    setLoading(true);
    try {
      const response = await fetchHistoryImages(page, 10);
      if (!_.has(response, 'error')) {
        if (loadMore) {
          setHistoryData(prevData => [...prevData, ...response]);
        } else {
          setHistoryData(response);
        }
      }
    } catch (error) {
      console.error('Failed to fetch history data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleLoadMore = () => {
    if (!loading && !isStop.current) {
      const nextPage = page + 1;
      setPage(nextPage);
      loadImages(nextPage);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    setPage(1);
    loadImages(1, false);
  };

  const handleItemPress = (item: any) => {
    setSelectedItem(item);
    setModalVisible(true);
  };

  const renderItem = ({ item }: { item: any }) => (
    <TouchableOpacity onPress={() => handleItemPress(item)}>
      <View style={styles.row}>
        <Image source={{ uri: item.url }} style={styles.image} />
        <View style={styles.textContainer}>
          <Text style={styles.imageName}>{item.name}</Text>
          <Text style={styles.createdAt}>{new Date(item.created_at).toLocaleString()}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <Background>
      {loading && page === 1 ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <FlatList
          data={historyData}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          refreshing={refreshing}
          onRefresh={handleRefresh}
        />
      )}

      {/* Modal hiển thị khi item được nhấn */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)} // Đóng modal khi nhấn nút back trên Android
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {selectedItem && (
              <>
                <Image source={{ uri: selectedItem.url }} style={styles.modalImage} />
                <Text style={styles.modalTitle}>{selectedItem.name}</Text>
                <Text style={styles.modalText}>Created at: {new Date(selectedItem.created_at).toLocaleString()}</Text>
                <Button title="Close" onPress={() => setModalVisible(false)} />
              </>
            )}
          </View>
        </View>
      </Modal>
    </Background>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    width: width,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    height: 120,
  },
  image: {
    width: 130,
    height: 90,
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
    marginLeft: 30,
  },
  imageName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  createdAt: {
    fontSize: 14,
    color: '#666',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalImage: {
    width: 200,
    height: 150,
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalText: {
    fontSize: 16,
    marginBottom: 20,
  },
});
