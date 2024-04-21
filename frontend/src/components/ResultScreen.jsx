import React, { useState } from 'react';
import { Alert, View, Text, TouchableOpacity, Linking } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import i18next from '../../services/i18next';
import axios from 'axios';
import { useAppContext } from './Appcontext';

export default function ResultScreen({ route }) {
  const { questionId, question, isCorrect, correctAnswer } = route.params;
  const [rating, setRating] = useState(0);
  const { t } = useTranslation();
  const { mitoken } = useAppContext();
  const [showButton, setShowButton] = useState(false);
  const [rated, setRated] = useState(false);

  const renderHeader = () => {
    let headerText = t('incorrectAnswerMsg');
    let headerColor = 'red';
    if (isCorrect) {
      headerText = t('correctAnswerMsg');
      headerColor = 'green';
    }

    return (
      <View style={[styles.header, { backgroundColor: headerColor }]}>
        <Text style={styles.headerText}>{headerText}</Text>
      </View>
    );
  };

  const handleStarPress = (ratedStars) => {
    setRating(ratedStars);
    setShowButton(true);
  };

  const handleSaveRating = async () => {
    try {
      const response = await axios.post(
        'http://nattech.fib.upc.edu:40520/api/dailyquiz/rate?rate='+rating,
        {questionId: questionId},
        {
          headers: {
            'Authorization': `Bearer ${mitoken}`,
          }, 
        }
      );
      setShowButton(false);
      setRated(true);
    } catch (error) {
      console.error('Error ', error);
      Alert.alert('Error: '+ error);
    }
    setShowButton(false);
    setRated(true);
  };

  const renderRatingStars = () => {
    const stars = [1, 2, 3, 4, 5];

    return (
      <View style={styles.ratingContainer}>
        {stars.map((star, index) => (
          <TouchableOpacity key={index} onPress={() => handleStarPress(star)} style={{ padding: 5 }}>
            <MaterialCommunityIcons
              name={rating >= star ? 'star' : 'star-outline'}
              size={30}
              color={rating >= star ? 'gold' : 'gray'}
            />
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  const renderRatingMessage = () => {
    if (rated) {
      return <Text style={styles.messageText}>{t('alreadyRatedMessage')+  rating  + t('stars')}</Text>;
    }
    return null;
  };

  const handleShareOnWhatsapp = async () => {
    let resultMessage = isCorrect ? t('correctAnswerMsg') + '🎉' : t('incorrectAnswerMsg') + '😔';
    let message = t('whatsappMessage', { question, resultMessage });
    await Linking.openURL(`https://wa.me/?text=${encodeURIComponent(message)}`);
  };

  const handleShareOnSms = async () => {
    let resultMessage = isCorrect ? t('correctAnswerMsg') + '🎉' : t('incorrectAnswerMsg') + '😔';
    let message = t('whatsappMessage', { question, resultMessage });
    await Linking.openURL(`sms:?body=${encodeURIComponent(message)}`);
  };

  return (
    <View style={styles.container}>
      {renderHeader()}
      <View style={styles.content}>
        <Text style={styles.question}>{question}</Text>
        <Text style={styles.answer}>{t('correctAnswer')} {correctAnswer}</Text>
        {rated ? renderRatingMessage() : renderRatingStars()}
        {rating > 0 && showButton && (
          <TouchableOpacity onPress={handleSaveRating} style={styles.ratingButton}>
            <Text style={styles.buttonText}>{t('rate')}</Text>
          </TouchableOpacity>
        )}
      </View>
      <View style={styles.shareIcons}>
        <TouchableOpacity onPress={handleShareOnWhatsapp}>
          <MaterialCommunityIcons name="whatsapp" size={40} color="green" />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleShareOnSms}>
          <MaterialCommunityIcons name="message" size={40} color="grey" />
        </TouchableOpacity>
      </View>
    </View>
  );
}


const styles = ({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  header: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 10,
    width: '100%',
    height:'10%',
    alignItems: 'center',
    justifyContent:'center'
  },
  headerText: {
    fontSize: 30,
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  question: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  answer: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
  },
  ratingContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  ratingButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 50,
    elevation: 3,
    shadowColor: 'black',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  shareIcons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    width: '100%',
    paddingHorizontal: 50,
  },
  iconButton: {
    backgroundColor: 'white',
    borderRadius: 25,
    padding: 15,
    elevation: 5,
    shadowColor: 'black',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
});