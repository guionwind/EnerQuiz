import { StatusBar } from 'expo-status-bar';
import { AppProvider } from './src/components/Appcontext';
import { StyleSheet, Text, View } from 'react-native';
import Navigation from "./Navigation"
import Main from "./src/components/Main.jsx"
import i18next, {languageResources} from './services/i18next';


export default function App() {
  return (
    <AppProvider>
    <Navigation></Navigation>
    </AppProvider>
  );
}

