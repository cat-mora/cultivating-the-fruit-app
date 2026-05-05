import { Text, View } from 'react-native';

export default function DashboardScreen() {
  return (
    <View style={{ flex: 1, padding: 20, backgroundColor: '#FFF9F0' }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#000', marginBottom: 20 }}>
        ✅ Dashboard is Working!
      </Text>
      <Text style={{ fontSize: 16, color: '#000' }}>
        If you can see this, the app is rendering correctly.
      </Text>
    </View>
  );
}
