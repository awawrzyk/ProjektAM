import React from 'react';
import {Text,Button, SafeAreaView, StyleSheet, View, FlatList} from 'react-native';



export default ZleceniaScreen = () =>{
    return(
        <SafeAreaView style={styles.container}>
            <Text style={styles.textHeader}>{'Zlecenia'}</Text>
            <View style={styles.buttonContainer}>
                <Button title='Dodaj' color='#23A403' />
                <View style={styles.buttonSpacing} />
                <FlatList
                    data={[{key: 'Zlecenie 1'},{key: 'Zlecenie 2'},{key: 'Zlecenie 3'}]} //Teraz są wrzucone dane testowe
                    renderItem={({item}) => <Text style={styles.listItem}>{item.key}</Text>}
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