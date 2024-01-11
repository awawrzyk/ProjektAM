import React, {useState, useEffect} from 'react';
import {Text, Button, SafeAreaView, StyleSheet, View, FlatList, Modal, TextInput} from 'react-native';
import axios from 'axios';


export default CustomersScreen = () =>{

    const [customers, setCustomers] = useState([]); //Ustawienie stanów początkowych dla bazy klientów.
    const [modalVisible, setModalVisible] = useState(false); // Ustawienie stanu określającego widoczność modalu
    const [newCustomerName, setNewCustomerName] = useState(''); // Ustawienie stanu dla nowego imienia klienta
    const [newCustomerLastName, setNewCustomerLastName] = useState(''); // Ustawienie stanu dla nowego nazwiska klienta


    //Funkcja która pobiera dane z serwera api ip_address:port/klienci
    //Testy zostały przeprowadzone na adresie 127.0.0.1 (localhost) oraz porcie 3000
    useEffect(()=>{
        //Zapytanie do serwera API za pomocą biblioteki axios
        axios.get('http://192.168.1.8:3000/klienci')
        .then(response => setCustomers(response.data)) //Zapisanie danych do stanu
        .catch(error => console.log('Błąd pobierania danych', error)) //Obsługa wyjątku w przypadku błędu przy pobieraniu danych
    },[])

    // Funkcja która dodaje nowego kleitna do bazy danych
    const addCustomer = () => {
        axios.post('http://192.168.1.8:3000/klienci', {
            imie: newCustomerName,
            nazwisko: newCustomerLastName
        })
        .then(response => {
            axios.get('http://192.168.1.8:3000/klienci')
            .then(response => setCustomers(response.data))
            .catch(error => console.log('Błąd pobierania danych', error))
        })
        .catch(error => console.log('Błąd dodawania klienta', error));


        setNewCustomerName('');
        setNewCustomerLastName('');
    }


    return(
        <SafeAreaView style={styles.container}>
            <Text style={styles.textHeader}>{'Klienci'}</Text>
            <View style={styles.buttonContainer}>
                <Button title='Dodaj' color='#23A403' onPress={() => setModalVisible(true)} />
                <View style={styles.buttonSpacing} />
                <FlatList
                    data={customers} //Teraz są wrzucone dane testowe
                    renderItem={({item}) => <Text style={styles.listItem}>{item.imie} {item.nazwisko}</Text>}
                />
            </View>
            {/*Modal dodawania nowego klienta*/}
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
            >
                <View style={styles.modalContainer}>
                    <Text style={styles.textHeader}>{'Dodaj nowego klienta'}</Text>
                    <TextInput
                        style={styles.input}
                        placeholder='Imię'
                        value={newCustomerName}
                        onChangeText={text => setNewCustomerName(text)} // Zapisanie wprowadzononego imienia do stanu
                    />
                    <TextInput
                        style={styles.input}
                        placeholder='Nazwisko'
                        value={newCustomerLastName}
                        onChangeText={text => setNewCustomerLastName(text)} // Zapisanie wprowadzonego nazwiska do stanu
                    />
                    <Button title="Dodaj klienta" onPress={() => {addCustomer(); setModalVisible(false)}} /> {/* Przycisk dodający nowego klienta i zamykający modal*/}
                    <Button title="Zamknij" onPress={() => setModalVisible(false)} /> {/* Przycisk zamykający modal*/}
                </View>
            </Modal>
        </SafeAreaView>
    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    buttonContainer: {
        marginTop: 5,
    },
    buttonSpacing:{
        marginVertical: 10,
    },
    listItem:{
        padding: 10,
        fontSize: 20,
        height: 50,
        backgroundColor: '#66B2FF',
        borderWidth: 5,
        borderColor: 'black',
        borderRadius: 20,
        margin: 2
    },
    textHeader:{
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

