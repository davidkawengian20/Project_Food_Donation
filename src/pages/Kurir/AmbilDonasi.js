import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';

function AmbilDonasi({route, navigation}) {
  const [jsonData, setJsonData] = useState([]);
  const [json_data_donasi, setJsonDataDonasi] = useState([]);
  const [dataKosong, setDataKosong] = useState(false);

  useEffect(() => {
    let timeoutId;

    const fetchData = async () => {
      try {
        const {jsonData} = route.params;

        setJsonData(jsonData);

        const requestBody = {
          'user-role': 'kurir',
        };

        const response = await fetch(
          'https://fdonasi.site/foodDonation/public/mobile/listDonationKurir/',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: Object.keys(requestBody)
              .map(
                key =>
                  `${encodeURIComponent(key)}=${encodeURIComponent(
                    requestBody[key],
                  )}`,
              )
              .join('&'),
          },
        );

        clearTimeout(timeoutId); // Clear the timeout when data is received

        const textData = await response.text();
        console.log('Data :');
        console.log(textData);

        if (textData.includes('ERROR')) {
          Alert.alert(
            'Error Message',
            'Sorry, access data failed. Please try again.',
          );
          return;
        } else if (textData.includes('No donation in database')) {
          Alert.alert('Masih Kosong', 'Belum ada Donasi Masuk.');
          setDataKosong(true);
          return;
        } else {
          const dataArray = textData.split('SUCCESS');
          const datadonasi = dataArray[1];

          const json_data_donasi = JSON.parse(datadonasi);
          setJsonDataDonasi(json_data_donasi);
        }
      } catch (error) {
        Alert.alert(
          'Error Message',
          'Sorry, we have got an error. Please try again.',
        );
        return;
      }
    };

    timeoutId = setTimeout(() => {
      Alert.alert(
        'Error Message',
        'Sorry, the request has timed out. Please try again.',
      );
    }, 5000);

    Promise.race([fetchData(), timeoutId]);
  }, []);

  const test = async itemId => {
    const selectedItem = json_data_donasi.find(
      item => item.Donation_ID === itemId,
    );
    console.log('testing');
    console.log(jsonData[0].Kurir_ID);
    console.log(selectedItem.Donation_ID);
  };

  const handleConfirm = async itemId => {
    // Create a new FormData object
    const formData = new FormData();

    // Use the itemId to access the corresponding data from json_data_donasi
    const selectedItem = json_data_donasi.find(
      item => item.Donation_ID === itemId,
    );

    // Log the id and keluarga

    console.log(`Kurir ID : ${jsonData[0].Kurir_ID}`);
    console.log(`ID Donasi : ${selectedItem.Donation_ID}`);

    // Append data to formData
    formData.append('Kurir_ID', jsonData[0].Kurir_ID);
    formData.append('id_donasi', selectedItem.Donation_ID);

    try {
      const response = await fetch(
        'https://fdonasi.site/foodDonation/public/mobile/addKurir/',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'multipart/form-data',
            // Tambahkan header lain yang diperlukan oleh API Anda
          },
          body: formData,
        },
      );
      console.log('\n\nData yang terkirim (formData) :');
      console.log(formData);

      const textData = await response.text();
      console.log('Respon dari server:', textData);

      if (textData.includes('ERROR')) {
        Alert.alert(
          'Donasi Gagal',
          'Maaf, Kirim Donasi Gagal, Silakan coba lagi.',
        );
      } else if (textData.includes('SUCCESS')) {
        Alert.alert('Donasi Berhasil', 'Donasi Sudah berhasil terkirim.');

        // Reset semua field input
        // setValue([]);

        // Navigasi ke halaman login
        // navigation.navigate('SignIn');
        navigation.navigate('KurirHome', {jsonData: jsonData});
      }
    } catch (error) {
      console.error('Error:', error.message);
      Alert.alert(
        'Terjadi Kesalahan',
        'Maaf, terjadi kesalahan. Silakan coba lagi nanti.',
      );
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate('KurirHome', {
              jsonData: jsonData,
            })
          }
          style={{flexDirection: 'row', paddingLeft: 20}}>
          <MaterialCommunityIcons
            name="keyboard-backspace"
            size={26}
            color="white"
          />
        </TouchableOpacity>
        <Text
          style={{
            fontSize: 21,
            textAlign: 'left',
            flex: 1,
            fontWeight: 'bold',
            paddingLeft: 30,
            color: 'white',
          }}>
          Ambil Donasi
        </Text>
      </View>

      {json_data_donasi ? (
        <View style={styles.content} backgroundColor="#fff">
          {dataKosong && (
            <View style={styles.itemContainer}>
              <Text style={{color: 'black'}}>Belum ada Donasi Masuk.</Text>
            </View>
          )}
          <ScrollView>
            {json_data_donasi.map((item, index) => (
              <TouchableOpacity key={index} style={styles.itemContainer}>
                <View style={styles.itemDetails}>
                  <View style={styles.headerCard}>
                    <Text style={styles.itemName}>{item.Username}</Text>
                    <TouchableOpacity style={styles.IconViewClass}>
                      <FontAwesome6
                        name="box-archive"
                        size={24}
                        color="black"
                      />
                    </TouchableOpacity>
                  </View>
                  <View
                    style={{
                      borderTopWidth: 1,
                      width: '100%',
                      borderColor: '#f7f0f7',
                    }}
                  />
                  <View style={styles.tableRow}>
                    <Text style={styles.tableCellLeft}>ID Donasi</Text>
                    <Text style={styles.tableCellRight}>
                      {item.Donation_ID}
                    </Text>
                  </View>
                  <View style={styles.tableRow}>
                    <Text style={styles.tableCellLeft}>Detail Penjemputan</Text>
                    <Text style={styles.tableCellRight}>
                      {item.Pickup_Details}
                    </Text>
                  </View>
                  <View style={styles.tableRow}>
                    <Text style={styles.tableCellLeft}>
                      Jam berapa dimasak?
                    </Text>
                    <Text style={styles.tableCellRight}>{item.Cook_Time}</Text>
                  </View>

                  <View style={styles.tableRow}>
                    <Text style={styles.tableCellLeft}>Jenis Makanan</Text>
                    <Text style={styles.tableCellRight}>
                      {item.Type_of_Food}
                    </Text>
                  </View>

                  <View style={styles.tableRow}>
                    <Text style={styles.tableCellLeft}>Keterangan</Text>
                    <Text style={styles.tableCellRight}>
                      {item.Additional_Information}
                    </Text>
                  </View>
                  <View style={styles.tableRow} paddingBottom={12}>
                    <Text style={styles.tableCellLeft}>
                      Telepon Rumah Makan
                    </Text>
                    <Text style={styles.tableCellRight}>
                      {item.Phone_Number}
                    </Text>
                  </View>

                  <View
                    style={styles.headerCard}
                    backgroundColor=""
                    textAlign="center"
                    paddingTop={20}>
                    <TouchableOpacity
                      onPress={() => handleConfirm(item.Donation_ID)}>
                      <Text style={styles.itemName}>Ambil Donasi</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      ) : (
        <View style={styles.content}>
          <Text style={{color: 'black'}}>Belum ada Donasi.</Text>
        </View>
      )}

      <View style={styles.footer}>
        <Text style={styles.footerText}>2023 © Unklab</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  header: {
    backgroundColor: '#F86F03',
    flexDirection: 'row',

    paddingTop: 5,
    paddingBottom: 5,
  },
  input: {
    fontSize: 20,
    height: 30,
    margin: 0,
    borderWidth: 1,
    color: 'black',
    borderColor: 'black',
    padding: 0,
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    top: -15,
  },
  headerText: {
    fontSize: 20,
    color: '#fff',
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    paddingTop: 15,
    paddingBottom: 10,
    paddingLeft: 10,
    paddingRight: 10,
  },
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 1,
  },
  tableCellLeft: {
    color: '#05375a',
    flex: 1,
    textAlign: 'left',
    fontSize: 12,
    marginTop: 5,
  },
  tableCellRight: {
    color: '#05375a',
    flex: 1,
    textAlign: 'right',
    fontSize: 11,
    marginTop: 5,
  },
  itemContainer: {
    flexDirection: 'row',
    //padding: 15,
    paddingBottom: 10,
    paddingTop: 15,
    paddingRight: 15,
    paddingLeft: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    elevation: 5,
    marginBottom: 15,
    marginLeft: 5,
    marginRight: 5,
    shadowOpacity: 0.5,
    shadowRadius: 3.84,
    borderRadius: 10,
    shadowColor: 'black',
  },
  headerCard: {
    //backgroundColor: '#7732a8',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 0,
    //paddingHorizontal: 16,
    //paddingTop: 16,
    paddingBottom: 10,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  IconViewClass: {
    position: 'relative',
    position: 'absolute',
    right: 5,
    //top: 17,
    paddingBottom: 10,
  },
  itemDetails: {
    marginLeft: 10,
    flex: 1,
  },
  itemName: {
    color: '#05375a',
    fontSize: 16,
    fontWeight: 'bold',
  },

  footer: {
    height: 25,
    alignItems: 'center',
    justifyContent: 'flex-start', // on top
    //backgroundColor: '#2c3e50',
    //justifyContent: 'center',
    marginTop: 5,
    marginBottom: 5,
  },

  footerText: {
    fontSize: 16,
    //color: '#fff',
    color: 'gray',
  },
  notificationIcon: {
    position: 'relative',
    position: 'absolute',
    right: 20,
    top: 17,
  },
});

export default AmbilDonasi;
