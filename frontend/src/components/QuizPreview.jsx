import React, { useState, useEffect } from 'react';
import { Alert, StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import IconBar from './IconBar';
import Calendario from './Calendario';
import Ranking from './Ranking.jsx';

import { useTranslation } from 'react-i18next';
import i18next from '../../services/i18next';

import { useAppContext } from './Appcontext';
import axios from 'axios';

export default function QuizPreview() {
  const navigation = useNavigation();
  const { t } = useTranslation();
  const { mitoken } = useAppContext();

  const [quizState, setQuizState] = useState({
    answered: null,
    isCorrect: null,
  });

  const handleCalendarPress = () => {
    navigation.navigate('Calendario');
  };

  const handlePodiumPress = () => {
    navigation.navigate('Ranking');
  };

  const handleQuizPress = () => {
    navigation.navigate('QuizScreen');
  };

  useEffect(() => {
    const fetchQuizData = async () => {
      try {
        const response = await axios.get('http://nattech.fib.upc.edu:40520/api/dailyquiz/today', {
          headers: {
            'Authorization': `Bearer ${mitoken}`,
            'Content-Type': 'application/json',
          },
        });

        const data = response.data;

        setQuizState({
          answered: data.answered,
          isCorrect: data.isCorrect || null,
        });
      } catch (error) {
        console.error('Error fetching quiz data:', error);
        Alert.alert('Error: '+ error);
      }
    };

    fetchQuizData();
  }, [mitoken]);

  return (
    <View style={styles.container}>
      <IconBar handleCalendarPress={handleCalendarPress} handlePodiumPress={handlePodiumPress} />
      <View style={styles.separator} />
      <View style={styles.outerQuizBox}>
        <View style={[
          styles.quizBox,
          {
            backgroundColor: quizState.answered === "1"
              ? quizState.isCorrect === 1
                ? '#82e27a' //correcto
                : 'red' //incorrecto
              : '#82e27a' // no ha sido respondido
          }
        ]}>
          <Text style={styles.quizText}>
            {quizState.answered === "1"
              ? quizState.isCorrect === 1
                ? t('quizAnsweredCorrectly')
                : t('quizAnsweredIncorrectly')
              : t('quizNotAnswered')}
          </Text>
          {quizState.answered !== "1" && (
            <TouchableOpacity onPress={handleQuizPress} style={styles.quizButton}>
              <Text style={styles.buttonText}>{t('answerQuiz')}</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
    backgroundColor: 'white',
  },
  separator: {
    height: 2,
    backgroundColor: '#A2A2A2',
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
    borderRadius: 10,
    paddingVertical: 40,
    paddingHorizontal: 5,
    width: '70%',
  },
  quizText: {
    color: 'black',
    marginBottom: 25,
    fontWeight: 'bold',
    fontSize: 25,
    textAlign: 'center',
  },
  quizButton: {
    backgroundColor: '#158d19',
    paddingHorizontal: 25,
    paddingVertical: 15,
    borderRadius: 25,
    borderColor: 'gray',
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: 'black',
    fontSize: 20,
    fontWeight: 'bold',
  },
});
