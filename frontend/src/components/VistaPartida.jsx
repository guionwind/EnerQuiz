import React, { useState, useEffect, useRef } from 'react';
import { useRoute } from '@react-navigation/native';
import { View, Text, TextInput, TouchableOpacity, FlatList, Image, StyleSheet, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { useAppContext } from './Appcontext';
import { useTranslation } from 'react-i18next';
import i18next from '../../services/i18next';

const VistaPartida = () => {

    const navigation = useNavigation();
    const route = useRoute();
    const { id1: id1, id2: id2} = route.params;
    const [IdOther, setIdOther] = useState([]);
    const [Id, setId] = useState([]);
    const [questionData, setQuestionData] = useState([]);
    const [Answers, setAnswers] = useState([]);
    const [selectedOption, setSelectedOption] = useState([]); // Cambia 4 según la cantidad máxima de opciones
    const [isCorrect, setIsCorrect] = useState([]); // Cambia 4 según la cantidad máxima de opciones
    const [isAnswered, setIsAnswered] = useState([]); // Cambia 4 según la cantidad máxima de opciones
    const [correctIndex, setCorrectIndex] = useState([]);
    const [preguntes, setPreguntes] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const {mitoken} = useAppContext();
    const [name, setName] = useState (['Nombre Apellido']);
    const flatListRef = useRef();
    const { t } = useTranslation();


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
              fetchUserName(id1 === response.data.id ? id2 : id1);
            } else {
              console.log(response.status);
            }
          } catch (error) {
            console.error('Error en la llamada GETPerfil:', error);
          }
        };
        getPerfil();
      }, []);

      const fetchQuestionData = async () => {
        setIsAnswered((prevIsAnswered) => [...prevIsAnswered, false]);
        setCorrectIndex((prevCorrectIndex) => [...prevCorrectIndex, null]);
        setSelectedOption((prevSelectedOption) => [...prevSelectedOption, null]);
        try {
          const response = await axios.get('http://nattech.fib.upc.edu:40520/api/questions/random/');
          if (response.status === 200) {
            const question = response.data.question;
            setPreguntes((prevPreguntes) => [...prevPreguntes, question]);
            const correctAnswerIndex = getCorrectAnswerIndex(question);
            setCorrectIndex((prevCorrectIndex) => [...prevCorrectIndex, correctAnswerIndex]);
          } else {
            console.error(response.statusText);
          }
        } catch (error) {
          console.error(error);
        }
      };

      //envia un missatge
      /* const sendMessage = () => {
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
            });
        }
      }; */

      //Obté els missatges del back
      /* useEffect(() => {
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
          });
      }, []); */

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
        }
      };

      /* const enviarPregunta = () => {
        setEnviar(true);
      } */

      /* useEffect(() => {
        getCorrectAnswerIndex(questionData);
      }, []); */

      const getCorrectAnswerIndex = (question) => {
        const correctAnswer = question.correct_answer;
        const answers = [question.answer1, question.answer2, question.answer3, question.answer4];
        setAnswers(answers);
        //setCorrectIndex(answers.findIndex(answer => answer === correctAnswer) + 1);
        return answers.findIndex(answer => answer === correctAnswer) + 1;
      };

      const handleOptionPress = async(questionIndex, optionIndex, isCorrectOption) => {
        if (!isAnswered[questionIndex]) {
          setSelectedOption((prevSelectedOption) => {
            const newSelectedOption = [...prevSelectedOption];
            newSelectedOption[questionIndex] = optionIndex;
            return newSelectedOption;
          });

          setIsCorrect((prevIsCorrect) => {
            const newIsCorrect = [...prevIsCorrect];
            newIsCorrect[questionIndex] = isCorrectOption;
            return newIsCorrect;
          });

          setIsAnswered((prevIsAnswered) => {
            const newIsAnswered = [...prevIsAnswered];
            newIsAnswered[questionIndex] = true;
            return newIsAnswered;
          });
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
            <TouchableOpacity>
              <Ionicons name="ellipsis-vertical" size={24} color="black" />
            </TouchableOpacity>
          </View>

          <ScrollView
        ref={flatListRef}
        contentContainerStyle={styles.messageList}
        onContentSizeChange={() => flatListRef.current.scrollToEnd({ animated: true })}
      >

        {preguntes.map((pregunta, questionIndex) => (
          <View key={questionIndex} style={styles.messageBubble}>
            <View style={styles.senderBubble}>
              <Text style={styles.text}>{pregunta.content}</Text>
              {[1, 2, 3, 4].map(optionIndex => (
                <TouchableOpacity
                key={optionIndex}
                disabled={isAnswered[questionIndex]}
                onPress={() => handleOptionPress(questionIndex, optionIndex, optionIndex === correctIndex[questionIndex])}
                style={[
                    styles.quizButton,
                    isAnswered[questionIndex] && optionIndex !== correctIndex[questionIndex] && selectedOption[questionIndex] === optionIndex ? styles.incorrectAnswer : null,
                    isAnswered[questionIndex] && optionIndex === correctIndex[questionIndex] ? styles.correctAnswer : null,
                  ]}>
                <Text style={styles.text}>{pregunta[`answer${optionIndex}`]}</Text>
              </TouchableOpacity>
              ))}
            </View>
          </View>
          ))}
      </ScrollView>

        <View style={styles.separator}>
          <View style={styles.sendMessageSection}>
            <TouchableOpacity style={styles.sendButton} onPress={fetchQuestionData}>
              <Text style={styles.text}>{t("Pregunta")}</Text>
            </TouchableOpacity>
          </View>
        </View>
        </View>
      );
}


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
        alignItems: 'center',
        backgroundColor: 'green',
        width: '100%',
        height: 30,
        borderWidth: 3,
        borderColor: 'black',
        borderRadius: 20,
        marginTop: 10,
        marginBottom: 10,
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
        alignItems: 'center',
        width: '100%',
        height: 30,
    },
    backButton: {
      position: 'absolute',
      top: 50,
      left: 30,
      zIndex: 1,
    },
    text: {
        fontWeight: 'bold'
    },
    separator: {
        borderTopWidth: 1,
        borderColor: 'grey',
    },
    quizButton: {
        width: '300px',
        heigt: '50px',
        borderWidth: 1,
        borderColor: 'black',
        borderRadius: 5,
        backgroundColor: '#d4d4d4',
        marginTop: 7,
        padding: 7
    },
    correctAnswer: {
        backgroundColor: 'green',
    },
    incorrectAnswer: {
        backgroundColor: 'red',
    }
  });

export default VistaPartida;