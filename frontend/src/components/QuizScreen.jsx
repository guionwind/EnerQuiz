import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import IconBar from './IconBar';
import Calendario from './Calendario';
import Ranking from './Ranking.jsx';

import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import i18next from '../../services/i18next';
import {useAppContext} from './Appcontext'



export default function QuizScreen() {
  const { t} = useTranslation();
  const navigation = useNavigation();
  const [selectedOption, setSelectedOption] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [questionData, setQuestionData] = useState(null);
  const [calendarioVisible, setCalendarioVisible] = useState(false);
  const { mitoken} = useAppContext();
  const [geolocaizacion, setGeolocalizacion]= useState(null)

  const handleCalendarPress = () => {
        navigation.navigate('Calendario');
    };
  const handlePodiumPress = () => {
    navigation.navigate('Ranking');
    };

  const [correctIndex, setCorrectIndex] = useState(null);

  const handleOptionPress = async(index, isCorrectOption) => {
    if (!isAnswered) {
      setSelectedOption(index);
      setIsCorrect(isCorrectOption);
      setIsAnswered(true);
      try {
        const response = await axios.post(
          'http://nattech.fib.upc.edu:40520/api/dailyquiz/new',
          {
            isCorrect: isCorrectOption ? 1 : 0,
          },
          {
            headers: {
              'Authorization': `Bearer ${mitoken}`,
            },
          }
        );
      } catch (error) {
        console.error('Error ', error);
      }
      
    }
  };

  const fetchQuestionData = async () => {
    axios.get('http://nattech.fib.upc.edu:40520/api/myProfile',{
      headers: {
        'Authorization': `Bearer ${mitoken}`,
      },
    })
      .then(response => {
        const geo = response.data.municipi_id;
        setGeolocalizacion(geo);
      })
      .catch(error => {
        console.error('Error al obtener la puntuación del usuario', error);
      });
      if(geolocaizacion==null){
        try {
      const response = await axios.get('http://nattech.fib.upc.edu:40520/api/questions/random/');
      if (response.status === 200) {
        const question = response.data.question;
        setQuestionData(question);
        const correctAnswerIndex = getCorrectAnswerIndex(question);
        setCorrectIndex(correctAnswerIndex);
      } else {
        console.error(response.statusText);
      }
    } catch (error) {
      console.error(error);
    }
      }
      else{
        try {
          const response = await axios.get('http://nattech.fib.upc.edu:40520/api/questions/municipi/id/'+geolocaizacion+'?type=random');
          if (response.status === 200) {
            const question = response.data.question;
            setQuestionData(question);
            const correctAnswerIndex = getCorrectAnswerIndex(question);
            setCorrectIndex(correctAnswerIndex);
          } else {
            console.error(response.statusText);
          }
        } catch (error) {
          console.error(error);
        }
      }
    
  };

  useEffect(() => {
    fetchQuestionData();
  }, []);

  const getCorrectAnswerIndex = (question) => {
    const correctAnswer = question.correct_answer;
    const answers = [question.answer1, question.answer2, question.answer3, question.answer4];
    return answers.findIndex(answer => answer === correctAnswer) + 1;
  };

  return (
    <View style={styles.container}>
      <IconBar handleCalendarPress={handleCalendarPress} handlePodiumPress={handlePodiumPress} />
      <View style={styles.separator} />
      <View style={styles.outerQuizBox}>
        <View style={styles.quizBox}>
          <Text style={styles.quizText}>{questionData ? questionData.content : t('loadingQuestion')}</Text>
          <View style={styles.optionsContainer}>
            {[1, 2, 3, 4].map(index => (
              <TouchableOpacity
                key={index}
                disabled={isAnswered}
                onPress={() => handleOptionPress(index, index === correctIndex)}
                style={[
                  styles.quizButton,
                  isAnswered && index !== correctIndex && selectedOption === index ? styles.incorrectAnswer : null,
                  isAnswered && index === correctIndex ? styles.correctAnswer : null,
                ]}
              >
                <Text style={styles.buttonText}>{questionData ? questionData[`answer${index}`] : t('loadingOptions')}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
      {isAnswered &&(
      <TouchableOpacity
        onPress={() => {
          navigation.navigate('ResultScreen', {
            question: questionData?.content || 'No question available',
            isCorrect: isCorrect !== null ? isCorrect : false,
            correctAnswer: questionData?.[`answer${correctIndex}`] || 'No correct answer available',
          });
        }}
        style={styles.submitButton}
        disabled={!isAnswered}>
        <Text style={styles.buttonTextWhite}>{t('nextButton')}</Text>
      </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center-start',
    padding: 16,
    backgroundColor: 'white',
  },
  separator: {
    height: 1,
    backgroundColor: 'gray',
  },
  outerQuizBox: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  quizBox: {
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: 'black',
    borderRadius: 10,
    padding: 10,
    backgroundColor: '#d3d3d3',
    width: '70%',
  },
  quizText: {
    color: 'black',
    marginBottom: 15,
    fontWeight: 'bold',
    fontSize: 25,
    textAlign: 'center',
  },
  optionsContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  quizButton: {
    padding: 15,
    borderRadius: 25,
    borderColor: 'gray',
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 10,
  },
  correctAnswer: {
    backgroundColor: 'green',
  },
  incorrectAnswer: {
    backgroundColor: 'red',
  },
  buttonText: {
    color: 'black',
    fontSize: 20,
  },
  submitButton: {
    marginTop: 20,
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: 'blue',
    borderRadius: 8,
    alignItems: 'center',
    
  },
  buttonTextWhite: {
    color: 'white',
    fontSize: 18,
  },
});