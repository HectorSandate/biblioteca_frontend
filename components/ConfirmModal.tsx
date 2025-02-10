
import React from 'react';
import { View, StyleSheet } from 'react-native';
import Modal from 'react-native-modal';
import { Text, Button } from 'react-native-paper';

const ConfirmModal = ({ isVisible, onConfirm, onCancel, message }) => (
  <Modal isVisible={isVisible}>
    <View style={styles.modalContent}>
      <Text variant="titleMedium">{message}</Text>
      <View style={styles.buttonContainer}>
        <Button mode="contained" onPress={onConfirm}>Confirmar</Button>
        <Button mode="outlined" onPress={onCancel} style={{ marginLeft: 10 }}>Cancelar</Button>
      </View>
    </View>
  </Modal>
);

const styles = StyleSheet.create({
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    marginTop: 20,
  },
});

export default ConfirmModal;
