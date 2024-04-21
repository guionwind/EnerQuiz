import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';


import Main from './src/components/Main.jsx';
import Registre from './src/components/Registre.jsx';
import PantallaMapa from './src/components/PantallaMapa.jsx';
import QuizPreview from './src/components/QuizPreview.jsx';
import Profile from './src/components/Profile.jsx';
import ShowProfile from './src/components/ShowProfile.jsx';
import QuizScreen from './src/components/QuizScreen.jsx';
import Chat from './src/components/Chat.jsx'
import Calendario from './src/components/Calendario.jsx';
import ResultScreen from './src/components/ResultScreen.jsx'; 
import { useTranslation } from 'react-i18next';
import i18next from './services/i18next';
import Ranking from './src/components/Ranking.jsx';
import VistaAmics from './src/components/VistaAmics.jsx';
import Afegir from './src/components/Afegir.jsx';
import Configuracion from './src/components/Configuracion.jsx';
import VistaPartida from './src/components/VistaPartida.jsx';

const HomeStackNavigator = createNativeStackNavigator();
const Tab = createBottomTabNavigator();


function HomeStack() {
  return (
    <HomeStackNavigator.Navigator>
      <HomeStackNavigator.Screen
        name="Home"
        component={Main}
        options={{
          headerShown: false
        }}
      />
      <HomeStackNavigator.Screen
        name="Registre"
        component={Registre}
        options={{
          headerShown: false
        }}
      />
      <HomeStackNavigator.Screen
        name="Profile"
        component={Profile}
        options={{
          headerShown: false
        }}
      />
      <HomeStackNavigator.Screen
        name="ShowProfile"
        component={ShowProfile}
        options={{
          headerShown: false
        }}
      />
      <HomeStackNavigator.Screen
        name="QuizScreen"
        component={QuizScreen}
        options={{
          headerShown: false
        }}
      />
      <HomeStackNavigator.Screen
              name="Calendario"
              component={Calendario}
              options={{
                headerShown: false,
                tabBarVisible: true,
              }}
            />
      <HomeStackNavigator.Screen
              name="Configuracion"
              component={Configuracion}
              options={{
              headerShown: false,
              tabBarVisible: true,
               }}
            />
      <HomeStackNavigator.Screen
              name="Ranking"
              component={Ranking}
              options={{
                headerShown: false,
                tabBarVisible: true,
              }}
            />
      <HomeStackNavigator.Screen
        name="MapaIni"
        component={BottomTabBar}
        options={{
          headerShown: false
        }}
      />
      <HomeStackNavigator.Screen
        name="Afegir"
        component={Afegir}
        options={{
          headerShown: false
        }}
      />

      <HomeStackNavigator.Screen
          name="Chat"
          component={Chat}
          options={{
              headerShown: false
          }}
      />
      <HomeStackNavigator.Screen
              name="Partida"
              component={VistaPartida}
              options={{
                headerShown: false
              }}
      />

    </HomeStackNavigator.Navigator>


  );
}

function BottomTabBar() {
  const { t } = useTranslation();
  return (
    <Tab.Navigator initialRouteName="Mapa"
        screenOptions={{
        tabBarStyle: {
            paddingBottom: 5,
            paddingTop: 5,
          },
    }}>
      <Tab.Screen
        name="Mapa"
        component={PantallaMapa}
        options={{
          tabBarLabel: t('mapa'),
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="map" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Quiz"
        component={QuizPreview}
        options={{
          tabBarLabel: t('game'),
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="gamepad-variant" color={color} size={size} />
          ),
        }}
      />

      <Tab.Screen
        name="Xats"
        component={VistaAmics}
        options={{
          tabBarLabel: t('Xats'),
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="message-text" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
          name="Configuracion"
          component={Configuracion}
          options={{
            tabBarLabel: t('config'),
            headerShown: false,
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="cog" color={color} size={size} />
            ),
          }}
        />
      <Tab.Screen
              name="Calendario"
              component={Calendario}
              options={{
                headerShown: false,
                tabBarButton: () => null
               }}
            />
          <Tab.Screen
        name="ResultScreen"
        component={ResultScreen}
        options={{
          tabBarLabel: 'ResultScreen',
          headerShown: false,
          tabBarButton: () => null
        }}
      />
      <Tab.Screen
        name="QuizScreen"
        component={QuizScreen}
        options={{
          tabBarLabel: 'ResultScreen',
          headerShown: false,
          tabBarButton: () => null
        }}
      />
    </Tab.Navigator>
  );
}


export default function App() {
  return (
    <NavigationContainer>
      <HomeStack />
    </NavigationContainer>
  );
}