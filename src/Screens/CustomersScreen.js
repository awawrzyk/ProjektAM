import React, { useState, useEffect } from 'react';
import { Text, Button, SafeAreaView, StyleSheet, View, FlatList, Modal, TextInput, TouchableOpacity } from 'react-native';
import axios from 'axios';

export default CustomersScreen = () => {
  const [customers, setCustomers] = useState([]); //Ustawienie stanów początkowych dla bazy klientów.
  const [modalVisible, setModalVisible] = useState(false); //Ustawienie stanu określającego widoczność modalu
  const [editModalVisible, setEditModalVisible] = useState(false); // Stan określający widocznosć modala edycji istniejącego klienta.
  const [selectedCustomer, setSelectedCustomer] = useState(null); // Stan przechowujący informacje o aktualnie wybranym klience( do edycji lub usuwania.)
 //Stany przechowujące dane nowego klienta do dodania.
  const [newCustomerName, setNewCustomerName] = useState('');
  const [newCustomerLastName, setNewCustomerLastName] = useState('');
  const [newCustomerEmail, setNewCustomerEmail] = useState('');
  //Funkcja która pobiera dane z serwera api ip_address:port/klienci
    //Testy zostały przeprowadzone na adresie 127.0.0.1 (localhost) oraz porcie 3000
  useEffect(() => {
    //Zapytanie do serwera API za pomocą biblioteki axios
    axios.get('http://192.168.206.48:3000/klienci')
    //Zapisanie danych do stanu
      .then(response => setCustomers(response.data))
      //Obsługa wyjątku w przypadku błędu przy pobieraniu danych
      .catch(error => console.log('Błąd pobierania danych', error));
  }, []);

  //funkcja która dodaje nowego klienta do bazy danych.
  const addCustomer = () => {
    //Wysyłanie ządania POST z nowymi danymi klienta do serwera
    axios.post('http://192.168.206.48:3000/klienci', {
      imie: newCustomerName,
      nazwisko: newCustomerLastName,
      email: newCustomerEmail
    })
      .then(response => {
        // Po pomyślnym dodaniu klienta, pobranie zaktualizowanej listy klientów z serwera
        axios.get('http://192.168.206.48:3000/klienci')
          .then(response => setCustomers(response.data))
          .catch(error => console.log('Błąd pobierania danych', error))
      })
      .catch(error => console.log('Błąd dodawania klienta', error));
      // Zresetowanie pól stanu nowego klienta oraz ukrycie modala dodawania klienta
    setNewCustomerName('');
    setNewCustomerLastName('');
    setNewCustomerEmail('');
    setModalVisible(false);
  };
  
  // Funkcja edytująca istniejącego klienta w bazie danych
const editCustomer = () => {
  // Wysłanie żądania PUT z zaktualizowanymi danymi klienta do serwera
  axios.put(`http://192.168.206.48:3000/klienci/${selectedCustomer.id}`, {
    imie: newCustomerName,
    nazwisko: newCustomerLastName,
    email: newCustomerEmail
  })
    .then(response => {
      // Po pomyślnej edycji klienta, pobranie zaktualizowanej listy klientów z serwera
      axios.get('http://192.168.206.48:3000/klienci')
        .then(response => setCustomers(response.data))
        .catch(error => console.log('Błąd pobierania danych', error))
    })
    .catch(error => console.log('Błąd edycji klienta', error));

  // Zresetowanie pól stanu nowego klienta oraz ukrycie modala edycji klienta
  setNewCustomerName('');
  setNewCustomerLastName('');
  setNewCustomerEmail('');
  setEditModalVisible(false);
};

// Funkcja obsługująca usunięcie klienta z bazy danych
const deleteCustomer = (customerId) => {
  // Wysłanie żądania DELETE do serwera, usuwając klienta o określonym ID
  axios.delete(`http://192.168.206.48:3000/klienci/${customerId}`)
    .then(response => {
      // Po pomyślnym usunięciu klienta, pobranie zaktualizowanej listy klientów z serwera
      axios.get('http://192.168.206.48:3000/klienci')
        .then(response => setCustomers(response.data))
        .catch(error => console.log('Błąd pobierania danych', error))
    })
    .catch(error => console.log('Błąd usuwania klienta', error));

  // Ukrycie modala edycji klienta po zakończeniu operacji
  setEditModalVisible(false);
};

// Funkcja obsługująca naciśnięcie przycisku edycji klienta
const handleEditPress = (customer) => {
  // Ustawienie aktualnie wybranego klienta oraz ustawienie danych tego klienta w polach edycji
  setSelectedCustomer(customer);
  setNewCustomerName(customer.imie);
  setNewCustomerLastName(customer.nazwisko);
  setNewCustomerEmail(customer.email);
  setEditModalVisible(true);
};

// Komponent główny, renderujący interfejs klienta
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.textHeader}>{'Klienci'}</Text>
      <View style={styles.buttonContainer}>
        <Button title='Dodaj' color='#23A403' onPress={() => setModalVisible(true)} />
        <View style={styles.buttonSpacing} />
        <FlatList //Lista klientów renderowana za pomocą komponentu FlatList
          data={customers}
          renderItem={({ item }) => (
            //Każdy elemnt listy jest klikalny i uruchamia funkcję obsługujące edycje klienta.
            <TouchableOpacity onPress={() => handleEditPress(item)}>
              <Text style={styles.listItem}>{item.imie} {item.nazwisko}</Text>
            </TouchableOpacity>
          )}
        />
      </View>
            
      <Modal //Modal do dodawania i edycji klientów.
        animationType="slide"
        transparent={true}
        visible={modalVisible || editModalVisible}
      >
        <View style={styles.modalContainer}>
          <Text style={styles.textHeader}>{editModalVisible ? 'Edytuj klienta' : 'Dodaj nowego klienta'}</Text> 
          <TextInput
            style={styles.input}
            placeholder='Imię'
            value={newCustomerName}
            onChangeText={text => setNewCustomerName(text)}
          />
          <TextInput
            style={styles.input}
            placeholder='Nazwisko'
            value={newCustomerLastName}
            onChangeText={text => setNewCustomerLastName(text)}
          />
          <TextInput
            style={styles.input}
            placeholder='e-mail'
            value={newCustomerEmail}
            onChangeText={text => setNewCustomerEmail(text)}
          />
          {editModalVisible ?
            <>
              <Button title="Edytuj klienta" onPress={editCustomer} />
              <Button title="Usuń klienta" onPress={() => deleteCustomer(selectedCustomer.id)} />
            </> :
            <Button title="Dodaj klienta" onPress={addCustomer} />
          }
          <Button title="Zamknij" onPress={() => {
            setModalVisible(false);
            setEditModalVisible(false);
            setSelectedCustomer(null);
            setNewCustomerName('');
            setNewCustomerLastName('');
            setNewCustomerEmail('');
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
