import React, {useState, useEffect} from 'react';
import {Text,Button, SafeAreaView, StyleSheet, View, FlatList} from 'react-native';
import axios from 'axios';



export default CustomersScreen = () =>{

    const [customers, setCustomers] = useState([]) //Ustawienie stanów początkowych dla bazy klientów

    //Funkcja która pobiera dane z serwera api ip_address:port/klienci
    //Testy zostały przeprowadzone na adresie 127.0.0.1 (localhost) oraz porcie 3000
    useEffect(()=>{
        //Zapytanie do serwera API za pomocą biblioteki axios
        axios.get('http://192.168.0.37:3000/klienci')
        .then(response => setCustomers(response.data)) //Zapisanie danych do stanu
        .catch(error => console.log('Błąd pobierania danych', error)) //Obsługa wyjątku w przypadku błędu przy pobieraniu danych
    },[])

    return(
        <SafeAreaView style={styles.container}>
            <Text style={styles.textHeader}>{'Klienci'}</Text>
            <View style={styles.buttonContainer}>
                <Button title='Dodaj' color='#23A403' />
                <View style={styles.buttonSpacing} />
                <FlatList 
                    data={customers} //Teraz są wrzucone dane testowe
                    renderItem={({item}) => <Text style={styles.listItem}>{item.imie} {item.nazwisko}</Text>}
                />
            </View>
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
    }
});