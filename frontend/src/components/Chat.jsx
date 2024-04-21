
import React, { useState, useEffect, useRef } from 'react';
import { useRoute } from '@react-navigation/native';
import { Alert, View, Text, TextInput, TouchableOpacity, FlatList, Image, StyleSheet, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { useAppContext } from './Appcontext';
import i18next from '../../services/i18next';
import { useTranslation } from 'react-i18next';
import Popup from './UnfriendPopup';
import UnfriendPopup from './UnfriendPopup';


const ChatScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { xat_id: idConv, id1: id1, id2: id2} = route.params;
  const [IdOther, setIdOther] = useState([]);
  const [Id, setId] = useState([]);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const {mitoken} = useAppContext();
  const [name, setName] = useState (['Nombre Apellido']);
  const flatListRef = useRef();
  const { t } = useTranslation();
 const [unfriend, setUnfriend] = useState(false);

  const toggleUnfriend = () => {
      setUnfriend(!unfriend);
  };

  const pusher = Pusher.getInstance();

  useEffect(() => {
    const initPusher = async () => {
      await pusher.init({
         appId: "1725820",
         apiKey: "3a4bdc698c1568eefd93",
         secret: "9b2e62386f2972fae07a",
         cluster: "eu",
      });

      await pusher.connect();

      await pusher.subscribe({
        channelName: "my-channel",
        onEvent: (event: PusherEvent) => {

          console.log(`Event: ${event}`);
          console.log('event.data: ', event.data);
          const eventData = JSON.parse(event.data);
          const message = eventData.message;
          console.log('message: ', message);

          setMessages(prevMessages => [...prevMessages, { ...message, key: message.id }]);


        }
      });
    };

    initPusher();

    return () => {
      pusher.disconnect();
    };
  }, []);
  useEffect(() => {
    const getPerfil = async () => {
      try {
        const response = await axios.get('http://nattech.fib.upc.edu:40520/api/myProfile/id', {
          headers: {
            'Authorization': `Bearer ${mitoken}`,
          },
        });
        if (response.status === 200) {
          setId(response.data.id);

          setIdOther(id1 === response.data.id ? id2 : id1);
          console.log("Id:" + response.data.id);
          console.log("Id1:" + id1);
          console.log("Id2:" + id2);
          console.log("IdOther:" + IdOther);
          fetchUserName(id1 === response.data.id ? id2 : id1);
        } else {
          console.log(response.status);
        }
      } catch (error) {
        console.error('Error en la llamada GETPerfil:', error);
        Alert.alert('Error', error);
      }
    };
    getPerfil();
  }, []);

  const renderMessage = ({ item }) => {
    return (
      <View key={item.id} style={[styles.messageBubble, { alignItems: item.user_id === Id ? 'flex-end' : 'flex-start' }]}>
        <View style={[item.user_id === Id ? styles.senderBubble : styles.receiverBubble]}>
          <Text>{item.content}</Text>
        </View>
      </View>
    );
  };

  const sendMessage = () => {
    if (newMessage.trim() !== '') {
      const data = {
        content: newMessage,
      };

      axios.post(`http://nattech.fib.upc.edu:40520/api/conversations/${idConv}`, data, {
        headers: {
          'Authorization': `Bearer ${mitoken}`,
        },
      })
        .then(response => {
          console.log('Respuesta', response.data);
          // Asegúrate de manejar la respuesta según tus necesidades
          // Vacía el TextInput después de enviar el mensaje
          setNewMessage('');


        })
        .catch(error => {
          console.error('Error:', error);
          Alert.alert('Error', error);
        });
    }
  };


  useEffect(() => {
    axios.get(`http://nattech.fib.upc.edu:40520/api/conversations/${idConv}`, {
      headers: {
        'Authorization': `Bearer ${mitoken}`,
      },
    })
      .then(response => {
        setMessages(response.data.messages);
      })
      .catch(error => {
        console.error('Error al obtener mensajes:', error);
        Alert.alert('Error', error);
      });
  }, []);

    const fetchUserName = async (id) => {
      try {
        const response = await axios.get(`http://nattech.fib.upc.edu:40520/api/users/${id}`, {
          headers: {
            'Authorization': `Bearer ${mitoken}`,
          },
        });
        if (response.status === 200) {
          setName(response.data.name);
        }
      } catch (error) {
        console.error('Error al obtener el nombre', error);
        Alert.alert('Error', error);
      }
    };

  return (
    <View style={styles.container}>
      <TouchableOpacity style = {styles.backButton} onPress={() => navigation.goBack()}>
          <Icon name = "angle-left" size = {30} color = "black"/>
      </TouchableOpacity>
      <View style={styles.header}>
        <View style={styles.contactInfo}>
          <Image source={require('../../assets/avatar.png')} style={styles.contactImage} />
          <Text style={styles.contactName}>{name}</Text>
        </View>
        <TouchableOpacity onPress={toggleUnfriend}>
          <Ionicons name="ellipsis-vertical" size={24} color="black" />
        </TouchableOpacity>
      </View>

      <UnfriendPopup
        isVisible={unfriend}
        onClose={toggleUnfriend}
        idPerfil={IdOther}
      />
          
      <ScrollView
        ref={flatListRef}
        contentContainerStyle={styles.messageList}
        onContentSizeChange={() => flatListRef.current.scrollToEnd({ animated: true })}
      >
        {messages.map((item) => (
          <View key={item.id} style={[styles.messageBubble, { alignItems: item.user_id === Id ? 'flex-end' : 'flex-start' }]}>
            <View style={[item.user_id === Id ? styles.senderBubble : styles.receiverBubble]}>
              <Text>{item.content}</Text>
            </View>
          </View>
        ))}
      </ScrollView>

      <View style={styles.sendMessageSection}>
        <TextInput
          value={newMessage}
          onChangeText={setNewMessage}
          placeholder={t("write")}
          style={styles.inputField}
        />
        <TouchableOpacity onPress={sendMessage}>
          <Text style={styles.sendButton}>{t("enviar")}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 30,
    marginLeft: 40,
  },
  contactInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  contactImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 8,
  },
  contactName: {
    fontWeight: 'bold',
    fontSize: 18,
  },
  messageList: {
    flexGrow: 1,
    marginTop: 20,
  },
  sendMessageSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputField: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 8,
    marginRight: 8,
    padding: 8,
  },
  senderBubble: {
    backgroundColor: '#DCF8C6',
    padding: 8,
    borderRadius: 8,
    margin: 4,
  },
  receiverBubble: {
    backgroundColor: '#E5E5EA',
    padding: 8,
    borderRadius: 8,
    margin: 4,
  },
  sendButton: {
    color: 'blue',
  },

  backButton: {
    position: 'absolute',
    top: 50,
    left: 30,
    zIndex: 1,
  },
});

export default ChatScreen;
