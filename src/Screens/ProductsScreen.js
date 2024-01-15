// Importowanie niezbędnych modułów z biblioteki react-native oraz axios.
import React, { useState, useEffect } from 'react';
import { Text, Button, SafeAreaView, StyleSheet, View, FlatList, Modal, TextInput, TouchableOpacity } from 'react-native';
import axios from 'axios';

// Komponent ProductsScreen odpowiadający za zarządzanie produktami
export default ProductsScreen = () => {
    // Stan przechowujący listę produktów.
    const [products, setProducts] = useState([]);
    // Stan określający widoczność modala.
    const [modalVisible, setModalVisible] = useState(false);
    // Stan przechowujący informacje o aktualnie wybranym produkcie (do edycji lub usuwania).
    const [selectedProduct, setSelectedProduct] = useState(null);
    // Stany przechowujące dane nowego produktu do dodania.
    const [newProductName, setNewProductName] = useState('');
    const [newProductDescription, setNewProductDescription] = useState('');

    // Funkcja, która pobiera dane z serwera API (adres IP: 192.168.0.164, port: 3000, endpoint: /produkty)
    useEffect(() => {
        axios.get('http://192.168.1.8:3000/produkty')  // Zmiana adresu IP na 192.168.0.164
            .then(response => setProducts(response.data))
            .catch(error => console.log('Błąd pobierania danych', error))
    }, []);

    // Funkcja dodająca nowy produkt do bazy danych.
    const addProduct = () => {
        const newProduct = {
            nazwa: newProductName,
            opis: newProductDescription,
        };

        axios.post('http://192.168.1.8:3000/produkty', newProduct)  // Zmiana adresu IP na 192.168.0.164
            .then(response => {
                setProducts([...products, response.data]);
                setModalVisible(false);
                setNewProductName('');
                setNewProductDescription('');
            })
            .catch(error => console.log('Błąd dodawania produktu', error));
    };

    // Funkcja usuwająca produkt z bazy danych.
    const deleteProduct = (productId) => {
        axios.delete(`http://192.168.1.8:3000/produkty/${productId}`)  // Zmiana adresu IP na 192.168.0.164
            .then(() => {
                setProducts(products.filter(product => product.id !== productId));
                setModalVisible(false);
            })
            .catch(error => console.log('Błąd usuwania produktu', error));
    };

    // Funkcja edytująca istniejący produkt w bazie danych.
    const editProduct = () => {
        const updatedProduct = {
            ...selectedProduct,
            nazwa: newProductName,
            opis: newProductDescription,
        };

        axios.put(`http://192.168.1.8:3000/produkty/${selectedProduct.id}`, updatedProduct)  // Zmiana adresu IP na 192.168.0.164
            .then(() => {
                const updatedProducts = products.map(product => (product.id === selectedProduct.id ? updatedProduct : product));
                setProducts(updatedProducts);
                setModalVisible(false);
                setNewProductName('');
                setNewProductDescription('');
                setSelectedProduct(null);
            })
            .catch(error => console.log('Błąd edycji produktu', error));
    };

    // Funkcja otwierająca modal edycji dla wybranego produktu.
    const openEditModal = (product) => {
        setSelectedProduct(product);
        setNewProductName(product.nazwa);
        setNewProductDescription(product.opis);
        setModalVisible(true);
    };

    // Funkcja renderująca element listy produktów.
    const renderItem = ({ item }) => (
        <TouchableOpacity onPress={() => openEditModal(item)}>
            <Text style={styles.listItem}>{item.nazwa}</Text>
        </TouchableOpacity>
    );

    // Komponent główny, renderujący interfejs użytkownika.
    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.textHeader}>{'Produkty'}</Text>
            <View style={styles.buttonContainer}>
                <Button title='Dodaj' color='#23A403' onPress={() => setModalVisible(true)} />
                <View style={styles.buttonSpacing} />
                <FlatList
                    data={products}
                    renderItem={renderItem}
                />
            </View>

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.inputContainer}>
                        <TextInput
                            style={styles.input}
                            placeholder="Nazwa produktu"
                            value={newProductName}
                            onChangeText={text => setNewProductName(text)}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Opis produktu"
                            value={newProductDescription}
                            onChangeText={text => setNewProductDescription(text)}
                        />
                        {selectedProduct ?
                            <>
                                <Button title="Edytuj produkt" onPress={editProduct} />
                                <Button title="Usuń produkt" color="red" onPress={() => deleteProduct(selectedProduct.id)} />
                            </> :
                            <Button title="Dodaj produkt" onPress={addProduct} />
                        }
                        <Button title="Anuluj" onPress={() => {
                            setModalVisible(false);
                            setSelectedProduct(null);
                            setNewProductName('');
                            setNewProductDescription('');
                        }} />
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
}

// Stylizacja komponentu
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
    inputContainer: {
        width: '80%',
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        backgroundColor: 'white',
        marginVertical: 5,
        paddingLeft: 10
    }
});
