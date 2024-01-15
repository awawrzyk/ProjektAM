import React, { useState, useEffect } from 'react';
import { Text, Button, SafeAreaView, StyleSheet, View, FlatList, Modal, TextInput, TouchableOpacity } from 'react-native';
import axios from 'axios';

export default UsersScreen = () => {
    const [users, setUsers] = useState([]);//Ustawienie stanów początkowych dla bazy uzytkownikow.
    const [modalVisible, setModalVisible] = useState(false);//Ustawienie stanu określającego widoczność modalu
    const [editModalVisible,setEditModalVisible] = useState(false);// Stan określający widocznosć modala edycji istniejącego użytkownika.
    const [selectedUser, setSelectedUser] = useState(null);// Stan przechowujący informacje o aktualnie wybranym uzytkowniku( do edycji lub usuwania.)
    //Stany przechowujące dane nowego klienta do dodania.
    const [newUserLogin, setNewUserLogin] = useState('');
    const [newUserPassword, setNewUserPassword] = useState('');
 //Funkcja która pobiera dane z serwera api ip_address:port/uzytkownicy
    //Testy zostały przeprowadzone na adresie 127.0.0.1 (localhost) oraz porcie 3000
    useEffect(() => {
            //Zapytanie do serwera API za pomocą biblioteki axios
        axios.get('http://192.168.1.8:3000/uzytkownicy')
            //Zapisanie danych do stanu
            .then(response => setUsers(response.data))
            //Obsługa wyjątku w przypadku błędu przy pobieraniu danych
            .catch(error => console.log('Błąd pobierania danych', error))
    }, [])

    //funkcja która dodaje nowego uzytkownika
    const addUser = () => {
        //wysyłanie zadania POST z nowymi danymi uzytkownika do serwera
        axios.post('http://192.168.1.8:3000/uzytkownicy', {
            login: newUserLogin,
            haslo: newUserPassword
        })
            .then(response => {
                // Po pomyślnym dodaniu klienta, pobranie zaktualizowanej listy klientów z serwera
                axios.get('http://192.168.1.8:3000/uzytkownicy')
                    .then(response => setUsers(response.data))
                    .catch(error => console.log('Błąd pobierania danych', error))
            })
            .catch(error => console.log('Błąd dodawania użytkownika', error));
            
        // Zresetowanie pól stanu nowego klienta oraz ukrycie modala dodawania klienta
        setNewUserLogin('');
        setNewUserPassword('');
        setModalVisible(false);
    }

 // Funkcja edytująca istniejącego uzytkownika w bazie danych
 const editUser = () => {
    // Wysłanie żądania PUT z zaktualizowanymi danymi klienta do serwera
    axios.put(`http://192.168.1.8:3000/uzytkownicy/${selectedUser.id}`, {
      Login: newUserLogin,
      Haslo: newUserPassword
    })
      .then(response => {
        // Po pomyślnej edycji klienta, pobranie zaktualizowanej listy uzytkownikow z serwera
        axios.get('http://192.168.1.8:3000/uzytkownicy')
          .then(response => setUsers(response.data))
          .catch(error => console.log('Błąd pobierania danych', error))
      })
      .catch(error => console.log('Błąd edycji uzytkownika', error));
    // Zresetowanie pól stanu nowego klienta oraz ukrycie modala edycji klienta
    setNewUserLogin('');
    setNewUserPassword('');
    setEditModalVisible(false);
  };

// Funkcja obsługująca usunięcie klienta z bazy danych
const deleteUser = (userId) => {
    // Wysłanie żądania DELETE do serwera, usuwając uzytkownika o określonym ID
    axios.delete(`http://192.168.1.8:3000/uzytkownicy/${userId}`)
      .then(response => {
        // Po pomyślnym usunięciu klienta, pobranie zaktualizowanej listy klientów z serwera
        axios.get('http://192.168.1.8:3000/uzytkownicy')
          .then(response => setUsers(response.data))
          .catch(error => console.log('Błąd pobierania danych', error))
      })
      .catch(error => console.log('Błąd usuwania uzytkownika', error));
  
    // Ukrycie modala edycji klienta po zakończeniu operacji
    setEditModalVisible(false);
  };

  // Funkcja obsługująca naciśnięcie przycisku edycji uzytkownika
const handleEditPress = (user) => {
    // Ustawienie aktualnie wybranego uzytkownika oraz ustawienie danych tego uzytkownika w polach edycji
    setSelectedUser(user);
    setNewUserLogin(user.login);
    setNewUserPassword(user.password);
    setEditModalVisible(true);
  };

// Komponent główny, renderujący interfejs użytkownika
return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.textHeader}>{'Uzytkownicy'}</Text>
      <View style={styles.buttonContainer}>
        <Button title='Dodaj' color='#23A403' onPress={() => setModalVisible(true)} />
        <View style={styles.buttonSpacing} />
        <FlatList //Lista uzytkownikow renderowana za pomocą komponentu FlatList
          data={users}
          renderItem={({ item }) => (
            //Każdy elemnt listy jest klikalny i uruchamia funkcję obsługujące edycje uzytkownika.
            <TouchableOpacity onPress={() => handleEditPress(item)}>
              <Text style={styles.listItem}>{item.login} {item.password}</Text>
            </TouchableOpacity>
          )}
        />
      </View>
            
      <Modal //Modal do dodawania i edycji uzytkownikow.
        animationType="slide"
        transparent={true}
        visible={modalVisible || editModalVisible}
      >
        <View style={styles.modalContainer}>
          <Text style={styles.textHeader}>{editModalVisible ? 'Edytuj uzytkownika' : 'Dodaj nowego uzytkownika'}</Text> 
          <TextInput
            style={styles.input}
            placeholder='Login'
            value={newUserLogin}
            onChangeText={text => setNewUserLogin(text)}
          />
          <TextInput
            style={styles.input}
            placeholder='Haslo'
            value={newUserPassword}
            onChangeText={text => setNewUserPassword(text)}
            />
          {editModalVisible ?
            <>
              <Button title="Edytuj uzytkownika" onPress={editUser} />
              <Button title="Usuń uzytkownika" onPress={() => deleteUser(selectedUser.id)} />
            </> :
            <Button title="Dodaj uzytkownika" onPress={addUser} />
          }
          <Button title="Zamknij" onPress={() => {
            setModalVisible(false);
            setEditModalVisible(false);
            setSelectedUser(null);
            setNewUserLogin('');
            setNewUserPassword('');
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
