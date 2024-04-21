import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { useAppContext } from './Appcontext';

export default function IconBar({ handleCalendarPress, handlePodiumPress }) {
  const [score, setScore] = useState(0);
  const { mitoken } = useAppContext();

  useEffect(() => {
    axios.get('http://nattech.fib.upc.edu:40520/api/myProfile',{
      headers: {
        'Authorization': `Bearer ${mitoken}`,
      },
    })
      .then(response => {
        const userScore = response.data.puntuacio;
        setScore(userScore);
      })
      .catch(error => {
        console.error('Error al obtener la puntuación del usuario', error);
      });
  }, []);

  return (
    <View style={styles.iconBar}>
      <TouchableOpacity onPress={handleCalendarPress}>
        <Ionicons name="calendar" size={30} color="#FFD700" />
      </TouchableOpacity>
      <View style={styles.scoreContainer}>
        <Ionicons name="leaf" size={30} color="green" />
        <Text style={styles.scoreText}>{score}</Text>
      </View>
      <TouchableOpacity onPress={handlePodiumPress}>
        <Ionicons name="podium" size={30} color="black" />
      </TouchableOpacity>
      <View style={styles.separator} />
    </View>
  );
}

const styles = StyleSheet.create({
  iconBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 5,
  },
  scoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  scoreText: {
    marginLeft: 5,
  },
  separator: {
    height: 1,
    backgroundColor: 'gray',
  },
});
