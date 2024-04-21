import React, { useState,useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import { StyleSheet, View,ScrollView, Text, Image, TouchableOpacity } from "react-native";
import Icon from 'react-native-vector-icons/FontAwesome';
import axios from 'axios';
import {useAppContext} from './Appcontext'
import { useTranslation } from 'react-i18next';
import i18next from '../../services/i18next';
import { useIsFocused } from '@react-navigation/native';


const Profile = () => {
  const navigation = useNavigation();
  const { mitoken} = useAppContext();
    const [nombre, setNombre] = useState('');
    const [username, setUsername] = useState('');
    const [bio, setBio] = useState('Dale a tu cuerpo alegria macarena que tu cuerpo es pa darle alegria y cosa buena dale a tu cuerpo alegria macarena eh macarena ay!');
    const [puntuacio, setPuntuacio] = useState(0);
    const [racha, setRacha] = useState(0);
    const [premioMessage, setPremioMessage] = useState('');
    const { t } = useTranslation();
    const isFocused = useIsFocused();

    useEffect(() => {
      axios.get('http://nattech.fib.upc.edu:40520/api/myProfile', {
        headers: {
          'Authorization': `Bearer ${mitoken}`,
        }
      })
        .then(response => {
          const data = response.data;
          setNombre(data.name);
          setUsername(data.username);
          setBio(data.bio);
          setPuntuacio(data.puntuacio);
          setRacha(data.racha);
        })
        .catch(error => {
          console.error('Error al obtener datos del usuario:', error);
        });
    }, [isFocused]);


  const logout = () => {
    axios.post('http://nattech.fib.upc.edu:40520/api/logout', {
    })
    navigation.navigate("Home");
  }

  const deleteAccount = () => {
    axios.delete(`http://nattech.fib.upc.edu:40520/api/myProfile`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(response => {
        if (response.status === 204) {
          console.log('Usuario eliminado con éxito');
        } else {
          console.error('Error al eliminar usuario:', response.statusText);
        }
      })
      .catch(error => {
        console.error('Error al realizar la solicitud DELETE:', error);
      });
    navigation.navigate("Home");
  }

    const reclamarPremio = () => {

        axios.get('http://nattech.fib.upc.edu:40520/api/prize', {
          headers: {
            'Authorization': `Bearer ${mitoken}`,
          }
        })
        .then(response => {
          const rdata = response.data; // Suponiendo que el mensaje se obtiene desde la respuesta del servidor
          console.log(rdata);
          const count = rdata.count;
          if (count == 0) {
          const mensaje = t("noprize");
          setPremioMessage(mensaje);
          }
          else if (count == 1) {
            const mensaje = t("prizecode");
            setPremioMessage(mensaje + rdata.result[0].code);
          }

          else {
            const mensaje = t("prizecodes");
            setPremioMessage(mensaje);
            const premioCodes = rdata.result.map(item => item.code).join(', ');
            setPremioMessage(mensaje + premioCodes);
          }
        })
        .catch(error => {
          console.error('Error al reclamar el premio:', error);
          setPremioMessage(t("errorPremi"));

        });
    }

  return (
    <View style={styles.container}>
        <TouchableOpacity style = {styles.backButton} onPress={() => navigation.goBack()}>
            <Icon name = "angle-left" size = {30} color = "black"/>
        </TouchableOpacity>
        <Text style={styles.title}>{t("profile")}</Text>
        <View style={styles.profileContainer}>
            <View style={styles.profileInfo}>
                <Image style={styles.profileImage}
                    source={require("../../assets/avatar.png")}
                />
            </View>
            <TouchableOpacity style={styles.editButton} onPress={() => navigation.navigate('ShowProfile')}>
                <Text style={styles.buttonText}>{t("editProfile")}</Text>
            </TouchableOpacity>
        </View>
        <Text style={styles.name}>{nombre}</Text>
        <Text style={styles.username}>{username}</Text>
        <ScrollView style={styles.biocontainer} showsVerticallScrollIndicator = {false}>
            <Text style={styles.bio}>{bio}</Text>
        </ScrollView>
        <Text style={styles.puntuacio}>{t("points")} {puntuacio}</Text>
        <Text style={styles.puntuacio}>{t("streak")}: {racha}</Text>
        <View style={styles.buttonsContainer}>
            <TouchableOpacity style={styles.button} onPress={reclamarPremio}>
                <Text style={styles.buttonText}>{t("claim2")}</Text>
            </TouchableOpacity>
            {premioMessage !== '' && (
                <Text style={{ color: 'black', fontSize: 16, marginTop: 10,marginBottom: 15 }}>{premioMessage}</Text>
            )}
            <TouchableOpacity style={styles.logoutButton} onPress={logout}>
                <Text style={styles.buttonTextGrey}>{t("logout")}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{backgroundColor: "white",borderColor: 'red',borderWidth: 3,
                padding: 12,borderRadius: 8,marginBottom: 8,}} onPress={deleteAccount}>
                <Text style={{color: 'red',fontSize: 16,fontWeight: "bold",textAlign: "center",}}>{t("deleteAccount")}</Text>
            </TouchableOpacity>
        </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    padding: 16,
  },
  backButton: {
      position: 'absolute',
      top: 40,
      left: 30,
      zIndex: 1,
    },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 25,
    textAlign: 'center',
    marginTop: 25,
  },
  profileContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImage: {
    width: 75,
    height: 75,
    marginLeft: 10,
    borderRadius: 75 / 2.0,
  },
  profileTextContainer: {
    marginLeft: 10,
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  username: {
    fontSize: 16,
    marginBottom: 15,
    color: "gray",
    marginLeft: 5,
  },
  editButton: {
    backgroundColor: "white",
    borderColor: '#529D09',
    borderWidth: 3,
    padding: 12,
    borderRadius: 8,
  },
  puntuacio: {
    fontSize: 18,
    marginBottom: 16,
  },
  buttonsContainer: {
    marginTop: 10,
    flexDirection: "column",
  },
  button: {
    backgroundColor: "white",
    borderColor: '#529D09',
    borderWidth: 3,
    padding: 12,
    borderRadius: 8,
    marginBottom: 8

  },
  buttonText: {
    color: '#529D09',
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  buttonTextGrey:{
    color: '#FFB500',
        fontSize: 16,
        fontWeight: "bold",
        textAlign: "center",
  },
    logoutButton: {
      backgroundColor: "white",
      borderColor: '#FFB500',
      borderWidth: 3,
      padding: 12,
      borderRadius: 8,
      marginBottom: 8,
    },


    deleteAccountButton: {
      backgroundColor: 'red',
      borderColor: 'white',
      borderWidth: 3,
      padding: 12,
      borderRadius: 8,
      marginBottom: 8,
    },

    buttonText: {
      color: '#529D09',
      fontSize: 16,
      fontWeight: "bold",
      textAlign: "center",
    },

  biocontainer: {
        maxHeight: 100,
  },

  bio: {
  fontSize: 16,}
});

export default Profile;
