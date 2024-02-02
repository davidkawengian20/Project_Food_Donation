import React, {useState} from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  Button,
} from 'react-native';

const CustomModal = ({visible, onClose, onConfirm}) => {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={() => onClose()}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Konfirmasi</Text>
          <Text style={{color: 'black'}}>
            Apakah Anda yakin ingin mengirimkan donasi ini?
            {'\n'}
            Pastikan Makanan yang Anda berikan Halal
          </Text>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={() => onClose()}>
              <Text style={styles.buttonText}>Batal</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.confirmButton]}
              onPress={() => {
                onConfirm();
                onClose();
              }}>
              <Text style={styles.buttonText}>Kirim</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const Halaman1 = () => {
  const [modalConfirmVisible, setModalConfirmVisible] = useState(false);

  const handleConfirm = () => {
    // Implement your logic here
  };

  return (
    <>
      <Button
        title="Confirm"
        color="#263A29"
        textColor="white"
        onPress={() => setModalConfirmVisible(true)}
      />
      <CustomModal
        visible={modalConfirmVisible}
        onClose={() => setModalConfirmVisible(false)}
        onConfirm={handleConfirm}
      />
    </>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    elevation: 5,
  },
  modalTitle: {
    color: 'black',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 20,
  },
  button: {
    padding: 10,
    marginLeft: 10,
    borderRadius: 5,
  },
  cancelButton: {
    backgroundColor: 'red',
  },
  confirmButton: {
    backgroundColor: 'green',
  },
  buttonText: {
    color: 'white',
  },
});

export default Halaman1;
