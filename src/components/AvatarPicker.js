import React from 'react';
import { Alert, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { colors, fonts } from '../constants/theme';

export default function AvatarPicker() {
  const { user, updateAvatar } = useApp();
  const initials = user?.name?.[0]?.toUpperCase() || 'S';
  const avatarSource = user?.avatar ? { uri: user.avatar } : null;

  async function pickImage(source) {
    try {
      let result;
      if (source === 'camera') {
        result = await ImagePicker.launchCameraAsync({ allowsEditing: true, aspect: [1, 1], quality: 0.7 });
      } else {
        result = await ImagePicker.launchImageLibraryAsync({ allowsEditing: true, aspect: [1, 1], quality: 0.7 });
      }

      if (!result.canceled && result.assets?.[0]?.uri) {
        await updateAvatar(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert('Não foi possível atualizar o avatar.', 'Tente novamente mais tarde.');
    }
  }

  function openPickerMenu() {
    Alert.alert('Atualizar foto de perfil', 'Escolha como deseja selecionar sua foto.', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Tirar foto', onPress: () => pickImage('camera') },
      { text: 'Escolher da galeria', onPress: () => pickImage('gallery') },
    ]);
  }

  return (
    <Pressable
      onPress={openPickerMenu}
      accessibilityRole="button"
      accessibilityLabel="Tocar para trocar sua foto de perfil"
      accessibilityHint="Abre as opções para tirar foto ou escolher uma imagem da galeria."
      style={styles.wrapper}
    >
      {avatarSource ? (
        <Image source={avatarSource} style={styles.avatarImage} />
      ) : (
        <View style={styles.avatarPlaceholder}>
          <Text style={styles.avatarText}>{initials}</Text>
        </View>
      )}
      <View style={styles.cameraBadge}>
        <MaterialCommunityIcons name="camera" color="#fff" size={16} />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrapper: { position: 'relative', width: 86, height: 86 },
  avatarImage: { width: 86, height: 86, borderRadius: 28, borderWidth: 2, borderColor: colors.primary },
  avatarPlaceholder: { width: 86, height: 86, borderRadius: 28, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: '#fff', fontFamily: fonts.displayBold, fontSize: 40 },
  cameraBadge: {
    position: 'absolute', right: 0, bottom: 0, width: 34, height: 34, borderRadius: 17, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: colors.card,
  },
});
