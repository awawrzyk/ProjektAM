import React, { useState, useEffect } from 'react';
import { Text, Button, SafeAreaView, StyleSheet, View, FlatList, Modal, TextInput } from 'react-native';
import axios from 'axios';

export default UsersScreen = () => {
    const [users, setUsers] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [newLogin, setNewLogin] = useState('');
    const [newPassword, setNewPassword] = useState('');

    useEffect(() => {
        axios.get('http://192.168.1.195:3000/uzytkownicy')
            .then(response => setUsers(response.data))
            .catch(error => console.log('Błąd pobierania danych', error))
    }, [])

    const addUsers = () => {
        axios.post('http://192.168.1.195:3000/uzytkownicy', {
            login: newLogin,
            haslo: newPassword
        })
            .then(response => {
                axios.get('http://192.168.1.195:3000/uzytkownicy')
                    .then(response => setUsers(response.data))
                    .catch(error => console.log('Błąd pobierania danych', error))
            })
            .catch(error => console.log('Błąd dodawania użytkownika', error));

        setNewLogin('');
        setNewPassword('');
    }

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.textHeader}>{'Użytkownicy'}</Text>
            <View style={styles.buttonContainer}>
                <Button title='Dodaj' color='#23A403' onPress={() => setModalVisible(true)} />
                <View style={styles.buttonSpacing} />
                <FlatList
                    data={users}
                    renderItem={({ item }) => <Text style={styles.listItem}>{item.login} {item.haslo}</Text>}
                />
            </View>

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
            >
                <View style={styles.modalContainer}>
                    <Text style={styles.textHeader}>{'Dodaj nowego użytkownika'}</Text>
                    <TextInput
                        style={styles.input}
                        placeholder='Login'
                        value={newLogin}
                        onChangeText={text => setNewLogin(text)}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder='Hasło'
                        value={newPassword}
                        onChangeText={text => setNewPassword(text)}
                        secureTextEntry={true}
                    />
                    <Button title="Dodaj użytkownika" onPress={() => { addUsers(); setModalVisible(false) }} />
                    <Button title="Zamknij" onPress={() => setModalVisible(false)} />
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
