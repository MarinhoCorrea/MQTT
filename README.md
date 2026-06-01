# MQTT Smart Home App

Aplicativo Expo React Native para controlar dispositivos e visualizar dados de sensores via MQTT.

## 📌 Sobre
Este projeto conecta-se a um broker MQTT, recebe dados de temperatura, umidade e status de luz, e armazena localmente o histórico de mensagens no dispositivo usando `AsyncStorage`.

## 🚀 Funcionalidades
- Conexão MQTT com broker remoto
- Assinatura de tópicos:
  - `casa/temp`
  - `casa/umid`
  - `casa/luz`
- Controle de luz via publicação MQTT
- Exibição de temperatura e umidade em indicadores circulares
- Histórico local de mensagens MQTT persistido no app
- Interface para limpar o histórico local

## 📁 Estrutura principal
- `App.js` - Tela principal do app e lógica de estado
- `src/services/mqttService.js` - Conexão, envio e persistência MQTT
- `src/components/LightControl.js` - Botão de controle de luz
- `src/components/Gauges.js` - Indicadores de temperatura e umidade
- `src/components/MessageHistory.js` - Lista de histórico MQTT
- `src/components/StatusModal.js` - Modal de erro de conexão

## ⚙️ Dependências
- `expo`
- `react`
- `react-native`
- `react_native_mqtt`
- `@react-native-async-storage/async-storage`
- `react-native-circular-progress-indicator`
- `react-native-svg`
- `react-native-vector-icons`
- `react-native-dotenv`

## 🔧 Configuração
1. Instale as dependências:
   ```bash
   npm install
   ```

2. Crie um arquivo `.env` a partir de `.env.example` e configure os dados do broker MQTT:
   ```text
   EXPO_PUBLIC_MQTT_HOST=seu_broker_host
   EXPO_PUBLIC_MQTT_PORT=8884
   EXPO_PUBLIC_MQTT_USER=usuario
   EXPO_PUBLIC_MQTT_PASS=senha
   EXPO_PUBLIC_MQTT_PATH=/mqtt
   ```

3. Inicie o app Expo:
   ```bash
   npm start
   ```

4. Abra no dispositivo ou emulador desejado.

## 🧠 Como funciona
- O app faz a conexão MQTT no `App.js` usando `MQTTService`.
- Ao chegar uma mensagem, ela é processada e armazenada em `AsyncStorage`.
- O histórico é carregado ao iniciar o app e exibido em `MessageHistory`.
- O histórico mantém até 50 mensagens mais recentes.


## Video Youtube
Link: https://youtu.be/DTCaLAx-wRo

