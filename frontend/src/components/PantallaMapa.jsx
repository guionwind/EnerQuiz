import React, {useState, useCallback, useRef, useEffect } from "react";
import Constants from 'expo-constants'
import { NavigationContainer } from '@react-navigation/native';
import {useNavigation, useFocusEffect} from '@react-navigation/native'
import Icon from 'react-native-vector-icons/FontAwesome';
import PopupCuadreInfo from './PopupCuadreInfo';
import {Alert, StyleSheet, View, Text, TextInput, Image, TouchableOpacity, Modal} from 'react-native'
import MapView, {Marker} from "react-native-maps";
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import i18next from '../../services/i18next';
import { FontAwesome, Entypo } from '@expo/vector-icons';


function PantallaMapa() {
  const { t } = useTranslation();
  const mapRef = useRef(null);
  const navigation = useNavigation();

  const [comarques, setComarques] = useState([]);
  const [municipis, setMunicpis] = useState([]);
  const [municipisPintats, setMunicipisPintats] = useState([]);
  const [infoComarca, setInfoComarca] = useState([]);
  const [infoMunicipi, setInfoMunicipi] = useState([]);
  const [identComarca, setIdentComarca] = useState([]);
  const [identMunicipi, setIdentMunicipi] = useState([]);
  const [puntsCarrega, setPuntsCarrega] = useState([]);
  const [InputMunicipi, setInputMunicipi] = useState('');
  const [Municipi, setMunicipi] = useState([]);
  const [ComarquesFiltrades, setComarquesFiltrades] = useState([]);
  const [origen, setOrigen] = useState({
      latitude: 41.8781,
      longitude: 1.7831,
      latitudeDelta: 1.5,
      longitudeDelta: 1.5
  });
  const [mostrarMarcadors, setMostrarMarcadors] = useState(true);
  const [mostrarMarcadorsMunicipi, setMostrarMarcadorsMunicipi] = useState(false);
  const [mostrarBotonComarca, setMostrarBotonComarca] = useState(false);
  const [popupVisible, setPopupVisible] = useState(false);
  const [marcadorSeleccionado, setMarcadorSeleccionado] = useState(null);
  const [mostrarFiltres, setMostrarFiltres] = useState(false);
  const [mostrarPuntsCarrega, setMostrarPuntsCarrega] = useState(false);
  const [mostrarMunicipiFiltrat, setMostrarMunicipiFiltrat] = useState(false);
  const [mostrarComarquesFiltrades, setMostrarComarquesFiltrades] = useState(false);
  const [CargadorsBtn, setCarregadorsBtn] = useState(false);
  const [Consum1Presionat, setConsum1Presionat] = useState(false);
  const [Consum2Presionat, setConsum2Presionat] = useState(false);
  const [Consum3Presionat, setConsum3Presionat] = useState(false);

  const [municipipop, setMunicipipop] = useState([]);
  const [comarcapop, setComarcapop] = useState([]);
  const [primari, setPrimari] = useState();
  const [industrial, setIndustrial] = useState();
  const [construccio, setConstruccio] = useState();
  const [terciari, setTerciari] = useState();
  const [domestic, setDomestic] = useState();

  //es fan les crides al back quan es monta el component
  useEffect(() => {
    const obtenirComarques = async () => {
      try {
        const response = await axios.get('http://nattech.fib.upc.edu:40520/api/comarques');
        if (response.status === 200) {
          setComarques(response.data);
        } else {
          Alert.alert('Error al carregar les comarques');
          //console.log(response.status);
        }
      } catch (error) {
        console.error('Error en la llamada POST:', error);
        Alert.alert('Error al carregar les comarques');
        //console.log('Detalles del error:', error.response?.data);
      }
    };

    const obtenirMunicipis = async () => {
      try {
        const response = await axios.get('http://nattech.fib.upc.edu:40520/api/municipis');
        if (response.status === 200) {
          setMunicpis(response.data);
        } else {
          Alert.alert('Error al carregar els municipis');
          //console.log(response.status);
        }
      } catch (error) {
        console.error('Error en la llamada POST:', error);
        Alert.alert('Error al carregar els municipis');
        //console.log('Detalles del error:', error.response?.data);
      }
    };

    obtenirComarques();
    obtenirMunicipis();
  },[]);

        const obtenirInfoComarca = async () => {
              try {
                const response = await axios.get('http://nattech.fib.upc.edu:40520/api/comarques/' + identComarca);
                if (response.status === 200) {
                  setInfoComarca(response.data);
                } else {
                  Alert.alert('Error al carregar la info de la comarca');
                  //console.log(response.status);
                }
              } catch (error) {
                console.error('Error en la llamada POST info Comarca:', error);
                Alert.alert('Error al carregar la info de la comarca');
                //console.log('Detalles del error:', error.response?.data);
              }
            };

        const obtenirInfoMunicipi = async () => {
                      try {
                        const response = await axios.get('http://nattech.fib.upc.edu:40520/api/municipis/' + identMunicipi );
                        if (response.status === 200) {
                          setInfoMunicipi(response.data);
                        } else {
                          Alert.alert('Error al carregar la info del municipi');
                          //console.log(response.status);
                        }
                      } catch (error) {
                        console.error('Error en la llamada POST info Municipi:', error);
                        Alert.alert('Error al carregar la info del municipi');
                        //console.log('Detalles del error:', error.response?.data);
                      }
                    };

      const obtenirPuntsCarrega = async () => {
        setMostrarComarquesFiltrades(false);
        setCarregadorsBtn(true);
        setMostrarMunicipiFiltrat(true);
        setMostrarPuntsCarrega(true);
        setMostrarMarcadors(false);
        setMostrarMarcadorsMunicipi(false);
        setConsum1Presionat(false);
        setConsum2Presionat(false);
        setConsum3Presionat(false);
        setInputMunicipi("");
          try {
            const response = await axios.get('https://govolt.fly.dev/api/chargers/all');
            if (response.status === 200) {
              setPuntsCarrega(response.data);
            } else {
              Alert.alert('Error al carregar els punts de càrrega');
              //console.log(response.status);
            }
          } catch (error) {
            console.error('Error en la llamada GET carregadors:', error);
            console.log('Detalles del error:', error.response?.data);
          }
        };

        const handleFiltrarMunicipi = async () => {
          setMostrarComarquesFiltrades(false);
          setCarregadorsBtn(false);
          setMostrarMunicipiFiltrat(true);
          setMostrarPuntsCarrega(false);
          setMostrarMarcadors(false);
          setMostrarMarcadorsMunicipi(false);
          setConsum1Presionat(false);
          setConsum2Presionat(false);
          setConsum3Presionat(false);
            try {
              const response = await axios.get(`http://nattech.fib.upc.edu:40520/api/municipis/search?name=${InputMunicipi}`);
              if (response.status === 200) {
                setMunicipi(response.data.municipis);
                setInputMunicipi("");
              } else {
                Alert.alert('Error al filtrar el municipi');
                //console.log(response.status);
              }
            } catch (error) {
              console.error('Error en la llamada GET filtrar municipi:', error);
              console.log('Detalles del error:', error.response?.data);
              Alert.alert('Error al filtrar el municipi');
            }
        };

        const handleFiltrarConsums = async (minim, maxim) => {
          setMostrarComarquesFiltrades(true);
          setCarregadorsBtn(false);
          setMostrarMunicipiFiltrat(false);
          setMostrarPuntsCarrega(false);
          setMostrarMarcadors(false);
          setMostrarMarcadorsMunicipi(false);
          setInputMunicipi("");
          setConsum1Presionat(false);
          setConsum2Presionat(true);
          setConsum3Presionat(false);
            try {
              const response = await axios.get(`http://nattech.fib.upc.edu:40520/api/comarques?min=${minim}&max=${maxim}`);
              console.log(response.data);
              if (response.status === 200) {
                setComarquesFiltrades(response.data);
              } else {
                Alert.alert('Error al filtrar les comarques');
                //console.log(response.status);
              }
            } catch (error) {
              console.error('Error en la llamada GET filtrar comarques:', error);
              console.log('Detalles del error:', error.response?.data);
            }
        };


        const handleFiltrarConsumsMax = async (minim) => {
          setMostrarComarquesFiltrades(true);
          setCarregadorsBtn(false);
          setMostrarMunicipiFiltrat(false);
          setMostrarPuntsCarrega(false);
          setMostrarMarcadors(false);
          setMostrarMarcadorsMunicipi(false);
          setInputMunicipi("");
          
          setConsum1Presionat(false);
          setConsum2Presionat(false);
          setConsum3Presionat(true);
         
            try {
              const response = await axios.get(`http://nattech.fib.upc.edu:40520/api/comarques?min=${minim}`);
              console.log('comarques', response.data);
              if (response.status === 200) {
                setComarquesFiltrades(response.data);
              } else {
                Alert.alert('Error al filtrar les comarques');
                //console.log(response.status);
              }
            } catch (error) {
              console.error('Error en la llamada GET filtrar comarques:', error);
              console.log('Detalles del error:', error.response?.data);
            }
        };

        const handleFiltrarConsumsMin = async (maxim) => {
          setMostrarComarquesFiltrades(true);
          setCarregadorsBtn(false);
          setMostrarMunicipiFiltrat(false);
          setMostrarPuntsCarrega(false);
          setMostrarMarcadors(false);
          setMostrarMarcadorsMunicipi(false);
          setInputMunicipi("");
          
          setConsum1Presionat(true);
          setConsum2Presionat(false);
          setConsum3Presionat(false);
         
            try {
              const response = await axios.get(`http://nattech.fib.upc.edu:40520/api/comarques?max=${maxim}`);
              console.log('comarques', response.data);
              if (response.status === 200) {
                setComarquesFiltrades(response.data);
              } else {
                Alert.alert('Error al filtrar les comarques');
                //console.log(response.status);
              }
            } catch (error) {
              console.error('Error en la llamada GET filtrar comarques:', error);
              console.log('Detalles del error:', error.response?.data);
            }
        };


        const handleMapaPress = () => {
          setMostrarMarcadors(mostrarMarcadors);
          setMostrarMarcadorsMunicipi(mostrarMarcadorsMunicipi);
          setMostrarPuntsCarrega(mostrarPuntsCarrega);
          setMostrarMunicipiFiltrat(mostrarMunicipiFiltrat);
          setMostrarComarquesFiltrades(mostrarComarquesFiltrades);
        }

        const handleMarkerPress = (comarca) => {
          setComarcapop(comarca.name);
          cridacoma(comarca.name);
          setMostrarMarcadorsMunicipi(true);
          setMarcadorSeleccionado(comarca.name);
          setPopupVisible(true);
          setMostrarBotonComarca(true);
          setOrigen({
            latitude: comarca.latitude,
            longitude: comarca.longitude,
            latitudeDelta: 0.005,
            longitudeDelta: 0.005
          });
          setIdentComarca(comarca.id);
          obtenirInfoComarca();
          mostrarMunicipis(comarca.id);
        };


        const cridacoma = async (coma) => {
          const nom = coma.toUpperCase();
          axios.get('http://nattech.fib.upc.edu:40520/api/dades/comarca/' + nom + '/PRIMARI')
      .then(response => {
        if(response.data !== null){
          setPrimari(response.data.valorEnergia);
        }
      })
      .catch(error => {
        if (error.response) {
          // El servidor respondió con un código de estado diferente de 2xx
          console.error('Respuesta del servidor con error:', error.response.data);
        } else if (error.request) {
          // La solicitud fue hecha pero no se recibió respuesta
          console.error('No se recibió respuesta del servidor');
        } else {
          // Algo sucedió en la configuración de la solicitud que causó el error
          console.error('Error de configuración de la solicitud:', error.message);
        }
      });

      axios.get('http://nattech.fib.upc.edu:40520/api/dades/comarca/' + nom + '/INDUSTRIAL')
      .then(response => {
        if(response.data !== null){
          setIndustrial(response.data.valorEnergia);
        }
      })
      .catch(error => {
        console.error('Error al realizar la solicitud DELETE:', error);
      });


      axios.get('http://nattech.fib.upc.edu:40520/api/dades/comarca/' + nom + '/CONSTRUCCIO%20I%20OBRES%20PUBLIQUES')
      .then(response => {
          setConstruccio(response.data.valorEnergia);
      })
      .catch(error => {
        console.error('Error al realizar la solicitud DELETE:', error);
      });


      axios.get('http://nattech.fib.upc.edu:40520/api/dades/comarca/' + nom + '/TERCIARI')
      .then(response => {
        if(response.data !== null){
          setTerciari(response.data.valorEnergia);
        }
      })
      .catch(error => {
        console.error('Error al realizar la solicitud DELETE:', error);
      });


      axios.get('http://nattech.fib.upc.edu:40520/api/dades/comarca/' + nom + '/USOS%20DOMESTICS')
      .then(response => {
        if(response.data !== null){
          setDomestic(response.data.valorEnergia);
        }
      })
      .catch(error => {
        console.error('Error al realizar la solicitud DELETE:', error);
      });

    };






        //accio que es fa quan es clica un marcador de municipi
        const handleMarkerPressMunicipi = (municipi) => {
          cridamuni(municipi.name);
          setMunicipipop(municipi.name);
          setMarcadorSeleccionado(municipi.name);
          setPopupVisible(true);
          setMostrarBotonComarca(true);
          setOrigen({
            latitude: municipi.latitude,
            longitude: municipi.longitude,
            latitudeDelta: 0.005,
            longitudeDelta: 0.005
          });
          setIdentMunicipi(municipi.id);
          obtenirInfoMunicipi();
        };



        const cridamuni = async (muni) => {
              const nom = muni.toUpperCase();
              axios.get('http://nattech.fib.upc.edu:40520/api/dades/municipis/' + nom + '/PRIMARI')
          .then(response => {
            if(response.data !== null){
              if(!isNaN(response.data.valorEnergia))
              setPrimari(response.data.valorEnergia);
            }
          })
          .catch(error => {
            if (error.response) {
              // El servidor respondió con un código de estado diferente de 2xx
              console.error('Respuesta del servidor con error:', error.response.data);
            } else if (error.request) {
              // La solicitud fue hecha pero no se recibió respuesta
              console.error('No se recibió respuesta del servidor');
            } else {
              // Algo sucedió en la configuración de la solicitud que causó el error
              console.error('Error de configuración de la solicitud:', error.message);
            }
          });

          axios.get('http://nattech.fib.upc.edu:40520/api/dades/municipis/' + nom + '/INDUSTRIAL')
          .then(response => {
            if(response.data !== null){
              if(!isNaN(response.data.valorEnergia))
              setIndustrial(response.data.valorEnergia);
            }
          })
          .catch(error => {
            console.error('Error al realizar la solicitud DELETE:', error);
          });


          axios.get('http://nattech.fib.upc.edu:40520/api/dades/municipis/' + nom + '/CONSTRUCCIO%20I%20OBRES%20PUBLIQUES')
          .then(response => {
            if(response.data !== null){
              if(!isNaN(response.data.valorEnergia))
              setConstruccio(response.data.valorEnergia);
            }
          })
          .catch(error => {
            console.error('Error al realizar la solicitud DELETE:', error);
          });


          axios.get('http://nattech.fib.upc.edu:40520/api/dades/municipis/' + nom + '/TERCIARI')
          .then(response => {
            if(response.data !== null){
              if(!isNaN(response.data.valorEnergia))
              setTerciari(response.data.valorEnergia);
            }
          })
          .catch(error => {
            console.error('Error al realizar la solicitud DELETE:', error);
          });


          axios.get('http://nattech.fib.upc.edu:40520/api/dades/municipis/' + nom + '/USOS%20DOMESTICS')
          .then(response => {
            if(response.data !== null){
              if(!isNaN(response.data.valorEnergia))
              setDomestic(response.data.valorEnergia);
            }
          })
          .catch(error => {
            console.error('Error al realizar la solicitud DELETE:', error);
          });



        };


        //mostra els municipis
        const mostrarMunicipis = (idcomarca) => {
          if(mostrarMarcadorsMunicipi) {
            const municipisFiltrats = municipis.filter((municipi) => municipi.comarca_id === idcomarca);
            setMunicipisPintats(municipisFiltrats)
          }
        }

        const handleBotonComarcaPress = () => {
          if(!mostrarPuntsCarrega) {
            setMostrarMarcadors(true);
          }
          setMunicipisPintats([]);
          setMostrarMarcadorsMunicipi(false);
          setMostrarBotonComarca(false);
          const initialRegion = {
              latitude: 41.8781,
              longitude: 1.7831,
              latitudeDelta: 1.5,
              longitudeDelta: 1.5,
            };
            mapRef.current.animateToRegion(initialRegion, 300);
        };


        const cerrarPopup = () => {
              setPopupVisible(false);
              setMarcadorSeleccionado(null);
        };

        const handleBorraBtnPress = () => {
          setInputMunicipi("");
          setMunicipisPintats([]);
          setMostrarMarcadorsMunicipi(false);
          setMostrarComarquesFiltrades(false);
          setMostrarMarcadors(true);
          setMostrarBotonComarca(false);
          setMostrarPuntsCarrega(false);
          setMostrarMunicipiFiltrat(false);
          setCarregadorsBtn(false);
          setConsum1Presionat(false);
          setConsum2Presionat(false);
          setConsum3Presionat(false);
          };


    return (
      <View style={styles.container}>
       {mostrarBotonComarca && (
              <TouchableOpacity style={styles.botonComarca} onPress={()=> handleBotonComarcaPress()}>
                <Icon name="arrow-left" size={20} color="grey" />
                <Text style={styles.botonComarcaText}>{t('Comarques')}</Text>
              </TouchableOpacity>
            )}
            <View style={styles.botonDerecha}>
                <Icon name="user-circle" size={35} color="black" onPress={() => navigation.navigate("Profile")} />
                <TouchableOpacity
                  onPress={() => setMostrarFiltres(true)}>
                  <FontAwesome name="filter" size={35} color="black" />
                </TouchableOpacity>
            </View>
            <Modal
              animationType="slide"
              transparent
              visible={mostrarFiltres}
            >
              <View style={styles.filtresContainer}>
                <View style={styles.CloseContainer}>
                  <TouchableOpacity onPress={() => setMostrarFiltres(false)}>
                    <Entypo name="cross" size={24} color="black" />
                  </TouchableOpacity>
                </View>
                <View style={styles.textContainer}>
                  <Text style={styles.titol}>{t('Filtres')}</Text>
                </View>
                <View style={styles.inputContainer}>
                  <TextInput 
                    style={styles.input}
                    placeholder={t('Nom del municipi')}
                    onChangeText={setInputMunicipi}
                    value = {InputMunicipi}
                  >
                  </TextInput>
                  <TouchableOpacity style={styles.cercaBtn} onPress={handleFiltrarMunicipi}>
                    <Text>{t('Cercar')}</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.ConsumsTextContainer}>
                  <Text style={styles.text}>{t('Consums en')}</Text>
                  <Text style={styles.text}>  MWh</Text>
                </View>
                <View style={styles.consumsContainer}>
                  <View style={styles.OpcionsConsumContainer}>
                    {Consum1Presionat ? (
                      <TouchableOpacity style={styles.ConsumBtnPresionat} onPress={() => handleFiltrarConsumsMin(10000000000)}>
                        <Text style={styles.text}>- 10</Text>
                      </TouchableOpacity>
                    ) : (
                      <TouchableOpacity style={styles.ConsumBtn} onPress={() => handleFiltrarConsumsMin(10000000000)}>
                        <Text style={styles.text}>- 10</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                  <View style={styles.OpcionsConsumContainer}>
                    {Consum2Presionat ? (
                      <TouchableOpacity style={styles.ConsumBtnPresionat} onPress={() => handleFiltrarConsums(10000000000, 50000000000)}>
                        <Text style={styles.text}>10-50</Text>
                      </TouchableOpacity>
                    ) : (
                      <TouchableOpacity style={styles.ConsumBtn} onPress={() => handleFiltrarConsums(10000000000, 50000000000)}>
                        <Text style={styles.text}>10-50</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                  <View style={styles.OpcionsConsumContainer}>
                    {Consum3Presionat ? (
                      <TouchableOpacity style={styles.ConsumBtnPresionat} onPress={() => handleFiltrarConsumsMax(50000000000)}>
                        <Text style={styles.text}>+ 50</Text>
                      </TouchableOpacity>
                    ) : (
                      <TouchableOpacity style={styles.ConsumBtn} onPress={() => handleFiltrarConsumsMax(50000000000)}>
                        <Text style={styles.text}>+ 50</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
                <View style={styles.PuntsCarregaContainer}>
                  <Text style={styles.text}>{t('Carregadors')}</Text>
                  {CargadorsBtn ? (
                    <TouchableOpacity style={styles.PuntcarregaBtn} onPress={obtenirPuntsCarrega}>
                      <Entypo name="battery" size={24} color="green" />
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity style={styles.PuntcarregaBtn} onPress={obtenirPuntsCarrega}>
                      <Entypo name="battery" size={24} color="black" />
                    </TouchableOpacity>
                  )}
                </View>
                <View style={styles.BorrarContainer}>
                  <TouchableOpacity style={styles.BorrarBtn} onPress={handleBorraBtnPress}>
                    <Text>{t('Esborrar filtres')}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>
        <MapView style={styles.mapa}
            ref={mapRef}
            initialRegion={{
            latitude: origen.latitude,
            longitude: origen.longitude,
            latitudeDelta: origen.latitudeDelta,
            longitudeDelta: origen.longitudeDelta
            }}
            onPress={() => {
              handleMapaPress();
            }}>

            {mostrarMarcadors && comarques.map((comarca) => (
                <Marker
                key={comarca.name}
                coordinate={{
                    latitude: comarca.latitude,
                    longitude: comarca.longitude
                }}
                onPress={() => {
                    handleMarkerPress(comarca);
                }}>
                <PopupCuadreInfo
                    visible={comarca.name === marcadorSeleccionado}
                    onClose={cerrarPopup}
                    titulo={comarcapop}
                    primari={primari}
                    industrial={industrial}
                    construccio={construccio}
                    terciari={terciari}
                    domestic={domestic}
                  />
                </Marker>
            ))}

            {mostrarMarcadorsMunicipi && municipisPintats.map((municipi) => (
                <Marker
                key={municipi.name}
                pinColor="green"
                coordinate={{
                    latitude: municipi.latitude,
                    longitude: municipi.longitude
                }}
                onPress={() => {
                    handleMarkerPressMunicipi(municipi);
                }}>
                <PopupCuadreInfo
                    visible={municipi.name === marcadorSeleccionado}
                    onClose={cerrarPopup}
                    titulo={municipipop}
                    primari={primari}
                    industrial={industrial}
                    construccio={construccio}
                    terciari={terciari}
                    domestic={domestic}
                  />
                </Marker>
            ))}

            {mostrarMunicipiFiltrat && Municipi.map((municipi) => (
                <Marker
                key={municipi.name}
                pinColor="green"
                coordinate={{
                    latitude: municipi.latitude,
                    longitude: municipi.longitude
                }}
                onPress={() => {
                    handleMarkerPressMunicipi(municipi);
                }}>
                <PopupCuadreInfo
                    visible={municipi.name === marcadorSeleccionado}
                    onClose={cerrarPopup}
                    titulo={municipi.name}
                    informacion={infoMunicipi.consum_kwh}
                  />
                </Marker>
            ))}

              {mostrarComarquesFiltrades && ComarquesFiltrades.map((comarca) => (
                <Marker
                key={comarca.name}
                coordinate={{
                    latitude: comarca.latitude,
                    longitude: comarca.longitude
                }}
                onPress={() => {
                    handleMarkerPress(comarca);
                }}>
                <PopupCuadreInfo
                    visible={comarca.name === marcadorSeleccionado}
                    onClose={cerrarPopup}
                    titulo={comarca.name}
                    informacion={infoComarca.consum_kwh}
                  />
                </Marker>
            ))}

            {mostrarPuntsCarrega && puntsCarrega.map((carregador) => (
                <Marker
                key={carregador.charger_id}
                pinColor="blue"
                coordinate={{
                    latitude: carregador.longitude,
                    longitude: carregador.latitude
                }}>
                </Marker>
            ))}
        </MapView>
      </View>
    );
  }
  
  
    const styles = StyleSheet.create({
      container: {
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'white',
        },
        mapa: {
            width: '100%',
            height: '100%',
        },
         botonComarca: {
              backgroundColor: 'white', // Color de fondo del botón
              borderRadius: 20, // Radio para hacerlo redondeado
              padding: 10, // Espaciado interno para alargar el botón
              flexDirection: 'row', // Para que el icono y el texto estén en la misma fila
              alignItems: 'center', // Centra el contenido horizontalmente
              top: 54,
              left: 10,
              zIndex: 1,
              position: 'absolute',

            },
            botonComarcaText: {
              color: 'grey', // Color del texto
              marginLeft: 10, // Espaciado entre el icono y el texto
              zIndex: 1,
            },
          botonDerecha: {
            position: 'absolute',
            alignItems: 'center',
            borderRadius: 35,
            top: 40,
            right: 15,
            zIndex: 1,
          },
          input: {
            backgroundColor: 'white',
            width: 165,
            height: 30,
            borderWidth: 1,
            borderColor: 'black',
            borderRadius: 5,
            padding: 5,
          },
          buscador: {
            alignItems: 'center',
            flexDirection: 'row',
            position: 'absolute',
            width: 200,
            height: 30,
            top: 40,
            right: 100,
            zIndex: 1,
          },
          cercaBtn: {
            backgroundColor: '#529D09',
            alignItems: 'center',
            borderWidth: 2,
            borderColor: 'black',
            borderRadius: 20,
            width: 85,
            marginLeft: 5
          },
          filtresContainer: {
            alignItems: 'center',
            backgroundColor: 'white',
            position: 'absolute',
            borderRadius: 10,
            padding: 10,
            borderWidth: 3,
            borderColor: 'black',
            width: 300,
            height: 400,
            top: 70,
            right: 45
          },
          titol: {
            fontWeight: 'bold',
            fontSize: 25
          },
          text: {
            fontWeight: 'bold',
            fontSize: 16
          },
          textContainer: {
            alignItems: 'center',
            marginTop: 5,
            marginBottom: 10
          },
          inputContainer: {
            alignItems: 'center',
            marginTop: 20,
            justifyContent: 'center',
            flexDirection: 'row',
            width: 275,
            marginBottom: 5
          },
          PuntsCarregaContainer: {
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'row',
            width: 200,
            marginTop: 40,
            marginBottom: 5
          },
          PuntcarregaBtn: {
            alignItems: 'center',
            borderWidth: 3,
            borderColor: 'black',
            borderRadius: 20,
            width: 75,
            marginTop: 5,
            marginLeft: 10
            
          },
          CloseContainer: {
            alignItems: 'center',
            position: 'absolute',
            width: 25,
            height: 25,
            top: 5,
            right: 10
          },
          BorrarContainer: {
            alignItems: 'center',
            width: 250,
            height: 50,
            marginTop: 45
          },
          BorrarBtn: {
            alignItems: 'center',
            borderWidth: 1,
            borderColor: 'black',
            borderRadius: 20,
            width: 150,
            marginTop: 5
          },
          consumsContainer: {
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'row',
            width: 200,
            marginTop: 5,
            marginBottom: 5
          },
          OpcionsConsumContainer: {
            alignItems: 'center',
            justifyContent: 'center',
            width: 80,
            height: 30
          },
          ConsumBtn: {
            alignItems: 'center',
            justifyContent: 'center',
            borderWidth: 1,
            borderColor: 'black',
            borderRadius: 20,
            width: 75,
            marginTop: 5,
            backgroundColor: 'white'
          },
          ConsumBtnPresionat: {
            alignItems: 'center',
            justifyContent: 'center',
            borderWidth: 1,
            borderColor: 'black',
            borderRadius: 20,
            width: 75,
            marginTop: 5,
            backgroundColor: '#D4D4D4'
          },
          ConsumsTextContainer: {
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: "row",
            width: 250,
            height: 30,
            marginTop: 45
          }
    });
    
  
  export default PantallaMapa;