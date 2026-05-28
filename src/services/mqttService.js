import init from 'react_native_mqtt';
import AsyncStorage from '@react-native-async-storage/async-storage';

init({
  size: 10000,
  storageBackend: AsyncStorage,
  defaultExpires: 1000 * 3600 * 24,
  enableCache: true,
  sync: {},
});

const HISTORY_KEY = 'MQTT_HISTORY';

export default class MQTTService {
  constructor() {
    this.client = null;
  }

  async getHistory() {
    try {
      const stored = await AsyncStorage.getItem(HISTORY_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.warn('Erro ao carregar histórico MQTT', error);
      return [];
    }
  }

  async saveHistory(messages) {
    try {
      await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(messages));
    } catch (error) {
      console.warn('Erro ao salvar histórico MQTT', error);
    }
  }

  async addHistoryItem(item) {
    try {
      const current = await this.getHistory();
      const next = [item, ...current].slice(0, 50);
      await this.saveHistory(next);
    } catch (error) {
      console.warn('Erro ao adicionar item ao histórico MQTT', error);
    }
  }

  async clearHistory() {
    try {
      await AsyncStorage.removeItem(HISTORY_KEY);
    } catch (error) {
      console.warn('Erro ao limpar histórico MQTT', error);
    }
  }

  connect(config, onMessage, onConnect, onFailure) {
    const { host, port, path, user, pass, clientId } = config;

    this.client = new Paho.MQTT.Client(
      host,
      port,
      path,
      clientId
    );

    this.client.onMessageArrived = async (message) => {
      const topic = message.destinationName;
      const payload = message.payloadString;
      const item = {
        id: `${topic}-${Date.now()}`,
        topic,
        payload,
        timestamp: new Date().toLocaleString(),
      };

      await this.addHistoryItem(item);
      onMessage(topic, payload, item);
    };

    const options = {
      userName: user,
      password: pass,
      useSSL: true,
      onSuccess: onConnect,
      onFailure: onFailure,
      timeout: 3,
      keepAliveInterval: 60,
    };

    this.client.connect(options);
  }

  subscribe(topic) {
    this.client.subscribe(topic);
  }

  publish(topic, message) {
    const msg = new Paho.MQTT.Message(message);
    msg.destinationName = topic;
    this.client.send(msg);
  }
}