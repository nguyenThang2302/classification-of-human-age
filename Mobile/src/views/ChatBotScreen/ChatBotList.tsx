import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { getHistoryChatBotList } from 'src/services/chat/getHistoryChatBotList';

interface Chat {
    id: string;
    name: string;
    lastMessage: string;
    timestamp: string;
}

const ChatBotList: React.FC = ({ navigation }: any) => {
    const [chats, setChats] = useState<Chat[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchChats = async () => {
            try {
                const data = await getHistoryChatBotList();
                const formattedChats = data.map((chat: any) => ({
                    id: chat.id,
                    name: "ChatBot",
                    lastMessage: chat.title,
                    timestamp: new Date(chat.created_at).toLocaleString(),
                }));
                setChats(formattedChats);
            } catch (error) {
                console.error('Error fetching chat history:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchChats();
    }, []);

    const renderItem = ({ item }: { item: Chat }) => (
        <View>
            <TouchableOpacity style={styles.chatItem} onPress={() => navigation.navigate('ChatBot', { chatId: item.id })}>
                <View style={styles.chatInfo}>
                    <Text style={styles.chatName}>{item.name}</Text>
                    <Text style={styles.chatMessage}>{item.lastMessage}</Text>
                </View>
                <Text style={styles.chatTimestamp}>{item.timestamp}</Text>
            </TouchableOpacity>
        </View>

    );

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#007AFF" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <TouchableOpacity
                style={styles.iconButton}
                onPress={() => navigation.navigate('ChatBot', { chatId: null })}
            >
                <View style={styles.circle}>
                    <Text style={styles.plusIcon}>+</Text>
                </View>
            </TouchableOpacity>
            <FlatList
                data={chats}
                keyExtractor={(item) => item.id}
                renderItem={renderItem}
            />
        </View>
    );
};

export default ChatBotList;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    chatItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    chatInfo: {
        flex: 1,
    },
    chatName: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    chatMessage: {
        fontSize: 14,
        color: '#888',
        marginTop: 4,
    },
    chatTimestamp: {
        fontSize: 12,
        color: '#aaa',
    },
    iconButton: {
        marginTop: 80,
        marginRight: 10,
        paddingLeft: 10,
        position: 'relative',
    },
    circle: {
        position: 'absolute',
        right: 0,
        bottom: 0,
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#f0f8ff',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 19,
            height: 17,
        },
        shadowOpacity: 0.3,
        shadowRadius: 24,
        elevation: 4,
    },
    plusIcon: {
        color: 'black',
        fontSize: 40,
        fontWeight: 'bold',
    },
});
