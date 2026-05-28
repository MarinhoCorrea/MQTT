import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import MQTTService from './src/services/mqttService';
import StatusModal from './src/components/StatusModal';
import LightControl from './src/components/LightControl';
import Gauges from './src/components/Gauges';
import MessageHistory from './src/components/MessageHistory';

const mqtt = new MQTTService();

export default function App() {
  const [isConnected, setIsConnected] = useState(false);
  const [showError, setShowError] = useState(false);
  const [isLightOn, setIsLightOn] = useState(false);
  const [temp, setTemp] = useState(0);
  const [hum, setHum] = useState(0);
  const [history, setHistory] = useState([]);

  const mqttConfig = {
    host: process.env.EXPO_PUBLIC_MQTT_HOST,
    port: parseInt(process.env.EXPO_PUBLIC_MQTT_PORT || '0', 10),
    path: process.env.EXPO_PUBLIC_MQTT_PATH,
    user: process.env.EXPO_PUBLIC_MQTT_USER,
    pass: process.env.EXPO_PUBLIC_MQTT_PASS,
    clientId: 'RN_App_' + Math.random(),
  };

  useEffect(() => {
    loadHistory();
    startConnection();
  }, []);

  const loadHistory = async () => {
    const saved = await mqtt.getHistory();
    setHistory(saved);
  };

  const startConnection = () => {
    setShowError(false);
    mqtt.connect(
      mqttConfig,
      (topic, message, item) => {
        if (topic === 'casa/temp') setTemp(parseFloat(message));
        if (topic === 'casa/umid') setHum(parseFloat(message));
        if (topic === 'casa/luz') setIsLightOn(message === '1');
        setHistory((prev) => [item, ...prev].slice(0, 50));
      },
      () => {
        setIsConnected(true);
        mqtt.subscribe('casa/temp');
        mqtt.subscribe('casa/umid');
        mqtt.subscribe('casa/luz');
      },
      () => {
        setIsConnected(false);
        setShowError(true);
      }
    );
  };

  const toggleLight = () => {
    const newState = isLightOn ? '0' : '1';
    mqtt.publish('casa/luz', newState);
  };

  const clearHistory = async () => {
    await mqtt.clearHistory();
    setHistory([]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Smart Home IoT</Text>

      <LightControl isLightOn={isLightOn} onToggle={toggleLight} />

      <Gauges temp={temp} hum={hum} />

      <MessageHistory messages={history} onClear={clearHistory} />

      <StatusModal
        visible={showError}
        onRetry={startConnection}
        onLater={() => setShowError(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212',
    padding: 20, alignItems: 'center'
  },
  header: { color: '#FFF', fontSize: 24,
    fontWeight: 'bold', marginTop: 40,
    marginBottom: 20
  },
});
