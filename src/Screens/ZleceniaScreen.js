import React, {useState, useEffect} from 'react';
import { Text, Button, SafeAreaView, StyleSheet, View, FlatList, Modal, TextInput, TouchableOpacity } from 'react-native';
import axios from 'axios';

export default ZleceniaScreen = () =>{

    const [zlecenia, setZlecenia] =useState([]); //Ustawienie stanów początkowych dla bazy zlecen
    const [modalVisible, setModalVisible] = useState(false);//Ustawienie stanu określającego widoczność modalu
    const [editModalVisible, setEditModalVisible] = useState(false); //Stan określajacy widocznośc modala edycji istniejacego zlecenia
    const [selectedZlecenie, setSelectedZlecenie] = useState(null); //Stan przechowujący informacje o aktualnie wybranym zleceniu
    //Stany przechowujące dane nowego zlecenia do dodania
    const [newZlecenieName, setNewZlecenieName] = useState('');
    const [newZlecenieOpis, setNewZlecenieOpis] = useState('');
    const [newZlecenieStatus, setNewZlecenieStatus] = useState('');

    //Funkcja która pobiera dane z serwera api ip_address:port/zlecenia_serwisowe
    //Testy zostały przeprowadzone na adresie 127.0.0.1 (localhost) oraz porcie 3000
    useEffect(()=>{
        //Zapytanie do serwera API za pomocą biblioteki axios
        axios.get('http://192.168.1.8:3000/zlecenia_serwisowe')
        //Zapisanie danych do stanu
        .then(response => setZlecenia(response.data))
        //Obsluga wyjątku w przypadku błędu przy pobieraniu danych
        .catch(error => console.log('Błąd pobierania danych', error))
    },[])

    //funcka która dodaje nowe zlecenie do bazy danych.
    const addZlecenie = () => {
        //Wysyłanie ządania POST z nowymi danymi zlecenia do serwera
        axios.post('http://192.168.1.8:3000/zlecenia_serwisowe', {
          nazwa: newZlecenieName,
          opis: newZlecenieOpis,
          status: newZlecenieStatus
        })
          .then(response => {
            // Po pomyślnym dodaniu zlecenia, pobranie zaktualizowanej listy zlecen z serwera
            axios.get('http://192.168.1.8:3000/zlecenia_serwisowe')
              .then(response => setZlecenia(response.data))
              .catch(error => console.log('Błąd pobierania danych', error))
          })
          .catch(error => console.log('Błąd dodawania zlecenia', error));
          // Zresetowanie pól stanu nowego zlecenia oraz ukrycie modala dodawania zlecenia
        setNewZlecenieName('');
        setNewZlecenieOpis('');
        setModalVisible(false);
      };

        // Funkcja edytująca istniejącego zlecenia w bazie danych
const editZlecenie = () => {
    // Wysłanie żądania PUT z zaktualizowanymi danymi zlecenia do serwera
    axios.put(`http://192.168.1.8:3000/zlecenia_serwisowe/${selectedZlecenie.id}`, {
      nazwa: newZlecenieName,
      opis: newZlecenieOpis,
      status: newZlecenieStatus
    })
      .then(response => {
        // Po pomyślnej edycji zlecenia, pobranie zaktualizowanej listy zlecen z serwera
        axios.get('http://192.168.1.8:3000/zlecenia_serwisowe')
          .then(response => setZlecenia(response.data))
          .catch(error => console.log('Błąd pobierania danych', error))
      })
      .catch(error => console.log('Błąd edycji zlecenia', error));
  
    // Zresetowanie pól stanu nowego zlecenia oraz ukrycie modala edycji zlecenia
    setNewZlecenieName('');
    setNewZlecenieOpis('');
    setNewZlecenieStatus('');
    setEditModalVisible(false);
  };
  
  //Usuwanie

// Funkcja obsługująca usunięcie zlecenia z bazy danych
const deleteZlecenie = (zleceniaId) => {
  // Wysłanie żądania DELETE do serwera, usuwając zlecenie o określonym ID
  axios.delete(`http://192.168.1.8:3000/zlecenia_serwisowe/${zleceniaId}`)
    .then(response => {
      // Po pomyślnym usunięciu zlecenia, pobranie zaktualizowanej listy zleceń z serwera
      axios.get('http://192.168.1.8:3000/zlecenia_serwisowe')
        .then(response => setZlecenia(response.data))
        .catch(error => console.log('Błąd pobierania danych', error))
    })
    .catch(error => console.log('Błąd usuwania zlecenia', error));

  // Ukrycie modala edycji klienta po zakończeniu operacji
  setEditModalVisible(false);
};



// Funkcja obsługująca naciśnięcie przycisku edycji zlecenia
const handleEditPress = (zlecenie) => {
    // Ustawienie aktualnie wybranego zlecenia oraz ustawienie danych tego zlecenia w polach edycji
    setSelectedZlecenie(zlecenie);
    setNewZlecenieName(zlecenie.nazwa);
    setNewZlecenieOpis(zlecenie.opis);
    setNewZlecenieStatus(zlecenie.status);
    setEditModalVisible(true);
  };
 

   // Komponent główny, renderujący interfejs zlecenia
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.textHeader}>{'Zlecenia'}</Text>
      <View style={styles.buttonContainer}>
        <Button title='Dodaj' color='#23A403' onPress={() => setModalVisible(true)} />
        <View style={styles.buttonSpacing} />
        <FlatList //Lista zlecen renderowana za pomocą komponentu FlatList
          data={zlecenia}
          renderItem={({ item }) => (
            //Każdy elemnt listy jest klikalny i uruchamia funkcję obsługujące edycje zlecenia.
            <TouchableOpacity onPress={() => handleEditPress(item)}>
              <Text style={styles.listItem}>{item.nazwa} - {item.status} </Text>
            </TouchableOpacity>
          )}
        />
      </View>
            
      <Modal //Modal do dodawania i edycji zlecenia.
        animationType="slide"
        transparent={true}
        visible={modalVisible || editModalVisible}
      >
        <View style={styles.modalContainer}>
          <Text style={styles.textHeader}>{editModalVisible ? 'Edytuj zlecenie' : 'Dodaj nowe zlecenie'}</Text> 
          <TextInput
            style={styles.input}
            placeholder='Nazwa'
            value={newZlecenieName}
            onChangeText={text => setNewZlecenieName(text)}
          />
          <TextInput
            style={styles.input}
            placeholder='Opis'
            value={newZlecenieOpis}
            onChangeText={text => setNewZlecenieOpis(text)}
          />
          <TextInput
            style={styles.input}
            placeholder='Status'
            value={newZlecenieStatus}
            onChangeText={text => setNewZlecenieStatus(text)}
          />

          {editModalVisible ?
            <>
              <Button title="Edytuj zlecenie" onPress={editZlecenie} />
              <Button title="Usuń zlecenie" onPress={() => deleteZlecenie(selectedZlecenie.id)} />
            </> :
            <Button title="Dodaj zlecenie" onPress={addZlecenie} />
          }
          <Button title="Zamknij" onPress={() => {
            setModalVisible(false);
            setEditModalVisible(false);
            setSelectedZlecenie(null);
            setNewZlecenieName('');
            setNewZlecenieOpis('');
            setNewZlecenieStatus('');
          }} />
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    buttonContainer: {
      marginTop: 5,
    },
    buttonSpacing: {
      marginVertical: 10,
    },
    listItem: {
      padding: 10,
      fontSize: 20,
      height: 50,
      backgroundColor: '#66B2FF',
      borderWidth: 5,
      borderColor: 'black',
      borderRadius: 20,
      margin: 2
    },
    textHeader: {
      fontSize: 30,
      textAlign: 'center'
    },
    modalContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0,0,0,0.5)'
    },
    input: {
      height: 40,
      width: '80%',
      borderColor: 'gray',
      borderWidth: 1,
      backgroundColor: 'white',
      marginVertical: 5,
      paddingLeft: 10
    }
  });